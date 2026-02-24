import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { RegistrationState } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    updateData: (fields: Partial<RegistrationState>) => void;
    onNext: () => void;
    onResume?: () => void;
}

export function Step1EmailCapture({ data, updateData, onNext, onResume }: Props) {
    const [email, setEmail] = useState(data.email);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [showResumePopup, setShowResumePopup] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (showOtp && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showOtp, resendTimer]);

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');

        if (email.toLowerCase() === 'john.smith@yopmail.com') {
            setShowResumePopup(true);
            return;
        }

        // Simulate sending OTP
        setShowOtp(true);
        setResendTimer(60);
        updateData({ email });
    };

    const handleResume = () => {
        updateData({
            email: 'john.smith@yopmail.com',
            isEmailVerified: true,
            firstName: 'John',
            lastName: 'Smith',
            birthday: '1985-06-15',
            gender: 'Male',
            maritalStatus: 'Married',
            motherMaidenName: 'Johnson',
            mobileNumber: '(555) 987-6543',
            isMobileVerified: true,
            address: {
                line1: '456 Oak Ave',
                line2: 'Suite 200',
                city: 'Phoenix',
                state: 'Arizona',
                zipCode: '85001',
                country: 'United States'
            },
            isAddressVerified: true,
            step: 3 // Jump to address information
        });
        setShowResumePopup(false);
        if (onResume) {
            onResume();
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === '1234') { // Mock OTP validation
            updateData({ isEmailVerified: true });
            onNext();
        } else {
            setError('Invalid OTP. Please try 1234.');
            setSuccessMessage('');
        }
    };

    const handleResendOtp = () => {
        if (resendTimer > 0) return;
        setError('');
        setOtp('');
        setSuccessMessage('A new verification code has been sent.');
        setResendTimer(60);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Registration Process</h2>
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
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 0.2rem' }}>
                                “A $5 identity verification deposit is required ($10 for joint accounts). This amount will be credited to your account after successful verification.”
                            </p>
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
                    <div style={{ textAlign: 'center', marginBottom: '-0.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                            Verification code sent to <strong>{email}</strong>
                        </p>
                    </div>

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

                    <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendTimer > 0}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: resendTimer > 0 ? '#999' : '#d89c3a',
                                cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                                fontSize: '0.85rem',
                                textDecoration: resendTimer > 0 ? 'none' : 'underline'
                            }}
                        >
                            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Didn't receive the code? Resend"}
                        </button>
                    </div>

                    {error && <div style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                    {successMessage && <div style={{ color: 'green', fontSize: '0.9rem', textAlign: 'center' }}>{successMessage}</div>}

                    <div className="form-actions" style={{ gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            className="btn-secondary"
                            style={{ flex: 1, minWidth: 'auto' }}
                            onClick={() => {
                                setShowOtp(false);
                                setOtp('');
                                setError('');
                                setSuccessMessage('');
                                setResendTimer(0);
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

            {/* Resume Application Popup */}
            {showResumePopup && createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div className="animate-fade-in" style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '100%',
                        position: 'relative',
                        textAlign: 'center'
                    }}>
                        <button
                            onClick={() => setShowResumePopup(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: 'var(--text-muted)'
                            }}
                        >
                            &times;
                        </button>

                        <div style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: 'var(--bg-top)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem auto',
                            color: 'white'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>

                        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>
                            Application Found
                        </h2>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                            It looks like you've already started an application using <strong>{email}</strong>. Would you like to resume where you left off?
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn-secondary" onClick={() => { setShowResumePopup(false); setShowOtp(true); updateData({ email }); }} style={{ flex: 1, minWidth: 'auto', fontSize: '0.85rem' }}>
                                Begin New
                            </button>
                            <button className="btn-primary" onClick={handleResume} style={{ flex: 1, minWidth: 'auto', fontSize: '0.85rem' }}>
                                Resume
                            </button>
                        </div>
                    </div>
                </div>
                , document.body)}
        </div>
    );
}
