// context/cartcontext.jsx
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("zyphone_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("zyphone_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        toast.success("Item quantity updated");
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        );
      }
      toast.success("Added to Cart!");
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  // ✅ Add clearCart function
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("zyphone_cart");
    console.log("Cart cleared");
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prev) =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart,
      clearCart,  // ✅ Add this
      updateQuantity 
    }}>
      {children}
    </CartContext.Provider>
  );
};