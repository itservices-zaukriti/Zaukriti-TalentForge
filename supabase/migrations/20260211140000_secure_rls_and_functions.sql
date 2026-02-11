-- Secure public.log_action by setting search_path
-- Assuming log_action has no arguments or we can target it by name if overloaded (Postgres requires signature if overloaded).
-- If this fails due to signature mismatch, please check the function definition.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'log_action') THEN
    EXECUTE 'ALTER FUNCTION public.log_action() SET search_path = public';
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Handle potential signature mismatch or other errors gracefully or re-raise
  RAISE NOTICE 'Could not set search_path for log_action: %', SQLERRM;
END $$;

-- Drop insecure "always true" policies for applicants
-- These allow ANONYMOUS users to insert/update any record, which is dangerous.
-- Registration is handled via API (Service Role), so public access is not needed.
DROP POLICY IF EXISTS "anon_insert_applicants" ON public.applicants;
DROP POLICY IF EXISTS "public_insert_applicants" ON public.applicants;
DROP POLICY IF EXISTS "anon_update_applicants" ON public.applicants;
DROP POLICY IF EXISTS "public_update_applicants" ON public.applicants;

-- Drop insecure "always true" policy for community_referrer_requests
DROP POLICY IF EXISTS "Public Submit Request" ON public.community_referrer_requests;

-- Drop insecure "always true" policy for community_referrers
DROP POLICY IF EXISTS "Public insert community referrers" ON public.community_referrers;

-- Drop insecure "always true" policy for referral_codes
DROP POLICY IF EXISTS "Allow insert referral codes" ON public.referral_codes;

-- Drop insecure "always true" policy for users
DROP POLICY IF EXISTS "public_insert_users" ON public.users;

-- Secure contact_messages policy (restrict permissive true)
-- We drop the old permissive policy and create a stricter one.
DROP POLICY IF EXISTS "Allow public insert to contact_messages" ON public.contact_messages;

CREATE POLICY "Allow public insert to contact_messages" 
ON public.contact_messages 
FOR INSERT 
TO anon 
WITH CHECK (
  length(message) > 0 
  AND 
  position('@' in email) > 0
);
