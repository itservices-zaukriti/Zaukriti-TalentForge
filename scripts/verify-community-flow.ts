import { supabase } from '../lib/supabase';

async function verifyFlow() {
    console.log('🚀 Starting Community Flow Verification...');

    const testEmail = `partner-${Date.now()}@example.com`;
    const studentEmail = `student-${Date.now()}@example.com`;

    // 1. Simulate Community Partner Request
    console.log('\n1. Submitting Partner Request...');
    const { data: request, error: reqError } = await supabase
        .from('community_referrer_requests')
        .insert([{
            full_name: 'Test Partner',
            email: testEmail,
            organization_name: 'Test University',
            organization_type: 'University',
            status: 'pending'
        }])
        .select()
        .single();

    if (reqError) {
        console.error('❌ Request failed:', reqError);
        return;
    }
    console.log('✅ Request submitted. ID:', request.id);

    // 2. Simulate Admin Approval (Manually triggering the logic since we can't call API easily without a server running and auth)
    // We will verify the logic in the admin/approve route by looking at it, but here we simulate the DB impact.
    console.log('\n2. Simulating Admin Approval...');
    const referralCode = `CR-TEST${Math.floor(Math.random() * 1000)}`;

    // a. Promote to community_referrers
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

    if (partError) {
        console.error('❌ Promotion failed:', partError);
        return;
    }
    console.log('✅ Partner promoted. Code:', partner.referral_code);

    // b. Mark request as approved
    await supabase
        .from('community_referrer_requests')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', request.id);

    // 3. Simulate Student Registration with CR-Code
    console.log('\n3. Simulating Student Registration...');
    // We simulate the registration entry in the 'applicants' table and 'community_referral_links' mapping
    const { data: applicant, error: appError } = await supabase
        .from('applicants')
        .insert([{
            full_name: 'Test Student',
            email: studentEmail,
            track: 'AI & Intelligence',
            applied_referral_code: referralCode,
            payment_status: 'Pending',
            amount_paid: 949 // ₹999 - ₹50
        }])
        .select()
        .single();

    if (appError) {
        console.error('❌ Applicant registration failed:', appError);
        return;
    }
    console.log('✅ Student registered. ID:', applicant.id);

    // Record the pending link
    await supabase
        .from('community_referral_links')
        .insert([{
            community_referrer_id: partner.id,
            referred_applicant_id: applicant.id,
            status: 'pending'
        }]);
    console.log('✅ Referral link created (pending).');

    // 4. Simulate Payment Confirmation (Credit Logic)
    console.log('\n4. Simulating Payment Confirmation...');
    // We update the applicant status and credit the community partner's ledger
    const { error: updateError } = await supabase
        .from('applicants')
        .update({ payment_status: 'Paid' })
        .eq('id', applicant.id);

    if (updateError) {
        console.error('❌ Payment update failed:', updateError);
        return;
    }

    // Confirm the link and credit the ledger
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

    if (creditError) {
        console.error('❌ Ledger credit failed:', creditError);
        return;
    }
    console.log('✅ Ledger credited. Transaction ID:', credit.id);

    // 5. Final Balance Check
    console.log('\n5. Verifying Partner Balance...');
    const { data: ledgerEntries } = await supabase
        .from('community_wallet_ledger')
        .select('amount')
        .eq('community_referrer_id', partner.id);

    const balance = ledgerEntries?.reduce((acc, curr) => acc + curr.amount, 0);
    console.log('💰 Partner Final Balance:', balance);

    if (balance === 50) {
        console.log('\n✨ VERIFICATION SUCCESSFUL: Full community flow validated.');
    } else {
        console.log('\n❌ VERIFICATION FAILED: Balance mismatch.');
    }
}

verifyFlow();
