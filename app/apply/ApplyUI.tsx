'use client';
import { useState } from 'react';
import { ELIGIBILITY_CRITERIA, CAREER_DOMAINS } from '@/lib/content_data';
import {
    BrainCircuit, Utensils, ShoppingBag, Shirt, Stethoscope, TrendingUp, Mic, BookOpen, Calculator,
    CheckCircle, AlertTriangle, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export function EligibilitySection() {
    return (
        <div style={{ marginBottom: '40px', padding: '0 20px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>Who Can Join Zaukriti TalentForge?</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {ELIGIBILITY_CRITERIA.map((crit, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px', background: crit.isWarning ? 'rgba(239, 68, 68, 0.05)' : 'white' }}>
                        <div style={{ background: crit.isWarning ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '50%', color: crit.isWarning ? '#ef4444' : 'var(--brand-primary)' }}>
                            {crit.isWarning ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>{crit.label}</span>
                            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: crit.isWarning ? '#ef4444' : 'var(--text-primary)' }}>{crit.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '1.1rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "You are not being judged by your degree, but by what you build."
            </div>
        </div>
    );
}

export function DomainAccordionSection() {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'BrainCircuit': return <BrainCircuit size={24} />;
            case 'Utensils': return <Utensils size={24} />;
            case 'ShoppingBag': return <ShoppingBag size={24} />;
            case 'Shirt': return <Shirt size={24} />;
            case 'Stethoscope': return <Stethoscope size={24} />;
            case 'TrendingUp': return <TrendingUp size={24} />;
            case 'Mic': return <Mic size={24} />;
            case 'BookOpen': return <BookOpen size={24} />;
            case 'Calculator': return <Calculator size={24} />;
            default: return <BrainCircuit size={24} />;
        }
    };

    return (
        <div style={{ marginBottom: '60px', padding: '0 20px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Choose Your Domain</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                Find where your interest meets the future. Select a domain to see if it fits you.
            </p>

            <div style={{ display: 'grid', gap: '16px' }}>
                {CAREER_DOMAINS.map((domain) => {
                    const isOpen = openId === domain.id;
                    return (
                        <div key={domain.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', transition: 'all 0.3s ease' }}>
                            <div
                                onClick={() => toggle(domain.id)}
                                style={{
                                    padding: '20px 24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    background: isOpen ? 'rgba(99, 102, 241, 0.05)' : 'white'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ color: isOpen ? 'var(--brand-primary)' : 'var(--text-tertiary)' }}>
                                        {getIcon(domain.icon)}
                                    </div>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{domain.title}</span>
                                </div>
                                <div style={{ color: 'var(--text-tertiary)' }}>
                                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {isOpen && (
                                <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid var(--glass-border)' }}>
                                    <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>Who is this for?</span>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{domain.forWho}</p>
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>What you will do</span>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{domain.work}</p>
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>Tools you learn</span>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {domain.learn.split(', ').map((tool, i) => (
                                                    <span key={i} style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#374151' }}>{tool}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Link href={`/domains/${domain.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                                            View Full Details <ExternalLink size={14} />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
