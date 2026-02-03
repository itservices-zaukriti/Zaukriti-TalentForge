# 🎯 ROOT CAUSE FOUND - RLS Policy Missing

## ❌ The Error

```
Error code: 42501
Error message: new row violates row-level security policy for table "applicants"
```

## 🔍 Root Cause

**Row Level Security (RLS) is enabled on the `applicants` table, but there's NO policy allowing anonymous users to INSERT.**

When your code tries to insert using the `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Supabase checks for an RLS policy that allows the `public` role to INSERT. Since no such policy exists (or it wasn't applied), the INSERT is rejected.

## ✅ The Fix

**Run this SQL in Supabase Dashboard:**

📄 File: `.gemini/FIX_RLS_POLICY_NOW.sql`

This will:
1. Enable RLS on applicants table
2. Drop any existing conflicting policies
3. Create new policies allowing `public` role to:
   - INSERT (for registration)
   - UPDATE (for payment updates)
   - SELECT (for reading data)

## 📋 Steps to Apply

1. **Open Supabase Dashboard** → SQL Editor
2. **Copy the entire contents** of `.gemini/FIX_RLS_POLICY_NOW.sql`
3. **Paste and RUN**
4. **Verify** you see output showing 3 policies created:
   - `public_insert_applicants` | INSERT
   - `public_update_applicants` | UPDATE
   - `public_select_applicants` | SELECT

## 🧪 Test After Applying

```bash
node .gemini/test_registration_v2.js
```

**Expected result:**
```
✅ REQUEST SUCCEEDED
Applicant ID: <uuid>
```

---

## 💡 Why This Happened

The migration files exist in your codebase:
- `supabase/migrations/20260202_fix_rls.sql`
- `supabase/migrations/20260203_fix_applicants_rls_update.sql`

But they were **never applied to the live database**. Migrations don't auto-apply - they need to be manually run in Supabase or pushed via Supabase CLI.

---

## 🎯 Summary

1. ✅ Column names are correct (`linkedin`, `resume_url`)
2. ✅ All 26 fields exist in database
3. ❌ RLS policies are missing → **FIX THIS NOW**
4. ✅ Code is correct and ready to work

**Action:** Run `FIX_RLS_POLICY_NOW.sql` in Supabase Dashboard!
