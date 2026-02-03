export default function VendorsPage() {
    const categories = [
        'Chefs & Caterers', 'Decorators', 'Priests & Purohits',
        'Photography/Videography', 'Makeup Artists', 'Sound & Lighting',
        'Anchors & Performers', 'Rentals & Logistics'
    ];

    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-md)', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--accent-gold)' }}>Vendor Network</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Trusted partners for India’s premium event economy.</p>
            </header>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', overflowX: 'auto', paddingBottom: '20px', marginBottom: 'var(--spacing-lg)' }}>
                {categories.map(cat => (
                    <span key={cat} className="benefit-tag" style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>{cat}</span>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="glass-card">
                        <div style={{ background: '#222', height: '180px', borderRadius: '8px', marginBottom: 'var(--spacing-sm)' }}></div>
                        <h3>Premium Vendor {i}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                            Top-rated {categories[i % categories.length]} specializing in large scale corporate and wedding events.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--accent-gold)' }}>★★★★★ 4.9</span>
                            <button style={{ background: 'transparent', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>View Portfolio</button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
