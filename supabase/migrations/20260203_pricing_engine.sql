-- ============================================
-- PRICING ENGINE MIGRATION
-- Moves hardcoded pricing config to Database
-- ============================================

-- 1. Create pricing_phases table
CREATE TABLE IF NOT EXISTS pricing_phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_name TEXT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER NOT NULL,
    label_text TEXT, -- e.g. "Current Phase: Early Bird"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create pricing_amounts table
CREATE TABLE IF NOT EXISTS pricing_amounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_id UUID REFERENCES pricing_phases(id) ON DELETE CASCADE,
    team_size INTEGER NOT NULL CHECK (team_size IN (1, 2, 3)),
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    currency TEXT DEFAULT 'INR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(phase_id, team_size)
);

-- 3. Create enrollment_control table
CREATE TABLE IF NOT EXISTS enrollment_control (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_enrollment_open BOOLEAN DEFAULT TRUE,
    closed_message TEXT DEFAULT 'Registrations are currently closed. Please check back soon.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create pricing_config table
CREATE TABLE IF NOT EXISTS pricing_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gst_percentage NUMERIC DEFAULT 18,
    referral_discount_amount NUMERIC DEFAULT 50,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE pricing_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_amounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;

-- create policies for PUBLIC READ (Pricing is public)
CREATE POLICY "Public Read Pricing Phases" ON pricing_phases FOR SELECT TO public USING (true);
CREATE POLICY "Public Read Pricing Amounts" ON pricing_amounts FOR SELECT TO public USING (true);
CREATE POLICY "Public Read Enrollment Control" ON enrollment_control FOR SELECT TO public USING (true);
CREATE POLICY "Public Read Pricing Config" ON pricing_config FOR SELECT TO public USING (true);

-- ============================================
-- SEED DATA (Migrate from config.ts)
-- ============================================

DO $$
DECLARE
    p1_id UUID;
    p2_id UUID;
    p3_id UUID;
    p4_id UUID;
BEGIN
    -- Clear existing data if re-running (safe-guard)
    DELETE FROM pricing_amounts;
    DELETE FROM pricing_phases;
    DELETE FROM enrollment_control;
    DELETE FROM pricing_config;

    -- 1. Seed Phases
    INSERT INTO pricing_phases (phase_name, start_date, end_date, display_order, label_text)
    VALUES 
        ('Phase 1 — Early Bird', '2026-02-01 00:00:00+00', '2026-02-15 23:59:59+00', 1, 'Current Phase: Early Bird')
    RETURNING id INTO p1_id;

    INSERT INTO pricing_phases (phase_name, start_date, end_date, display_order, label_text)
    VALUES 
        ('Phase 2 — Regular', '2026-02-16 00:00:00+00', '2026-02-28 23:59:59+00', 2, 'Regular Phase')
    RETURNING id INTO p2_id;

    INSERT INTO pricing_phases (phase_name, start_date, end_date, display_order, label_text)
    VALUES 
        ('Phase 3 — Late', '2026-03-01 00:00:00+00', '2026-03-15 23:59:59+00', 3, 'Late Phase')
    RETURNING id INTO p3_id;

    INSERT INTO pricing_phases (phase_name, start_date, end_date, display_order, label_text)
    VALUES 
        ('Phase 4 — Final Call', '2026-03-16 00:00:00+00', '2026-03-25 23:59:59+00', 4, 'Final Call')
    RETURNING id INTO p4_id;

    -- 2. Seed Amounts
    -- Phase 1
    INSERT INTO pricing_amounts (phase_id, team_size, amount) VALUES
        (p1_id, 1, 799), (p1_id, 2, 1399), (p1_id, 3, 1999);
    
    -- Phase 2
    INSERT INTO pricing_amounts (phase_id, team_size, amount) VALUES
        (p2_id, 1, 999), (p2_id, 2, 1799), (p2_id, 3, 2399);

    -- Phase 3
    INSERT INTO pricing_amounts (phase_id, team_size, amount) VALUES
        (p3_id, 1, 1199), (p3_id, 2, 1999), (p3_id, 3, 2799);

    -- Phase 4
    INSERT INTO pricing_amounts (phase_id, team_size, amount) VALUES
        (p4_id, 1, 1499), (p4_id, 2, 2499), (p4_id, 3, 3499);

    -- 3. Seed Enrollment Control
    INSERT INTO enrollment_control (is_enrollment_open, closed_message)
    VALUES (true, 'Registrations are temporarily closed. Please check back soon.');

    -- 4. Seed Pricing Config
    INSERT INTO pricing_config (gst_percentage, referral_discount_amount)
    VALUES (18, 50);

END $$;
