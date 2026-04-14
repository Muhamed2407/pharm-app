import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("pharm_cart") || "[]"));

  useEffect(() => {
    localStorage.setItem("pharm_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (medicine) => {
    setItems((prev) => {
      const found = prev.find((item) => item._id === medicine._id);
      if (found) {
        return prev.map((item) => item._id === medicine._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const updateQty = (_id, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((item) => item._id === _id ? { ...item, quantity } : item));
  };

  const removeFromCart = (_id) => setItems((prev) => prev.filter((item) => item._id !== _id));
  const clearCart = () => setItems([]);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({ items, addToCart, updateQty, removeFromCart, clearCart, total }), [items, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
