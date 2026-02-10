'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, User, Briefcase, Calendar, Users, LogOut, CheckCircle, FileText, Download } from 'lucide-react';
import { CareerTracksCard, TimelineExplanationCard } from './DashboardUI';

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    router.push('/talentforge/login');
                    return;
                }

                const res = await fetch('/api/user/dashboard', {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });

                if (res.status === 401 || res.status === 403) {
                    const data = await res.json();
                    setError(data.error || 'Access Denied');
                    setLoading(false);
                    return;
                }

                if (!res.ok) throw new Error('Failed to load dashboard data');

                const data = await res.json();
                setUserData(data);

            } catch (err: any) {
                console.error("Dashboard Load Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/talentforge/login');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--secondary-bg)' }}>
                <Loader2 className="animate-spin" size={48} color="var(--brand-primary)" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--secondary-bg)', padding: '20px', textAlign: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Lock size={32} color="var(--accent-error)" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Access Restricted</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
                    <button onClick={handleLogout} className="cta-button" style={{ width: '100%' }}>
                        Sign Out / Return Home
                    </button>
                </div>
            </div>
        );
    }

    const { profile, timeline, referral } = userData;

    return (
        <main style={{ minHeight: '100vh', background: 'var(--secondary-bg)', fontFamily: 'var(--font-inter)' }}>
            {/* Header */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--glass-border)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--brand-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Z</div>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>TalentForge <span style={{ fontSize: '0.7rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' }}>BETA</span></span>
                </div>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <LogOut size={16} /> Sign Out
                </button>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

                {/* 1. Profile Summary */}
                <section style={{ marginBottom: '32px' }}>
                    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-dark))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 700, boxShadow: 'var(--shadow-lg)' }}>
                                    {profile.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{profile.name}</h1>
                                    <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                        <User size={14} /> {profile.email}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                {/* Eligibility Section (New) */}
                                <div style={{ background: 'var(--secondary-bg)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Eligibility</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, color: 'var(--text-primary)' }}>
                                        {profile.eligibilityStatus}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        {profile.batchLabel}
                                    </div>
                                </div>

                                <div style={{ background: 'var(--secondary-bg)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Track</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, color: 'var(--brand-dark)' }}>
                                        <Briefcase size={16} /> {(profile.track || 'General').toUpperCase()}
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-success)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Status</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--accent-success)' }}>
                                        Running / {profile.paymentStatus}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

                    {/* 2. Program Timeline */}
                    <section style={{ gridColumn: 'span 2' }}> // Note: minimal grid support inline
                        <div className="glass-card" style={{ height: '100%', padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(249, 250, 251, 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar color="var(--brand-primary)" size={20} /> Program Timeline
                                </h2>
                                <span style={{ fontSize: '0.75rem', background: '#e5e7eb', color: '#374151', padding: '4px 10px', borderRadius: '4px', fontWeight: 500 }}>Phase-0 View</span>
                            </div>

                            <div style={{ padding: '32px' }}>
                                {timeline.map((item: any, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px', opacity: 0.7 }}>
                                        <div style={{ marginRight: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'white', border: '2px solid #e5e5e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                                                <Lock size={14} color="#a3a3a3" />
                                            </div>
                                            {idx !== timeline.length - 1 && <div style={{ width: '2px', height: '100%', background: '#f3f4f6', minHeight: '40px', marginTop: '4px' }}></div>}
                                        </div>
                                        <div style={{ flex: 1, paddingBottom: '24px' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>{item.month}</span>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.activity}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Lock size={12} /> {item.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)', fontSize: '0.9rem', color: 'var(--brand-dark)', textAlign: 'center' }}>
                                    Timeline activities will unlock automatically on their respective dates.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Referral Stats */}
                    <section style={{ minWidth: '300px' }}>
                        <div className="glass-card" style={{ height: '100%', padding: 0, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', background: 'linear-gradient(to right, #f9fafb, #ffffff)' }}>
                                <h2 style={{ fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Users color="var(--brand-primary)" size={20} /> Referral Stats
                                </h2>
                            </div>

                            <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ marginBottom: '24px', width: '100%' }}>
                                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Unique Code</span>
                                    <div style={{ background: '#f3f4f6', color: '#1f2937', fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 700, padding: '12px 24px', borderRadius: '12px', border: '1px solid #e5e7eb', letterSpacing: '2px', cursor: 'pointer' }} onClick={() => { if (referral.code) navigator.clipboard.writeText(referral.code); }}>
                                        {referral.code}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', marginBottom: '24px' }}>
                                    <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--brand-dark)' }}>{referral.count}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600, marginTop: '4px' }}>Successful</div>
                                    </div>
                                    <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', opacity: 0.6 }}>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#9ca3af' }}>-</div>
                                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, marginTop: '4px' }}>Pending</div>
                                    </div>
                                </div>

                                <div style={{ width: '100%', background: '#fffbeb', borderRadius: '12px', padding: '16px', border: '1px solid #fcd34d', display: 'flex', alignItems: 'flex-start', gap: '12px', textAlign: 'left' }}>
                                    <div style={{ marginTop: '2px' }}><Lock size={16} color="#d97706" /></div>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#92400e', marginBottom: '4px' }}>Status: Pending Computation</p>
                                        <p style={{ fontSize: '0.75rem', color: '#b45309' }}>
                                            Referral audits & validation will occur in April.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* 3.1 Timeline Explanation (New) */}
                    <section>
                        <TimelineExplanationCard />
                    </section>

                    {/* 3.2 Career Tracks (New) */}
                    <section>
                        <CareerTracksCard currentTrack={profile.track} />
                    </section>
                </div>

                {/* 4. Problem Statement Selection (Phase Gated) */}
                {userData.problemSelection && (userData.problemSelection.windowOpen || userData.problemSelection.selected) && (
                    <section style={{ marginTop: '32px' }}>
                        <ProblemSelectionCard selection={userData.problemSelection} />
                    </section>
                )}

                {/* 5. Assignment Submission (Phase Gated) */}
                {/* 5. Assignment Submission (Phase Gated - April) */}
                {userData.assignment && userData.assignment.status !== 'EVALUATION' && (
                    <section style={{ marginTop: '32px' }}>
                        <AssignmentCard assignment={userData.assignment} />
                    </section>
                )}

                {/* 6. Evaluation Status (Phase Gated - May) */}
                {userData.evaluation && userData.evaluation.visible && !userData.results?.visible && (
                    <section style={{ marginTop: '32px' }}>
                        <EvaluationCard evaluation={userData.evaluation} />
                    </section>
                )}

                {/* 7. Results & Certificates (Phase Gated - June) */}
                {userData.results && userData.results.visible && (
                    <section style={{ marginTop: '32px' }}>
                        <ResultsCard results={userData.results} />
                    </section>
                )}
            </div>
        </main >
    );
}

function ProblemSelectionCard({ selection }: any) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSelect = async (problemId: string) => {
        if (!confirm("Are you sure? This choice is FINAL and cannot be changed.")) return;

        setSubmitting(true);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session");

            const res = await fetch('/api/user/problem-selection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ problemId })
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || "Selection failed");
            }

            // Reload page to reflect state
            window.location.reload();

        } catch (e: any) {
            console.error(e);
            setError(e.message);
            setSubmitting(false);
        }
    };

    if (selection.selected) {
        return (
            <div className="glass-card" style={{ padding: '32px', borderLeft: '4px solid var(--accent-success)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '50%', color: '#15803d' }}><Lock size={20} /></div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Problem Statement Selected</h2>
                </div>

                <div style={{ marginTop: '16px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>{selection.data.domain}</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0', color: 'var(--text-primary)' }}>{selection.data.title}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{selection.data.short_description}</p>
                </div>
                <div style={{ marginTop: '24px', fontSize: '0.9rem', color: '#15803d', fontWeight: 500, display: 'flex', gap: '8px' }}>
                    <CheckCircle size={16} /> Your selection has been locked. Prepare for the Assignment phase.
                </div>
            </div>
        );
    }

    if (!selection.windowOpen) {
        return null;
    }

    return (
        <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Briefcase size={24} className="text-brand" /> Select Your Problem Statement
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Choose the problem you want to solve during the program.
                    <strong style={{ color: 'var(--accent-error)', marginLeft: '6px' }}>Warning: This choice is irreversible appropriately.</strong>
                </p>
            </div>

            {error && (
                <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {(selection.available || []).map((problem: any) => (
                    <div key={problem.id} style={{ background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white', background: 'var(--brand-primary)', padding: '4px 8px', borderRadius: '4px' }}>{problem.domain}</span>
                            {problem.batch_level && <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', marginLeft: '8px', textTransform: 'uppercase' }}>{problem.batch_level}</span>}
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{problem.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', flex: 1 }}>{problem.short_description}</p>

                        <button
                            onClick={() => handleSelect(problem.id)}
                            disabled={submitting}
                            className="cta-button-secondary"
                            style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}
                        >
                            {submitting ? 'Locking...' : 'Select & Lock'}
                        </button>
                    </div>
                ))}

                {(!selection.available || selection.available.length === 0) && (
                    <div style={{ padding: '20px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                        No problems available for your eligibility level currently.
                    </div>
                )}
            </div>
        </div>
    );
}

function AssignmentCard({ assignment }: any) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        writeUpUrl: '',
        videoUrl: '',
        repoUrl: '',
        socialLinks: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm("Confirm Submission? You cannot edit this afterwards.")) return;

        setSubmitting(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session");

            // Format social links if present
            let socialJson = null;
            if (formData.socialLinks) {
                try {
                    // Try parsing as JSON first, if fails treat as string in simple object
                    socialJson = JSON.parse(formData.socialLinks);
                } catch {
                    socialJson = { link: formData.socialLinks };
                }
            }

            const res = await fetch('/api/user/assignment-submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    writeUpUrl: formData.writeUpUrl,
                    videoUrl: formData.videoUrl,
                    repoUrl: formData.repoUrl || null,
                    socialLinks: socialJson
                })
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || "Submission failed");
            }

            window.location.reload();

        } catch (e: any) {
            console.error(e);
            setError(e.message);
            setSubmitting(false);
        }
    };

    if (assignment.status === 'LOCKED') {
        return (
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center', opacity: 0.8 }}>
                <div style={{ background: '#f3f4f6', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Lock size={32} color="#9ca3af" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Assignment Locked</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{assignment.message}</p>
                <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    Prepare your deliverables. Submission will be enabled strictly in April.
                </div>
            </div>
        );
    }

    if (assignment.status === 'SUBMITTED') {
        return (
            <div className="glass-card" style={{ padding: '32px', borderLeft: '4px solid var(--brand-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '8px', borderRadius: '50%', color: 'var(--brand-primary)' }}><CheckCircle size={20} /></div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Assignment Submitted</h2>
                </div>
                <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Write-up:</span> <a href={assignment.data.write_up_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>View Link</a>
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Video:</span> <a href={assignment.data.video_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>View Link</a>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                        Submitted on {new Date(assignment.data.submitted_at).toLocaleDateString()}
                    </div>
                </div>
            </div>
        );
    }

    // OPEN
    return (
        <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Briefcase size={24} className="text-brand" /> Submit Your Assignment
                </h2>
                <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px', fontSize: '0.9rem', color: '#92400e', marginBottom: '16px' }}>
                    <strong>Warning:</strong> You can only submit once. Links cannot be edited after submission. Ensure they are publicly accessible.
                </div>
                {assignment.message && <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{assignment.message}</p>}
            </div>

            {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Project Write-up URL * (Blog/Doc)</label>
                    <input
                        type="url" required
                        placeholder="https://..."
                        value={formData.writeUpUrl}
                        onChange={e => setFormData({ ...formData, writeUpUrl: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'white' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Video Demo URL * (YouTube/Loom)</label>
                    <input
                        type="url" required
                        placeholder="https://..."
                        value={formData.videoUrl}
                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'white' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Code Repository (Optional)</label>
                    <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={formData.repoUrl}
                        onChange={e => setFormData({ ...formData, repoUrl: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'white' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Social Post Link (Optional)</label>
                    <input
                        type="text"
                        placeholder="LinkedIn / Twitter post URL"
                        value={formData.socialLinks}
                        onChange={e => setFormData({ ...formData, socialLinks: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'white' }}
                    />
                </div>

                <div style={{ marginTop: '8px' }}>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="cta-button"
                        style={{ width: '100%' }}
                    >
                        {submitting ? 'Submitting...' : 'Final Submit'}
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '12px' }}>
                        By submitting, you confirm that this is your own work and links are valid.
                    </p>
                </div>
            </form>
        </div>
    );
}

function EvaluationCard({ evaluation }: any) {
    const status = evaluation.status;

    // Status Styles
    let cardStyle: any = { padding: '32px', border: '1px solid var(--glass-border)', background: 'white' };
    let icon = <Loader2 className="animate-spin" size={32} color="var(--brand-primary)" />;
    let title = "Under Review";
    let message = "Your submission is currently being evaluated by our jury. Results will be declared by the end of May.";
    let color = "var(--brand-primary)";

    if (status === 'SELECTED') {
        cardStyle = { padding: '32px', borderLeft: '4px solid var(--accent-success)', background: 'rgba(220, 252, 231, 0.2)' };
        icon = <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '50%', color: '#15803d' }}><CheckCircle size={32} /></div>;
        title = "Selected for Internship";
        message = "Congratulations! You have been selected for the TalentForge Internship program. Check your email for next steps.";
        color = "#15803d";
    } else if (status === 'NOT_SELECTED') {
        cardStyle = { padding: '32px', borderLeft: '4px solid var(--text-tertiary)', background: 'rgba(243, 244, 246, 0.4)' };
        icon = <div style={{ background: '#e5e7eb', padding: '8px', borderRadius: '50%', color: '#4b5563' }}><Lock size={32} /></div>;
        title = "Not Selected";
        message = "Thank you for your participation. Unfortunately, you were not selected for the next round.";
        color = "#4b5563";
    }

    return (
        <div className="glass-card" style={cardStyle}>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    {icon}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>{title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>{message}</p>

                {status === 'UNDER_REVIEW' && (
                    <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--brand-dark)' }}>
                        <span style={{ fontWeight: 600 }}>Note:</span> Scores and internal metrics remain confidential.
                    </div>
                )}
            </div>
        </div>
    );
}

function ResultsCard({ results }: any) {
    const outcome = results.outcome;
    const certificates = results.certificates || [];

    let borderColor = 'var(--glass-border)';
    let bgColor = 'white';
    let title = "Evaluation Complete";
    let message = "The TalentForge evaluation cycle has concluded.";

    if (outcome === 'SELECTED') {
        borderColor = 'var(--accent-success)';
        bgColor = 'rgba(220, 252, 231, 0.1)';
        title = "Selected for Internship";
        message = "Congratulations! You have been selected. Your certificates are available below.";
    } else if (outcome === 'NOT_SELECTED') {
        borderColor = 'var(--text-tertiary)';
        bgColor = 'rgba(243, 244, 246, 0.4)';
        title = "Not Selected";
        message = "Thank you for participating. Your participation certificate is available below.";
    }

    return (
        <div className="glass-card" style={{ padding: '32px', border: `1px solid ${borderColor}`, borderLeft: `4px solid ${outcome === 'SELECTED' ? '#15803d' : (outcome === 'NOT_SELECTED' ? '#9ca3af' : borderColor)}`, background: bgColor }}>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 32px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{message}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '12px', fontStyle: 'italic' }}>
                    This concludes the TalentForge evaluation cycle.
                </div>
            </div>

            {certificates.length > 0 && (
                <div style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={20} className="text-brand" /> Issued Certificates
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {certificates.map((cert: any, idx: number) => (
                            <div key={idx} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {cert.certificate_type === 'PARTICIPATION' ? 'Participation Certificate' :
                                            (cert.certificate_type === 'SELECTION' ? 'Internship Offer Letter' : 'Community Leader Certificate')}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Issued: {new Date(cert.issued_at).toLocaleDateString()}</span>
                                </div>
                                <a
                                    href={cert.certificate_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cta-button-secondary"
                                    style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                                >
                                    <Download size={14} /> Download
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {certificates.length === 0 && outcome !== 'PENDING' && (
                <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '20px' }}>
                    Certificates are being generated. Please check back later.
                </div>
            )}
        </div>
    );
}
