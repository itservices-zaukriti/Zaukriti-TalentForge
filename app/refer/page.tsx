'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle, Share2, Linkedin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function ReferPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [referralData, setReferralData] = useState<any>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/register-referrer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            setReferralData({ code: data.referralCode });
            setStep(2);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main style={{ maxWidth: 600, margin: '60px auto', padding: '20px' }}>
            {step === 1 ? (
                <div className="glass-card" style={{ padding: '40px' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: 700, color: 'var(--brand-primary)', textAlign: 'center' }}>Refer & Earn</h1>
                    <p style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-secondary)' }}>
                        Join the Zaukriti Affiliate Program. Generate your unique referral code and earn ₹50 for every successful registration you refer.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--secondary-bg)', color: 'var(--text-primary)' }}
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--secondary-bg)', color: 'var(--text-primary)' }}
                        />
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--secondary-bg)', color: 'var(--text-primary)' }}
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="cta-button"
                            style={{ padding: '14px', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Generate Code'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Back to Home</Link>
                    </div>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                    <CheckCircle size={60} color="var(--accent-success)" style={{ margin: '0 auto 20px' }} />
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>You're an Affiliate!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Start sharing your code to earn rewards.</p>

                    <div style={{ background: 'var(--secondary-bg)', padding: '30px', borderRadius: '16px', border: '1px solid var(--brand-primary)', marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Your Unique Code</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '2px', marginBottom: '20px' }}>
                            {referralData.code}
                        </div>

                        {/* Social Sharing */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                            {(() => {
                                const shareText = `Join me at Zaukriti TalentForge 2026! 🚀\n\nUse my referral code *${referralData.code}* to get ₹50 OFF your registration.\n\nRegister here: https://zaukriti.ai/apply?ref=${referralData.code}`;
                                const shareUrl = `https://zaukriti.ai/apply?ref=${referralData.code}`;
                                const btnStyle = { padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', border: 'none', fontSize: '0.85rem' };

                                return (
                                    <>
                                        <button onClick={() => { navigator.clipboard.writeText(referralData.code); alert('Copied!'); }} style={{ ...btnStyle, background: 'var(--glass-border)', color: 'var(--text-primary)' }}>
                                            📋 Copy
                                        </button>
                                        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')} style={{ ...btnStyle, background: '#25D366', color: '#fff' }}>
                                            <Share2 size={14} style={{ marginRight: 5 }} /> WhatsApp
                                        </button>
                                        <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')} style={{ ...btnStyle, background: '#1DA1F2', color: '#fff' }}>
                                            <Twitter size={14} style={{ marginRight: 5 }} /> Twitter
                                        </button>
                                        <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')} style={{ ...btnStyle, background: '#0077b5', color: '#fff' }}>
                                            <Linkedin size={14} style={{ marginRight: 5 }} /> LinkedIn
                                        </button>
                                        <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')} style={{ ...btnStyle, background: '#1877F2', color: '#fff' }}>
                                            <Facebook size={14} style={{ marginRight: 5 }} /> Facebook
                                        </button>
                                        <button onClick={() => alert("Share code on Instagram Story!")} style={{ ...btnStyle, background: '#E1306C', color: '#fff' }}>
                                            <Instagram size={14} style={{ marginRight: 5 }} /> Instagram
                                        </button>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    <Link href="/" className="cta-button">Go to Home</Link>
                </div>
            )}
        </main>
    );
}
