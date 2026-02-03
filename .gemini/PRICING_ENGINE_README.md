# 🚀 Pricing Engine 2.0 (Database-Driven)

We have successfully migrated the pricing, phase scheduling, and enrollment controls from hardcoded code to the Database.

## 🛑 Action Required: Run Migration

You **MUST** run the SQL migration to create the tables and seed the initial data.

1.  Open **Supabase Dashboard** -> **SQL Editor**.
2.  Copy the content of: `supabase/migrations/20260203_pricing_engine.sql`
3.  **Run** the script.

> **Note:** The script includes `DROP` statements for these tables if they exist, so it is safe to re-run (it will reset data to defaults).

---

## 🛠️ Admin Guide

### 1. How to Change Pricing or Dates
Go to **Supabase Dashboard** -> **Table Editor**.

**Table: `pricing_phases`**
- Adjust `start_date` / `end_date` to shift phases.
- Toggle `is_active` to `false` to disable a phase explicitly.
- Change `display_order` to re-arrange the UI table.

**Table: `pricing_amounts`**
- Change `amount` for specific `team_size` and `phase_id`.
- Changes reflect **IMMEDIATELY** for new registrations.

### 2. How to Open/Close Enrollment
**Table: `enrollment_control`**
- Set `is_enrollment_open` to `false`.
- Update `closed_message` to customize what users see (e.g., "We are full!", "Maintenance Mode").
- **Effect:** Immediately hides "Register" button and blocks API requests.

### 3. How to Update GST or Referral Discount
**Table: `pricing_config`**
- `gst_percentage`: Set to `18` (or new rate).
- `referral_discount_amount`: Set to `50` (or new amount).
- No code deployment needed!

---

## 🧪 Verification Steps
After running the migration:

1.  **Check UI:** Refresh `/apply`. The pricing table should load.
2.  **Test Close:** Set `is_enrollment_open = false` in DB. Refresh UI. It should show the "Locked" message.
3.  **Test Registration:** Register a user. Check logs for `💰 [PRICING]` entry showing DB values.
4.  **Test Razorpay:** The amount requested from Razorpay will match the DB calculation exactly.

---

## 🗑️ Cleanup Note
The file `app/utils/config.ts` still contains the `pricing` array, but it is **NO LONGER USED** by the application logic.
You can safely keep it as a reference or remove the `pricing` key in a future cleanup.
