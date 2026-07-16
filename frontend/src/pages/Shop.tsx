import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Grid, List } from 'lucide-react';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import './Shop.css';

export default function Shop() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const { products, loading, error } = useProducts();

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Popularity');

  // Sync category slug with selected categories
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategories([decodeURIComponent(categorySlug).toLowerCase()]);
    } else {
      setSelectedCategories([]);
    }
  }, [categorySlug]);

  // Remove early return to preserve layout during loading

  // Handlers
  const handleCategoryChange = (cat: string) => {
    const catLower = cat.toLowerCase();
    setSelectedCategories(prev => 
      prev.includes(catLower) ? prev.filter(c => c !== catLower) : [...prev, catLower]
    );
    setCurrentPage(1);
  };

  const handlePackageChange = (pkg: string) => {
    setSelectedPackages(prev => 
      prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg]
    );
    setCurrentPage(1);
  };

  // Apply filters
  let filteredProducts = products;

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      selectedCategories.includes((p.category || '').toLowerCase())
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.part_number || '').toLowerCase().includes(q)
    );
  }

  if (inStockOnly) {
    filteredProducts = filteredProducts.filter(p => parseInt(p.stock_qty) > 0);
  }

  if (minPrice !== '') {
    filteredProducts = filteredProducts.filter(p => parseFloat(p.price_gbp) >= parseFloat(minPrice));
  }

  if (maxPrice !== '') {
    filteredProducts = filteredProducts.filter(p => parseFloat(p.price_gbp) <= parseFloat(maxPrice));
  }

  if (selectedPackages.length > 0) {
    filteredProducts = filteredProducts.filter(p => selectedPackages.includes(p.package_type));
  }

  // Sort
  if (sortBy === 'Price: Low to High') {
    filteredProducts.sort((a, b) => parseFloat(a.price_gbp) - parseFloat(b.price_gbp));
  } else if (sortBy === 'Price: High to Low') {
    filteredProducts.sort((a, b) => parseFloat(b.price_gbp) - parseFloat(a.price_gbp));
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="shop-page">
      <hr className="pressure-rule" />
      <div className="container shop-container">
        
        {/* Filter Sidebar */}
        <aside className="shop-sidebar">
          <FilterPanel 
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)} 
            products={products}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            inStockOnly={inStockOnly}
            onInStockChange={(val) => { setInStockOnly(val); setCurrentPage(1); }}
            minPrice={minPrice}
            onMinPriceChange={(val) => { setMinPrice(val); setCurrentPage(1); }}
            maxPrice={maxPrice}
            onMaxPriceChange={(val) => { setMaxPrice(val); setCurrentPage(1); }}
            selectedPackages={selectedPackages}
            onPackageChange={handlePackageChange}
          />
        </aside>

        {/* Main Content */}
        <main className="shop-main">
          
          <div className="shop-header">
            <div>
              {searchQuery ? (
                <h1 className="text-h2" style={{ marginBottom: 'var(--space-2)' }}>
                  Search Results: <span style={{ color: 'var(--nitro-blue)' }}>"{searchQuery}"</span>
                </h1>
              ) : (
                <h1 className="text-h2" style={{ marginBottom: 'var(--space-2)' }}>
                  {categorySlug ? decodeURIComponent(categorySlug).toUpperCase() : 'ALL COMPONENTS'}
                </h1>
              )}
              <div className="results-count">{loading ? '-' : filteredProducts.length} COMPONENTS</div>
            </div>

            <div className="shop-controls">
              <button 
                className="btn-secondary mobile-filter-toggle"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter size={16} style={{ marginRight: '8px' }} /> Filters
              </button>

              <div className="sort-dropdown">
                <span className="sort-label">Sort by:</span>
                <div className="sort-select-wrapper">
                  <select className="sort-select" value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}>
                    <option>Popularity</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                  <ChevronDown size={16} className="sort-icon" />
                </div>
              </div>

              <div className="view-toggle">
                <button 
                  className={`icon-btn ${!isListView ? 'active' : ''}`} 
                  onClick={() => setIsListView(false)}
                  aria-label="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`icon-btn ${isListView ? 'active' : ''}`} 
                  onClick={() => setIsListView(true)}
                  aria-label="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--steel-400)' }}>
              <div className="spinner" style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid var(--carbon-700)', borderTopColor: 'var(--nitro-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
              <p>Scanning inventory...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', color: 'red' }}>Error: {error}</div>
          ) : (
            <>
              <div className={`product-grid shop-product-grid ${isListView ? 'list-view' : ''}`}>
                {currentProducts.map((product, i) => (
                  <ProductCard 
                    key={product.id || i}
                    product={product}
                  />
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="empty-state">
                  <h3 className="text-h3">No matches at this pressure.</h3>
                  <p style={{ color: 'var(--steel-400)' }}>Loosen a filter.</p>
                  <button className="btn-secondary" style={{ marginTop: 'var(--space-4)' }} onClick={() => {
                    setSelectedCategories([]);
                    setInStockOnly(false);
                    setMinPrice('');
                    setMaxPrice('');
                    setSelectedPackages([]);
                    if (searchParams.has('q')) {
                      setSearchParams({});
                    }
                  }}>Reset Filters</button>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="btn-secondary pagination-btn" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &laquo; Prev
              </button>
              <div className="pagination-pages">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    className={`pagination-page ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                className="btn-secondary pagination-btn" 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next &raquo;
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
