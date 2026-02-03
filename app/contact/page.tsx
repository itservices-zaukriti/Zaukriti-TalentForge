'use client'

import React from 'react'
import { PLATFORM_CONFIG } from '../utils/config'

export default function ContactPage() {
    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-sm)', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--accent-gold)', marginBottom: '20px', textAlign: 'center' }}>Get in Touch</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '50px' }}>
                For official inquiries, support, or partnership discussions regarding the Zaukriti ecosystem.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🏗️</div>
                    <h4 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>Hackathon Doubts</h4>
                    <p style={{ fontSize: '1.1rem' }}>
                        <a href={`mailto:${PLATFORM_CONFIG.branding.hackathonEmail}`} style={{ color: '#fff', textDecoration: 'none' }}>{PLATFORM_CONFIG.branding.hackathonEmail}</a>
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Technical & enrollment assistance</p>
                </div>

                <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🌐</div>
                    <h4 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>Product & Services</h4>
                    <p style={{ fontSize: '1.1rem' }}>
                        <a href={`mailto:${PLATFORM_CONFIG.branding.productEmail}`} style={{ color: '#fff', textDecoration: 'none' }}>{PLATFORM_CONFIG.branding.productEmail}</a>
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Official ecosystem inquiries</p>
                </div>
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🏢</div>
                    <h4 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>Registered Office</h4>
                    <p style={{ fontSize: '1.1rem' }}>Visakhapatnam, Andhra Pradesh</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Global Product HQ</p>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '40px', padding: '40px', background: 'rgba(22, 22, 61, 0.4)' }}>
                <h3 style={{ color: 'var(--accent-gold)', marginBottom: '20px', textAlign: 'center' }}>Legal & Compliance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', fontSize: '0.9rem' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Company Name</p>
                        <p style={{ fontWeight: 600 }}>Zaukriti Events Private Limited</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>CIN</p>
                        <p style={{ fontWeight: 600 }}>U62099AP2025PTC122716</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Jurisdiction</p>
                        <p style={{ fontWeight: 600 }}>Visakhapatnam, Andhra Pradesh</p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Data Compliance</p>
                        <p style={{ fontWeight: 600 }}>Indian IT Act (DPDP Compliant)</p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '60px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Official Social Channels</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '25px' }}>
                    <a href="https://linkedin.com/company/zaukriti" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '1.5rem', textDecoration: 'none' }}>LinkedIn</a>
                    <a href="https://twitter.com/zaukriti" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '1.5rem', textDecoration: 'none' }}>Twitter</a>
                    <a href="https://instagram.com/zaukritievents" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '1.5rem', textDecoration: 'none' }}>Instagram</a>
                </div>
            </div>
        </main >
    )
}
