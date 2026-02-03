-- ============================================
-- URGENT: Apply this migration to fix registration
-- ============================================
-- Error: "Could not find the 'linkedin_url' column of 'applicants' in the schema cache"
-- 
-- INSTRUCTIONS:
-- 1. Copy this entire SQL block
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and RUN
-- ============================================

DO $$ 
BEGIN 
    -- Add linkedin_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='linkedin_url') THEN
        ALTER TABLE applicants ADD COLUMN linkedin_url TEXT;
        RAISE NOTICE '✅ Added column: linkedin_url';
    ELSE
        RAISE NOTICE '⏭️  Column already exists: linkedin_url';
    END IF;

    -- Add resume_link column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='resume_link') THEN
        ALTER TABLE applicants ADD COLUMN resume_link TEXT;
        RAISE NOTICE '✅ Added column: resume_link';
    ELSE
        RAISE NOTICE '⏭️  Column already exists: resume_link';
    END IF;

    -- Add whatsapp_number column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='whatsapp_number') THEN
        ALTER TABLE applicants ADD COLUMN whatsapp_number TEXT;
        RAISE NOTICE '✅ Added column: whatsapp_number';
    ELSE
        RAISE NOTICE '⏭️  Column already exists: whatsapp_number';
    END IF;

    -- Add city_state column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='city_state') THEN
        ALTER TABLE applicants ADD COLUMN city_state TEXT;
        RAISE NOTICE '✅ Added column: city_state';
    ELSE
        RAISE NOTICE '⏭️  Column already exists: city_state';
    END IF;

END $$;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'applicants' 
  AND column_name IN ('linkedin_url', 'resume_link', 'whatsapp_number', 'city_state')
ORDER BY column_name;
