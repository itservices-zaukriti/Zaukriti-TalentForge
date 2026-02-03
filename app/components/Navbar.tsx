import Link from 'next/link'

export default function Navbar() {
    return (
        <nav style={{
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(5, 5, 16, 0.8)',
            backdropFilter: 'var(--glass-blur)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '1200px', gap: '40px' }}>
                <Link href="/" style={{
                    textDecoration: 'none',
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    marginRight: 'auto'
                }}>
                    <img src="/logo.png" alt="Zaukriti Logo" style={{ height: '35px', width: 'auto' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>ZAUKRITI</span>
                        <span style={{ color: '#fff', fontWeight: 800, opacity: 0.8 }}>—</span>
                        <span style={{ color: '#fff', fontWeight: 800, letterSpacing: '0.5px' }}>AI-DRIVEN DIGITAL APPLICATIONS</span>
                    </div>
                </Link>

                <div style={{ display: 'flex', gap: '25px' }}>
                    <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Home</Link>
                    <Link href="/about" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>About</Link>
                    <Link href="/contact" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Contact</Link>
                </div>
            </div>
        </nav>
    )
}
