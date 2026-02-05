import Link from 'next/link';

export default function RefundPage() {
    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-md)', maxWidth: '800px', margin: '0 auto' }}>
            <section className="glass-card" style={{ padding: '30px', textAlign: 'left' }}>
                <h2 style={{ color: 'var(--accent-gold)', marginBottom: '20px' }}>Refund & Cancellation</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                    <p>
                        <strong>1. Finality:</strong> Enrollment fees for the Zaukriti TalentForge cohort are strictly non-refundable once processed.
                    </p>
                    <p>
                        <strong>2. Administrative Overhead:</strong> Fees are utilized for immediate allocation of digital resources, recruitment scheduling, and server provisioning.
                    </p>
                    <p>
                        <strong>3. Double Payments:</strong> Verified duplicate transactions due to technical gateway errors will be reported within 24 hours for a reconciliation and refund of the excess amount.
                    </p>
                    <p>
                        <strong>4. Timeline-Based Restrictions:</strong> Registration fees are non-refundable once the evaluation phase begins or after the enrolment window closes (End of March), whichever is earlier.
                    </p>
                    <p>
                        <strong>5. Performance Disclaimer:</strong> Refunds are NOT granted for non-selection in internships, inability to complete problem statements, or personal scheduling conflicts. Evaluation outcomes are final and binding.
                    </p>
                </div>
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <Link href="/apply" className="cta-button">Back to Registration</Link>
                </div>
            </section>
        </main>
    )
}
