import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { generateReferralCodeForApplicant } from '@/lib/referrals';
import { sendConfirmationEmail } from '@/lib/notifications';
import { PLATFORM_CONFIG } from '@/app/utils/config';

export async function POST(req: NextRequest) {
    try {
        const { payment_id, order_id, signature, applicant_id } = await req.json();

        // 1. Verify Signature
        const text = order_id + "|" + payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(text)
            .digest('hex');

        const isAuthentic = expectedSignature === signature;

        if (!isAuthentic) {
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
        }

        // 2. Fetch current status to prevent duplicate notifications
        const { data: currentApplicant } = await supabase
            .from('applicants')
            .select('payment_status, email, full_name, track')
            .eq('id', applicant_id)
            .single();

        const alreadyPaid = currentApplicant?.payment_status === 'Paid';

        // 3. Update Applicant Record
        const { data: applicant, error: updateError } = await supabase
            .from('applicants')
            .update({
                payment_status: 'Paid',
                payment_id: payment_id,
                payment_signature: signature,
                application_status: 'Applied'
            })
            .eq('id', applicant_id)
            .select()
            .single();

        if (updateError) throw updateError;

        // 4. Confirm Referral & Credit Ledger (Check Governance)
        if (!alreadyPaid && PLATFORM_CONFIG.referral.governance.active && !PLATFORM_CONFIG.referral.governance.emergencyFreeze) {
            const { data: referral } = await supabase
                .from('referrals')
                .update({ status: 'confirmed' })
                .eq('referred_applicant_id', applicant_id)
                .select('referrer_applicant_id, status')
                .maybeSingle();

            // A. Credit REFERRER (₹50 bonus)
            if (referral?.referrer_applicant_id) {
                const { data: referrer } = await supabase
                    .from('applicants')
                    .select('user_id, email, full_name')
                    .eq('id', referral.referrer_applicant_id)
                    .single();

                if (referrer?.user_id) {
                    await supabase.from('wallet_ledger').insert([{
                        user_id: referrer.user_id,
                        registration_id: referral.referrer_applicant_id, // For context
                        amount: 50,
                        type: 'credit',
                        reason: `Referral Bonus: ${applicant.full_name}`
                    }]);
                    const { sendReferralRewardEmail } = await import('@/lib/notifications');
                    await sendReferralRewardEmail(referrer.email, referrer.full_name, applicant.full_name);
                }
            }

            // B. Credit REFEREE (₹50 instant cashback/joining bonus)
            if (applicant.user_id) {
                await supabase.from('wallet_ledger').insert([{
                    user_id: applicant.user_id,
                    registration_id: applicant.id,
                    amount: 50,
                    type: 'credit',
                    reason: 'Welcome/Referral Join Bonus'
                }]);
            }

            // C. Credit COMMUNITY REFERRER (if applicable)
            if (PLATFORM_CONFIG.communityReferral.enabled) {
                const { data: commLink } = await supabase
                    .from('community_referral_links')
                    .update({ status: 'confirmed' })
                    .eq('referred_applicant_id', applicant_id)
                    .select('community_referrer_id')
                    .maybeSingle();

                if (commLink?.community_referrer_id) {
                    await supabase.from('community_wallet_ledger').insert([{
                        community_referrer_id: commLink.community_referrer_id,
                        amount: 50,
                        type: 'credit',
                        description: `Referral of ${applicant.full_name} (${applicant.email})`
                    }]);
                }
            }
        }

        // 5. Generate Referral Code (Post-Payment)
        let referralCode = '';
        try {
            referralCode = await generateReferralCodeForApplicant(applicant_id);
        } catch (e) { console.error('Code gen failed:', e); }

        // 6. Send Confirmation Email
        if (!alreadyPaid) {
            await sendConfirmationEmail(applicant.email, applicant.full_name, applicant.track, referralCode);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Payment Verification Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
