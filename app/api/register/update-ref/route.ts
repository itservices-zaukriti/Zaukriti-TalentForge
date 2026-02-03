import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Updates applicant record with payment order ID before Razorpay redirect.
 * CRITICAL: Uses public client to match RLS policies.
 */
export async function POST(req: NextRequest) {
    try {
        const { id, payment_reference } = await req.json();

        // CRITICAL: Use Service Role client to bypass RLS
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error("❌ FATAL: SUPABASE_SERVICE_ROLE_KEY is not set");
            throw new Error("Server configuration error: Missing service role key");
        }

        const supabaseServiceRole = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabaseServiceRole
            .from('applicants')
            .update({
                payment_order_id: payment_reference,
                payment_status: 'pending', // Razorpay initiated
                application_status: 'pending_payment',
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error('Update Ref Error (RLS):', error);
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update Ref Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
