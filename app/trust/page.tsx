
import { CheckCircle2, Shield, AlertTriangle, XCircle, HelpCircle, Briefcase, Lock, UserCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Trust & Transparency | Zaukriti TalentForge',
    description: 'Our commitment to fair capability evaluation, data privacy, and ethical hiring practices.',
};

export default function TrustPage() {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', fontFamily: 'var(--font-inter)', color: 'var(--text-primary)' }}>

            {/* HERO */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', color: '#047857', padding: '8px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>
                    <Shield size={18} /> Official Trust Statement
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}>
                    We Evaluate <span style={{ color: 'var(--brand-primary)' }}>Capability</span>, Not Credentials.
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                    Zaukriti TalentForge is a merit-based evaluation platform designed to verify "Builder DNA" in students. We prioritize fairness, transparency, and data privacy.
                </p>
            </div>

            {/* WHAT IS TALENTFORGE */}
            <section style={{ marginBottom: '60px' }}>
                <div className="glass-card" style={{ padding: '40px', background: 'white', border: '1px solid #e5e7eb' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Briefcase size={24} className="text-brand-primary" /> What TalentForge IS
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                        <div>
                            <strong style={{ display: 'block', marginBottom: '8px', fontSize: '1.1rem' }}>Proof-of-Work Platform</strong>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>We assess ability through real-world problem statements, not multiple-choice exams.</p>
                        </div>
                        <div>
                            <strong style={{ display: 'block', marginBottom: '8px', fontSize: '1.1rem' }}>Industry-Aligned</strong>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>Our domains map directly to high-demand roles in modern tech ecosystems.</p>
                        </div>
                        <div>
                            <strong style={{ display: 'block', marginBottom: '8px', fontSize: '1.1rem' }}>Merit-First</strong>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>We ignore college tier. If you can build, you rank. Scores are tamper-proof.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT IS NOT */}
            <section style={{ marginBottom: '60px' }}>
                <div className="glass-card" style={{ padding: '40px', background: '#fffafa', border: '1px solid #fee2e2' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626' }}>
                        <XCircle size={24} /> What TalentForge is NOT
                    </h2>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#991b1b', fontWeight: 500 }}>
                            <XCircle size={18} /> NOT a coaching institute
                        </li>
                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#991b1b', fontWeight: 500 }}>
                            <XCircle size={18} /> NOT a guaranteed placement agency
                        </li>
                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#991b1b', fontWeight: 500 }}>
                            <XCircle size={18} /> NOT selling certificates for money
                        </li>
                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#991b1b', fontWeight: 500 }}>
                            <XCircle size={18} /> NOT a "get rich quick" scheme
                        </li>
                    </ul>
                </div>
            </section>

            {/* WHO SHOULD JOIN */}
            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>Eligibility & Fit</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div style={{ padding: '30px', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserCheck size={20} className="text-brand-primary" /> Mandatory Criteria
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <CheckCircle2 size={18} color="#10b981" /> Minimum 12th Completed
                            </li>
                            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <CheckCircle2 size={18} color="#10b981" /> Min. 6.0 CGPA (Consistent Academic Record)
                            </li>
                            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <CheckCircle2 size={18} color="#10b981" /> No Active Backlogs (Preferred)
                            </li>
                        </ul>
                    </div>
                    <div style={{ padding: '30px', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lock size={20} className="text-brand-primary" /> Who Succeeds Here?
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Students who value <strong>clarity over jargon</strong>. We look for those who can solve problems, not just memorize syntax. Degree type (BA/BSc/BTech) matters less than your ability to think.
                        </p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '30px', textAlign: 'center' }}>The Transparency Cycle</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {[
                        { title: '1. Register', desc: 'Verify email & pay fee.' },
                        { title: '2. Select Problem', desc: 'Choose your challenge in March.' },
                        { title: '3. Build (Apr)', desc: 'Submit Proof-of-Work.' },
                        { title: '4. Evaluate (May)', desc: 'Blind jury review.' },
                        { title: '5. Result (Jun)', desc: 'Outcome & Certification.' }
                    ].map((step, i) => (
                        <div key={i} style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '8px' }}>{step.title}</strong>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{step.desc}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* DATA PRIVACY */}
            <section style={{ marginBottom: '60px' }}>
                <div style={{ padding: '30px', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#166534' }}>
                        <Shield size={24} /> Data Protection Promise (DPDP 2023)
                    </h2>
                    <p style={{ color: '#14532d', marginBottom: '16px', lineHeight: 1.5 }}>
                        We adhere strictly to India's Digital Personal Data Protection Act.
                        Your data is used <strong>only</strong> for evaluation and hiring. We do not sell it.
                        You can request data deletion at any time via support.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '4px 12px', background: 'white', borderRadius: '4px', color: '#166534' }}>Consent First</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '4px 12px', background: 'white', borderRadius: '4px', color: '#166534' }}>Purpose Limited</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '4px 12px', background: 'white', borderRadius: '4px', color: '#166534' }}>Storage Limited</span>
                    </div>
                </div>
            </section>

            <div style={{ textAlign: 'center', marginTop: '60px', padding: '40px', background: 'var(--secondary-bg)', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Still have questions?</h3>
                <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>Read our detailed detailed answers for parents and students.</p>
                <Link href="/faq" style={{ display: 'inline-block', padding: '12px 32px', background: 'white', color: 'var(--text-primary)', borderRadius: '8px', border: '1px solid #e5e5e5', fontWeight: 600, textDecoration: 'none' }}>
                    Read Parents FAQ
                </Link>
            </div>

            <footer style={{ marginTop: '64px', borderTop: '1px solid #e5e5e5', paddingTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                &copy; {new Date().getFullYear()} Zaukriti Technologies Pvt. Ltd. | <Link href="/terms" style={{ color: 'var(--text-tertiary)' }}>Terms</Link> | <Link href="/privacy" style={{ color: 'var(--text-tertiary)' }}>Privacy</Link>
            </footer>

        </div>
    );
}
