import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client to bypass RLS for checking code existence
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { code, email } = await req.json();

        if (!code) {
            return NextResponse.json({ valid: false, message: 'Code is required' }, { status: 400 });
        }

        // 1. Dual-source referral validation
        let isValid = false;
        let referrerEmail: string | null = null;

        const upperCode = code.toUpperCase();

        if (upperCode.startsWith('CR-')) {
            // Community referral
            const { data: comRef, error: comError } = await supabaseAdmin
                .from('community_referrers')
                .select('email, status')
                .eq('referral_code', upperCode)
                .maybeSingle();

            if (comRef && comRef.status === 'active') {
                isValid = true;
                referrerEmail = comRef.email;
            }
        } else {
            // Student referral
            const { data: refCode, error: refError } = await supabaseAdmin
                .from('referral_codes')
                .select('applicant_id, applicants(email)')
                .eq('code', upperCode)
                .maybeSingle();

            if (refCode && !refError) {
                isValid = true;
                referrerEmail = (refCode.applicants as any)?.email ?? null;
            }
        }

        // 2. Invalid referral
        if (!isValid) {
            return NextResponse.json({
                valid: false,
                message: 'Invalid Referral Code',
            });
        }

        // 3. Self-referral protection
        if (
            email &&
            referrerEmail &&
            email.toLowerCase() === referrerEmail.toLowerCase()
        ) {
            return NextResponse.json({
                valid: false,
                message: 'You cannot use your own referral code.',
            });
        }

        // 4. Success
        return NextResponse.json({
            valid: true,
            discount: 50,
            message: "Get ₹50 off for this paid internship salary program with job offer based on performance."
        });

    } catch (error: any) {
        console.error('Referral Validation Error:', error);
        return NextResponse.json({ valid: false, message: 'Server error' }, { status: 500 });
    }
}
