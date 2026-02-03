-- Migration: Add Academic and Family Context fields

-- 1. Extend Applicants table for academics and streams
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS tenth_percentage NUMERIC;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS twelfth_percentage NUMERIC;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS current_education_percentage NUMERIC;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS primary_stream TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS secondary_specializations TEXT[];

-- 2. Create separate table for sensitive family context
CREATE TABLE IF NOT EXISTS applicant_family_context (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  guardian_name TEXT,
  guardian_profession TEXT,
  income_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on new table
ALTER TABLE applicant_family_context ENABLE ROW LEVEL SECURITY;

-- 4. Create policy for insertions (allow anon for now, matching applicant flow)
CREATE POLICY "Allow public insert to family context" ON applicant_family_context
    FOR INSERT WITH CHECK (true);

-- 5. Create policy for admin read
CREATE POLICY "Allow admin read family context" ON applicant_family_context
    FOR SELECT USING (auth.role() = 'service_role');
