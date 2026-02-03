export default function HackathonPage() {
    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-md)', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ fontSize: '3.5rem', color: 'var(--accent-gold)' }}>5-Day Hackathon</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    The gateway to Zaukriti TalentForge.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                <section className="glass-card" style={{ borderTop: '4px solid var(--accent-gold)' }}>
                    <h2>Structure</h2>
                    <ul style={{ marginTop: '15px', marginLeft: '20px', color: 'var(--text-secondary)' }}>
                        <li>Day 1: Problem statement & Track release</li>
                        <li>Day 2-4: Development & Mentorship</li>
                        <li>Day 5: Submission & Demo</li>
                    </ul>
                </section>

                <section className="glass-card" style={{ borderTop: '4px solid var(--accent-purple)' }}>
                    <h2>Submission</h2>
                    <ul style={{ marginTop: '15px', marginLeft: '20px', color: 'var(--text-secondary)' }}>
                        <li>2-minute demo video</li>
                        <li>GitHub repository</li>
                        <li>Architecture documentation</li>
                        <li>Team contribution chart</li>
                    </ul>
                </section>

                <section className="glass-card" style={{ borderTop: '4px solid #2ecc71' }}>
                    <h2>Outcomes</h2>
                    <ul style={{ marginTop: '15px', marginLeft: '20px', color: 'var(--text-secondary)' }}>
                        <li>Internship priority shortlist</li>
                        <li>Fast-track PPO / Full-time</li>
                        <li>Cash Prizes & Certificates</li>
                    </ul>
                </section>
            </div>

            <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
                <div style={{ background: 'var(--secondary-bg)', padding: 'var(--spacing-md)', borderRadius: '12px', display: 'inline-block', marginBottom: 'var(--spacing-sm)' }}>
                    <p style={{ marginBottom: '10px' }}>Registration Fee</p>
                    <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹1,199</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Individual</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹1,999</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Team of 2</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹2,699</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Team of 3</div>
                        </div>
                    </div>
                </div>
                <br />
                <a href="/apply" className="cta-button">Register for Hackathon</a>
            </div>
        </main>
    )
}
