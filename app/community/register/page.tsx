'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function CommunityRegister() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        organizationName: '',
        organizationType: 'College'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        try {
            const res = await fetch('/api/community/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (!data.success) {
                // Strict Error Handling based on API response
                throw new Error(data.message || 'Something went wrong. Please try again.')
            }

            // Success Handling
            // Success Handling (Strict Rule: Must have referralCode)
            if (data.referralCode) {
                setSuccess(true)
                setMessage(data.message)
                setCode(data.referralCode)
            } else {
                // Fallback (Should not happen with new API, but safe default)
                setMessage(data.message || 'Registration submitted.')
                // Do NOT set success=true if no code (legacy behavior protection)
            }

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        const referralLink = `https://zaukriti.ai/register?ref=${code}`;
        const shareText = `Join Zaukriti TalentForge! Use my referral code ${code}`;

        const handleInstagramCopy = () => {
            navigator.clipboard.writeText(referralLink);
            alert("Instagram doesn't support direct sharing. Link copied — paste it in bio or story.");
        };

        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="glass-card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '60px 40px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--accent-gold)' }}>Your Referral Code Is Ready!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem' }}>
                        Your institutional partner account is active.
                    </p>

                    <div style={{ background: 'rgba(255, 204, 51, 0.05)', border: '1px solid var(--accent-gold)', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Your Referral Code
                        </p>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-gold)', letterSpacing: '2px', fontFamily: 'monospace' }}>
                            {code}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '15px' }}>
                            Share this code with your students. They get ₹50 off registration.
                        </p>
                    </div>

                    {/* Social Share Buttons */}
                    <div style={{ marginBottom: '25px' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Share on Social Media
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {/* WhatsApp */}
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(`Join Zaukriti using my referral code ${code} ${referralLink}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: '#25D366',
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '24px',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                title="Share on WhatsApp"
                            >
                                📱
                            </a>

                            {/* LinkedIn */}
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: '#0A66C2',
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '24px',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                title="Share on LinkedIn"
                            >
                                💼
                            </a>

                            {/* Twitter / X */}
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: '#000000',
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '24px',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                title="Share on Twitter / X"
                            >
                                🐦
                            </a>

                            {/* Facebook */}
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: '#1877F2',
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '24px',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                title="Share on Facebook"
                            >
                                👥
                            </a>

                            {/* Instagram */}
                            <button
                                onClick={handleInstagramCopy}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '24px',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                title="Copy link for Instagram"
                            >
                                📸
                            </button>

                            {/* Copy Link */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(referralLink);
                                    alert('Link copied to clipboard!');
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: '#6B7280',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '24px',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                title="Copy Link"
                            >
                                🔗
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', borderBottom: '1px dashed var(--text-secondary)' }}>
                            Return to Home
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main style={{ padding: '60px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center', marginBottom: '50px' }}>
                <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '20px', display: 'inline-block' }}>
                    ← Back to Zaukriti
                </Link>
                <h1 style={{ fontSize: '3rem', marginBottom: '15px' }}>Community <span style={{ color: 'var(--accent-gold)' }}>Referrer</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Empower your students with AI-driven careers. Join as an institutional partner.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px' }}>
                {error && (
                    <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', marginBottom: '25px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
                        <input
                            required
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: '#0a0a1f', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Official Email</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: '#0a0a1f', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Organization Name</label>
                    <input
                        required
                        type="text"
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        placeholder="e.g. IIT Madras or IEEE Student Branch"
                        style={{ width: '100%', padding: '12px', background: '#0a0a1f', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Organization Type</label>
                        <select
                            value={formData.organizationType}
                            onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: '#0a0a1f', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        >
                            <option value="College">College</option>
                            <option value="University">University</option>
                            <option value="Community">Community</option>
                            <option value="Institute">Institute</option>
                            <option value="Company">Company</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phone (Optional)</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: '#0a0a1f', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="cta-button"
                    style={{ width: '100%', padding: '15px' }}
                >
                    {loading ? 'Generating Code...' : 'Get Instant Access'}
                </button>

                <p style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.4 }}>
                    By joining, you agree to act as a promotional partner. Rewards are processed post-verification.
                </p>
            </form>
        </main>
    )
}
