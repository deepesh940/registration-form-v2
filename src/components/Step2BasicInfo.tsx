import { useState, useEffect } from 'react';
import type { RegistrationState, ApplicantDetails } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    updateData: (fields: Partial<RegistrationState>) => void;
    onNext: () => void;
    onPrev: () => void;
}

const countryCodes = [
    { code: '+1', name: 'USA/Canada' },
    { code: '+44', name: 'UK' },
    { code: '+61', name: 'Australia' },
    { code: '+91', name: 'India' },
    { code: '+65', name: 'Singapore' },
    { code: '+852', name: 'Hong Kong' },
    { code: '+971', name: 'UAE' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+81', name: 'Japan' },
];

export function Step2BasicInfo({ data, updateData, onNext, onPrev }: Props) {
    const [showMobileOtp, setShowMobileOtp] = useState(data.isMobileVerified);
    const [showSecondaryOtp, setShowSecondaryOtp] = useState(data.secondaryApplicant?.isMobileVerified || false);
    const [otp, setOtp] = useState('');
    const [secondaryOtp, setSecondaryOtp] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [secondaryResendTimer, setSecondaryResendTimer] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (showMobileOtp && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showMobileOtp, resendTimer]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (showSecondaryOtp && secondaryResendTimer > 0) {
            interval = setInterval(() => {
                setSecondaryResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showSecondaryOtp, secondaryResendTimer]);

    const formatPhoneNumber = (value: string, countryCode: string) => {
        // Only apply special formatting for US/Canada (+1)
        if (countryCode === '+1') {
            const cleaned = ('' + value).replace(/\D/g, '');
            const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
            if (match) {
                let formatted = '';
                if (match[1]) {
                    formatted = `(${match[1]}`;
                    if (match[2]) {
                        formatted += `) ${match[2]}`;
                        if (match[3]) {
                            formatted += `-${match[3]}`;
                        }
                    }
                }
                return formatted;
            }
        }
        // For other countries, just keep digits and allowed symbols for now
        return value.replace(/[^\d\s\-()+]/g, '');
    };

    const renderApplicantFields = (
        title: string,
        applicantData: ApplicantDetails,
        isSecondary: boolean,
        showOtpLocal: boolean,
        otpLocal: string,
        setOtpLocal: (otp: string) => void,
        resendTimerLocal: number,
        handleResendOtpLocal: () => void,
        isVerified: boolean
    ) => {
        const updateField = (fields: Partial<ApplicantDetails>) => {
            if (isSecondary) {
                updateData({
                    secondaryApplicant: {
                        ...data.secondaryApplicant!,
                        ...fields
                    }
                });
            } else {
                updateData(fields);
            }
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--bg-top)', fontWeight: '700', borderBottom: '2px solid rgba(216, 156, 58, 0.1)', paddingBottom: '0.5rem' }}>
                    {title}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>First Name <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input type="text" className="glass-input" value={applicantData.firstName} onChange={e => updateField({ firstName: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Middle Name</label>
                        <input type="text" className="glass-input" value={applicantData.middleName} onChange={e => updateField({ middleName: e.target.value })} style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Last Name <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input type="text" className="glass-input" value={applicantData.lastName} onChange={e => updateField({ lastName: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Birthday <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input type="date" className="glass-input" value={applicantData.birthday} onChange={e => updateField({ birthday: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px', color: applicantData.birthday ? 'inherit' : '#999' }} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Gender <span style={{ color: '#d89c3a' }}>*</span></label>
                        <select className="glass-input" value={applicantData.gender} onChange={e => updateField({ gender: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Marital Status <span style={{ color: '#d89c3a' }}>*</span></label>
                        <select className="glass-input" value={applicantData.maritalStatus} onChange={e => updateField({ maritalStatus: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                            <option value="" disabled>Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                        </select>
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Mother's Maiden Name <span style={{ color: '#d89c3a' }}>*</span></label>
                    <input type="text" className="glass-input" value={applicantData.motherMaidenName} onChange={e => updateField({ motherMaidenName: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                </div>

                {!isVerified && !showOtpLocal && (
                    <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                        <div style={{ position: 'relative', flex: '0 0 85px' }}>
                            <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Code</label>
                            <select
                                className="glass-input"
                                value={applicantData.countryCode}
                                onChange={e => updateField({ countryCode: e.target.value })}
                                style={{ paddingTop: '10px', paddingBottom: '10px', fontSize: '0.9rem' }}
                            >
                                {countryCodes.map(c => (
                                    <option key={c.code} value={c.code}>{c.code}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Mobile Number <span style={{ color: '#d89c3a' }}>*</span></label>
                            <input
                                type="tel"
                                className="glass-input"
                                value={applicantData.mobileNumber}
                                onChange={e => updateField({ mobileNumber: formatPhoneNumber(e.target.value, applicantData.countryCode) })}
                                placeholder="Mobile Number"
                                required
                                style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'left' }}
                            />
                        </div>
                    </div>
                )}

                {showOtpLocal && !isVerified && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <label style={{ color: 'var(--bg-top)', fontSize: '0.9rem', fontWeight: 'bold' }}>Verify Mobile: {applicantData.countryCode} {applicantData.mobileNumber}</label>
                        <input type="text" className="glass-input" value={otpLocal} onChange={e => setOtpLocal(e.target.value)} placeholder="OTP (1234)" maxLength={4} required style={{ maxWidth: '200px', textAlign: 'center' }} />
                        <button type="button" onClick={handleResendOtpLocal} disabled={resendTimerLocal > 0} style={{ background: 'none', border: 'none', color: resendTimerLocal > 0 ? '#999' : '#d89c3a', cursor: 'pointer', fontSize: '0.85rem' }}>
                            {resendTimerLocal > 0 ? `Resend in ${resendTimerLocal}s` : "Resend Code"}
                        </button>
                    </div>
                )}

                {isVerified && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--success)', padding: '0.5rem 0', fontWeight: '500' }}>
                        ✓ {title} Verified
                    </div>
                )}
            </div>
        );
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        // Primary Applicant Verification logic
        if (!data.isMobileVerified && !showMobileOtp) {
            if (!data.mobileNumber || data.mobileNumber.length < 7) {
                setError('Please enter a valid primary applicant mobile number.');
                return;
            }
            setShowMobileOtp(true);
            setResendTimer(60);
            setSuccessMessage('A verification code has been sent to the primary applicant.');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }

        if (showMobileOtp && !data.isMobileVerified) {
            if (otp === '1234') {
                updateData({ isMobileVerified: true });
                setShowMobileOtp(false);
                setResendTimer(0);
                setSuccessMessage('');
            } else {
                setError('Invalid OTP for primary applicant. Please try 1234.');
                return;
            }
        }

        // Secondary Applicant Verification logic (if Joint)
        if (data.accountType === 'Joint') {
            if (!data.secondaryApplicant!.isMobileVerified && !showSecondaryOtp) {
                if (!data.secondaryApplicant!.mobileNumber || data.secondaryApplicant!.mobileNumber.length < 7) {
                    setError('Please enter a valid secondary applicant mobile number.');
                    return;
                }
                setShowSecondaryOtp(true);
                setSecondaryResendTimer(60);
                setSuccessMessage('A verification code has been sent to the secondary applicant.');
                setTimeout(() => setSuccessMessage(''), 3000);
                return;
            }

            if (showSecondaryOtp && !data.secondaryApplicant!.isMobileVerified) {
                if (secondaryOtp === '1234') {
                    updateData({
                        secondaryApplicant: {
                            ...data.secondaryApplicant!,
                            isMobileVerified: true
                        }
                    });
                    setShowSecondaryOtp(false);
                    setSecondaryResendTimer(0);
                    setSuccessMessage('');
                } else {
                    setError('Invalid OTP for secondary applicant. Please try 1234.');
                    return;
                }
            }
        }

        // Final Validation
        const isPrimaryValid = data.firstName && data.lastName && data.birthday && data.gender && data.maritalStatus && data.motherMaidenName && data.isMobileVerified;
        const isSecondaryValid = data.accountType !== 'Joint' || (
            data.secondaryApplicant?.firstName &&
            data.secondaryApplicant?.lastName &&
            data.secondaryApplicant?.birthday &&
            data.secondaryApplicant?.gender &&
            data.secondaryApplicant?.maritalStatus &&
            data.secondaryApplicant?.motherMaidenName &&
            data.secondaryApplicant?.isMobileVerified
        );

        if (isPrimaryValid && isSecondaryValid) {
            onNext();
        } else if (!isPrimaryValid) {
            setError('Please complete and verify all primary applicant details.');
        } else {
            setError('Please complete and verify all secondary applicant details.');
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
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', color: 'var(--text-main)', fontWeight: '700' }}>Registration Process</h1>
                <div style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#999', fontWeight: 'bold' }}>Registered Email Address:</span>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>{data.email}</p>
                </div>

                {/* Account Type Selection */}
                <div style={{ textAlign: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--bg-top)', fontWeight: '700' }}>Account Type Selection</span>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginBottom: '1.5rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    borderRadius: '8px',
                    width: 'fit-content',
                    margin: '0 auto 1.5rem auto'
                }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        <input
                            type="radio"
                            name="accountType"
                            value="Single"
                            checked={data.accountType === 'Single'}
                            onChange={() => updateData({ accountType: 'Single' })}
                            style={{ accentColor: 'var(--bg-top)' }}
                        />
                        Single Account
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        <input
                            type="radio"
                            name="accountType"
                            value="Joint"
                            checked={data.accountType === 'Joint'}
                            onChange={() => updateData({ accountType: 'Joint' })}
                            style={{ accentColor: 'var(--bg-top)' }}
                        />
                        Joint Account
                    </label>
                </div>

                {/* Dynamic Note based on Account Type */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '-1rem',
                    marginBottom: '1.5rem',
                    padding: '0 1rem'
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic',
                        lineHeight: '1.4'
                    }}>
                        {data.accountType === 'Single' ? (
                            <>
                                <span style={{ fontWeight: '600' }}>$5 verification deposit total</span>
                                <br />
                                Applicant must complete verification
                            </>
                        ) : (
                            <>
                                <span style={{ fontWeight: '600' }}>$10 verification deposit total</span>
                                <br />
                                Both applicants must complete verification
                                <br />
                                Multiple addresses allowed
                            </>
                        )}
                    </p>
                </div>

                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Basic Information</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    Please provide your personal details to continue.
                </p>
            </div>

            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '450px', margin: '0 auto' }}>
                {renderApplicantFields(
                    data.accountType === 'Joint' ? "Primary Applicant" : "Applicant Details",
                    data,
                    false,
                    showMobileOtp,
                    otp,
                    setOtp,
                    resendTimer,
                    handleResendOtp,
                    data.isMobileVerified
                )}

                {data.accountType === 'Joint' && data.secondaryApplicant && renderApplicantFields(
                    "Secondary Applicant",
                    data.secondaryApplicant,
                    true,
                    showSecondaryOtp,
                    secondaryOtp,
                    setSecondaryOtp,
                    secondaryResendTimer,
                    () => {
                        if (secondaryResendTimer > 0) return;
                        setSecondaryOtp('');
                        setSecondaryResendTimer(60);
                        setSuccessMessage('A new verification code has been sent.');
                        setTimeout(() => setSuccessMessage(''), 3000);
                    },
                    data.secondaryApplicant.isMobileVerified
                )}

                {error && <div style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
                {successMessage && <div style={{ color: 'green', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>{successMessage}</div>}

                <div className="form-actions" style={{ gap: '1rem' }}>
                    <button type="button" className="btn-secondary" style={{ flex: 1, minWidth: 'auto' }} onClick={onPrev}>
                        Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 1, minWidth: 'auto' }}>
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}
