// pages/Checkout.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from navigation state or localStorage
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutQuantities, setCheckoutQuantities] = useState({});
  const [shippingData, setShippingData] = useState({ 
    shipping_address: "", 
    phone: "",
    payment_method: "COD"
  });
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load checkout data
  useEffect(() => {
    console.log("Loading checkout data...");
    console.log("Location state:", location.state);
    console.log("Cart items from context:", cartItems);
    console.log("LocalStorage cartData:", localStorage.getItem("cartData"));

    // First try to get from location state
    if (location.state?.items && location.state.items.length > 0) {
      console.log("Using location state items:", location.state.items);
      setCheckoutItems(location.state.items);
      setCheckoutQuantities(location.state.quantities || {});
      setDataLoaded(true);
    } 
    // Then try from cart context
    else if (cartItems && cartItems.length > 0) {
      console.log("Using cart context items:", cartItems);
      setCheckoutItems(cartItems);
      const qty = {};
      cartItems.forEach(item => {
        qty[item.id] = item.quantity || 1;
      });
      setCheckoutQuantities(qty);
      setDataLoaded(true);
    }
    // Finally try from localStorage
    else {
      const savedCartData = localStorage.getItem("cartData");
      if (savedCartData) {
        try {
          const parsed = JSON.parse(savedCartData);
          console.log("Using localStorage items:", parsed);
          if (parsed.items && parsed.items.length > 0) {
            setCheckoutItems(parsed.items || []);
            setCheckoutQuantities(parsed.quantities || {});
            setDataLoaded(true);
          } else {
            setDataLoaded(true);
          }
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
          setDataLoaded(true);
        }
      } else {
        setDataLoaded(true);
      }
    }
  }, [location.state, cartItems]);

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (dataLoaded && !user && checkoutItems.length > 0) {
      toast.error("Please login to checkout");
      navigate("/login", { 
        state: { 
          from: "/cart",
          redirectTo: "/checkout",
          message: "Please login to complete your purchase"
        } 
      });
    }
  }, [user, checkoutItems, navigate, dataLoaded]);

  // Redirect if cart is empty
  useEffect(() => {
    if (dataLoaded && user && checkoutItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [checkoutItems, user, navigate, dataLoaded]);

  // Calculate total
  const cartTotal = checkoutItems.reduce((total, item) => {
    const price = Number(item.price) || Number(item.product?.price) || 0;
    const quantity = checkoutQuantities[item.id] || item.quantity || 1;
    return total + (price * quantity);
  }, 0);

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  // ✅ FIXED: handlePlaceOrder function
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    console.log("Current shipping data:", shippingData);

    if (!user) {
      toast.error("Please login to place an order.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (checkoutItems.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
      return;
    }

    // Validate form data
    if (!shippingData.shipping_address || shippingData.shipping_address.trim() === "") {
      toast.error("Please enter shipping address");
      return;
    }
    if (!shippingData.phone || shippingData.phone.trim() === "") {
      toast.error("Please enter phone number");
      return;
    }

    setLoading(true);

    // Prepare order data
    const orderData = {
      shipping_address: shippingData.shipping_address.trim(),
      phone: shippingData.phone.trim(),
      total_price: parseFloat(cartTotal).toFixed(2),
      payment_method: shippingData.payment_method || "COD",
      is_paid: false,
      status: "pending",
      items: checkoutItems.map((item) => ({
        product_id: parseInt(item.id),
        quantity: parseInt(checkoutQuantities[item.id] || item.quantity || 1),
        price: parseFloat(item.price || 0).toFixed(2)
      })),
    };

    console.log("Sending order data:", JSON.stringify(orderData, null, 2));

    try {
      const response = await api.post("orders/create/", orderData);
      
      console.log("Order response:", response.data);
      
      if (response.status === 201 || response.status === 200) {
        toast.success("Order Placed Successfully!");
        
        // ✅ Safe cart clearing
        try {
          if (clearCart && typeof clearCart === 'function') {
            clearCart();
          } else {
            // Fallback: clear localStorage directly
            localStorage.removeItem("zyphone_cart");
            // ✅ FIXED: Correct array check
            if (cartItems && Array.isArray(cartItems)) {
              console.log("Cart had items but no clearCart function");
            }
          }
        } catch (cartError) {
          console.error("Error clearing cart:", cartError);
        }
        
        // Clear temporary data
        localStorage.removeItem("cartData");
        localStorage.removeItem("redirectAfterLogin");
        
        navigate("/order-success", { 
          state: { 
            orderId: response.data.order_id || response.data.id,
            total: cartTotal 
          } 
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.status === 500) {
          toast.error("Server error. Please check Django console for details.");
        } else if (error.response.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error(`Error ${error.response.status}: Failed to place order`);
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Please check if Django server is running.");
      } else {
        console.error("Error message:", error.message);
        toast.error("Failed to place order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // If data not loaded yet, show loading
  if (!dataLoaded) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no user or no items, don't render
  if (!user || checkoutItems.length === 0) {
    return null;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Checkout</h2>
        
        {/* Order Summary */}
        <div style={styles.summaryCard}>
          <h3 style={styles.subtitle}>Order Summary</h3>
          {checkoutItems.map((item) => {
            const quantity = checkoutQuantities[item.id] || item.quantity || 1;
            const price = Number(item.price) || Number(item.product?.price) || 0;
            const itemTotal = price * quantity;
            
            return (
              <div key={item.id} style={styles.itemRow}>
                <div style={styles.itemInfo}>
                  <span style={styles.itemName}>{item.name}</span>
                  <span style={styles.itemQty}>x{quantity}</span>
                </div>
                <span style={styles.itemPrice}>₹{itemTotal.toLocaleString('en-IN')}</span>
              </div>
            );
          })}
          
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total Amount:</span>
            <span style={styles.totalAmount}>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Shipping Form */}
        <form onSubmit={handlePlaceOrder} style={styles.form}>
          <h3 style={styles.subtitle}>Shipping Information</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Shipping Address *</label>
            <input
              type="text"
              name="shipping_address"
              placeholder="Enter your full address"
              value={shippingData.shipping_address}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +91 9876543210"
              value={shippingData.phone}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Method</label>
            <select
              name="payment_method"
              value={shippingData.payment_method}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="CARD">Credit/Debit Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={() => navigate("/cart")}
              style={styles.backButton}
            >
              Back to Cart
            </button>
            
            <button 
              type="submit" 
              disabled={loading} 
              style={{
                ...styles.submitButton,
                ...(loading ? styles.disabledButton : {})
              }}
            >
              {loading ? "Processing Order..." : "Confirm Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const styles = {
  page: {
    padding: "40px 20px",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh"
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto"
  },
  title: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "40px",
    fontWeight: "600",
    borderLeft: "4px solid #3b82f6",
    paddingLeft: "20px"
  },
  subtitle: {
    fontSize: "1.3rem",
    marginBottom: "20px",
    color: "#fff",
    fontWeight: "500"
  },
  summaryCard: {
    background: "#1a1a1a",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #2a2a2a",
    marginBottom: "30px"
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #2a2a2a"
  },
  itemInfo: {
    display: "flex",
    gap: "15px",
    alignItems: "center"
  },
  itemName: {
    fontSize: "1rem",
    color: "#fff"
  },
  itemQty: {
    fontSize: "0.9rem",
    color: "#888"
  },
  itemPrice: {
    fontSize: "1rem",
    color: "#3b82f6",
    fontWeight: "600"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "2px solid #2a2a2a",
    fontSize: "1.2rem"
  },
  totalLabel: {
    fontWeight: "600",
    color: "#fff"
  },
  totalAmount: {
    fontWeight: "700",
    color: "#3b82f6",
    fontSize: "1.4rem"
  },
  form: {
    background: "#1a1a1a",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #2a2a2a"
  },
  formGroup: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#aaa",
    fontSize: "0.95rem"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.2s"
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    cursor: "pointer"
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginTop: "30px"
  },
  backButton: {
    flex: 1,
    padding: "15px",
    backgroundColor: "transparent",
    color: "#fff",
    fontWeight: "600",
    border: "2px solid #333",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  submitButton: {
    flex: 2,
    padding: "15px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  disabledButton: {
    backgroundColor: "#666",
    cursor: "not-allowed"
  },
  loadingContainer: {
    textAlign: "center",
    padding: "50px",
    background: "#1a1a1a",
    borderRadius: "12px",
    color: "#888"
  }
};

export default Checkout;