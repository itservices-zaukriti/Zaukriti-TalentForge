/**
 * Environment Verification Script
 * This checks if your .env.local keys match your Supabase project
 */

console.log('\n🔍 Supabase Environment Verification\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('📋 Current Configuration:\n');
console.log(`   Supabase URL: ${url}`);
console.log(`   Anon Key (first 20 chars): ${anonKey?.slice(0, 20)}...`);
console.log(`   Service Key exists: ${serviceKey ? 'YES' : 'NO'}\n`);

if (!url || !anonKey) {
    console.error('❌ CRITICAL: Missing environment variables!\n');
    console.log('   Check your .env.local file has:');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY\n');
    process.exit(1);
}

// Extract project ref from URL
const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log('🎯 Detected Project:\n');
console.log(`   Project Reference: ${projectRef || 'UNKNOWN'}\n`);

console.log('═══════════════════════════════════════════════════════════\n');
console.log('⚠️  CRITICAL CHECKS:\n');
console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/settings/api\n');
console.log('2. Verify the "anon public" key matches:');
console.log(`   ${anonKey?.slice(0, 30)}...\n`);
console.log('3. Go to: https://supabase.com/dashboard/project/' + projectRef + '/editor\n');
console.log('4. Run this SQL to verify policies:\n');
console.log('   SELECT policyname, cmd, roles');
console.log('   FROM pg_policies');
console.log('   WHERE tablename = \'applicants\';\n');
console.log('5. You MUST see both INSERT and UPDATE policies.\n');
console.log('═══════════════════════════════════════════════════════════\n');
console.log('🔥 MOST LIKELY ISSUE:\n');
console.log('   You ran the SQL in a DIFFERENT Supabase project');
console.log('   than the one your .env.local points to.\n');
console.log('   Solution: Run the RLS SQL in the CORRECT project:\n');
console.log('   https://supabase.com/dashboard/project/' + projectRef + '/sql/new\n');
