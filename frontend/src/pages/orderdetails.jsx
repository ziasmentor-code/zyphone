import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import { 
  ArrowLeft, Package, Truck, CheckCircle, Clock, 
  XCircle, MapPin, Phone, CreditCard, Calendar, ShoppingCart,
  Home
} from "lucide-react";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`orders/${orderId}/`);
      setOrder(response.data);
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToOrders = () => {
    navigate("/my-orders");
  };

  if (loading) return (
    <div style={styles.loader}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading order details...</p>
    </div>
  );
  
  if (!order) return (
    <div style={styles.errorPage}>
      <Package size={60} color="#333" />
      <h2 style={styles.errorTitle}>Order Not Found</h2>
      <p style={styles.errorText}>The order you're looking for doesn't exist or has been removed.</p>
      <div style={styles.errorButtons}>
        <button onClick={handleGoHome} style={styles.homeBtn}>
          <Home size={16} /> Go to Home
        </button>
        <button onClick={handleGoToOrders} style={styles.ordersBtn}>
          View My Orders
        </button>
      </div>
    </div>
  );

  const steps = ["pending", "confirmed", "shipped", "delivered"];
  const currentStep = steps.indexOf(order.status?.toLowerCase());

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header with Home button */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
              <ArrowLeft size={18} />
            </button>
            <button onClick={handleGoHome} style={styles.homeBtn}>
              <Home size={18} />
            </button>
          </div>
          
          <div style={styles.titleArea}>
            <span style={styles.tag}>ORDER RECEIPT</span>
            <h1 style={styles.mainTitle}>#TZ-{String(order.id).padStart(5, "0")}</h1>
          </div>
          
          <div style={styles.statusBadge(order.status)}>
            {order.status?.toUpperCase() || "PROCESSING"}
          </div>
        </div>

        {/* Status Tracker */}
        <div style={styles.glassCard}>
          <div style={styles.trackerContainer}>
            {steps.map((step, i) => (
              <div key={step} style={styles.stepWrapper}>
                <div style={styles.node(currentStep >= i)}>
                  {currentStep > i ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span style={styles.stepLabel(currentStep >= i)}>{step}</span>
                {i < steps.length - 1 && <div style={styles.connector(currentStep > i)} />}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.grid}>
          {/* Left Column: Items */}
          <div style={styles.leftCol}>
            <div style={styles.glassCard}>
              <h3 style={styles.sectionTitle}><ShoppingCart size={18} /> Order Items</h3>
              <div style={styles.itemsList}>
                {order.items?.map((item, i) => (
                  <div key={i} style={styles.itemRow}>
                    <div style={styles.itemImgBox}>
                      <img 
                        src={item.product_image ? `http://127.0.0.1:8000${item.product_image}` : "https://via.placeholder.com/80"} 
                        alt="Product" 
                        style={styles.itemImg}
                      />
                    </div>
                    <div style={styles.itemInfo}>
                      <h4 style={styles.itemName}>{item.product_name}</h4>
                      <p style={styles.itemMeta}>Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}</p>
                    </div>
                    <div style={styles.itemPrice}>₹{(item.quantity * item.price).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              
              <div style={styles.priceFooter}>
                <div style={styles.priceRow}>
                  <p>Subtotal</p>
                  <span>₹{Number(order.total_price).toLocaleString()}</span>
                </div>
                <div style={styles.priceRow}>
                  <p>Shipping</p>
                  <span style={{color: '#00e676'}}>FREE</span>
                </div>
                <div style={styles.totalRow}>
                  <p>Total</p>
                  <span>₹{Number(order.total_price).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div style={styles.rightCol}>
            <div style={styles.glassCard}>
              <h3 style={styles.sectionTitle}><MapPin size={18} /> Shipping Address</h3>
              <p style={styles.detailText}>{order.shipping_address}</p>
              <div style={styles.detailItem}>
                <Phone size={14} color="#888" />
                <span style={styles.detailText}>{order.phone}</span>
              </div>
            </div>

            <div style={styles.glassCard}>
              <h3 style={styles.sectionTitle}><CreditCard size={18} /> Payment Details</h3>
              <div style={styles.detailRow}>
                <span>Method</span>
                <span style={styles.valueText}>{order.payment_method || "Cash on Delivery"}</span>
              </div>
              <div style={styles.detailRow}>
                <span>Order Date</span>
                <span style={styles.valueText}>
                  {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              {order.delivery_date && (
                <div style={styles.detailRow}>
                  <span>Delivery Date</span>
                  <span style={styles.valueText}>
                    {new Date(order.delivery_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button onClick={handleGoHome} style={styles.homeLargeBtn}>
                <Home size={16} /> Back to Home
              </button>
              <button onClick={handleGoToOrders} style={styles.ordersLargeBtn}>
                All Orders
              </button>
            </div>

            <button style={styles.printBtn}>
              Download Invoice (PDF)
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div style={styles.bottomNav}>
          <button onClick={handleGoHome} style={styles.bottomNavBtn}>
            <Home size={16} /> Home
          </button>
          <button onClick={() => navigate("/products")} style={styles.bottomNavBtn}>
            <Package size={16} /> Shop
          </button>
          <button onClick={handleGoToOrders} style={styles.bottomNavBtn}>
            <Clock size={16} /> Orders
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Cyberpunk Styles ────────────────────────────────────────────────────────── */
const styles = {
  page: { 
    minHeight: "100vh", 
    background: "#050505", 
    color: "#fff", 
    padding: "40px 20px", 
    fontFamily: "'Inter', sans-serif" 
  },
  container: { 
    maxWidth: "1000px", 
    margin: "0 auto" 
  },
  
  header: { 
    display: "flex", 
    alignItems: "center", 
    gap: "25px", 
    marginBottom: "40px" 
  },
  headerLeft: {
    display: "flex",
    gap: "10px"
  },
  backBtn: { 
    background: "#111", 
    border: "1px solid #222", 
    color: "#fff", 
    padding: "12px", 
    borderRadius: "14px", 
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  homeBtn: { 
    background: "#111", 
    border: "1px solid #00e676", 
    color: "#00e676", 
    padding: "12px", 
    borderRadius: "14px", 
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  titleArea: { 
    flex: 1 
  },
  tag: { 
    fontSize: "10px", 
    color: "#00e676", 
    letterSpacing: "2px", 
    fontWeight: "bold" 
  },
  mainTitle: { 
    fontSize: "32px", 
    fontWeight: "800", 
    margin: "5px 0 0", 
    letterSpacing: "-1px" 
  },
  
  statusBadge: (status) => ({
    padding: "8px 20px", 
    borderRadius: "100px", 
    fontSize: "12px", 
    fontWeight: "bold",
    background: status === 'delivered' ? "#00e67615" : 
                status === 'shipped' ? "#3b82f615" :
                status === 'confirmed' ? "#f59e0b15" : "#f59e0b15",
    color: status === 'delivered' ? "#00e676" : 
           status === 'shipped' ? "#3b82f6" :
           status === 'confirmed' ? "#f59e0b" : "#f59e0b",
    border: `1px solid ${status === 'delivered' ? "#00e67630" : 
                          status === 'shipped' ? "#3b82f630" :
                          status === 'confirmed' ? "#f59e0b30" : "#f59e0b30"}`
  }),

  glassCard: { 
    background: "#0f0f11", 
    border: "1px solid #1a1a1c", 
    borderRadius: "24px", 
    padding: "25px", 
    marginBottom: "20px" 
  },
  
  sectionTitle: { 
    fontSize: "14px", 
    fontWeight: "700", 
    color: "#888", 
    textTransform: "uppercase", 
    letterSpacing: "1px", 
    marginBottom: "20px", 
    display: "flex", 
    alignItems: "center", 
    gap: "10px" 
  },

  /* Tracker Styles */
  trackerContainer: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "10px 0" 
  },
  stepWrapper: { 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    position: "relative" 
  },
  node: (active) => ({
    width: "36px", 
    height: "36px", 
    borderRadius: "12px", 
    background: active ? "#00e676" : "#1a1a1c",
    color: active ? "#000" : "#444", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    fontWeight: "bold", 
    fontSize: "14px", 
    zIndex: 2, 
    transition: "0.3s"
  }),
  stepLabel: (active) => ({ 
    fontSize: "11px", 
    marginTop: "10px", 
    fontWeight: "bold", 
    textTransform: "uppercase", 
    color: active ? "#00e676" : "#333" 
  }),
  connector: (active) => ({
    position: "absolute", 
    top: "18px", 
    left: "50%", 
    width: "100%", 
    height: "2px",
    background: active ? "#00e676" : "#1a1a1c", 
    zIndex: 1
  }),

  grid: { 
    display: "grid", 
    gridTemplateColumns: "1.6fr 1fr", 
    gap: "25px" 
  },
  
  itemsList: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "15px", 
    marginBottom: "25px" 
  },
  itemRow: { 
    display: "flex", 
    alignItems: "center", 
    gap: "15px", 
    paddingBottom: "15px", 
    borderBottom: "1px solid #1a1a1c" 
  },
  itemImgBox: { 
    width: "60px", 
    height: "60px", 
    background: "#fff", 
    borderRadius: "12px", 
    padding: "5px" 
  },
  itemImg: { 
    width: "100%", 
    height: "100%", 
    objectFit: "contain" 
  },
  itemName: { 
    fontSize: "15px", 
    fontWeight: "700", 
    margin: 0 
  },
  itemMeta: { 
    fontSize: "12px", 
    color: "#888", 
    margin: "5px 0 0" 
  },
  itemPrice: { 
    marginLeft: "auto", 
    fontWeight: "bold", 
    color: "#00e676" 
  },

  priceFooter: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "10px", 
    borderTop: "1px solid #1a1a1c", 
    paddingTop: "20px" 
  },
  priceRow: { 
    display: "flex", 
    justifyContent: "space-between", 
    fontSize: "14px", 
    color: "#888" 
  },
  totalRow: { 
    display: "flex", 
    justifyContent: "space-between", 
    fontSize: "18px", 
    fontWeight: "800", 
    color: "#fff", 
    marginTop: "10px" 
  },

  detailItem: { 
    display: "flex", 
    alignItems: "center", 
    gap: "10px", 
    marginTop: "10px" 
  },
  detailRow: { 
    display: "flex", 
    justifyContent: "space-between", 
    marginBottom: "12px", 
    fontSize: "14px", 
    color: "#888" 
  },
  valueText: { 
    color: "#fff", 
    fontWeight: "600" 
  },
  detailText: { 
    fontSize: "14px", 
    lineHeight: "1.6", 
    color: "#aaa" 
  },
  
  actionButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "15px"
  },
  homeLargeBtn: {
    padding: "14px",
    borderRadius: "16px",
    background: "#00e676",
    border: "none",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  ordersLargeBtn: {
    padding: "14px",
    borderRadius: "16px",
    background: "transparent",
    border: "1px solid #00e676",
    color: "#00e676",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  printBtn: { 
    width: "100%", 
    padding: "16px", 
    borderRadius: "16px", 
    background: "transparent", 
    border: "1px solid #00e676", 
    color: "#00e676", 
    fontWeight: "bold", 
    cursor: "pointer", 
    transition: "0.2s" 
  },

  bottomNav: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "20px",
    borderTop: "1px solid #1a1a1c"
  },
  bottomNavBtn: {
    background: "transparent",
    border: "none",
    color: "#888",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "8px 16px",
    borderRadius: "30px"
  },

  loader: { 
    height: "100vh", 
    display: "flex", 
    flexDirection: "column",
    justifyContent: "center", 
    alignItems: "center", 
    background: "#050505" 
  },
  spinner: { 
    width: "40px", 
    height: "40px", 
    border: "3px solid #111", 
    borderTopColor: "#00e676", 
    borderRadius: "50%", 
    animation: "spin 1s linear infinite" 
  },
  loadingText: {
    color: "#888",
    marginTop: "20px",
    fontSize: "14px"
  },

  errorPage: {
    minHeight: "100vh",
    background: "#050505",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    textAlign: "center"
  },
  errorTitle: {
    fontSize: "28px",
    color: "#fff",
    margin: "20px 0 10px"
  },
  errorText: {
    color: "#888",
    marginBottom: "30px",
    maxWidth: "400px"
  },
  errorButtons: {
    display: "flex",
    gap: "15px"
  }
};

export default OrderDetails;