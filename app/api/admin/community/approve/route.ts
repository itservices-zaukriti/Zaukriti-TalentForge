import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Admin API to approve Community Referrer Requests
 * POST /api/admin/community/approve
 * Body: { requestId: string, authUserId?: string }
 */
export async function POST(req: NextRequest) {
    try {
        const { requestId, authUserId } = await req.json();

        // 1. Fetch Request Details
        const { data: request, error: fetchError } = await supabase
            .from('community_referrer_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (fetchError || !request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        if (request.status !== 'pending') {
            return NextResponse.json({ error: 'Request already processed' }, { status: 400 });
        }

        // 2. Generate Unique Referral Code: CR-XXXXXX
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            let randomPart = '';
            for (let i = 0; i < 6; i++) {
                randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            code = `CR-${randomPart}`;

            const { data: existing } = await supabase
                .from('community_referrers')
                .select('id')
                .eq('referral_code', code)
                .maybeSingle();

            if (!existing) isUnique = true;
            attempts++;
        }

        // 3. Promote to community_referrers
        // NOTE: This should ideally use the service role client in a real production environment
        // to bypass RLS and ensure the insert succeeds. 
        const { data: referrer, error: promoteError } = await supabase
            .from('community_referrers')
            .insert([{
                full_name: request.full_name,
                email: request.email,
                phone: request.phone,
                organization_name: request.organization_name,
                organization_type: request.organization_type,
                referral_code: code,
                auth_user_id: authUserId || null,
                status: 'active'
            }])
            .select()
            .single();

        if (promoteError) throw promoteError;

        // 4. Update Request Status
        await supabase
            .from('community_referrer_requests')
            .update({ status: 'approved', reviewed_at: new Date().toISOString() })
            .eq('id', requestId);

        return NextResponse.json({
            success: true,
            referralCode: code,
            profile: referrer
        });

    } catch (error: any) {
        console.error('Approval Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
