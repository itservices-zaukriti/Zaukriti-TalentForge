const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for verification

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFlow() {
    console.log('🚀 Starting Community Flow Verification (JS)...');

    const testEmail = `partner-${Date.now()}@example.com`;
    const studentEmail = `student-${Date.now()}@example.com`;

    try {
        // 1. Submit Request
        console.log('\n1. Submitting Partner Request...');
        const { data: request, error: reqError } = await supabase
            .from('community_referrer_requests')
            .insert([{
                full_name: 'JS Verify Partner',
                email: testEmail,
                organization_name: 'JS Uni',
                organization_type: 'University'
            }])
            .select()
            .single();

        if (reqError) throw reqError;
        console.log('✅ Request submitted. ID:', request.id);

        // 2. Approve Request
        console.log('\n2. Approving Request...');
        const referralCode = `CR-VERIFY${Math.floor(Math.random() * 1000)}`;
        const { data: partner, error: partError } = await supabase
            .from('community_referrers')
            .insert([{
                full_name: request.full_name,
                email: request.email,
                organization_name: request.organization_name,
                organization_type: request.organization_type,
                referral_code: referralCode,
                status: 'active'
            }])
            .select()
            .single();

        if (partError) throw partError;
        console.log('✅ Partner promoted. Code:', partner.referral_code);

        await supabase
            .from('community_referrer_requests')
            .update({ status: 'approved', reviewed_at: new Date().toISOString() })
            .eq('id', request.id);

        // 3. Register Student
        console.log('\n3. Registering Student...');
        const { data: applicant, error: appError } = await supabase
            .from('applicants')
            .insert([{
                full_name: 'JS Verify Student',
                email: studentEmail,
                track: 'AI & Intelligence',
                applied_referral_code: referralCode,
                payment_status: 'Pending',
                amount_paid: 949
            }])
            .select()
            .single();

        if (appError) throw appError;
        console.log('✅ Student registered. ID:', applicant.id);

        await supabase
            .from('community_referral_links')
            .insert([{
                community_referrer_id: partner.id,
                referred_applicant_id: applicant.id,
                status: 'pending'
            }]);

        // 4. Confirm Payment & Credit
        console.log('\n4. Confirming Payment & Credit...');
        await supabase
            .from('applicants')
            .update({ payment_status: 'Paid' })
            .eq('id', applicant_id = applicant.id);

        await supabase
            .from('community_referral_links')
            .update({ status: 'confirmed' })
            .eq('referred_applicant_id', applicant.id);

        const { data: credit, error: creditError } = await supabase
            .from('community_wallet_ledger')
            .insert([{
                community_referrer_id: partner.id,
                amount: 50,
                type: 'credit',
                description: `Referral of ${applicant.full_name}`
            }])
            .select()
            .single();

        if (creditError) throw creditError;
        console.log('✅ Ledger credited. Transaction ID:', credit.id);

        // 5. Final Check
        const { data: ledgerEntries } = await supabase
            .from('community_wallet_ledger')
            .select('amount')
            .eq('community_referrer_id', partner.id);

        const balance = ledgerEntries.reduce((acc, curr) => acc + curr.amount, 0);
        console.log('\n💰 Final Balance:', balance);

        if (balance === 50) {
            console.log('\n✨ VERIFICATION SUCCESSFUL');
        } else {
            console.log('\n❌ VERIFICATION FAILED: Balance mismatch.');
        }

    } catch (err) {
        console.error('❌ Error during verification:', err.message);
    }
}

verifyFlow();
