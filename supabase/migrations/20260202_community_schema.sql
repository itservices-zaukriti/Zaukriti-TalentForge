-- Migration: Create Community Referrers Table for Instant Access
-- Date: 2026-02-02

CREATE TABLE IF NOT EXISTS community_referrers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    organization_name TEXT NOT NULL,
    organization_type TEXT NOT NULL, -- College, University, Community, etc.
    
    referral_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active', -- active, paused, suspended
    
    -- Metrics (Optional/Future)
    referral_count INTEGER DEFAULT 0,
    wallet_balance NUMERIC DEFAULT 0
);

-- Index for fast lookup by login/email or code
CREATE INDEX IF NOT EXISTS idx_community_email ON community_referrers(email);
CREATE INDEX IF NOT EXISTS idx_community_code ON community_referrers(referral_code);

-- Enable RLS (Security)
ALTER TABLE community_referrers ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public Read (for checking code validity)
CREATE POLICY "Public read community referrers" 
ON community_referrers FOR SELECT 
USING (true);

-- 2. Service Role Full Access (for API inserts)
CREATE POLICY "Service Role full access community" 
ON community_referrers FOR ALL 
USING (auth.role() = 'service_role');
