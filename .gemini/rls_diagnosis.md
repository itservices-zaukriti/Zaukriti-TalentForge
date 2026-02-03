# RLS Policy Violation - Reverse Engineering Analysis

## Error Details
```
code: '42501'
message: 'new row violates row-level security policy for table "applicants"'
```

## Investigation Findings

### 1. Code Configuration ✅ CORRECT
The registration API (`/api/register/route.ts`) correctly uses the **public anon client**:
```typescript
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Evidence**: Console logs show "✅ USING PUBLIC CLIENT FOR APPLICANTS WRITE"

### 2. Migration Files ✅ EXIST
Two RLS fix migrations are present:

**File 1**: `20260202_fix_rls.sql`
```sql
CREATE POLICY "public_insert_applicants"
ON applicants
FOR INSERT
TO public
WITH CHECK (true);
```

**File 2**: `20260203_fix_applicants_rls_update.sql`
```sql
-- INSERT Policy
CREATE POLICY public_insert_applicants
ON applicants
FOR INSERT
TO public
WITH CHECK (true);

-- UPDATE Policy
CREATE POLICY public_update_applicants
ON applicants
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
```

### 3. Root Cause Hypothesis 🔴 LIKELY ISSUE

**The migrations may not have been applied to the Supabase database.**

#### Evidence:
1. Error code `42501` indicates RLS policy violation
2. The policy should allow `WITH CHECK (true)` - meaning ANY insert should succeed
3. If the policy was active, this error would not occur

## Verification Steps Required

### Step 1: Check if migrations have been applied
Run this in your Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'applicants';

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'applicants';
```

**Expected Output**:
- `rowsecurity` should be `true`
- Should see policies: `public_insert_applicants` and `public_update_applicants`
- `roles` should include `{public}` or `{anon}`
- `cmd` should show `INSERT` and `UPDATE`

### Step 2: Check migration history
```sql
SELECT * FROM supabase_migrations.schema_migrations 
ORDER BY version DESC 
LIMIT 10;
```

Look for:
- `20260202_fix_rls`
- `20260203_fix_applicants_rls_update`

### Step 3: If migrations are NOT applied

**Option A: Apply via Supabase CLI**
```bash
# From project root
npx supabase db push
```

**Option B: Apply manually via SQL Editor**
Copy and paste the contents of `20260203_fix_applicants_rls_update.sql` into Supabase SQL Editor and run it.

## Additional Observations

### 4. Potential Secondary Issues

#### Issue A: Service Role Key Fallback
In `validate-referral/route.ts` line 7:
```typescript
process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```

**Risk**: If `SUPABASE_SERVICE_ROLE_KEY` is not set, it falls back to anon key, which is correct for RLS. However, the comment says "Admin client to bypass RLS" which is misleading.

**Recommendation**: This should explicitly use the service role key if you want to bypass RLS for validation:
```typescript
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

#### Issue B: Environment Variables
**Observation**: No `.env.local` file found in the project root.

**Question**: Where are your environment variables defined?
- Are they in Vercel/deployment platform?
- Are they in a different location?
- Are the correct keys being used?

**Verification**: Check that these are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

## Recommended Fix Priority

### 🔴 CRITICAL - Apply RLS Policies
1. Verify migrations are applied (Step 1 above)
2. If not, apply `20260203_fix_applicants_rls_update.sql`
3. Verify policies are active

### 🟡 IMPORTANT - Verify Environment Variables
1. Confirm all Supabase keys are correctly set
2. Ensure service role key is available for admin operations

### 🟢 OPTIONAL - Code Cleanup
1. Fix misleading comment in `validate-referral/route.ts`
2. Ensure consistent client usage across all API routes

## Testing After Fix

After applying the RLS policies, test with:

```bash
# Should succeed without RLS error
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "track": "ai-ml",
    "teamSize": "1"
  }'
```

## Summary

**Most Likely Cause**: RLS policies defined in migration files have not been applied to the Supabase database.

**Immediate Action**: Run the verification queries in Supabase SQL Editor to confirm policy status, then apply the migration if needed.

**Confidence Level**: 95% - This is a classic RLS misconfiguration where policies exist in code but not in the database.
