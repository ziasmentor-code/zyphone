import React, { createContext, useState, useEffect } from "react";

// Initial state eppozhum empty array aayi vekkuka
export const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {}
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to cart function
  const addToCart = (product) => {
    if (!product) return;
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  // Remove from cart function
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // VALUE object eppozhum pass cheyyunnu ennu urappu varuthuka
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};