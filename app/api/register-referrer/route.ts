import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateReferralCodeForApplicant } from '@/lib/referrals'; // We can reuse this from lib

export async function POST(req: NextRequest) {
    try {
        const { name, email, phone } = await req.json();

        if (!name || !email || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing service role key");
        }

        // Initialize Service Role Client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Find or Create User
        // Normalize Phone (Strict 10 digit) - Consistent with main register route
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);

        // 1. Find or Create User (Upsert for Idempotency)
        // We use UPSERT on 'phone' to prevent "users_phone_key" violations.
        // If email conflicts with a DIFFERENT record, this might still error, but assuming phone is primary unique ID here.
        let user_id;

        const { data: user, error: userError } = await supabase
            .from('users')
            .upsert({
                full_name: name,
                email: email,
                phone: cleanPhone
            }, { onConflict: 'phone' })
            .select()
            .single();

        if (userError) {
            // Fallback: If upsert failed (e.g. email conflict), try fetching by email
            console.warn("⚠️ [UPSERT_FAIL] Conflict on phone upsert (likely email mismatch). Fetching existing...", userError.message);
            const { data: fallbackUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .maybeSingle();

            if (fallbackUser) {
                user_id = fallbackUser.id;
            } else {
                // Real Error
                throw userError;
            }
        } else {
            user_id = user.id;
        }

        // 2. Find or Create Applicant Record
        // We need an applicant record to link the referral code to.
        // Check if exists
        let applicantId;
        const { data: existingApplicant } = await supabase
            .from('applicants')
            .select('id, referral_code')
            .eq('user_id', user_id)
            .maybeSingle();

        if (existingApplicant) {
            applicantId = existingApplicant.id;
            // If they already have a code, return it
            if (existingApplicant.referral_code) {
                return NextResponse.json({ referralCode: existingApplicant.referral_code });
            }
        } else {
            // Create "Affiliate" Applicant
            // We need to fetch a valid specialization ID for 'GEN' or similar to satisfy FK if exists
            // Assuming 'GEN' maps to 'General' or similar. 
            // In main register route: specCode = 'GEN'.

            const { data: spec } = await supabase
                .from('specializations')
                .select('id')
                .eq('code', 'GEN')
                .maybeSingle();

            const { data: newApp, error: appError } = await supabase
                .from('applicants')
                .insert([{
                    user_id: user_id,
                    full_name: name,
                    email: email,
                    phone: phone,
                    application_status: 'Affiliate', // Distinct status
                    payment_status: 'N/A',
                    track: 'Affiliate',
                    specialization_id: spec?.id || null, // Best effort
                    college_name: 'N/A', // Placeholder
                    city_state: 'N/A',   // Placeholder
                    course: 'N/A',       // Placeholder
                    graduation_year: 0,
                    team_size: 1
                }])
                .select('id')
                .single();

            if (appError) throw appError;
            applicantId = newApp.id;
        }

        // 3. Generate Code
        // Pass the service role client to ensure permission to write to referral_codes
        const code = await generateReferralCodeForApplicant(applicantId, supabase);

        // Also ensure applicant table has it (the lib function might only insert into referral_codes table depending on implementation,
        // but typically we sync it. The lib function `generateReferralCodeForApplicant` in `lib/referrals.ts` usually does insert into `referral_codes`.
        // Let's double check if it updates `applicants.referral_code`.
        // Reading the lib earlier: it inserts into `referral_codes`. It DOES NOT seem to update `applicants.referral_code` automatically in the loop?
        // Wait, looking at `verify-payment`, I had to explicitly update `applicants`.
        // So I should do it here too just in case.

        await supabase
            .from('applicants')
            .update({ referral_code: code })
            .eq('id', applicantId);

        return NextResponse.json({ referralCode: code });

    } catch (error: any) {
        console.error('Referrer Reg Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
