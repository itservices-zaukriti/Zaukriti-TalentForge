-- ============================================
-- VERIFY RLS POLICIES ON APPLICANTS TABLE
-- ============================================

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename = 'applicants';

-- Check all policies on applicants table
SELECT 
    policyname,
    cmd AS command,
    roles,
    qual AS using_expression,
    with_check AS with_check_expression
FROM pg_policies 
WHERE tablename = 'applicants'
ORDER BY cmd, policyname;
