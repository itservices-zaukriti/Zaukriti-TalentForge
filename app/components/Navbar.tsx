'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState('')
    const pathname = usePathname()

    // Handle scroll effect for glossiness & Active Section Spy
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)

            // ScrollSpy Logic (Only relevant on Home Page where sections exist)
            if (pathname === '/') {
                const sections = ['hackathon', 'tracks', 'vision', 'roadmap']
                let current = ''

                // Check Home first (top of page)
                if (window.scrollY < 300) {
                    current = ''
                } else {
                    for (const section of sections) {
                        const element = document.getElementById(section)
                        if (element) {
                            const rect = element.getBoundingClientRect()
                            // If top of section is within viewport (or close to header)
                            // Adjusted for smaller header
                            if (rect.top <= 120 && rect.bottom >= 120) {
                                current = section
                                break
                            }
                        }
                    }
                }
                setActiveSection(current)
            } else {
                setActiveSection('') // Reset on other pages
            }
        }

        window.addEventListener('scroll', handleScroll)
        // Initial check
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [pathname]) // Re-run effect when path changes

    const navLinks = [
        { name: 'Home', href: '/', id: '' },
        { name: 'Hackathon', href: '/#hackathon', id: 'hackathon' },
        { name: 'Tracks', href: '/#tracks', id: 'tracks' },
        { name: 'About', href: '/about', id: 'about-page' },
        { name: 'Vision', href: '/#vision', id: 'vision' },
        { name: 'Roadmap', href: '/#roadmap', id: 'roadmap' },
        { name: 'Contact', href: '/contact', id: 'contact-page' },
    ]

    const mobileExtraLinks = [
        { name: 'FAQs', href: '/faqs' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' }
    ]

    const isActive = (link: any) => {
        // Priority 1: ScrollSpy Match
        if (activeSection && link.id === activeSection) return true

        // Priority 2: Path Match using usePathname()
        if (pathname) {
            // FIX: If we are on Home page and scrolling (activeSection is set), 
            // the 'Home' link (href='/') should NOT be active just because pathname matches.
            if (pathname === '/' && activeSection && link.href === '/') return false

            // Special case for Home link on Home page when no section is active (Top of page)
            if (pathname === '/' && !activeSection && link.href === '/') return true

            // Exact path match for other pages
            if (link.href === pathname) return true
        }
        return false
    }

    return (
        <>
            <nav style={{
                padding: '0 var(--spacing-sm)',
                height: 'auto',
                minHeight: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: 'all 0.3s ease',
                paddingTop: '5px',
                paddingBottom: '5px',
                width: '100%'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 'var(--max-width)' }}>

                    {/* Logo Area */}
                    <Link href="/" style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                            <Image
                                src="/logo.png"
                                alt="Zaukriti Logo"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>

                        <div className="brand-stack" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                            <div className="brand-main" style={{ fontSize: '1rem', fontWeight: 700, color: '#2563EB' }}>Zaukriti AI</div>
                            <div className="brand-tagline" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Software Development</div>
                            <div className="brand-legal" style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Zaukriti Events Private Limited</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden-mobile" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                        {navLinks.map((link) => {
                            const active = isActive(link)
                            return (
                                <Link key={link.name} href={link.href} style={{
                                    color: active ? 'var(--brand-primary)' : 'var(--text-secondary)',
                                    fontWeight: 500,
                                    fontSize: '0.9rem',
                                    transition: 'color 0.2s',
                                    fontFamily: 'var(--font-inter)',
                                    borderBottom: active ? '2px solid var(--brand-primary)' : '2px solid transparent',
                                    paddingBottom: '2px'
                                }} className="hover:text-brand">
                                    {link.name}
                                </Link>
                            )
                        })}
                        <Link href="/apply" style={{
                            padding: '8px 20px',
                            background: 'var(--text-primary)',
                            color: 'white',
                            borderRadius: '50px',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            fontFamily: 'var(--font-inter)'
                        }}>
                            Register Now
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="hidden-desktop"
                        onClick={() => setIsMenuOpen(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                    >
                        <Menu size={24} color="var(--text-primary)" />
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div
                className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', position: 'fixed', zIndex: 2000 }}
            >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        style={{ background: 'var(--tertiary-bg)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                color: isActive(link) ? 'var(--brand-primary)' : 'var(--text-primary)',
                                borderBottom: '1px solid var(--glass-border)',
                                paddingBottom: '16px',
                                fontFamily: 'var(--font-inter)'
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {mobileExtraLinks.map(link => (
                            <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-inter)' }}>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <Link href="/apply" onClick={() => setIsMenuOpen(false)} className="cta-button" style={{ textAlign: 'center', marginTop: '20px' }}>
                        Register for Hackathon
                    </Link>
                </div>
            </div>

            {/* Backdrop */}
            {isMenuOpen && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 1999
                    }}
                />
            )}
        </>
    )
}
