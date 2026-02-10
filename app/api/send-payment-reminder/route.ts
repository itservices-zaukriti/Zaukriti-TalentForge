import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPaymentPendingNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
    try {
        const { applicantId } = await req.json();

        if (!applicantId) {
            return NextResponse.json({ error: 'Applicant ID is required' }, { status: 400 });
        }

        // Initialize Service Role Client
        const supabaseServiceRole = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Fetch User Info
        const { data: applicant, error } = await supabaseServiceRole
            .from('applicants')
            .select('id, email, phone, full_name, payment_status')
            .eq('id', applicantId)
            .single();

        if (error || !applicant) {
            console.error("Applicant lookup failed:", error);
            return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
        }

        if (applicant.payment_status === 'Paid') {
            return NextResponse.json({ message: 'User already paid' });
        }

        // Generate Resume Link
        const origin = req.headers.get('origin') || 'https://zaukriti.ai';
        const resumeLink = `${origin}/apply/pay/${applicant.id}`;

        // Send Notification
        await sendPaymentPendingNotification(
            applicant.email,
            applicant.phone,
            applicant.full_name,
            resumeLink
        );

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Payment Reminder Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
