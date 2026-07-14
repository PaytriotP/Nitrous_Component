import './PolicyLayout.css';

export default function Terms() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1 className="policy-title">Terms of Service</h1>
        
        <div className="policy-content">
          <p>Last updated: July 2, 2026</p>
          <p>Welcome to Nitrous. By accessing or using our website and purchasing our components, you agree to be bound by these terms.</p>

          <h2>Order Acceptance</h2>
          <p>All orders are subject to acceptance and availability. We reserve the right to cancel orders due to stock discrepancies, pricing errors, or suspected fraud. If an order is canceled, a full refund will be issued immediately.</p>

          <h2>Pricing and Payment</h2>
          <p>All prices include UK VAT unless otherwise stated. Prices are subject to change without notice. We accept major credit cards and secure payments. Your payment method will be charged at the time of order placement.</p>

          <h2>Product Specifications</h2>
          <p>We make every effort to ensure datasheets and specifications are accurate. However, manufacturers may update component revisions. Nitrous is not liable for damages resulting from the use of components beyond their specified ratings.</p>

          <h2>Distance Selling & Cancellations</h2>
          <p>Under UK distance selling regulations, you have the right to cancel your order within 14 days of receiving your goods, provided they are unused and in original packaging.</p>

          <h2>Company Details</h2>
          <p><strong>Nitrous Components Ltd.</strong><br />123 Voltage Way<br />Tech District, London<br />EC1A 1BB, United Kingdom<br />Company Registration: 12345678</p>
        </div>
      </div>
    </div>
  );
}
