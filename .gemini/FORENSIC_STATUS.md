# FORENSIC DEBUGGING - CURRENT STATUS

## ✅ COMPLETED ACTIONS

### 1. Instrumented API Route
**File**: `app/api/register/route.ts`

**Added logging for:**
- Client initialization and type verification
- Runtime database role check (via `get_current_role()` RPC)
- Every SELECT operation
- Every INSERT operation (users and applicants)
- Every UPDATE operation
- Detailed error capture with full error object

**Log format:**
```
🔍 [FORENSIC] - System diagnostics
🔍 [DB_OP] - Database operations
✅ [DB_SUCCESS] - Successful operations
❌ [DB_ERROR] - Failed operations with full details
```

### 2. Created Diagnostic SQL Script
**File**: `.gemini/forensic_db_check.sql`

**Checks:**
- RLS status on applicants table
- All RLS policies (INSERT, UPDATE, SELECT, DELETE)
- All constraints (PK, FK, CHECK, UNIQUE)
- DEFAULT values with function calls
- GENERATED columns
- All triggers and their SECURITY mode
- Foreign key relationships and cascade rules

### 3. Created Test Script
**File**: `.gemini/test_registration.js`

**Purpose**: Trigger registration with unique test data to capture forensic logs

### 4. Created Investigation Protocol
**File**: `.gemini/FORENSIC_PROTOCOL.md`

**Contains:**
- 5-phase investigation sequence
- Hypothesis testing framework
- Evidence collection checklist
- Manual SQL test queries
- Deliverable format

---

## 🎯 NEXT ACTIONS REQUIRED

### IMMEDIATE - Run Database Diagnostics

**Step 1**: Open Supabase SQL Editor

**Step 2**: Copy and run `.gemini/forensic_db_check.sql`

**Step 3**: Save ALL output to a text file

**Critical information to capture:**
- Does `public_insert_applicants` policy exist?
- What is the policy definition?
- Are there any triggers on applicants table?
- What is their SECURITY mode (DEFINER vs INVOKER)?

---

### IMMEDIATE - Create Runtime Role Function

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

**Why**: This allows the instrumented code to check the runtime role during execution

**Note**: Uses `db_role` instead of `current_role` (PostgreSQL reserved identifier)

---

### IMMEDIATE - Execute Test Registration

**Step 1**: Ensure dev server is running
```bash
npm run dev
```

**Step 2**: In a new terminal, run:
```bash
node .gemini/test_registration.js
```

**Step 3**: Watch the dev server console for forensic logs

**Step 4**: Capture the COMPLETE log output

---

## 🔬 WHAT WE'RE LOOKING FOR

### Critical Evidence Points

#### 1. Runtime Role Verification
**Expected**: `current_role = 'anon'`
**If different**: Client configuration issue

#### 2. Exact Failing Operation
**Expected**: One of these will show `❌ [DB_ERROR]`
- INSERT users
- INSERT applicants
- UPDATE applicants
- INSERT referrals

#### 3. Error Details
**Will capture**:
- Error code (should be 42501)
- Error message
- Error details
- Error hint
- Full error object

#### 4. Payload at Failure
**Will show**:
- All payload keys
- Sanitized payload values
- User ID and Specialization ID

---

## 🚨 KNOWN CONSTRAINTS

### From Previous Context:
1. ✅ INSERT + UPDATE policies for role=anon exist (in migration files)
2. ✅ Trigger issue already fixed (SECURITY DEFINER)
3. ✅ Manual SQL INSERT + UPDATE works
4. ❌ Error only occurs via API runtime

### This Suggests:
- **NOT** a missing policy issue
- **NOT** a trigger security context issue
- **LIKELY** one of:
  - Policy not actually applied to database
  - Runtime role is different than expected
  - Implicit database action (FK, CHECK, DEFAULT) failing
  - Column-level RLS or special constraint

---

## 📊 HYPOTHESIS PRIORITY

### Hypothesis A: Policy Not Applied (HIGHEST)
**Probability**: 70%
**Test**: Check forensic_db_check.sql output for policy existence
**Evidence needed**: Policy list from pg_policies

### Hypothesis B: Wrong Runtime Role (HIGH)
**Probability**: 20%
**Test**: Check forensic logs for runtime role
**Evidence needed**: get_current_role() output

### Hypothesis C: Implicit Constraint Violation (MEDIUM)
**Probability**: 8%
**Test**: Check forensic_db_check.sql for constraints
**Evidence needed**: Constraint definitions

### Hypothesis D: Column-Level RLS (LOW)
**Probability**: 2%
**Test**: Check for column-specific policies
**Evidence needed**: Advanced RLS policy inspection

---

## ⏭️ AFTER EVIDENCE COLLECTION

Once we have:
1. ✅ Database diagnostic output
2. ✅ Test registration forensic logs
3. ✅ Runtime role confirmation
4. ✅ Exact failing statement

**THEN** we can:
1. Identify root cause with certainty
2. Provide minimal surgical fix
3. Validate fix before applying
4. Document the resolution

---

## 🎬 READY TO PROCEED

**Your action items:**

1. **Run** `.gemini/forensic_db_check.sql` in Supabase SQL Editor
2. **Create** `get_current_role()` function in Supabase
3. **Execute** `node .gemini/test_registration.js`
4. **Capture** all output from steps 1-3
5. **Share** the captured output

**I will then:**
- Analyze the evidence
- Identify the exact root cause
- Provide proven, minimal fix
- No assumptions, only evidence-based conclusions

---

## 📝 STATUS

```
[ ] Phase 1: Database diagnostics - WAITING FOR USER
[ ] Phase 2: Runtime role function - WAITING FOR USER  
[ ] Phase 3: Test execution - WAITING FOR USER
[ ] Phase 4: Evidence analysis - PENDING
[ ] Phase 5: Root cause proven - PENDING
[ ] Phase 6: Fix validated - PENDING
```

**Current state**: INSTRUMENTATION COMPLETE, AWAITING EVIDENCE COLLECTION
