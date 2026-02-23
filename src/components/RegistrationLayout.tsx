import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { RegistrationState, Step } from '../types/registration';
import { Step0EligibilityCheck } from './Step0EligibilityCheck';
import { Step1EmailCapture } from './Step1EmailCapture';
import { Step2BasicInfo } from './Step2BasicInfo';
import { Step3AddressInfo } from './Step3AddressInfo';
import { Step4Identification } from './Step4Identification';
import { Step5Summary } from './Step5Summary';
import { Step5Payment as Step6Payment } from './Step5Payment';
import { Step6IdentityVerification as Step7IdentityVerification } from './Step6IdentityVerification';
import { Step7Completion as Step8Completion } from './Step7Completion';
import '../index.css';
import logoImg from '../assets/logo.png';

const initialState: RegistrationState = {
    step: 4, // Started on Step 4 for demonstration matching the screenshot
    email: '',
    isEmailVerified: false,
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    birthday: '',
    motherMaidenName: '',
    maritalStatus: '',
    mobileNumber: '',
    isMobileVerified: false,
    address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
    },
    isAddressVerified: false,
    idType: '',
    idNumber: '',
    isUsCitizen: false,
    ssn: '',
    paymentStatus: 'pending',
    verificationStatus: 'not_started',
};

// 8 sub-steps mapped to 3 high level phases
const getPhaseInfo = (step: Step) => {
    if (step <= 2) return { currentPhase: 1, label: 'Eligibility' };
    if (step <= 4) return { currentPhase: 2, label: 'Information' };
    return { currentPhase: 3, label: 'Complete' };
};

export function RegistrationLayout() {
    const { stepId } = useParams<{ stepId: string }>();
    const navigate = useNavigate();

    // Parse stepId, default to 0 if invalid
    let parsedStep = parseInt(stepId || '0', 10);
    if (isNaN(parsedStep) || parsedStep < 0 || parsedStep > 8) {
        parsedStep = 0;
    }
    const currentStep = parsedStep as Step;

    const [data, setData] = useState<RegistrationState>({ ...initialState, step: currentStep });

    // Sync internal step state with URL param whenever URL changes
    useEffect(() => {
        if (data.step !== currentStep) {
            setData((prev) => ({ ...prev, step: currentStep }));
        }
    }, [currentStep, data.step]);

    const updateData = (fields: Partial<RegistrationState>) => {
        setData((prev) => ({ ...prev, ...fields }));
    };

    const goToNextStep = () => {
        const nextStep = Math.min(data.step + 1, 8) as Step;
        navigate(`/step/${nextStep}`);
    };

    const handleResumeAddressStep = () => {
        navigate(`/step/3`); // Address is now step 3
    };

    const goToPreviousStep = () => {
        const prevStep = Math.max(data.step - 1, 0) as Step;
        navigate(`/step/${prevStep}`);
    };

    const renderStep = () => {
        switch (data.step) {
            case 0:
                return <Step0EligibilityCheck data={data} updateData={updateData} onNext={goToNextStep} onResume={handleResumeAddressStep} />;
            case 1:
                return <Step1EmailCapture data={data} updateData={updateData} onNext={goToNextStep} />;
            case 2:
                return <Step2BasicInfo data={data} updateData={updateData} onNext={goToNextStep} onPrev={goToPreviousStep} />;
            case 3:
                return <Step3AddressInfo data={data} updateData={updateData} onNext={goToNextStep} onPrev={goToPreviousStep} />;
            case 4:
                return <Step4Identification data={data} updateData={updateData} onNext={goToNextStep} onPrev={goToPreviousStep} />;
            case 5:
                return <Step5Summary data={data} onNext={goToNextStep} onPrev={goToPreviousStep} />;
            case 6:
                return <Step6Payment data={data} updateData={updateData} onNext={goToNextStep} onPrev={goToPreviousStep} />;
            case 7:
                return <Step7IdentityVerification data={data} updateData={updateData} onNext={goToNextStep} onPrev={goToPreviousStep} />;
            case 8:
                return <Step8Completion data={data} />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    const phases = [
        { id: 1, label: 'Eligibility', activeIfStepGTE: 1, completedIfStepGT: 2 },
        { id: 2, label: 'Information', activeIfStepGTE: 3, completedIfStepGT: 4 },
        { id: 3, label: 'Complete', activeIfStepGTE: 5, completedIfStepGT: 8 },
    ];

    const currentPhase = getPhaseInfo(data.step).currentPhase;

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

            {/* Dev Auto Fill Helper */}
            <button
                type="button"
                onClick={() => {
                    updateData({
                        email: 'test@example.com',
                        isEmailVerified: true,
                        firstName: 'Jane',
                        lastName: 'Doe',
                        birthday: '1990-01-01',
                        gender: 'Female',
                        maritalStatus: 'Single',
                        motherMaidenName: 'Smith',
                        mobileNumber: '(555) 123-4567',
                        isMobileVerified: true,
                        address: {
                            line1: '123 Test Blvd',
                            line2: 'Apt 4B',
                            city: 'San Francisco',
                            state: 'California',
                            zipCode: '94105',
                            country: 'United States',
                        },
                        isAddressVerified: true,
                        idType: "Driver's License",
                        idNumber: 'D12345678',
                        isUsCitizen: true,
                        ssn: '123-45-6789',
                    });
                }}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.75rem',
                    backgroundColor: 'var(--bg-top)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    opacity: 0.3,
                    transition: 'opacity 0.2s',
                    zIndex: 100
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.3'}
            >
                ⚡ Auto Fill
            </button>

            {/* Logo Area */}
            <div style={{ marginTop: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                <img src={logoImg} alt="ADFCU Logo" style={{ height: '60px' }} />
            </div>

            {/* Stepper (Phases) */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '5px' }}>
                {phases.map((phase, index) => {
                    const isActive = currentPhase === phase.id;
                    const isCompleted = data.step > phase.completedIfStepGT || (currentPhase > phase.id);

                    return (
                        <div key={phase.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: `2px solid ${isActive || isCompleted ? 'white' : 'rgba(255,255,255,0.5)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive || isCompleted ? 'bold' : 'normal',
                                    position: 'relative'
                                }}>
                                    {/* Inner white circle for active/completed, else just number */}
                                    {(isActive || isCompleted) ? (
                                        <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-top)' }}>
                                            {isCompleted ? '✓' : phase.id}
                                        </div>
                                    ) : (
                                        phase.id
                                    )}
                                </div>
                                <span style={{
                                    color: isActive || isCompleted ? 'white' : 'rgba(255,255,255,0.7)',
                                    fontSize: '0.75rem',
                                    marginTop: '6px',
                                    fontWeight: isActive ? '600' : 'normal'
                                }}>
                                    {phase.label}
                                </span>
                            </div>

                            {/* Connecting Line */}
                            {index < phases.length - 1 && (
                                <div style={{
                                    width: '60px',
                                    height: '2px',
                                    backgroundColor: (currentPhase > phase.id) ? 'white' : 'rgba(255,255,255,0.5)',
                                    marginBottom: '18px' // Offset to align with circles, not text
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Main Content Card Wrapper */}
            <div className="registration-card">
                {renderStep()}

                {/* Pagination Dots (Don't show on Step 0 or 8 typically) */}
                {data.step > 0 && data.step < 8 && (
                    <div className="pagination-dots">
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                            <div key={num} className={`dot ${data.step === num ? 'active' : ''}`} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
