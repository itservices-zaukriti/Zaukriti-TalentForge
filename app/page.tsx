'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ArrowRight, Share2, Linkedin, Facebook, Twitter, Smartphone, Code, Cpu, Database, Layout, X, Zap, HeartPulse, ShoppingBag, Server, Sparkles, Instagram } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
                // Fetch the earliest start date from pricing_phases
                const { data, error } = await supabase
                    .from('pricing_phases')
                    .select('start_date')
                    .order('start_date', { ascending: true })
                    .limit(1)

                let launchDate = new Date('2026-02-18T00:00:00'); // Default fallback

                if (data && data.length > 0) {
                    launchDate = new Date(data[0].start_date);
                }

                const now = new Date();
                const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };

                if (now < launchDate) {
                    setStatus({
                        isLive: false,
                        label: `🚀 Launching on ${launchDate.toLocaleDateString('en-GB', options)}`,
                        subLabel: "Registrations Open · Event starts soon"
                    });
                } else {
                    setStatus({
                        isLive: true,
                        label: "🟢 Live Now",
                        subLabel: "Event is ongoing"
                    });
                }
            } catch (e) {
                console.error("Failed to fetch launch date", e);
                // Fallback to default state if error
                setStatus({
                    isLive: false,
                    label: "🚀 Launching Soon",
                    subLabel: "Registrations Open"
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
                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>

                    {/* Launch Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 16px',
                        background: 'rgba(99, 102, 241, 0.08)',
                        color: 'var(--brand-primary)',
                        borderRadius: '30px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        marginBottom: '30px',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                        <span className="animate-pulse">●</span> {status.label}
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

            {/* 2. OUR CORE PLATFORMS (New Section) */}
            <section style={{ padding: 'var(--spacing-lg) 0', background: 'white', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Our <span style={{ color: 'var(--brand-primary)' }}>Core Platforms</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            We don't just host hackathons. We build vertically integrated AI solutions for the real world.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
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
                </div>
            </section>

            {/* 3. VISION & ROADMAP — Strategy */}
            <section id="vision" style={{ padding: 'var(--spacing-lg) 0', background: 'var(--secondary-bg)', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>The <span style={{ color: 'var(--brand-primary)' }}>Vision</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            This isn't just a hackathon. It's an entry point into our AI product ecosystem.
                        </p>
                    </div>

                    {/* Roadmap Timeline */}
                    <div id="roadmap" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', background: 'var(--brand-primary)', opacity: 0.2 }}></div>

                        {[
                            { year: '2026', title: 'AI Labs & Pilots', desc: 'Sourcing 500+ builders. Launching TalentForge.' },
                            { year: '2027', title: 'SaaS Launch India', desc: 'Scaling Angadi.ai and Chef2Restro across Tier-2 cities.' },
                            { year: '2028', title: 'Enterprise Scale', desc: 'Serving 100+ Enterprise Clients with custom AI pipelines.' },
                            { year: '2029', title: 'Global AI', desc: 'White-labeling our automation stack for global markets.' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '30px', marginBottom: '40px', position: 'relative' }}>
                                <div style={{
                                    width: '40px', height: '40px', background: 'var(--primary-bg)', borderRadius: '50%',
                                    border: '2px solid var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '0.8rem', zIndex: 2
                                }}>
                                    {item.year.slice(2)}
                                </div>
                                <div className="glass-card" style={{ flex: 1, padding: '20px' }}>
                                    <h4 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{item.title}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. CASE STUDY — Trust */}
            <section style={{ padding: 'var(--spacing-lg) 0', background: 'transparent', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div className="glass-card" style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                        color: 'white',
                        border: 'none',
                        textAlign: 'center',
                        padding: '60px 40px'
                    }}>
                        <div style={{ inlineSize: 'fit-content', margin: '0 auto', background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '20px' }}>
                            PILOT-0 DATA
                        </div>
                        <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '2.5rem' }}>Resume-Free Hiring Verified.</h2>
                        <p style={{ maxWidth: '700px', margin: '0 auto 40px', fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.95)' }}>
                            We audited 1,000+ students over 12 months. The result?
                            <strong style={{ color: 'white' }}> Performance is the only metric that matters.</strong>
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '40px', maxWidth: '800px', margin: '0 auto' }}>
                            <div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>1,000+</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Candidates Audited</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>12 Mo</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Research Duration</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>0</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Resume Bias</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. ECOSYSTEM & TRACKS */}
            <section id="tracks" style={{ padding: 'var(--spacing-lg) 0', background: 'var(--secondary-bg)', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Hackathon <span style={{ color: 'var(--brand-primary)' }}>Tracks</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Choose your specialized track to contribute to our platforms.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {[
                            { id: 'ai-ml', title: 'AI & Intelligence', details: 'OCR, NLP, RAG Systems, Model Tuning', tags: ['Python', 'LLMs'] },
                            { id: 'fullstack', title: 'Full-Stack Eng', details: 'Next.js 14, Real-time Sync, Scalable Arch', tags: ['React', 'Node'] },
                            { id: 'iot', title: 'IoT & Smart Systems', details: 'Sensor Fusion, Embedded, Edge Computing', tags: ['C++', 'IoT'] },
                            { id: 'cloud', title: 'Cloud Platforms', details: 'Serverless, DevOps, Security, Infrastructure', tags: ['AWS', 'Supabase'] },
                            { id: 'fashion-tech', title: 'Fashion & Beauty Tech', details: 'Virtual Try-On, AI Skin Analysis, Personal Styling', tags: ['GenAI', 'Vision'] },
                            { id: 'marketing', title: 'Product & Growth', details: 'Digital Marketing, Analytics, Sales, Franchise Networks & Strategy', tags: ['Figma', 'Analytics', 'Strategy'] },
                        ].map((track, i) => (
                            <Link key={i} href={`/projects/${track.id}`} className="glass-card link-card" style={{ borderLeft: `4px solid var(--brand-primary)`, display: 'block', textDecoration: 'none', transition: 'transform 0.2s', cursor: 'pointer' }}>
                                <h4 style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{track.title} <ArrowRight size={16} style={{ float: 'right', opacity: 0.5 }} /></h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{track.details}</p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {track.tags.map(tag => (
                                        <span key={tag} style={{ fontSize: '0.75rem', background: 'var(--tertiary-bg)', padding: '4px 10px', borderRadius: '4px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        ))}
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
            <footer style={{ padding: '40px 0', background: 'white', borderTop: '1px solid var(--glass-border)', position: 'relative', zIndex: 1 }}>
                <div className="container" style={{ textAlign: 'center' }}>

                    <div className="brand-stack" style={{ alignItems: 'center', marginBottom: '16px' }}>
                        <div className="brand-main">Zaukriti AI</div>
                        <div className="brand-tagline">AI Software Development</div>
                        <div className="brand-legal">Zaukriti Events Private Limited</div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '20px' }}>
                        Visakhapatnam, India · DPIIT Recognized
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.9rem' }}>
                        {/* Legal Footers */}
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>© Zaukriti AI · Confidential & Proprietary</div>
                    </div>
                </div>
            </footer>
        </main>
    )
}
