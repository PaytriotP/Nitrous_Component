import { useState } from 'react';
import { Mail, Clock, MapPin, CheckCircle } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };
  return (
    <div className="contact-page">
      <hr className="pressure-rule" />
      <div className="container contact-container">
        
        <div className="contact-layout">
          <div className="contact-form-side">
            <h1 className="text-h1" style={{ marginBottom: 'var(--space-8)' }}>Contact Us</h1>
            
            {isSubmitted ? (
              <div className="success-message" style={{ backgroundColor: 'var(--carbon-800)', padding: 'var(--space-8)', borderRadius: 'var(--radius-card)', border: '1px solid var(--nitro-blue)', textAlign: 'center' }}>
                <CheckCircle size={48} className="text-nitro-blue" style={{ margin: '0 auto var(--space-4)' }} />
                <h3 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>Message Received!</h3>
                <p style={{ color: 'var(--steel-400)' }}>Thanks for reaching out. We'll get back to you within 1 working day.</p>
                <button className="btn-secondary" style={{ marginTop: 'var(--space-6)' }} onClick={() => setIsSubmitted(false)}>Send Another Message</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input type="text" id="name" className="form-input" required />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input type="email" id="email" className="form-input" required />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="order">Order Number (Optional)</label>
                  <input type="text" id="order" className="form-input" placeholder="e.g. NIT-12345" />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea id="message" className="form-input" rows={5} required style={{ height: 'auto', paddingTop: 'var(--space-3)' }}></textarea>
                </div>
                
                <button type="submit" className="btn-primary" style={{ marginTop: 'var(--space-4)' }}>Send Message</button>
              </form>
            )}
          </div>

          <aside className="contact-info-side">
            <div className="info-card">
              <h2 className="text-h3" style={{ marginBottom: 'var(--space-6)' }}>Get in Touch</h2>
              
              <div className="info-item">
                <Mail className="text-nitro-blue" size={24} />
                <div>
                  <div className="text-white" style={{ fontWeight: 500 }}>Email Support</div>
                  <a href="mailto:support@nitrous.example.com" style={{ color: 'var(--nitro-blue)', textDecoration: 'none', fontWeight: 500 }}>support@nitrous.example.com</a>
                </div>
              </div>

              <div className="info-item">
                <Clock className="text-nitro-blue" size={24} />
                <div>
                  <div className="text-white" style={{ fontWeight: 500 }}>Response Time</div>
                  <div className="text-steel-400 text-small">Replies within 1 working day.</div>
                </div>
              </div>

              <hr className="summary-divider" />

              <div className="info-item">
                <MapPin className="text-nitro-blue" size={24} />
                <div>
                  <div className="text-white" style={{ fontWeight: 500 }}>Registered Office</div>
                  <div className="text-steel-400 text-small" style={{ lineHeight: 1.6, marginTop: 'var(--space-1)' }}>
                    <strong>Nitrous Component Ltd.</strong><br />
                    123 Voltage Way<br />
                    Tech District, London<br />
                    EC1A 1BB, United Kingdom<br />
                    <span style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>Company No. 12345678</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}
