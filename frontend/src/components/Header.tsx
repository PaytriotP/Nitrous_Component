import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import SearchBar from './SearchBar';
import './Header.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <>
      <header>
        <div className="wrap nav">
          <Link to="/" className="logo" aria-label="Nitrous Component home">
            <svg className="logo-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <polygon points="50,3 92,26 92,74 50,97 8,74 8,26" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
              <polygon points="58,20 30,56 48,56 42,82 72,44 52,44" fill="var(--nitro-blue)" />
            </svg>
            Nitrous<span className="n2o">Component</span>
          </Link>

          <nav aria-label="Main">
            <ul className="nav-links">
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>

          <div className="nav-actions">
            <SearchBar />

            <Link to="/cart" className="icon-btn" aria-label="Shopping Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>}
            </Link>
            
            <button 
              className="icon-btn menu-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-section">
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--nitro-blue)' }}>Shop All</Link>
            <div className="mobile-menu-cats" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '16px', marginTop: '16px' }}>
              <Link to="/shop/semiconductors" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '18px', borderBottom: 'none', paddingBottom: 0 }}>Semiconductors</Link>
              <Link to="/shop/passives" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '18px', borderBottom: 'none', paddingBottom: 0 }}>Passives</Link>
              <Link to="/shop/connectors" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '18px', borderBottom: 'none', paddingBottom: 0 }}>Connectors</Link>
              <Link to="/shop/boards & modules" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '18px', borderBottom: 'none', paddingBottom: 0 }}>Boards & Modules</Link>
              <Link to="/shop/power" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '18px', borderBottom: 'none', paddingBottom: 0 }}>Power</Link>
              <Link to="/shop/tools & consumables" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '18px', borderBottom: 'none', paddingBottom: 0 }}>Tools & Consumables</Link>
            </div>
          </div>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </>
  );
}
