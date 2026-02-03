-- Zaukriti TalentForge V2 Schema (MVP+)
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Applicants Table (Core Entity)
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Personal
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,

  -- Education
  college_name TEXT,
  course TEXT,
  year_of_study TEXT,

  -- Program Details
  track TEXT,
  team_size INTEGER DEFAULT 1,

  -- Team (for Teams of 2/3)
  team_members JSONB, -- store names/emails of teammates

  -- Links
  github_link TEXT,
  video_link TEXT,
  portfolio_link TEXT,

  -- Payment
  payment_status TEXT DEFAULT 'Pending', 
  payment_provider TEXT, -- Razorpay / Stripe
  payment_reference TEXT, -- Razorpay payment link ref / order id
  amount_paid INTEGER, -- in INR

  -- Hiring Pipeline
  application_status TEXT DEFAULT 'New', 
  -- New, Screening, Shortlisted, Interview, Offer, Joined, Rejected

  reviewer_score INTEGER,
  internal_notes TEXT,
  tags TEXT[],

  -- Career Tracking (Future)
  internship_start_date DATE,
  fulltime_offer_date DATE,
  probation_end_date DATE,
  esop_eligible BOOLEAN DEFAULT FALSE
);

-- Indexes for Admin Performance
CREATE INDEX idx_applicants_track ON applicants(track);
CREATE INDEX idx_applicants_status ON applicants(application_status);
CREATE INDEX idx_applicants_created_at ON applicants(created_at);

-------------------------------------------------

-- 2. Assessments Table (Hackathon / Internship / Probation)
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,

  stage TEXT, -- Hackathon, Internship, Probation
  deliverable_name TEXT,
  score INTEGER,
  feedback TEXT
);

CREATE INDEX idx_assessments_applicant_id ON assessments(applicant_id);

-------------------------------------------------

-- 3. Vendors Table (Marketplace - Phase 1)
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  business_name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  rating DECIMAL DEFAULT 0,

  portfolio_url TEXT,
  contact_info JSONB,

  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_vendors_category ON vendors(category);
