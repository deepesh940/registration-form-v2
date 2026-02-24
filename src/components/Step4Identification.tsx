import { useState } from 'react';
import type { RegistrationState, ApplicantDetails } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    updateData: (fields: Partial<RegistrationState>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function Step4Identification({ data, updateData, onNext, onPrev }: Props) {
    const [error, setError] = useState('');
    const [primarySsnFocused, setPrimarySsnFocused] = useState(false);
    const [secondarySsnFocused, setSecondarySsnFocused] = useState(false);
    const countries = [
        "Nigeria",
        "Ethiopia",
        "Egypt",
        "DR Congo",
        "Tanzania",
        "South Africa",
        "Kenya",
        "Uganda",
        "Algeria",
        "Sudan",
        "Morocco",
        "Angola",
        "Ghana",
        "Ivory Coast"
    ];

    const formatSsn = (val: string) => {
        const cleaned = (val || '').replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,2})(\d{0,4})$/);
        if (match) {
            let res = match[1];
            if (match[2]) res += `-${match[2]}`;
            if (match[3]) res += `-${match[3]}`;
            return res;
        }
        return val;
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        const validateApplicant = (applicant: ApplicantDetails, label: string) => {
            if (!applicant.idType || !applicant.idNumber || !applicant.idIssueCountry || !applicant.idDocument) {
                return `Please provide identification details for ${label}.`;
            }
            if (applicant.isUsCitizen && (!applicant.ssn || applicant.ssn.length !== 11)) {
                return `A valid 9-digit SSN is required for ${label}.`;
            }
            return null;
        };

        const primaryError = validateApplicant(data, data.accountType === 'Joint' ? 'Primary Applicant' : 'Applicant');
        if (primaryError) {
            setError(primaryError);
            return;
        }

        if (data.accountType === 'Joint' && data.secondaryApplicant) {
            const secondaryError = validateApplicant(data.secondaryApplicant, 'Secondary Applicant');
            if (secondaryError) {
                setError(secondaryError);
                return;
            }
        }

        setError('');
        onNext();
    };

    const renderIdFields = (
        title: string,
        applicant: ApplicantDetails,
        isSecondary: boolean,
        isSsnFocused: boolean,
        setIsSsnFocused: (focused: boolean) => void
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
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--bg-top)', fontWeight: '700', borderBottom: '2px solid rgba(216, 156, 58, 0.1)', paddingBottom: '0.5rem' }}>
                    {title}
                </h3>

                <div style={{ position: 'relative' }}>
                    <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Issue Country <span style={{ color: '#d89c3a' }}>*</span></label>
                    <select
                        className="glass-input"
                        value={applicant.idIssueCountry || ''}
                        onChange={e => updateField({ idIssueCountry: e.target.value })}
                        required
                        style={{ paddingTop: '12px', paddingBottom: '12px', color: applicant.idIssueCountry ? 'inherit' : '#999', fontSize: applicant.idIssueCountry ? '0.95rem' : '0.8rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                    >
                        <option value="" disabled>Select Issue Country</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>ID Type <span style={{ color: '#d89c3a' }}>*</span></label>
                        <select
                            className="glass-input"
                            value={applicant.idType || ''}
                            onChange={e => updateField({ idType: e.target.value })}
                            required
                            style={{ paddingTop: '12px', paddingBottom: '12px', color: applicant.idType ? 'inherit' : '#999', fontSize: applicant.idType ? '0.95rem' : '0.8rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                        >
                            <option value="">Select ID Type</option>
                            <option value="National ID">National ID</option>
                            <option value="Passport">Passport</option>
                            <option value="Driver's License">Driver's License</option>
                            <option value="Military ID">Military ID</option>
                            <option value="Voter ID">Voter ID</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>ID Number <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input
                            type="text"
                            className="glass-input"
                            value={applicant.idNumber}
                            onChange={e => updateField({ idNumber: e.target.value })}
                            required
                            style={{ paddingTop: '12px', paddingBottom: '12px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Upload Document <span style={{ color: '#d89c3a' }}>*</span></label>
                        <div className="glass-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', cursor: 'pointer' }} onClick={() => document.getElementById(`id-upload-${isSecondary ? 'sec' : 'pri'}`)?.click()}>
                            <span style={{ color: applicant.idDocument ? 'inherit' : '#999', fontSize: applicant.idDocument ? '0.9rem' : '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {applicant.idDocument ? applicant.idDocument : 'Choose file...'}
                            </span>
                            <input
                                id={`id-upload-${isSecondary ? 'sec' : 'pri'}`}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        updateField({ idDocument: file.name });
                                    }
                                }}
                            />
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                    <label style={{ color: '#666', fontSize: '0.85rem' }}>U.S. Citizen <span style={{ color: '#d89c3a' }}>*</span></label>

                    <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, color: 'var(--text-main)' }}>
                            <input
                                type="radio"
                                name={`usCitizen-${isSecondary ? 'sec' : 'pri'}`}
                                checked={applicant.isUsCitizen === true}
                                onChange={() => updateField({ isUsCitizen: true })}
                                style={{ margin: 0, width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                            />
                            Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, color: 'var(--text-main)' }}>
                            <input
                                type="radio"
                                name={`usCitizen-${isSecondary ? 'sec' : 'pri'}`}
                                checked={applicant.isUsCitizen === false}
                                onChange={() => {
                                    updateField({ isUsCitizen: false, ssn: '' });
                                }}
                                style={{ margin: 0, width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                            />
                            No
                        </label>
                    </div>

                    {applicant.isUsCitizen && (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <div style={{ position: 'relative' }}>
                                <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>SSN / Tax ID <span style={{ color: '#d89c3a' }}>*</span></label>
                                <input
                                    type="text"
                                    className="glass-input"
                                    value={isSsnFocused ? (applicant.ssn || '') : (applicant.ssn ? applicant.ssn.replace(/\d/g, '*') : '')}
                                    onFocus={() => setIsSsnFocused(true)}
                                    onBlur={() => setIsSsnFocused(false)}
                                    onChange={e => updateField({ ssn: formatSsn(e.target.value) })}
                                    required={applicant.isUsCitizen}
                                    placeholder="(XXX-XX-XXXX)"
                                    maxLength={11}
                                    style={{ paddingTop: '12px', paddingBottom: '12px', width: '100%' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Identification & Citizenship</h2>
            </div>

            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '450px', margin: '0 auto' }}>
                {renderIdFields(
                    data.accountType === 'Joint' ? "Primary Applicant's Identification" : "Identification & Citizenship",
                    data,
                    false,
                    primarySsnFocused,
                    setPrimarySsnFocused
                )}

                {data.accountType === 'Joint' && data.secondaryApplicant && renderIdFields(
                    "Secondary Applicant's Identification",
                    data.secondaryApplicant,
                    true,
                    secondarySsnFocused,
                    setSecondarySsnFocused
                )}

                {error && <div style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    lineHeight: '1.4',
                    padding: '0 1rem'
                }}>
                    A $5 identity verification deposit is required ($10 for joint accounts). This amount will be credited to your account after successful verification.
                </p>

                <div className="form-actions" style={{ gap: '1rem' }}>
                    <button type="button" className="btn-secondary" style={{ flex: 1, minWidth: 'auto' }} onClick={onPrev}>
                        Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 1.5, minWidth: 'auto' }}>
                        Pay and verify
                    </button>
                </div>
            </form>
        </div>
    );
}
