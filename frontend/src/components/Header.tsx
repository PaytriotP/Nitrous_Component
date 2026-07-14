import { Link } from 'react-router-dom';
import { useState } from 'react';
import { User, ShoppingCart, Menu } from 'lucide-react';
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
            <svg className="logo-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M4 24 L14 3 L17 3 L12 14 L20 14 L10 25 L13 16 L6 16 Z" fill="#2FB7FF"/>
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
            <Link to="/account" className="icon-btn" aria-label="Account">
              <User size={20} strokeWidth={2} />
            </Link>
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
        <div className="mobile-menu" style={{ background: 'var(--carbon-800)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--white)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase' }}>Shop</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--white)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase' }}>About</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--white)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase' }}>Contact</Link>
        </div>
      )}
    </>
  );
}
