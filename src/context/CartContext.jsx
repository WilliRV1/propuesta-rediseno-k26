import { createContext, useCallback, useContext, useRef, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);
  const [toast, setToast] = useState('');
  const timerRef = useRef();

  const addToCart = useCallback((name) => {
    setCount((n) => n + 1);
    setToast(`${name} quedó en el carrito.`);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(''), 2600);
  }, []);

  return (
    <CartContext.Provider value={{ count, toast, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
