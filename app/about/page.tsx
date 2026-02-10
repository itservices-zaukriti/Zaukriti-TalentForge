'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle2, Zap, Code, HeartPulse, ShoppingBag, Server, Sparkles, X, ArrowRight, BrainCircuit, Utensils, Shirt, TrendingUp, Mic, BookOpen, Calculator, Cpu } from 'lucide-react'
import { CAREER_DOMAINS } from '@/lib/content_data';

// Icon Map for Dynamic Rendering
const ICON_MAP: any = {
    BrainCircuit: <BrainCircuit size={40} color="white" />,
    Code: <Code size={40} color="white" />,
    Utensils: <Utensils size={40} color="white" />,
    ShoppingBag: <ShoppingBag size={40} color="white" />,
    Shirt: <Shirt size={40} color="white" />,
    Stethoscope: <HeartPulse size={40} color="white" />, // Mapped 'Stethoscope' to HeartPulse for now or import Stethoscope
    TrendingUp: <TrendingUp size={40} color="white" />,
    Mic: <Mic size={40} color="white" />,
    BookOpen: <BookOpen size={40} color="white" />,
    Calculator: <Calculator size={40} color="white" />,
    Cpu: <Cpu size={40} color="white" />,
    Sparkles: <Sparkles size={40} color="white" />
};

export default function AboutPage() {
    const [selectedPlatform, setSelectedPlatform] = useState<typeof CAREER_DOMAINS[0] | null>(null);

    return (
        <main className="container" style={{ paddingTop: 'calc(65px + var(--spacing-lg))', paddingBottom: 'var(--spacing-lg)', minHeight: '80vh' }}>

            {/* PLATFORM MODAL */}
            {selectedPlatform && (
                <div className="modal-overlay" onClick={() => setSelectedPlatform(null)}>
                    <div
                        className="glass-card animate-fade"
                        onClick={e => e.stopPropagation()}
                        style={{
                            maxWidth: '600px',
                            width: '90%',
                            padding: '0',
                            overflow: 'hidden',
                            position: 'relative',
                            background: 'white'
                        }}
                    >
                        {/* Header Image Area */}
                        <div style={{
                            position: 'relative',
                            height: '250px',
                            width: '100%',
                            background: selectedPlatform.gradient
                        }}>
                            <Image
                                src={selectedPlatform.image}
                                alt={selectedPlatform.title}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: '20px'
                            }}>
                                <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '5px' }}>{selectedPlatform.title}</h2>
                                <p style={{ opacity: 0.9, fontWeight: 500, color: 'white' }}>{selectedPlatform.reason}</p>
                            </div>

                            <button
                                onClick={() => setSelectedPlatform(null)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    color: 'white',
                                    zIndex: 10
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '30px' }}>
                            <h4 style={{ marginBottom: '15px', color: 'var(--brand-primary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Strategic Vision</h4>
                            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: '30px' }}>
                                {selectedPlatform.reason}
                            </p>

                            <h4 style={{ marginBottom: '15px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Who Builds This?</h4>
                            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                {selectedPlatform.forWho}
                            </p>

                            <h4 style={{ marginBottom: '15px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Key Capabilities</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                                {selectedPlatform.learn.split(',').map(f => (
                                    <span key={f} style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        background: 'var(--secondary-bg)',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9rem',
                                        fontWeight: 500
                                    }}>
                                        {f.trim()}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => setSelectedPlatform(null)}
                                className="cta-button"
                                style={{ width: '100%' }}
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '40px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <section style={{ marginBottom: '80px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px' }}>
                <div style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--tertiary-bg)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '20px' }}>
                    THE MISSION
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--text-primary)', marginBottom: '24px', lineHeight: 1.2 }}>
                    Building the <span style={{ color: 'var(--brand-primary)' }}>Infrastructure</span> of Tomorrow.
                </h1>
                <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    Zaukriti is not a traditional agency. We are a product-first research organization architecting autonomous intelligence layers for real-world industries.
                </p>
            </section>

            <section style={{ marginBottom: '80px' }}>
                <div className="glass-card" style={{ padding: '60px 40px', background: 'white' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Founding <span style={{ color: 'var(--brand-primary)' }}>Mindset</span></h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '30px' }}>
                                Built by systems engineers, not marketers. We believe that the next generation of platforms won't just manage data—they will <strong>understand</strong> it.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    'Radical Transparency',
                                    'Pure Meritocracy',
                                    'Systems Thinking',
                                    'Outcome > Output'
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 500 }}>
                                        <CheckCircle2 size={20} color="var(--brand-primary)" /> {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: 'var(--tertiary-bg)', padding: '40px', borderRadius: '16px' }}>
                            <Zap size={40} color="var(--brand-primary)" style={{ marginBottom: '20px' }} />
                            <blockquote style={{ fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                                "We don't hire based on resumes. We hire based on the ability to solve a problem from first principles. Zaukriti is a playground for builders who want to own their work."
                            </blockquote>
                            <div style={{ marginTop: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>— Founder's Note</div>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ marginBottom: '60px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Our <span style={{ color: 'var(--brand-primary)' }}>Core Ecosystem</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Vertically integrated AI solutions powering our ecosystem.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {CAREER_DOMAINS.map((platform) => (
                        <div
                            key={platform.id}
                            className="glass-card"
                            style={{
                                padding: '0',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                border: '1px solid var(--glass-border)'
                            }}
                            onClick={() => setSelectedPlatform(platform)}
                        >
                            <div style={{
                                height: '180px',
                                position: 'relative',
                                background: platform.gradient
                            }}>
                                <Image
                                    src={platform.image}
                                    alt={platform.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0, left: 0, right: 0,
                                    padding: '10px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}>
                                    {ICON_MAP[platform.icon] || <Zap size={24} color="white" />}
                                </div>
                            </div>

                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{platform.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>{platform.reason.slice(0, 80)}...</p>
                                <div style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    View Vision <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div style={{ textAlign: 'center', marginTop: '60px', padding: '40px', background: 'var(--secondary-bg)', borderRadius: '16px' }}>
                <h3 style={{ marginBottom: '20px' }}>Join the Ecosystem</h3>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/apply" className="cta-button">Apply for TalentForge</Link>
                    <Link href="/contact" className="cta-button-secondary">Contact Us</Link>
                </div>
            </div>
        </main>
    )
}
