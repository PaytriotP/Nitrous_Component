import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col foot-brand">
            <Link to="/" className="logo">
              <svg className="logo-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M4 24 L14 3 L17 3 L12 14 L20 14 L10 25 L13 16 L6 16 Z" fill="#2FB7FF"/>
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
