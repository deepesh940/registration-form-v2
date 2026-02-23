import { useState, useEffect } from 'react';
import type { RegistrationState } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    updateData: (fields: Partial<RegistrationState>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function Step6IdentityVerification({ data, updateData, onNext, onPrev }: Props) {
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');

    const startVerification = async () => {
        setIsVerifying(true);
        setError('');
        updateData({ verificationStatus: 'in_progress' });

        // Mock Prembly KYC Verification
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // 85% success rate for mock
                    if (Math.random() > 0.15) {
                        resolve('success');
                    } else {
                        reject(new Error('Automated verification failed. Document might be unclear.'));
                    }
                }, 3500);
            });

            updateData({ verificationStatus: 'completed' });
            onNext();
        } catch (err: any) {
            setError(err.message || 'Verification process encountered an issue.');
            updateData({ verificationStatus: 'failed' });
            setIsVerifying(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Identity Verification</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    We use advanced secure identity bridging to confirm your details against official databases.
                </p>
            </div>

            {data.verificationStatus === 'not_started' && (
                <div style={{ padding: '2rem 0' }}>
                    <div className="form-actions" style={{ gap: '1rem', marginTop: '1rem', paddingBottom: 0 }}>
                        <button type="button" className="btn-secondary" style={{ flex: 1, minWidth: 'auto' }} onClick={onPrev}>
                            Back
                        </button>
                        <button type="button" className="btn-primary" style={{ flex: 2, minWidth: 'auto' }} onClick={startVerification}>
                            Start Verification
                        </button>
                    </div>
                </div>
            )}

            {data.verificationStatus === 'in_progress' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem 0' }}>
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid var(--border-color)',
                        borderLeftColor: 'var(--bg-top)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>

                    <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', margin: 0 }}>Verifying...</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Securely cross-referencing your information. Please wait.
                    </p>
                </div>
            )}

            {error && (
                <div style={{
                    background: 'rgba(211, 47, 47, 0.1)',
                    border: '1px solid var(--error)',
                    color: 'var(--error)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    <strong>Verification Failed:</strong> {error}

                    <div className="form-actions" style={{ gap: '1rem', marginTop: '1.5rem', paddingBottom: 0 }}>
                        <button type="button" className="btn-secondary" style={{ flex: 1, minWidth: 'auto' }} onClick={onPrev}>
                            Check Details
                        </button>
                        <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 'auto' }} onClick={startVerification}>
                            Retry
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
