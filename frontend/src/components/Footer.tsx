import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col foot-brand">
            <Link to="/" className="logo">
              <svg className="logo-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <polygon points="50,3 92,26 92,74 50,97 8,74 8,26" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
                <polygon points="58,20 30,56 48,56 42,82 72,44 52,44" fill="var(--nitro-blue)" />
              </svg>
              Nitrous<span className="n2o">Component</span>
            </Link>
            <p>UK electronics components, dispatched at full pressure. Quality parts, comprehensive datasheets, same-day shipping.</p>
          </div>
          
          <div className="foot-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop">Semiconductors</Link></li>
              <li><Link to="/shop">Passives</Link></li>
              <li><Link to="/shop">Connectors</Link></li>
              <li><Link to="/shop">Boards &amp; Modules</Link></li>
              <li><Link to="/shop">Power</Link></li>
              <li><Link to="/shop">Tools</Link></li>
            </ul>
          </div>
          
          <div className="foot-col">
            <h4>Help</h4>
            <ul>
              <li><Link to="/delivery">Delivery &amp; Returns</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/tracking">Order tracking</Link></li>
            </ul>
          </div>
          
          <div className="foot-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="foot-legal">
          <p>© 2026 NITROUS COMPONENT LTD &middot; REGISTERED IN ENGLAND &amp; WALES &middot; Company No. 12345678 &middot; 123 Voltage Way, Tech District, London, EC1A 1BB</p>
          <div className="pay-icons">
            <span>VISA</span><span>MC</span><span>AMEX</span><span>PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
