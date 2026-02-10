'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ArrowRight, Share2, Linkedin, Facebook, Twitter, Smartphone, Code, Cpu, Database, Layout, X, Zap, HeartPulse, ShoppingBag, Server, Sparkles, Instagram, Target, Shield, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CAREER_DOMAINS, ELIGIBILITY_CRITERIA, TIMELINE_EXPLANATION } from '@/lib/content_data'

// --- CORE PLATFORMS DATA (From DPR) ---
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

export default function Home() {
    const [status, setStatus] = useState({
        isLive: false,
        label: "Loading...",
        subLabel: "Checking status..."
    });

    const [selectedPlatform, setSelectedPlatform] = useState<typeof CORE_PLATFORMS[0] | null>(null);

    useEffect(() => {
        async function checkLaunchStatus() {
            try {
                // 1. Authoritative Phase Check (API)
                const ts = new Date().getTime();
                const statusRes = await fetch(`/api/phase-status?t=${ts}`, {
                    cache: 'no-store',
                    headers: { 'Pragma': 'no-cache' }
                });

                let isLive = false;
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    if (statusData.isOpen) {
                        isLive = true;
                    }
                }

                if (isLive) {
                    setStatus({
                        isLive: true,
                        label: "Live Now", // Icon handled by UI or we can add emoji here if we remove the span dot
                        subLabel: "Registrations Open"
                    });
                    return;
                }

                // 2. If NOT Live, check for UPCOMING (Future) phases to show "Launching on..."
                // or Default to "Closed"
                const now = new Date().toISOString();
                const { data: upcoming } = await supabase
                    .from('pricing_phases')
                    .select('start_date')
                    .gt('start_date', now)
                    .eq('is_active', true)
                    .order('start_date', { ascending: true })
                    .limit(1);

                if (upcoming && upcoming.length > 0) {
                    const launchDate = new Date(upcoming[0].start_date);
                    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
                    setStatus({
                        isLive: false,
                        label: `Launching ${launchDate.toLocaleDateString('en-GB', options)}`,
                        subLabel: "Registrations opening soon"
                    });
                } else {
                    setStatus({
                        isLive: false,
                        label: "Registrations Closed",
                        subLabel: "Check back for next cohort"
                    });
                }

            } catch (e) {
                console.error("Failed to fetch launch status", e);
                setStatus({
                    isLive: false,
                    label: "Registrations Closed",
                    subLabel: "System Status Unavailable"
                });
            }
        }

        checkLaunchStatus();
    }, []);

    const shareUrl = "https://zaukriti.ai";
    const shareText = "Zaukriti AI Hackathon — Build Real AI Products. Register now:";

    return (
        <main style={{ overflowX: 'hidden', position: 'relative', marginTop: '65px' }}>

            {/* WATERMARK: Fixed Center */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
                opacity: 0.03, // Very subtle
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <span style={{
                    fontSize: '40vw',
                    fontWeight: 900,
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                    fontFamily: 'var(--font-inter)'
                }}>
                    Z
                </span>
            </div>

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

            {/* 1. HERO SECTION — Calm & Trustworthy */}
            <section id="hackathon" style={{
                paddingTop: 'var(--spacing-lg)',
                paddingBottom: 'var(--spacing-lg)',
                background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
                position: 'relative',
                zIndex: 1
            }}>
                {/* ... (Keep HERO Content exactly as is, just truncated for brevity in prompt blocks if needed, but I will include it all or just the wrapper if I can cut blocks?) */
                    /* Actually, to be safe, I will reproduce the whole return block reordered. */
                }
                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>

                    {/* Launch Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 16px',
                        background: status.isLive ? 'rgba(16, 185, 129, 0.1)' : (status.label.includes('Closed') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.08)'),
                        color: status.isLive ? '#10b981' : (status.label.includes('Closed') ? '#ef4444' : 'var(--brand-primary)'),
                        borderRadius: '30px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        marginBottom: '30px',
                        border: status.isLive ? '1px solid rgba(16, 185, 129, 0.2)' : (status.label.includes('Closed') ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(99, 102, 241, 0.2)')
                    }}>
                        <span className={status.isLive ? "animate-pulse" : ""}>●</span> {status.label}
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                        lineHeight: '1.1',
                        marginBottom: '24px',
                        background: 'linear-gradient(to right, #0f172a, #334155)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: 'var(--font-inter)'
                    }}>
                        Zaukriti AI <br />
                        <span style={{ color: 'var(--brand-primary)', WebkitTextFillColor: 'initial' }}>The New Standard for Builders.</span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                        color: 'var(--text-secondary)',
                        maxWidth: '700px',
                        margin: '0 auto 40px',
                        lineHeight: 1.6
                    }}>
                        Build Real AI Products. Get Hired. Grow With Us. <br />
                        Zaukriti AI Hackathon is a product-driven innovation program where participants work on real AI, SaaS, and automation problems.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link href="/apply" className="cta-button">
                            Register for Hackathon
                        </Link>
                        <Link href="/refer" className="cta-button-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Share2 size={16} /> Refer & Earn
                        </Link>
                        <Link href="/about" className="cta-button-secondary">
                            Explore Vision
                        </Link>
                    </div>

                    {/* Metric Pills */}
                    <div style={{
                        marginTop: '60px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        flexWrap: 'wrap',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} color="var(--brand-primary)" /> 100% Virtual</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} color="var(--brand-primary)" /> Merit-First</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} color="var(--brand-primary)" /> Paid Internships</span>
                    </div>
                </div>
            </section>

            {/* 2. ECOSYSTEM & TRACKS (MOVED UP) */}
            {/* 2. ECOSYSTEM & TRACKS (DYNAMIC) */}
            <section id="tracks" style={{ padding: 'var(--spacing-lg) 0', background: 'var(--secondary-bg)', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Our <span style={{ color: 'var(--brand-primary)' }}>Core Ecosystem</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
                            Your background does not limit your selection. Choose your area of capability.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {CAREER_DOMAINS.map((domain) => (
                            <Link key={domain.id} href={`/domains/${domain.slug}`} className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'block', textDecoration: 'none', transition: 'transform 0.2s', cursor: 'pointer', border: '1px solid var(--glass-border)' }}>
                                <div style={{ height: '140px', position: 'relative', background: domain.gradient }}>
                                    <Image src={domain.image} alt={domain.title} fill style={{ objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', color: 'white', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 600 }}>
                                        View Track <ArrowRight size={14} />
                                    </div>
                                </div>

                                <div style={{ padding: '20px' }}>
                                    <h4 style={{ marginBottom: '8px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{domain.title}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5, minHeight: '40px' }}>{domain.reason.slice(0, 90)}...</p>

                                    <div style={{ marginBottom: '12px' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>For:</span>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{domain.forWho.split('.')[0]}</p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {domain.learn.split(',').slice(0, 3).map(tool => (
                                            <span key={tool} style={{ fontSize: '0.75rem', background: 'var(--tertiary-bg)', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                                {tool.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2a. ELIGIBILITY SECTION (NEW) */}
            <section style={{ padding: 'var(--spacing-lg) 0', background: 'white', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Who Can <span style={{ color: 'var(--brand-primary)' }}>Join?</span></h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                        {ELIGIBILITY_CRITERIA.map((crit, idx) => (
                            <div key={idx} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: crit.isWarning ? '1px solid #fee2e2' : '1px solid var(--glass-border)' }}>
                                <div style={{ background: crit.isWarning ? '#fee2e2' : '#e0e7ff', padding: '10px', borderRadius: '50%', color: crit.isWarning ? '#ef4444' : 'var(--brand-primary)' }}>
                                    {crit.isWarning ? <CheckCircle2 size={20} style={{ transform: 'rotate(45deg)' }} /> : <CheckCircle2 size={20} />}
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{crit.label}</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: crit.isWarning ? '#ef4444' : 'var(--text-primary)' }}>{crit.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. PROGRAM CLARITY & TIMELINE (MOVED UP) */}
            <section id="program-dynamics" style={{ padding: 'var(--spacing-lg) 0', background: 'white', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Program <span style={{ color: 'var(--brand-primary)' }}>Dynamics</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Transparency is our core value. Here is exactly how the program works.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid var(--accent-gold)' }}>
                            <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Timeline & Evaluation</h4>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                {TIMELINE_EXPLANATION.map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '10px' }}>• <strong>{item.month}:</strong> {item.title}.</li>
                                ))}
                            </ul>
                            <Link href="/terms#timeline" style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', textDecoration: 'underline', marginTop: '10px', display: 'inline-block' }}>
                                View detailed timeline
                            </Link>
                        </div>
                        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid var(--brand-primary)' }}>
                            <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Fee Structure</h4>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                Registration fees cover <strong>platform access, evaluation infrastructure, and assessment</strong>. It is NOT a guaranteed job purchase. Selection is 100% merit-based.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid #10b981' }}>
                            <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Internship & Certification</h4>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                • <strong>Succeed:</strong> Top performers get paid internships.<br />
                                • <strong>Learn:</strong> Everyone gets a verified participation certificate.<br />
                                • <strong>Grow:</strong> Internships are performance-based engagements.
                            </p>
                            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.85rem' }}>
                                <Link href="/terms#certification" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>Certification details</Link>
                                <Link href="/terms#internship" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>Internship selection criteria</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. VISION & ROADMAP — Strategy (Keep here) */}
            <section id="vision" style={{ padding: 'var(--spacing-lg) 0', background: 'var(--secondary-bg)', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>The <span style={{ color: 'var(--brand-primary)' }}>Vision</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
                            We are not just running a hackathon. We are dismantling the resume-based hiring ecosystem
                            and replacing it with a <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Proof-of-Work</span> model.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'start' }}>

                        {/* LEFT COLUMN: The Philosophy (Why) */}
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Target className="text-brand-primary" size={24} />
                                Our Core Philosophy
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {/* Pillar 1 */}
                                <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--brand-primary)' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Shield size={18} color="var(--brand-primary)" /> De-Risked Hiring
                                    </h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        Resumes are noisy signals. We evaluate 'Builder DNA' through actual code execution, giving companies a pre-vetted, risk-free talent pipeline.
                                    </p>
                                </div>

                                {/* Pillar 2 */}
                                <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Layout size={18} color="#10b981" /> Vertically Integrated
                                    </h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        We don't just assess; we build. Our candidates work on our own live platforms (Chef2Restro, VitalHalo), ensuring their experience is production-grade.
                                    </p>
                                </div>

                                {/* Pillar 3 */}
                                <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <TrendingUp size={18} color="#f59e0b" /> Democratized Opportunity
                                    </h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        Talent is distributed; opportunity is not. We bridge this gap by offering elite mentorship and projects to Tier-2/3 city builders.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: The Roadmap (When) */}
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Zap className="text-brand-primary" size={24} />
                                Execution Roadmap
                            </h3>

                            <div id="roadmap" style={{ position: 'relative', paddingLeft: '10px' }}>
                                {/* Vertical Line */}
                                <div style={{ position: 'absolute', left: '29px', top: '10px', bottom: '30px', width: '2px', background: 'var(--glass-border)' }}></div>

                                {[
                                    { year: '2026', title: 'Phase 1: TalentForge Launch', desc: 'Sourcing 500+ builders. Validating the "No-Resume" hiring model through Pilot-1.', current: true },
                                    { year: '2027', title: 'Phase 2: SaaS Expansion', desc: 'Scaling Angadi.ai and Chef2Restro to 50+ cities. Opening Ops & Sales tracks.', current: false },
                                    { year: '2028', title: 'Phase 3: Enterprise Scale', desc: 'Serving 100+ Enterprise Clients with white-labeled assessment pipelines.', current: false },
                                    { year: '2029', title: 'Phase 4: Global AI Ecosystem', desc: 'Exporting our IP. Global leadership opportunities for our alumni.', current: false }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '30px', position: 'relative' }}>
                                        {/* Year Bubble */}
                                        <div style={{
                                            width: '40px', height: '40px', background: item.current ? 'var(--brand-primary)' : 'var(--primary-bg)',
                                            color: item.current ? 'white' : 'var(--text-secondary)',
                                            borderRadius: '50%',
                                            border: item.current ? 'none' : '2px solid var(--glass-border)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: '0.75rem', zIndex: 2, flexShrink: 0,
                                            boxShadow: item.current ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
                                        }}>
                                            {item.year.slice(2)}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, padding: '0 0 10px 0' }}>
                                            <h4 style={{ marginBottom: '4px', fontSize: '1rem', color: item.current ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                                                {item.title}
                                                {item.current && <span style={{ marginLeft: '8px', fontSize: '0.65rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)', padding: '2px 6px', borderRadius: '4px' }}>CURRENT</span>}
                                            </h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5b. REFERRAL PROGRAM (New - After Tracks) */}
            <section style={{ padding: 'var(--spacing-lg) 0', background: 'white', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Detailed <span style={{ color: 'var(--brand-primary)' }}>Referral Program</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            An honest, performance-based reward system for helping us find talent.
                            <br />
                            <Link href="/terms#referral" style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', textDecoration: 'underline', marginTop: '8px', display: 'inline-block' }}>
                                Referral Program Details
                            </Link>
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        {/* Individual */}
                        <div className="glass-card">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Individual Participants</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                Registered participants get a unique code.
                            </p>
                            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li><strong>₹50 Credit</strong> for every successful paid referral.</li>
                                <li>Unlimited rewards based on performance.</li>
                                <li>High performers get public recognition & badges.</li>
                            </ul>
                        </div>

                        {/* Organization */}
                        <div className="glass-card">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Campus & Organizations</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                For Colleges, Mentors, and Communities.
                            </p>
                            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li><strong>₹50 Credit</strong> per participant.</li>
                                <li>Official Ecosystem Partner status.</li>
                                <li>Priority access to future cohorts.</li>
                                <li><strong>Not MLM:</strong> This is a direct recognition program.</li>
                            </ul>
                        </div>

                        {/* Partner */}
                        <div className="glass-card">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Referral Partners</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                Non-participants who want to evangelize.
                            </p>
                            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Collaborate on future initiatives.</li>
                                <li>Receive website recognition.</li>
                                <li>Build community influence.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. SHARE & CTA */}
            <section style={{ padding: 'var(--spacing-lg) 0', background: 'white', position: 'relative', zIndex: 1 }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', background: 'var(--secondary-bg)', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Ready to Launch?</h2>
                        <Link href="/apply" className="cta-button" style={{ fontSize: '1.2rem', padding: '18px 48px', marginBottom: '40px' }}>
                            Start Your Application
                        </Link>

                        <div style={{ paddingTop: '30px', borderTop: '1px solid var(--glass-border)' }}>
                            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '20px' }}>Share with friends & colleagues</p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                {/* Shared Links Code with Prefilled Content */}
                                <a href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Share on WhatsApp"><Smartphone size={24} /></a>
                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#0077b5', color: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Share on LinkedIn"><Linkedin size={24} /></a>
                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#000000', color: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Share on X"><Twitter size={24} /></a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#1877F2', color: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Share on Facebook"><Facebook size={24} /></a>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ background: '#E1306C', color: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Instagram"><Instagram size={24} /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ padding: '60px 0', background: 'white', borderTop: '1px solid var(--glass-border)', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>

                        {/* 1. Brand & Legal */}
                        <div>
                            <div className="brand-stack" style={{ marginBottom: '16px' }}>
                                <div className="brand-main" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Zaukriti AI</div>
                                <div className="brand-legal" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Zaukriti Events Private Limited</div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Visakhapatnam, India<br />
                                DPIIT Recognized
                            </p>
                        </div>

                        {/* 2. Company */}
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>Company</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li><Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About Us</Link></li>
                                <li><Link href="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact Support</Link></li>
                            </ul>
                        </div>

                        {/* 3. Programs */}
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>Programs</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li><Link href="/#program-dynamics" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>How It Works</Link></li>
                                <li><Link href="/terms#referral" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Referral Program</Link></li>
                            </ul>
                        </div>

                        {/* 4. Legal */}
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li><Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms & Conditions</Link></li>
                                <li><Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link></li>
                                <li><Link href="/refund-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Refund & Cancellation</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                        © {new Date().getFullYear()} Zaukriti AI · Confidential & Proprietary · All Rights Reserved
                    </div>
                </div>
            </footer>
        </main>
    )
}
