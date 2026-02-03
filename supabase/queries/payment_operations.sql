-- ============================================
-- OPERATIONS: Payment Tracking & Recovery
-- ============================================

-- 1️⃣ Live Operations View: Who is trying to pay right now? (Last 24 hours)
-- Run this to see active drop-offs or people stuck at payment gateway.
SELECT
  full_name,
  email,
  phone,
  amount_paid,
  payment_order_id,
  payment_status,
  application_status,
  to_char(created_at, 'DD Mon HH12:MI AM') as registered_at,
  EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minutes_ago
FROM applicants
WHERE payment_status = 'pending' 
   OR payment_status = 'created'
   AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;


-- 2️⃣ Recovery List: Humans who need a nudge (> 30 mins, < 24 hours)
-- These users likely dropped off. Send them an email or call them.
SELECT
  full_name,
  email,
  phone,
  payment_order_id,
  to_char(created_at, 'DD Mon HH12:MI AM') as registered_at
FROM applicants
WHERE (payment_status = 'pending' OR payment_status = 'created')
  AND created_at < NOW() - INTERVAL '30 minutes'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;


-- 3️⃣ Audit: Recent Successful Payments
-- Verify money is flowing.
SELECT 
    full_name, 
    email, 
    amount_paid, 
    payment_status, 
    referral_code,
    created_at
FROM applicants
WHERE payment_status = 'paid'
ORDER BY created_at DESC
LIMIT 20;

-- 4️⃣ Cleanup/Auto-Flag (Optional Bulk Update)
-- Mark old pending as 'followup_required'
/*
UPDATE applicants
SET application_status = 'followup_required'
WHERE (payment_status = 'pending' OR payment_status = 'created')
AND created_at < NOW() - INTERVAL '30 minutes'
AND application_status = 'pending_payment';
*/
