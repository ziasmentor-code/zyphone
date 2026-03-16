// context/wishlistcontext.jsx
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        setWishlistItems(parsed);
        console.log("✅ Wishlist loaded:", parsed);
      } else {
        console.log("📦 No wishlist found in localStorage");
      }
    } catch (error) {
      console.error("❌ Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
      console.log("💾 Wishlist saved:", wishlistItems);
    }
  }, [wishlistItems, loading]);

  // Add to wishlist
  const addToWishlist = (product) => {
    if (!product || !product.id) {
      toast.error("Invalid product");
      return;
    }

    setWishlistItems(prev => {
      // Check if product already exists
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        toast.success("Already in wishlist ❤️");
        return prev;
      }
      
      const newWishlist = [...prev, { 
        id: product.id, 
        name: product.name || "Unnamed Product", 
        price: product.price || 0, 
        image: product.image || null,
        description: product.description || "No description available"
      }];
      
      toast.success("Added to wishlist! ❤️");
      return newWishlist;
    });
  };

  // Remove from wishlist
  const removeFromWishlist = (id) => {
    setWishlistItems(prev => {
      const newWishlist = prev.filter(item => item.id !== id);
      toast.success("Removed from wishlist");
      return newWishlist;
    });
  };

  // Check if item is in wishlist
  const isInWishlist = (id) => {
    return wishlistItems.some(item => item.id === id);
  };

  // Move to cart and remove from wishlist
  const moveToCart = (productId, addToCartFunction) => {
    const productToMove = wishlistItems.find(item => item.id === productId);
    
    if (productToMove) {
      // Add to cart
      addToCartFunction(productToMove);
      
      // Remove from wishlist
      setWishlistItems(prev => {
        const updated = prev.filter(item => item.id !== productId);
        return updated;
      });
      
      toast.success("Moved to cart! 🛒");
      return true;
    }
    return false;
  };

  // Move all items to cart
  const moveAllToCart = (addToCartFunction) => {
    if (wishlistItems.length === 0) {
      toast.error("Wishlist is empty");
      return false;
    }

    // Add all to cart
    wishlistItems.forEach(item => {
      addToCartFunction(item);
    });

    // Clear wishlist
    setWishlistItems([]);
    
    toast.success(`Moved ${wishlistItems.length} items to cart! 🛒`);
    return true;
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success("Wishlist cleared");
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      moveToCart,
      moveAllToCart,
      clearWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};