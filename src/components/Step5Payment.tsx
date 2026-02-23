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
    const [showPaymentMethod, setShowPaymentMethod] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });

    const validateCard = () => {
        if (paymentMethod !== 'card') return true;
        return cardDetails.number.length >= 15 && cardDetails.expiry.length >= 4 && cardDetails.cvc.length >= 3;
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
                    {!showPaymentMethod ? 'Identity Verification Fee' : 'Payment Method'}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    {!showPaymentMethod
                        ? 'To securely process your identity verification and open your account, a $5 fee is required.'
                        : 'Please select your preferred payment method.'}
                </p>
            </div>

            {!showPaymentMethod && (
                <div style={{
                    background: '#fafafa',
                    borderRadius: '8px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Amount Due</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--bg-top)' }}>$5.00</span>
                </div>
            )}

            {showPaymentMethod && data.paymentStatus !== 'completed' && (
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
                        <div className="animate-fade-in" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Card Information</label>
                                <input type="text" className="glass-input" placeholder="0000 0000 0000 0000" maxLength={19} value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '') })} style={{ marginBottom: '-1px', borderRadius: '4px 4px 0 0', borderBottom: '1px solid var(--border-color)', paddingTop: '12px', paddingBottom: '12px' }} />
                                <div style={{ display: 'flex' }}>
                                    <input type="text" className="glass-input" placeholder="MM/YY" maxLength={5} value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })} style={{ flex: 1, borderRadius: '0 0 0 4px', borderRight: '1px solid var(--border-color)', borderTop: 'none', paddingTop: '12px', paddingBottom: '12px' }} />
                                    <input type="text" className="glass-input" placeholder="CVC" maxLength={4} value={cardDetails.cvc} onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '') })} style={{ flex: 1, borderRadius: '0 0 4px 0', borderTop: 'none', paddingTop: '12px', paddingBottom: '12px' }} />
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
                    <button type="button" className="btn-secondary" style={{ flex: 1, minWidth: 'auto' }} onClick={() => showPaymentMethod ? setShowPaymentMethod(false) : onPrev()} disabled={isProcessing}>
                        Back
                    </button>
                    {!showPaymentMethod ? (
                        <button type="button" className="btn-primary" style={{ flex: 2, minWidth: 'auto' }} onClick={() => setShowPaymentMethod(true)}>
                            Next
                        </button>
                    ) : (
                        <button type="button" className="btn-primary" style={{ flex: 2, minWidth: 'auto' }} onClick={handlePayment} disabled={isProcessing || !validateCard()}>
                            {isProcessing ? 'Processing...' : 'Pay $5.00'}
                        </button>
                    )}
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
