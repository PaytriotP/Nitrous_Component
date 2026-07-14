import './TrustBar.css';

export default function TrustBar() {
  return (
    <div className="trust">
      <div className="wrap">
        <div className="pressure-rule"></div>
        <div className="trust-grid">
          <div className="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>
            <div><h3>Free UK delivery</h3><p>On orders over £40</p></div>
          </div>
          <div className="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            <div><h3>Same-day dispatch</h3><p>Order by 3pm weekdays</p></div>
          </div>
          <div className="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
            <div><h3>Secure payment</h3><p>Card, PayPal, 3DS2</p></div>
          </div>
          <div className="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7z"/><path d="M9 12l2 2 4-4"/></svg>
            <div><h3>Genuine parts</h3><p>Traceable, with datasheets</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
