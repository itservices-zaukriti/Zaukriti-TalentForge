'use client';
import { CAREER_DOMAINS, TIMELINE_EXPLANATION } from '@/lib/content_data';
import Link from 'next/link';
import { Clock, Briefcase, ExternalLink, CheckCircle, Info } from 'lucide-react';

export function CareerTracksCard({ currentTrack }: { currentTrack?: string }) {
    return (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', background: 'linear-gradient(to right, #f9fafb, #ffffff)' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase color="var(--brand-primary)" size={20} /> Your Possible Career Tracks
                </h2>
            </div>

            <div style={{ padding: '20px', flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
                <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Explore the domains available in the zaukriti ecosystem.
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                    {CAREER_DOMAINS.map((domain) => {
                        const isSelected = currentTrack && (currentTrack.toLowerCase() === domain.id || currentTrack.toLowerCase().includes(domain.slug));

                        return (
                            <Link href={`/domains/${domain.slug}`} key={domain.id} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--glass-border)',
                                    background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                    className="hover:scale-[1.02]"
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{domain.title}</span>
                                            {isSelected && <span style={{ fontSize: '0.7rem', background: 'var(--brand-primary)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>SELECTED</span>}
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{domain.forWho.slice(0, 40)}...</span>
                                    </div>
                                    <ExternalLink size={14} color="var(--text-tertiary)" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function TimelineExplanationCard() {
    return (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(249, 250, 251, 0.5)' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info color="var(--brand-primary)" size={20} /> How It Works
                </h2>
            </div>
            <div style={{ padding: '24px' }}>
                {TIMELINE_EXPLANATION.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '20px', paddingLeft: '16px', borderLeft: '2px solid var(--glass-border)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>{item.month}</span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '4px 0' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
