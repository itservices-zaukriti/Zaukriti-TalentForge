-- Create table for Contact Form Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' -- new, read, replied
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (for contact form)
CREATE POLICY "Allow public insert to contact_messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Policy: Allow admin (service_role) to read all
CREATE POLICY "Allow admin read contact_messages" ON contact_messages
    FOR SELECT USING (auth.role() = 'service_role');
