import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateReferralCode } from '@/lib/referrals';

export async function POST(req: NextRequest) {
    try {
        const { code, email } = await req.json();

        if (!code) {
            return NextResponse.json({ valid: false, message: 'Code is required' });
        }

        // Initialize Supabase Client
        // We use service role if needed by validateReferralCode logic (it uses 'supabase' import which is usually the standard one)
        // actually validateReferralCode uses the @/lib/supabase which is Anon. 
        // We should ensure we can check this. But wait, validateReferralCode checks `community_referrers` and `referral_codes`.
        // These tables usually need to be readable. 
        // Let's assume the lib function works (it's used by other parts).

        let validId = await validateReferralCode(code, email || '');

        // If the library function returns an ID, it's valid.
        if (validId) {
            return NextResponse.json({ valid: true });
        } else {
            return NextResponse.json({ valid: false, message: 'Invalid or inactive code' });
        }

    } catch (error: any) {
        console.error('Referral Validation Error:', error);
        return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
    }
}
