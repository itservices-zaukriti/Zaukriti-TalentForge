import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getProgramPhase, ProgramPhase } from '@/lib/lifecycle';

// -------------------------------------------------------------------------
// POST /api/user/problem-selection
// Objective: Allow paid users to SELECT a problem statement.
// Constraints: Phase = PROBLEM_SELECTION, One selection only, Irreversible.
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
        if (currentPhase !== ProgramPhase.PROBLEM_SELECTION) {
            return NextResponse.json({ error: 'Selection window has closed.' }, { status: 403 });
        }

        // 5. Parse Request
        const { problemId } = await req.json();
        if (!problemId) {
            return NextResponse.json({ error: 'Problem ID is required.' }, { status: 400 });
        }

        // 6. Check for EXISTING SELECTION (Irreversible Logic)
        const { data: existingSelection } = await supabaseAdmin
            .from('user_problem_selection')
            .select('id')
            .eq('applicant_id', applicant.id)
            .maybeSingle();

        if (existingSelection) {
            return NextResponse.json({ error: 'Problem already selected.' }, { status: 409 }); // Conflict
        }

        // 7. Validate Problem ID (Must exist & be active)
        const { data: problem } = await supabaseAdmin
            .from('problem_statements')
            .select('id')
            .eq('id', problemId)
            .eq('is_active', true)
            .single();

        if (!problem) {
            return NextResponse.json({ error: 'Invalid or inactive problem statement.' }, { status: 400 });
        }

        // 8. INSERT SELECTION (The Write Action)
        const { error: insertError } = await supabaseAdmin
            .from('user_problem_selection')
            .insert([{
                applicant_id: applicant.id,
                problem_id: problemId
            }]);

        if (insertError) {
            // Handle duplicate key error gracefully if race condition occurs
            if (insertError.code === '23505') { // Unique violation
                return NextResponse.json({ error: 'Problem already selected.' }, { status: 409 });
            }
            throw insertError;
        }

        return NextResponse.json({ success: true, message: 'Problem selected successfully.' });

    } catch (error: any) {
        console.error('Problem Selection Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
