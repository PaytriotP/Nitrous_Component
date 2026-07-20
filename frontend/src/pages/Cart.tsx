import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, delivery, total } = useCart();

  return (
    <div className="cart-page">
      <hr className="pressure-rule" />
      <div className="container cart-container">
        <h1 className="text-h2" style={{ marginBottom: 'var(--space-8)' }}>Your Cart</h1>
        
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-items">
            <div className="cart-header text-label">
              <div className="ch-product">Product</div>
              <div className="ch-qty">Quantity</div>
              <div className="ch-total">Total</div>
            </div>

            {cartItems.length === 0 ? (
              <div style={{ padding: '32px 0', color: 'var(--steel-400)' }}>Your cart is empty.<br/><br/><Link to="/shop" className="btn-secondary">Start shopping</Link></div>
            ) : (
              cartItems.map((item, i) => (
                <CartItemRow 
                  key={i} 
                  item={item} 
                  updateQuantity={updateQuantity} 
                  removeFromCart={removeFromCart} 
                />
              ))
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary">
            <h2 className="text-h3" style={{ marginBottom: 'var(--space-6)' }}>Order Summary</h2>
            
            <div className="summary-row text-steel-400">
              <span>Subtotal</span>
              <span className="text-mono text-white">£{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row text-steel-400">
              <span>Delivery (UK)</span>
              <span className="text-mono text-white">{cartItems.length === 0 ? '-' : delivery === 0 ? 'FREE' : `£${delivery.toFixed(2)}`}</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row summary-total">
              <span>Total</span>
              <span className="text-mono">£{total.toFixed(2)}</span>
            </div>
            <div className="summary-row" style={{ marginTop: '4px', paddingTop: 0, justifyContent: 'flex-end', borderTop: 'none' }}>
              <span className="text-steel-400" style={{ fontSize: '12px' }}>Includes 20% VAT: £{(total - (total / 1.2)).toFixed(2)}</span>
            </div>

            <Link to="/checkout" style={{ textDecoration: 'none', pointerEvents: cartItems.length === 0 ? 'none' : 'auto' }}>
              <button className="btn-primary" style={{ width: '100%', marginBottom: 'var(--space-4)', opacity: cartItems.length === 0 ? 0.5 : 1 }} disabled={cartItems.length === 0}>
                Secure Checkout
              </button>
            </Link>

            <div className="summary-trust">
              <div className="st-item">
                <ShieldCheck size={16} className="text-nitro-blue" />
                <span>Encrypted Payment</span>
              </div>
              {cartItems.length > 0 && (
                <div className="st-item">
                  <Truck size={16} className="text-nitro-blue" />
                  <span>{delivery === 0 ? 'Qualifies for Free Delivery' : 'Spend £40 for Free Delivery'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemRow({ item, updateQuantity, removeFromCart }: any) {
  const [localQuantity, setLocalQuantity] = useState<number | string>(item.quantity);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setLocalQuantity('');
    } else {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) {
        setLocalQuantity(val);
        if (val >= 1) updateQuantity(item.product.part_number, val);
      }
    }
  };

  const handleBlur = () => {
    if (localQuantity === '' || (typeof localQuantity === 'number' && localQuantity < 1)) {
      setLocalQuantity(1);
      updateQuantity(item.product.part_number, 1);
    }
  };

  return (
    <div className="cart-item">
      <div className="ci-product">
        <Link to={`/product/${item.product.part_number.toLowerCase()}`} className="ci-image">
          {item.product.image_file ? (
            <img src={item.product.image_file.startsWith('http') ? item.product.image_file : `${item.product.image_file}`} alt={item.product.name} />
          ) : (
            <div className="placeholder-chip"></div>
          )}
        </Link>
        <div className="ci-details">
          <div className="text-mono text-steel-400" style={{ fontSize: '14px' }}>{item.product.part_number}</div>
          <Link to={`/product/${item.product.part_number.toLowerCase()}`} className="ci-name">{item.product.name}</Link>
          <div className="ci-unit-price text-mono text-steel-400">£{Number(item.product.price_gbp).toFixed(2)} each</div>
        </div>
      </div>

      <div className="ci-actions">
        <div className="quantity-stepper">
          <button className="stepper-btn" onClick={() => updateQuantity(item.product.part_number, item.quantity - 1)}><Minus size={16} /></button>
          <input 
            type="number" 
            className="stepper-input text-mono" 
            value={localQuantity} 
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <button 
            className="stepper-btn" 
            onClick={() => updateQuantity(item.product.part_number, item.quantity + 1)}
            disabled={item.quantity >= (Number(item.product.stock_qty) || 0)}
          >
            <Plus size={16} />
          </button>
        </div>
        <button className="ci-remove" onClick={() => removeFromCart(item.product.part_number)} aria-label="Remove item">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="ci-total text-mono">
        £{(Number(item.product.price_gbp) * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}
