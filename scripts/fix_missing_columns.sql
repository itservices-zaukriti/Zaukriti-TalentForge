-- FIX: Add missing columns to 'applicants' table
ALTER TABLE applicants 
ADD COLUMN IF NOT EXISTS base_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS gst_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS parents_name TEXT,
ADD COLUMN IF NOT EXISTS parents_profession TEXT,
ADD COLUMN IF NOT EXISTS family_income_range TEXT,
ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Refresh Schema Cache
NOTIFY pgrst, 'reload config';
