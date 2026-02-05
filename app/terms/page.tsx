'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function TermsPage() {
    useEffect(() => {
        // Handle hash scrolling with offset
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        }
    }, []);

    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-md)', maxWidth: '800px', margin: '0 auto', paddingBottom: '100vh' }}>
            <section className="glass-card" style={{ padding: '30px', textAlign: 'left' }}>
                <h2 style={{ color: 'var(--accent-gold)', marginBottom: '20px' }}>Terms & Conditions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                    <p>
                        <strong>1. Program Identity:</strong> Zaukriti TalentForge is a 100% virtual merit-first selection program. Participants from across India can participate remotely via digital submissions (GitHub, Video Demos, and Virtual Interviews).
                    </p>
                    <p>
                        <strong>2. Hiring & Ownership:</strong> Selection for virtual paid internships (Up to ₹15k/mo) and full-time roles is discretionary and performance-based. ESOP eligibility is subject to probation completion and board approval.
                    </p>
                    <p>
                        <strong>3. Registration:</strong> Fees (Individual: ₹999, Team: up to ₹2,399) are technical processing fees and are non-refundable. Support queries: <a href="mailto:talentforge@zaukritievents.in" style={{ color: 'var(--accent-gold)' }}>talentforge@zaukritievents.in</a>.
                    </p>
                    <p>
                        <strong>4. Intellectual Property:</strong> Participants retain rights to original work, but grant Zaukriti license for evaluation. IP for specific Zaukriti product problem statements (Chef2Restro, etc.) belongs to Zaukriti Events Private Limited.
                    </p>
                    <p>
                        <strong>5. Rewards & Recognition:</strong> The rewards pool (including select cash awards and recognitions) is a secondary incentive. All distributions are at the sole discretion of the Company and Jury.
                    </p>
                    <p>
                        <strong>6. Jurisdiction:</strong> This agreement is governed by Indian laws, subject to the exclusive jurisdiction of the courts in <strong>Visakhapatnam, Andhra Pradesh</strong>.
                    </p>
                    <p id="referral" style={{ scrollMarginTop: '150px' }}>
                        <strong>7. Community Referrers:</strong> Institutional partners (College Ambassadors) act as promotional partners and are not participants/applicants unless registered separately. Referral credits (₹50) are promotional and internal; they do not constitute wages or commissions.
                    </p>
                    <p>
                        <strong>8. Fraud Prevention:</strong> Any attempt to manipulate the referral system or create fake registrations will lead to immediate disqualification and freezing of all associated wallets/credits.
                    </p>
                    <p>
                        <strong>9. Nature of Program:</strong> Zaukriti is a capability-based evaluation and hackathon platform. It is NOT a job assurance agency, paid internship scheme, or certificate-selling entity. Registration fees cover platform access, evaluation infrastructure, assessment bandwidth, and administrative operations.
                    </p>
                    <p id="internship" style={{ scrollMarginTop: '150px' }}>
                        <strong>10. Evaluation & Internship:</strong> Selection for internships is strictly performance-based. Registration does NOT guarantee an internship, full-time role, or stipend. Internship engagements are a continuation of the evaluation process, not a purchased benefit. Stipends are provided only to selected interns based on performance.
                    </p>
                    <p id="timeline" style={{ scrollMarginTop: '150px' }}>
                        <strong>11. Timeline & Enrolment:</strong> Enrolments close strictly by the end of March. No new registrations are accepted post-deadline. Evaluation occurs in May, results in June.
                    </p>
                    <p id="certification" style={{ scrollMarginTop: '150px' }}>
                        <strong>12. Certification:</strong> A Digital Participation Certificate is awarded to all completers. Internship Certificates are awarded ONLY upon successful completion of the internship tenure. Certificates do not serve as employment guarantees.
                    </p>
                </div>
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <Link href="/apply" className="cta-button">Back to Registration</Link>
                </div>
            </section>
        </main>
    )
}
