import { supabase } from '../lib/supabase';

async function verifySetup() {
    console.log('--- Zaukriti E2E Setup Verification ---');

    // 1. Check Supabase
    try {
        const { data, error } = await supabase.from('applicants').select('count');
        if (error) {
            console.error('❌ Supabase Connection Failed:', error.message);
            console.log('Tip: Ensure you have run the migrations in supabase_schema.sql, migration_v2.sql and final_sync.sql');
        } else {
            console.log('✅ Supabase Connection: Success');
        }
    } catch (e: any) {
        console.error('❌ Unexpected Supabase Error:', e.message);
    }

    // 2. Check Referrals Table
    try {
        const { error } = await supabase.from('referrals').select('count');
        if (error) {
            console.error('❌ Referrals table missing. Please run 20260201_referrals.sql');
        } else {
            console.log('✅ Referrals Table: Found');
        }
    } catch (e: any) {
        console.error('❌ Unexpected Referrals Error:', e.message);
    }

    console.log('\n--- Manual Verification Steps ---');
    console.log('1. Run the migrations in Supabase dashboard (SQL Editor).');
    console.log('2. Start the dev server: npm run dev');
    console.log('3. Open http://localhost:3000/apply');
    console.log('4. Fill the form and proceed to payment.');
    console.log('5. Verify the applicant record is created in Supabase (status: Pending).');
}

verifySetup();
