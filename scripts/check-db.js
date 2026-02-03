const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key) env[key.trim()] = valueParts.join('=').trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    console.log('Checking applicants.base_amount...');
    const { error: baseErr } = await supabase.from('applicants').select('base_amount').limit(1);
    // If error mentions column does not exist, we confirmed it.
    if (baseErr) console.log('base_amount Missing or Error:', baseErr.message);
    else console.log('base_amount OK');

    console.log('Checking wallet_ledger table...');
    const { error: tblErr } = await supabase.from('wallet_ledger').select('id').limit(1);
    if (tblErr) console.log('wallet_ledger Table Missing or Error:', tblErr.message);
    else {
        console.log('wallet_ledger Table OK');
        console.log('Checking wallet_ledger columns...');
        const { error: typeErr } = await supabase.from('wallet_ledger').select('type').limit(1);
        const { error: transErr } = await supabase.from('wallet_ledger').select('transaction_type').limit(1);

        console.log('wallet_ledger.type:', !typeErr ? 'OK' : 'Missing');
        console.log('wallet_ledger.transaction_type:', !transErr ? 'OK' : 'Missing');
    }
}

check();
