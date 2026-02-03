import { supabase } from './supabase';
import { PLATFORM_CONFIG } from '@/app/utils/config';

/**
 * Generates a unique referral code for an applicant.
 * Format: ZTF-XXXXXX (6 random alphanumerics)
 */
/**
 * Generates a unique referral code for an applicant.
 * Format: ZTF-{TYPE}-{RANDOM6}
 * Example: ZTF-PROF-A9X2KQ
 */
export async function generateReferralCodeForApplicant(applicantId: string): Promise<string> {
    // 1. Get User/Applicant Details for Type Mapping
    const { data: applicant } = await supabase
        .from('applicants')
        .select('specializations(code)')
        .eq('id', applicantId)
        .single();

    // Map User Type to Short Code
    const typeMap: Record<string, string> = {
        'student': 'STU',
        'professor': 'PROF',
        'mentor': 'MNT',
        'company': 'COMP',
        'institution': 'INST',
        'college': 'CLG'
    };

    // Default to STU since user_type is removed from schema
    // const userType = (applicant as any)?.user_type || 'student';
    let typeCode = 'STU';

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Readable chars
    let code = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
        let randomPart = '';
        for (let i = 0; i < 6; i++) {
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        code = `ZTF-${typeCode}-${randomPart}`;

        const { data } = await supabase
            .from('referral_codes')
            .select('id')
            .eq('code', code)
            .maybeSingle();

        if (!data) isUnique = true;
        attempts++;
    }

    const { error } = await supabase
        .from('referral_codes')
        .insert([{ applicant_id: applicantId, code }]);

    if (error) {
        console.error('Error saving referral code:', error);
        throw error;
    }

    return code;
}

/**
 * Validates a referral code and returns the referrer's applicant ID.
 * Blocks self-referrals based on email similarity.
 */
export async function validateReferralCode(code: string, currentEmail: string): Promise<string | null> {
    if (!code) return null;
    const upperCode = code.toUpperCase();

    // LOGIC A: Community Referrals (CR-*)
    if (upperCode.startsWith('CR-')) {
        const { data: comData, error: comError } = await supabase
            .from('community_referrers')
            .select('id, email, status')
            .eq('referral_code', upperCode)
            .maybeSingle();

        if (comError || !comData) return null;

        // Ensure Active
        if (comData.status !== 'active') return null;

        // Prevent Self-Referral
        if (comData.email?.toLowerCase() === currentEmail?.toLowerCase()) {
            console.warn('Community Self-referral blocked for:', currentEmail);
            return null;
        }

        // Return community ID (or specific flag if needed, but ID is sufficient for tracking)
        return comData.id;
    }

    // LOGIC B: Student Referrals (ZTF-*)
    const { data: refCodeData, error: refError } = await supabase
        .from('referral_codes')
        .select('applicant_id, applicants(email)')
        .eq('code', upperCode)
        .single();

    if (refError || !refCodeData) return null;

    const referrerId = refCodeData.applicant_id;
    const referrerEmail = (refCodeData.applicants as any)?.email;

    // Prevent Self-Referral
    if (referrerEmail?.toLowerCase() === currentEmail?.toLowerCase()) {
        console.warn('Self-referral blocked for:', currentEmail);
        return null;
    }

    return referrerId;
}

/**
 * Fetches referral stats for a given applicant.
 */
export async function getReferralStats(applicantId: string) {
    // 1. Get Code
    const { data: codeData } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('applicant_id', applicantId)
        .maybeSingle();

    // 2. Get Count
    const { count } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_applicant_id', applicantId)
        .eq('status', 'confirmed');

    // 3. Get User ID for Wallet
    const { data: applicant } = await supabase
        .from('applicants')
        .select('user_id')
        .eq('id', applicantId)
        .single();

    // 4. Calculate Wallet Balance
    let balance = 0;
    if (applicant?.user_id) {
        const { data: ledger } = await supabase
            .from('wallet_ledger')
            .select('amount, type')
            .eq('user_id', applicant.user_id);

        if (ledger) {
            balance = ledger.reduce((acc, curr) => {
                return curr.type === 'credit' ? acc + curr.amount : acc - curr.amount;
            }, 0);
        }
    }

    return {
        code: codeData?.code || null,
        count: count || 0,
        walletBalance: balance
    };
}
