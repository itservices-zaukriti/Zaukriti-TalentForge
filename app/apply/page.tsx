'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'
import { PLATFORM_CONFIG, getCurrentPricing } from '@/app/utils/config'
import { getReferralStats } from '@/lib/referrals'
import { supabase } from '@/lib/supabase'

const PricingTable = ({ phases, currentPhase }: { phases: any[], currentPhase: any }) => {
    if (!phases || !phases.length) return null;
    return (
        <div style={{ marginTop: '20px', marginBottom: '30px' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: '15px', textAlign: 'center' }}>Registration Fees (Phase-Based)</h4>
            <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}>
                            <th style={{ padding: '12px' }}>Phase</th>
                            <th style={{ padding: '12px' }}>Dates</th>
                            <th style={{ padding: '12px' }}>Indiv.</th>
                            <th style={{ padding: '12px' }}>Team 2</th>
                            <th style={{ padding: '12px' }}>Team 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phases.map((p, i) => {
                            const isCurrent = p.name === currentPhase.name;
                            if (p.name === "Closed") return null;
                            return (
                                <tr key={i} style={{
                                    borderBottom: '1px solid var(--glass-border)',
                                    background: isCurrent ? 'rgba(255, 204, 51, 0.1)' : 'transparent',
                                    color: isCurrent ? 'var(--accent-gold)' : 'inherit',
                                    fontWeight: isCurrent ? 700 : 400
                                }}>
                                    <td style={{ padding: '12px' }}>{p.name.replace('Phase ', '').split(' — ')[1]}</td>
                                    <td style={{ padding: '12px', fontSize: '0.7rem' }}>
                                        {p.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {p.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '12px' }}>₹{p.fees.individual}</td>
                                    <td style={{ padding: '12px' }}>₹{p.fees.team2}</td>
                                    <td style={{ padding: '12px' }}>₹{p.fees.team3}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '10px', textAlign: 'center' }}>
                *Prices increase automatically as phases transition.
            </p>
        </div>
    );
};

