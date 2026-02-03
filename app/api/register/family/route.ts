import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data.applicant_id) {
            return NextResponse.json({ error: 'Missing applicant ID' }, { status: 400 });
        }

        // Insert into applicant_family_context table
        const { error } = await supabase
            .from('applicant_family_context')
            .insert([{
                applicant_id: data.applicant_id,
                guardian_name: data.guardian_name,
                guardian_profession: data.guardian_profession,
                income_range: data.income_range
            }]);

        if (error) throw error;

        return NextResponse.json({ status: 'ok' });
    } catch (error: any) {
        console.error('Family Context Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
