-- ============================================
-- CRITICAL: Check ACTUAL columns in applicants table
-- ============================================
-- Run this in Supabase SQL Editor to see what columns REALLY exist

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'applicants'
ORDER BY ordinal_position;

-- ============================================
-- This will show you the ACTUAL column names
-- Compare with what the API route is trying to use
-- ============================================
