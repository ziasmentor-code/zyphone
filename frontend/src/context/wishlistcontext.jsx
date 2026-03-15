// context/wishlistcontext.jsx
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // Load wishlist from localStorage - works for both logged in and guest users
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("guest_wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("guest_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        toast.success("Already in wishlist ❤️");
        return prev;
      }
      toast.success("Added to wishlist!");
      return [...prev, { ...product }];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => {
      toast.success("Removed from wishlist");
      return prev.filter(item => item.id !== id);
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem("guest_wishlist");
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};