#!/usr/bin/env node

/**
 * FORENSIC TEST SCRIPT - Enhanced with better error display
 */

const testRegistration = async () => {
    const testPayload = {
        name: "Forensic Test User",
        email: `forensic.test.${Date.now()}@example.com`,
        phone: `9${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        track: "ai-ml",
        teamSize: "1",
        whatsapp: `9${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        city_state: "Test City, Test State",
        college: "Test College",
        course: "B.Tech CSE",
        year: "2026",
        linkedin: "https://linkedin.com/in/test",
        resume: "https://example.com/resume.pdf"
    };

    console.log("🔬 FORENSIC TEST - Starting registration");
    console.log("📧 Test email:", testPayload.email);
    console.log("📱 Test phone:", testPayload.phone);
    console.log("\n⏳ Sending request to /api/register...\n");

    try {
        const response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testPayload),
        });

        const data = await response.json();

        console.log("\n📊 RESPONSE STATUS:", response.status);
        console.log("📦 RESPONSE BODY:");
        console.log(JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.log("\n❌ REQUEST FAILED");
            console.log("Error message:", data.error);
            console.log("\n💡 Check the Next.js dev server console for detailed logs");
            process.exit(1);
        } else {
            console.log("\n✅ REQUEST SUCCEEDED");
            console.log("Applicant ID:", data.id);
            process.exit(0);
        }
    } catch (error) {
        console.error("\n💥 NETWORK ERROR:", error.message);
        process.exit(1);
    }
};

testRegistration();
