// Native fetch is available in Node 18+

const BASE_URL = 'http://localhost:3000';

async function testCommunityRegistration() {
    console.log('🚀 Starting Community Registration Verification\n');
    const timestamp = Date.now();
    const email = `community_${timestamp}@test.edu`;
    const data = {
        fullName: 'Test Dean',
        email: email,
        organizationName: 'Test University',
        organizationType: 'University',
        phone: '1234567890'
    };

    // 1. Invalid Input Test
    console.log('[Test 1] Invalid Input (Missing Organization Name)...');
    try {
        const res = await fetch(`${BASE_URL}/api/community/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, organizationName: '' })
        });
        const json = await res.json();
        if (res.status === 400 && json.error === 'INVALID_INPUT') {
            console.log('✅ Passed: Rejected Invalid Input with 400 and INVALID_INPUT code.');
        } else {
            console.error('❌ Failed: Expected 400 INVALID_INPUT, got:', res.status, json);
        }
    } catch (e) { console.error('❌ Exception:', e.message); }

    // 2. Fresh Registration Test
    console.log('\n[Test 2] Fresh Registration...');
    try {
        const res = await fetch(`${BASE_URL}/api/community/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();

        if (res.ok && json.success && json.state === 'CREATED') {
            console.log('✅ Passed: Created successfully with state CREATED.');
            console.log('   Message:', json.message);
        } else {
            console.error('❌ Failed: Expected state CREATED, got:', json);
        }
    } catch (e) { console.error('❌ Exception:', e.message); }

    // 3. Duplicate Registration Test
    console.log('\n[Test 3] Duplicate Registration (Same Email)...');
    try {
        // Retry with same data
        const res = await fetch(`${BASE_URL}/api/community/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();

        // Note: Status might be 200 or 400 depending on design. Code used `return Response.json({...})`. 
        // In my implementation I returned success: true for ALREADY_PENDING.

        if (json.success && json.state === 'ALREADY_PENDING') {
            console.log('✅ Passed: Detected duplicate with state ALREADY_PENDING.');
            console.log('   Message:', json.message);
        } else {
            // Check if my code uses Success: True or False for duplicate?
            // "If existing... return { success: true, state: 'ALREADY_PENDING' }"
            console.error('❌ Failed: Expected state ALREADY_PENDING, got:', json);
        }
    } catch (e) { console.error('❌ Exception:', e.message); }

    console.log('\n✨ Verification Complete');
}

testCommunityRegistration();
