import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendCommunityWelcomeEmail } from '@/lib/notifications';

// Initialize Admin Client for reliable DB operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Handles Community Referrer (College Ambassador) Registration
 * POST /api/community/register
 */
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { fullName, email, phone, organizationName, organizationType } = data;

        // STEP 1: Validate input
        if (!email || !organizationName || !organizationType || !fullName) {
            return NextResponse.json(
                { success: false, error: 'INVALID_INPUT', message: 'Please fill all required fields.' },
                { status: 400 }
            );
        }

        // STEP 2: Check for Existing Registration
        const { data: existing } = await supabaseAdmin
            .from('community_referrers')
            .select('id, referral_code, status')
            .eq('email', email)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({
                success: true,
                state: 'ALREADY_EXISTS',
                message: 'You are already registered.',
                referralCode: existing.referral_code
            });
        }

        // STEP 3: Generate Unique Referral Code
        const orgMap: Record<string, string> = {
            'College': 'COL',
            'University': 'UNI',
            'Community': 'COM',
            'Institute': 'INS',
            'Company': 'CORP'
        };
        const orgCode = orgMap[organizationType] || 'COM';
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

        let referralCode = '';
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 5) {
            let randomPart = '';
            for (let i = 0; i < 6; i++) {
                randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            referralCode = `CR-${orgCode}-${randomPart}`;

            const { data: conflict } = await supabaseAdmin
                .from('community_referrers')
                .select('id')
                .eq('referral_code', referralCode)
                .maybeSingle();

            if (!conflict) isUnique = true;
            attempts++;
        }

        if (!isUnique) throw new Error('Failed to generate unique code. Please try again.');

        // STEP 4: Insert into community_referrers
        const { data: newReferrer, error: insertError } = await supabaseAdmin
            .from('community_referrers')
            .insert({
                full_name: fullName,
                email,
                phone: phone || null,
                organization_name: organizationName,
                organization_type: organizationType,
                referral_code: referralCode,
                status: 'active'
            })
            .select('id')
            .single();

        if (insertError) {
            console.error('Community insert failed:', insertError);
            return NextResponse.json(
                { success: false, error: 'DB_INSERT_FAILED', message: insertError.message },
                { status: 500 }
            );
        }

        // STEP 5: Trigger Email
        await sendCommunityWelcomeEmail(email, fullName, organizationName, referralCode);

        // STEP 6: Success Response
        return NextResponse.json({
            success: true,
            state: 'CREATED',
            message: 'Registration successful! Referral code generated.',
            referralCode,
            communityId: newReferrer.id
        });

    } catch (error: any) {
        console.error('Community Registration System Error:', error);
        return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR', message: error.message }, { status: 500 });
    }
}
