// pages/wishlist.jsx
import React, { useContext, useState } from "react";
import { WishlistContext } from "../context/wishlistcontext";
import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [imageErrors, setImageErrors] = useState({});

  // ✅ FIXED: Safe image URL function
  const getImageUrl = (item) => {
    const image = item?.image || item?.product?.image;
    
    console.log('Wishlist image path:', image);
    
    // If no image
    if (!image) {
      return "https://via.placeholder.com/200/1a1a1a/666?text=No+Image";
    }
    
    // If it's already a full URL
    if (typeof image === 'string' && image.startsWith('http')) {
      return image;
    }
    
    // If it's base64
    if (typeof image === 'string' && image.startsWith('data:image')) {
      return image;
    }
    
    // Handle Django media files
    const baseURL = 'http://127.0.0.1:8000';
    if (typeof image === 'string' && image.startsWith('/media/')) {
      return `${baseURL}${image}`;
    }
    
    // Default case
    return `${baseURL}/media/${image}`;
  };

  const handleImageError = (itemId) => {
    console.log('Image failed to load for item:', itemId);
    setImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const handleAddToCart = (item) => {
    if (!user) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description
    });
    
    toast.success("Added to cart!");
  };

  const handleRemove = (id, name) => {
    removeFromWishlist(id);
    toast.success(`${name} removed from wishlist`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button 
            onClick={() => navigate(-1)} 
            style={styles.backButton}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={styles.title}>My Wishlist</h1>
          <div style={styles.heartIcon}>
            <Heart size={24} fill={wishlistItems.length > 0 ? "#ef4444" : "none"} color="#ef4444" />
          </div>
        </div>

        {/* Wishlist Items */}
        {!wishlistItems || wishlistItems.length === 0 ? (
          <div style={styles.emptyWishlist}>
            <Heart size={80} color="#333" strokeWidth={1.5} />
            <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
            <p style={styles.emptyText}>
              Save your favorite items here and they'll appear when you're ready to shop.
            </p>
            <button 
              onClick={() => navigate("/products")}
              style={styles.shopBtn}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {wishlistItems.map((item) => {
              const imgUrl = imageErrors[item.id] 
                ? "https://via.placeholder.com/200/1a1a1a/666?text=No+Image"
                : getImageUrl(item);

              return (
                <div key={item.id} style={styles.card}>
                  {/* Image */}
                  <div style={styles.imageContainer}>
                    <img 
                      src={imgUrl}
                      alt={item.name || 'Product'}
                      style={styles.image}
                      onError={() => handleImageError(item.id)}
                    />
                    
                    {/* Remove button */}
                    <button 
                      onClick={() => handleRemove(item.id, item.name)}
                      style={styles.removeBtn}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Details */}
                  <div style={styles.details}>
                    <h3 style={styles.itemName}>{item.name || 'Unnamed Product'}</h3>
                    
                    {item.description && (
                      <p style={styles.description}>
                        {item.description.substring(0, 60)}...
                      </p>
                    )}
                    
                    <p style={styles.price}>
                      ₹{Number(item.price || 0).toLocaleString('en-IN')}
                    </p>

                    {/* Actions */}
                    <div style={styles.actions}>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        style={styles.addToCartBtn}
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => navigate(`/product/${item.id}`)}
                        style={styles.viewBtn}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    padding: "40px 20px"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto"
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "40px"
  },
  backButton: {
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    transition: "all 0.2s"
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    margin: 0,
    borderLeft: "4px solid #3b82f6",
    paddingLeft: "20px"
  },
  heartIcon: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  emptyWishlist: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#1a1a1a",
    borderRadius: "16px",
    border: "1px solid #2a2a2a"
  },
  emptyTitle: {
    fontSize: "1.8rem",
    marginTop: "20px",
    marginBottom: "10px",
    fontWeight: "500"
  },
  emptyText: {
    color: "#888",
    marginBottom: "30px",
    fontSize: "1rem"
  },
  shopBtn: {
    padding: "15px 40px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#1a1a1a",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #2a2a2a",
    transition: "transform 0.2s"
  },
  imageContainer: {
    position: "relative",
    height: "200px",
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    maxWidth: "100%",
    maxHeight: "180px",
    objectFit: "contain"
  },
  removeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(0,0,0,0.5)",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    transition: "all 0.2s"
  },
  details: {
    padding: "15px"
  },
  itemName: {
    fontSize: "1.1rem",
    fontWeight: "500",
    marginBottom: "8px"
  },
  description: {
    fontSize: "0.9rem",
    color: "#888",
    marginBottom: "10px",
    lineHeight: "1.4"
  },
  price: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: "15px"
  },
  actions: {
    display: "flex",
    gap: "10px"
  },
  addToCartBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    padding: "8px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  viewBtn: {
    flex: 0.5,
    padding: "8px",
    background: "transparent",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "6px",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s"
  }
};