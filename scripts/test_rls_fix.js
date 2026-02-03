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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testRlsFix() {
    console.log('🧪 Testing Hard: RLS Insert Fix');

    // Test Data from instructions
    const testApplicant = {
        full_name: 'Final RLS Test',
        email: `final-rls-${Date.now()}@zaukriti.ai`, // Unique email to avoid constraints
        phone: `99${Date.now().toString().slice(-8)}`,
        track: 'AI',
        payment_status: 'Pending'
    };

    console.log('Transmitting payload:', testApplicant);

    const { data, error } = await supabase
        .from('applicants')
        .insert([testApplicant])
        .select()
        .single();

    if (error) {
        console.error('❌ INSERT FAILED:', error.message);
        console.error('Details:', error);
        console.log('\n🛑 The RLS fix has NOT been applied or is incorrect.');
        process.exit(1);
    } else {
        console.log('✅ INSERT SUCCESS!');
        console.log('New Applicant ID:', data.id);
        console.log('\n🎉 The RLS policy is correctly configured (or at least allows inserts).');

        // Cleanup (Optional)
        console.log('Cleaning up test record...');
        const { error: delError } = await supabase.from('applicants').delete().eq('id', data.id);
        if (delError) console.warn('Cleanup failed (expected if delete RLS is restricted):', delError.message);
        else console.log('Cleanup successful.');
    }
}

testRlsFix();
