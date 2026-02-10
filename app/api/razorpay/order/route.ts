import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import {
    checkEnrollmentStatus,
    getCurrentPricingFromDB,
    getPricingConfig
} from '@/lib/pricing';

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

        // 7. Check if Resume Mode (Applicant ID provided)
        let finalAmount;
        let baseAmount;
        let discount = 0;
        let gstAmount;
        let phaseName;

        if (reqBody.applicantId) {
            // RESUME MODE: Fetch from existing record to respect original locked price
            const { data: applicant } = await supabaseServiceRole
                .from('applicants')
                .select('amount_paid, base_amount, discount_amount, gst_amount, pricing_phase')
                .eq('id', reqBody.applicantId)
                .single();

            if (!applicant) throw new Error("Applicant record not found for resume payment.");

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
                // Unified Referral Check (Simulated for calculation - actual validation happens in /register for DB insert)
                // Or we re-verify here?
                // Let's assume passed code is valid if UI sent it, but we can double check db.
                // Actually, simpler: calculate discount if code is valid.
                // Ideally we call validateReferralCode here too.
                // Skipping deep verify for speed as /register confirms it.
                // Wait, this is creating the ORDER. We must verify here to give the discount in the order amount.
                let isValidRef = false;
                // ... (existing logic for checking ref code) ...
                // For now, let's keep it simple: if referralCode provided and valid, apply discount.
                // RE-USING logic from previous implementation if possible or re-writing robustly.

                // COPYING RELEVANT LOGIC FROM OLD IMPLEMENTATION:
                if (reqBody.referralCode.startsWith('CR-')) {
                    const { data } = await supabaseServiceRole // using service role for certainty
                        .from('community_referrers')
                        .select('id')
                        .eq('referral_code', reqBody.referralCode.toUpperCase())
                        .eq('status', 'active')
                        .maybeSingle();
                    if (data) isValidRef = true;
                } else {
                    // check std
                    const { count } = await supabaseServiceRole
                        .from('applicants')
                        .select('id', { count: 'exact', head: true })
                        .eq('referral_code', reqBody.referralCode) // case sensitive? usually upper
                        .neq('email', reqBody.email);
                    if (count) isValidRef = true;
                }

                if (isValidRef) discount = pricingConfig.referralDiscount;
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
                applicant_id: reqBody.applicantId || 'new'
            },
        });

        // 6️⃣ Response to frontend
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
