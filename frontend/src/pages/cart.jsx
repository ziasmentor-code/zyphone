// pages/Cart.jsx
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function Cart() {
  const { cartItems = [], removeFromCart } = useContext(CartContext) || {};
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState({});
  const [removingId, setRemovingId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Debug: Log cart items
  useEffect(() => {
    console.log("Current cart items:", cartItems);
  }, [cartItems]);

  // Initialize quantities
  useEffect(() => {
    const qty = {};
    cartItems.forEach(item => {
      qty[item.id] = item.quantity || 1;
    });
    setQuantities(qty);
  }, [cartItems]);

  // Quantity update
  const updateQty = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  // Remove item
  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      if (removeFromCart) {
        removeFromCart(id);
      }
      setRemovingId(null);
      toast.success("Item removed from cart");
    }, 300);
  };

  // ✅ FIXED: Checkout function with better data handling
  const handleCheckout = () => {
    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // Check if user is logged in
    if (!user) {
      toast.error("Please login first");
      
      // Save cart data to localStorage
      try {
        localStorage.setItem("redirectAfterLogin", "/checkout");
        localStorage.setItem("cartData", JSON.stringify({
          items: cartItems,
          quantities: quantities,
          subtotal: subtotal
        }));
        console.log("Cart data saved to localStorage:", cartItems);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      
      navigate("/login");
      return;
    }

    // If logged in, go directly to checkout
    console.log("Navigating to checkout with items:", cartItems);
    navigate("/checkout", { 
      state: { 
        items: cartItems, 
        quantities: quantities,
        subtotal: subtotal 
      } 
    });
  };

  // Continue shopping
  const handleContinueShopping = () => {
    navigate("/products");
  };

  // Get image URL
  const getImageUrl = (item) => {
    const image = item.image || item.product?.image;
    
    if (!image) return "https://via.placeholder.com/100?text=No+Image";
    if (image.startsWith('http')) return image;
    if (image.startsWith('data:image')) return image;
    
    if (image.includes('/media/')) {
      const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      return `${baseURL}${image}`;
    }
    
    const cleanPath = image.startsWith('/') ? image : `/${image}`;
    const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    return `${baseURL}${cleanPath}`;
  };

  // Handle image error
  const handleImageError = (itemId) => {
    setImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || Number(item.product?.price) || 0;
    const qty = quantities[item.id] || 1;
    return sum + (price * qty);
  }, 0);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header with back button */}
        <div style={styles.header}>
          <button 
            onClick={() => navigate(-1)} 
            style={styles.backButton}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={styles.title}>Shopping Cart</h1>
          <div style={styles.cartIcon}>
            <ShoppingBag size={24} />
          </div>
        </div>

        {!cartItems || cartItems.length === 0 ? (
          <div style={styles.emptyCart}>
            <ShoppingBag size={80} color="#333" strokeWidth={1.5} />
            <h2 style={styles.emptyTitle}>Your cart is empty</h2>
            <p style={styles.emptyText}>
              Looks like you haven't added anything to your cart yet.
            </p>
            <button 
              style={styles.shopBtn}
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={styles.layout}>
            {/* CART LIST */}
            <div style={styles.list}>
              {cartItems.map((item, index) => {
                const name = item.name || item.product?.name || "Unnamed Item";
                const price = Number(item.price) || Number(item.product?.price) || 0;
                const description = item.description || item.product?.description || "";
                const qty = quantities[item.id] || 1;
                const itemTotal = price * qty;
                
                const imgUrl = imageErrors[item.id] 
                  ? "https://via.placeholder.com/100?text=Error"
                  : getImageUrl(item);

                return (
                  <div
                    key={item.id || index}
                    style={{
                      ...styles.cartItem,
                      opacity: removingId === item.id ? 0.5 : 1,
                      transition: "opacity 0.3s ease"
                    }}
                  >
                    <img 
                      src={imgUrl} 
                      alt={name} 
                      style={styles.img}
                      onError={() => handleImageError(item.id)}
                      loading="lazy"
                    />
                    
                    <div style={styles.itemDetails}>
                      <h3 style={styles.itemName}>{name}</h3>
                      
                      {description && (
                        <p style={styles.itemDescription}>{description}</p>
                      )}
                      
                      <p style={styles.itemPrice}>₹{price.toLocaleString('en-IN')}</p>
                      
                      <div style={styles.qtyBox}>
                        <button 
                          style={styles.qtyBtn}
                          onClick={() => updateQty(item.id, -1)}
                        >
                          -
                        </button>
                        <span style={styles.qtyValue}>{qty}</span>
                        <button 
                          style={styles.qtyBtn}
                          onClick={() => updateQty(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <p style={styles.itemTotal}>
                        Item Total: <span style={styles.itemTotalValue}>₹{itemTotal.toLocaleString('en-IN')}</span>
                      </p>

                      <button
                        style={styles.removeBtn}
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* Continue Shopping button inside cart */}
              <button 
                style={styles.continueShopBtn}
                onClick={handleContinueShopping}
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </button>
            </div>

            {/* SUMMARY */}
            <div style={styles.summary}>
              <h3 style={styles.summaryTitle}>Order Summary</h3>
              
              <div style={styles.summaryRow}>
                <span>Items ({cartItems.length})</span>
                <span style={styles.summaryValue}>{cartItems.length}</span>
              </div>

              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span style={styles.subtotalValue}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span style={styles.summaryValue}>FREE</span>
              </div>

              <div style={styles.divider}></div>

              <div style={{...styles.summaryRow, ...styles.totalRow}}>
                <span style={styles.totalText}>Total</span>
                <span style={styles.totalAmount}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <button
                style={styles.checkoutBtn}
                onClick={handleCheckout}
              >
                {user ? "Proceed to Checkout" : "Login to Checkout"}
              </button>

              {!user && (
                <p style={styles.loginNote}>
                  Please login to checkout
                </p>
              )}
            </div>
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
  cartIcon: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#3b82f6"
  },
  emptyCart: {
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
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 350px",
    gap: "30px"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  cartItem: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    background: "#1a1a1a",
    borderRadius: "12px",
    border: "1px solid #2a2a2a"
  },
  img: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    background: "#111",
    borderRadius: "8px",
    border: "1px solid #333"
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    fontSize: "1.1rem",
    marginBottom: "8px",
    fontWeight: "500"
  },
  itemDescription: {
    fontSize: "0.95rem",
    color: "#aaa",
    marginBottom: "10px",
    lineHeight: "1.5",
    maxWidth: "500px"
  },
  itemPrice: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: "12px"
  },
  qtyBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "8px"
  },
  qtyBtn: {
    width: "35px",
    height: "35px",
    background: "#2a2a2a",
    border: "1px solid #3a3a3a",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s"
  },
  qtyValue: {
    fontSize: "1.1rem",
    minWidth: "30px",
    textAlign: "center"
  },
  itemTotal: {
    fontSize: "0.95rem",
    color: "#888",
    marginBottom: "8px"
  },
  itemTotalValue: {
    color: "#3b82f6",
    fontWeight: "600"
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#ef4444",
    fontSize: "0.95rem",
    cursor: "pointer",
    padding: "5px 0",
    textAlign: "left",
    transition: "color 0.2s"
  },
  continueShopBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    color: "#3b82f6",
    border: "2px solid #3b82f6",
    borderRadius: "8px",
    padding: "12px 20px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "10px",
    width: "fit-content"
  },
  summary: {
    background: "#1a1a1a",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #2a2a2a",
    height: "fit-content",
    position: "sticky",
    top: "20px"
  },
  summaryTitle: {
    fontSize: "1.3rem",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #2a2a2a"
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    fontSize: "0.95rem",
    color: "#aaa"
  },
  summaryValue: {
    color: "#fff"
  },
  subtotalValue: {
    fontWeight: "600",
    color: "#3b82f6",
    fontSize: "1.1rem"
  },
  divider: {
    height: "1px",
    background: "#2a2a2a",
    margin: "20px 0"
  },
  totalRow: {
    marginBottom: "25px"
  },
  totalText: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#fff"
  },
  totalAmount: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#3b82f6"
  },
  checkoutBtn: {
    width: "100%",
    padding: "15px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
    marginBottom: "10px"
  },
  loginNote: {
    textAlign: "center",
    color: "#888",
    fontSize: "0.9rem"
  }
};