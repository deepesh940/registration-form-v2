import { useState } from 'react';
import type { RegistrationState } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    updateData: (fields: Partial<RegistrationState>) => void;
    onNext: () => void;
}

export function Step1EmailCapture({ data, updateData, onNext }: Props) {
    const [email, setEmail] = useState(data.email);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        // Simulate sending OTP
        setShowOtp(true);
        updateData({ email });
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === '1234') { // Mock OTP validation
            updateData({ isEmailVerified: true });
            onNext();
        } else {
            setError('Invalid OTP. Please try 1234.');
        }
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Email Verification</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    Please enter your email to start your application.
                </p>
            </div>

            {!showOtp ? (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '380px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={{
                                position: 'absolute',
                                top: '-8px',
                                left: '10px',
                                background: 'white',
                                padding: '0 4px',
                                fontSize: '0.75rem',
                                color: '#999',
                                zIndex: 1
                            }}>
                                Email Address <span style={{ color: '#d89c3a' }}>*</span>
                            </label>
                            <input
                                type="email"
                                className="glass-input"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{ paddingTop: '12px', paddingBottom: '12px' }}
                            />
                        </div>
                    </div>

                    {error && <div style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                    <div className="form-actions" style={{ gap: '1rem', marginTop: '1rem' }}>
                        {/* Hidden back button to maintain consistent layout if needed, or simply one button */}
                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={!email || !/^\S+@\S+\.\S+$/.test(email)}>
                            Send Verification Code
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '380px', margin: '0 auto' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={{
                                position: 'absolute',
                                top: '-8px',
                                left: '10px',
                                background: 'white',
                                padding: '0 4px',
                                fontSize: '0.75rem',
                                color: '#999',
                                zIndex: 1
                            }}>
                                Enter OTP Code <span style={{ color: '#d89c3a' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="glass-input"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                required
                                maxLength={4}
                                style={{ paddingTop: '12px', paddingBottom: '12px', letterSpacing: '4px', textAlign: 'center', fontSize: '1.1rem' }}
                            />
                        </div>
                    </div>

                    {error && <div style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                    <div className="form-actions" style={{ gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            className="btn-secondary"
                            style={{ flex: 1, minWidth: 'auto' }}
                            onClick={() => {
                                setShowOtp(false);
                                setOtp('');
                                setError('');
                            }}
                        >
                            Change Email
                        </button>
                        <button type="submit" className="btn-primary" style={{ flex: 1, minWidth: 'auto' }} disabled={otp.length !== 4}>
                            Verify
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
