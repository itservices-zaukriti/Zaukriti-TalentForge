'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function CommunityDashboard() {
    const [loading, setLoading] = useState(true)
    const [referrer, setReferrer] = useState<any>(null)
    const [stats, setStats] = useState({
        totalReferrals: 0,
        paidReferrals: 0,
        walletBalance: 0
    })
    const [ledger, setLedger] = useState<any[]>([])

    useEffect(() => {
        async function fetchDashboard() {
            setLoading(true)

            // 1. Get Current Session
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                setLoading(false)
                return
            }

            // 2. Fetch Referrer Profile
            const { data: profile } = await supabase
                .from('community_referrers')
                .select('*')
                .eq('email', session.user.email)
                .maybeSingle()

            if (profile) {
                setReferrer(profile)

                // 3. Fetch Referral Counts (Strictly Confirmed/Paid)
                const { count: confirmedCount } = await supabase
                    .from('community_referral_links')
                    .select('*', { count: 'exact', head: true })
                    .eq('community_referrer_id', profile.id)
                    .eq('status', 'confirmed')

                // 4. Fetch Ledger & Balance
                const { data: ledgerData } = await supabase
                    .from('community_wallet_ledger')
                    .select('*')
                    .eq('community_referrer_id', profile.id)
                    .order('created_at', { ascending: false })

                if (ledgerData) {
                    setLedger(ledgerData)
                    const balance = ledgerData.reduce((acc, curr) => {
                        return curr.type === 'credit' ? acc + curr.amount : acc - curr.amount;
                    }, 0)
                    setStats({
                        totalReferrals: 0, // Deprecated/Hidden
                        paidReferrals: confirmedCount || 0,
                        walletBalance: balance
                    })
                }
            }
            setLoading(false)
        }
        fetchDashboard()
    }, [])

    if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '100px' }}>Loading Dashboard...</div>

    if (!referrer) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="glass-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Partner Auth Required</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                        Please login with your institutional email to access the partner dashboard.
                    </p>
                    <Link href="/apply" className="cta-button" style={{ display: 'block', textDecoration: 'none' }}>
                        Go to Main Portal
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>{referrer.organization_name} Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Welcome back, {referrer.full_name} ({referrer.organization_type})</p>
                </div>
                <div style={{ background: 'rgba(255, 204, 51, 0.1)', border: '1px solid var(--accent-gold)', padding: '10px 20px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>Your Code</p>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{referrer.referral_code}</h3>
                </div>
            </header>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {[
                    { label: 'Successful Registrations', val: stats.paidReferrals, icon: '✅' },
                    { label: 'Wallet Balance', val: `₹${stats.walletBalance}`, icon: '💰' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card" style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>{stat.label}</p>
                                <h2 style={{ fontSize: '2rem' }}>{stat.val}</h2>
                            </div>
                            <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Program Notice */}
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '20px', borderRadius: '16px', marginBottom: '40px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Institutional Rewards</strong>: Credits are processed after the competition ends. Referral counts represent students currently in the pipeline.
                </p>
            </div>

            {/* Wallet Ledger */}
            <div className="glass-card" style={{ padding: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>Wallet History</h3>
                {ledger.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        No transactions found yet. Sharing your code will populate this ledger.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>DATE</th>
                                    <th style={{ padding: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>DESCRIPTION</th>
                                    <th style={{ padding: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TYPE</th>
                                    <th style={{ padding: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledger.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px', fontSize: '0.9rem' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px', fontSize: '0.9rem' }}>{item.description}</td>
                                        <td style={{ padding: '15px', fontSize: '0.9rem' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                background: item.type === 'credit' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: item.type === 'credit' ? '#22c55e' : '#ef4444'
                                            }}>
                                                {item.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', fontSize: '0.9rem', textAlign: 'right', fontWeight: 700 }}>₹{item.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    )
}
