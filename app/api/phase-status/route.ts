import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentActivePhase } from '@/lib/pricing';

export const dynamic = 'force-dynamic'; // Ensure no caching

export async function GET(req: NextRequest) {
    try {
        // Initialize public anon client (RLS applies, but pricing_phases is likely public read)
        // OR better: use Service Role or Anon with correct policy. 
        // Pricing phases are public info. 
        // We Use SERVICE_ROLE to be absolutely sure we get the Single Source of Truth 
        // regardless of RLS mishaps on public read, although Anon is safer practice.
        // Given this is a utility endpoint returning public data (phase status), 
        // Anon is fine if RLS is set up. 
        // But prompt emphasizes "Backend (source of truth)". 
        // Let's use the standard supabase client helper if available, or create one.
        // The existing code uses createClient manually in many places.

        let supabase;

        // Use Service Role if available for authoritative check, or public.
        // Since this exposes "Phase is Open", it's public info.
        // We'll use service role to avoid any RLS filtering issues (like "only show active" if RLS does that)
        // effectively executing the Logic in Code, not DB RLS.
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
        } else {
            supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
        }

        const activePhase = await getCurrentActivePhase(supabase);

        if (!activePhase) {
            // Check for UPCOMING phase to distinguish "Closed" vs "Coming Soon"
            const now = new Date().toISOString();
            const { data: upcoming } = await supabase
                .from('pricing_phases')
                .select('*')
                .gt('start_date', now)
                .eq('is_active', true)
                .order('start_date', { ascending: true })
                .limit(1);

            return NextResponse.json({
                isOpen: false,
                message: "Registrations are currently closed.",
                phase: null,
                nextPhase: upcoming && upcoming.length > 0 ? upcoming[0] : null
            });
        }

        return NextResponse.json({
            isOpen: true,
            message: "Registrations are Live",
            phase: activePhase
        });

    } catch (error: any) {
        console.error("Phase Status Error:", error);
        return NextResponse.json({ isOpen: false, error: error.message }, { status: 500 });
    }
}
