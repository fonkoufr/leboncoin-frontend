import { createContext, useContext, useState, useCallback, FC, ReactNode } from 'react';
import { Annonce } from '../services/api';

export interface CartItem {
  annonce: Annonce;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (annonce: Annonce) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const addToCart = useCallback((annonce: Annonce) => {
    setItems(prev => {
      const existing = prev.find(i => i.annonce.id === annonce.id);
      const next = existing
        ? prev.map(i => i.annonce.id === annonce.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { annonce, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.annonce.id !== id);
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cart');
  }, []);

  const total = items.reduce((sum, i) => sum + i.annonce.prix * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
