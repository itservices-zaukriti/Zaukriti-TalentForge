'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function Home() {
    const [showCertModal, setShowCertModal] = useState(false)
    return (
        <main style={{ paddingBottom: 'calc(var(--spacing-lg) + 40px)' }}>
            {/* 1. HERO SECTION — The Positioning Engine */}
            <section style={{
                padding: 'var(--spacing-md) var(--spacing-sm)',
                textAlign: 'center',
                background: 'radial-gradient(circle at top, #1e1b4b 0%, #0d0d2b 100%)',
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Glows */}
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(124, 58, 237, 0.12)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.12)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>

                <div style={{ position: 'relative', zIndex: 1, marginBottom: '20px' }}>
                    <img src="/logo.png" alt="Zaukriti Logo" style={{ height: '100px', width: 'auto', marginBottom: '20px' }} />
                </div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px' }}>
                    <h1 style={{ fontSize: '3.8rem', lineHeight: '1.05', marginBottom: '20px', color: 'var(--text-primary)', textShadow: '0 0 30px rgba(255,255,255,0.05)' }}>
                        Zaukriti Events AI <br />
                        <span style={{ color: 'var(--accent-gold)' }}>AI-Driven Digital Applications Platform</span>
                    </h1>
                    <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 30px', lineHeight: 1.4, fontWeight: 500 }}>
                        Building AI-powered platforms across events, food-tech, interiors, commerce, and intelligent mobility systems.
                    </p>
                    <p style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        “We select talent by execution — not resumes.”
                    </p>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link href="/apply" className="cta-button" style={{ padding: '20px 40px', fontSize: '1.2rem', boxShadow: '0 0 40px rgba(255, 204, 51, 0.2)' }}>
                            Register for TalentForge 2026
                        </Link>
                        <Link href="/about" style={{ padding: '20px 40px', fontSize: '1.2rem', color: '#fff', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                            Explore Our Vision
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. WHAT WE ARE BUILDING — The Ecosystem Engine */}
            <section style={{ padding: 'var(--spacing-lg) var(--spacing-sm)', background: 'var(--secondary-bg)', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.8rem', marginBottom: '20px' }}>The Zaukriti <span style={{ color: 'var(--accent-gold)' }}>Ecosystem</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px' }}>
                        We build autonomous digital infrastructure and intelligent systems that solve real-world industry problems at scale.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', textAlign: 'left' }}>
                        {[
                            { title: 'AI-Driven Event Planning', desc: 'Transforming logistics and experiences through intelligent orchestration and automated workflows.', icon: '🎟️' },
                            { title: 'Smart Dining & Food-Tech', desc: 'Building Chef2Restro and interactive table systems for the future of hospitality.', icon: '🍽️' },
                            { title: 'Interior AI & Visualization', desc: 'Real-time spatial intelligence and 3D visualization platforms for modern interiors.', icon: '🏢' },
                            { title: 'Local Commerce & Mobility', desc: 'Building Angadi.ai and Riksha.ai to empower local economies with intelligence layers.', icon: '🛺' },
                            { title: 'Intelligent Software Systems', desc: 'Custom enterprise AI solutions, from OCR pipelines to RAG-based knowledge systems.', icon: '🤖' }
                        ].map((item, i) => (
                            <div key={i} className="glass-card" style={{ padding: '30px' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{item.icon}</div>
                                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '12px', fontSize: '1.3rem' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. PILOT-0 LEARNINGS — The Trust Engine */}
            <section style={{ padding: 'var(--spacing-lg) var(--spacing-sm)', background: 'var(--primary-bg)', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(255, 204, 51, 0.1)', border: '1px solid var(--accent-gold)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' }}>
                        Core Evidence Archive
                    </div>
                    <h2 style={{ fontSize: '2.8rem', marginBottom: '15px' }}>Pilot-0 Case Study</h2>
                    <h3 style={{ color: 'var(--accent-gold)', marginBottom: '40px', fontSize: '1.3rem', fontWeight: 600 }}>12+ Months of Physical Audit Data</h3>

                    <div style={{ background: 'rgba(22, 22, 61, 0.4)', padding: '40px', borderRadius: '24px', border: '1px solid var(--glass-border)', textAlign: 'left', marginBottom: '40px' }}>
                        <p style={{ marginBottom: '20px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            Zaukriti conducted <strong>physical interviews and in-person evaluations</strong> of over <strong>1,000 students</strong> across a full year. We learned that <strong>resumes are misleading</strong> and performance is what matters.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', margin: '30px 0' }}>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '3rem', color: 'var(--accent-gold)', marginBottom: '5px' }}>1,000+</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Evaluated</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '3rem', color: 'var(--accent-gold)', marginBottom: '5px' }}>12+ Mo</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live Audit</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '3rem', color: 'var(--accent-gold)', marginBottom: '5px' }}>5</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full-Time Hires</p>
                            </div>
                        </div>
                        <p style={{ color: 'var(--accent-gold)', fontWeight: 700, textAlign: 'center', fontSize: '1.1rem' }}>
                            This audit directly formed Zaukriti’s 100% virtual, merit-first intake model.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. VIRTUAL HACKATHON ANNOUNCEMENT — The Opportunity Engine */}
            <section style={{ padding: 'var(--spacing-lg) var(--spacing-sm)', background: 'linear-gradient(180deg, #0d0d2b 0%, #16163d 100%)', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>TalentForge 2026</h2>
                    <h3 style={{ color: 'var(--accent-gold)', marginBottom: '40px', fontSize: '1.4rem' }}>100% Virtual • Merit-First • Build-to-Prove</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
                        <div className="glass-card" style={{ padding: '30px', border: '1px solid var(--accent-gold)' }}>
                            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '15px', fontSize: '1.2rem' }}>Paid Internships</h4>
                            <p style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600, marginBottom: '10px' }}>Up to ₹15,000 / Month</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Performance-based stipend with direct fast-track to full-time roles & ESOP eligibility.</p>
                        </div>
                        <div className="glass-card" style={{ padding: '30px' }}>
                            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '15px', fontSize: '1.2rem' }}>Global Virtual Intake</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Participate from anywhere. Submit code via GitHub. Demonstrations via 3-min video demos.</p>
                        </div>
                        <div className="glass-card" style={{ padding: '30px' }}>
                            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '15px', fontSize: '1.2rem' }}>Path to Ownership</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>We don't just hire interns; we select future core team members and potential co-builders.</p>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255, 204, 51, 0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 204, 51, 0.2)', textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                        <h4 style={{ color: 'var(--accent-gold)', marginBottom: '15px' }}>Judging Standard: Output Over Credentials</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.9rem' }}>
                            <div>✔ Functional prototypes • Tech depth • RAG/AI logic • API architecture</div>
                            <div style={{ opacity: 0.6 }}>✖ College name • Resume keywords • Past titles • GPA</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. TRACKS — The Specialization Engine */}
            <section style={{ padding: 'var(--spacing-lg) var(--spacing-sm)', background: 'var(--primary-bg)', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.8rem', marginBottom: '50px', textAlign: 'center' }}>Expansion <span style={{ color: 'var(--accent-gold)' }}>Tracks</span></h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {[
                            { title: 'AI & Intelligence', platforms: 'Angadi.ai, Chef2Restro', details: 'OCR, NLP, RAG Systems, Computer Vision' },
                            { title: 'Full-Stack Engineering', platforms: 'Zaukriti Core, Ecosystem Dashboards', details: 'Next.js 15, API Orchestration, Real-time Sync' },
                            { title: 'IoT & Smart Systems', platforms: 'Riksha.ai, Smart Dining', details: 'Sensor Fusion, IoT Automation, Embedded Logic' },
                            { title: 'Cloud & Platforms', platforms: 'Supabase, DevOps Architecture', details: 'Serverless Infrastructure, Security, Scaling' },
                            { title: 'Digital Marketing AI', platforms: 'Growth Platforms', details: 'AI Content Generation, Funnel Intelligence' },
                            { title: 'Product & UX', platforms: 'Entire Ecosystem', details: 'User Research, System Design, Experience Loops' }
                        ].map((track, i) => (
                            <div key={i} className="glass-card" style={{ padding: '25px' }}>
                                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>{track.title}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 700 }}>{track.platforms}</p>
                                <p style={{ fontSize: '0.85rem' }}>• {track.details}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. CALL TO ACTION & VIRAL SHARING — The Growth Engine */}
            <section style={{ padding: 'var(--spacing-xl) var(--spacing-sm)', textAlign: 'center', background: 'var(--secondary-bg)', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Ready to Build?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px' }}>Join the next generation of builders at Zaukriti.</p>

                    <Link href="/apply" className="cta-button" style={{ padding: '22px 60px', fontSize: '1.3rem', display: 'inline-block', marginBottom: '50px', boxShadow: '0 0 50px rgba(255, 204, 51, 0.3)' }}>
                        Apply for TalentForge Hackathon
                    </Link>

                    <div style={{ marginBottom: '40px', padding: '30px', background: 'rgba(255, 204, 51, 0.03)', borderRadius: '24px', border: '1px solid rgba(255, 204, 51, 0.1)' }}>
                        <h4 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>Represent a College or Organization?</h4>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            Become a Community Referrer and help your students access global opportunities while earning institutional rewards.
                        </p>
                        <Link href="/community/register" style={{ color: 'var(--accent-gold)', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid var(--accent-gold)' }}>
                            Register as a Community Partner →
                        </Link>
                    </div>

                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '40px' }}>
                        <p style={{ marginBottom: '20px', fontWeight: 600, color: 'var(--text-secondary)' }}>Viral Reach: Share This Hackathon</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <a href={`https://wa.me/?text=${encodeURIComponent("Join Zaukriti TalentForge — A merit-first virtual hackathon for AI builders! 🚀 https://zaukriti.ai")}`} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: '#fff', padding: '12px 24px', borderRadius: '30px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>WhatsApp</a>
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://zaukriti.ai")}`} target="_blank" rel="noopener noreferrer" style={{ background: '#0077b5', color: '#fff', padding: '12px 24px', borderRadius: '30px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>LinkedIn</a>
                            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Building the future of AI at @Zaukriti TalentForge. Join the merit-first virtual hackathon! 🚀")}&url=${encodeURIComponent("https://zaukriti.ai")}`} target="_blank" rel="noopener noreferrer" style={{ background: '#000', color: '#fff', padding: '12px 24px', borderRadius: '30px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.2)' }}>Twitter (X)</a>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ padding: 'var(--spacing-lg) var(--spacing-sm)', textAlign: 'center', borderTop: '1px solid var(--glass-border)', background: 'var(--primary-bg)' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h3 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>Zaukriti Events Private Limited</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '20px' }}>
                        CIN: U62099AP2025PTC122716 <br />
                        Visakhapatnam, Andhra Pradesh
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', fontSize: '0.9rem' }}>
                        <Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About Vision</Link>
                        <Link href="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact Us</Link>
                        <span style={{ cursor: 'pointer', color: 'var(--accent-gold)' }} onClick={() => setShowCertModal(true)}>DPIIT Recognized</span>
                    </div>
                    <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>© 2026 Zaukriti. Built for builders.</p>
                </div>
            </footer>

            {/* Certificate Modal */}
            {showCertModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'var(--primary-bg)', border: '1px solid var(--accent-gold)', padding: '30px', borderRadius: '16px', maxWidth: '800px', width: '100%', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <button onClick={() => setShowCertModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '20px' }}>DPIIT Recognition Certificate</h3>
                        <div style={{ flex: 1, background: '#111', borderRadius: '8px', overflow: 'hidden', minHeight: '400px' }}>
                            <iframe src="/certificates/dpiit-recognition.pdf" style={{ width: '100%', height: '100%', border: 'none' }} title="DPIIT Certificate"></iframe>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
