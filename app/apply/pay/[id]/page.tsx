'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Script from 'next/script';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResumePaymentPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [applicant, setApplicant] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!id) return;
        async function fetchStatus() {
            try {
                // Fetch public status
                const { data, error } = await supabase
                    .from('applicants')
                    .select('id, full_name, email, phone, payment_status, amount_paid, track') // minimal fields
                    .eq('id', id)
                    .single();

                if (error || !data) {
                    console.error("Fetch error", error);
                    // Handle error (maybe restricted RLS? Using public lookup logic might be needed if user is not logged in)
                    // If RLS blocks read, we might need a server action or API route to check status publicly.
                    // Assuming RLS allows users to read their own rows? But unauthenticated?
                    // WE MIGHT NEED AN API PROXY HERE.
                    // For now, let's try direct. If it fails, move to API.

                    // Actually, unauthenticated users likely CANNOT select from 'applicants' unless RLS has policy.
                    // The standard pattern is `applicant_id` is secret enough? No.
                    // Let's use an API Endpoint to get "Safe Payment Context".
                    const res = await fetch(`/api/payment-context?id=${id}`);
                    if (res.ok) {
                        const safeData = await res.json();
                        setApplicant(safeData);
                    } else {
                        throw new Error('Could not load application');
                    }
                } else {
                    setApplicant(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchStatus();
    }, [id]);

    const handlePayNow = async () => {
        setProcessing(true);
        try {
            // Re-create Order
            const orderRes = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamSize: 1, // Defaulting to 1 for resume? OR fetch from applicant?
                    // We need to know the team size to calculate amount.
                    // The API /api/payment-context should return amount_paid (which is total).
                    // But /api/razorpay/order calculates fresh? No, we should respect the stored amount.
                    // Let's assume we pass a flag `resume: true`?
                    // Or better: The /api/razorpay/order logic recalculates.
                    // If we pass `applicantId`, it should fetch the specific record and create order for IT.
                    applicantId: applicant.id,
                    email: applicant.email
                })
            });

            const orderData = await orderRes.json()
            if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed')

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Zaukriti TalentForge",
                description: `Resume Application: ${applicant.track}`,
                order_id: orderData.id,
                prefill: {
                    name: applicant.full_name,
                    email: applicant.email,
                    contact: applicant.phone
                },
                theme: { color: "#6366f1" },
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                payment_id: response.razorpay_payment_id,
                                order_id: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                                applicant_id: applicant.id
                            })
                        })

                        const verifyData = await verifyRes.json()
                        if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed')

                        // Success -> Refresh
                        setApplicant((prev: any) => ({ ...prev, payment_status: 'Paid' }));

                    } catch (e: any) {
                        alert("Verification Failed: " + e.message)
                    }
                },
            };

            if (window.Razorpay) {
                const rzp1 = new window.Razorpay(options)
                rzp1.open()
            } else {
                alert('Payment gateway failed to load.')
            }

        } catch (e: any) {
            alert(e.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Loader2 className="animate-spin" /> Loading...</div>;

    if (!applicant) return <div style={{ padding: 50, textAlign: 'center' }}>Application not found.</div>;

    if (applicant.payment_status === 'Paid') {
        return (
            <div style={{ maxWidth: 500, margin: '50px auto', padding: 20, textAlign: 'center' }} className="glass-card">
                <CheckCircle size={50} color="green" style={{ margin: '0 auto 20px' }} />
                <h2>Registration Complete</h2>
                <p>Welcome, {applicant.full_name}. You are all set.</p>
                <div style={{ marginTop: 20, padding: 15, background: '#f0fdf4', borderRadius: 8 }}>
                    <strong>Status: Paid & Confirmed</strong>
                </div>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 500, margin: '50px auto', padding: 30 }} className="glass-card">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <h1 style={{ fontSize: '1.5rem', marginBottom: 20, fontWeight: 700 }}>Complete Registration</h1>

            <div style={{ marginBottom: 20 }}>
                <p style={{ color: 'var(--text-secondary)' }}>Hi <strong>{applicant.full_name}</strong>,</p>
                <p style={{ color: 'var(--text-secondary)' }}>Your application for <strong>{applicant.track}</strong> is saved but payment is pending.</p>
            </div>

            <div style={{ background: '#fffbeb', padding: 15, borderRadius: 8, border: '1px solid #fcd34d', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={20} color="#d97706" />
                <span style={{ color: '#d97706', fontWeight: 500 }}>Payment Pending</span>
            </div>

            <button
                onClick={handlePayNow}
                disabled={processing}
                className="cta-button"
                style={{ width: '100%' }}
            >
                {processing ? 'Processing...' : `Pay Now`}
            </button>
        </div>
    );
}
