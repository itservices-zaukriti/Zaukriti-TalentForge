-- RLS FIX: Ensure UPDATE policy applies to public role for applicants table
-- This is required for the payment flow which updates the applicant record with order_id

-- 1. Enable RLS (Safety Check)
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- 2. INSERT Policy (Already done, but repeating for completeness/safety)
DROP POLICY IF EXISTS public_insert_applicants ON applicants;
CREATE POLICY public_insert_applicants
ON applicants
FOR INSERT
TO public
WITH CHECK (true);

-- 3. UPDATE Policy (CRITICAL FIX)
DROP POLICY IF EXISTS public_update_applicants ON applicants;
CREATE POLICY public_update_applicants
ON applicants
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 4. Verification Query (Run this after applying to check)
-- SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'applicants';
