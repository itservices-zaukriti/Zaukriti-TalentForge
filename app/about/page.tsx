'use client'

import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-sm)', maxWidth: '900px', margin: '0 auto', minHeight: '80vh' }}>
            <section style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--accent-gold)', marginBottom: '20px' }}>Ecosystem Vision</h1>
                <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '30px' }}>
                    Zaukriti is not a traditional service provider or an event company. We are a <strong>product-driven AI & software organization</strong> building the digital infrastructure of tomorrow.
                </p>
                <div style={{ background: 'rgba(255, 204, 51, 0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 204, 51, 0.2)', textAlign: 'left' }}>
                    <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                        Our core mission is to architect <strong>autonomous intelligence layers</strong> for industry-specific platforms—from smart mobility and food-tech to automated event ecosystems. We focus on <strong>execution, ownership, and systems logic</strong>, ensuring that every product we build is scalable, intelligent, and value-driven.
                    </p>
                </div>
            </section>

            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '30px', textAlign: 'center' }}>Founding <span style={{ color: 'var(--accent-gold)' }}>Mindset</span></h2>
                <div className="glass-card" style={{ padding: '40px' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '25px' }}>
                        Zaukriti is founded by a <strong>technical, systems-oriented builder</strong> with extensive experience in architecting AI systems, data platforms, and high-performance digital products.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
                        <div>
                            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '15px' }}>Core Expertise</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                                <li>• AI Architecture & RAG Pipelines</li>
                                <li>• High-Scale Data Engineering</li>
                                <li>• Multi-tenant Platform Design</li>
                                <li>• IoT & Hardware Integration</li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '15px' }}>Leadership Philosophy</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                                <li>• Radical Transparency</li>
                                <li>• Pure Meritocracy</li>
                                <li>• Outcome-Driven Mentorship</li>
                                <li>• Systemic Thinking</li>
                            </ul>
                        </div>
                    </div>

                    <blockquote style={{ marginTop: '40px', padding: '20px', borderLeft: '4px solid var(--accent-gold)', background: 'rgba(255, 204, 51, 0.03)', fontStyle: 'italic', fontSize: '1.1rem' }}>
                        “We believe that sustainable technology companies are built by those who choose to understand the code, the system, and the user simultaneously. Zaukriti is a playground for such builders.”
                    </blockquote>
                </div>
            </section>

            <section style={{ textAlign: 'center', padding: '40px', background: 'var(--secondary-bg)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>The Long-Term Roadmap</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    Beyond TalentForge, we are scaling <strong>Angadi.ai</strong>, <strong>Chef2Restro</strong>, and <strong>Riksha.ai</strong> into market-leading intelligence platforms.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <Link href="/apply" className="cta-button" style={{ padding: '15px 30px' }}>Join the Journey</Link>
                    <Link href="/contact" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600, alignSelf: 'center' }}>Get in Touch →</Link>
                </div>
            </section>
        </main>
    )
}
