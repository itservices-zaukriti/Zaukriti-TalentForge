export default function AdminDashboard() {
    const applicants = [
        { id: 1, name: 'Rahul Sharma', track: 'Full Stack', status: 'New', score: 85, payment: 'Success', amount: 1199 },
        { id: 2, name: 'Priya Verma', track: 'AI/ML', status: 'Screening', score: 92, payment: 'Success', amount: 1999 },
        { id: 3, name: 'Aditya Singh', track: 'Cloud', status: 'Shortlisted', score: 88, payment: 'Pending', amount: 1199 }
    ];

    return (
        <main style={{ padding: 'var(--spacing-lg) var(--spacing-md)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Applicants</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>1,240</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Revenue (INR)</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>₹14.8L</div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 'var(--spacing-md)' }}>
                {/* Filters */}
                <aside className="glass-card" style={{ height: 'fit-content' }}>
                    <h3>Filters</h3>
                    <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label>Track</label>
                        <select style={adminInputStyle}>
                            <option>All Tracks</option>
                            <option>Full Stack</option>
                            <option>AI/ML</option>
                        </select>
                        <label>Application Status</label>
                        <select style={adminInputStyle}>
                            <option>All Status</option>
                            <option>New</option>
                            <option>Screening</option>
                            <option>Shortlisted</option>
                        </select>
                        <label>Payment Status</label>
                        <select style={adminInputStyle}>
                            <option>All</option>
                            <option>Success</option>
                            <option>Pending</option>
                        </select>
                    </div>
                </aside>

                {/* Application List */}
                <section className="glass-card">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
                                <th style={{ padding: '10px' }}>Applicant</th>
                                <th>Track</th>
                                <th>Payment</th>
                                <th>Pipeline</th>
                                <th>Score</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '15px 10px' }}>
                                        <div>{app.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>₹{app.amount}</div>
                                    </td>
                                    <td>{app.track}</td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: app.payment === 'Success' ? '#2ecc71' : '#f1c40f'
                                        }}>
                                            ● {app.payment}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            background: app.status === 'Shortlisted' ? '#2ecc7133' : '#3498db33',
                                            color: app.status === 'Shortlisted' ? '#2ecc71' : '#3498db',
                                            fontSize: '0.8rem'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>{app.score}</td>
                                    <td>
                                        <button style={{ background: 'transparent', border: '1px solid #444', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </main>
    )
}

const adminInputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    background: '#0a0a0c',
    border: '1px solid #333',
    color: 'white'
}
