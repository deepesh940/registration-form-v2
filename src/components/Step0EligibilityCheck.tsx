import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { RegistrationState } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    updateData: (fields: Partial<RegistrationState>) => void;
    onNext: () => void;
    onResume?: () => void;
}

export function Step0EligibilityCheck({ data, updateData, onNext, onResume }: Props) {
    const [isChecked, setIsChecked] = useState(false);
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showNotSurePopup, setShowNotSurePopup] = useState(false);
    const [showResumePopup, setShowResumePopup] = useState(false);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        // Use existing email field if they typed it, 
        // but technically it's re-asked in Step 1, 
        // so we just validate the checkbox here for flow purposes.
        if (!isChecked) {
            setError('Please confirm that you meet the requirements.');
            return;
        }

        if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');

        if (data.email.toLowerCase() === 'john.smith@yopmail.com') {
            setShowResumePopup(true);
            return;
        }

        onNext();
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
            isAddressVerified: true
        });

        setShowResumePopup(false);
        if (onResume) {
            onResume();
        } else {
            onNext();
        }
    };

    return (
        <>
            <div className="animate-fade-in" style={{ width: '100%', maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Becoming a Member is Easy
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>
                        Before we begin, review the items you'll need below.
                    </p>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: '500' }}>
                        Things you will need...
                    </h3>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-start', textAlign: 'left', width: 'fit-content', marginInline: 'auto' }}>

                        {[
                            "Social Security Number",
                            "Driver's License",
                            "Contact Information",
                            "Mother's Maiden Name",
                            "Valid Email Address"
                        ].map((item, index) => (
                            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: 'var(--bg-top)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div
                        onClick={() => setShowPopup(true)}
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            padding: '0.8rem',
                            marginBottom: '2rem',
                            color: '#2a3b5c', // Dark blue text from screenshot
                            fontWeight: '500',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Eligible to Join
                    </div>
                </div>

                <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={{
                                position: 'absolute',
                                top: '-8px',
                                left: '10px',
                                background: 'white',
                                padding: '0 4px',
                                fontSize: '0.75rem',
                                color: 'var(--bg-top)', // Mustard asterisk
                                zIndex: 1
                            }}>
                                Email Address <span style={{ color: 'var(--bg-top)' }}>*</span>
                            </label>
                            <input
                                type="email"
                                className="glass-input"
                                value={data.email}
                                onChange={e => updateData({ email: e.target.value })}
                                required
                                style={{ paddingTop: '12px', paddingBottom: '12px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', textAlign: 'left', marginTop: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="eligibility-check"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            style={{ marginTop: '4px', width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                        />
                        <label htmlFor="eligibility-check" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', cursor: 'pointer' }}>
                            To become a member of our credit union, you must meet the requirements above. If you qualify, please check this box and click 'Begin Application'.
                        </label>
                    </div>

                    <button type="button"
                        onClick={() => setShowNotSurePopup(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--bg-top)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            marginTop: '0.5rem'
                        }}
                    >
                        I'm not sure if I am eligible
                    </button>

                    {error && <div style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                    <div className="form-actions" style={{ marginTop: '1rem', paddingBottom: 0 }}>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%' }}
                            disabled={!isChecked || !data.email}
                        >
                            Begin Application
                        </button>
                    </div>
                </form>
            </div>
            {/* Eligibility Popup Modal */}
            {showPopup && createPortal(
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
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative',
                        textAlign: 'left'
                    }}>
                        <button
                            onClick={() => setShowPopup(false)}
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

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                            Requirements for Membership
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            <div>
                                <strong style={{ color: 'var(--bg-top)' }}>Individuals of African Descent</strong><br />
                                Anyone who identifies as part of the global African Diaspora—through heritage, ancestry, culture, or connection—is eligible for membership.
                            </div>

                            <div>
                                <strong style={{ color: 'var(--bg-top)' }}>Supporters of the African Diaspora Community</strong><br />
                                Individuals who share and support the mission, values, and advancement of the African Diaspora may also join, even if they are not of African descent.
                            </div>

                            <div>
                                <strong style={{ color: 'var(--bg-top)' }}>Family Members</strong><br />
                                Immediate family and household members of existing ADFCU members are eligible, including:
                                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
                                    <li>Spouses</li>
                                    <li>Children</li>
                                    <li>Parents</li>
                                    <li>Siblings</li>
                                    <li>Grandparents</li>
                                    <li>Grandchildren</li>
                                    <li>Household residents</li>
                                </ul>
                            </div>

                            <div>
                                <strong style={{ color: 'var(--bg-top)' }}>Organizations and Businesses</strong><br />
                                Organizations, nonprofits, churches, and businesses that serve, support, or advocate for the African Diaspora community may establish membership accounts.
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button className="btn-primary" onClick={() => setShowPopup(false)} style={{ padding: '0.5rem 2rem' }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
                , document.body)}

            {/* Not Sure Eligibility Popup Modal */}
            {showNotSurePopup && createPortal(
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
                        maxWidth: '500px',
                        width: '100%',
                        position: 'relative',
                        textAlign: 'left'
                    }}>
                        <button
                            onClick={() => setShowNotSurePopup(false)}
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

                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                            Not sure if you're eligible?
                        </h2>

                        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            If you are not sure if you meet the requirement for membership application with African Disporta Federal Credit Union please email <a href="mailto:Info@africandiaspofcu.org" style={{ color: 'var(--bg-top)', textDecoration: 'none', fontWeight: '500' }}>Info@africandiaspofcu.org</a>.
                        </p>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button className="btn-primary" onClick={() => setShowNotSurePopup(false)} style={{ padding: '0.5rem 2rem' }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
                , document.body)}

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

                        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                            Application Found
                        </h2>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                            It looks like you've already started an application using <strong>{data.email}</strong>. Would you like to resume where you left off?
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn-secondary" onClick={() => { setShowResumePopup(false); onNext(); }} style={{ flex: 1 }}>
                                Begin Application
                            </button>
                            <button className="btn-primary" onClick={handleResume} style={{ flex: 1 }}>
                                Resume Application
                            </button>
                        </div>
                    </div>
                </div>
                , document.body)}
        </>
    );
}
