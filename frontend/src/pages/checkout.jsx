// pages/Checkout.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import toast from "react-hot-toast";
import { 
  ShoppingBag, MapPin, Phone, CreditCard, 
  Truck, Shield, ArrowLeft, CheckCircle, AlertCircle,
  Heart, Star, Package
} from "lucide-react";

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
    payment_method: "COD",
    city: "",
    state: "",
    pincode: ""
  });
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  // Load checkout data
  useEffect(() => {
    console.log("Loading checkout data...");
    console.log("Location state:", location.state);
    console.log("Cart items from context:", cartItems);

    // First try to get from location state (Buy Now)
    if (location.state?.items && location.state.items.length > 0) {
      console.log("Using location state items:", location.state.items);
      setCheckoutItems(location.state.items);
      
      const qty = {};
      location.state.items.forEach(item => {
        qty[item.id] = item.quantity || 1;
      });
      setCheckoutQuantities(qty);
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
    // Finally try from localStorage (backup)
    else {
      try {
        const savedCart = localStorage.getItem("zyphone_cart");
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (parsed.length > 0) {
            setCheckoutItems(parsed);
            
            const qty = {};
            parsed.forEach(item => {
              qty[item.id] = item.quantity || 1;
            });
            setCheckoutQuantities(qty);
            setDataLoaded(true);
          } else {
            setDataLoaded(true);
          }
        } else {
          setDataLoaded(true);
        }
      } catch (e) {
        console.error("Error parsing localStorage:", e);
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

  // Calculate GST and other charges
  const subtotal = cartTotal;
  const gst = Math.round(subtotal * 0.18); // 18% GST
  const deliveryCharge = subtotal > 1000 ? 0 : 40;
  const totalAmount = subtotal + gst + deliveryCharge;

  const handleInputChange = (e) => {
    setShippingData({ 
      ...shippingData, 
      [e.target.name]: e.target.value 
    });
    
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingData.shipping_address || shippingData.shipping_address.trim() === "") {
      newErrors.shipping_address = "Shipping address is required";
    }
    if (!shippingData.city || shippingData.city.trim() === "") {
      newErrors.city = "City is required";
    }
    if (!shippingData.state || shippingData.state.trim() === "") {
      newErrors.state = "State is required";
    }
    if (!shippingData.pincode || shippingData.pincode.trim() === "") {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(shippingData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }
    if (!shippingData.phone || shippingData.phone.trim() === "") {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{10,15}$/.test(shippingData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle place order
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

    // Validate form
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);

    // Prepare full address
    const fullAddress = `${shippingData.shipping_address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}`;

    // Prepare order data
    const orderData = {
      shipping_address: fullAddress,
      phone: shippingData.phone.trim(),
      total_price: parseFloat(totalAmount).toFixed(2),
      subtotal: parseFloat(subtotal).toFixed(2),
      gst: parseFloat(gst).toFixed(2),
      delivery_charge: parseFloat(deliveryCharge).toFixed(2),
      payment_method: shippingData.payment_method,
      is_paid: shippingData.payment_method !== "COD",
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
        
        // Clear cart
        try {
          if (clearCart && typeof clearCart === 'function') {
            clearCart();
          }
          localStorage.removeItem("zyphone_cart");
        } catch (cartError) {
          console.error("Error clearing cart:", cartError);
        }
        
        // Clear any temporary data
        localStorage.removeItem("redirectAfterLogin");
        
        // Navigate to success page
        navigate("/order-success", { 
          state: { 
            orderId: response.data.order_id || response.data.id,
            orderNumber: response.data.order_number || `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            total: totalAmount,
            paymentMethod: shippingData.payment_method
          } 
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login", { state: { from: "/checkout" } });
        } else if (error.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else if (error.response.data?.error) {
          toast.error(error.response.data.error);
        } else if (error.response.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to place order. Please try again.");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Cannot connect to server. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        toast.error("An unexpected error occurred.");
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
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading checkout...</p>
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
        
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate("/cart")} style={styles.backButton}>
            <ArrowLeft size={20} color="#000" />
          </button>
          <h2 style={styles.title}>Checkout</h2>
          <div style={{ width: 40 }}></div>
        </div>

        <div style={styles.content}>
          {/* Left Column - Order Summary */}
          <div style={styles.leftColumn}>
            {/* Order Items */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <ShoppingBag size={20} color="#dc2626" />
                <h3 style={styles.cardTitle}>Order Items</h3>
                <span style={styles.itemCount}>{checkoutItems.length} items</span>
              </div>
              
              {checkoutItems.map((item) => {
                const quantity = checkoutQuantities[item.id] || item.quantity || 1;
                const price = Number(item.price) || Number(item.product?.price) || 0;
                const itemTotal = price * quantity;
                
                return (
                  <div key={item.id} style={styles.itemRow}>
                    <div style={styles.itemImage}>
                      <img 
                        src={item.image ? `http://127.0.0.1:8000${item.image}` : "https://via.placeholder.com/60"} 
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/60" }}
                      />
                    </div>
                    <div style={styles.itemInfo}>
                      <span style={styles.itemName}>{item.name}</span>
                      <span style={styles.itemQty}>Qty: {quantity}</span>
                    </div>
                    <span style={styles.itemPrice}>₹{itemTotal.toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <CreditCard size={20} color="#dc2626" />
                <h3 style={styles.cardTitle}>Price Details</h3>
              </div>
              
              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Subtotal ({checkoutItems.length} items)</span>
                <span style={styles.priceValue}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>GST (18%)</span>
                <span style={styles.priceValue}>₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Delivery Charge</span>
                {deliveryCharge === 0 ? (
                  <span style={styles.freeDelivery}>FREE</span>
                ) : (
                  <span style={styles.priceValue}>₹{deliveryCharge}</span>
                )}
              </div>
              
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total Amount</span>
                <span style={styles.totalAmount}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              
              {deliveryCharge === 0 && (
                <div style={styles.freeDeliveryNote}>
                  <Truck size={14} color="#16a34a" />
                  <span style={styles.freeDeliveryText}>You get FREE delivery!</span>
                </div>
              )}
            </div>

            {/* Trust Badge */}
            <div style={styles.trustBadge}>
              <Shield size={16} color="#9ca3af" />
              <span style={styles.trustText}>Secure checkout powered by Zyphone</span>
            </div>
          </div>

          {/* Right Column - Shipping Form */}
          <div style={styles.rightColumn}>
            <form onSubmit={handlePlaceOrder} style={styles.form}>
              
              {/* Shipping Information */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <MapPin size={20} color="#dc2626" />
                  <h3 style={styles.cardTitle}>Shipping Information</h3>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Address Line <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="shipping_address"
                    placeholder="House No., Building, Street"
                    value={shippingData.shipping_address}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.shipping_address ? styles.inputError : {})
                    }}
                  />
                  {errors.shipping_address && (
                    <span style={styles.errorText}>
                      <AlertCircle size={12} />
                      {errors.shipping_address}
                    </span>
                  )}
                </div>

                <div style={styles.row}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      City <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={shippingData.city}
                      onChange={handleInputChange}
                      style={{
                        ...styles.input,
                        ...(errors.city ? styles.inputError : {})
                      }}
                    />
                    {errors.city && (
                      <span style={styles.errorText}>
                        <AlertCircle size={12} />
                        {errors.city}
                      </span>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      State <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={shippingData.state}
                      onChange={handleInputChange}
                      style={{
                        ...styles.input,
                        ...(errors.state ? styles.inputError : {})
                      }}
                    />
                    {errors.state && (
                      <span style={styles.errorText}>
                        <AlertCircle size={12} />
                        {errors.state}
                      </span>
                    )}
                  </div>
                </div>

                <div style={styles.row}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Pincode <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="6-digit pincode"
                      value={shippingData.pincode}
                      onChange={handleInputChange}
                      maxLength="6"
                      style={{
                        ...styles.input,
                        ...(errors.pincode ? styles.inputError : {})
                      }}
                    />
                    {errors.pincode && (
                      <span style={styles.errorText}>
                        <AlertCircle size={12} />
                        {errors.pincode}
                      </span>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Phone <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      style={{
                        ...styles.input,
                        ...(errors.phone ? styles.inputError : {})
                      }}
                    />
                    {errors.phone && (
                      <span style={styles.errorText}>
                        <AlertCircle size={12} />
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <CreditCard size={20} color="#dc2626" />
                  <h3 style={styles.cardTitle}>Payment Method</h3>
                </div>
                
                <div style={styles.paymentOptions}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={shippingData.payment_method === "COD"}
                      onChange={handleInputChange}
                      style={styles.radio}
                    />
                    <div style={styles.radioContent}>
                      <span style={styles.radioTitle}>Cash on Delivery</span>
                      <span style={styles.radioDesc}>Pay when you receive your order</span>
                    </div>
                  </label>

                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="CARD"
                      checked={shippingData.payment_method === "CARD"}
                      onChange={handleInputChange}
                      style={styles.radio}
                    />
                    <div style={styles.radioContent}>
                      <span style={styles.radioTitle}>Credit/Debit Card</span>
                      <span style={styles.radioDesc}>Pay securely with card</span>
                    </div>
                  </label>

                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="UPI"
                      checked={shippingData.payment_method === "UPI"}
                      onChange={handleInputChange}
                      style={styles.radio}
                    />
                    <div style={styles.radioContent}>
                      <span style={styles.radioTitle}>UPI</span>
                      <span style={styles.radioDesc}>Google Pay, PhonePe, etc.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.buttonGroup}>
                <button 
                  type="button" 
                  onClick={() => navigate("/cart")}
                  style={styles.backButtonLarge}
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
                  {loading ? (
                    <>
                      <div style={styles.buttonSpinner}></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Place Order • ₹{totalAmount.toLocaleString('en-IN')}
                    </>
                  )}
                </button>
              </div>

              {/* Terms */}
              <p style={styles.terms}>
                By placing this order, you agree to our <span style={styles.termsLink}>Terms of Service</span> and <span style={styles.termsLink}>Privacy Policy</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles with new color theme
const styles = {
  page: {
    padding: "40px 20px",
    backgroundColor: "#f5f5f7",
    minHeight: "100vh",
    fontFamily: "'Outfit', sans-serif"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px"
  },
  backButton: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    border: "1px solid #e8e6df",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#000",
    fontFamily: "'Fraunces', serif",
    letterSpacing: "-0.02em"
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: "30px"
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #f0f0f0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
    transition: "box-shadow 0.2s"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: "16px"
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#000",
    fontFamily: "'Outfit', sans-serif",
    flex: 1
  },
  itemCount: {
    fontSize: "0.85rem",
    color: "#9ca3af",
    backgroundColor: "#f5f5f7",
    padding: "4px 10px",
    borderRadius: "20px",
    fontFamily: "'DM Mono', monospace"
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px 0",
    borderBottom: "1px solid #f0f0f0"
  },
  itemImage: {
    width: "70px",
    height: "70px",
    backgroundColor: "#f5f5f7",
    borderRadius: "16px",
    overflow: "hidden",
    padding: "8px"
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#000",
    marginBottom: "4px",
    fontFamily: "'Outfit', sans-serif"
  },
  itemQty: {
    fontSize: "0.85rem",
    color: "#9ca3af",
    fontFamily: "'DM Mono', monospace"
  },
  itemPrice: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#000",
    fontFamily: "'DM Mono', monospace"
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    color: "#4b5563",
    fontSize: "0.95rem"
  },
  priceLabel: {
    color: "#6b7280"
  },
  priceValue: {
    color: "#000",
    fontWeight: "500",
    fontFamily: "'DM Mono', monospace"
  },
  freeDelivery: {
    color: "#16a34a",
    fontWeight: "600",
    fontFamily: "'DM Mono', monospace"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "2px solid #000",
    fontSize: "1.1rem",
    fontWeight: "600"
  },
  totalLabel: {
    color: "#000"
  },
  totalAmount: {
    color: "#dc2626",
    fontSize: "1.3rem",
    fontFamily: "'Fraunces', serif"
  },
  freeDeliveryNote: {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#f0fdf4",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  freeDeliveryText: {
    color: "#16a34a",
    fontSize: "0.9rem",
    fontWeight: "500"
  },
  trustBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #f0f0f0"
  },
  trustText: {
    fontSize: "0.85rem",
    color: "#6b7280"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGroup: {
    marginBottom: "16px",
    flex: 1
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px"
  },
  label: {
    display: "block",
    marginBottom: "6px",
    color: "#4b5563",
    fontSize: "0.9rem",
    fontWeight: "500"
  },
  required: {
    color: "#dc2626"
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e8e6df",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "'Outfit', sans-serif"
  },
  inputError: {
    border: "1px solid #dc2626",
    backgroundColor: "#fff5f5"
  },
  errorText: {
    color: "#dc2626",
    fontSize: "0.8rem",
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  paymentOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  radioLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    border: "1px solid #e8e6df",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  radio: {
    marginTop: "2px",
    accentColor: "#dc2626"
  },
  radioContent: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  radioTitle: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#000"
  },
  radioDesc: {
    fontSize: "0.85rem",
    color: "#9ca3af"
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    marginTop: "20px"
  },
  backButtonLarge: {
    flex: 1,
    padding: "16px",
    backgroundColor: "#fff",
    color: "#000",
    fontWeight: "600",
    border: "1px solid #000",
    borderRadius: "40px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "0.95rem",
    fontFamily: "'Outfit', sans-serif"
  },
  submitButton: {
    flex: 2,
    padding: "16px",
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "40px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "0.95rem",
    fontFamily: "'Outfit', sans-serif"
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed"
  },
  terms: {
    textAlign: "center",
    fontSize: "0.8rem",
    color: "#9ca3af",
    marginTop: "16px"
  },
  termsLink: {
    color: "#000",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "underline"
  },
  loadingContainer: {
    textAlign: "center",
    padding: "60px",
    backgroundColor: "#fff",
    borderRadius: "24px",
    border: "1px solid #f0f0f0"
  },
  loadingText: {
    fontSize: "0.95rem",
    color: "#6b7280",
    marginTop: "16px",
    fontFamily: "'Outfit', sans-serif"
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "3px solid #f0f0f0",
    borderTopColor: "#000",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto"
  },
  buttonSpinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  }
};

// Add global animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap');
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  * {
    box-sizing: border-box;
  }
  
  .pd-backButton:hover {
    background-color: #f5f5f7 !important;
  }
  
  .pd-submitButton:hover {
    background-color: #dc2626 !important;
  }
  
  .pd-radioLabel:hover {
    border-color: #dc2626 !important;
    background-color: #fff5f5 !important;
  }
  
  .pd-input:focus {
    border-color: #000 !important;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.05) !important;
  }
`;
document.head.appendChild(styleSheet);

export default Checkout;