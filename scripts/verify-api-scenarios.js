const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Config
const BASE_URL = 'http://localhost:3000';
const WEBHOOK_SECRET = 'P_uax3dpRT_qLBA';

// Env for Client (Simulating Client/Auth actions)
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key) env[key.trim()] = valueParts.join('=').trim().replace(/^"|"$/g, '');
});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function callRegister(data) {
    try {
        const res = await fetch(`${BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(json));
        return json;
    } catch (e) {
        throw new Error(`Register Failed: ${e.message}`);
    }
}

async function callCreateOrder(data) {
    try {
        const res = await fetch(`${BASE_URL}/api/razorpay/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || res.statusText);
        return json;
    } catch (e) {
        throw new Error(`Create Order Failed: ${e.message}`);
    }
}

async function callWebhook(event, payload) {
    try {
        const body = JSON.stringify({
            event: event,
            payload: payload
        });

        const signature = crypto
            .createHmac('sha256', WEBHOOK_SECRET)
            .update(body)
            .digest('hex');

        const res = await fetch(`${BASE_URL}/api/razorpay/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-razorpay-signature': signature
            },
            body: body
        });

        const text = await res.text();
        if (!res.ok) throw new Error(text || res.statusText);
        return text;
    } catch (e) {
        throw new Error(`Webhook Failed: ${e.message}`);
    }
}

async function linkOrder(applicantId, orderId) {
    const { error } = await supabase.from('applicants').update({ payment_order_id: orderId }).eq('id', applicantId);
    if (error) throw new Error(`Link Order Failed: ${error.message}`);
}

async function run() {
    console.log('🚀 API-BASED SCENARIO VERIFICATION');
    console.log('ℹ️  Expecting Early Bird Pricing: Base ₹799 + 18% GST');
    const timestamp = Date.now();

    // 1. Professor Registration
    console.log('\n[1] Professor Registration (No Ref)...');
    console.log('[1] Expected: Base 799 + 144 GST = 943');
    const profEmail = `prof-${timestamp}@test.com`;
    const profData = {
        name: 'Professor API',
        email: profEmail,
        phone: `91${timestamp.toString().slice(-8)}`,
        userType: 'professor',
        track: 'ai-ml',
        teamSize: '1'
    };
    const profReg = await callRegister(profData);
    console.log(`✅ Registered. ID: ${profReg.id}`);

    // Create Order
    const profOrder = await callCreateOrder({
        teamSize: 1,
        email: profEmail,
        receipt: profReg.id
    });
    // Base 799 + 144 GST = 943
    // Amount is in paise: 94300
    console.log(`✅ Order Created. ID: ${profOrder.id}. Amount: ₹${profOrder.pricing?.total} (Base: ${profOrder.pricing?.base} + GST: ${profOrder.pricing?.gst})`);

    // Link Order
    await linkOrder(profReg.id, profOrder.id);

    // Simulate Payment Success Webhook
    await callWebhook('payment.captured', {
        payment: {
            entity: {
                id: `pay_${profOrder.id}`,
                order_id: profOrder.id,
                email: profEmail,
                amount: profOrder.amount,
                status: 'captured'
            }
        }
    });
    console.log(`✅ Webhook Captured Sent.`);

    // Verify Code Gen
    const { data: profCodeData } = await supabase.from('referral_codes').select('code').eq('applicant_id', profReg.id).single();
    if (profCodeData) console.log(`🎉 Generated Code: ${profCodeData.code}`);
    else console.error('❌ Code Gen Failed');

    const profCode = profCodeData?.code;

    if (!profCode) throw new Error("Cannot proceed without Prof Code");

    // 2. Student (Ref by Prof) - FAIL Case
    console.log('\n[2] Student (Ref by Prof) - FAIL Case...');
    const stu1Email = `stu1-${timestamp}@test.com`;
    const stu1Reg = await callRegister({
        name: 'Student One',
        email: stu1Email,
        phone: `92${timestamp.toString().slice(-8)}`,
        userType: 'student',
        track: 'fullstack',
        teamSize: '1',
        applied_referral_code: profCode
    });
    console.log(`✅ Registered Student. ID: ${stu1Reg.id}`);

    const stu1Order = await callCreateOrder({ teamSize: 1, email: stu1Email, referralCode: profCode, receipt: stu1Reg.id });
    // Base 799 - 50 = 749. GST 18% of 749 = 135. Total = 884.
    console.log(`✅ Student Order: ₹${stu1Order.pricing?.total} (Base: ${stu1Order.pricing?.base} - Disc: ${stu1Order.pricing?.discount} + GST: ${stu1Order.pricing?.gst})`);

    await linkOrder(stu1Reg.id, stu1Order.id);

    // Webhook Failed
    await callWebhook('payment.failed', {
        payment: { entity: { id: `pay_fail_${stu1Order.id}`, order_id: stu1Order.id, error_description: 'Bank Declined' } }
    });
    console.log('✅ Fail Webhook Sent.');

    // Verify NO ledger
    const { data: profUser } = await supabase.from('applicants').select('user_id').eq('id', profReg.id).single();
    if (profUser && profUser.user_id) {
        const { data: ledgerChk } = await supabase.from('wallet_ledger').select('*').eq('user_id', profUser.user_id);
        if (ledgerChk.length === 0) console.log('✅ Correct: No ledger entry for failure.');
        else console.error('❌ Error: Ledger entry found for failure!');
    }

    // 3. Student (Ref by Prof) - SUCCESS Case
    console.log('\n[3] Student (Ref by Prof) - SUCCESS Case...');
    const stu1Order2 = await callCreateOrder({ teamSize: 1, email: stu1Email, referralCode: profCode, receipt: stu1Reg.id });
    await linkOrder(stu1Reg.id, stu1Order2.id);

    await callWebhook('payment.captured', {
        payment: { entity: { id: `pay_succ_${stu1Order2.id}`, order_id: stu1Order2.id, amount: stu1Order2.amount, status: 'captured' } }
    });
    console.log('✅ Success Webhook Sent.');

    if (profUser && profUser.user_id) {
        const { data: ledgerChk2 } = await supabase.from('wallet_ledger').select('*').eq('user_id', profUser.user_id);
        if (ledgerChk2 && ledgerChk2.length > 0) console.log(`✅ Ledger Credited: ₹${ledgerChk2[0].amount}`);
        else console.error('❌ Error: Ledger NOT credited.');
    }

    console.log('\n✨ API VERIFICATION COMPLETE');
}

run();
