import './PolicyLayout.css';

export default function PrivacyPolicy() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1 className="policy-title">Privacy Policy</h1>
        
        <div className="policy-content">
          <p>Last updated: July 2, 2026</p>
          <p>At Nitrous, we take your privacy as seriously as our supply chain. This policy outlines how we collect, use, and protect your personal information.</p>

          <h2>Information Collection</h2>
          <p>We collect information you provide directly to us when you make a purchase, create an account, or contact support. This includes:</p>
          <ul>
            <li>Name and contact details</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely via our payment providers)</li>
            <li>Purchase history and saved carts</li>
          </ul>

          <h2>Use of Information</h2>
          <p>Your data is used strictly for fulfilling orders and improving the Nitrous experience:</p>
          <ul>
            <li>Processing transactions and sending order updates</li>
            <li>Providing customer support and technical assistance</li>
            <li>Sending marketing communications (only if you've opted into the newsletter)</li>
          </ul>

          <h2>Data Protection</h2>
          <p>We employ industry-standard encryption and security protocols. We do not sell your personal data to third-party advertisers. Payment data is never stored on our servers.</p>

          <h2>Contact Us</h2>
          <p>For privacy-related inquiries, please contact us at:</p>
          <p><strong>Nitrous Components Ltd.</strong><br />123 Voltage Way<br />Tech District, London<br />EC1A 1BB, United Kingdom<br />privacy@nitrous.example.com</p>
        </div>
      </div>
    </div>
  );
}
