# FORENSIC DEBUGGING PROTOCOL
## RLS Policy Violation Investigation

---

## EXECUTION SEQUENCE

### PHASE 1: Database Diagnostics (Run First)

1. **Open Supabase SQL Editor**
2. **Run**: `.gemini/forensic_db_check.sql`
3. **Capture ALL output** - save to a text file

**What to look for:**
- RLS STATUS: Should show `rls_enabled = true`
- RLS POLICIES: Should show policies for INSERT and UPDATE
- TRIGGERS: Check if any triggers exist and their SECURITY mode
- DEFAULT VALUES: Check for any function calls in defaults
- FOREIGN KEYS: Note any FK constraints

---

### PHASE 2: Create Runtime Role Check Function

**Run this in Supabase SQL Editor:**

```sql
-- FIXED: Using db_role instead of current_role (reserved identifier)
CREATE OR REPLACE FUNCTION get_current_role()
RETURNS TABLE (
    current_user_name text,
    db_role text,
    session_user_name text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        current_user::text,
        current_setting('request.jwt.claim.role', true)::text,
        session_user::text;
END;
$$;

GRANT EXECUTE ON FUNCTION get_current_role() TO anon, authenticated, public;
```

**Note**: We use `db_role` instead of `current_role` because `current_role` is a PostgreSQL reserved identifier.

---

### PHASE 3: Trigger Test Registration

1. **Ensure dev server is running**: `npm run dev`
2. **Run test script**: `node .gemini/test_registration.js`
3. **Watch server console** for forensic logs

**Expected log sequence:**
```
🔍 [FORENSIC] Client initialized
   Key prefix: eyJhbGciOiJI...
   Client type: ANON

🔍 [FORENSIC] Checking runtime database role...
   Runtime role check result: { current_user_name: '...', current_role: '...', ... }

🔍 [DB_OP] SELECT users | client=anon | filter=email/phone

🔍 [DB_OP] INSERT users | client=anon | payload_keys=[full_name, email, phone]
✅ [DB_SUCCESS] INSERT users | id: ...

🔍 [CRITICAL] About to INSERT into applicants table
   Client type: ANON
   User ID: ...
   Specialization ID: ...

🔍 [DB_OP] INSERT applicants | client=anon
   Payload keys: [...]
   Payload values (sanitized): {...}

[EITHER]
✅ [DB_SUCCESS] INSERT applicants | id: ...
[OR]
❌ [DB_ERROR] INSERT applicants FAILED
   Error code: 42501
   Error message: new row violates row-level security policy for table "applicants"
   ...
```

---

### PHASE 4: Evidence Collection

**If INSERT applicants FAILS, capture:**

1. **Runtime role** from forensic logs
2. **Exact payload** that was sent
3. **Error code and message**
4. **All constraint/trigger info** from Phase 1

---

### PHASE 5: Hypothesis Testing

Once we have the failure evidence, test these hypotheses:

#### Hypothesis A: Policy Not Applied
**Test**: Check Phase 1 output for RLS POLICIES
**Expected**: Should see `public_insert_applicants` with `WITH CHECK (true)`
**If missing**: Policy needs to be created

#### Hypothesis B: Wrong Role
**Test**: Check runtime role from forensic logs
**Expected**: Should be `anon` or `public`
**If different**: Client configuration issue

#### Hypothesis C: Trigger with Wrong Security Context
**Test**: Check Phase 1 TRIGGERS output
**Expected**: Triggers should be `SECURITY DEFINER` or not exist
**If SECURITY INVOKER**: Trigger executes as anon role and may fail RLS

#### Hypothesis D: Foreign Key Constraint Violation
**Test**: Check if `user_id` or `specialization_id` exist in their tables
**Expected**: Both should exist (users is created earlier, spec is queried)
**If missing**: Data integrity issue

#### Hypothesis E: Check Constraint Violation
**Test**: Check Phase 1 CONSTRAINT CHECK output
**Expected**: No CHECK constraints that would fail
**If exists**: Constraint may be rejecting the insert

#### Hypothesis F: Column-Level RLS
**Test**: Check if any columns have special RLS policies
**Expected**: Standard table-level RLS only
**If column-level**: May need column-specific policies

---

## CRITICAL QUESTIONS TO ANSWER

### Question 1: Which exact operation fails?
- [ ] INSERT into users
- [ ] INSERT into applicants
- [ ] UPDATE applicants
- [ ] INSERT into referrals

### Question 2: What is the runtime role?
- [ ] anon
- [ ] authenticated
- [ ] postgres
- [ ] Other: ___________

### Question 3: Do RLS policies exist?
- [ ] Yes, for INSERT
- [ ] Yes, for UPDATE
- [ ] No policies found
- [ ] Policies exist but wrong role

### Question 4: Are there triggers?
- [ ] No triggers
- [ ] Triggers with SECURITY DEFINER
- [ ] Triggers with SECURITY INVOKER
- [ ] Triggers calling functions that check RLS

### Question 5: What does manual SQL INSERT show?

**Run this in Supabase SQL Editor:**

```sql
-- Test as anon role
SET ROLE anon;

INSERT INTO applicants (
    user_id,
    specialization_id,
    full_name,
    email,
    phone,
    track,
    payment_status,
    team_size,
    is_team_lead,
    amount_paid,
    base_amount,
    discount_amount,
    gst_amount
) VALUES (
    (SELECT id FROM users LIMIT 1), -- Use existing user
    (SELECT id FROM specializations WHERE code = 'AI' LIMIT 1),
    'Manual Test',
    'manual.test@example.com',
    '9999999999',
    'ai-ml',
    'Pending',
    1,
    true,
    942,
    799,
    0,
    143
) RETURNING id;

-- Reset role
RESET ROLE;
```

**Result:**
- [ ] SUCCESS - Manual insert works
- [ ] FAILURE - Same RLS error
- [ ] FAILURE - Different error: ___________

---

## DELIVERABLE FORMAT

After completing all phases, provide:

```
ROOT CAUSE: [Single sentence]

FAILING STATEMENT: [Exact SQL or Supabase call]

RLS REJECTION REASON: [Why WITH CHECK(true) is not sufficient]

EVIDENCE:
- Runtime role: [value]
- Policy exists: [yes/no]
- Policy definition: [SQL]
- Trigger security: [DEFINER/INVOKER/NONE]
- Manual SQL result: [SUCCESS/FAILURE]

MINIMAL FIX: [Surgical change only]
```

---

## STATUS TRACKING

- [ ] Phase 1: Database diagnostics completed
- [ ] Phase 2: Runtime role function created
- [ ] Phase 3: Test registration executed
- [ ] Phase 4: Evidence collected
- [ ] Phase 5: Hypothesis tested
- [ ] Root cause proven with evidence
- [ ] Fix validated before applying

---

## NEXT STEPS

**DO NOT PROCEED TO FIX UNTIL:**
1. ✅ Exact failing statement identified
2. ✅ Runtime role confirmed
3. ✅ Policy status verified
4. ✅ Trigger/constraint behavior understood
5. ✅ Manual SQL test result obtained

**ONLY THEN** propose the minimal, surgical fix.
