export const PLATFORM_CONFIG = {
    branding: {
        name: "Zaukriti Events AI",
        tagline: "AI-Driven Digital Applications Platform",
        hackathonEmail: "talentforge@zaukritievents.in",
        productEmail: "hello@zaukriti.ai"
    },
    timeline: {
        useCasesReleased: "Feb 25, 2026",
        buildPhase: "Feb 25 – Apr 15, 2026",
        finalSubmission: "Apr 15, 2026",
        correctionWindow: "Apr 16 – May 15, 2026",
        results: "End of May – Mid June, 2026",
        internshipStart: "July 1, 2026"
    },
    pricing: [
        {
            name: "Phase 1 — Early Bird",
            start: new Date("2026-02-01T00:00:00Z"),
            end: new Date("2026-02-15T23:59:59Z"),
            fees: { individual: 799, team2: 1399, team3: 1999 }
        },
        {
            name: "Phase 2 — Regular",
            start: new Date("2026-02-16T00:00:00Z"),
            end: new Date("2026-02-28T23:59:59Z"),
            fees: { individual: 999, team2: 1799, team3: 2399 }
        },
        {
            name: "Phase 3 — Late",
            start: new Date("2026-03-01T00:00:00Z"),
            end: new Date("2026-03-15T23:59:59Z"),
            fees: { individual: 1199, team2: 1999, team3: 2799 }
        },
        {
            name: "Phase 4 — Final Call",
            start: new Date("2026-03-16T00:00:00Z"),
            end: new Date("2026-03-25T23:59:59Z"),
            fees: { individual: 1499, team2: 2499, team3: 3499 }
        },
        {
            name: "Closed",
            start: new Date("2026-03-26T00:00:00Z"),
            end: new Date("2100-01-01T00:00:00Z"),
            fees: { individual: null, team2: null, team3: null }
        }
    ],
    featureFlags: {
        showPlatformDeepDive: true,
        aiModulesRoadmap: true,
        razorpayLiveMode: false, // KEEP FALSE FOR NOW
        enableGoogleSheetsSync: false // DISABLED as per User Request
    },
    referral: {
        prefix: "ZTF-",
        rewardValue: 50,      // New ₹50 economy
        discountValue: 50,    // New ₹50 economy
        rewards: [
            { threshold: 1, title: "Builder Booster", benefit: "Priority application updates & Digital Badge" },
            { threshold: 3, title: "Rising Star", benefit: "Direct eligibility for curated mentorship batches" },
            { threshold: 5, title: "Ecosystem Partner", benefit: "Fast-track review for Pilot-1 collaborations" },
            { threshold: 10, title: "Zaukriti Champion", benefit: "Exclusive swag kit & featured profile" }
        ],
        disclaimer: "Referral rewards are based on confirmed paid registrations. Rewards are eligibility-based and subject to validation.",
        governance: {
            active: true,
            maxDailyPerUser: 10,
            emergencyFreeze: false
        }
    },
    communityReferral: {
        enabled: true,
        dailyLimit: 20,
        velocityThreshold: 5,
        reviewMode: false
    }
};

export function getCurrentPricing() {
    const now = new Date();
    // For testing/preview purposes, allowing an override via query param or similar could be added here
    // but for now, we follow system time.
    return PLATFORM_CONFIG.pricing.find(p => now >= p.start && now <= p.end) || PLATFORM_CONFIG.pricing[PLATFORM_CONFIG.pricing.length - 1];
}
