import { useState } from 'react';
import type { RegistrationState } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    updateData: (fields: Partial<RegistrationState>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function Step2BasicInfo({ data, updateData, onNext, onPrev }: Props) {
    const [showMobileOtp, setShowMobileOtp] = useState(data.isMobileVerified);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const formatPhoneNumber = (value: string) => {
        // Remove all non-digits
        const cleaned = ('' + value).replace(/\D/g, '');

        // Format as (XXX) XXX-XXXX
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
        return value;
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.isMobileVerified && !showMobileOtp) {
            // US Format is 14 characters: (XXX) XXX-XXXX
            if (!data.mobileNumber || data.mobileNumber.length !== 14) {
                setError('Please enter a valid 10-digit US mobile number.');
                return;
            }
            setError('');
            setShowMobileOtp(true); // Simulate OTP sent
            return;
        }

        if (showMobileOtp && !data.isMobileVerified) {
            if (otp === '1234') { // Mock OTP logic
                updateData({ isMobileVerified: true });
                setShowMobileOtp(false);
            } else {
                setError('Invalid OTP. Please try 1234.');
                return;
            }
        }

        // if all valid and verified, go next
        if (data.isMobileVerified || otp === '1234') {
            onNext();
        }
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Basic Information</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    Please provide your personal details to continue.
                </p>
            </div>

            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '450px', margin: '0 auto' }}>

                {/* Profile Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>First Name <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input type="text" className="glass-input" value={data.firstName} onChange={e => updateData({ firstName: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Last Name <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input type="text" className="glass-input" value={data.lastName} onChange={e => updateData({ lastName: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Middle Name</label>
                        <input type="text" className="glass-input" value={data.middleName} onChange={e => updateData({ middleName: e.target.value })} style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Birthday <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input type="date" className="glass-input" value={data.birthday} onChange={e => updateData({ birthday: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px', color: data.birthday ? 'inherit' : '#999' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Gender <span style={{ color: '#d89c3a' }}>*</span></label>
                        <select className="glass-input" value={data.gender} onChange={e => updateData({ gender: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px', color: data.gender ? 'inherit' : '#999' }}>
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Marital Status <span style={{ color: '#d89c3a' }}>*</span></label>
                        <select className="glass-input" value={data.maritalStatus} onChange={e => updateData({ maritalStatus: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px', color: data.maritalStatus ? 'inherit' : '#999' }}>
                            <option value="" disabled>Select Marital Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>

                    <div style={{ position: 'relative', gridColumn: '1 / -1' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Mother's Maiden Name <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input type="text" className="glass-input" value={data.motherMaidenName} onChange={e => updateData({ motherMaidenName: e.target.value })} required style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                    </div>
                </div>

                <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

                {/* Contact Info */}
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', textAlign: 'center' }}>Contact Details</h3>

                {!data.isMobileVerified && !showMobileOtp && (
                    <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto', width: '100%' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Mobile Number <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input
                            type="tel"
                            className="glass-input"
                            value={data.mobileNumber}
                            onChange={e => updateData({ mobileNumber: formatPhoneNumber(e.target.value) })}
                            placeholder="(123) 456-7890"
                            maxLength={14}
                            required
                            style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'center' }}
                        />
                    </div>
                )}

                {showMobileOtp && !data.isMobileVerified && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <label style={{ color: 'var(--bg-top)', fontSize: '0.9rem', fontWeight: 'bold' }}>Verify Mobile: {data.mobileNumber}</label>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                            <input type="text" className="glass-input" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 4-digit OTP (1234)" maxLength={4} required style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'center', letterSpacing: '2px' }} />
                        </div>
                    </div>
                )}

                {data.isMobileVerified && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--success)', padding: '0.5rem 0', fontWeight: '500' }}>
                        ✓ Mobile Verified
                    </div>
                )}

                {error && <div style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <div className="form-actions" style={{ gap: '1rem' }}>
                    <button type="button" className="btn-secondary" style={{ flex: 1, minWidth: 'auto' }} onClick={onPrev}>
                        Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 1, minWidth: 'auto' }} disabled={
                        (!data.isMobileVerified && !showMobileOtp) ?
                            !(data.firstName && data.lastName && data.birthday && data.gender && data.maritalStatus && data.motherMaidenName && data.mobileNumber && data.mobileNumber.length === 14) :
                            (!data.isMobileVerified && showMobileOtp) ?
                                (otp.length !== 4) :
                                !(data.firstName && data.lastName && data.birthday && data.gender && data.maritalStatus && data.motherMaidenName)
                    }>
                        {(!data.isMobileVerified && !showMobileOtp) ? 'Verify Mobile' : 'Next'}
                    </button>
                </div>
            </form>
        </div>
    );
}
