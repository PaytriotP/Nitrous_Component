import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Product {
  part_number: string;
  name: string;
  category: string;
  package?: string;
  price_gbp: number;
  stock_status: string;
  stock_qty: number;
  image_file?: string;
  [key: string]: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (partNumber: string) => void;
  updateQuantity: (partNumber: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  delivery: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nitrous_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('nitrous_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.part_number === product.part_number);
      const newQuantity = existing ? existing.quantity + quantity : quantity;
      const maxStock = Number(product.stock_qty) || 0;
      const finalQuantity = newQuantity > maxStock ? maxStock : newQuantity;

      if (existing) {
        return prev.map(item => 
          item.product.part_number === product.part_number
            ? { ...item, quantity: finalQuantity }
            : item
        );
      }
      return [...prev, { product, quantity: finalQuantity }];
    });
  };

  const removeFromCart = (partNumber: string) => {
    setCartItems(prev => prev.filter(item => item.product.part_number !== partNumber));
  };

  const updateQuantity = (partNumber: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(partNumber);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.product.part_number === partNumber) {
        const maxStock = Number(item.product.stock_qty) || 0;
        const finalQuantity = quantity > maxStock ? maxStock : quantity;
        return { ...item, quantity: finalQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product.price_gbp) * item.quantity), 0);
  const delivery = subtotal >= 40 || cartItems.length === 0 ? 0 : 4.95;
  const total = subtotal + delivery;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      subtotal,
      delivery,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
