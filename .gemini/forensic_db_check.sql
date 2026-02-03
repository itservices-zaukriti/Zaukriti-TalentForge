-- ============================================
-- STEP 2: Runtime Role Verification Function
-- ============================================
-- FIXED: Renamed current_role to db_role (avoiding reserved identifier)

CREATE OR REPLACE FUNCTION get_current_role()
RETURNS TABLE (
    current_user_name text,
    db_role text,
    session_user_name text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        current_user::text,
        current_setting('request.jwt.claim.role', true)::text,
        session_user::text;
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION get_current_role() TO anon, authenticated, public;

-- ============================================
-- STEP 4: Check for Implicit DB Actions
-- ============================================

-- Check all constraints on applicants table
SELECT 
    'CONSTRAINT CHECK' as check_type,
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'applicants'::regclass
ORDER BY contype, conname;

-- Check for DEFAULT values with function calls
SELECT 
    'DEFAULT VALUES' as check_type,
    column_name,
    column_default,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'applicants'
  AND column_default IS NOT NULL
ORDER BY ordinal_position;

-- Check for GENERATED columns
SELECT 
    'GENERATED COLUMNS' as check_type,
    column_name,
    generation_expression,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'applicants'
  AND is_generated = 'ALWAYS'
ORDER BY ordinal_position;

-- Check for triggers on applicants table
SELECT 
    'TRIGGERS' as check_type,
    trigger_name,
    event_manipulation as event,
    action_timing as timing,
    action_statement as action
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'applicants'
ORDER BY trigger_name;

-- Check trigger functions for SECURITY DEFINER/INVOKER
SELECT 
    'TRIGGER FUNCTIONS' as check_type,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_trigger t ON t.tgfoid = p.oid
WHERE t.tgrelid = 'applicants'::regclass;

-- Check foreign key relationships
SELECT 
    'FOREIGN KEYS' as check_type,
    tc.constraint_name,
    tc.table_name as from_table,
    kcu.column_name as from_column,
    ccu.table_name AS to_table,
    ccu.column_name AS to_column,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'applicants'
ORDER BY tc.constraint_name;

-- Check RLS policies on applicants
SELECT 
    'RLS POLICIES' as check_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'applicants'
ORDER BY cmd, policyname;

-- Check if RLS is enabled
SELECT 
    'RLS STATUS' as check_type,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'applicants';
