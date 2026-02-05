import { SupabaseClient } from '@supabase/supabase-js';

export interface PricingPhase {
    id: string;
    phase_name: string;
    start_date: string;
    end_date: string;
    display_order: number;
    label_text: string;
}

export interface PricingAmount {
    phase_id: string;
    team_size: number;
    amount: number;
    currency: string;
}

export interface EnrollmentStatus {
    isOpen: boolean;
    message: string;
}

export interface PricingConfig {
    gstPercentage: number;
    referralDiscount: number;
}

/**
 * AUTHORITATIVE UTILITY: Get the Single Active Phase
 * Rules:
 * 1. is_active = true
 * 2. start_date <= now
 * 3. end_date >= now
 * 4. If multiple, pick latest start_date
 */
export async function getCurrentActivePhase(supabase: SupabaseClient): Promise<PricingPhase | null> {
    const now = new Date().toISOString();

    const { data: phases, error } = await supabase
        .from('pricing_phases')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('start_date', { ascending: false }) // Latest start date wins
        .limit(1);

    if (error || !phases || phases.length === 0) {
        return null;
    }

    return phases[0];
}

/**
 * Fetches the current enrollment status
 * STRICTLY uses getCurrentActivePhase logic.
 */
export async function checkEnrollmentStatus(supabase: SupabaseClient): Promise<EnrollmentStatus> {
    const activePhase = await getCurrentActivePhase(supabase);

    if (!activePhase) {
        return {
            isOpen: false,
            message: "Registrations are currently closed. Please wait for the next cohort."
        };
    }

    return {
        isOpen: true,
        message: ""
    };
}

/**
 * Fetches the currently active pricing phase and its amounts
 */
export async function getCurrentPricingFromDB(supabase: SupabaseClient) {
    // 1. Get Active Phase using Authoritative Utility
    const currentPhase = await getCurrentActivePhase(supabase);

    if (!currentPhase) {
        console.warn("⛔ [PRICING] No active phase found.");
        return null;
    }

    // 2. Get Amounts for this Phase
    const { data: amounts, error: amountError } = await supabase
        .from('pricing_amounts')
        .select('*')
        .eq('phase_id', currentPhase.id);

    if (amountError || !amounts) {
        console.error("Error fetching pricing amounts:", amountError);
        return null;
    }

    // Convert amounts to easy lookup map
    const amountsMap: Record<string, number> = {};
    amounts.forEach((a: any) => {
        amountsMap[a.team_size.toString()] = Number(a.amount);
    });

    return {
        phase: currentPhase,
        amounts: amountsMap
    };
}

/**
 * Fetches global pricing config (GST, Discount)
 */
export async function getPricingConfig(supabase: SupabaseClient): Promise<PricingConfig> {
    const { data, error } = await supabase
        .from('pricing_config')
        .select('gst_percentage, referral_discount_amount')
        .single();

    if (error || !data) {
        console.error("Error fetching pricing config:", error);
        // Fallback defaults safe for now, but should alert
        return { gstPercentage: 18, referralDiscount: 50 };
    }

    return {
        gstPercentage: Number(data.gst_percentage),
        referralDiscount: Number(data.referral_discount_amount)
    };
}
