import Link from 'next/link'

export default function TalentForgePage() {
    const tracks = [
        { title: 'AI / ML (OCR, NLP, CV)', slug: 'ai-ml', status: 'ACTIVE' },
        { title: 'Full-Stack Engineering', slug: 'full-stack', status: 'ACTIVE' },
        { title: 'IoT & Edge Systems', slug: 'iot-sensors', status: 'PILOT' },
        { title: 'Cloud & DevOps', slug: 'cloud-devops', status: 'ACTIVE' },
        { title: 'Digital Marketing (AI)', slug: 'marketing-ai', status: 'ACTIVE' },
        { title: 'Product & UX', slug: 'product-ux', status: 'ACTIVE' }
    ];

    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-md)', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: 'var(--spacing-sm)' }}>TalentForge</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    The engine powering Zaukriti’s national innovation ecosystem.
                </p>
                <div style={{ marginTop: '20px' }}>
                    <span style={{ fontSize: '0.8rem', padding: '6px 12px', background: 'var(--accent-gold)', color: '#000', fontWeight: 700, borderRadius: '4px' }}>
                        100% VIRTUAL HACKATHON & INTERNSHIP
                    </span>
                </div>
            </header>

            <section className="glass-card" style={{ marginBottom: 'var(--spacing-lg)', borderLeft: '4px solid var(--accent-gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2 style={{ margin: 0 }}>Paid Internship Program</h2>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>JULY 2026 INTAKE</span>
                </div>
                <p>Join us for 3-6 months of real-world product development on Zaukriti.ai platforms.</p>
                <ul style={{ marginTop: '15px', marginLeft: '20px', color: 'var(--text-secondary)' }}>
                    <li>Stipend: ₹8,000 – ₹25,000 per month (performance-based)</li>
                    <li>Direct mentorship from Zaukriti Product Engineers</li>
                    <li>Official Internship Certificate & Proof of Work</li>
                    <li>Path to Full-time roles & ESOP options</li>
                </ul>
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <Link href="/apply" className="cta-button">Register for Hackathon</Link>
                </div>
            </section>

            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Specialization Tracks</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
                {tracks.map(track => (
                    <div key={track.slug} className="glass-card" style={{ height: '100%', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '0.65rem', fontWeight: 800, opacity: 0.6 }}>{track.status}</div>
                        <h3>{track.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                            Build production modules for Zaukriti's global ecosystem in the {track.title} domain.
                        </p>
                        <div style={{ marginTop: '20px' }}>
                            <Link href="/apply" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Apply Now →</Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
