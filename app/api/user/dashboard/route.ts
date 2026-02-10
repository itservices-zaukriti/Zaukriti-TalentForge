import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getTimelineStatus, getProgramPhase, ProgramPhase } from '@/lib/lifecycle';

export async function GET(req: NextRequest) {
    try {
        // 1. Validate Auth Token (Strict)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');

        // Use a focused client to validate the JWT
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch User Data (Service Role to bypass RLS and ensure correctness)
        // We TRUST the token -> email mapping from Supabase Auth.
        // We LINK to applicants table via email.
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Server configuration error');
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 3. Get Applicant Record
        const { data: applicant, error: applicantError } = await supabaseAdmin
            .from('applicants')
            .select('id, full_name, email, track, payment_status, amount_paid, pricing_phase, referral_code')
            .eq('email', user.email)
            .maybeSingle();

        if (applicantError) throw applicantError;

        if (!applicant) {
            return NextResponse.json({ error: 'Applicant record not found' }, { status: 403 });
        }

        // 3.5. Fetch Eligibility Status (Additive)
        const { data: eligibility, error: eligError } = await supabaseAdmin
            .from('user_eligibility')
            .select('eligibility_status, batch_assigned, education_level')
            .eq('applicant_id', applicant.id)
            .maybeSingle();

        if (eligError) console.error("Eligibility fetch error:", eligError);

        // 3.6. Fetch Problem Selection (Additive)
        const { data: selection, error: selError } = await supabaseAdmin
            .from('user_problem_selection')
            .select('problem_id, selected_at, problem:problem_statements(id, title, short_description, domain)')
            .eq('applicant_id', applicant.id)
            .maybeSingle();

        // 3.8. Fetch Assignment Submission (Additive - April)
        const { data: submission, error: subError } = await supabaseAdmin
            .from('user_submissions')
            .select('id, submitted_at, write_up_url, video_url')
            .eq('applicant_id', applicant.id)
            .maybeSingle();

        // 3.9. Fetch Evaluation Outcome (Additive - May)
        const { data: evaluation, error: evalError } = await supabaseAdmin
            .from('evaluation_outcomes')
            .select('status')
            .eq('applicant_id', applicant.id)
            .maybeSingle();

        // 3.10. Fetch Certificates (Additive - June)
        let certificates: any[] = [];
        const currentPhase = getProgramPhase(); // System Time

        if (currentPhase === ProgramPhase.RESULTS) {
            const { data: certs } = await supabaseAdmin
                .from('certificates')
                .select('certificate_type, certificate_url, issued_at')
                .eq('applicant_id', applicant.id);
            certificates = certs || [];
        }

        // 3.7. List Available Problems (Only if Phase allows & Not Selected)
        let availableProblems: any[] = [];

        if (currentPhase === ProgramPhase.PROBLEM_SELECTION && !selection) {
            const { data: problems } = await supabaseAdmin
                .from('problem_statements')
                .select('id, title, short_description, domain, batch_level')
                .eq('is_active', true);

            availableProblems = (problems || []).filter((p: any) => !p.batch_level || (eligibility?.batch_assigned && p.batch_level === eligibility.batch_assigned));
        }

        // 4. Check Payment Status (The Gate)
        const isPaid = (applicant.payment_status === 'Paid' || applicant.payment_status === 'captured') && (applicant.amount_paid > 0);

        if (!isPaid) {
            return NextResponse.json({ error: 'Access not yet enabled for this account.' }, { status: 403 });
        }

        // 5. Get Referral Stats
        const { count: referralCount, error: refError } = await supabaseAdmin
            .from('referrals')
            .select('*', { count: 'exact', head: true })
            .eq('referrer_applicant_id', applicant.id)
            .eq('status', 'confirmed'); // Only confirmed referrals count

        if (refError) console.error("Referral count error:", refError);

        // 6. Return Dashboard Data (Phase-0 View)
        return NextResponse.json({
            profile: {
                name: applicant.full_name,
                email: applicant.email,
                track: applicant.track,
                phase: applicant.pricing_phase,
                paymentStatus: applicant.payment_status,
                // New Eligibility Fields (Read-Only)
                eligibilityStatus: eligibility?.eligibility_status || 'Under Review',
                batchLabel: eligibility?.batch_assigned ? `Batch: ${eligibility.batch_assigned.toUpperCase()}` : 'Batch Assignment Pending'
            },
            problemSelection: {
                selected: !!selection, // boolean flag
                data: selection ? selection.problem : null, // The actual problem details if selected
                available: availableProblems, // List of options if not selected
                windowOpen: currentPhase === ProgramPhase.PROBLEM_SELECTION // Explicit flag
            },
            assignment: {
                status: currentPhase === ProgramPhase.EVALUATION ? 'EVALUATION' : (submission ? 'SUBMITTED' : (currentPhase === ProgramPhase.ASSIGNMENT && selection ? 'OPEN' : 'LOCKED')),
                data: submission || null,
                message: currentPhase === ProgramPhase.ASSIGNMENT ? 'Submit your work before April 30.' : (currentPhase === ProgramPhase.PROBLEM_SELECTION ? 'Assignment submission opens on April 1.' : 'Assignment window closed.')
            },
            evaluation: {
                // Return derived status only. No scores.
                status: evaluation ? evaluation.status : 'UNDER_REVIEW', // Default to UNDER_REVIEW in May if no outcome yet
                visible: currentPhase === ProgramPhase.EVALUATION // Show only in May. Replaced by Results in June.
            },
            results: {
                visible: currentPhase === ProgramPhase.RESULTS,
                outcome: evaluation ? evaluation.status : 'PENDING', // Should be finalized by June
                certificates: certificates
            },
            timeline: getTimelineStatus(),
            referral: {
                code: applicant.referral_code || 'Generating...',
                count: referralCount || 0,
                status: 'Computation Pending (April)'
            }
        });
    } catch (error: any) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
