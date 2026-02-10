
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'FAQ for Parents & Students | Zaukriti TalentForge',
    description: 'Frequently asked questions: Safety, pricing, outcomes, and eligibility.',
};

export default function FAQPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', fontFamily: 'var(--font-inter)', color: 'var(--text-primary)' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Frequently Asked Questions</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    Honest answers for students and parents.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '30px' }}>
                <div className="glass-card" style={{ padding: '30px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Is "TalentForge" a job?</h3>
                    <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        No. Zaukriti TalentForge is a <strong>pre-hiring evaluation ecosystem</strong>. It is a competition and assessment platform where students prove their skills. Winners are connected with hiring partners, but participation itself is not employment.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '30px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Do you charge money?</h3>
                    <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        Yes, there is a <strong>one-time registration fee</strong> (approx ₹199-499 depending on phase). This covers the cost of the platform, assessment infrastructure, and manual evaluation of the submitted work. There are <strong>no hidden monthly subscriptions</strong> or "income sharing agreements".
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '30px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Is this website safe for my child?</h3>
                    <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        Absolutely. Zaukriti Technologies Pvt. Ltd. is a registered Indian company. We enforce strict data privacy (DPDP Act 2023) and do not share student contact details with marketers or spammers. The platform is moderated and focused purely on technical skills.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '30px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>What happens if I fail the evaluation?</h3>
                    <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        You will receive a participation report highlighting your strengths and areas for improvement. You do not get a "Merit Certificate", but you gain the practical experience of building a real-world project (Proof-of-Work) which you can show to any future employer.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '30px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Is the certificate valid for college credits?</h3>
                    <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        While many colleges accept industry project work for internship credits, this is at the discretion of your specific university. We provide a verifiable validation letter which you can submit to your HOD/Dean for approval.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '30px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Who measures the criteria?</h3>
                    <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        Eligibility (12th Pass, 6.0 CGPA) is self-declared during registration but verified before final results. If a winner is found to have falsified their academic record, they will be disqualified. We trust our students to be honest.
                    </p>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <Link href="/" style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'none' }}>Back to Home</Link>
            </div>
        </div>
    )
}
