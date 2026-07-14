import { useState, useEffect } from 'react';

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    fetch(`${baseUrl}/store/products?fields=*metadata,*variants.prices`, {
      headers: {
        'x-publishable-api-key': 'pk_c0e5b8ca984e56a688bb912363164745887e7d2f15dd593d63f5f89bf6fda9e5'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        const mappedProducts = (data.products || []).map((p: any) => {
          const variant = p.variants?.[0] || {};
          const priceObj = variant.calculated_price || (variant.prices && variant.prices[0]) || {};
          const price_gbp = priceObj.amount ? (priceObj.amount / 100).toString() : '0.00';
          
          return {
            part_number: variant.sku || p.handle,
            name: p.title,
            description: p.description || '',
            category: p.metadata?.category || '',
            manufacturer: p.metadata?.manufacturer || '',
            package_type: p.metadata?.package_type || '',
            value_rating: p.metadata?.value_rating || '',
            tolerance: p.metadata?.tolerance || '',
            pack_qty: p.metadata?.pack_qty || '1',
            stock_qty: p.metadata?.stock_qty || '0',
            price_gbp: price_gbp,
            stock_status: p.metadata?.stock_status || 'DEPLETED',
            image_file: p.metadata?.image_file || '',
            datasheet_url: p.metadata?.datasheet_url || ''
          };
        });
        setProducts(mappedProducts);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}
