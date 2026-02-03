/**
 * Simple RLS Policy Checker
 * This script provides the SQL you need to run manually in Supabase Dashboard
 */

console.log('\n🔍 RLS Policy Verification Guide\n');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📋 STEP 1: Check Current Policies');
console.log('   Run this SQL in Supabase Dashboard SQL Editor:\n');
console.log('   SELECT policyname, cmd, roles');
console.log('   FROM pg_policies');
console.log('   WHERE tablename = \'applicants\';\n');

console.log('📊 STEP 2: Verify Results');
console.log('   You MUST see these 2 policies:\n');
console.log('   ✅ public_insert_applicants | INSERT | {public}');
console.log('   ✅ public_update_applicants | UPDATE | {public}\n');

console.log('🔧 STEP 3: If Policies Are Missing, Run This Fix:\n');
console.log('═══════════════════════════════════════════════════════════\n');
console.log(`
-- Enable RLS
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- Clean slate
DROP POLICY IF EXISTS public_insert_applicants ON applicants;
DROP POLICY IF EXISTS public_update_applicants ON applicants;

-- Create INSERT policy
CREATE POLICY public_insert_applicants
ON applicants
FOR INSERT
TO public
WITH CHECK (true);

-- Create UPDATE policy
CREATE POLICY public_update_applicants
ON applicants
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Verify (should return 2 rows)
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'applicants';
`);

console.log('═══════════════════════════════════════════════════════════\n');
console.log('⚠️  CRITICAL: If policies exist but RLS still fails:\n');
console.log('   The issue is CLIENT-SIDE, not database-side.');
console.log('   Check server logs for this line:');
console.log('   "✅ USING PUBLIC CLIENT FOR APPLICANTS WRITE"\n');
console.log('   If you DON\'T see that log, the API route isn\'t being called.');
console.log('   If you DO see it, check the key prefix matches your anon key.\n');
