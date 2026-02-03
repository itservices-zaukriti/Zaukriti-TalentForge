export default function TrackPage({ params }: { params: { slug: string } }) {
    const trackData: Record<string, any> = {
        'full-stack': {
            title: 'Full Stack Engineering',
            stack: 'Next.js, TypeScript, Supabase, Node.js',
            projects: ['Event Layout Engine', 'Vendor Dashboard', 'Order Tracking System']
        },
        'ai-ml': {
            title: 'AI / ML (OCR, NLP, RAG, Vision)',
            stack: 'Python, PyTorch, OpenAI API, LangChain',
            projects: ['OCR Data Extraction', 'NLU Intent Mapping', 'RAG Knowledge Bases']
        },
        'iot-sensors': {
            title: 'IoT & Edge Systems',
            stack: 'ESP32, Arduino, MQTT, Node-RED',
            projects: ['Smart Gaming Tables', 'Ambience Sensor Arrays', 'Fleet Tracking']
        },
        'marketing-ai': {
            title: 'Digital Marketing (AI-driven)',
            stack: 'Growth Hacking, AI Video, Meta/Google APIs',
            projects: ['Viral Loop Automation', 'AI Ad Generator', 'Sentiment Analytics']
        },
        'product-ux': {
            title: 'Product & UX',
            stack: 'Figma, User Research, Product Strategy',
            projects: ['Experience Architecture', 'Module Strategy', 'User Testing']
        }
    };

    const track = trackData[params.slug] || { title: 'Specialization Track', stack: 'Zaukriti Ecosystem', projects: ['Coming Soon'] };

    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-md)', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--accent-gold)', marginBottom: 'var(--spacing-sm)' }}>{track.title}</h1>

            <section className="glass-card" style={{ marginBottom: 'var(--spacing-md)' }}>
                <h3>Tools & Stack</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>{track.stack}</p>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <div className="glass-card">
                    <h3>Hackathon Focus</h3>
                    <ul style={{ marginTop: '10px', marginLeft: '20px', color: 'var(--text-secondary)' }}>
                        {(track.projects || []).map((p: string) => <li key={p}>{p}</li>)}
                    </ul>
                </div>
                <div className="glass-card">
                    <h3>What we look for</h3>
                    <ul style={{ marginTop: '10px', marginLeft: '20px', color: 'var(--text-secondary)' }}>
                        <li>Real built-something proof</li>
                        <li>Technical depth in {track.title}</li>
                        <li>Product mindset & ownership</li>
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
                <a href="/apply" className="cta-button">Apply for {track.title}</a>
            </div>
        </main>
    )
}
