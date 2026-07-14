import { useState } from 'react';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSuccess(true);
      setEmail('');
      setTimeout(() => setIsSuccess(false), 3000);
    }
  };

  return (
    <div className="newsletter">
      <div className="wrap">
        <div className="news-panel">
          <div>
            <h2>Get the purge list</h2>
            <p>New stock, price drops and restock alerts. No filler, unsubscribe any time.</p>
          </div>
          <form className="news-form" onSubmit={handleSubmit}>
            <label htmlFor="nl-email" className="sr-only" style={{ position: 'absolute', left: '-9999px' }}>Email address</label>
            <input id="nl-email" type="email" placeholder="you@workshop.co.uk" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSuccess} />
            <button type="submit" className="btn btn-primary" disabled={isSuccess} style={{ backgroundColor: isSuccess ? '#10B981' : undefined, color: isSuccess ? '#FFF' : undefined, border: isSuccess ? 'none' : undefined }}>
              {isSuccess ? 'Charged!' : 'Charge up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
