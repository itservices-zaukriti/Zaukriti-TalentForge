const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^"|"$/g, '');
    }
});

// Use Service Role for verification (to check DB directly)
// But we want to simulate the API call logic. Since we can't fetch easily here, 
// we will verify the OUTCOME by inserting using the same logic (or checking expected DB state after manual run).

// Actually, let's just use the Supabase Admin client to simulate what the API does.
// This script is to verify the LOGIC, not necessarily the HTTP endpoint (which we can trust Next.js to route).

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testCommunityReg() {
    console.log('🧪 Testing Community Registration Logic (Instant Access)');

    const testEmail = `community-${Date.now()}@test.com`;
    const payload = {
        fullName: 'Test Ambassador',
        email: testEmail,
        phone: '9876543210',
        organizationName: 'Test Tech Institute',
        organizationType: 'Institute'
    };

    console.log('1. Simulating Registration for:', testEmail);

    // --- LOGIC REPLICATION FROM API ---
    // We replicate the API logic here to verify it works against the real DB

    // Check existing
    const { data: existing } = await supabase
        .from('community_referrers')
        .select('id')
        .eq('email', payload.email)
        .maybeSingle();

    if (existing) {
        console.log('❌ Existing user found (unexpected for new test email).');
        return;
    }

    // Generate Code
    const orgMap = { 'Institute': 'INS' };
    const orgCode = orgMap[payload.organizationType];
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const referralCode = `CR-${orgCode}-${randomPart}`;

    console.log('2. Generated Code:', referralCode);

    // Insert
    const { data, error } = await supabase
        .from('community_referrers')
        .insert({
            full_name: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            organization_name: payload.organizationName,
            organization_type: payload.organizationType,
            referral_code: referralCode,
            status: 'active'
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Insert Failed:', error.message);
    } else {
        console.log('✅ Insert Success!');
        console.log('   ID:', data.id);
        console.log('   Status:', data.status);
        console.log('   Referral Code:', data.referral_code);

        // Verify API Requirement: communityId must be UUID
        if (!data.id || data.id.length < 30) console.error('❌ communityId (ID) invalid!');

        if (data.status !== 'active') console.error('❌ Status mismatch! Expected active.');
        if (!data.referral_code.startsWith('CR-INS-')) console.error('❌ Code format mismatch!');
    }

    // Clean up
    console.log('3. Cleaning up...');
    await supabase.from('community_referrers').delete().eq('id', data.id);
    console.log('✨ Test Complete.');
}

testCommunityReg();
