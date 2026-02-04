import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendConfirmationEmail, sendFailureEmail } from '@/lib/notifications';
import { generateReferralCodeForApplicant } from '@/lib/referrals';
import { PLATFORM_CONFIG } from '@/app/utils/config';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');

        if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        // Initialize Service Role Client
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing service role key");
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Find the applicant
        const { data: applicant, error: findError } = await supabase
            .from('applicants')
            .select('*')
            .eq('payment_order_id', orderId)
            .single();

        if (findError || !applicant) {
            console.error('Applicant not found for order:', orderId);
            return NextResponse.json({ status: 'ok' });
        }

        const alreadyPaid = applicant.payment_status === 'paid';

        if (event.event === 'payment.captured') {
            // A. Update Payment Status
            await supabase
                .from('applicants')
                .update({
                    payment_status: 'paid',
                    application_status: 'active',
                    payment_id: payment.id,
                    payment_signature: signature,
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicant.id);

            // B. Confirm Referral & Credit Ledger (Check Governance)
            if (!alreadyPaid && PLATFORM_CONFIG.referral.governance.active && !PLATFORM_CONFIG.referral.governance.emergencyFreeze) {
                const { data: referral } = await supabase
                    .from('referrals')
                    .update({ status: 'confirmed' })
                    .eq('referred_applicant_id', applicant.id)
                    .select('referrer_applicant_id')
                    .maybeSingle();

                // Standard Referral Credit
                if (referral?.referrer_applicant_id) {
                    const { data: referrerUser } = await supabase
                        .from('applicants')
                        .select('user_id, email, full_name')
                        .eq('id', referral.referrer_applicant_id)
                        .single();

                    if (referrerUser?.user_id) {
                        await supabase.from('wallet_ledger').insert([{
                            user_id: referrerUser.user_id,
                            registration_id: referral.referrer_applicant_id,
                            amount: 50,
                            type: 'credit',
                            reason: `Referral Bonus: ${applicant.full_name}`
                        }]);
                        const { sendReferralRewardEmail } = await import('@/lib/notifications');
                        await sendReferralRewardEmail(referrerUser.email, referrerUser.full_name, applicant.full_name);
                    }
                }

                // Community Referral Credit
                if (PLATFORM_CONFIG.communityReferral.enabled) {
                    const { data: commLink } = await supabase
                        .from('community_referral_links')
                        .update({ status: 'confirmed' })
                        .eq('referred_applicant_id', applicant.id)
                        .select('community_referrer_id')
                        .maybeSingle();

                    if (commLink?.community_referrer_id) {
                        await supabase.from('community_wallet_ledger').insert([{
                            community_referrer_id: commLink.community_referrer_id,
                            amount: 50,
                            type: 'credit',
                            description: `Referral of ${applicant.full_name} (${applicant.email})`
                        }]);
                        // Note: We might want a specific email for Community Partners here locally or just rely on dashboard
                    }
                }
            }

            // D. Generate Referral Code (ZTF Format)
            // This function creates an entry in `referral_codes` table.
            const referralCode = await generateReferralCodeForApplicant(applicant.id);

            // CRITICAL: Also update the `applicants` table with this code as per user expectation/schema
            if (referralCode) {
                await supabase
                    .from('applicants')
                    .update({ referral_code: referralCode })
                    .eq('id', applicant.id);
            }

            if (!alreadyPaid) {
                await sendConfirmationEmail(applicant.email, applicant.full_name, applicant.track, referralCode);
            }
        }

        if (event.event === 'payment.failed') {
            await supabase.from('applicants').update({
                payment_status: 'failed',
                application_status: 'cancelled',
                updated_at: new Date().toISOString()
            }).eq('id', applicant.id);
            const { sendFailureEmail, sendAdminAlertEmail } = await import('@/lib/notifications');

            // 1. Notify User
            await sendFailureEmail(applicant.email, applicant.full_name);

            // 2. Alert Admin (Master Spec Requirement)
            await sendAdminAlertEmail({
                email: applicant.email,
                referralCode: applicant.applied_referral_code,
                paymentId: payment?.id,
                reason: payment?.error_description || 'Transaction Failed'
            });
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
