import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("zyphone_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("zyphone_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    const isExist = wishlistItems.find((item) => item.id === product.id);
    if (!isExist) {
      setWishlistItems((prev) => [...prev, product]);
      toast.success("Added to Wishlist! ❤️");
    } else {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      toast.error("Removed from Wishlist");
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};