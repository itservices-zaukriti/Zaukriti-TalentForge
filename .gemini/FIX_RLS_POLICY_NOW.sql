-- ============================================
-- FIX RLS POLICY - Allow Public INSERT/UPDATE
-- ============================================
-- Error: "new row violates row-level security policy"
-- This means the INSERT policy is not allowing anonymous users
-- ============================================

-- 1. Enable RLS (if not already enabled)
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (clean slate)
DROP POLICY IF EXISTS public_insert_applicants ON applicants;
DROP POLICY IF EXISTS public_update_applicants ON applicants;
DROP POLICY IF EXISTS public_select_applicants ON applicants;

-- 3. Create INSERT policy for public/anon users
CREATE POLICY public_insert_applicants
ON applicants
FOR INSERT
TO public
WITH CHECK (true);

-- 4. Create UPDATE policy for public/anon users
CREATE POLICY public_update_applicants
ON applicants
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 5. Create SELECT policy for public/anon users (optional but recommended)
CREATE POLICY public_select_applicants
ON applicants
FOR SELECT
TO public
USING (true);

-- 6. Verify policies were created
SELECT 
    policyname,
    cmd AS command,
    roles,
    CASE 
        WHEN qual IS NULL THEN 'true'
        ELSE qual::text
    END AS using_clause,
    CASE 
        WHEN with_check IS NULL THEN 'true'
        ELSE with_check::text
    END AS with_check_clause
FROM pg_policies 
WHERE tablename = 'applicants'
ORDER BY cmd, policyname;
