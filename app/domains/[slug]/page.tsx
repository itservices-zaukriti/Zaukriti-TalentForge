
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CAREER_DOMAINS, TIMELINE_EXPLANATION, ELIGIBILITY_CRITERIA } from '@/lib/content_data';
import {
    AlertTriangle,
    ArrowLeft,
    Briefcase,
    CheckCircle2,
    Clock,
    FileText,
    ListChecks,
    Shield,
    Target,
    Wrench,
    XCircle
} from 'lucide-react';

export async function generateStaticParams() {
    return CAREER_DOMAINS.map((domain) => ({
        slug: domain.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const domain = CAREER_DOMAINS.find((d) => d.slug === params.slug);
    if (!domain) return {};

    return {
        title: `${domain.title} | Zaukriti TalentForge`,
        description: domain.reason,
        openGraph: {
            title: domain.title,
            description: domain.reason,
            images: [domain.image],
        },
    };
}

export default function DomainPage({ params }: { params: { slug: string } }) {
    const domain = CAREER_DOMAINS.find((d) => d.slug === params.slug);

    if (!domain) {
        notFound();
    }

    const workItems = domain.work.split('.').map(s => s.trim()).filter(s => s.length > 0);
    const learnItems = domain.learn.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const outputItems = domain.output.split(',').map(s => s.trim()).filter(s => s.length > 0);

    // Technical domains check strictly for accurate messaging
    const isTechnical = ['fullstack', 'iot'].includes(domain.id);

    return (
        <main style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: '80px', fontFamily: 'var(--font-inter)' }}>

            {/* NAV / BACK */}
            <div className="container" style={{ padding: '20px' }}>
                <Link href="/#tracks" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Tracks
                </Link>
            </div>

            {/* 1. HERO SECTION */}
            <section style={{ padding: '40px 0 60px' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
                        <div style={{ background: domain.gradient, padding: '60px 40px', color: 'white' }}>
                            <div style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', opacity: 0.9, fontWeight: 600, marginBottom: '16px' }}>
                                Career Track
                            </div>
                            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
                                {domain.title}
                            </h1>
                            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, opacity: 0.95, maxWidth: '700px' }}>
                                {domain.reason.split('.')[0]}.
                            </p>

                            {domain.roles && domain.roles.length > 0 && (
                                <div style={{ marginTop: '30px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {domain.roles.map(role => (
                                        <span key={role} style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 500 }}>
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. WHO CAN JOIN */}
            <section style={{ paddingBottom: '60px' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="glass-card" style={{ padding: '40px', borderLeft: '4px solid var(--brand-primary)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Shield size={24} className="text-brand-primary" /> Who Can Join?
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                            <div>
                                <h4 style={{ fontSize: '1rem', color: 'var(--text-tertiary)', marginBottom: '16px', textTransform: 'uppercase' }}>Mandatory Criteria</h4>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <li style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                                        <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <span><strong>Minimum 12th Completed</strong> (Any Stream)</span>
                                    </li>
                                    <li style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                                        <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <span><strong>Min. 6.0 CGPA</strong> (or 60%) in academics</span>
                                    </li>
                                    <li style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                                        <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <span><strong>Thinking & Clarity &gt; Marks</strong></span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', color: 'var(--text-tertiary)', marginBottom: '16px', textTransform: 'uppercase' }}>Profile Match</h4>
                                <div style={{ background: 'var(--tertiary-bg)', padding: '16px', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {domain.forWho}
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                                        * Degree is Optional (e.g. BA, BSc, BCom, BTech). We value capability.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. WHAT YOU WILL DO & TOOLS */}
            <section style={{ paddingBottom: '60px' }}>
                <div className="container" style={{ maxWidth: '900px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                    {/* What you will do */}
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Briefcase size={22} className="text-brand-primary" /> What You Will Work On
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {workItems.map((item, idx) => (
                                <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'start', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '6px', height: '6px', background: 'var(--brand-primary)', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tools */}
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Wrench size={22} className="text-brand-primary" /> Tools You Learn
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                            {learnItems.map((tool, idx) => (
                                <span key={idx} style={{ background: 'var(--secondary-bg)', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                                    {tool}
                                </span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--tertiary-bg)', padding: '12px', borderRadius: '8px' }}>
                            {isTechnical ? <AlertTriangle size={16} color="#f59e0b" /> : <CheckCircle2 size={16} color="#10b981" />}
                            {isTechnical ? "Note: Basic coding knowledge required." : "Note: No prior coding required unless mentioned."}
                        </div>
                    </div>

                </div>
            </section>

            {/* 4. PROOF OF WORK & WHY */}
            <section style={{ paddingBottom: '60px' }}>
                <div className="container" style={{ maxWidth: '900px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                    {/* Proof of Work */}
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={22} className="text-brand-primary" /> Proof of Work (Apr)
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                            You will graduate with specialized assets, not just a certificate:
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {outputItems.map((item, idx) => (
                                <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    <CheckCircle2 size={16} color="var(--brand-primary)" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Why This Matters */}
                    <div className="glass-card" style={{ padding: '30px', background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Target size={22} className="text-brand-primary" /> Why This Matters
                        </h3>
                        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                            {domain.reason}
                        </p>
                    </div>

                </div>
            </section>

            {/* 5. WHAT THIS IS NOT (Disclaimer) */}
            <section style={{ paddingBottom: '60px' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="glass-card" style={{ padding: '30px', border: '1px solid #fee2e2', background: '#fffafa' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <XCircle size={20} /> What This Is NOT
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div style={{ fontSize: '0.9rem', color: '#7f1d1d' }}>❌ Not a coaching institute</div>
                            <div style={{ fontSize: '0.9rem', color: '#7f1d1d' }}>❌ Not guaranteed placement</div>
                            <div style={{ fontSize: '0.9rem', color: '#7f1d1d' }}>❌ Not a shortcut to success</div>
                            <div style={{ fontSize: '0.9rem', color: '#7f1d1d' }}>❌ Not selling certificates</div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#991b1b', marginTop: '16px', lineHeight: 1.5 }}>
                            We are a merit-based evaluation platform. We assess your ability to do the work. The outcome depends entirely on your effort.
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. TIMELINE & FLOW */}
            <section style={{ paddingBottom: '80px' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px' }}>TalentForge Flow</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>How your journey progresses from here.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        {TIMELINE_EXPLANATION.map((t, i) => (
                            <div key={i} className="glass-card" style={{ padding: '20px', position: 'relative' }}>
                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--brand-primary)', fontWeight: 700, marginBottom: '8px' }}>
                                    {t.month}
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{t.title}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{t.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FINAL CTA */}
            <section>
                <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
                    <div className="glass-card" style={{ padding: '40px', borderColor: 'var(--brand-primary)' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px' }}>Ready to Prove Yourself?</h2>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '30px' }}>
                            Join the {domain.title} track and start building.
                        </p>
                        <Link href="/apply" className="cta-button" style={{ display: 'inline-block', width: '100%', maxWidth: '300px', textAlign: 'center' }}>
                            Apply Now
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
