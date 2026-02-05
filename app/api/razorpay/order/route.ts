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
        const {
            teamSize,
            currency = 'INR',
            receipt,
            referralCode,
            email,
        } = await req.json();

        if (!teamSize || !receipt) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // --- Supabase Service Role (pricing + enrollment authority)
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
        }

        const supabaseServiceRole = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1️⃣ Check if registrations are open
        const enrollment = await checkEnrollmentStatus(supabaseServiceRole);
        if (!enrollment.isOpen) {
            return NextResponse.json(
                { error: enrollment.message },
                { status: 400 }
            );
        }

        // 2️⃣ Fetch active pricing phase
        const pricingData = await getCurrentPricingFromDB(supabaseServiceRole);
        if (!pricingData) {
            return NextResponse.json(
                { error: 'Registrations are currently closed (no active phase).' },
                { status: 400 }
            );
        }

        const { amounts, phase } = pricingData;
        const phaseName = phase.phase_name;

        const baseAmount = amounts[String(teamSize)];
        if (!baseAmount || baseAmount <= 0) {
            return NextResponse.json(
                { error: 'Invalid team size selected' },
                { status: 400 }
            );
        }

        // 3️⃣ Pricing configuration (GST, referral discount)
        const pricingConfig = await getPricingConfig(supabaseServiceRole);

        let discount = 0;
        const referralEnabled = !process.env.REFERRAL_FREEZE;

        if (referralEnabled && referralCode && email) {
            // A) Community / Org referral
            if (referralCode.startsWith('CR-')) {
                const { supabase } = await import('@/lib/supabase');
                const { data } = await supabase
                    .from('community_referrers')
                    .select('id')
                    .eq('referral_code', referralCode.toUpperCase())
                    .eq('status', 'active')
                    .maybeSingle();

                if (data) {
                    discount = pricingConfig.referralDiscount;
                }
            } else {
                // B) Student referral
                const { validateReferralCode } = await import('@/lib/referrals');
                const referrerId = await validateReferralCode(referralCode, email);
                if (referrerId) {
                    discount = pricingConfig.referralDiscount;
                }
            }
        }

        // 4️⃣ Final pricing calculation
        const discountedAmount = Math.max(0, baseAmount - discount);
        const gstRate = pricingConfig.gstPercentage / 100;
        const gstAmount = Math.ceil(discountedAmount * gstRate);
        const finalAmount = discountedAmount + gstAmount;

        // 5️⃣ Create Razorpay order
        const order = await razorpay.orders.create({
            amount: finalAmount * 100, // paise
            currency,
            receipt,
            notes: {
                pricing_phase: phaseName,
                base_amount: baseAmount,
                discount_amount: discount,
                gst_amount: gstAmount,
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
