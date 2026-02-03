-- DANGER: This will delete ALL data from the following tables.
-- Use this only for resetting the environment for testing.

BEGIN;

-- 1. Delete dependent tables first to avoid FK violations (if no CASCADE)
TRUNCATE TABLE wallet_ledger CASCADE;
TRUNCATE TABLE referral_codes CASCADE;
TRUNCATE TABLE referrals CASCADE;
TRUNCATE TABLE community_referral_links CASCADE;
TRUNCATE TABLE community_wallet_ledger CASCADE;

-- 2. Delete main entity tables
TRUNCATE TABLE applicants CASCADE;

-- 3. Delete users (Optional, usually good for full reset)
-- Note: 'users' might be linked to Supabase Auth. If you built a custom 'users' table, this is fine.
-- If 'users' syncs with auth.users, you might want to delete from auth.users instead (but that requires admin API).
-- Assuming local 'users' table:
TRUNCATE TABLE users CASCADE;

COMMIT;

-- Verify
SELECT count(*) as applicants_count FROM applicants;
