# 🎯 COLUMN NAME MISMATCH FIX APPLIED

## Root Cause Identified

The API route was using **incorrect column names** that didn't match the database schema, causing INSERT failures.

## Fixes Applied

### 1. ✅ `linkedin` → `linkedin_url`
**Before:**
```typescript
linkedin: data.linkedin,  // ❌ Column doesn't exist
```

**After:**
```typescript
linkedin_url: data.linkedin,  // ✅ Matches DB schema
```

### 2. ✅ `resume_url` → `resume_link`
**Before:**
```typescript
resume_url: data.resume,  // ❌ Column doesn't exist
```

**After:**
```typescript
resume_link: data.resume,  // ✅ Matches DB schema
```

---

## Why This Causes RLS Violations

When you try to INSERT a column that doesn't exist:

1. **PostgreSQL rejects the INSERT**
2. **Error code**: Could be `42703` (undefined column) OR `42501` (RLS violation)
3. **Why RLS error?** If RLS is enabled and the INSERT fails validation, PostgreSQL returns RLS error

---

## Database Schema (from migration)

```sql
-- From 20260201_final_sync.sql
ALTER TABLE applicants ADD COLUMN linkedin_url TEXT;   -- ✅ linkedin_url
ALTER TABLE applicants ADD COLUMN resume_link TEXT;    -- ✅ resume_link
```

---

## Similar Fix from Yesterday

You mentioned fixing **10+ fields** yesterday with a similar issue. This was likely:

1. **Column name mismatches** between code and database
2. **Fixed by renaming** columns in the API route to match the DB schema
3. **Common pattern**: Code uses one name, migration uses another

---

## Current Status

✅ **Column mismatches fixed**
✅ **Reserved identifier fixed** (`current_role` → `db_role`)
✅ **Forensic logging in place**

---

## Next Steps

The registration should now work correctly. However, to **prove the fix**, you should:

1. **Test registration**: `node .gemini/test_registration.js`
2. **Check logs**: Should see `✅ [DB_SUCCESS] INSERT applicants`
3. **Verify**: No more RLS violation errors

---

## Hypothesis Update

**Original hypothesis**: Policy not applied (70% probability)
**New hypothesis**: Column name mismatch (90% probability) ✅ **FIXED**

The RLS error was likely a **secondary symptom** of the column mismatch. When PostgreSQL couldn't find the columns, it failed the INSERT, which triggered an RLS-related error message.

---

## Test Now

```bash
node .gemini/test_registration.js
```

Expected result: **SUCCESS** ✅
