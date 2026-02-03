-- RLS FIX: Ensure insert policy applies to ALL roles (including anon/public)

-- 1. Drop the ambiguous policy
DROP POLICY IF EXISTS "public_insert_applicants" ON applicants;

-- 2. Create the explicit public policy
CREATE POLICY "public_insert_applicants"
ON applicants
FOR INSERT
TO public
WITH CHECK (true);

-- 3. Verify (Optional - Check output in Dashboard)
-- SELECT policyname, roles, cmd FROM pg_policies WHERE tablename = 'applicants';
