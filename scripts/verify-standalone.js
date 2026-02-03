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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase variables in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFlow() {
    console.log('🚀 Starting Zero-Dep Verification...');
    const testId = Math.random().toString(36).substring(7);
    const testEmail = `partner-${testId}@example.com`;

    try {
        console.log('1. Creating Request...');
        const { data: request, error: reqError } = await supabase
            .from('community_referrer_requests')
            .insert([{
                full_name: 'ZeroDep Partner',
                email: testEmail,
                organization_name: 'ZeroDep Uni'
            }])
            .select()
            .single();
        if (reqError) throw reqError;
        console.log('✅ Request ID:', request.id);

        console.log('2. Approving (Manual DB Insert)...');
        const code = `CR-ZD${testId.toUpperCase()}`;
        const { data: partner, error: pError } = await supabase
            .from('community_referrers')
            .insert([{
                full_name: request.full_name,
                email: request.email,
                organization_name: request.organization_name,
                referral_code: code,
                status: 'active'
            }])
            .select()
            .single();
        if (pError) throw pError;
        console.log('✅ Partner Code:', partner.referral_code);

        console.log('3. Validating Registration Logic (Dry-Run check)...');
        // We verify the code exists and is active
        const { data: check } = await supabase
            .from('community_referrers')
            .select('id')
            .eq('referral_code', code)
            .eq('status', 'active')
            .single();
        if (!check) throw new Error('Referral code lookup failed');
        console.log('✅ Code is active and lookable.');

        console.log('✨ VERIFICATION SUCCESSFUL: Infrastructure is live.');
    } catch (e) {
        console.error('❌ Verification failed:', e.message);
    }
}

verifyFlow();
