-- Final Sync Migration
-- Ensures all columns used in app/api/register/route.ts exist in the applicants table

DO $$ 
BEGIN 
    -- 1. Academic & Stream Fields (from v2 but repeated for safety)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='tenth_percentage') THEN
        ALTER TABLE applicants ADD COLUMN tenth_percentage NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='twelfth_percentage') THEN
        ALTER TABLE applicants ADD COLUMN twelfth_percentage NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='current_education_percentage') THEN
        ALTER TABLE applicants ADD COLUMN current_education_percentage NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='primary_stream') THEN
        ALTER TABLE applicants ADD COLUMN primary_stream TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='secondary_specializations') THEN
        ALTER TABLE applicants ADD COLUMN secondary_specializations TEXT[];
    END IF;

    -- 2. Personal & Links (Missing in schema.sql but used in code)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='whatsapp_number') THEN
        ALTER TABLE applicants ADD COLUMN whatsapp_number TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='city_state') THEN
        ALTER TABLE applicants ADD COLUMN city_state TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='linkedin_url') THEN
        ALTER TABLE applicants ADD COLUMN linkedin_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applicants' AND column_name='resume_link') THEN
        ALTER TABLE applicants ADD COLUMN resume_link TEXT;
    END IF;

END $$;
