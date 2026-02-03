import Link from 'next/link'
import { PLATFORM_CONFIG } from '../utils/config'

export default function PlatformPage() {
    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-md)', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--accent-gold)' }}>Zaukriti Experience OS</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>AI-Driven planning, layout, and cost optimization for high-impact events.</p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(255, 204, 51, 0.1)', border: '1px solid var(--accent-gold)', borderRadius: '20px', color: 'var(--accent-gold)' }}>Pilot Phase</span>
                    <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>AI Roadmap 2026</span>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-md)' }}>
                <section className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                        <h2 style={{ margin: 0 }}>Layout Intelligence</h2>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 700 }}>BETA</span>
                    </div>
                    <div style={{ background: '#1a1a20', height: '300px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', border: '1px dashed #444', position: 'relative' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p>[ AR/VR Layout Preview ]</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '10px', opacity: 0.6 }}>3D Visualization Engine Loading...</p>
                        </div>
                    </div>
                    <div style={{ marginTop: 'var(--spacing-sm)' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Hall / Stage Size (sq. ft.)</label>
                        <input type="number" placeholder="Enter size..." style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#0a0a0c', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                </section>

                <section className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                        <h2 style={{ margin: 0 }}>Budget Simulation</h2>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700 }}>PROTOTYPE</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {['Food & Beverage', 'Decoration', 'AV & Sound', 'Photography'].map(item => (
                            <div key={item} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                                <span>{item}</span>
                                <span style={{ color: 'var(--accent-gold)' }}>₹0.00</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', paddingTop: '10px' }}>
                            <span>Total Estimated</span>
                            <span style={{ color: 'var(--accent-gold)' }}>₹0.00</span>
                        </div>
                        <button className="cta-button" style={{ opacity: 0.5, cursor: 'not-allowed' }}>Optimize with AI (Coming Soon)</button>
                    </div>
                </section>
            </div>

            <section className="glass-card" style={{ marginTop: 'var(--spacing-md)', border: '1px dashed var(--accent-gold)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>AI Module Roadmap</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {[
                        { name: 'Vision AI (Crowd)', status: 'In Progress' },
                        { name: 'OCR Vendor Data', status: 'Pilot' },
                        { name: 'IoT Climate Sync', status: 'Roadmap' },
                        { name: 'Voice Concierge', status: 'In Progress' }
                    ].map(module => (
                        <div key={module.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <span style={{ fontWeight: 600 }}>{module.name}</span>
                            <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{module.status}</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
