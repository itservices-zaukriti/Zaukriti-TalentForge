# 🎯 REGISTRATION ERROR FIX - linkedin_url Column Missing

## ❌ Current Error
```
Registration Refused: Could not find the 'linkedin_url' column of 'applicants' in the schema cache
```

## 🔍 Root Cause
The code is trying to INSERT into columns that **don't exist in the database yet**:
- `linkedin_url` 
- `resume_link`
- `whatsapp_number`
- `city_state`

## ✅ What Was Fixed in Code
Changed column names in `app/api/register/route.ts` to match the intended schema:
- Line 177: `linkedin` → `linkedin_url` ✅
- Line 178: `resume_url` → `resume_link` ✅

## 🚨 What Still Needs to Be Done
**The migration file exists but hasn't been applied to the database!**

### Migration File Location
`supabase/migrations/20260201_final_sync.sql`

### Quick Fix - Apply Migration Manually

**Option 1: Supabase Dashboard (RECOMMENDED)**
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the contents of `.gemini/APPLY_THIS_MIGRATION.sql`
4. Paste and click **RUN**
5. Verify you see: ✅ Added column messages

**Option 2: Supabase CLI (if installed)**
```bash
npx supabase db push
```

## 📋 Verification Steps

After applying the migration:

1. **Test registration:**
   ```bash
   node .gemini/test_registration.js
   ```

2. **Expected result:**
   ```
   ✅ REQUEST SUCCEEDED
   Applicant ID: <some-uuid>
   ```

## 🔄 Timeline of Issues

1. **Yesterday**: Fixed 10+ field mismatches (column names in code vs DB)
2. **Today**: Fixed `linkedin` → `linkedin_url` and `resume_url` → `resume_link`
3. **Now**: Need to apply migration to actually CREATE these columns in DB

## 💡 Why This Happens

The migration file was created but never executed against the live database. The code expects columns that don't exist yet, causing Supabase to throw a schema cache error.

---

## ⚡ IMMEDIATE ACTION REQUIRED

**Run the SQL in `.gemini/APPLY_THIS_MIGRATION.sql` in your Supabase Dashboard NOW!**

Then test with:
```bash
node .gemini/test_registration.js
```
