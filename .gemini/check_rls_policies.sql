-- ============================================
-- RLS POLICIES CHECK FOR APPLICANTS TABLE
-- ============================================

SELECT 
    policyname,
    cmd as command,
    roles,
    permissive,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'applicants'
ORDER BY cmd, policyname;
