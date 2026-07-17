import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();
  
  const isDepleted = product.stock_status === 'DEPLETED';
  const productSlug = (product.part_number || '').toLowerCase();
  
  const cartItem = cartItems.find(item => item.product.part_number === product.part_number);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  
  return (
    <article className={`prod-card ${isDepleted ? 'card-out' : ''}`}>
      <Link to={`/product/${productSlug}`} className="prod-img">
        {product.image_file && !product.image_file.endsWith('.svg') ? (
          <img src={product.image_file.startsWith('http') ? product.image_file : `/${product.image_file}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg width="70" height="50" viewBox="0 0 70 50" aria-hidden="true"><rect x="20" y="12" width="30" height="26" rx="2" fill="#131824"/><g stroke="#8A94A8" strokeWidth="2"><line x1="25" y1="6" x2="25" y2="12"/><line x1="32" y1="6" x2="32" y2="12"/><line x1="39" y1="6" x2="39" y2="12"/><line x1="46" y1="6" x2="46" y2="12"/><line x1="25" y1="38" x2="25" y2="44"/><line x1="32" y1="38" x2="32" y2="44"/><line x1="39" y1="38" x2="39" y2="44"/><line x1="46" y1="38" x2="46" y2="44"/></g><circle cx="25" cy="17" r="1.8" fill="#F2F5F9"/></svg>
        )}
      </Link>
      
      {!isDepleted && (
        <button 
          className={`quick-add ${qtyInCart > 0 ? 'has-qty' : ''}`} 
          onClick={(e) => { e.preventDefault(); addToCart(product, 1); }} 
          aria-label={`Add ${product.name} to cart`}
        >
          {qtyInCart > 0 ? qtyInCart : '+'}
        </button>
      )}
      
      <span className="part-no">
        <Link to={`/product/${productSlug}`} style={{textDecoration: 'none', color: 'inherit'}}>
          {product.part_number} {product.package_type && <>&middot; {product.package_type}</>}
        </Link>
      </span>
      
      <h3 className="prod-name">
        <Link to={`/product/${productSlug}`} style={{textDecoration: 'none', color: 'inherit'}}>{product.name}</Link>
      </h3>
      
      <div className="prod-bottom">
        <span className="price">£{Number(product.price_gbp).toFixed(2)}</span>
        
        <div className="prod-stock">
          {product.stock_status === 'PRESSURISED' && <span className="badge badge-pressurised" title="In Stock - Ready to ship">PRESSURISED</span>}
          {product.stock_status === 'VENTING' && <span className="badge badge-venting" title="Low Stock - Selling fast">VENTING &middot; {product.stock_qty} LEFT</span>}
          {product.stock_status === 'DEPLETED' && <span className="badge badge-depleted" title="Out of Stock - Awaiting delivery">DEPLETED</span>}
        </div>
      </div>
    </article>
  );
}
