import { useState } from 'react';
import { Minus, Plus, CreditCard, Wallet, Download } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SpecTable from '../components/SpecTable';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../hooks/useProducts';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');

  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => Math.min(Number(product?.stock_qty) || 0, q + 1));

  const { products: productsData, loading, error } = useProducts();

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading component...</div>;
  if (error) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: 'red' }}>Error loading component: {error}</div>;

  // Find product by matching slug with lowercase part number
  const product = productsData.find(p => p.part_number.toLowerCase() === slug);
  if (!product) {
    return (
      <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <h1 className="text-hero" style={{marginBottom: '1rem', color: 'var(--steel-400)'}}>404</h1>
        <p className="text-body" style={{marginBottom: '2rem'}}>Component not found at this pressure.</p>
        <Link to="/shop" className="btn-secondary">Return to Catalog</Link>
      </div>
    );
  }
  const isDepleted = product.stock_status === 'DEPLETED';

  // Mock related products
  const relatedProducts = productsData.filter(p => p.category === product.category && p.part_number !== product.part_number).slice(0, 4);
  if (relatedProducts.length === 0) relatedProducts.push(...productsData.slice(0, 4));

  const specs = [
    { key: 'Package Type', value: product.package_type || 'N/A' },
    { key: 'Value/Rating', value: product.value_rating || 'N/A' },
    { key: 'Tolerance', value: product.tolerance || 'N/A' },
    { key: 'Quantity Per Pack', value: product.pack_qty || '1' },
    { key: 'Manufacturer', value: product.manufacturer || 'N/A' }
  ];
  if (product.datasheet_url) {
    specs.push({ key: 'Datasheet', value: <a href={product.datasheet_url} className="datasheet-link" target="_blank" rel="noreferrer"><Download size={16} /> Datasheet.pdf</a> });
  }

  const tabs = ['Description', 'Specifications', 'Delivery', 'Reviews'];

  return (
    <div className="product-detail-page">
      <hr className="pressure-rule" />
      
      {/* Top Section: Gallery & Buy Panel */}
      <section className="container pd-top-section">
        <div className="pd-gallery">
          <div className="pd-main-image">
            {product.image_file && !product.image_file.endsWith('.svg') ? (
              <img src={product.image_file.startsWith('http') ? product.image_file : `/${product.image_file}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-card)' }} />
            ) : (
              <div className="placeholder-chip" style={{ width: '80px', height: '80px', margin: 'auto' }}></div>
            )}
          </div>
        </div>

        <div className="pd-buy-panel">
          <div className="text-mono text-steel-400" style={{ fontSize: '16px', marginBottom: 'var(--space-2)' }}>{product.part_number}</div>
          <h1 className="text-hero" style={{ fontSize: 'var(--text-h2-size)', marginBottom: 'var(--space-4)' }}>{product.name}</h1>
          <div className="text-mono" style={{ fontSize: '32px', color: 'var(--white)', marginBottom: 'var(--space-4)' }}>£{Number(product.price_gbp).toFixed(2)}</div>
          
          <div style={{ marginBottom: 'var(--space-8)' }}>
            {product.stock_status === 'PRESSURISED' && <span className="badge badge-pressurised" title="In Stock - Ready to ship">PRESSURISED</span>}
            {product.stock_status === 'VENTING' && <span className="badge badge-venting" title="Low Stock - Selling fast">VENTING &middot; {product.stock_qty} LEFT</span>}
            {product.stock_status === 'DEPLETED' && <span className="badge badge-depleted" title="Out of Stock - Awaiting delivery">DEPLETED</span>}
          </div>

          <div className="pd-add-to-cart">
            <div className="quantity-stepper">
              <button className="stepper-btn" onClick={handleDecrease}><Minus size={16} /></button>
              <input 
                type="number" 
                className="stepper-input text-mono" 
                value={quantity === 0 ? '' : quantity} 
                onChange={(e) => {
                  if (e.target.value === '') {
                    setQuantity(0);
                  } else {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setQuantity(val);
                  }
                }} 
                onBlur={() => {
                  const maxStock = Number(product.stock_qty) || 0;
                  if (quantity < 1) setQuantity(1);
                  else if (quantity > maxStock) setQuantity(maxStock);
                }}
              />
              <button className="stepper-btn" onClick={handleIncrease} disabled={isDepleted}><Plus size={16} /></button>
            </div>
            <button 
              className="btn-primary pd-cart-btn" 
              onClick={() => addToCart(product, quantity)}
              disabled={isDepleted}
            >
              {isDepleted ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="pd-delivery-line">
            Order by 3pm, ships today
          </div>

          <div className="pd-payment-icons">
            <CreditCard size={24} />
            <Wallet size={24} />
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="pd-tabs-section">
        <div className="container">
          <div className="pd-tabs-header">
            {tabs.map(tab => (
              <button 
                key={tab} 
                className={`pd-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="pd-tab-content">
            {activeTab === 'Description' && (
              <div className="prose">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p>No description available.</p>
                )}
              </div>
            )}
            
            {activeTab === 'Specifications' && (
              <SpecTable specs={specs} />
            )}

            {activeTab === 'Delivery' && (
              <div className="prose">
                <p><strong>UK Standard Delivery:</strong> 2-3 working days. Free on orders over £40.</p>
                <p><strong>Next Day Delivery:</strong> Order before 3pm Monday-Friday for delivery the next working day.</p>
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="prose">
                <p>No reviews yet at this pressure.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="pd-related-section">
        <div className="container">
          <h2 className="text-h2" style={{ marginBottom: 'var(--space-8)' }}>Related Components</h2>
          <div className="product-grid">
            {relatedProducts.map((rp, i) => (
              <ProductCard 
                key={i}
                product={rp}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
