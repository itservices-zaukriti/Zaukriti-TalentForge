import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import { checkEnrollmentStatus, getCurrentPricingFromDB, getPricingConfig } from '@/lib/pricing';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const { teamSize, currency = 'INR', receipt, referralCode, email } = await req.json();

        // Initialize Service Role Client for Pricing Logic
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing service role key");
        }
        const supabaseServiceRole = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Check Enrollment
        const enrollment = await checkEnrollmentStatus(supabaseServiceRole);
        if (!enrollment.isOpen) {
            return NextResponse.json({ error: enrollment.message }, { status: 400 });
        }

        // 2. Get Pricing from DB
        const pricingData = await getCurrentPricingFromDB(supabaseServiceRole);
        if (!pricingData) {
            return NextResponse.json({ error: 'Registrations are currently closed (No Phase).' }, { status: 400 });
        }

        const pricingConfig = await getPricingConfig(supabaseServiceRole);
        const { amounts } = pricingData;

        let validatedAmount = amounts[teamSize.toString()] ?? 0;

        if (!validatedAmount) {
            return NextResponse.json({ error: 'Invalid team size' }, { status: 400 });
        }

        // Verify Referral and Apply Discount
        // Check governance
        const isReferralActive = !process.env.REFERRAL_FREEZE; // Simple env check or config
        let discount = 0;

        if (referralCode && email && isReferralActive !== false) {
            // A. Check Community Code
            if (referralCode.startsWith('CR-')) {
                const { supabase } = await import('@/lib/supabase');
                const { data: commRef } = await supabase
                    .from('community_referrers')
                    .select('id')
                    .eq('referral_code', referralCode.toUpperCase())
                    .eq('status', 'active')
                    .maybeSingle();

                if (commRef) discount = pricingConfig.referralDiscount;
            } else {
                // B. Check Student Code
                const { validateReferralCode } = await import('@/lib/referrals');
                const referrerId = await validateReferralCode(referralCode, email);
                if (referrerId) discount = pricingConfig.referralDiscount;
            }
        }

        // Pricing Calculation (Master Logic)
        const discountedPrice = Math.max(0, validatedAmount - discount);
        const gstRate = pricingConfig.gstPercentage / 100.0;
        const gstAmount = Math.ceil(discountedPrice * gstRate);
        const finalAmount = discountedPrice + gstAmount;

        const options = {
            amount: finalAmount * 100, // Amount in paise
            currency,
            receipt,
            notes: {
                base_amount: validatedAmount,
                discount_amount: discount,
                gst_amount: gstAmount
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID, // Frontend uses this to initialize checkout
            pricing: {
                base: validatedAmount,
                discount,
                gst: gstAmount,
                total: finalAmount
            }
        });
    } catch (error: any) {
        console.error('Razorpay Order Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
