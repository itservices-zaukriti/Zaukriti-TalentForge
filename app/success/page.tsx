'use client'

import Link from 'next/link'

export default function SuccessPage() {
    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-sm)', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '40px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                <h1 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>Registration Successful!</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1rem' }}>
                    Welcome to Zaukriti TalentForge. Your payment has been confirmed and your spot in the hackathon is secured.
                </p>

                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'inline-block', marginBottom: '20px' }}>
                    {/* QR Code Placeholder */}
                    <div style={{ width: '180px', height: '180px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc' }}>
                        <span style={{ color: '#666', fontSize: '0.8rem' }}>WhatsApp Group QR</span>
                    </div>
                </div>

                <p style={{ fontSize: '0.9rem', marginBottom: '30px' }}>
                    Scan to join the official WhatsApp group for hackathon updates, mentorship, and team building.
                </p>

                <a
                    href="https://chat.whatsapp.com/example"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button"
                    style={{ width: '100%', marginBottom: '15px' }}
                >
                    Join WhatsApp Group
                </a>

                <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
                    Back to Home
                </Link>
            </div>

            <p style={{ marginTop: '40px', fontSize: '0.7rem', opacity: 0.5, maxWidth: '300px' }}>
                A confirmation email has been sent to your registered address. For support, contact support@zaukriti.com
            </p>
        </main>
    )
}
