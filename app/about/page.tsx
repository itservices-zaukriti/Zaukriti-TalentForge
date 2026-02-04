'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle2, Zap, Code, HeartPulse, ShoppingBag, Server, Sparkles, X, ArrowRight } from 'lucide-react'

// DUPLICATE CORE PLATFORMS DATA for About Page
// Updated with Unsplash "Real" Images
const CORE_PLATFORMS = [
    {
        id: 'talentforge',
        title: "TalentForge",
        tagline: "Merit-First Technical Hiring",
        vision: "A specialized evaluation platform that replaces resume screening with skill-based challenges. We verify 'Builder DNA' through real-world problem statements, creating a direct pipeline of pre-vetted talent for startups and enterprises.",
        icon: <Code size={40} color="white" />,
        image: "/platforms/talentforge_cover.jpg",
        gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)", // Indigo
        features: ["Skill-based assessments", "No-resume hiring", "Automated code evaluation"]
    },
    {
        id: 'chef2restro',
        title: "Chef2Restro",
        tagline: "The OS for Modern Hospitality",
        vision: "An end-to-end smart restaurant operating system. Integrating IoT-enabled smart tables, voice-ordered KOTs (Kitchen Order Tickets), and inventory forecasting to reduce wastage and improve table turnaround time by 30%.",
        icon: <Zap size={40} color="white" />,
        image: "/platforms/chef2restro_cover.jpg",
        gradient: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)", // Sky Blue
        features: ["IoT Smart Tables", "AI Kitchen Display", "Inventory Forecasting"]
    },
    {
        id: 'vitalhalo',
        title: "VitalHalo",
        tagline: "Smart Clinic Ecosystem",
        vision: "Bridging the gap between patient data and clinical decision making. A cohesive platform connecting IoT vital sensors directly to the doctor's dashboard, automating prescriptions, and identifying critical patterns early using AI.",
        icon: <HeartPulse size={40} color="white" />,
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80", // Medical
        gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)", // Emerald
        features: ["IoT Vitals Sync", "Automated EMR", "Predictive Alerts"]
    },
    {
        id: 'angadi',
        title: "Angadi.ai",
        tagline: "Hyperlocal Commerce Intelligence",
        vision: "Empowering Tier-2/3 merchants with data. A platform that digitizes local inventory and provides actionable demand forecasting, allowing small businesses to compete with quick-commerce giants through smarter logistics.",
        icon: <ShoppingBag size={40} color="white" />,
        image: "/platforms/angadi_cover.jpg",
        gradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)", // Amber
        features: ["Local Inventory Sync", "Demand Forecasting", "Hyperlocal Logistics"]
    },
    {
        id: 'velvetlens',
        title: "VelvetLens",
        tagline: "AI Fashion & Beauty Tech",
        vision: "Revolutionizing the D2C fashion experience. Using Generative AI for Virtual Try-Ons (VTO), Computer Vision for Skin Analysis, and hyper-personalized wardrobe matching algorithms to boost conversion rates.",
        icon: <Sparkles size={40} color="white" />,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", // Fashion Model
        gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)", // Pink
        features: ["Virtual Try-On (VTO)", "AI Skin Analysis", "Style Recommendations"]
    },
    {
        id: 'zaukriti-iot',
        title: "Zaukriti IoT",
        tagline: "Industrial Automation Systems",
        vision: "Custom hardware solutions for specific industrial pain points. From automated quality control cameras on assembly lines to energy-optimizing sensors for large facilities.",
        icon: <Server size={40} color="white" />,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", // Circuit/Chip
        gradient: "linear-gradient(135deg, #64748b 0%, #334155 100%)", // Slate
        features: ["Custom PCB Design", "Edge AI Processing", "Industrial Sensors"]
    }
]

export default function AboutPage() {
    const [selectedPlatform, setSelectedPlatform] = useState<typeof CORE_PLATFORMS[0] | null>(null);

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
                                <p style={{ opacity: 0.9, fontWeight: 500, color: 'white' }}>{selectedPlatform.tagline}</p>
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
                                {selectedPlatform.vision}
                            </p>

                            <h4 style={{ marginBottom: '15px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Key Capabilities</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                                {selectedPlatform.features.map(f => (
                                    <span key={f} style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        background: 'var(--secondary-bg)',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9rem',
                                        fontWeight: 500
                                    }}>
                                        {f}
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
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Our <span style={{ color: 'var(--brand-primary)' }}>Core Platforms</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Vertically integrated AI solutions powering our ecosystem.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {CORE_PLATFORMS.map((platform) => (
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
                                background: 'var(--tertiary-bg)' // Fallback
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
                                    {platform.icon}
                                </div>
                            </div>

                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{platform.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>{platform.tagline}</p>
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
