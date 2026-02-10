
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPaymentPendingNotification, sendConfirmationEmail } from '@/lib/notifications';

// CONFIG
const NOTIFICATIONS_ENABLED = true; // Global Kill Switch
const MAX_BATCH_SIZE = 50;

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    // 1. Security Check (CRON_SECRET)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!NOTIFICATIONS_ENABLED) {
        return NextResponse.json({ status: 'skipped', reason: 'global_off' });
    }

    try {
        const results = {
            queued: 0,
            processed: 0,
            errors: [] as string[]
        };

        // --- STEP 1: QUEUE NEW EVENTS (DETECTION) ---

        // A. Payment Pending Reminders
        // Criteria: Payment 'created', App Status 'pending_payment', Created 15m - 24h ago
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: abandonedApplicants, error: fetchError } = await supabaseAdmin
            .from('applicants')
            .select('id, user_id, email, full_name, phone, application_status')
            .eq('payment_status', 'created')
            .eq('application_status', 'pending_payment')
            .lt('created_at', fifteenMinutesAgo)
            .gt('created_at', twentyFourHoursAgo)
            .limit(50);

        if (fetchError) throw fetchError;

        if (abandonedApplicants && abandonedApplicants.length > 0) {
            for (const app of abandonedApplicants) {
                // Idempotency Check: Did we already queue/send a reminder?
                const { data: existingEvent } = await supabaseAdmin
                    .from('notification_events')
                    .select('id')
                    .eq('applicant_id', app.id)
                    .eq('event_type', 'payment_pending')
                    .single();

                if (!existingEvent) {
                    // Create Event
                    await supabaseAdmin
                        .from('notification_events')
                        .insert({
                            user_id: app.user_id,
                            applicant_id: app.id,
                            channel: 'email', // Default, logic might add whatsapp later
                            event_type: 'payment_pending',
                            status: 'pending',
                            metadata: {
                                email: app.email,
                                name: app.full_name,
                                phone: app.phone,
                                resumeLink: `${process.env.NEXT_PUBLIC_BASE_URL}/apply/pay/${app.id}`
                            }
                        });
                    results.queued++;

                    // Also queue WhatsApp if phone exists? 
                    // For simplicity, handle both in one processor or create two events?
                    // Let's stick to one event 'payment_pending' and the processor handles channels.
                }
            }
        }

        // B. Missed Confirmations (Fallback)
        // Criteria: Paid, but not marked 'Applied' or notification missing
        // (Skipping for brevity in this iteration, focusing on Payment Pending)


        // --- STEP 2: PROCESS PENDING EVENTS ---

        const { data: pendingEvents, error: eventError } = await supabaseAdmin
            .from('notification_events')
            .select('*')
            .eq('status', 'pending')
            .limit(MAX_BATCH_SIZE);

        if (eventError) throw eventError;

        if (pendingEvents && pendingEvents.length > 0) {
            for (const event of pendingEvents) {
                const { metadata, event_type, id } = event;
                let success = false;
                let logs: any = {};

                if (event_type === 'payment_pending') {
                    // Trigger Logic
                    const result = await sendPaymentPendingNotification(
                        metadata.email,
                        metadata.phone,
                        metadata.name,
                        metadata.resumeLink
                    );
                    success = result.email || result.message; // At least one succeeded
                    logs = result;
                }

                // Update Event Status
                if (success) {
                    await supabaseAdmin
                        .from('notification_events')
                        .update({
                            status: 'sent',
                            sent_at: new Date().toISOString(),
                            metadata: { ...metadata, logs }
                        })
                        .eq('id', id);

                    results.processed++;

                    // Secondary: Update Applicant Status if needed
                    if (event.applicant_id) {
                        await supabaseAdmin
                            .from('applicants')
                            .update({ application_status: 'payment_reminder_sent' })
                            .eq('id', event.applicant_id);
                    }

                } else {
                    await supabaseAdmin
                        .from('notification_events')
                        .update({
                            status: 'failed',
                            metadata: { ...metadata, logs }
                        })
                        .eq('id', id);
                    results.errors.push(`Failed event ${id}`);
                }
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error: any) {
        console.error('Cron Job Failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
