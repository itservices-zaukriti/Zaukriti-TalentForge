'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Code, Trophy, Users, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Zap, Award, Timer } from 'lucide-react';

export default function HackathonPage() {
    return (
        <main style={{ marginTop: '65px', overflowX: 'hidden' }}>

            {/* 1. HERO SECTION - DISTINCT BRANDING */}
            <section style={{
                background: 'linear-gradient(135deg, #000000 0%, #1e1b4b 100%)',
                color: 'white',
                padding: 'var(--spacing-xl) 0',
                position: 'relative'
            }}>
                {/* Abstract Shapes */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', opacity: 0.1 }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)' }}></div>
                    <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)' }}></div>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '30px', fontSize: '0.9rem' }}>
                        <Timer size={16} className="text-accent-gold" />
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>Registrations Closing Soon</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '24px',
                        background: 'linear-gradient(to bottom, #ffffff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-2px'
                    }}>
                        TalentForge<br />2026
                    </h1>

                    <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                        The ultimate 5-day product building sprint. <br />
                        Prove your skills. Skip the resume. Get hired.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <Link href="/apply" className="cta-button" style={{ background: 'white', color: 'black', border: 'none' }}>
                            Apply Now
                        </Link>
                        <Link href="#schedule" className="cta-button-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                            View Schedule
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. THE STAKES (PRIZES & OUTCOMES) */}
            <section style={{ padding: 'var(--spacing-lg) 0', background: 'white' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>The <span style={{ color: 'var(--brand-primary)' }}>Stakes</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>What you are fighting for.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px', borderTop: '4px solid var(--accent-gold)' }}>
                            <Trophy size={48} color="var(--accent-gold)" style={{ margin: '0 auto 20px' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Internship Offers</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                                Top performers across all tracks receive direct paid internship offers from Zaukriti & Partners.
                            </p>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px', borderTop: '4px solid var(--brand-primary)' }}>
                            <Award size={48} color="var(--brand-primary)" style={{ margin: '0 auto 20px' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Certification</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                                Verified 'Builder DNA' certificates for all who complete the challenge, recognized by our hiring network.
                            </p>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px', borderTop: '4px solid #10b981' }}>
                            <Zap size={48} color="#10b981" style={{ margin: '0 auto 20px' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>PPO Fast-Track</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                                Exceptional execution leads to Pre-Placement Offers (PPOs) directly, bypassing standard interviews.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SCHEDULE */}
            <section id="schedule" style={{ padding: 'var(--spacing-lg) 0', background: 'var(--secondary-bg)' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>5-Day <span style={{ color: 'var(--brand-primary)' }}>Sprint</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>A structured marathon of innovation.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { day: 'Day 1', title: 'The Launch', desc: 'Problem statements released. Teams finalized. Mentorship channels open.' },
                            { day: 'Day 2', title: 'Architecture & Design', desc: 'System design review. Database schema finalization. UI/UX prototyping.' },
                            { day: 'Day 3', title: 'Core Development', desc: 'Intensive coding blocks. API integration. Middleware setup.' },
                            { day: 'Day 4', title: 'Polish & Integration', desc: 'Frontend-Backend wiring. Testing. Bug bashes. Pitch deck prep.' },
                            { day: 'Day 5', title: 'Demo Day', desc: 'Final submissions. Video demos. Jury evaluation. Winners announced.' }
                        ].map((item, i) => (
                            <div key={i} className="glass-card" style={{ display: 'flex', gap: '30px', alignItems: 'center', padding: '30px' }}>
                                <div style={{
                                    minWidth: '80px',
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    color: 'var(--brand-primary)',
                                    borderRight: '2px solid var(--glass-border)',
                                    paddingRight: '20px'
                                }}>
                                    {item.day}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.title}</h4>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. JUDGING CRITERIA */}
            <section style={{ padding: 'var(--spacing-lg) 0', background: 'white' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Evaluation <span style={{ color: 'var(--brand-primary)' }}>Matrix</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>How you will be graded. No subjectivity.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        {[
                            { title: 'Code Quality', pct: '30%', desc: 'Clean, modular, and scalable code. Proper error handling.' },
                            { title: 'Functionality', pct: '30%', desc: 'Does it work? Have the core requirements been met?' },
                            { title: 'UX / Design', pct: '20%', desc: 'Is it intuitive? Does it look professional?' },
                            { title: 'Innovation', pct: '20%', desc: 'Novel approach to the problem statement.' },
                        ].map(c => (
                            <div key={c.title} className="glass-card" style={{ padding: '30px' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '10px' }}>{c.pct}</div>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{c.title}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. FAQ / RULES COMPACT */}
            <section style={{ padding: 'var(--spacing-lg) 0', background: 'var(--secondary-bg)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Rules of <span style={{ color: 'var(--brand-primary)' }}>Engagement</span></h2>
                    </div>

                    <div className="glass-card" style={{ padding: '40px' }}>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', listStyle: 'none' }}>
                            {[
                                'Teams can have up to 3 members.',
                                'All code must be written during the event.',
                                'Use of open-source libraries is allowed and encouraged.',
                                'Plagiarism leads to immediate disqualification.',
                                'Decisions of the jury are final.'
                            ].map((rule, i) => (
                                <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                                    <CheckCircle2 color="var(--brand-primary)" size={20} />
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '80px 0', background: 'white', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Build?</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                        The clock is ticking. Secure your spot in the cohort.
                    </p>
                    <Link href="/apply" className="cta-button" style={{ fontSize: '1.2rem', padding: '18px 48px' }}>
                        Register Now
                    </Link>
                </div>
            </section>

        </main>
    );
}
