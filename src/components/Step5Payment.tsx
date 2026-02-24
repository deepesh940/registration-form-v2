import { useState } from 'react';
import type { RegistrationState } from '../types/registration';
import '../index.css';

interface Props {
    data: RegistrationState;
    updateData: (fields: Partial<RegistrationState>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function Step5Payment({ data, updateData, onNext, onPrev }: Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });

    const validateCard = () => {
        if (paymentMethod !== 'card') return true;
        const cleanNumber = cardDetails.number.replace(/\s/g, '');
        const cleanExpiry = cardDetails.expiry.replace(/\//g, '');
        return cleanNumber.length >= 15 && cleanExpiry.length === 4 && cardDetails.cvc.length >= 3;
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        setError('');

        // Simulate Stripe Payment Gateway Integration
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // 90% success rate mock
                    if (Math.random() > 0.1) {
                        resolve('success');
                    } else {
                        reject(new Error('Payment failed. Please check your card details.'));
                    }
                }, 2000);
            });

            updateData({ paymentStatus: 'completed' });
            onNext();
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during payment.');
            setIsProcessing(false);
            updateData({ paymentStatus: 'failed' });
        }
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>
                    Payment Method
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    Please select your preferred payment method.
                </p>
            </div>


            {data.paymentStatus !== 'completed' && (
                <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    {/* Payment Method Selector */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <label style={{ flex: 1, padding: '1rem', border: `1px solid ${paymentMethod === 'card' ? 'var(--bg-top)' : 'var(--border-color)'}`, borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'card' ? 'rgba(184, 147, 54, 0.1)' : 'white', textAlign: 'center' }}>
                            <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ display: 'none' }} />
                            💳 Card
                        </label>
                        <label style={{ flex: 1, padding: '1rem', border: `1px solid ${paymentMethod === 'bank' ? 'var(--bg-top)' : 'var(--border-color)'}`, borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'bank' ? 'rgba(184, 147, 54, 0.1)' : 'white', textAlign: 'center' }}>
                            <input type="radio" name="paymentMethod" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} style={{ display: 'none' }} />
                            🏦 Bank (ACH)
                        </label>
                    </div>

                    {/* Card Details Mock Form */}
                    {paymentMethod === 'card' && (
                        <div className="animate-fade-in" style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: '500' }}>Card Information</label>

                                <div style={{
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    overflow: 'hidden'
                                }}>
                                    <input
                                        type="text"
                                        className="payment-input"
                                        placeholder="0000 0000 0000 0000"
                                        maxLength={19}
                                        value={cardDetails.number}
                                        onChange={e => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                            setCardDetails({ ...cardDetails, number: formatted });
                                        }}
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            borderBottom: '1px solid var(--border-color)',
                                            padding: '14px 16px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            letterSpacing: '1px'
                                        }}
                                    />
                                    <div style={{ display: 'flex' }}>
                                        <input
                                            type="text"
                                            className="payment-input"
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            value={cardDetails.expiry}
                                            onChange={e => {
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length > 2) {
                                                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                                }
                                                setCardDetails({ ...cardDetails, expiry: value });
                                            }}
                                            style={{
                                                flex: 1,
                                                border: 'none',
                                                borderRight: '1px solid var(--border-color)',
                                                padding: '14px 16px',
                                                fontSize: '1rem',
                                                outline: 'none'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            className="payment-input"
                                            placeholder="CVC"
                                            maxLength={4}
                                            value={cardDetails.cvc}
                                            onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '') })}
                                            style={{
                                                flex: 1,
                                                border: 'none',
                                                padding: '14px 16px',
                                                fontSize: '1rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'bank' && (
                        <div className="animate-fade-in" style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>You will be securely redirected to Plaid to link your bank account when you click Next.</p>
                        </div>
                    )}
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
                    <strong>Error:</strong> {error}
                </div>
            )}

            {data.paymentStatus === 'completed' ? (
                <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem', margin: '2rem 0' }}>
                    ✓ Payment Completed
                </div>
            ) : (
                <div className="form-actions" style={{ gap: '1rem', marginTop: '1rem', paddingBottom: 0 }}>
                    <button type="button" className="btn-secondary" style={{ flex: 1, minWidth: 'auto' }} onClick={onPrev} disabled={isProcessing}>
                        Back
                    </button>
                    <button type="button" className="btn-primary" style={{ flex: 2, minWidth: 'auto' }} onClick={handlePayment} disabled={isProcessing || !validateCard()}>
                        {isProcessing ? 'Processing...' : `Pay ${data.accountType === 'Joint' ? '$10.00' : '$5.00'}`}
                    </button>
                </div>
            )}

            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>🔒</span> Secure payment powered by Stripe
            </div>

            {data.paymentStatus === 'completed' && (
                <div style={{ marginTop: '2rem' }}>
                    <button type="button" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', margin: '0 auto' }} onClick={onPrev} disabled={isProcessing}>
                        Go Back
                    </button>
                </div>
            )}
        </div>
    );
}
