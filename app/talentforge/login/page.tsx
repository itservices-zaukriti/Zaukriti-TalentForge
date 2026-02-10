'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [view, setView] = useState<'login' | 'setup'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password
            });

            if (authError) throw authError;

            const token = data.session?.access_token;

            const checkRes = await fetch('/api/user/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!checkRes.ok) {
                const checkData = await checkRes.json();
                await supabase.auth.signOut();
                throw new Error(checkData.error || 'Access validation failed');
            }

            router.push('/talentforge/dashboard');

        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message === 'Invalid login credentials'
                ? 'Invalid email or password. If this is your first time, please use "First Time Activation".'
                : err.message);
            setLoading(false);
        }
    };

    const handleSetup = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/talentforge/login`
                }
            });

            if (signUpError) throw signUpError;

            if (data.user && data.user.identities && data.user.identities.length === 0) {
                throw new Error("This email is already registered. Please log in.");
            }

            setSuccessMsg("Account created! Please check your email to confirm your address before logging in.");
            setView('login');

        } catch (err: any) {
            console.error("Setup Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid var(--glass-border)',
        marginTop: '8px',
        fontSize: '1rem',
        outline: 'none',
        background: 'rgba(255,255,255,0.8)'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: 'var(--text-secondary)'
    };

    return (
        <main style={{ minHeight: '100vh', background: 'var(--secondary-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--brand-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.8rem', fontWeight: 700, margin: '0 auto 24px', boxShadow: 'var(--shadow-md)' }}>Z</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {view === 'login' ? 'TalentForge Login' : 'Activate Account'}
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                    {view === 'login' ? 'Access your dashboard & timeline' : 'Set up password for your registered email'}
                </p>
            </div>

            <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '40px' }}>

                {error && (
                    <div style={{ marginBottom: '24px', background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'flex-start', border: '1px solid #fecaca' }}>
                        <div style={{ marginTop: '2px' }}><AlertCircle size={16} /></div>
                        <span>{error}</span>
                    </div>
                )}

                {successMsg && (
                    <div style={{ marginBottom: '24px', background: '#dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'flex-start', border: '1px solid #bbf7d0' }}>
                        <div style={{ marginTop: '2px' }}><CheckCircle size={16} /></div>
                        <span>{successMsg}</span>
                    </div>
                )}

                {view === 'login' ? (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Email address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                style={inputStyle}
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                style={inputStyle}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); alert("Use the standard Supabase recovery flow or contact support."); }} style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 500 }}>
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="cta-button"
                            style={{ width: '100%', marginTop: '8px' }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} style={{ display: 'inline' }} /> : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSetup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#1d4ed8', border: '1px solid #dbeafe', lineHeight: '1.4' }}>
                            Enter the email you used during registration. We will send a confirmation link to set your password.
                        </div>

                        <div>
                            <label style={labelStyle}>Registered Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                style={inputStyle}
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Create Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                style={inputStyle}
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                style={inputStyle}
                                value={form.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="cta-button"
                            style={{ width: '100%', marginTop: '8px' }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} style={{ display: 'inline' }} /> : 'Create Account'}
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <div style={{ position: 'relative', height: '1px', background: 'var(--glass-border)', marginBottom: '24px' }}>
                        <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 12px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>or</span>
                    </div>

                    <button
                        onClick={() => { setView(view === 'login' ? 'setup' : 'login'); setError(null); setSuccessMsg(null); }}
                        className="cta-button-secondary"
                        style={{ width: '100%', fontSize: '0.9rem' }}
                    >
                        {view === 'login' ? 'First time here? Activate Account' : 'Already have an account? Sign In'}
                    </button>
                </div>
            </div>
        </main>
    );
}
