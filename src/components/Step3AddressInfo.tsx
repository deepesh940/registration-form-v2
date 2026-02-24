import { useState, useEffect } from 'react';
import type { RegistrationState, Address } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    updateData: (fields: Partial<RegistrationState>) => void;
    onNext: () => void;
    onPrev: () => void;
}

const MOCK_CITIES_BY_STATE: Record<string, string[]> = {
    "Alabama": ["Birmingham", "Montgomery", "Mobile"],
    "Alaska": ["Anchorage", "Fairbanks", "Juneau"],
    "Arizona": ["Phoenix", "Tucson", "Mesa"],
    "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville"],
    "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Fresno"],
    "Colorado": ["Denver", "Colorado Springs", "Aurora"],
    "Connecticut": ["Bridgeport", "New Haven", "Stamford"],
    "Delaware": ["Wilmington", "Dover", "Newark"],
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"],
    "Georgia": ["Atlanta", "Augusta", "Savannah"],
    "Hawaii": ["Honolulu", "Hilo", "Kailua"],
    "Idaho": ["Boise", "Meridian", "Nampa"],
    "Illinois": ["Chicago", "Aurora", "Naperville"],
    "Indiana": ["Indianapolis", "Fort Wayne", "Evansville"],
    "Iowa": ["Des Moines", "Cedar Rapids", "Davenport"],
    "Kansas": ["Wichita", "Overland Park", "Kansas City"],
    "Kentucky": ["Louisville", "Lexington", "Bowling Green"],
    "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport"],
    "Maine": ["Portland", "Lewiston", "Bangor"],
    "Maryland": ["Baltimore", "Frederick", "Rockville"],
    "Massachusetts": ["Boston", "Worcester", "Springfield"],
    "Michigan": ["Detroit", "Grand Rapids", "Warren"],
    "Minnesota": ["Minneapolis", "St. Paul", "Rochester"],
    "Mississippi": ["Jackson", "Gulfport", "Southaven"],
    "Missouri": ["Kansas City", "St. Louis", "Springfield"],
    "Montana": ["Billings", "Missoula", "Great Falls"],
    "Nebraska": ["Omaha", "Lincoln", "Bellevue"],
    "Nevada": ["Las Vegas", "Henderson", "Reno"],
    "New Hampshire": ["Manchester", "Nashua", "Concord"],
    "New Jersey": ["Newark", "Jersey City", "Paterson"],
    "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho"],
    "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro"],
    "North Dakota": ["Fargo", "Bismarck", "Grand Forks"],
    "Ohio": ["Columbus", "Cleveland", "Cincinnati"],
    "Oklahoma": ["Oklahoma City", "Tulsa", "Norman"],
    "Oregon": ["Portland", "Salem", "Eugene"],
    "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown"],
    "Rhode Island": ["Providence", "Warwick", "Cranston"],
    "South Carolina": ["Charleston", "Columbia", "North Charleston"],
    "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen"],
    "Tennessee": ["Nashville", "Memphis", "Knoxville"],
    "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
    "Utah": ["Salt Lake City", "West Valley City", "Provo"],
    "Vermont": ["Burlington", "South Burlington", "Rutland"],
    "Virginia": ["Virginia Beach", "Norfolk", "Chesapeake"],
    "Washington": ["Seattle", "Spokane", "Tacoma"],
    "West Virginia": ["Charleston", "Huntington", "Morgantown"],
    "Wisconsin": ["Milwaukee", "Madison", "Green Bay"],
    "Wyoming": ["Cheyenne", "Casper", "Laramie"]
};

