import { useState, useEffect } from 'react';

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    fetch(`${baseUrl}/store/products?fields=id,title,handle,thumbnail,description,metadata,*variants,*variants.prices`, {
      headers: {
        'x-publishable-api-key': import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_68806a5ae2a0ee19d8364cd06d05ddac4e327a2efeef0b82c5c5a0ba059c043b'
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
          const price_gbp = priceObj.amount ? (priceObj.amount).toString() : '0.00';
          
          // Always prefer the bundled images defined in metadata because Railway's ephemeral file system loses uploaded thumbnails
          let finalImage = p.metadata?.image_file || p.thumbnail || '';
          
          if (finalImage && !finalImage.startsWith('http')) {
            // Ensure leading slash is stripped
            finalImage = finalImage.replace(/^\/+/, '');
            // Force it to load from the deployed production Vercel frontend so it works even on localhost
            finalImage = `https://nitrous-component.vercel.app/${finalImage}`;
          }

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
            image_file: finalImage,
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
