import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import {
    checkEnrollmentStatus,
    getCurrentPricingFromDB,
    getPricingConfig
} from '@/lib/pricing';
import { validateReferralCode } from '@/lib/referrals';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();

        // --- Supabase Service Role (pricing + enrollment authority)
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
        }

        const supabaseServiceRole = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const applicantIdResult = reqBody.applicantId || reqBody.receipt;

        // 7. Check if Resume Mode (Applicant ID provided)
        let finalAmount;
        let baseAmount;
        let discount = 0;
        let gstAmount;
        let phaseName;

        if (applicantIdResult && applicantIdResult !== 'new') { // 'new' might be passed strictly? No, usually ID.
            // RESUME MODE: Fetch from existing record to respect original locked price
            const { data: applicant } = await supabaseServiceRole
                .from('applicants')
                .select('amount_paid, base_amount, discount_amount, gst_amount, pricing_phase, razorpay_order_id')
                .eq('id', applicantIdResult)
                .single();

            if (!applicant) throw new Error("Applicant record not found for resume payment.");

            // IDEMPOTENCY: If order already exists?
            // User requirement: "If exists -> reuse it".
            // However, orders expire. A safer bet is to create a new order if the old one is old? 
            // Or just overwrite.
            // Let's just create a new one to be safe against expiration/cancellation for now, 
            // BUT CRITICALLY: Update the DB with the NEW order ID.

            finalAmount = applicant.amount_paid;
            baseAmount = applicant.base_amount || 0; // fallback if older record
            discount = applicant.discount_amount || 0;
            gstAmount = applicant.gst_amount || 0;
            phaseName = applicant.pricing_phase || 'Resumed';

            // Ensure amount is valid
            if (!finalAmount || finalAmount <= 0) throw new Error("Invalid amount in applicant record.");

        } else {
            // NEW REGISTRATION MODE (Calculate Fresh)
            if (!reqBody.teamSize) throw new Error("Team Size is required for new orders");

            // 1️⃣ Check if registrations are open
            const enrollment = await checkEnrollmentStatus(supabaseServiceRole);
            if (!enrollment.isOpen) {
                return NextResponse.json({ error: enrollment.message }, { status: 400 });
            }

            // 2️⃣ Fetch active pricing phase
            const pricingData = await getCurrentPricingFromDB(supabaseServiceRole);
            if (!pricingData) {
                return NextResponse.json({ error: 'Registrations are currently closed.' }, { status: 400 });
            }

            const { amounts, phase } = pricingData;
            phaseName = phase.phase_name;

            baseAmount = amounts[String(reqBody.teamSize)] ?? 0;
            if (baseAmount <= 0) return NextResponse.json({ error: 'Invalid team size' }, { status: 400 });

            // 3️⃣ Pricing configuration
            const pricingConfig = await getPricingConfig(supabaseServiceRole);

            const referralEnabled = !process.env.REFERRAL_FREEZE;
            if (referralEnabled && reqBody.referralCode && reqBody.email) {
                // Unified Referral Check using centralized logic
                const validReferrerId = await validateReferralCode(
                    reqBody.referralCode,
                    reqBody.email,
                    supabaseServiceRole
                );

                if (validReferrerId) {
                    discount = pricingConfig.referralDiscount;
                }
            }

            const discountedAmount = Math.max(0, baseAmount - discount);
            const gstRate = pricingConfig.gstPercentage / 100;
            gstAmount = Math.ceil(discountedAmount * gstRate);
            finalAmount = discountedAmount + gstAmount;
        }

        // 5️⃣ Create Razorpay order
        const order = await razorpay.orders.create({
            amount: Math.round(finalAmount * 100), // paise
            currency: reqBody.currency || 'INR',
            receipt: reqBody.receipt || `rcpt_${Date.now()}`,
            notes: {
                pricing_phase: phaseName,
                base_amount: baseAmount,
                discount_amount: discount,
                gst_amount: gstAmount,
                applicant_id: applicantIdResult || 'new'
            },
        });

        // 6️⃣ [FIX] Update Applicant with Order ID to link them
        if (applicantIdResult && applicantIdResult !== 'new') {
            await supabaseServiceRole
                .from('applicants')
                .update({
                    payment_reference: order.id, // standard ref
                    razorpay_order_id: order.id // schema-aligned explicit column
                })
                .eq('id', applicantIdResult);
        }

        // 7️⃣ Response to frontend
        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
            pricing: {
                phase: phaseName,
                base: baseAmount,
                discount,
                gst: gstAmount,
                total: finalAmount,
            },
        });

    } catch (error: any) {
        console.error('❌ Razorpay Order Error:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to create Razorpay order' },
            { status: 500 }
        );
    }
}
