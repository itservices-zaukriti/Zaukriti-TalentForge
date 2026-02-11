-- Migration: Fix Idempotency and Payment Tracking
-- Description: Adds unique constraint to prevent duplicate applications per user per phase, and adds explicit column for Razorpay Order ID.

-- 1. CLEANUP DUPLICATES (Critical Pre-step)
-- Before creating a unique index, we MUST remove existing duplicates.
-- This query keeps the BEST row (Paid > Latest) and deletes the rest.
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
             PARTITION BY user_id, pricing_phase 
             ORDER BY 
                CASE WHEN payment_status = 'Paid' THEN 1 ELSE 2 END, -- Keep Paid rows first
                created_at DESC -- Then keep the latest created one
         ) as rn
  FROM applicants
)
DELETE FROM applicants
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- 2. Add Unique Index for Idempotency
-- Now that duplicates are gone, this will succeed.
-- Ensures a user can only have ONE application per phase (cohort).
CREATE UNIQUE INDEX IF NOT EXISTS idx_applicants_user_phase
ON applicants (user_id, pricing_phase);

-- 3. Add Explicit Razorpay Order ID Column
-- While 'payment_reference' is used for link/order ref, having a dedicated column helps data clarity and webhook lookups.
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
