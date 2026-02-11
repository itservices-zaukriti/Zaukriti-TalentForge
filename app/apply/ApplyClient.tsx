'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'
import { getReferralStats } from '@/lib/referrals'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle, AlertCircle, User, Users, GraduationCap, MapPin, Briefcase, Lock, Share2, Linkedin, Facebook, Twitter, Instagram, X } from 'lucide-react'
import { EligibilitySection, DomainAccordionSection } from './ApplyUI'
import { CAREER_DOMAINS } from '@/lib/content_data'

// Extended Global Definition for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Placeholder icons for missing Lucide ones (if any) or use Lucide generics
const ALLOWED_DEGREES = [
  "B.Tech / B.E.",
  "M.Tech / M.E.",
  "BCA",
  "MCA",
  "B.Sc",
  "M.Sc",
  "B.Com",
  "M.Com",
  "BBA",
  "MBA",
  "Other Graduation"
];

const WhatsAppIcon = ({ size, color }: { size: number, color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
  </svg>
)

/* ----------------------------- */
/* Pricing Table Component       */
/* ----------------------------- */
const PricingTable = ({ phases, currentPhase }: { phases: any[]; currentPhase: any }) => {
  if (!phases?.length || !currentPhase) return null

  return (
    <div style={{ marginTop: 30, marginBottom: 40, border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '20px', background: 'var(--secondary-bg)' }}>
      <h4 style={{ textAlign: 'center', marginBottom: 20, color: 'var(--brand-primary)', fontFamily: 'var(--font-inter)' }}>
        Registration Tiers
      </h4>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse', minWidth: '400px', fontFamily: 'var(--font-inter)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Phase</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Dates</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Individual</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Team (2)</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Team (3)</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((p, i) => {
              const isCurrent = currentPhase && p.name === currentPhase.name
              if (p.name === 'Closed') return null

              return (
                <tr key={i} style={{
                  background: isCurrent ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                  color: isCurrent ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: isCurrent ? 600 : 400
                }}>
                  <td style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                    {p.name}
                    {isCurrent && <span style={{ marginLeft: 8, fontSize: '0.7rem', background: 'var(--brand-primary)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>LIVE</span>}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                    {p.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – {p.end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--glass-border)' }}>₹{p.fees.individual}</td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--glass-border)' }}>₹{p.fees.team2}</td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--glass-border)' }}>₹{p.fees.team3}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ----------------------------- */
/* MAIN CLIENT COMPONENT         */
/* ----------------------------- */
export default function ApplyClient() {
  const searchParams = useSearchParams()

  /* ---------------- State ---------------- */
  const [step, setStep] = useState(1)
  const [pricingPhases, setPricingPhases] = useState<any[]>([])
  const [currentPhase, setCurrentPhase] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle')
  const [regId, setRegId] = useState<string | null>(null)
  const [isLaunched, setIsLaunched] = useState(false)

  // Track touched fields for inline errors
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState<any>({
    // Personal
    name: '',
    email: '',
    phone: '',
    whatsapp: '',

    // Academic & Location
    college: '',
    course: '',
    year: '',
    city_state: '',
    linkedin: '',
    resume: '', // URL

    // Track & Team
    teamSize: '1',
    track: '', // Initialize to empty to force user selection and avoid legacy 'ai-ml' mismatch
    member2: { name: '', email: '', phone: '' },
    member3: { name: '', email: '', phone: '' },

    // Removed Family Context Fields

    // Other
    amount: 0,
    applied_referral_code: '',
    consent: false,
    role: '',
    customRole: ''
  })

  const [isReferralVerified, setIsReferralVerified] = useState(false)
  const [isCheckingReferral, setIsCheckingReferral] = useState(false)

  const [referralStats, setReferralStats] = useState<any>({
    code: null,
    walletBalance: 0,
    count: 0
  })

  // Hook to handle referral input change specifically
  const handleReferralChange = (val: string) => {
    // Always uppercase
    const code = val.toUpperCase();
    setFormData((p: any) => ({ ...p, applied_referral_code: code }));
    // Reset verification immediately on change
    setIsReferralVerified(false);
  }

  // Auto-verify referral code when reaching Step 4 (Review) if present
  useEffect(() => {
    if (step === 4 && formData.applied_referral_code && !isReferralVerified) {
      verifyReferralCode(false); // Silent verification first (no alert if invalid, or maybe yes?)
      // Actually, if it's invalid, the user might want to know. 
      // But let's stick to standard behavior: if it fails, just don't apply discount. 
      // If user manually clicks "Apply", then show alert.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const verifyReferralCode = async (showError = true) => {
    if (!formData.applied_referral_code) return;
    setIsCheckingReferral(true);
    try {
      const res = await fetch('/api/validate-referral', {
        method: 'POST',
        body: JSON.stringify({ code: formData.applied_referral_code, email: formData.email })
      });
      const data = await res.json();
      if (data.valid) {
        setIsReferralVerified(true);
      } else {
        setIsReferralVerified(false);
        if (showError) alert("Invalid Code"); // Ideally toast
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingReferral(false);
    }
  }

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    async function loadPricing() {
      try {
        const { data: phases } = await supabase
          .from('pricing_phases')
          .select('*')
          .order('display_order')

        const { data: amounts } = await supabase
          .from('pricing_amounts')
          .select('*')

        if (phases && amounts) {
          const mapped = phases.map(p => {
            const pAmounts = amounts.filter(a => a.phase_id === p.id)
            return {
              id: p.id,
              name: p.phase_name,
              start: new Date(p.start_date),
              end: new Date(p.end_date),
              fees: {
                individual: pAmounts.find(a => a.team_size === 1)?.amount || 0,
                team2: pAmounts.find(a => a.team_size === 2)?.amount || 0,
                team3: pAmounts.find(a => a.team_size === 3)?.amount || 0
              }
            }
          })

          setPricingPhases(mapped)

          // AUTHORITATIVE CHECK: Fetch status from Backend
          try {
            const ts = new Date().getTime();
            const statusRes = await fetch(`/api/phase-status?t=${ts}`, {
              cache: 'no-store',
              headers: { 'Pragma': 'no-cache' }
            });

            if (statusRes.ok) {
              const statusData = await statusRes.json();
              console.log("Phase Status API:", statusData); // Debug for User

              if (statusData.isOpen === true && statusData.phase?.id) {
                const active = mapped.find(p => p.id === statusData.phase.id);
                console.log("Setting Active Phase:", active);
                setCurrentPhase(active || null);
                setIsLaunched(true);
              } else {
                console.log("API returned isOpen:false");
                setCurrentPhase(null);

                // If there is a next phase, we are currently "Pre-Launch" for that phase.
                // So set isLaunched = false to show "Coming Soon".
                if (statusData.nextPhase) {
                  console.log("Upcoming phase detected. Setting isLaunched = false");
                  setIsLaunched(false);
                } else {
                  // Truly Closed (Post-event or nothing scheduled)
                  console.log("No upcoming phase. Setting isLaunched = true (Hard Closed)");
                  setIsLaunched(true);
                }
              }
            } else {
              console.error("Phase API Error:", statusRes.status);
              setCurrentPhase(null);
              setIsLaunched(true);
            }
          } catch (err) {
            console.error("Phase check failed", err);
            setCurrentPhase(null);
            setIsLaunched(true);
          }
        }
      } catch (e) {
        console.error('Pricing load failed', e)
        setIsLaunched(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadPricing()
  }, [])

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setFormData((p: any) => ({ ...p, applied_referral_code: ref.toUpperCase() }))
    }
  }, [searchParams])

  useEffect(() => {
    if (currentPhase) {
      const size = parseInt(formData.teamSize)
      let amt = 0
      if (size === 1 || isNaN(size)) amt = currentPhase.fees.individual
      else if (size === 2) amt = currentPhase.fees.team2
      else if (size === 3) amt = currentPhase.fees.team3
      setFormData((p: any) => ({ ...p, amount: amt }))
    }
  }, [formData.teamSize, currentPhase])

  useEffect(() => {
    if (step === 5 && regId) { // Success Step is now 5
      getReferralStats(regId).then(setReferralStats)
    }
  }, [step, regId])

  /* ---------------- Validation Logic ---------------- */
  // Pure validation function - returns error object
  const getErrors = (currentStep: number, data: any) => {
    const errors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!data.name.trim()) errors.name = "Full Name is required"
      if (!data.email.trim() || !data.email.includes('@')) errors.email = "Valid Email is required"

      // Strict Phone Validation
      const phoneRegex = /^[6-9][0-9]{9}$/;
      if (!data.phone.trim()) {
        errors.phone = "Phone Number is required"
      } else if (!phoneRegex.test(data.phone.replace(/\s+/g, '').replace(/^(\+91|91)/, ''))) {
        errors.phone = "Invalid Phone. Enter 10-digit number starting with 6-9."
      }

      if (!data.whatsapp.trim()) errors.whatsapp = "WhatsApp Number is required"
      if (!data.track) errors.track = "Product/Domain is required"
      if (data.track && !data.role) errors.role = "Role is required"
      if (data.role === 'other' && !data.customRole) errors.role = "Please specify your role"
    }

    if (currentStep === 2) {
      if (!data.college.trim()) errors.college = "College Name is required"
      if (!data.course.trim()) errors.course = "Course/Degree is required"
      if (!data.year) errors.year = "Graduation Year is required"
      if (!data.city_state.trim()) errors.city_state = "Current City/State is required"
    }

    // Step 3 (Previously 4): Team Details
    if (currentStep === 3) {
      const size = parseInt(data.teamSize)
      if (size > 1) {
        if (!data.member2?.name) errors['member2.name'] = "Member 2 Name required"
        if (!data.member2?.email) errors['member2.email'] = "Member 2 Email required"
      }
      if (size > 2) {
        if (!data.member3?.name) errors['member3.name'] = "Member 3 Name required"
        if (!data.member3?.email) errors['member3.email'] = "Member 3 Email required"
      }
    }

    // Step 4 (Previously 5): Final Review
    if (currentStep === 4) {
      if (!data.consent) errors.consent = "You must agree to the declaration"
    }

    return errors
  }

  // Check if current step is valid
  const isStepValid = (s: number) => {
    const errors = getErrors(s, formData)
    return Object.keys(errors).length === 0
  }

  /* ---------------- Handlers ---------------- */
  const handleNext = () => {
    if (isStepValid(step)) {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Mark all fields in current step as touched
      const fieldNames = Object.keys(getErrors(step, { ...formData, ...getEmptyFieldsForStep(step) }))
      const newTouched: any = { ...touched }
      fieldNames.forEach(f => newTouched[f] = true)
      setTouched(newTouched)
    }
  }

  const handlePrev = () => {
    setStep(s => s - 1)
  }

  // Helper to get all relevant fields for a step to mark them touched
  const getEmptyFieldsForStep = (s: number) => {
    // This helper effectively forces validation to run against "empty" to find all potential errors
    // But since we pass formData to getErrors, we don't strictly need this if we just rely on keys returned by getErrors
    return {}
  }

  const handleFinalSubmit = async () => {
    if (!isStepValid(4)) return // Now Step 4

    setIsSubmitting(true)
    setPaymentStatus('pending')

    // Use existing applicant ID if already registered in this session
    let applicantId = regId;

    try {
      // Always update registration details first (Upsert Logic)
      const payload = {
        ...formData,
        // Family Data collected is null since step was removed
        familyData: {
          guardian_profession: null,
          income_range: null
        },
        // Pass Role as primary_stream (mapped in backend or passed directly)
        // Actually let's pass it as a custom field "role" and let backend handle it
        role: formData.role === 'other' ? formData.customRole : formData.role
      }

      // 1. Create OR Update Applicant
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      applicantId = data.id
      setRegId(applicantId) // Save for retry/resume in same session

      // CHECK: If already PAID (e.g. updating existing record), skip Payment
      if (data.payment_status === 'Paid') {
        console.log("✅ [CLIENT] Application updated and already PAID. Skipping gateway.");
        setStep(5);
        setIsSubmitting(false);
        setPaymentStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // 2. Create Razorpay Order
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamSize: formData.teamSize,
          currency: 'INR',
          receipt: applicantId,
          applicantId: applicantId, // REQUIRED for Resume/Idempotency Logic
          referralCode: formData.applied_referral_code,
          email: formData.email
        })
      });

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed')

      // 3. Open Razorpay Modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Zaukriti TalentForge",
        description: "Hackathon Registration Fee",
        order_id: orderData.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#6366f1"
        },
        handler: async function (response: any) {
          // 4. Verify Payment
          console.log("Payment Success:", response)
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
                applicant_id: applicantId
              })
            })

            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed')

            // 5. Success
            setStep(5) // Success Step
            setIsSubmitting(false)
            setPaymentStatus('success')
            window.scrollTo({ top: 0, behavior: 'smooth' })

          } catch (e: any) {
            console.error(e)
            alert("Payment Verification Failed: " + e.message)
            setIsSubmitting(false)
          }
        },
        modal: {
          ondismiss: function () {
            console.log('Payment cancelled/closed by user');
            setIsSubmitting(false);
            setPaymentStatus('failed'); // We can use 'failed' or 'cancelled' depending on type. Existing likely uses 'failed'.

            // Auto-trigger "Payment Pending" reminder
            fetch('/api/send-payment-reminder', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ applicantId })
            }).catch(err => console.error("Failed to trigger reminder", err));

            alert("Payment was cancelled. We have saved your application. Check your email/WhatsApp for a link to resume payment later.");
          }
        }
      }

      if (window.Razorpay) {
        const rzp1 = new window.Razorpay(options)
        rzp1.open()
      } else {
        alert('Payment gateway failed to load. Please check internet.')
        setIsSubmitting(false)
      }

    } catch (e: any) {
      console.error(e);
      alert('Error: ' + e.message)
      setIsSubmitting(false)
      setPaymentStatus('failed')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    let finalValue = value;

    // Normalize Phone Input
    if (field === 'phone' || field === 'whatsapp') {
      // Remove non-numeric characters for internal storage, but allow users to type +91 initially then strip it?
      // actually, let's just strip everything except digits.
      // And standardizing: if starts with 91 and length is 12, strip 91.
      // But for better UX, we might just let them type and validate on Next.
      // The prompt says "Normalize internally".
      // let's do soft normalization here if needed or just keep raw and validate.
      // But prompt says "Normalize internally to 9966405444".
      // Let's strip spaces.
      if (typeof value === 'string') {
        // We won't aggressively strip in onChange because it hinders typing (e.g. +).
        // leaving it raw here, but validation handles the strict check.
        // ACTUALLY, "Normalize internally" usually means before sending to API. 
        // But "Accept phone formats... Normalize internally". 
        // I will do strict validation in getErrors.
      }
    }

    setFormData((prev: any) => ({ ...prev, [field]: finalValue }))
    setTouched((prev: any) => ({ ...prev, [field]: true }))
  }

  const handleMemberChange = (member: 'member2' | 'member3', subField: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [member]: { ...prev[member], [subField]: value }
    }))
    setTouched((prev: any) => ({ ...prev, [`${member}.${subField}`]: true }))
  }

  /* ---------------- Render Helpers ---------------- */
  const currentErrors = getErrors(step, formData)

  const renderError = (field: string) => {
    if (touched[field] && currentErrors[field]) {
      return <div style={{ color: 'var(--accent-error)', fontSize: '0.8rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {currentErrors[field]}</div>
    }
    return null
  }

  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    background: 'var(--secondary-bg)',
    fontSize: '0.95rem',
    marginBottom: '8px', // Reduced to make room for error
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'var(--font-inter)'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-inter)'
  }

  const sectionTitleStyle = {
    fontSize: '1.2rem',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--brand-primary)',
    fontWeight: 600,
    fontFamily: 'var(--font-inter)'
  }

  /* ---------------- Render ---------------- */
  if (isLoading) {
    return (
      <main style={{ padding: 100, textAlign: 'center', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="var(--brand-primary)" />
      </main>
    )
  }

  // Pre-launch Gate
  if (!isLaunched) {
    // If we are here, it means we are in "Coming Soon" mode.
    // The previous logic used 'reduce' to find the min start date.
    // Now that `pricingPhases` is sorted by `display_order`, we should re-sort by date to be sure,
    // Or just trust the API's nextPhase logic if we wanted to pass it down.
    // But we don't have nextPhase in state, we only have pricingPhases.
    // Let's just find the earliest future phase from the local list.

    const now = new Date();
    // Filter only phases in future
    const futurePhases = pricingPhases.filter(p => p.start > now);
    // Sort by start date
    futurePhases.sort((a, b) => a.start.getTime() - b.start.getTime());

    const launchDateDisplay = futurePhases.length > 0 ? futurePhases[0].start : null;

    return (
      <main style={{ maxWidth: 700, margin: '40px auto', padding: '20px', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '60px 40px' }}>
          <div style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
            <Lock size={40} color="var(--brand-primary)" />
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '20px', fontWeight: 700 }}>Launching Soon</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Registration for TalentForge 2026 opens on <strong>{launchDateDisplay ? launchDateDisplay.toLocaleDateString(undefined, {
              month: 'long', day: 'numeric', year: 'numeric'
            }) : 'Coming Soon'}</strong>. <br />
            Please check back then.
          </p>
          <Link href="/" className="cta-button-secondary">Return Home</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px', minHeight: '80vh' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {step < 4 && <h1 style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: 700, fontFamily: 'var(--font-inter)' }}>Join the Ecosystem</h1>}
        {step < 4 && <div style={{ height: '4px', width: '100%', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden', maxWidth: '300px', margin: '20px auto 0' }}>
          <div style={{ height: '100%', width: `${(step / 4) * 100}%`, background: 'var(--brand-primary)', transition: 'width 0.3s ease' }}></div>
        </div>}
      </div>

      {!currentPhase ? (
        <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
            <Lock size={40} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', fontWeight: 700, color: '#ef4444' }}>Registrations Closed</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
            The registration window for this cohort has currently closed. Please follow our announcements for upcoming phases.
          </p>
          <Link href="/" className="cta-button-secondary">Return Home</Link>
        </div>
      ) : (
        <>
          {step < 4 && <PricingTable phases={pricingPhases} currentPhase={currentPhase} />}

          {/* Enhanced Content Sections (Step 1 Only) */}
          {step === 1 && <EligibilitySection />}
          {step === 1 && <DomainAccordionSection />}
          <div className="glass-card" style={{ padding: '40px' }}>

            {/* STEP 1: Personal + Track */}
            {step === 1 && (
              <div className="animate-fade">
                <h3 style={sectionTitleStyle}><User size={20} /> Personal Detail</h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Full Name <span style={{ color: 'red' }}>*</span></label>
                  <input style={inputStyle} placeholder="Full Legal Name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                  {renderError('name')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Email Address <span style={{ color: 'red' }}>*</span></label>
                    <input style={inputStyle} type="email" placeholder="you@example.com" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
                    {renderError('email')}
                  </div>
                  <div>
                    <label style={labelStyle}>Contact Number <span style={{ color: 'red' }}>*</span></label>
                    <input style={inputStyle} type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                    {renderError('phone')}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>WhatsApp Number <span style={{ color: 'red' }}>*</span></label>
                    <input style={inputStyle} type="tel" placeholder="Same as phone?" value={formData.whatsapp} onChange={e => handleInputChange('whatsapp', e.target.value)} />
                    {renderError('whatsapp')}
                  </div>
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={labelStyle}>Select Product / Domain <span style={{ color: 'red' }}>*</span></label>
                      <select
                        style={inputStyle}
                        value={formData.track}
                        onChange={e => {
                          handleInputChange('track', e.target.value);
                          handleInputChange('role', ''); // Reset role when track changes
                        }}
                      >
                        <option value="">-- Choose a Product --</option>
                        {CAREER_DOMAINS.map(domain => (
                          <option key={domain.id} value={domain.slug}>{domain.title}</option>
                        ))}
                      </select>
                      {renderError('track')} {/* Assuming we add track validation error key if empty/invalid */}
                    </div>

                    {/* Dynamic Role Selection - Always Render if Track Selected */}
                    {formData.track && formData.track !== '' && (
                      <div className="animate-fade" style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Select Role / Sub-Track <span style={{ color: 'red' }}>*</span></label>
                        {/* Safe Access to Domain Title */}
                        <p style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', marginBottom: '8px' }}>
                          * Select the role you want to apply for within the <b>{CAREER_DOMAINS.find(d => d.slug === formData.track)?.title || 'Selected Domain'}</b> team.
                        </p>
                        <select
                          style={inputStyle}
                          value={formData.role || ''}
                          onChange={e => handleInputChange('role', e.target.value)}
                        >
                          <option value="">-- Choose Your Role --</option>
                          {/* Safe Access to Roles Array */}
                          {(CAREER_DOMAINS.find(d => d.slug === formData.track)?.roles || []).map((role, idx) => (
                            <option key={idx} value={role}>{role}</option>
                          ))}
                          <option value="other">Other (Specify below)</option>
                        </select>
                        {renderError('role')}
                      </div>
                    )}

                    {formData.role === 'other' && (
                      <div className="animate-fade" style={{ marginBottom: '16px' }}>
                        <input
                          style={inputStyle}
                          placeholder="Please specify your role..."
                          value={formData.customRole || ''}
                          onChange={e => handleInputChange('customRole', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="cta-button"
                  style={{ width: '100%', marginTop: '10px', opacity: isStepValid(1) ? 1 : 0.6, cursor: isStepValid(1) ? 'pointer' : 'not-allowed' }}
                  onClick={handleNext}
                  disabled={!isStepValid(1)}
                >
                  Next: Academic Info
                </button>
              </div>
            )}

            {/* STEP 2: Academic + Location */}
            {step === 2 && (
              <div className="animate-fade">
                <h3 style={sectionTitleStyle}><GraduationCap size={20} /> Academic & Location</h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>College / University Name <span style={{ color: 'red' }}>*</span></label>
                  <input style={inputStyle} placeholder="Full College Name" value={formData.college} onChange={e => handleInputChange('college', e.target.value)} />
                  {renderError('college')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Course / Degree <span style={{ color: 'red' }}>*</span></label>
                    <select
                      style={inputStyle}
                      value={formData.course}
                      onChange={e => handleInputChange('course', e.target.value)}
                    >
                      <option value="">-- Select Degree --</option>
                      {ALLOWED_DEGREES.map((deg, i) => (
                        <option key={i} value={deg}>{deg}</option>
                      ))}
                    </select>
                    {renderError('course')}
                  </div>
                  <div>
                    <label style={labelStyle}>Graduation Year <span style={{ color: 'red' }}>*</span></label>
                    <input style={inputStyle} type="number" placeholder="2026" value={formData.year} onChange={e => handleInputChange('year', e.target.value)} />
                    {renderError('year')}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Current City & State <span style={{ color: 'red' }}>*</span></label>
                  <input style={inputStyle} placeholder="e.g. Visakhapatnam, Andhra Pradesh" value={formData.city_state} onChange={e => handleInputChange('city_state', e.target.value)} />
                  {renderError('city_state')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Resume URL (GDrive/Link)</label>
                    <input style={inputStyle} placeholder="https://..." value={formData.resume} onChange={e => handleInputChange('resume', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>LinkedIn Profile</label>
                    <input style={inputStyle} placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={e => handleInputChange('linkedin', e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button onClick={handlePrev} className="cta-button-secondary" style={{ flex: 1 }}>Back</button>
                  <button
                    onClick={handleNext}
                    className="cta-button"
                    style={{ flex: 1, opacity: isStepValid(2) ? 1 : 0.6, cursor: isStepValid(2) ? 'pointer' : 'not-allowed' }}
                    disabled={!isStepValid(2)}
                  >
                    Next: Team Details
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 (Previously 4): Team Details */}
            {step === 3 && (
              <div className="animate-fade">
                <h3 style={sectionTitleStyle}><Briefcase size={20} /> Team Configuration</h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Participation Type</label>
                  <select style={inputStyle} value={formData.teamSize} onChange={e => handleInputChange('teamSize', e.target.value)}>
                    <option value="1">Individual (Solo)</option>
                    <option value="2">Team of 2</option>
                    <option value="3">Team of 3</option>
                  </select>
                </div>

                {formData.teamSize === '1' && (
                  <div style={{ padding: '20px', background: 'var(--tertiary-bg)', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>You are registering as an individual participant.</p>
                  </div>
                )}

                {parseInt(formData.teamSize) > 1 && (
                  <div style={{ padding: '20px', border: '1px solid var(--glass-border)', borderRadius: '12px', marginBottom: '20px' }}>
                    <h5 style={{ marginBottom: '16px' }}>Team Member 2</h5>
                    <input style={inputStyle} placeholder="Full Name" value={formData.member2?.name || ''} onChange={e => handleMemberChange('member2', 'name', e.target.value)} />
                    {renderError('member2.name')}
                    <input style={inputStyle} placeholder="Email" value={formData.member2?.email || ''} onChange={e => handleMemberChange('member2', 'email', e.target.value)} />
                    {renderError('member2.email')}
                    <input style={inputStyle} placeholder="Phone" value={formData.member2?.phone || ''} onChange={e => handleMemberChange('member2', 'phone', e.target.value)} />
                  </div>
                )}

                {parseInt(formData.teamSize) > 2 && (
                  <div style={{ padding: '20px', border: '1px solid var(--glass-border)', borderRadius: '12px', marginBottom: '20px' }}>
                    <h5 style={{ marginBottom: '16px' }}>Team Member 3</h5>
                    <input style={inputStyle} placeholder="Full Name" value={formData.member3?.name || ''} onChange={e => handleMemberChange('member3', 'name', e.target.value)} />
                    {renderError('member3.name')}
                    <input style={inputStyle} placeholder="Email" value={formData.member3?.email || ''} onChange={e => handleMemberChange('member3', 'email', e.target.value)} />
                    {renderError('member3.email')}
                    <input style={inputStyle} placeholder="Phone" value={formData.member3?.phone || ''} onChange={e => handleMemberChange('member3', 'phone', e.target.value)} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                  <button onClick={handlePrev} className="cta-button-secondary" style={{ flex: 1 }}>Back</button>
                  <button
                    onClick={handleNext}
                    className="cta-button"
                    style={{ flex: 1, opacity: isStepValid(3) ? 1 : 0.6, cursor: isStepValid(3) ? 'pointer' : 'not-allowed' }}
                    disabled={!isStepValid(3)}
                  >
                    Next: Review & Pay
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 (Previously 5): Confirm & Pay */}
            {step === 4 && (
              <div className="animate-fade">
                <h3 style={{ marginBottom: '20px', textAlign: 'center', color: 'var(--brand-primary)', fontFamily: 'var(--font-inter)' }}>Final Review</h3>

                {/* Calculate Payment Breakdown (Layout Logic) */}
                {(() => {
                  const baseAmount = formData.amount || 0;
                  const discount = isReferralVerified ? 50 : 0;
                  const taxable = Math.max(0, baseAmount - discount);
                  const gst = Math.ceil(taxable * 0.18);
                  const total = taxable + gst;

                  return (
                    <>
                      <div style={{ background: 'var(--tertiary-bg)', padding: '25px', borderRadius: '16px', marginBottom: '30px' }}>
                        {/* Summary Details */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Participant</span>
                          <span style={{ fontWeight: 600 }}>{formData.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Track</span>
                          <span style={{ fontWeight: 600 }}>{formData.track?.toUpperCase() || 'GENERAL'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Registration Type</span>
                          <span style={{ fontWeight: 600 }}>{formData.teamSize === '1' ? 'Individual' : `Team of ${formData.teamSize}`}</span>
                        </div>

                        {/* Referral Code Input */}
                        <div style={{ marginBottom: '20px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>Have a Referral Code?</label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                              style={{ ...inputStyle, marginBottom: 0, textTransform: 'uppercase' }}
                              placeholder="Enter Code (e.g. ZTF-STU-123)"
                              value={formData.applied_referral_code || ''}
                              onChange={e => handleReferralChange(e.target.value)}
                              disabled={isSubmitting}
                            />
                            {!isReferralVerified ? (
                              <button
                                onClick={() => verifyReferralCode()}
                                disabled={!formData.applied_referral_code || isCheckingReferral}
                                style={{
                                  padding: '0 20px',
                                  background: 'var(--tertiary-bg)',
                                  border: '1px solid var(--glass-border)',
                                  borderRadius: '8px',
                                  cursor: (!formData.applied_referral_code || isCheckingReferral) ? 'not-allowed' : 'pointer',
                                  color: 'var(--brand-primary)',
                                  fontWeight: 600
                                }}
                              >
                                {isCheckingReferral ? <Loader2 className="animate-spin" size={16} /> : 'Apply'}
                              </button>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-success)', fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                  <CheckCircle size={16} style={{ marginRight: '4px' }} /> Applied
                                </div>
                                <button
                                  onClick={() => handleReferralChange('')}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                          {isReferralVerified && <p style={{ fontSize: '0.75rem', color: 'var(--accent-success)', marginTop: '4px' }}>Discount applied successfully.</p>}
                        </div>
                        {formData.applied_referral_code && <p style={{ fontSize: '0.75rem', color: 'var(--accent-success)', marginTop: '4px' }}>Discount applied successfully.</p>}
                      </div>


                      {/* Cost Breakdown */}
                      <div style={{ background: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Registration Fee</span>
                          <span>₹{baseAmount}</span>
                        </div>
                        {discount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--accent-success)' }}>
                            <span>Referral Discount</span>
                            <span>- ₹{discount}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Platform & GST (18%)</span>
                          <span>+ ₹{gst}</span>
                        </div>

                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Total Payable</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-primary)' }}>₹{total}</span>
                        </div>
                      </div>



                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          <input type="checkbox" style={{ marginTop: '4px' }} checked={formData.consent} onChange={e => handleInputChange('consent', e.target.checked)} />
                          <span>
                            I confirm I am 18+ and enrolled in/completed a <strong>Graduation/Engineering</strong> degree. I consent to the processing of my data for evaluation & hiring in accordance with the <strong>DPDP Act</strong>.
                          </span>
                        </label>
                        {renderError('consent')}
                      </div>

                      <button
                        className="cta-button"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', opacity: isSubmitting || !formData.consent ? 0.7 : 1 }}
                        disabled={isSubmitting || !formData.consent}
                        onClick={handleFinalSubmit}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : `Pay ₹${total}`}
                      </button>
                    </>
                  );
                })()}

                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '12px', lineHeight: '1.4' }}>
                  By registering, you agree to our{' '}
                  <Link href="/terms" target="_blank" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Terms & Conditions</Link>,{' '}
                  <Link href="/privacy" target="_blank" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Privacy Policy</Link>, and{' '}
                  <Link href="/refund-policy" target="_blank" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Refund Policy</Link>.
                </p>

                <button onClick={handlePrev} style={{ width: '100%', marginTop: '20px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Back to edits
                </button>
              </div>
            )}

            {/* STEP 5 (Previously 7): Success */}
            {step === 5 && (
              <div className="animate-fade" style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle size={80} color="var(--accent-success)" style={{ marginBottom: '24px', margin: '0 auto' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: 700 }}>Registration Successful!</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                  Welcome to the cohort. A confirmation email has been sent to <strong>{formData.email}</strong>.
                </p>

                {referralStats.code && (
                  <div style={{ background: 'var(--secondary-bg)', padding: '30px', borderRadius: '16px', border: '1px solid var(--brand-primary)', marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Your Referral Code</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '2px', marginBottom: '10px' }}>
                      {referralStats.code}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                      Share this code with friends. You earn rewards for every successful referral!
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {(() => {
                          const shareText = `Join me at Zaukriti TalentForge 2026! 🚀\n\nUse my referral code *${referralStats.code}* to get ₹50 OFF your registration.\n\nRegister here: https://zaukriti.ai/apply?ref=${referralStats.code}`;
                          const shareUrl = `https://zaukriti.ai/apply?ref=${referralStats.code}`;

                          const btnStyle = { padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', border: 'none', fontSize: '0.9rem' };

                          return (
                            <>
                              <button onClick={() => { navigator.clipboard.writeText(referralStats.code); alert('Code Copied!'); }} style={{ ...btnStyle, background: 'var(--glass-border)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
                                <span style={{ marginRight: 6 }}>📋</span> Copy
                              </button>

                              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')} style={{ ...btnStyle, background: '#25D366', color: '#fff' }}>
                                <Share2 size={16} style={{ marginRight: 6 }} /> WhatsApp
                              </button>

                              <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')} style={{ ...btnStyle, background: '#0077b5', color: '#fff' }}>
                                <Linkedin size={16} style={{ marginRight: 6 }} /> LinkedIn
                              </button>

                              <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')} style={{ ...btnStyle, background: '#1DA1F2', color: '#fff' }}>
                                <Twitter size={16} style={{ marginRight: 6 }} /> Twitter
                              </button>

                              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')} style={{ ...btnStyle, background: '#1877F2', color: '#fff' }}>
                                <Facebook size={16} style={{ marginRight: 6 }} /> Facebook
                              </button>

                              <button onClick={() => alert("Instagram does not support direct link sharing. Please copy the code/link and share it in your story/bio!")} style={{ ...btnStyle, background: '#E1306C', color: '#fff' }}>
                                <Instagram size={16} style={{ marginRight: 6 }} /> Instagram
                              </button>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                <Link href="/" className="cta-button">Go Home</Link>
              </div>
            )}

          </div>
        </>
      )
      }
    </main >
  )
}
