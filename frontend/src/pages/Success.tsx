import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CheckCircle } from 'lucide-react';

export default function Success() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  
  const status = searchParams.get('status');
  const message = searchParams.get('message');
  const orderRef = searchParams.get('orderRef');

  useEffect(() => {
    // Break out of the Paytriot iframe if we are inside it
    if (window.top && window.top !== window) {
      window.top.location.href = window.location.href;
      return;
    }

    if (status === 'success') {
      clearCart();
    }
  }, [status, clearCart]);

  // If we are still inside the iframe (during the brief moment before breakout), don't render anything complex
  if (window.top && window.top !== window) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>Completing payment...</div>;
  }

  if (status === 'cancel') {
    return (
      <div className="container" style={{ padding: '64px 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="text-h2" style={{ color: 'var(--red-500)' }}>Payment Failed</h1>
        <p style={{ color: 'var(--steel-400)', margin: '16px 0', maxWidth: '500px' }}>
          {message || 'Your payment was cancelled or failed to process. No charges were made.'}
        </p>
        <Link to="/checkout" className="btn-primary" style={{ display: 'inline-flex', marginTop: '24px' }}>Try Again</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '64px 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <CheckCircle size={64} className="text-nitro-blue" style={{ marginBottom: '24px' }} />
      <h1 className="text-h2">Order Placed Successfully!</h1>
      <p style={{ color: 'var(--steel-400)', margin: '16px 0', maxWidth: '500px' }}>
        Thank you for your order! Your components are currently being prepared for dispatch.
      </p>
      {orderRef && (
        <div style={{ padding: '16px', background: 'var(--steel-800)', borderRadius: '8px', margin: '24px 0' }}>
          <span style={{ color: 'var(--steel-400)', fontSize: '14px', marginRight: '8px' }}>Order Reference:</span>
          <span className="text-mono" style={{ color: 'var(--white)' }}>{orderRef}</span>
        </div>
      )}
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex', marginTop: '16px' }}>Continue Shopping</Link>
    </div>
  );
}
