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
 * Fetches the current enrollment status from DB
 */
export async function checkEnrollmentStatus(supabase: SupabaseClient): Promise<EnrollmentStatus> {
    const { data, error } = await supabase
        .from('enrollment_control')
        .select('is_enrollment_open, closed_message')
        .single();

    if (error || !data) {
        console.error("Error fetching enrollment status:", error);
        // Fallback to OPEN if DB fails? Or CLOSED? 
        // Safer to Default CLOSED to prevent unauthorized registrations if system is down.
        // But prompt says "Safe fallback if DB misconfigured".
        // Let's default to OPEN if table empty, but Log error.
        // Actually, strictly following "If no active phase... block", implies strictness.
        return { isOpen: false, message: "System configuration error. Please try again later." };
    }

    return {
        isOpen: data.is_enrollment_open,
        message: data.closed_message
    };
}

/**
 * Fetches the currently active pricing phase and its amounts
 */
export async function getCurrentPricingFromDB(supabase: SupabaseClient) {
    const now = new Date().toISOString();

    // 1. Get Active Phase
    const { data: phases, error: phaseError } = await supabase
        .from('pricing_phases')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('display_order', { ascending: true })
        .limit(1);

    if (phaseError || !phases || phases.length === 0) {
        // Try to find a "Closed" phase or future phase?
        // If no phase matches NOW, we can't determine price.
        console.warn("No active pricing phase found for date:", now);
        return null;
    }

    const currentPhase = phases[0];

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
