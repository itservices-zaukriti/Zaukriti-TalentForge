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

        // Initialize Service Role Client to Bypass RLS
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 2. Fetch current status (Use Service Role)
        const { data: currentApplicant } = await supabaseAdmin
            .from('applicants')
            .select('payment_status, email, full_name, track, phone')
            .eq('id', applicant_id)
            .maybeSingle();

        const alreadyPaid = currentApplicant?.payment_status === 'Paid';

        // 3. Update Applicant Record (Use Service Role)
        const { data: applicant, error: updateError } = await supabaseAdmin
            .from('applicants')
            .update({
                payment_status: 'Paid',
                payment_id: payment_id,
                payment_signature: signature,
                application_status: 'Applied'
            })
            .eq('id', applicant_id)
            .select() // Returning *
            .single(); // Here single() is fine if update succeeds on 1 row

        if (updateError) throw updateError;

        // 4. Generate Referral Code (Immediate UI Feedback)
        let referralCode = applicant.referral_code;
        if (!referralCode) {
            // Pass service role client
            referralCode = await generateReferralCodeForApplicant(applicant.id, supabaseAdmin);
            if (referralCode) {
                await supabaseAdmin
                    .from('applicants')
                    .update({ referral_code: referralCode })
                    .eq('id', applicant.id);
            }
        }

        // 5. Send Confirmation Email (Immediate Feedback)
        // We do this here to ensure the user gets the email even if Webhooks fail or are on Localhost.
        // We check if we already sent it (though usually safe to re-send in edge cases, 
        // ideally we'd have a 'email_sent' flag, but 'alreadyPaid' check handles most races).

        if (!alreadyPaid) {
            // Run in background so we don't block the UI response
            // (In Vercel Serverless, we must await, or use waitUntil. For safety we await).
            console.log(`📧 [UI_VERIFY] Sending confirmation email to ${applicant.email}...`);
            await sendConfirmationEmail(applicant.email, applicant.full_name, applicant.track, referralCode || 'PENDING', applicant.phone);
        } else {
            console.log(`ℹ️ [UI_VERIFY] Email likely already sent (Payment was already marked Paid).`);
        }

        // 6. CREDIT REFERRAL REWARDS (Localhost/Immediate Support)
        // We replicate Webhook logic here safely to ensure rewards work even if Webhooks fail.
        if (!alreadyPaid && PLATFORM_CONFIG.referral.governance.active) {
            console.log(`💰 [UI_VERIFY] Processing Referral Rewards...`);

            // A. Find Pending Referral
            const { data: referral } = await supabaseAdmin
                .from('referrals')
                .select('id, referrer_applicant_id, status')
                .eq('referred_applicant_id', applicant.id)
                .maybeSingle();

            if (referral?.referrer_applicant_id && referral.status !== 'confirmed') {
                // B. Validate Self-Referral
                const { data: referrerUser } = await supabaseAdmin
                    .from('applicants')
                    .select('user_id, email, full_name, phone')
                    .eq('id', referral.referrer_applicant_id)
                    .single();

                const isSelfReferral = (referrerUser?.user_id && referrerUser.user_id === applicant.user_id);

                if (isSelfReferral) {
                    console.warn(`⛔ [FRAUD] Self-referral blocked in UI Verify.`);
                    await supabaseAdmin.from('referrals').update({ status: 'void_self_referral' }).eq('id', referral.id);
                } else {
                    // C. Confirm Referral
                    await supabaseAdmin.from('referrals').update({ status: 'confirmed' }).eq('id', referral.id);

                    // D. Credit Wallet
                    if (referrerUser?.user_id) {
                        await supabaseAdmin.from('wallet_ledger').insert([{
                            user_id: referrerUser.user_id,
                            registration_id: referral.referrer_applicant_id,
                            amount: 50,
                            type: 'credit',
                            reason: `Referral Bonus: ${applicant.full_name}`
                        }]);

                        // E. Send Reward Email
                        const { sendReferralRewardEmail } = await import('@/lib/notifications');
                        console.log(`📧 [UI_VERIFY] Sending Reward Email to Referrer: ${referrerUser?.email}`);
                        if (referrerUser?.email) {
                            await sendReferralRewardEmail(referrerUser.email, referrerUser.full_name, applicant.full_name);
                        }
                    }
                }
            }
        }

        console.log(`✅ [UI_VERIFY] Payment verified & Rewards processed for ${applicant_id}.`);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Payment Verification Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
