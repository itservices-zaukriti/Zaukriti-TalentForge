'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProjectsIndex() {
    return (
        <main style={{ padding: '120px 20px 60px', textAlign: 'center', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Projects & Tracks</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                Explore our specialized tracks for the Zaukriti AI Hackathon.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
                {[
                    { id: 'ai-ml', title: 'AI & Intelligence Systems' },
                    { id: 'fullstack', title: 'Full-Stack Engineering' },
                    { id: 'iot', title: 'IoT & Smart Systems' },
                    { id: 'cloud', title: 'Cloud & DevOps' },
                    { id: 'marketing', title: 'Product & Growth' },
                    { id: 'fashion-tech', title: 'Fashion & Beauty Tech' }
                ].map(p => (
                    <Link key={p.id} href={`/projects/${p.id}`} className="glass-card" style={{ padding: '30px', textDecoration: 'none', color: 'inherit', fontWeight: 600, display: 'block' }}>
                        {p.title}
                    </Link>
                ))}
            </div>

            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '60px', color: 'var(--brand-primary)', fontWeight: 500 }}>
                <ArrowLeft size={20} /> Back to Home
            </Link>
        </main>
    )
}
