-- ============================================
-- CHECK ALL COLUMNS IN APPLICANTS TABLE
-- ============================================
-- Run this to see ALL columns that currently exist
-- ============================================

SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'applicants'
  AND table_schema = 'public'
ORDER BY ordinal_position;
