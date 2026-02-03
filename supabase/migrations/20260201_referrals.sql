-- migration_referrals.sql

-- Each applicant gets one referral code
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track successful referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  referred_applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, confirmed, reversed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (referred_applicant_id) -- one referrer per applicant
);

-- Coupons table (Optional but requested)
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- percent or fixed
  discount_value NUMERIC NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_to TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon redemptions
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (applicant_id, coupon_id)
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_applicant_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
