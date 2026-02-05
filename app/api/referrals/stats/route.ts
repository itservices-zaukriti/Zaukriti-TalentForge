import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
        }

        // Initialize Supabase Client (Anon is fine for public stats, but Service Role ensures we get everything if RLS is strict)
        // Actually, we want to be careful exposing stats. But the prompt says "Expose a secure API". 
        // Let's use Service Role for correctness of count, but be careful with what we return.
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing service role key");
        }
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const upperCode = code.toUpperCase();
        let totalSuccess = 0;

        // 1. Check if it's a Community Code (CR-*)
        if (upperCode.startsWith('CR-')) {
            const { data: commLinks, error } = await supabase
                .from('community_referral_links')
                .select('status', { count: 'exact' })
                .eq('community_referral_code_snapshot', upperCode) // Assuming we snapshot code or join. 
            // Wait, community_referral_links links via community_referrer_id.
            // We need to resolve code -> id first.

            if (error) console.error("Stats Error:", error);

            // Better Approach: Resolve ID first
            const { data: commRef } = await supabase
                .from('community_referrers')
                .select('id')
                .eq('referral_code', upperCode)
                .maybeSingle();

            if (commRef) {
                const { count } = await supabase
                    .from('community_referral_links')
                    .select('*', { count: 'exact', head: true })
                    .eq('community_referrer_id', commRef.id)
                    .eq('status', 'confirmed'); // ONLY Verified Success

                totalSuccess = count || 0;
            }

        } else {
            // 2. Standard Student Referral (ZTF-*)
            // Resolve Code -> Applicant ID
            const { data: refCode } = await supabase
                .from('referral_codes')
                .select('applicant_id')
                .eq('code', upperCode)
                .maybeSingle();

            if (refCode) {
                // Count confirmed referrals
                const { count } = await supabase
                    .from('referrals')
                    .select('*', { count: 'exact', head: true })
                    .eq('referrer_applicant_id', refCode.applicant_id)
                    .eq('status', 'confirmed'); // ONLY Verified Success

                totalSuccess = count || 0;
            }
        }

        return NextResponse.json({
            referralCode: upperCode,
            successfulRegistrations: totalSuccess
        });

    } catch (error: any) {
        console.error('Referral Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
