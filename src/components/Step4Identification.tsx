import { useState } from 'react';
import type { RegistrationState } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    updateData: (fields: Partial<RegistrationState>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function Step4Identification({ data, updateData, onNext, onPrev }: Props) {
    const [error, setError] = useState('');
    const [isSsnFocused, setIsSsnFocused] = useState(false);

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

        // In the screenshot, the "State Issued" and "Driver's License Number" are primary
        if (!data.idType || !data.idNumber) {
            setError('Please provide your ID details.');
            return;
        }
        if (data.isUsCitizen && (!data.ssn || data.ssn.length !== 11)) {
            setError('A valid 9-digit SSN is required for U.S. Citizens.');
            return;
        }
        setError('');
        onNext();
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Identification & Citizenship</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    Please enter your information and select 'Next' to continue.
                </p>
            </div>

            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '380px', margin: '0 auto' }}>

                {/* Specific Layout matching the Screenshot */}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>ID Type <span style={{ color: '#d89c3a' }}>*</span></label>
                        <select
                            className="glass-input"
                            value={data.idType || ''}
                            onChange={e => updateData({ idType: e.target.value })}
                            required
                            style={{ paddingTop: '12px', paddingBottom: '12px', color: data.idType ? 'inherit' : '#999', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                        >
                            <option value="" disabled>Select ID Type</option>
                            <option value="US Citizenship id card">US Citizenship id card</option>
                            <option value="Passport">Passport</option>
                            <option value="US military id card">US military id card</option>
                            <option value="PIV card">PIV card</option>
                            <option value="Driver's licence">Driver's licence</option>
                        </select>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>ID Number <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input
                            type="text"
                            className="glass-input"
                            value={data.idNumber}
                            onChange={e => updateData({ idNumber: e.target.value })}
                            required
                            style={{ paddingTop: '12px', paddingBottom: '12px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>State Issued <span style={{ color: '#d89c3a' }}>*</span></label>
                        <select
                            className="glass-input"
                            value={data.address.state || ''} // Re-using state field as "State Issued" for visual matching if needed
                            onChange={e => updateData({ address: { ...data.address, state: e.target.value } })}
                            required
                            style={{ paddingTop: '12px', paddingBottom: '12px', color: data.address.state ? 'inherit' : '#999', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                        >
                            <option value="" disabled>Select State</option>
                            <option value="CA">California</option>
                            <option value="NY">New York</option>
                            <option value="TX">Texas</option>
                            {/* More options could be added */}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                    <label style={{ color: '#666', fontSize: '0.85rem' }}>U.S. Citizen <span style={{ color: '#d89c3a' }}>*</span></label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, color: 'var(--text-main)' }}>
                            <input
                                type="radio"
                                name="usCitizen"
                                checked={data.isUsCitizen === true}
                                onChange={() => updateData({ isUsCitizen: true })}
                                style={{ margin: 0, width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                            />
                            Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, color: 'var(--text-main)' }}>
                            <input
                                type="radio"
                                name="usCitizen"
                                checked={data.isUsCitizen === false}
                                onChange={() => {
                                    updateData({ isUsCitizen: false, ssn: '' });
                                }}
                                style={{ margin: 0, width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                            />
                            No
                        </label>
                    </div>

                    {data.isUsCitizen && (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <div style={{ position: 'relative' }}>
                                <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>SSN <span style={{ color: '#d89c3a' }}>*</span></label>
                                <input
                                    type="text"
                                    className="glass-input"
                                    value={isSsnFocused ? (data.ssn || '') : (data.ssn ? data.ssn.replace(/\d/g, '*') : '')}
                                    onFocus={() => setIsSsnFocused(true)}
                                    onBlur={() => setIsSsnFocused(false)}
                                    onChange={e => updateData({ ssn: formatSsn(e.target.value) })}
                                    required={data.isUsCitizen}
                                    placeholder="(XXX-XX-XXXX)"
                                    maxLength={11}
                                    style={{ paddingTop: '12px', paddingBottom: '12px', width: '100%' }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {error && <div style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <div className="form-actions" style={{ gap: '1rem' }}>
                    <button type="button" className="btn-secondary" style={{ flex: 1, minWidth: 'auto' }} onClick={onPrev}>
                        Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 1, minWidth: 'auto' }} disabled={!data.idType || !data.idNumber || !data.address.state || (data.isUsCitizen !== true && data.isUsCitizen !== false) || (data.isUsCitizen && (data.ssn || '').length !== 11)}>
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}