export default function ApplyPage() {
    const searchParams = useSearchParams()

    // NEW: DB-Driven State
    const [pricingPhases, setPricingPhases] = useState<any[]>([])
    const [currentPhase, setCurrentPhase] = useState<any>(null)
    const [enrollmentStatus, setEnrollmentStatus] = useState({ isOpen: true, message: '' })
    const [isLoadingPricing, setIsLoadingPricing] = useState(true)

    // const currentPhase = getCurrentPricing() // Removed static call
    // const isClosed = currentPhase.name === "Closed" // Moved to effect logic

    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showTCModal, setShowTCModal] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle')

    const [regId, setRegId] = useState<string | null>(null)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [familyData, setFamilyData] = useState({
        guardian_name: '',
        guardian_profession: '',
        income_range: 'Prefer not to say'
    })

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        whatsapp: '', city_state: '',
        college: '', course: '', year: '',
        tenth_percentage: '', twelfth_percentage: '', current_education_percentage: '',
        linkedin: '', resume: '',
        primary_stream: 'cs-it',
        custom_stream: '',
        secondary_specializations: [] as string[],
        custom_specialization: '',
        track: 'ai-ml',
        participationType: 'internship',
        teamSize: '1',
        member2: { name: '', email: '', phone: '', role: '', linkedin: '', resume: '' },
        member3: { name: '', email: '', phone: '', role: '', linkedin: '', resume: '' },
        consent: false,
        amount: 1499,
        applied_referral_code: ''
    })

    const [referralStats, setReferralStats] = useState<{ code: string | null, count: number, walletBalance: number }>({ code: null, count: 0, walletBalance: 0 })

    const [cohortConfig, setCohortConfig] = useState<any>(null)
    const [isLoadingConfig, setIsLoadingConfig] = useState(true)
    const [discount, setDiscount] = useState(0)
    const [referralFeedback, setReferralFeedback] = useState<{ valid: boolean, msg: string }>({ valid: false, msg: '' })

    const checkReferral = async (code: string) => {
        if (!code || code.length < 5) return;
        try {
            const res = await fetch('/api/validate-referral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, email: formData.email })
            })
            const data = await res.json()
            if (data.valid) {
                setDiscount(data.discount)
                setReferralFeedback({ valid: true, msg: `✅ ${data.message}` })
            } else {
                setDiscount(0)
                setReferralFeedback({ valid: false, msg: `❌ ${data.message}` })
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        // 0. Fetch DB Pricing & Enrollment (NEW)
        async function loadPricingEngine() {
            try {
                // 1. Enrollment
                const { data: enroll } = await supabase.from('enrollment_control').select('*').limit(1).maybeSingle();
                if (enroll) setEnrollmentStatus({ isOpen: enroll.is_enrollment_open, message: enroll.closed_message });

                // 2. Phases & Amounts
                const { data: phases } = await supabase.from('pricing_phases').select('*').order('display_order');
                const { data: allAmounts } = await supabase.from('pricing_amounts').select('*');

                if (phases && allAmounts) {
                    const mapped = phases.map(p => {
                        const pAmounts = allAmounts.filter(a => a.phase_id === p.id);
                        return {
                            name: p.phase_name,
                            start: new Date(p.start_date),
                            end: new Date(p.end_date),
                            fees: {
                                individual: pAmounts.find(a => a.team_size === 1)?.amount || 0,
                                team2: pAmounts.find(a => a.team_size === 2)?.amount || 0,
                                team3: pAmounts.find(a => a.team_size === 3)?.amount || 0
                            }
                        };
                    });
                    setPricingPhases(mapped);

                    // Find Current Phase
                    const now = new Date();
                    // Basic logic: Find phase including now, or last one
                    const curr = mapped.find(p => now >= p.start && now <= p.end) || mapped[mapped.length - 1];
                    setCurrentPhase(curr);
                }
            } catch (err) {
                console.error("Pricing Engine Load Error:", err);
            } finally {
                setIsLoadingPricing(false);
            }
        }
        loadPricingEngine();

        // Original Config Fetch
        async function fetchConfig() {
            try {
                const nowIso = new Date().toISOString()
                // ... (rest of cohort logic) ...
                // 1. Try to find the currently active 'live' cohort
                let { data: active, error: activeErr } = await supabase
                    .from('cohort_config')
                    .select('*')
                    .eq('status', 'live')
                    .lte('registration_start', nowIso)
                    .gte('registration_end', nowIso)
                    .limit(1)
                    .maybeSingle()

                if (active) {
                    setCohortConfig(active)
                    setIsLoadingConfig(false)
                    return
                }

                // 2. If no active, try to find the nearest upcoming cohort (live or draft)
                let { data: upcoming, error: upcomingErr } = await supabase
                    .from('cohort_config')
                    .select('*')
                    .gt('registration_start', nowIso)
                    .order('registration_start', { ascending: true })
                    .limit(1)
                    .maybeSingle()

                if (upcoming) {
                    setCohortConfig(upcoming)
                } else {
                    // 3. If neither, get the last closed cohort to check status
                    let { data: last, error: lastErr } = await supabase
                        .from('cohort_config')
                        .select('*')
                        .order('registration_end', { ascending: false })
                        .limit(1)
                        .maybeSingle()

                    if (last) setCohortConfig(last)
                }
            } catch (err) {
                console.error('Config fetch error (using code fallbacks):', err)
            } finally {
                setIsLoadingConfig(false)
            }
        }
        fetchConfig()
    }, [])

    useEffect(() => {
        const ref = searchParams.get('ref')
        if (ref) {
            setFormData(prev => ({ ...prev, applied_referral_code: ref.toUpperCase() }))
        }
    }, [searchParams])

    useEffect(() => {
        if (step === 7 && regId) {
            getReferralStats(regId).then(setReferralStats)
        }
    }, [step, regId])

    const streamSpecs: Record<string, string[]> = {
        'cs-it': ['Full-Stack Development', 'AI / ML', 'Data Science', 'Cloud / DevOps', 'Cybersecurity'],
        'electronics': ['IoT / Embedded Systems', 'Robotics / Haptics', 'Edge AI', 'Circuit Design'],
        'mechanical': ['Mechatronics', 'CAD / 3D Modeling', 'Digital Twins', 'Automation'],
        'design': ['UI / UX / Product Design', 'AR / VR / 3D', 'Motion Graphics', 'Visual Communication'],
        'management': ['Business Ops / Strategy', 'Product Management', 'Digital Marketing / Growth', 'Sales / Account Management'],
        'other': ['Custom Research', 'Cross-Domain', 'Emerging Tech']
    }

    const allSpecializations = Array.from(new Set(Object.values(streamSpecs).flat()));

    const tracks = [
        { id: 'ai-ml', name: 'AI / ML (OCR, NLP, RAG, Vision)', subs: ['OCR & Document Intelligence', 'NLP & Intent Recognition', 'RAG & Knowledge Retrieval', 'Multimodal Vision AI'] },
        { id: 'full-stack', name: 'Full-Stack (Next.js, React, APIs)', subs: ['Next.js App Router', 'API Orchestration', 'UI/UX Engineering', 'State Management'] },
        { id: 'iot-sensors', name: 'IoT & Sensors (Chef2Restro, Edge)', subs: ['Embedded Systems', 'Sensor Real-time Sync', 'Gaming Dining Tables', 'Climate & Ambience Sensors'] },
        { id: 'cloud-devops', name: 'Cloud & DevOps', subs: ['AWS/GCP/Supabase', 'CI/CD Pipelines', 'Serverless Architecture', 'Security & Access Control'] },
        { id: 'cms-ops', name: 'CMS & Content Ops', subs: ['Headless CMS (Sanity)', 'Content Workflows', 'Digital Asset Management', 'Multi-tenant CMS'] },
        { id: 'marketing-ai', name: 'Digital Marketing (AI-driven)', subs: ['Growth Automation', 'AI Content Generation', 'Performance Analytics', 'Campaign Management'] },
        { id: 'product-ux', name: 'Product & UX', subs: ['Product Management', 'User Research', 'Experience Design', 'Prototyping & Strategy'] }
    ]

    const validateStep = (s: number) => {
        const errors: Record<string, string> = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^\d{10}$/

        if (s === 1) {
            if (!formData.name.trim()) errors.name = 'Full name is required'

            // Strict Email Validation
            const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!formData.email.trim()) errors.email = 'Email is required'
            else if (!strictEmailRegex.test(formData.email.trim())) errors.email = 'Please enter a valid email address'

            if (!formData.phone.trim()) errors.phone = 'Phone number is required'
            else if (!phoneRegex.test(formData.phone.trim().replace(/\D/g, ''))) errors.phone = 'Phone must be 10 digits'
            if (!formData.city_state.trim()) errors.city_state = 'City & State is required'
        }

        if (s === 2) {
            if (!formData.college.trim()) errors.college = 'College name is required'
            if (!formData.course.trim()) errors.course = 'Course is required'

            // Strict Year Validation (2000-2099)
            const yearRegex = /^20[0-9]{2}$/;
            if (!formData.year.trim()) errors.year = 'Graduation year is required'
            else if (!yearRegex.test(formData.year.trim())) errors.year = 'Please enter a valid 4-digit year (e.g. 2026)'

            // Strict Marks Validation (CGPA <= 10 or % <= 100)
            if (!formData.current_education_percentage.trim()) {
                errors.current_education_percentage = 'Marks required'
            } else {
                const val = parseFloat(formData.current_education_percentage);
                if (isNaN(val)) errors.current_education_percentage = 'Must be a number';
                else if (val < 0) errors.current_education_percentage = 'Cannot be negative';
                else if (val > 100) errors.current_education_percentage = 'Cannot exceed 100%';
                else if (val > 10 && val <= 100) { /* Likely Percentage - OK */ }
                else if (val <= 10) { /* Likely CGPA - OK */ }
                else errors.current_education_percentage = 'Enter valid CGPA (0-10) or % (0-100)';
            }
        }

        if (s === 4) {
            if (formData.teamSize === '2' || formData.teamSize === '3') {
                if (!formData.member2.name.trim()) errors['member2.name'] = 'Member 2 name required'
                if (!formData.member2.email.trim()) errors['member2.email'] = 'Member 2 email required'
                else if (!emailRegex.test(formData.member2.email)) errors['member2.email'] = 'Invalid email'
                if (!formData.member2.phone.trim()) errors['member2.phone'] = 'Member 2 phone required'
                if (!formData.member2.role.trim()) errors['member2.role'] = 'Member 2 role required'
            }
            if (formData.teamSize === '3') {
                if (!formData.member3.name.trim()) errors['member3.name'] = 'Member 3 name required'
                if (!formData.member3.email.trim()) errors['member3.email'] = 'Member 3 email required'
                else if (!emailRegex.test(formData.member3.email)) errors['member3.email'] = 'Invalid email'
                if (!formData.member3.phone.trim()) errors['member3.phone'] = 'Member 3 phone required'
                if (!formData.member3.role.trim()) errors['member3.role'] = 'Member 3 role required'
            }
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const nextStep = () => {
        if (!validateStep(step)) return

        if (step === 4) {
            const fees = currentPhase.fees;
            const amounts: Record<string, number> = {
                '1': fees?.individual || 1499,
                '2': fees?.team2 || 2499,
                '3': fees?.team3 || 3499
            };
            setFormData(prev => ({ ...prev, amount: amounts[prev.teamSize] || 1499 }));
        }
        setStep(s => s + 1)
    }

    const prevStep = () => setStep(s => s - 1)

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target

        // Clear error when user types
        setValidationErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[name]
            return newErrors
        })

        // Handle member fields (e.g., member2.name)
        if (name.includes('.')) {
            const [member, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [member]: {
                    ...(prev as any)[member],
                    [field]: field === 'email' ? value.toLowerCase() : value
                }
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'email' ? value.toLowerCase() : value)
        }))
    }

    const handleSpecializationToggle = (spec: string) => {
        setFormData(prev => {
            const current = prev.secondary_specializations;
            if (current.includes(spec)) {
                return { ...prev, secondary_specializations: current.filter(s => s !== spec) };
            } else {
                return { ...prev, secondary_specializations: [...current, spec] };
            }
        });
    }

    const handleAcceptTC = () => {
        setFormData(prev => ({ ...prev, consent: true }))
        setShowTCModal(false)
    }


    const handleFamilySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!regId) return;

        try {
            const res = await fetch('/api/register', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: regId, familyData })
            });
            if (res.ok) {
                setPaymentStatus('success'); // This will trigger the "Referral" view in Case 7
            }
        } catch (err) {
            console.error(err);
        }
    };

    const daysToNextPhase = () => {
        if (!currentPhase || currentPhase.name === "Closed") return null;
        const now = new Date();
        const diff = currentPhase.end.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    const handleFinalSubmit = async () => {
        if (!formData.consent) {
            alert('You must accept Terms & Conditions to continue.')
            return
        }
        setIsSubmitting(true)
        setPaymentStatus('pending')

        try {
            // 1. Initial Registration in DB
            const regRes = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    cohort_id: cohortConfig?.id || null,
                    cohort_name: cohortConfig?.cohort_name || null,
                    participationType: formData.participationType,
                    custom_specialization: formData.custom_specialization,
                    utm_source: searchParams.get('utm_source') || null,
                    utm_campaign: searchParams.get('utm_campaign') || null,
                    applied_referral_code: formData.applied_referral_code.trim() || null
                })
            });
            const regData = await regRes.json();
            if (regData.error) {
                alert(`Registration Refused: ${regData.error}`);
                setIsSubmitting(false);
                setPaymentStatus('idle');
                return;
            }
            setRegId(regData.id);

            // 2. Create Razorpay Order
            const orderRes = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamSize: formData.teamSize,
                    receipt: `R_${regData.id}`.slice(0, 40),
                    referralCode: formData.applied_referral_code, // Corrected property name
                    email: formData.email
                })
            });
            const orderData = await orderRes.json();
            if (orderData.error) throw new Error(orderData.error);

            // 3. Link Order ID (already handled in /api/register theoretically, but keeping flow)
            await fetch('/api/register/update-ref', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: regData.id, payment_reference: orderData.id })
            });

            // 4. Initialize Razorpay Checkout
            const options = {
                key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: PLATFORM_CONFIG.branding.name,
                description: `Enrollment: ${tracks.find(t => t.id === formData.track)?.name}`,
                order_id: orderData.id,
                handler: async function (response: any) {
                    setPaymentStatus('pending'); // Show "Verifying with Ecosystem..."

                    const verifyRes = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            applicant_id: regData.id
                        })
                    });

                    if (verifyRes.ok) {
                        setPaymentStatus('idle'); // Clear the pending/processing state

                        // FETCH REFFERAL STATS INSTANTLY
                        const stats = await getReferralStats(regData.id);
                        setReferralStats(stats);

                        setStep(7); // Show the success/referral/profile page
                    } else {
                        setPaymentStatus('failed'); // Backend verification failed
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: '#ffcc33' },
                modal: {
                    ondismiss: function () {
                        setIsSubmitting(false);
                        setPaymentStatus('idle');
                    }
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                setPaymentStatus('failed');
                setIsSubmitting(false);
            });
            rzp1.open();

        } catch (error: any) {
            console.error('Razorpay Error:', error);
            alert(`Payment System Error: ${error.message || 'Initialization failed'}. Please refresh and try again.`);
            setIsSubmitting(false);
            setPaymentStatus('idle');
        }
    }

    if (isLoadingConfig || isLoadingPricing) {
        return (
            <main style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>Establishing secure connection to Zaukriti Ecosystem...</p>
            </main>
        )
    }

    if (!enrollmentStatus.isOpen) {
        return (
            <main style={{ padding: 'var(--spacing-md) var(--spacing-sm)', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <header style={{ marginBottom: '40px' }}>
                    <img src="/logo.png" alt="Zaukriti Logo" style={{ height: '80px', marginBottom: '20px' }} />
                    <h1 style={{ color: 'var(--accent-gold)', fontSize: '2.5rem' }}>Ecosystem Enrollment</h1>
                </header>
                <div className="glass-card" style={{ padding: '60px', border: '1px solid var(--accent-gold)', background: 'rgba(22, 22, 61, 0.8)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
                    <h2 style={{ color: 'var(--accent-gold)', marginBottom: '15px' }}>Enrollment Paused</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-primary)' }}>
                        {enrollmentStatus.message}
                    </p>
                    <Link href="/" className="cta-button" style={{ width: '100%', maxWidth: '300px' }}>Return to Home</Link>
                </div>
            </main>
        )
    }

    const now = new Date()

    // Fallback logic: Use DB config if available, otherwise fallback to DB pricing dates
    const regStart = cohortConfig
        ? new Date(cohortConfig.registration_start)
        : (pricingPhases[0]?.start)

    const regEnd = cohortConfig
        ? new Date(cohortConfig.registration_end)
        : (pricingPhases[pricingPhases.length - 2]?.end) // Use the last fee-bearing phase end

    // Logic for states
    const isOpeningSoon = regStart && now < regStart
    // If we have cohortConfig and it's explicitly closed (status), or if now is past regEnd
    // We only assume "closed" by default if we have a config but now > end.
    const isActuallyClosed = (cohortConfig && cohortConfig.status === 'closed') || (regEnd && now > regEnd)

    if (isOpeningSoon) {
        return (
            <main style={{ padding: 'var(--spacing-md) var(--spacing-sm)', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <header style={{ marginBottom: '40px' }}>
                    <img src="/logo.png" alt="Zaukriti Logo" style={{ height: '80px', marginBottom: '20px' }} />
                    <h1 style={{ color: 'var(--accent-gold)', fontSize: '2.5rem' }}>Ecosystem Enrollment</h1>
                </header>
                <div className="glass-card" style={{ padding: '60px', border: '1px solid var(--accent-gold)', background: 'rgba(22, 22, 61, 0.8)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏳</div>
                    <h2 style={{ color: 'var(--accent-gold)', marginBottom: '15px' }}>Registrations Opening Soon</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-primary)' }}>
                        {cohortConfig?.opening_soon_message || `Enrollment for the next TalentForge cohort opens on ${regStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.`}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                        Stay tuned and follow us for updates on the upcoming cohort launch.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
                        <a href="https://linkedin.com/company/zaukriti" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>LinkedIn</a>
                        <a href="https://instagram.com/zaukritievents" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>Instagram</a>
                    </div>
                    <Link href="/" className="cta-button" style={{ width: '100%', maxWidth: '300px' }}>Return to Home</Link>
                </div>
            </main>
        )
    }

    if (isActuallyClosed) {
        return (
            <main style={{ padding: 'var(--spacing-md) var(--spacing-sm)', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <header style={{ marginBottom: '40px' }}>
                    <img src="/logo.png" alt="Zaukriti Logo" style={{ height: '80px', marginBottom: '20px' }} />
                    <h1 style={{ color: 'var(--accent-gold)', fontSize: '2.5rem' }}>Ecosystem Enrollment</h1>
                </header>
                <div className="glass-card" style={{ padding: '60px', border: '1px solid var(--accent-gold)', background: 'rgba(22, 22, 61, 0.8)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏳</div>
                    <h1 style={{ color: 'var(--accent-gold)', marginBottom: '15px', fontSize: '2rem' }}>Registrations Closed</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-primary)' }}>The enrollment window for the current cohort has ended.</p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                        We launch new cohorts every 2-3 months to fill builder positions quickly.<br />
                        <strong>Stay tuned for the next TalentForge cohort launch!</strong>
                    </p>
                    <Link href="/" className="cta-button" style={{ width: '100%', maxWidth: '300px' }}>Return to Home</Link>
                </div>
            </main>
        )
    }

    if (paymentStatus === 'failed') {
        return (
            <main style={{ padding: 'var(--spacing-md) var(--spacing-sm)', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: '40px', border: '1px solid #ff4444', background: 'rgba(255, 68, 68, 0.05)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏳</div>
                    <h1 style={{ color: '#ff4444', marginBottom: '15px' }}>Payment Pending</h1>
                    <p style={{ marginBottom: '20px', fontSize: '0.95rem' }}>Your bank has not yet confirmed the transaction. <strong>Don't worry!</strong></p>
                    <p style={{ marginBottom: '20px', fontSize: '0.95rem', color: '#4ADE80' }}>Your registration is safely recorded. No action needed from your side.</p>
                    <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem', color: '#ccc' }}>
                        <p>• We will check with Razorpay for the next <strong>30 minutes</strong>.</p>
                        <p>• If confirmed, you'll receive a "Welcome" email automatically.</p>
                        <p>• If it fails, any deducted funds will be refunded by your bank.</p>
                    </div>
                    <button className="cta-button" onClick={() => setPaymentStatus('idle')} style={{ background: '#333', color: '#fff', width: '100%' }}>Back to Registration</button>
                    <p style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Support: <a href="mailto:talentforge@zaukritievents.in" style={{ color: 'var(--accent-gold)' }}>talentforge@zaukritievents.in</a>
                    </p>
                </div>
            </main>
        )
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div key="step1" className="animate-fade">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{
                                background: 'rgba(255, 204, 51, 0.1)',
                                border: '1px solid var(--accent-gold)',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: 'var(--accent-gold)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                animation: 'pulse 2s infinite'
                            }}>
                                <span style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%' }}></span>
                                Current Phase: {currentPhase.name.split(' — ')[1]}
                            </div>
                        </div>

                        {daysToNextPhase() !== null && daysToNextPhase()! <= 5 && (
                            <p style={{ textAlign: 'center', color: '#ff4444', fontSize: '0.8rem', fontWeight: 600, marginBottom: '15px' }}>
                                ⏳ Prices increase in {daysToNextPhase()} days!
                            </p>
                        )}

                        <PricingTable phases={pricingPhases} currentPhase={currentPhase} />

                        <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.4rem' }}>Builder Profile</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ position: 'relative' }}>
                                <input name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors.name ? '1px solid #ff4444' : inputStyle.border }} />
                                {validationErrors.name && <span style={{ color: '#ff4444', fontSize: '0.65rem', position: 'absolute', bottom: '-15px', left: '10px' }}>{validationErrors.name}</span>}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors.email ? '1px solid #ff4444' : inputStyle.border }} />
                                {validationErrors.email && <span style={{ color: '#ff4444', fontSize: '0.65rem', position: 'absolute', bottom: '-15px', left: '10px' }}>{validationErrors.email}</span>}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={{ position: 'relative' }}>
                                    <input name="phone" placeholder="Phone (10 digits)" value={formData.phone} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors.phone ? '1px solid #ff4444' : inputStyle.border }} />
                                    {validationErrors.phone && <span style={{ color: '#ff4444', fontSize: '0.65rem', position: 'absolute', bottom: '-15px', left: '10px' }}>{validationErrors.phone}</span>}
                                </div>
                                <input name="whatsapp" placeholder="WhatsApp (Opt)" value={formData.whatsapp} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input name="city_state" placeholder="City & State" value={formData.city_state} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors.city_state ? '1px solid #ff4444' : inputStyle.border }} />
                                {validationErrors.city_state && <span style={{ color: '#ff4444', fontSize: '0.65rem', position: 'absolute', bottom: '-15px', left: '10px' }}>{validationErrors.city_state}</span>}
                            </div>

                            <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '10px', paddingTop: '15px' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '10px' }}>Optional Professional Links</p>
                                <input name="linkedin" placeholder="LinkedIn Profile URL (Optional)" value={formData.linkedin} onChange={handleInputChange} style={{ ...inputStyle, marginBottom: '10px' }} />
                                <input name="resume" placeholder="Resume Link - Google Drive/Dropbox (Optional)" value={formData.resume} onChange={handleInputChange} style={inputStyle} />
                            </div>

                            <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)', marginTop: '10px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#3B82F6', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Referral Code (Optional)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        name="applied_referral_code"
                                        placeholder="Enter Code (e.g. ZTF-ABC123)"
                                        value={formData.applied_referral_code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, applied_referral_code: e.target.value.toUpperCase() }))}
                                        onBlur={(e) => checkReferral(e.target.value)}
                                        style={{ ...inputStyle, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', flex: 1 }}
                                    />
                                    {formData.applied_referral_code && (
                                        <button
                                            onClick={() => checkReferral(formData.applied_referral_code)}
                                            style={{ background: '#3B82F6', border: 'none', borderRadius: '8px', color: 'white', padding: '0 15px', cursor: 'pointer' }}
                                        >
                                            Apply
                                        </button>
                                    )}
                                </div>
                                {referralFeedback.msg && (
                                    <p style={{ fontSize: '0.75rem', marginTop: '8px', color: referralFeedback.valid ? '#4ADE80' : '#ff4444' }}>
                                        {referralFeedback.msg}
                                    </p>
                                )}
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '8px' }}>If someone invited you, paste their code here to save ₹50.</p>
                            </div>

                            <button className="cta-button" onClick={nextStep} style={{ marginTop: '10px' }}>Next: Education</button>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div key="step2" className="animate-fade">
                        <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.4rem' }}>Academic Context</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ marginBottom: '10px', position: 'relative' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginBottom: '10px', fontWeight: 600 }}>“For ecosystem understanding only. Selection is 100% based on what you build.”</p>
                                <input name="college" placeholder="College / Institution Name" value={formData.college} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors.college ? '1px solid #ff4444' : inputStyle.border }} />
                                {validationErrors.college && <span style={{ color: '#ff4444', fontSize: '0.65rem', position: 'absolute', bottom: '-15px', left: '10px' }}>{validationErrors.college}</span>}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={{ position: 'relative' }}>
                                    <input name="course" placeholder="Degree / Course" value={formData.course} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors.course ? '1px solid #ff4444' : inputStyle.border }} />
                                    {validationErrors.course && <span style={{ color: '#ff4444', fontSize: '0.65rem', position: 'absolute', bottom: '-12px', left: '10px' }}>{validationErrors.course}</span>}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input name="year" placeholder="Graduation Year" value={formData.year} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors.year ? '1px solid #ff4444' : inputStyle.border }} />
                                    {validationErrors.year && <span style={{ color: '#ff4444', fontSize: '0.65rem', position: 'absolute', bottom: '-12px', left: '10px' }}>{validationErrors.year}</span>}
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255, 204, 51, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 204, 51, 0.1)', marginTop: '10px' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginBottom: '12px', fontStyle: 'italic' }}>
                                    Academic information helps us understand learning context and mentorship needs. Selection is based on what you build, not marks.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>10th % (Opt)</label>
                                        <input name="tenth_percentage" type="number" placeholder="0-100" value={formData.tenth_percentage} onChange={handleInputChange} style={{ ...inputStyle, fontSize: '0.8rem', padding: '8px' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>12th % (Opt)</label>
                                        <input name="twelfth_percentage" type="number" placeholder="0-100" value={formData.twelfth_percentage} onChange={handleInputChange} style={{ ...inputStyle, fontSize: '0.8rem', padding: '8px' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Current %</label>
                                        <div style={{ position: 'relative' }}>
                                            <input name="current_education_percentage" type="number" placeholder="0-100" value={formData.current_education_percentage} onChange={handleInputChange} style={{ ...inputStyle, fontSize: '0.8rem', padding: '8px', border: validationErrors.current_education_percentage ? '1px solid #ff4444' : inputStyle.border }} />
                                            {validationErrors.current_education_percentage && <span style={{ color: '#ff4444', fontSize: '0.55rem', position: 'absolute', bottom: '-12px', left: '5px' }}>{validationErrors.current_education_percentage}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button className="cta-button" onClick={prevStep} style={{ background: '#333', color: 'white', flex: 1 }}>Back</button>
                                <button className="cta-button" onClick={nextStep} style={{ flex: 2 }}>Next: Specializations</button>
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div key="step3" className="animate-fade">
                        <h2 style={{ marginBottom: '10px', fontSize: '1.4rem' }}>Skills & Specializations</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Tell us your primary area of study and specific interests.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Primary Stream (Required)</label>
                                <select name="primary_stream" value={formData.primary_stream} onChange={handleInputChange} style={inputStyle}>
                                    {[
                                        { id: 'cs-it', name: 'Computer Science / IT' },
                                        { id: 'electronics', name: 'Electronics / IoT' },
                                        { id: 'mechanical', name: 'Mechanical / Mechatronics' },
                                        { id: 'design', name: 'Design / Media' },
                                        { id: 'management', name: 'Management / Marketing' },
                                        { id: 'other', name: 'Other (Manual Entry)' }
                                    ].map(s => (
                                        <option key={s.id} value={s.id} style={{ background: '#1a1a1a', color: 'white' }}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.primary_stream === 'other' && (
                                <input
                                    name="custom_stream"
                                    placeholder="Specify your stream/field"
                                    value={formData.custom_stream}
                                    onChange={handleInputChange}
                                    style={{ ...inputStyle, border: '1px solid var(--accent-gold)' }}
                                />
                            )}

                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Suggested Specializations (Optional)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {(streamSpecs[formData.primary_stream] || []).map(spec => (
                                        <button
                                            key={spec}
                                            onClick={() => handleSpecializationToggle(spec)}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                border: formData.secondary_specializations.includes(spec) ? '1px solid var(--accent-gold)' : '1px solid var(--glass-border)',
                                                background: formData.secondary_specializations.includes(spec) ? 'rgba(255, 204, 51, 0.1)' : 'transparent',
                                                color: formData.secondary_specializations.includes(spec) ? 'var(--accent-gold)' : 'var(--text-secondary)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {spec}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Other Custom Specialization</label>
                                <input
                                    name="custom_specialization"
                                    placeholder="e.g. Quantum Computing, AI Ethics..."
                                    value={formData.custom_specialization}
                                    onChange={handleInputChange}
                                    style={{ ...inputStyle, fontSize: '0.85rem' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button className="cta-button" onClick={prevStep} style={{ background: '#333', color: 'white', flex: 1 }}>Back</button>
                                <button className="cta-button" onClick={nextStep} style={{ flex: 2 }}>Next: Hackathon Track</button>
                            </div>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div key="step4" className="animate-fade">
                        <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.4rem' }}>Hackathon Participation</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>Hackathon Track (What will you build?)</label>
                                <select name="track" value={formData.track} onChange={handleInputChange} style={inputStyle}>
                                    {tracks.map(t => (
                                        <option key={t.id} value={t.id} style={{ background: '#1a1a1a', color: 'white' }}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', background: 'rgba(255, 204, 51, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 204, 51, 0.1)' }}>
                                <p style={{ marginBottom: '5px' }}><strong>Building:</strong> {tracks.find(t => t.id === formData.track)?.subs.join(' • ')}</p>
                                <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>“This track directly supports Zaukriti Events AI and its ecosystem including Chef2Restro, Interio, Angadi.ai, Riksha.ai...”</p>
                            </div>

                            <div style={{ marginTop: '10px' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>Team Configuration</label>
                                <select name="teamSize" value={formData.teamSize} onChange={handleInputChange} style={inputStyle}>
                                    <option value="1" style={{ background: '#1a1a1a', color: 'white' }}>Individual — ₹{currentPhase.fees?.individual || 1499}</option>
                                    <option value="2" style={{ background: '#1a1a1a', color: 'white' }}>Team of 2 — ₹{currentPhase.fees?.team2 || 2499}</option>
                                    <option value="3" style={{ background: '#1a1a1a', color: 'white' }}>Team of 3 — ₹{currentPhase.fees?.team3 || 3499}</option>
                                </select>
                            </div>

                            {/* Dynamic Team Member Fields */}
                            {(formData.teamSize === '2' || formData.teamSize === '3') && (
                                <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '10px', paddingTop: '15px' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: '15px' }}>Team Member 2</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <input name="member2.name" placeholder="Member 2 Name" value={formData.member2.name} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors['member2.name'] ? '1px solid #ff4444' : inputStyle.border }} />
                                            {validationErrors['member2.name'] && <span style={{ color: '#ff4444', fontSize: '0.65rem' }}>{validationErrors['member2.name']}</span>}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <div style={{ position: 'relative' }}>
                                                <input name="member2.email" type="email" placeholder="Email" value={formData.member2.email} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors['member2.email'] ? '1px solid #ff4444' : inputStyle.border }} />
                                                {validationErrors['member2.email'] && <span style={{ color: '#ff4444', fontSize: '0.65rem' }}>{validationErrors['member2.email']}</span>}
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <input name="member2.phone" placeholder="Phone" value={formData.member2.phone} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors['member2.phone'] ? '1px solid #ff4444' : inputStyle.border }} />
                                                {validationErrors['member2.phone'] && <span style={{ color: '#ff4444', fontSize: '0.65rem' }}>{validationErrors['member2.phone']}</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <input name="member2.linkedin" placeholder="LinkedIn (Optional)" value={formData.member2.linkedin} onChange={handleInputChange} style={inputStyle} />
                                            <input name="member2.resume" placeholder="Resume URL (Optional)" value={formData.member2.resume} onChange={handleInputChange} style={inputStyle} />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <input name="member2.role" placeholder="Academic Role (e.g. Developer, Designer)" value={formData.member2.role} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors['member2.role'] ? '1px solid #ff4444' : inputStyle.border }} />
                                            {validationErrors['member2.role'] && <span style={{ color: '#ff4444', fontSize: '0.65rem' }}>{validationErrors['member2.role']}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formData.teamSize === '3' && (
                                <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '20px', paddingTop: '15px' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: '15px' }}>Team Member 3</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <input name="member3.name" placeholder="Member 3 Name" value={formData.member3.name} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors['member3.name'] ? '1px solid #ff4444' : inputStyle.border }} />
                                            {validationErrors['member3.name'] && <span style={{ color: '#ff4444', fontSize: '0.65rem' }}>{validationErrors['member3.name']}</span>}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <div style={{ position: 'relative' }}>
                                                <input name="member3.email" type="email" placeholder="Email" value={formData.member3.email} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors['member3.email'] ? '1px solid #ff4444' : inputStyle.border }} />
                                                {validationErrors['member3.email'] && <span style={{ color: '#ff4444', fontSize: '0.65rem' }}>{validationErrors['member3.email']}</span>}
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <input name="member3.phone" placeholder="Phone" value={formData.member3.phone} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors['member3.phone'] ? '1px solid #ff4444' : inputStyle.border }} />
                                                {validationErrors['member3.phone'] && <span style={{ color: '#ff4444', fontSize: '0.65rem' }}>{validationErrors['member3.phone']}</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <input name="member3.linkedin" placeholder="LinkedIn (Optional)" value={formData.member3.linkedin} onChange={handleInputChange} style={inputStyle} />
                                            <input name="member3.resume" placeholder="Resume URL (Optional)" value={formData.member3.resume} onChange={handleInputChange} style={inputStyle} />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <input name="member3.role" placeholder="Academic Role (e.g. Researcher, Lead)" value={formData.member3.role} onChange={handleInputChange} style={{ ...inputStyle, border: validationErrors['member3.role'] ? '1px solid #ff4444' : inputStyle.border }} />
                                            {validationErrors['member3.role'] && <span style={{ color: '#ff4444', fontSize: '0.65rem' }}>{validationErrors['member3.role']}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button className="cta-button" onClick={prevStep} style={{ background: '#333', color: 'white', flex: 1 }}>Back</button>
                                <button className="cta-button" onClick={nextStep} style={{ flex: 2 }}>Next: Summary</button>
                            </div>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div key="step5" className="animate-fade">
                        <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.4rem' }}>Ready for Enrollment</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ background: 'var(--secondary-bg)', padding: '25px', borderRadius: '16px', border: '1px solid var(--accent-gold)', textAlign: 'center', boxShadow: '0 0 20px rgba(255, 204, 51, 0.1)' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{currentPhase.name} Virtual Cohort</p>
                                {discount > 0 ? (
                                    <>
                                        <h2 style={{ color: 'var(--text-secondary)', margin: '5px 0', fontSize: '1.5rem', textDecoration: 'line-through' }}>₹{formData.amount}</h2>
                                        <h2 style={{ color: '#4ADE80', margin: '5px 0', fontSize: '3rem' }}>₹{formData.amount - discount}</h2>
                                        <p style={{ color: '#4ADE80', fontSize: '0.9rem', fontWeight: 600 }}>Referral Discount Applied!</p>
                                    </>
                                ) : (
                                    <h2 style={{ color: 'var(--text-primary)', margin: '15px 0', fontSize: '3rem' }}>₹{formData.amount}</h2>
                                )}
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tracks.find(t => t.id === formData.track)?.name}</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '15px 0', borderTop: '1px solid var(--glass-border)', marginTop: '10px' }}>
                                <input
                                    type="checkbox"
                                    name="consent"
                                    checked={formData.consent}
                                    onChange={(e) => {
                                        if (e.target.checked) setShowTCModal(true)
                                        else setFormData(prev => ({ ...prev, consent: false }))
                                    }}
                                    style={{ marginTop: '5px', width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, textAlign: 'left' }}>
                                    I agree to the <button onClick={() => setShowTCModal(true)} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', textDecoration: 'underline', padding: 0, fontSize: 'inherit', cursor: 'pointer', fontWeight: 600 }}>Terms & Conditions</button> and Zaukriti Ecosystem Merit-First & Virtual Submission Policy.
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    className="cta-button"
                                    onClick={handleFinalSubmit}
                                    disabled={isSubmitting || !formData.consent}
                                    style={{ opacity: formData.consent ? 1 : 0.5, fontSize: '1.1rem', padding: '18px' }}
                                >
                                    {isSubmitting ? 'Securely Redirecting...' : `Pay ₹${formData.amount - discount} & Confirm Registration`}
                                </button>
                                <button className="cta-button" onClick={prevStep} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', padding: '12px' }}>Go Back & Edit</button>
                            </div>

                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '10px' }}>
                                Support: <a href="mailto:talentforge@zaukritievents.in" style={{ color: 'var(--accent-gold)' }}>talentforge@zaukritievents.in</a>
                            </p>
                        </div>
                    </div>
                )
            case 6:
                return (
                    <div key="step6" className="animate-fade">
                        <div style={{ textAlign: 'left', background: 'rgba(255, 204, 51, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--accent-gold)' }}>
                            <h2 style={{ marginBottom: '10px', fontSize: '1.4rem', color: 'var(--accent-gold)' }}>Ecosystem Insights (Optional)</h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                This helps us understand industry exposure for mentorship and pilot collaborations. Selection is never based on this data.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <input
                                    placeholder="Parent / Guardian Name (Optional)"
                                    onChange={(e) => setFamilyData(prev => ({ ...prev, guardian_name: e.target.value }))}
                                    style={inputStyle}
                                />
                                <input
                                    placeholder="Guardian Profession / Industry (Optional)"
                                    onChange={(e) => setFamilyData(prev => ({ ...prev, guardian_profession: e.target.value }))}
                                    style={inputStyle}
                                />
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Approx. Family Income Range (Optional)</label>
                                    <select
                                        onChange={(e) => setFamilyData(prev => ({ ...prev, income_range: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        <option value="Prefer not to say" style={{ background: '#1a1a1a' }}>Prefer not to say</option>
                                        <option value="Below ₹5 LPA" style={{ background: '#1a1a1a' }}>Below ₹5 LPA</option>
                                        <option value="₹5–10 LPA" style={{ background: '#1a1a1a' }}>₹5–10 LPA</option>
                                        <option value="₹10–25 LPA" style={{ background: '#1a1a1a' }}>₹10–25 LPA</option>
                                        <option value="Above ₹25 LPA" style={{ background: '#1a1a1a' }}>Above ₹25 LPA</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
                                    <input type="checkbox" required style={{ width: '18px', height: '18px', marginTop: '3px' }} />
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                        I understand this section is optional and not used for evaluation or ranking.
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button
                                        className="cta-button"
                                        onClick={handleFamilySubmit}
                                        style={{ flex: 2 }}
                                    >
                                        Complete Profile
                                    </button>
                                    <button
                                        className="cta-button"
                                        onClick={() => setStep(7)} // Step 7 is Final Success
                                        style={{ flex: 1, background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
                                    >
                                        Skip
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 7:
                // If payment is pending (verified but profile incomplete), show Family Context
                if (paymentStatus === 'pending') {
                    return (
                        <div key="step7-profile" className="animate-fade">
                            <h2 style={{ marginBottom: '15px', color: 'var(--accent-gold)' }}>Profile Hardening (Optional)</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                This information helps us understand your background for long-term ecosystem roles and mentorship.
                            </p>
                            <form onSubmit={handleFamilySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <input
                                    placeholder="Parent / Guardian Name"
                                    value={familyData.guardian_name}
                                    onChange={(e) => setFamilyData(prev => ({ ...prev, guardian_name: e.target.value }))}
                                    style={inputStyle}
                                />
                                <input
                                    placeholder="Parent's Profession"
                                    value={familyData.guardian_profession}
                                    onChange={(e) => setFamilyData(prev => ({ ...prev, guardian_profession: e.target.value }))}
                                    style={inputStyle}
                                />
                                <select
                                    value={familyData.income_range}
                                    onChange={(e) => setFamilyData(prev => ({ ...prev, income_range: e.target.value }))}
                                    style={inputStyle}
                                >
                                    <option value="Prefer not to say">Annual Family Income (approx)</option>
                                    <option value="Under 3 LPA">Under 3 LPA</option>
                                    <option value="3 - 6 LPA">3 - 6 LPA</option>
                                    <option value="6 - 12 LPA">6 - 12 LPA</option>
                                    <option value="Above 12 LPA">Above 12 LPA</option>
                                </select>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button type="submit" className="cta-button" style={{ flex: 1 }}>Submit & Continue</button>
                                    <button type="button" onClick={() => setPaymentStatus('success')} style={{ flex: 1, background: 'transparent', border: '1px solid #444', color: '#888' }}>Skip</button>
                                </div>
                            </form>
                        </div>
                    )
                }

                // If payment is success (fully done), show the regular referral dashboard
                return (
                    <div key="step7-success" className="animate-fade" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                        <h2 style={{ color: 'var(--accent-gold)', marginBottom: '15px', fontSize: '1.8rem' }}>Enrollment Confirmed!</h2>
                        <p style={{ fontSize: '1rem', marginBottom: '25px', color: 'var(--text-primary)' }}>Welcome to the March 2026 Zaukriti TalentForge Ecosystem Cohort.</p>

                        <div style={{ background: 'rgba(255, 204, 51, 0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255, 204, 51, 0.2)', marginBottom: '25px', textAlign: 'left' }}>
                            <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)', textAlign: 'center' }}>Your Referral Dashboard</h4>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>YOUR CODE</p>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '1px' }}>{referralStats.code || '...'}</p>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>WALLET BALANCE (₹)</p>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4ADE80' }}>₹{referralStats.walletBalance || 0}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Share your link to unlock rewards:</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        readOnly
                                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/apply?ref=${referralStats.code}`}
                                        style={{ ...inputStyle, fontSize: '0.8rem', padding: '10px', flex: 1 }}
                                    />
                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/apply?ref=${referralStats.code}`;
                                            navigator.clipboard.writeText(url);
                                            alert('Link copied to clipboard!');
                                        }}
                                        style={{ padding: '0 15px', borderRadius: '8px', background: 'var(--accent-gold)', color: '#000', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginTop: '25px', background: 'rgba(74, 222, 128, 0.1)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                                <h5 style={{ color: '#4ADE80', fontSize: '0.9rem', marginBottom: '8px' }}>🏆 Best Marketing Strategy Award</h5>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                    Market like a founder! High referral performance and creative outreach qualify you for this elite award, prize pool, and priority consideration for our **Business Strategist Team & Internship roles**.
                                </p>
                            </div>

                            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '15px', opacity: 0.6, textAlign: 'center' }}>
                                Referral rewards are credited for successful paid registrations. Wallet benefits and withdrawals are processed post competition. Terms & Conditions apply.
                            </p>
                        </div>

                        <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '20px', fontStyle: 'italic', textAlign: 'center', marginBottom: '20px' }}>
                            {PLATFORM_CONFIG.referral.disclaimer}
                        </p>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            A confirmation email has been sent to <strong>{formData.email}</strong>.<br />
                            Please check your (Inbox/Spam) for onboarding details.<br />
                            Support: <a href="mailto:talentforge@zaukriti.ai" style={{ color: 'var(--accent-gold)' }}>talentforge@zaukriti.ai</a>
                        </p>

                        <div style={{ marginTop: '30px' }}>
                            <Link href="/" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>← Back to Home</Link>
                        </div>
                    </div>
                );
        }
    };

    return (
        <main style={{ padding: 'var(--spacing-md) var(--spacing-sm)', maxWidth: '500px', margin: '0 auto', paddingBottom: 'var(--spacing-lg)' }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid #3B82F6',
                    color: '#3B82F6',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '10px'
                }}>
                    100% Virtual Hackathon
                </div>
                <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', marginBottom: '10px' }}>Ecosystem <span style={{ color: 'var(--accent-gold)' }}>Enrollment</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join India’s most ambitious AI-builder cohort.</p>
            </header>

            <div className="glass-card" style={{ background: 'rgba(22, 22, 61, 0.6)' }}>
                {renderStep()}
            </div>

            {/* T&C Modal */}
            {showTCModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ background: 'var(--primary-bg)', border: '1px solid var(--accent-gold)' }}>
                        <h2 className="modal-title" style={{ fontSize: '1.5rem' }}>Ecosystem Terms</h2>
                        <div className="modal-body" style={{ maxHeight: '60vh' }}>
                            <p><strong>Zaukriti TalentForge — Virtual Merit-First Policy</strong></p>
                            <ul style={{ paddingLeft: '15px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <li><strong>Goal:</strong> Merit-first selection for virtual paid internships (Up to ₹15k/mo).</li>
                                <li><strong>Virtual Submissions:</strong> Candidates must submit high-quality GitHub repos and video demos for evaluation.</li>
                                <li><strong>Commitment:</strong> Participation fee covers digital infrastructure and technical processing. No refunds.</li>
                                <li><strong>Ethics:</strong> Plagiarism or AI-generated demo-only submissions (without real code) lead to disqualification.</li>
                                <li><strong>Jurisdiction:</strong> Subject to Visakhapatnam jurisdiction under IT Act 2000.</li>
                            </ul>
                        </div>
                        <div className="modal-actions">
                            <button className="cta-button" onClick={handleAcceptTC} style={{ flex: 1 }}>I Accept</button>
                            <button className="cta-button" onClick={() => { setShowTCModal(false); setFormData(prev => ({ ...prev, consent: false })) }} style={{ flex: 1, background: '#333', color: 'white' }}>Decline</button>
                        </div>
                    </div>
                </div>
            )}

            <p style={{ marginTop: '30px', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', opacity: 0.7 }}>
                Zaukriti Events Private Limited • Visakhapatnam • India <br />
                <strong>Building for the World. From Anywhere in India.</strong>
            </p>
        </main>
    )
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    background: '#0a0a2b',
    border: '1px solid var(--glass-border)',
    color: '#fff',
    outline: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    cursor: 'text'
}
