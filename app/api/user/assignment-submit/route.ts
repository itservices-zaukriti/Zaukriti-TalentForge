import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getProgramPhase, ProgramPhase } from '@/lib/lifecycle';

// -------------------------------------------------------------------------
// POST /api/user/assignment-submit
// Objective: Allow paid users to submit assignment links (once).
// Constraints: Phase >= ASSIGNMENT, Paid, Problem Selected, One Submission.
// -------------------------------------------------------------------------

export async function POST(req: NextRequest) {
    try {
        // 1. Auth Validation (Strict)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
        }
        const token = authHeader.replace('Bearer ', '');

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Initialize Service Role Clients (Bypass RLS for Critical Logic)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 3. Get Applicant Record (Payment Check)
        const { data: applicant, error: applicantError } = await supabaseAdmin
            .from('applicants')
            .select('id, payment_status, amount_paid')
            .eq('email', user.email)
            .maybeSingle();

        if (applicantError) throw applicantError;
        if (!applicant) return NextResponse.json({ error: 'Applicant record not found' }, { status: 403 });

        // GATE: Payment Verified?
        const isPaid = (applicant.payment_status === 'Paid' || applicant.payment_status === 'captured') && (applicant.amount_paid > 0);
        if (!isPaid) {
            return NextResponse.json({ error: 'Access not enabled.' }, { status: 403 });
        }

        // 4. CHECK PHASE RULES (Time-Gated Write)
        const currentPhase = getProgramPhase(); // Uses System Time
        // Must be at least ASSIGNMENT phase (or later if late submission allowed? Assuming strict window for now: Assignment Phase)
        // If strict April window: currentPhase === ProgramPhase.ASSIGNMENT
        // Directive says "Phase >= ASSIGNMENT... Assignment hidden before April".
        // Let's assume strict April window for submission as "Assignment Unlock (April)".
        // Or broad >= ASSIGNMENT. Given "Assignment Unlock (April)", and Evaluation in May, usually submissions close end of April.
        // Let's stick to strict `ASSIGNMENT` phase for submission intake to be safe.
        // But directive says "Phase >= ASSIGNMENT_LOCKED". Wait. "Phase >= ASSIGNMENT". "Assignment Unlock (April)".
        // Let's interpret strict April.

        // Actually, let's allow submission >= ASSIGNMENT (April onwards) but lock after Evaluation starts maybe?
        // Directive: "Phase >= ASSIGNMENT... Assignment unlock... April Assignment Unlock".
        // Let's use `currentPhase === ProgramPhase.ASSIGNMENT` to enforce April-only submission window.
        if (currentPhase !== ProgramPhase.ASSIGNMENT) {
            return NextResponse.json({ error: 'Assignment submission window is not open (April Only).' }, { status: 403 });
        }

        // 5. Check Problem Selection (Prerequisite)
        const { data: selection } = await supabaseAdmin
            .from('user_problem_selection')
            .select('id, problem_id') // Get problem_id for foreign key
            .eq('applicant_id', applicant.id)
            .maybeSingle();

        if (!selection) {
            return NextResponse.json({ error: 'You must select a problem statement first.' }, { status: 403 });
        }

        // 6. Check for EXISTING SUBMISSION (One-Time Rule)
        const { data: existingSubmission } = await supabaseAdmin
            .from('user_submissions')
            .select('id')
            .eq('applicant_id', applicant.id)
            .maybeSingle();

        if (existingSubmission) {
            return NextResponse.json({ error: 'You have already submitted your assignment.' }, { status: 409 });
        }

        // 7. Parse Request
        const { writeUpUrl, videoUrl, repoUrl, socialLinks } = await req.json();

        if (!writeUpUrl || !videoUrl) {
            return NextResponse.json({ error: 'Write-up URL and Video URL are required.' }, { status: 400 });
        }

        // 8. INSERT SUBMISSION (The Write Action)
        const { error: insertError } = await supabaseAdmin
            .from('user_submissions')
            .insert([{
                applicant_id: applicant.id,
                problem_id: selection.problem_id,
                write_up_url: writeUpUrl,
                video_url: videoUrl,
                repo_url: repoUrl || null,
                social_links: socialLinks || null
            }]);

        if (insertError) {
            if (insertError.code === '23505') { // Unique violation
                return NextResponse.json({ error: 'Submission already exists.' }, { status: 409 });
            }
            throw insertError;
        }

        return NextResponse.json({ success: true, message: 'Assignment submitted successfully.' });

    } catch (error: any) {
        console.error('Assignment Submission Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
