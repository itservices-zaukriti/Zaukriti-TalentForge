export default function LegalPage({ params }: { params: { type: string } }) {
    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-md)', maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-card">
                <h1 style={{ marginBottom: 'var(--spacing-md)', textTransform: 'capitalize' }}>{params.type.replace('-', ' ')}</h1>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <p>Last Updated: January 2026</p>

                    <section>
                        <h3>1. Introduction</h3>
                        <p>Welcome to Zaukriti TalentForge. By using our platform, you agree to these terms.</p>
                    </section>

                    <section>
                        <h3>2. Internship & Recruitment</h3>
                        <p>Participation in the hackathon or application for internships does not guarantee selection. Internship offers are based on performance, vacancy, and interview rounds. Full-time employment (PPO) is discretionary.</p>
                    </section>

                    <section>
                        <h3>3. ESOPs & Equity</h3>
                        <p>Equity/ESOP eligibility is subject to a 3-6 month probation period and satisfactory performance. It is non-guaranteed and subject to Board approval.</p>
                    </section>

                    <section>
                        <h3>4. Refund Policy</h3>
                        <p>Registration fees for hackathons are non-refundable except in cases of technical failure on our end.</p>
                    </section>

                    <section>
                        <h3>5. Jurisdiction</h3>
                        <p>All disputes are subject to the jurisdiction of courts in India.</p>
                    </section>
                </div>
            </div>
        </main>
    )
}
