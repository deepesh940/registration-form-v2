import type { RegistrationState } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
}

export function Step7Completion({ data }: Props) {
    return (
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>

            <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                border: '2px solid var(--success)'
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Application Submitted</h2>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
                Thank you for opening a bank account with us.<br />
                We will contact you soon for any further details.
            </p>

            <div style={{
                background: '#fafafa',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                textAlign: 'left',
                marginBottom: '2.5rem'
            }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Application Details</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Status</span>
                        <strong style={{ color: 'var(--bg-top)' }}>Under Review</strong>
                    </li>
                    {data.accountType === 'Joint' ? (
                        <>
                            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Primary Applicant</span>
                                <strong style={{ color: 'var(--text-main)' }}>{data.firstName} {data.lastName}</strong>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Secondary Applicant</span>
                                <strong style={{ color: 'var(--text-main)' }}>{data.secondaryApplicant?.firstName} {data.secondaryApplicant?.lastName}</strong>
                            </li>
                        </>
                    ) : (
                        <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Applicant</span>
                            <strong style={{ color: 'var(--text-main)' }}>{data.firstName} {data.lastName}</strong>
                        </li>
                    )}
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Email</span>
                        <strong style={{ color: 'var(--text-main)' }}>{data.email}</strong>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Verification</span>
                        <strong style={{ color: 'var(--success)' }}>Completed</strong>
                    </li>
                </ul>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.location.href = '/'}>
                Return to Home
            </button>

        </div>
    );
}
