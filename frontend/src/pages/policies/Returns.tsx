import './PolicyLayout.css';

export default function Returns() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1 className="policy-title">Return Policy</h1>
        
        <div className="policy-content">
          <p>We stand by the quality of our genuine components. If something isn't right, here is how we handle returns.</p>

          <h2>30-Day Returns</h2>
          <p>You may return any unused components in their original, sealed static-safe packaging within 30 days of delivery for a full refund. We cannot accept returns on components that have been soldered, powered on, or removed from their anti-static bags (unless defective).</p>

          <h2>Defective Components</h2>
          <p>If you receive a defective item, please contact our support team within 14 days. We will arrange a replacement or refund and cover the return shipping costs. You may be asked to provide testing details or photos.</p>

          <h2>How to Return</h2>
          <ol>
            <li>Contact <strong>support@nitrous.example.com</strong> with your order number.</li>
            <li>We will issue an RMA (Return Merchandise Authorization) number.</li>
            <li>Pack the items securely and include the RMA number on the outside of the box.</li>
            <li>Ship it back to our warehouse.</li>
          </ol>

          <h2>Refund Processing</h2>
          <p>Once we receive and inspect your return, refunds are processed to the original payment method within 3-5 working days.</p>

          <h2>Return Address</h2>
          <p><strong>Nitrous Returns</strong><br />RMA: [Your RMA Number]<br />123 Voltage Way<br />Tech District, London<br />EC1A 1BB, United Kingdom</p>
        </div>
      </div>
    </div>
  );
}
