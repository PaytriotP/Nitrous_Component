import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import CategoryTile from '../components/CategoryTile';
import ProductCard from '../components/ProductCard';
import USPCard from '../components/USPCard';
import Newsletter from '../components/Newsletter';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useEffect } from 'react';

export default function Home() {
  const { products, loading, error } = useProducts();
  const featuredProducts = products.slice(0, 4);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    document.querySelectorAll('.fade-up').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [products, loading]);

  const categories = [
    { title: 'Semiconductors', fallbackImage: '/images/cat-semiconductors.svg', fallbackLines: 3120 },
    { title: 'Passives', fallbackImage: '/images/cat-passives.svg', fallbackLines: 4860 },
    { title: 'Connectors', fallbackImage: '/images/cat-connectors.svg', fallbackLines: 1540 },
    { title: 'Boards & Modules', fallbackImage: '/images/cat-boards-modules.svg', fallbackLines: 920 },
    { title: 'Power', fallbackImage: '/images/cat-power.svg', fallbackLines: 1210 },
    { title: 'Tools & Consumables', fallbackImage: '/images/cat-tools-consumables.svg', fallbackLines: 760 },
  ];

  const getCategoryLines = (title: string, fallback: number) => {
    if (loading || error || products.length === 0) return fallback;
    const count = products.filter(p => p.category === title).length;
    return count > 0 ? count : fallback;
  };

  const getCategoryImageUrl = (title: string, fallback: string) => {
    if (loading || error || products.length === 0) return fallback;
    const productWithImage = products.find(p => 
      (p.category || '').toLowerCase() === title.toLowerCase() && 
      p.image_file &&
      !p.image_file.endsWith('.svg')
    );
    if (!productWithImage) return fallback;
    return productWithImage.image_file.startsWith('http') ? productWithImage.image_file : `/${productWithImage.image_file}`;
  };

  return (
    <main>
      <Hero />
      <TrustBar />
      
      {/* CATEGORIES */}
      <section id="shop" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head fade-up" style={{ marginBottom: '48px' }}>
            <div className="pressure-rule"></div>
            <h2>Shop by category</h2>
            <p className="sub" style={{ color: 'var(--steel-400)', marginTop: '8px' }}>Six lanes. Pick yours.</p>
          </div>
          <div className="cat-grid">
            {categories.map((cat, i) => (
              <div key={i} className={`fade-up delay-${(i % 3) + 1}`}>
                <CategoryTile 
                  title={cat.title} 
                  imageSrc={getCategoryImageUrl(cat.title, cat.fallbackImage)} 
                  link={`/shop/${cat.title.toLowerCase()}`} 
                  lines={getCategoryLines(cat.title, cat.fallbackLines)} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="best-sellers-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header fade-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <div>
              <div className="pressure-rule"></div>
              <h2 className="text-h2">Top Rated Components</h2>
            </div>
            <Link to="/shop" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          {loading ? (
             <div style={{ textAlign: 'center', padding: '2rem 0' }}>Loading best sellers...</div>
          ) : error ? (
            <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
              <p>Error loading products: {error}</p>
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product, i) => (
                <div key={i} className={`fade-up delay-${(i % 4) + 1}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY NITROUS */}
      <section id="why" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head fade-up" style={{ marginBottom: '48px' }}>
            <div className="pressure-rule"></div>
            <h2>Why Nitrous</h2>
          </div>
          <div className="usp-grid">
            <div className="fade-up delay-1">
              <USPCard 
                icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7z"/><path d="M9 12l2 2 4-4"/></svg>}
                title="Quality stock"
                body="Carefully sourced from reliable suppliers. We maintain strict quality control on all components we dispatch."
              />
            </div>
            <div className="fade-up delay-2">
              <USPCard 
                icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>}
                title="Same-day dispatch"
                body="Order by 3pm on a weekday and it leaves the shelf that afternoon. Live stock counts, no backorder surprises."
              />
            </div>
            <div className="fade-up delay-3">
              <USPCard 
                icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 17h7"/></svg>}
                title="Datasheets available"
                body="Full spec table and manufacturer datasheet on most product lines. Package, tolerance, rating — before you buy."
              />
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
