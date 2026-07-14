import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleBlur = () => {
    // Small delay to allow click events on the button to fire
    setTimeout(() => {
      if (!query.trim()) {
        setIsOpen(false);
      }
    }, 150);
  };

  return (
    <div className={`search-container ${isOpen ? 'open' : ''}`}>
      {!isOpen ? (
        <button 
          className="icon-btn search-toggle" 
          aria-label="Open search"
          onClick={() => setIsOpen(true)}
        >
          <Search size={20} strokeWidth={2} />
        </button>
      ) : (
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon-inner" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search components..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={handleBlur}
            />
            {query && (
              <button 
                type="button" 
                className="search-clear-btn"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button 
            type="button" 
            className="icon-btn search-close-btn"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </form>
      )}
    </div>
  );
}
