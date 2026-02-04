'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'
import { getReferralStats } from '@/lib/referrals'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle, AlertCircle, User, Users, GraduationCap, MapPin, Briefcase, Lock, Share2, Linkedin, Facebook, Twitter, Instagram } from 'lucide-react'

// Extended Global Definition for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Placeholder icons for missing Lucide ones (if any) or use Lucide generics
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
    track: 'ai-ml',
    member2: { name: '', email: '', phone: '' },
    member3: { name: '', email: '', phone: '' },

    // Removed Family Context Fields

    // Other
    amount: 0,
    applied_referral_code: '',
    consent: false
  })

  const [referralStats, setReferralStats] = useState<any>({
    code: null,
    walletBalance: 0,
    count: 0
  })

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

          const now = new Date()
          const active = mapped.find(p => now >= p.start && now <= p.end) || mapped[mapped.length - 1]
          setCurrentPhase(active)

          // Dynamic Launch Gating Logic
          if (mapped.length > 0) {
            const earliest = mapped.reduce((prev, curr) => prev.start < curr.start ? prev : curr)
            setIsLaunched(now >= earliest.start)
          } else {
            setIsLaunched(true)
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
      if (!data.phone.trim() || data.phone.length < 10) errors.phone = "Valid Phone Number is required"
      if (!data.whatsapp.trim()) errors.whatsapp = "WhatsApp Number is required"
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

    const payload = {
      ...formData,
      // Family Data collected is null since step was removed
      familyData: {
        guardian_name: null,
        guardian_profession: null,
        income_range: null
      }
    }

    try {
      // 1. Create Applicant
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      const applicantId = data.id

      // 2. Create Razorpay Order
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamSize: formData.teamSize,
          currency: 'INR',
          receipt: applicantId,
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
            setRegId(applicantId)
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
            setIsSubmitting(false)
            setPaymentStatus('failed')
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
    setFormData((prev: any) => ({ ...prev, [field]: value }))
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
    const launchDateDisplay = pricingPhases.length > 0
      ? pricingPhases.reduce((prev, curr) => prev.start < curr.start ? prev : curr).start
      : null;

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

      {step < 4 && <PricingTable phases={pricingPhases} currentPhase={currentPhase} />}

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
                <label style={labelStyle}>Select Track</label>
                <select style={inputStyle} value={formData.track} onChange={e => handleInputChange('track', e.target.value)}>
                  <option value="ai-ml">AI & Intelligence</option>
                  <option value="fullstack">Full-Stack Engineering</option>
                  <option value="data-science">Data Science</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="cloud">Cloud Computing</option>
                  <option value="fashion-tech">Fashion & Beauty Tech</option>
                </select>
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
                <input style={inputStyle} placeholder="B.Tech, BCA, etc." value={formData.course} onChange={e => handleInputChange('course', e.target.value)} />
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

            <div style={{ background: 'var(--tertiary-bg)', padding: '25px', borderRadius: '16px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Participant</span>
                <span style={{ fontWeight: 600 }}>{formData.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Track</span>
                <span style={{ fontWeight: 600 }}>{formData.track.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Registration Type</span>
                <span style={{ fontWeight: 600 }}>{formData.teamSize === '1' ? 'Individual' : `Team of ${formData.teamSize}`}</span>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px dashed var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Total Payable</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-primary)' }}>₹{formData.amount || 0}</span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '4px' }} checked={formData.consent} onChange={e => handleInputChange('consent', e.target.checked)} />
                <span>I declare that all information provided is true. I understand that selection is based on merit and performance in the Hackathon.</span>
              </label>
              {renderError('consent')}
            </div>

            <button
              className="cta-button"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', opacity: isSubmitting || !formData.consent ? 0.7 : 1 }}
              disabled={isSubmitting || !formData.consent}
              onClick={handleFinalSubmit}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : `Pay ₹${formData.amount}`}
            </button>

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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button onClick={() => { navigator.clipboard.writeText(referralStats.code); alert('Copied!'); }} style={{ padding: '10px 20px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    Copy Code
                  </button>
                  <button onClick={() => {
                    const text = `Join me at Zaukriti AI Hackathon! Use my code ${referralStats.code} for benefits. Register here: https://zaukriti.ai/apply?ref=${referralStats.code}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }} style={{ padding: '10px 20px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Share2 size={16} /> WhatsApp
                  </button>
                </div>
              </div>
            )}

            <Link href="/" className="cta-button">Go Home</Link>
          </div>
        )}

      </div>
    </main>
  )
}
