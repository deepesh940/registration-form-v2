import type { RegistrationState } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    onNext: () => void;
    onPrev: () => void;
}

export function Step5Summary({ data, onNext, onPrev }: Props) {
    const Row = ({ label, value }: { label: string, value: string | undefined }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{label}</span>
            <strong style={{ color: 'var(--text-main)', textAlign: 'right' }}>{value || '-'}</strong>
        </div>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem', marginTop: '1.5rem', textAlign: 'left' }}>
            {title}
        </h3>
    );

    return (
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Your Summary</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    Please review your information and select 'Next' to continue.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                <SectionHeader title="Personal Information" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '2rem' }}>
                    <div>
                        <Row label="Name" value={`${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}`} />
                        <Row label="Date of Birth" value={data.birthday} />
                        <Row label="Marital Status" value={data.maritalStatus} />
                    </div>
                    <div>
                        <Row label="Mother's Maiden" value={data.motherMaidenName} />
                        <Row label="Gender" value={data.gender} />
                    </div>
                </div>

                <SectionHeader title="Address & Contact" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '2rem' }}>
                    <div>
                        <Row label="Address Line 1" value={data.address.line1} />
                        <Row label="Address Line 2" value={data.address.line2} />
                        <Row label="City & State" value={`${data.address.city}, ${data.address.state} ${data.address.zipCode}`} />
                        <Row label="Country" value={data.address.country} />
                    </div>
                    <div>
                        <Row label="Email" value={data.email} />
                        <Row label="Primary Phone" value={data.mobileNumber} />
                    </div>
                </div>

                <SectionHeader title="Identification" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '2rem' }}>
                    <div>
                        <Row label="SSN" value={data.ssn ? '***-**-' + data.ssn.slice(-4) : ''} />
                        <Row label="U.S. Citizen" value={data.isUsCitizen ? 'Yes' : 'No'} />
                    </div>
                    <div>
                        <Row label="ID Number" value={data.idNumber} />
                        <Row label="State Issued" value={data.address.state} />
                    </div>
                </div>

            </div>

            <div className="form-actions" style={{ gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, minWidth: 'auto' }} onClick={onPrev}>
                    Back
                </button>
                <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 'auto' }} onClick={onNext}>
                    Next
                </button>
            </div>
        </div>
    );
}
