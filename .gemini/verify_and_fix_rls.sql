-- ============================================
-- RLS VERIFICATION AND FIX SCRIPT
-- Run this in Supabase SQL Editor
-- ============================================

-- STEP 1: Check current RLS status
-- ============================================
SELECT 
    'RLS Status Check' as check_type,
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'applicants';

-- STEP 2: Check existing policies
-- ============================================
SELECT 
    'Existing Policies' as check_type,
    policyname,
    cmd as operation,
    roles,
    CASE 
        WHEN with_check::text = 'true' THEN 'ALLOWS ALL'
        ELSE with_check::text
    END as policy_check
FROM pg_policies 
WHERE tablename = 'applicants'
ORDER BY cmd;

-- STEP 3: Check migration history
-- ============================================
SELECT 
    'Migration History' as check_type,
    version,
    name,
    executed_at
FROM supabase_migrations.schema_migrations 
WHERE version >= '20260202'
ORDER BY version DESC;

-- ============================================
-- IF NO POLICIES EXIST, RUN THIS FIX:
-- ============================================

-- Enable RLS
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS public_insert_applicants ON applicants;
DROP POLICY IF EXISTS public_update_applicants ON applicants;

-- Create INSERT policy for public role
CREATE POLICY public_insert_applicants
ON applicants
FOR INSERT
TO public
WITH CHECK (true);

-- Create UPDATE policy for public role
CREATE POLICY public_update_applicants
ON applicants
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ============================================
-- VERIFICATION: Re-check policies after fix
-- ============================================
SELECT 
    'Post-Fix Verification' as check_type,
    policyname,
    cmd as operation,
    roles,
    CASE 
        WHEN with_check::text = 'true' THEN '✅ ALLOWS ALL'
        ELSE '⚠️ ' || with_check::text
    END as policy_status
FROM pg_policies 
WHERE tablename = 'applicants'
ORDER BY cmd;

-- ============================================
-- EXPECTED OUTPUT:
-- ============================================
-- You should see:
-- 1. rls_enabled = true
-- 2. Two policies:
--    - public_insert_applicants (INSERT) → ALLOWS ALL
--    - public_update_applicants (UPDATE) → ALLOWS ALL
-- 3. roles = {public}
-- ============================================
