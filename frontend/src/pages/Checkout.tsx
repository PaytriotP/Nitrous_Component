import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import './Checkout.css';
declare global {
  interface Window {
    PaytriotCheckout?: any;
  }
}

export default function Checkout() {
  const { cartItems, subtotal, delivery, total } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    fname: '',
    lname: '',
    address: '',
    city: '',
    postcode: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateField = (_field: string, value: string) => {
    if (!value.trim()) return 'This field is required';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check all fields
    const newTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(newTouched);

    const hasErrors = Object.entries(formData).some(([key, val]) => validateField(key, val) !== '');
    if (hasErrors) return;

    setIsSubmitting(true);
    
    try {
      const backendUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
      const response = await fetch(`${backendUrl}/store/paytriot/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          customerName: `${formData.fname} ${formData.lname}`,
          customerEmail: formData.email,
          customerAddress: formData.address,
          customerCity: formData.city,
          customerPostCode: formData.postcode,
          redirectURL: `${window.location.origin}/checkout/success`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate payment signature');
      }

      const data = await response.json();
      
      if (window.PaytriotCheckout) {
        window.PaytriotCheckout.open(data.fields);
      } else {
        alert('Payment gateway failed to load.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while initializing payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    const hasData = Object.values(formData).some(val => val !== '');
    if (hasData) {
      if (!window.confirm("You have entered data. Are you sure you want to leave checkout?")) {
        return;
      }
    }
    navigate('/shop');
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h1 className="text-h2">Checkout Unavailable</h1>
        <p style={{ color: 'var(--steel-400)', margin: '16px 0' }}>Your cart is empty.</p>
        <Link to="/shop" className="btn-primary" style={{ display: 'inline-flex' }}>Return to Shop</Link>
      </div>
    );
  }

  const renderInput = (
    id: string, 
    label: string, 
    type: string, 
    placeholder: string, 
    autoComplete: string, 
    extraProps: any = {}, 
    icon?: React.ReactNode
  ) => {
    const error = touched[id] ? validateField(id, (formData as any)[id]) : '';
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={id}>{label}</label>
        <div className={icon ? "input-with-icon" : ""}>
          <input 
            type={type} 
            id={id} 
            className={`form-input ${error ? 'is-invalid' : ''}`}
            placeholder={placeholder} 
            autoComplete={autoComplete}
            value={(formData as any)[id]}
            onChange={(e) => handleChange(id, e.target.value)}
            onBlur={() => handleBlur(id)}
            aria-describedby={error ? `${id}-error` : undefined}
            required 
            {...extraProps}
          />
          {icon && <div className="input-icon-right">{icon}</div>}
        </div>
        {error && <span id={`${id}-error`} className="error-text" aria-live="polite">{error}</span>}
      </div>
    );
  };

  return (
    <div className="checkout-page">
      {/* Minimal Header */}
      <header className="checkout-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) 0' }}>
          <div style={{ width: '120px' }}></div> {/* Spacer for centering logo */}
          <Link to="/" className="header-logo" style={{ textDecoration: 'none', color: 'var(--white)', fontSize: '24px', fontWeight: 700, letterSpacing: '0.05em', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Nitrous</Link>
          <a href="#" onClick={handleBack} className="text-small" style={{ textDecoration: 'none', color: 'var(--steel-400)', width: '120px', textAlign: 'right', whiteSpace: 'nowrap' }}>Back to Shop</a>
        </div>
      </header>
      <hr className="pressure-rule" />

      <main className="container checkout-container">
        <div className="checkout-layout">
          
          <div className="checkout-form-area">
            <h1 className="text-h2" style={{ marginBottom: 'var(--space-8)' }}>Secure Checkout</h1>
            
            <form onSubmit={handleSubmit} noValidate>
              <section className="checkout-section">
                <h2 className="checkout-section-title">1. Contact Information</h2>
                {renderInput('email', 'Email Address', 'email', 'engineering@example.com', 'email')}
              </section>

              <section className="checkout-section">
                <h2 className="checkout-section-title">2. Shipping Address</h2>
                <div className="form-row">
                  {renderInput('fname', 'First Name', 'text', '', 'given-name')}
                  {renderInput('lname', 'Last Name', 'text', '', 'family-name')}
                </div>
                {renderInput('address', 'Street Address', 'text', '', 'street-address')}
                <div className="form-row">
                  {renderInput('city', 'City', 'text', '', 'address-level2')}
                  {renderInput('postcode', 'Postcode', 'text', '', 'postal-code')}
                </div>
              </section>

              <section className="checkout-section">
                <h2 className="checkout-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  3. Payment <Lock size={18} className="text-nitro-blue" aria-hidden="true" />
                </h2>
                
                <p style={{ color: 'var(--steel-400)', marginBottom: '16px', fontSize: '14px' }}>
                  Clicking "Pay" will open a secure payment window powered by Paytriot.
                </p>

                <div className="trust-badges-checkout">
                  <Link to="/privacy" className="tb-item" style={{ textDecoration: 'none' }}>
                    <ShieldCheck size={20} className="text-nitro-blue" />
                    <span>AES-256 Encrypted</span>
                  </Link>
                  <Link to="/privacy" className="tb-item" style={{ textDecoration: 'none' }}>
                    <CheckCircle size={20} className="text-nitro-blue" />
                    <span>PCI DSS Compliant</span>
                  </Link>
                </div>

                <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: 'var(--space-6)', height: '56px', fontSize: '18px', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Processing...' : `Pay £${total.toFixed(2)}`}
                </button>
              </section>
            </form>
          </div>

          <aside className="checkout-summary-area">
            <div className="cart-summary checkout-summary-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h3 className="text-h3" style={{ margin: 0 }}>Order Summary</h3>
                <Link to="/cart" className="text-small" style={{ textDecoration: 'none', color: 'var(--nitro-blue)' }}>Edit Cart</Link>
              </div>
              
              <div className="cs-items-preview">
                {cartItems.map((item, i) => (
                  <div key={i} className="cs-item-row">
                    <div className="cs-item-image">
                      {item.product.image_file ? <img src={`/${item.product.image_file}`} alt="" /> : <div className="placeholder-chip"></div>}
                      <span className="cs-item-qty">{item.quantity}</span>
                    </div>
                    <div className="cs-item-details">
                      <div className="text-small text-white">{item.product.name}</div>
                      <div className="text-mono text-steel-400" style={{fontSize: '12px'}}>{item.product.part_number}</div>
                    </div>
                    <div className="text-mono text-white">
                      £{(Number(item.product.price_gbp) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <hr className="summary-divider" />

              <div className="summary-row text-steel-400">
                <span>Subtotal</span>
                <span className="text-mono text-white">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row text-steel-400">
                <span>Delivery</span>
                <span className="text-mono text-white">{delivery === 0 ? 'FREE' : `£${delivery.toFixed(2)}`}</span>
              </div>

              <hr className="summary-divider" />

              <div className="summary-row summary-total">
                <span>Total</span>
                <span className="text-mono text-white">£{total.toFixed(2)}</span>
              </div>
            </div>
          </aside>

        </div>
      </main>

      <footer className="checkout-footer">
        <div className="container">
          <div className="cf-content">
            <div className="cf-links">
              <span>&copy; {new Date().getFullYear()} Nitrous Components</span>
              <div className="cf-policy-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/returns">Returns & Refunds</Link>
              </div>
            </div>
            
            <div className="cf-support">
              <span>Need help? </span>
              <a href="mailto:support@nitrous.example.com">support@nitrous.example.com</a>
            </div>
            
            <div className="cf-badges">
               <ShieldCheck size={16} className="text-nitro-blue" /> Secure SSL Checkout
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
