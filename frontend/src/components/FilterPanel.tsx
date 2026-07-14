import { Filter, X } from 'lucide-react';
import './FilterPanel.css';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  selectedCategories: string[];
  onCategoryChange: (cat: string) => void;
  inStockOnly: boolean;
  onInStockChange: (val: boolean) => void;
  minPrice: string;
  onMinPriceChange: (val: string) => void;
  maxPrice: string;
  onMaxPriceChange: (val: string) => void;
  selectedPackages: string[];
  onPackageChange: (pkg: string) => void;
}

export default function FilterPanel({ 
  isOpen, 
  onClose, 
  products,
  selectedCategories,
  onCategoryChange,
  inStockOnly,
  onInStockChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  selectedPackages,
  onPackageChange
}: FilterPanelProps) {

  // Dynamic Categories
  const categoryCounts = products.reduce((acc, p) => {
    const cat = p.category;
    if (cat) acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categories = Object.entries(categoryCounts as Record<string, number>)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Dynamic Package Types
  const packageSet = new Set<string>();
  products.forEach(p => {
    if (p.package_type) packageSet.add(p.package_type);
  });
  const packageTypes = Array.from(packageSet).sort();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="filter-overlay" onClick={onClose}></div>}
      
      <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3 className="filter-title">
            <Filter size={20} style={{ marginRight: '8px' }} /> Filters
          </h3>
          <button className="filter-close-btn" onClick={onClose} aria-label="Close filters">
            <X size={24} />
          </button>
        </div>

        <div className="filter-content">
          {/* Categories */}
          <div className="filter-group">
            <h4 className="filter-group-title">Category</h4>
            {categories.map(cat => (
              <label key={cat.name} className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat.name.toLowerCase())}
                  onChange={() => onCategoryChange(cat.name)}
                />
                <span className="checkbox-custom"></span>
                {cat.name} <span className="filter-count">({cat.count})</span>
              </label>
            ))}
          </div>

          <hr className="filter-divider" />

          {/* Stock */}
          <div className="filter-group">
            <h4 className="filter-group-title">Availability</h4>
            <label className="filter-checkbox">
              <input 
                type="checkbox" 
                checked={inStockOnly}
                onChange={(e) => onInStockChange(e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              In Stock Only
            </label>
          </div>

          <hr className="filter-divider" />

          {/* Price Range */}
          <div className="filter-group">
            <h4 className="filter-group-title">Price Range</h4>
            <div className="price-inputs">
              <div className="price-input-wrapper">
                <span className="price-currency">£</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="price-input" 
                  value={minPrice}
                  onChange={e => onMinPriceChange(e.target.value)}
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input-wrapper">
                <span className="price-currency">£</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="price-input" 
                  value={maxPrice}
                  onChange={e => onMaxPriceChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr className="filter-divider" />

          {/* Attributes */}
          <div className="filter-group">
            <h4 className="filter-group-title">Package Type</h4>
            <div className="filter-scrollable-list">
              {packageTypes.map(pkg => (
                <label key={pkg} className="filter-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedPackages.includes(pkg)}
                    onChange={() => onPackageChange(pkg)}
                  />
                  <span className="checkbox-custom"></span>
                  {pkg}
                </label>
              ))}
            </div>
          </div>

        </div>

        <div className="filter-actions">
          <button className="btn-primary filter-apply-btn" onClick={onClose}>Apply Filters</button>
        </div>
      </div>
    </>
  );
}
