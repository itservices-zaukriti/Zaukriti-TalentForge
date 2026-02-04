'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, MapPin, Linkedin, Twitter, MessageSquare, Loader2, CheckCircle } from 'lucide-react'
import { PLATFORM_CONFIG } from '../utils/config'
import { supabase } from '@/lib/supabase'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: 'general',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validate = () => {
        const errors: any = {}
        if (!formData.name.trim()) errors.name = true
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = true
        if (formData.phone.length < 10) errors.phone = true
        if (!formData.message.trim()) errors.message = true
        return errors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const errors = validate()
        if (Object.keys(errors).length > 0) {
            setTouched({ name: true, email: true, phone: true, message: true })
            return
        }

        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        topic: formData.topic,
                        message: formData.message
                    }
                ])

            if (error) throw error

            setStatus('success')
            setFormData({ name: '', email: '', phone: '', topic: 'general', message: '' })
            setTouched({})
        } catch (error) {
            console.error('Error submitting contact form:', error)
            setStatus('error')
            // Optional: Show error message to user, for now using built-in alert or just logging
            alert('Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputStyle = {
        width: '100%',
        padding: '14px',
        borderRadius: '8px',
        border: '1px solid var(--glass-border)',
        background: 'var(--secondary-bg)',
        fontSize: '0.95rem',
        marginBottom: '6px',
        color: 'var(--text-primary)',
        outline: 'none',
        transition: 'border-color 0.2s',
        fontFamily: 'var(--font-inter)'
    }

    return (
        <main className="container" style={{ paddingTop: 'calc(80px + var(--spacing-lg))', paddingBottom: 'var(--spacing-lg)', minHeight: '80vh' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '40px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>

                {/* Visual Side */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Get in Touch</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                        Have questions about the hackathon or our platforms? We're here to help.
                    </p>

                    <div className="glass-card" style={{ marginBottom: '30px', border: '1px solid var(--glass-border)', background: 'white' }}>
                        <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Mail size={20} color="var(--brand-primary)" /> Contact Channels
                        </h4>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Technical Support</p>
                            <a href={`mailto:${PLATFORM_CONFIG.branding.hackathonEmail}`} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{PLATFORM_CONFIG.branding.hackathonEmail}</a>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Partnerships</p>
                            <a href={`mailto:${PLATFORM_CONFIG.branding.productEmail}`} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{PLATFORM_CONFIG.branding.productEmail}</a>
                        </div>
                    </div>

                    <div className="glass-card" style={{ border: 'none', background: 'var(--secondary-bg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                            <MapPin size={18} /> <span style={{ fontWeight: 600 }}>Visakhapatnam HQ</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Zaukriti Events Private Limited<br />Andhra Pradesh, India</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="glass-card" style={{ padding: '40px' }}>
                    {status === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <CheckCircle size={60} color="var(--accent-success)" style={{ marginBottom: '20px' }} />
                            <h3 style={{ marginBottom: '10px' }}>Message Sent!</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>We'll get back to you within 24 hours.</p>
                            <button onClick={() => setStatus('idle')} className="cta-button-secondary" style={{ marginTop: '20px' }}>Send Another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <h3 style={{ marginBottom: '30px' }}>Send a Message</h3>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Your Name</label>
                                <input
                                    name="name"
                                    placeholder="Enter full name"
                                    style={inputStyle}
                                    value={formData.name}
                                    onChange={handleInput}
                                />
                                {touched.name && !formData.name.trim() && <span style={{ color: 'red', fontSize: '0.8rem' }}>Name is required</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="you@company.com"
                                        style={inputStyle}
                                        value={formData.email}
                                        onChange={handleInput}
                                    />
                                    {touched.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && <span style={{ color: 'red', fontSize: '0.8rem' }}>Invalid email</span>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Phone Number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="+91..."
                                        style={inputStyle}
                                        value={formData.phone}
                                        onChange={handleInput}
                                    />
                                    {touched.phone && formData.phone.length < 10 && <span style={{ color: 'red', fontSize: '0.8rem' }}>Invalid phone</span>}
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Topic</label>
                                <select name="topic" style={inputStyle} value={formData.topic} onChange={handleInput}>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Technical Support</option>
                                    <option value="partnership">Partnership / Sponsorship</option>
                                    <option value="careers">Careers</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Message</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    placeholder="How can we help?"
                                    style={{ ...inputStyle, resize: 'none' }}
                                    value={formData.message}
                                    onChange={handleInput}
                                />
                                {touched.message && !formData.message.trim() && <span style={{ color: 'red', fontSize: '0.8rem' }}>Message is required</span>}
                            </div>

                            <button type="submit" className="cta-button" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main >
    )
}
