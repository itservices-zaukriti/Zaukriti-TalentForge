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
        // Prefer looking up by ID stored in notes (set during Order Creation)
        let applicantId = payment.notes?.applicant_id;

        let applicantQuery = supabase.from('applicants').select('*');

        if (applicantId) {
            applicantQuery = applicantQuery.eq('id', applicantId);
        } else {
            // Fallback to order_id if notes missing (legacy flow)
            applicantQuery = applicantQuery.eq('payment_order_id', orderId);
        }

        const { data: applicant, error: findError } = await applicantQuery.single();

        if (findError || !applicant) {
            console.error('Applicant not found for payload:', { orderId, applicantId });
            // We return 200 to acknowledge webhook, otherwise Razorpay retries
            return NextResponse.json({ status: 'ok', warning: 'Applicant not found' });
        }

        const alreadyPaid = applicant.payment_status === 'Paid' || applicant.payment_status === 'paid'; // Case insensitive check

        if (event.event === 'payment.captured') {
            // A. Update Payment Status (Idempotent update)
            await supabase
                .from('applicants')
                .update({
                    payment_status: 'Paid', // Normalize to Title Case or consistency
                    application_status: 'Active',
                    payment_id: payment.id,
                    payment_signature: signature,
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicant.id);

            // B. CONFIRM REFERRAL & CREDIT LEDGER (STRICT GOVERNANCE)
            // Rule: Governance active and not frozen
            if (PLATFORM_CONFIG.referral.governance.active && !PLATFORM_CONFIG.referral.governance.emergencyFreeze) {

                // --- 1. Resolve Pending Referral ---
                const { data: referral } = await supabase
                    .from('referrals')
                    .select('id, referrer_applicant_id, status')
                    .eq('referred_applicant_id', applicant.id)
                    .maybeSingle();

                if (referral?.referrer_applicant_id && referral.status !== 'confirmed' && referral.status !== 'void_self_referral') {
                    // --- 2. STRICT SELF-REFERRAL CHECK ---
                    // Fetch details of both Referrer and Referee (Applicant)
                    const { data: referrerUser } = await supabase
                        .from('applicants')
                        .select('user_id, email, full_name, phone')
                        .eq('id', referral.referrer_applicant_id)
                        .single();

                    // Referee details are in `applicant` object

                    const isSelfReferral =
                        (referrerUser?.user_id && referrerUser.user_id === applicant.user_id) || // Same Auth User
                        (referrerUser?.phone && applicant.phone && referrerUser.phone.replace(/\D/g, '') === applicant.phone.replace(/\D/g, '')); // Same Phone

                    if (isSelfReferral) {
                        console.warn(`⛔ [FRAUD_BLOCK] Self-referral detected. Payer: ${applicant.id}, CodeOwner: ${referral.referrer_applicant_id}`);
                        // Mark referral as void/fraud
                        await supabase
                            .from('referrals')
                            .update({ status: 'void_self_referral' })
                            .eq('id', referral.id);
                    }
                    else {
                        // --- 3. VALID CREDIT ---
                        // Update status to Confirmed
                        await supabase
                            .from('referrals')
                            .update({ status: 'confirmed' })
                            .eq('id', referral.id);

                        // Credit Referrer
                        if (referrerUser?.user_id) {
                            await supabase.from('wallet_ledger').insert([{
                                user_id: referrerUser.user_id,
                                registration_id: referral.referrer_applicant_id,
                                amount: 50,
                                type: 'credit',
                                reason: `Referral Bonus: ${applicant.full_name}`
                            }]);

                            // Send Email
                            const { sendReferralRewardEmail } = await import('@/lib/notifications');
                            await sendReferralRewardEmail(referrerUser.email, referrerUser.full_name, applicant.full_name);
                        }
                    }
                }

                // --- 4. COMMUNITY REFERRAL LOGIC ---
                // (Similar strict checks could be applied if community owners are also users, usually distinct)
                // Assuming Community Owners are distinct entities for now, but good to be safe.
                if (PLATFORM_CONFIG.communityReferral.enabled) {
                    const { data: commLink } = await supabase
                        .from('community_referral_links')
                        .select('id, community_referrer_id, status')
                        .eq('referred_applicant_id', applicant.id)
                        .maybeSingle(); // Check pending link

                    if (commLink?.community_referrer_id && commLink.status !== 'confirmed') {
                        await supabase
                            .from('community_referral_links')
                            .update({ status: 'confirmed' })
                            .eq('id', commLink.id);

                        await supabase.from('community_wallet_ledger').insert([{
                            community_referrer_id: commLink.community_referrer_id,
                            amount: 50,
                            type: 'credit',
                            description: `Referral of ${applicant.full_name} (${applicant.email})`
                        }]);
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
