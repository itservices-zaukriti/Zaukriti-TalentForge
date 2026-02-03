const http = require('http');

async function testApi() {
    console.log("🚀 Running API Verification...");

    const testId = Date.now().toString().slice(-6);
    const payload = JSON.stringify({
        name: "Test User " + testId,
        email: `test_${testId}@zaukriti.test`,
        phone: "9876543210",
        teamSize: "1",
        participationType: "internship",
        track: "ai-ml"
    });

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log("Status:", res.statusCode);
            console.log("Response:", data);
            if (res.statusCode === 200 || res.statusCode === 201) {
                console.log("✅ Registration API Success!");
            } else {
                console.error("❌ Registration API Failed.");
            }
        });
    });

    req.on('error', (error) => {
        console.error("❌ Request Error:", error.message);
    });

    req.write(payload);
    req.end();
}

testApi();
