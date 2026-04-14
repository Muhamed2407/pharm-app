import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("pharm_cart") || "[]"));

  useEffect(() => {
    localStorage.setItem("pharm_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (medicine) => {
    setItems((prev) => {
      const found = prev.find((item) => item.id === medicine.id);
      if (found) {
        return prev.map((item) => item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const updateQty = (id, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const removeFromCart = (id) => setItems((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);
  const total = items.reduce((sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity, 0);

  const value = useMemo(() => ({ items, addToCart, updateQty, removeFromCart, clearCart, total }), [items, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