export function Step3AddressInfo({ data, updateData, onNext, onPrev }: Props) {
    const [isVerifying, setIsVerifying] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [error, setError] = useState('');
    const [sameAsPrimary, setSameAsPrimary] = useState(false);

    // Sync secondary address if "Same as Primary" is checked
    useEffect(() => {
        if (sameAsPrimary && data.accountType === 'Joint') {
            updateData({
                secondaryApplicant: {
                    ...data.secondaryApplicant!,
                    address: { ...data.address }
                }
            });
        }
    }, [sameAsPrimary, data.address, data.accountType]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        const isPrimaryAddrValid = data.address.line1 && data.address.city && data.address.state && data.address.zipCode;
        const isSecondaryAddrValid = data.accountType !== 'Joint' || (
            data.secondaryApplicant?.address.line1 &&
            data.secondaryApplicant?.address.city &&
            data.secondaryApplicant?.address.state &&
            data.secondaryApplicant?.address.zipCode
        );

        if (!isPrimaryAddrValid || !isSecondaryAddrValid) {
            setError('Please complete all required address fields.');
            return;
        }

        // Simulate automated address verification
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);

            // Mark both as verified
            if (data.accountType === 'Joint') {
                updateData({
                    isAddressVerified: true,
                    secondaryApplicant: {
                        ...data.secondaryApplicant!,
                        isAddressVerified: true
                    }
                });
            } else {
                updateData({ isAddressVerified: true });
            }

            setShowSuccessPopup(true);

            // Wait 1.5 seconds for user to see the success popup before moving to next step
            setTimeout(() => {
                setShowSuccessPopup(false);
                onNext();
            }, 1500);

        }, 1200);
    };

    const renderAddressFields = (
        title: string,
        address: Address,
        isSecondary: boolean,
        isSameAsPrimary?: boolean,
        setSameAsPrimary?: (val: boolean) => void
    ) => {
        const updateAddrField = (field: keyof Address, value: string) => {
            if (isSecondary) {
                updateData({
                    secondaryApplicant: {
                        ...data.secondaryApplicant!,
                        address: { ...data.secondaryApplicant!.address, [field]: value }
                    }
                });
            } else {
                updateData({ address: { ...data.address, [field]: value } });
            }
        };

        const availableCities = address.state ? (MOCK_CITIES_BY_STATE[address.state] || []) : [];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(216, 156, 58, 0.1)', paddingBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--bg-top)', fontWeight: '700' }}>
                        {title}
                    </h3>
                    {isSecondary && setSameAsPrimary && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isSameAsPrimary}
                                onChange={e => setSameAsPrimary(e.target.checked)}
                                style={{ accentColor: 'var(--bg-top)' }}
                            />
                            Same as Primary
                        </label>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: isSameAsPrimary ? 0.6 : 1, pointerEvents: isSameAsPrimary ? 'none' : 'auto' }}>
                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Address Line 1 <span style={{ color: '#d89c3a' }}>*</span></label>
                        <input type="text" className="glass-input" value={address.line1} onChange={e => updateAddrField('line1', e.target.value)} required placeholder="123 Main St" style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Address Line 2 (Optional)</label>
                        <input type="text" className="glass-input" value={address.line2 || ''} onChange={e => updateAddrField('line2', e.target.value)} placeholder="Apt, Suite, Bldg" style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                    </div>

                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 2 }}>State <span style={{ color: '#d89c3a' }}>*</span></label>
                            <select
                                className="glass-input"
                                value={address.state}
                                onChange={e => updateAddrField('state', e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    color: address.state ? 'inherit' : '#999',
                                    appearance: 'none',
                                    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right .7em top 50%',
                                    backgroundSize: '.65em auto',
                                    borderRadius: '4px 0 0 4px',
                                    borderRight: 'none'
                                }}
                            >
                                <option value="" disabled>Select State</option>
                                {Object.keys(MOCK_CITIES_BY_STATE).map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ flex: 1, position: 'relative' }}>
                            <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 2 }}>City <span style={{ color: '#d89c3a' }}>*</span></label>
                            <select
                                className="glass-input"
                                value={address.city}
                                onChange={e => updateAddrField('city', e.target.value)}
                                required
                                disabled={!address.state}
                                style={{
                                    width: '100%',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    color: address.city ? 'inherit' : '#999',
                                    appearance: 'none',
                                    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right .7em top 50%',
                                    backgroundSize: '.65em auto',
                                    opacity: !address.state ? 0.6 : 1,
                                    borderRadius: '0 4px 4px 0'
                                }}
                            >
                                <option value="" disabled>{address.state ? 'Select City' : 'Select State First'}</option>
                                {availableCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Country <span style={{ color: '#d89c3a' }}>*</span></label>
                            <input type="text" className="glass-input" value="United States" disabled style={{ paddingTop: '12px', paddingBottom: '12px', background: '#f5f5f5', color: '#999' }} />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <label style={{ position: 'absolute', top: '-8px', left: '10px', background: 'white', padding: '0 4px', fontSize: '0.75rem', color: '#999', zIndex: 1 }}>Zip Code <span style={{ color: '#d89c3a' }}>*</span></label>
                            <input type="text" className="glass-input" value={address.zipCode} onChange={e => updateAddrField('zipCode', e.target.value)} required placeholder="12345" maxLength={10} style={{ paddingTop: '12px', paddingBottom: '12px' }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Address Information</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    Please enter your residence address.
                </p>
            </div>

            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '450px', margin: '0 auto' }}>
                {renderAddressFields(
                    data.accountType === 'Joint' ? "Primary Applicant's Address" : "Mailing Address",
                    data.address,
                    false
                )}

                {data.accountType === 'Joint' && data.secondaryApplicant && renderAddressFields(
                    "Secondary Applicant's Address",
                    data.secondaryApplicant.address,
                    true,
                    sameAsPrimary,
                    setSameAsPrimary
                )}

                {error && <div style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <div className="form-actions" style={{ gap: '1rem' }}>
                    <button type="button" className="btn-secondary" style={{ flex: 1, minWidth: 'auto' }} onClick={onPrev} disabled={isVerifying || showSuccessPopup}>
                        Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 1, minWidth: 'auto' }} disabled={isVerifying || showSuccessPopup}>
                        {isVerifying ? 'Verifying...' : 'Next'}
                    </button>
                </div>
            </form>

            {/* Success Popup Overlay */}
            {showSuccessPopup && (
                <div className="animate-fade-in" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    borderRadius: '8px'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: 'var(--success)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        color: 'white',
                        fontSize: '2rem'
                    }}>
                        ✓
                    </div>
                    <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>Success!</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                        Address verified successfully.
                    </p>
                </div>
            )}
        </div>
    );
}
