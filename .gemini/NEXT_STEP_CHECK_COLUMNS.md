# 🚨 NEXT STEP: Find ALL Missing Columns

## ✅ Progress So Far
- Fixed column names in code: `linkedin` → `linkedin_url`, `resume_url` → `resume_link`
- Added 4 columns to database: `linkedin_url`, `resume_link`, `whatsapp_number`, `city_state`

## ❌ Still Getting Error
The registration is still failing, which means there are **MORE missing columns**.

## 🔍 What We Need to Check

The code is trying to INSERT these fields (from `route.ts` lines 164-194):

```typescript
{
    user_id,                    // ✅ Should exist
    specialization_id,          // ✅ Should exist  
    full_name,                  // ✅ Should exist
    email,                      // ✅ Should exist
    phone,                      // ✅ Should exist
    track,                      // ✅ Should exist
    payment_status,             // ✅ Should exist
    whatsapp_number,            // ✅ JUST ADDED
    city_state,                 // ✅ JUST ADDED
    college_name,               // ✅ Should exist
    course,                     // ✅ Should exist
    graduation_year,            // ❓ MIGHT NOT EXIST (schema has year_of_study)
    linkedin_url,               // ✅ JUST ADDED
    resume_link,                // ✅ JUST ADDED
    team_size,                  // ✅ Should exist
    team_members,               // ✅ Should exist
    is_team_lead,               // ❓ MIGHT NOT EXIST
    pricing_phase,              // ❓ MIGHT NOT EXIST
    applied_referral_code,      // ❓ MIGHT NOT EXIST
    amount_paid,                // ✅ Should exist
    base_amount,                // ❓ MIGHT NOT EXIST
    discount_amount,            // ❓ MIGHT NOT EXIST
    gst_amount,                 // ❓ MIGHT NOT EXIST
    parents_name,               // ❓ MIGHT NOT EXIST
    parents_profession,         // ❓ MIGHT NOT EXIST
    family_income_range         // ❓ MIGHT NOT EXIST
}
```

## 📋 ACTION REQUIRED

**Run this SQL in Supabase Dashboard:**

Copy from: `.gemini/check_all_columns.sql`

This will show you ALL columns that currently exist in the `applicants` table.

Then compare the output with the list above to find which columns are missing.

## 🎯 Expected Next Steps

1. Run `check_all_columns.sql` in Supabase
2. Copy the JSON output here
3. I'll create a migration to add ALL missing columns at once
4. Apply that migration
5. Test registration again

---

**Paste the JSON output from the SQL query here when ready!**
