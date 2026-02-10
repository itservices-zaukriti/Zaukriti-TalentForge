import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// import { supabase } from '@/lib/supabase'; // REMOVED to avoid RLS context issues
import { validateReferralCode } from '@/lib/referrals';
import { PLATFORM_CONFIG } from '@/app/utils/config';
import { checkEnrollmentStatus, getCurrentPricingFromDB, getPricingConfig } from '@/lib/pricing';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // --- 0. DPDP Consent Validation (Pre-Check) ---
        // While we don't block initially (to allow user creation/lookup), 
        // we MUST capture these details for the final consent record.
        const ipAddress = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        console.log("🔒 [DPDP] Capture initiated for:", ipAddress);

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error("❌ FATAL: SUPABASE_SERVICE_ROLE_KEY is not set in environment variables");
            throw new Error("Server configuration error: Missing service role key");
        }

        // Normalize Phone (Strict 10 digit)
        const cleanPhone = data.phone.replace(/\D/g, '').slice(-10);
        data.phone = cleanPhone; // Update data object to use cleaned phone everywhere

        // 1. Initialize SERVICE ROLE Client for applicants writes (bypasses RLS)
        const supabaseServiceRole = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        console.log("🔍 [CLIENT] Service Role client initialized");
        console.log("   Client type: SERVICE_ROLE");
        console.log("   Purpose: Bypass RLS for applicants table writes");
        console.log("   Key prefix:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 12));

        // 1.5. CHECK ENROLLMENT STATUS (DB-Driven)
        const enrollment = await checkEnrollmentStatus(supabaseServiceRole);
        if (!enrollment.isOpen) {
            console.warn("⛔ [ENROLLMENT] Blocked: " + enrollment.message);
            return NextResponse.json({ error: enrollment.message }, { status: 403 });
        }

        // 2. Find or Create User Record (using SERVICE_ROLE)
        // 2. Find or Create User Record (using SERVICE_ROLE)
        console.log("\n🔍 [DB_OP] SELECT users | client=SERVICE_ROLE | filter=email/phone");

        let userArg: any = null;

        // Fetch logic: If multiple found (e.g. one matching email, one matching phone - technically shouldn't happen if validated, but safety first), take first.
        const { data: existingUsers, error: fetchError } = await supabaseServiceRole
            .from('users')
            .select('id, full_name, email, phone')
            .or(`email.eq.${data.email},phone.eq.${data.phone}`)
            .limit(1);

        if (existingUsers && existingUsers.length > 0) {
            userArg = existingUsers[0];
            console.log("✅ [DB_SUCCESS] Found existing user:", userArg.id);
        }

        if (!userArg) {
            console.log("\n🔍 [DB_OP] INSERT users | client=SERVICE_ROLE | payload_keys=[full_name, email, phone]");
            const { data: newUser, error: createError } = await supabaseServiceRole
                .from('users')
                .insert([{
                    full_name: data.name,
                    email: data.email,
                    phone: data.phone
                }])
                .select('id')
                .single();

            if (createError) {
                // Handle Race Condition / Duplicate Entry that appeared between Select and Insert
                if (createError.code === '23505') { // unique_violation
                    console.warn("⚠️ [DB_RACE_CONDITION] duplicate key on insert, re-fetching user...");
                    const { data: retryUser } = await supabaseServiceRole
                        .from('users')
                        .select('id')
                        .or(`email.eq.${data.email},phone.eq.${data.phone}`)
                        .maybeSingle();

                    if (retryUser) {
                        userArg = retryUser;
                        console.log("✅ [DB_RECOVERY] Recovered user id:", userArg.id);
                    } else {
                        // Truly fatal if we can't find it even after unique error saying it exists.
                        // Could happen if phone format mismatches? (DB has +91 but constraint hit on normalized?)
                        // User input was normalized to 10 digits before this block.
                        // DB constraint likely on raw column.
                        // If DB has '9966405444', lookup should find it.
                        console.error("❌ [DB_FATAL] Unique constraint hit but could not find user on retry.");
                        throw createError;
                    }
                } else {
                    console.error("❌ [DB_ERROR] INSERT users failed:", createError);
                    throw createError;
                }
            } else {
                console.log("✅ [DB_SUCCESS] INSERT users | id:", newUser?.id);
                userArg = newUser;
            }
        }

        const user = userArg;

        // 2. Resolve Specialization ID
        // COMPLETE MAPPING for all 12 Domains
        const trackCodeMap: Record<string, string> = {
            'ai': 'AI',
            'fullstack': 'WEB',
            'data-science': 'DS', // Legacy support
            'cybersecurity': 'CYB', // Legacy support
            'cloud': 'CLD', // Legacy support

            // New Domains - mapping to GEN (General/Other) or Specific if available
            // Since we rely on 'track' column for uniqueness when spec is GEN, this is safe.
            'chef2restro': 'GEN',
            'retail': 'GEN',
            'angadi': 'GEN',
            'fashion': 'GEN',
            'vitalhalo': 'GEN',
            'marketing': 'GEN',
            'music-language': 'GEN',
            'education': 'GEN',
            'finance': 'GEN',
            'iot': 'GEN',
            'salon': 'GEN'
        };
        // Normalize track slug to handle variations if any (frontend sends domain.slug)
        const specCode = trackCodeMap[data.track] || 'GEN';
        const { data: spec } = await supabaseServiceRole
            .from('specializations')
            .select('id')
            .eq('code', specCode)
            .maybeSingle();

        // 3. Prevent Duplicate Specialization Registration
        let dupQuery = supabaseServiceRole
            .from('applicants')
            .select('id')
            .eq('user_id', user.id)
            .eq('specialization_id', spec?.id);

        if (specCode === 'GEN') {
            dupQuery = dupQuery.eq('track', data.track);
        }

        const { data: existingReg } = await dupQuery.maybeSingle();

        if (existingReg) {
            return NextResponse.json({ error: `You are already registered for the ${data.track} track.` }, { status: 400 });
        }

        // ... (Referral Logic stays same) ...
        // 4. Validate Referral Code (Unified Logic)
        let referrerId = null;
        let communityReferrerId = null;
        let appliedCode = data.applied_referral_code;

        if (appliedCode) {
            const validId = await validateReferralCode(appliedCode, data.email);
            if (validId) {
                if (appliedCode.toUpperCase().startsWith('CR-')) {
                    communityReferrerId = validId;
                } else {
                    referrerId = validId;
                }
            }
        }

        // 5. Server-Side Fee Validation (DB-DRIVEN)
        const pricingData = await getCurrentPricingFromDB(supabaseServiceRole);
        if (!pricingData) {
            console.error("❌ [PRICING] No active pricing phase found in DB");
            return NextResponse.json({ error: "Registration is not currently active." }, { status: 400 });
        }

        const pricingConfig = await getPricingConfig(supabaseServiceRole);
        const { phase, amounts } = pricingData;

        const targetTeamSize = parseInt(data.teamSize || '1');
        const basePrice = amounts[targetTeamSize.toString()] ?? 0;

        if (!basePrice) {
            return NextResponse.json({ error: "Invalid team size for current phase." }, { status: 400 });
        }

        let discount = 0;
        if (referrerId || communityReferrerId) {
            discount = pricingConfig.referralDiscount;
        }

        const discountedPrice = Math.max(0, basePrice - discount);
        const gstRate = pricingConfig.gstPercentage / 100.0;
        const gstAmount = Math.ceil(discountedPrice * gstRate);
        const finalAmount = discountedPrice + gstAmount;

        // 6. Insert Registration into Applicants
        const applicantPayload = {
            user_id: user.id,
            specialization_id: spec?.id,
            full_name: data.name,
            email: data.email,
            phone: data.phone,
            track: data.track,
            // STORE ROLE IN PRIMARY_STREAM
            primary_stream: data.role || null,
            payment_status: 'created',
            application_status: 'pending_payment',
            whatsapp_number: data.whatsapp,
            city_state: data.city_state,
            college_name: data.college,
            course: data.course,
            graduation_year: data.year,
            linkedin: data.linkedin,
            resume_url: data.resume,
            team_size: targetTeamSize,
            team_members: targetTeamSize > 1 ? [
                data.member2,
                ...(targetTeamSize > 2 ? [data.member3] : [])
            ].filter(m => m && m.name) : null,
            is_team_lead: true,
            pricing_phase: phase.phase_name,
            applied_referral_code: (referrerId || communityReferrerId) ? appliedCode : null,
            amount_paid: finalAmount,
            base_amount: basePrice,
            discount_amount: discount,
            gst_amount: gstAmount,
            parents_name: data.familyData?.guardian_name || data.parents_name || null,
            parents_profession: data.familyData?.guardian_profession || data.parents_profession || null,
            family_income_range: data.familyData?.income_range || data.family_income_range || null
        };

        console.log("🔍 [DB_OP] INSERT applicants | client=SERVICE_ROLE");
        console.log("   Table: applicants");
        console.log("   Payload keys:", Object.keys(applicantPayload));
        console.log("   Payload values (sanitized):", {
            user_id: applicantPayload.user_id,
            specialization_id: applicantPayload.specialization_id,
            email: applicantPayload.email,
            payment_status: applicantPayload.payment_status,
            team_size: applicantPayload.team_size
        });

        const { data: applicant, error: applicantError } = await supabaseServiceRole
            .from('applicants')
            .insert([applicantPayload])
            .select()
            .single();

        if (applicantError) {
            console.error('\n❌ [DB_ERROR] INSERT applicants FAILED');
            console.error('   Error code:', applicantError.code);
            console.error('   Error message:', applicantError.message);
            console.error('   Error details:', applicantError.details);
            console.error('   Error hint:', applicantError.hint);
            console.error('   Full error object:', JSON.stringify(applicantError, null, 2));
            throw applicantError;
        }

        console.log("✅ [DB_SUCCESS] INSERT applicants | id:", applicant.id);

        // 7. [MANDATORY] DPDP Consent Storage (Atomic-like)
        // System Constitution: "Consent stored with timestamp, IP, user agent"
        // "No data storage without consent" -> We stored data, now we MUST log consent.
        // If this fails, we must ROLLBACK the applicant to ensure no un-consented data persists.
        try {
            console.log("🔒 [DPDP] Storing consent record...");

            const { error: consentError } = await supabaseServiceRole
                .from('user_consents')
                .insert([{
                    applicant_id: applicant.id,
                    consent_version: 'v1.0', // Hardcoded as per current policy version
                    ip_address: ipAddress,
                    user_agent: userAgent,
                    // consented_at defaults to NOW()
                }]);

            if (consentError) {
                throw new Error(`Consent storage failed: ${consentError.message}`);
            }
            console.log("✅ [DPDP] Consent stored successfully.");

        } catch (consentErr: any) {
            console.error("❌ [DPDP CRITICAL] Consent insert failed. Rolling back applicant.");

            // COMPENSATING TRANSACTION: Delete the applicant we just created
            const { error: deleteError } = await supabaseServiceRole
                .from('applicants')
                .delete()
                .eq('id', applicant.id);

            if (deleteError) {
                console.error("💀 [FATAL] Failed to rollback applicant after consent failure:", deleteError);
                // We might need an alert here in a real system (Sentry/Slack)
            }

            return NextResponse.json({
                error: "Compliance Error: Failed to record consent. Registration aborted."
            }, { status: 500 });
        }

        // 8. Record Pending Referral Link (SERVICE_ROLE)
        if (referrerId) {
            console.log("🔍 [DB_OP] INSERT referrals | client=SERVICE_ROLE");
            await supabaseServiceRole
                .from('referrals')
                .insert([{
                    referrer_applicant_id: referrerId,
                    referred_applicant_id: applicant.id,
                    status: 'pending'
                }]);
        }

        if (communityReferrerId) {
            console.log("🔍 [DB_OP] INSERT community_referral_links | client=SERVICE_ROLE");
            await supabaseServiceRole
                .from('community_referral_links')
                .insert([{
                    community_referrer_id: communityReferrerId,
                    referred_applicant_id: applicant.id,
                    status: 'pending'
                }]);
        }

        return NextResponse.json({ id: applicant.id });
    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, familyData } = await req.json();

        // Initialize Service Role Client for Update (Bypass RLS)
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error("❌ FATAL: SUPABASE_SERVICE_ROLE_KEY is not set");
            throw new Error("Server configuration error: Missing service role key");
        }

        const supabaseServiceRole = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        console.log("🔍 [DB_OP] UPDATE applicants | client=SERVICE_ROLE | id:", id);

        if (!id || !familyData) {
            return NextResponse.json({ error: 'Missing ID or family data' }, { status: 400 });
        }

        const { error } = await supabaseServiceRole
            .from('applicants')
            .update({
                parents_name: familyData.guardian_name,
                parents_profession: familyData.guardian_profession,
                family_income_range: familyData.income_range
            })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
