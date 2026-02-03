import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-md)', maxWidth: '800px', margin: '0 auto' }}>
            <section className="glass-card" style={{ padding: '30px', textAlign: 'left' }}>
                <h2 style={{ color: 'var(--accent-gold)', marginBottom: '20px' }}>Data Privacy Policy</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                    <p>
                        <strong>1. Data Collection:</strong> We collect personal details (Name, College, WhatsApp, Track), academic backgrounds, and optional family-industry context solely for the purpose of merit-based recruitment and ecosystem mapping.
                    </p>
                    <p>
                        <strong>2. Use of Information:</strong> Your data is used to evaluate project submissions, coordinate mentorship, and assess suitability for pilot collaborations. Academic and family context data are used solely for understanding candidate background and providing personalized growth opportunities.
                    </p>
                    <p>
                        <strong>3. Third-Party Sharing:</strong> We do not sell your personal information. Payment data is securely handled by <strong>Razorpay</strong> and is never stored on our local servers. Recruitment data may be shared with Zaukriti partners only for direct internship coordination.
                    </p>
                    <p>
                        <strong>4. Purpose Limitation & Non-Automated Decisions:</strong> Zaukriti DOES NOT use automated ranking, income-based filtering, or marks-based rejections. Selection is 100% based on what you build during the cohort.
                    </p>
                    <p>
                        <strong>5. Sensitive Data Policy:</strong> Optional data such as family income and guardian profession are strictly voluntary and are collected post-payment to ensure trust. This data is not used for evaluation or compensation decisions.
                    </p>
                    <p>
                        <strong>6. Rights & Consent:</strong> By registering, you consent to this processing. You may request data deletion once the recruitment cycle for the current hackathon cohort is complete.
                    </p>
                </div>
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <Link href="/apply" className="cta-button">Back to Registration</Link>
                </div>
            </section>
        </main>
    )
}
