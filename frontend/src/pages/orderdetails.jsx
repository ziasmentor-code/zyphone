import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import { 
  ArrowLeft, Package, Truck, CheckCircle, Clock, 
  XCircle, MapPin, Phone, CreditCard, Calendar, ShoppingCart
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
      toast.error("Failed to load technical specifications");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loader}><div style={styles.spinner}></div></div>;
  if (!order) return <div style={styles.errorPage}><h2>Order Archive Not Found</h2><button onClick={() => navigate("/my-orders")}>Return</button></div>;

  const steps = ["pending", "confirmed", "shipped", "delivered"];
  const currentStep = steps.indexOf(order.status?.toLowerCase());

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={18} /></button>
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
              <h3 style={styles.sectionTitle}><ShoppingCart size={18} /> Hardware Manifest</h3>
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
                <div style={styles.priceRow}><p>Subtotal</p><span>₹{Number(order.total_price).toLocaleString()}</span></div>
                <div style={styles.priceRow}><p>Security & Shipping</p><span style={{color: '#00e676'}}>FREE</span></div>
                <div style={styles.totalRow}><p>Total Investment</p><span>₹{Number(order.total_price).toLocaleString()}</span></div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div style={styles.rightCol}>
            <div style={styles.glassCard}>
              <h3 style={styles.sectionTitle}><MapPin size={18} /> Delivery Node</h3>
              <p style={styles.detailText}>{order.shipping_address}</p>
              <div style={styles.detailItem}>
                <Phone size={14} color="#555" />
                <span style={styles.detailText}>{order.phone}</span>
              </div>
            </div>

            <div style={styles.glassCard}>
              <h3 style={styles.sectionTitle}><CreditCard size={18} /> Transaction</h3>
              <div style={styles.detailRow}>
                <span>Method</span>
                <span style={styles.valueText}>{order.payment_method || "COD"}</span>
              </div>
              <div style={styles.detailRow}>
                <span>Timestamp</span>
                <span style={styles.valueText}>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <button style={styles.printBtn}>Download Invoice (PDF)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Cyberpunk Styles ────────────────────────────────────────────────────────── */
const styles = {
  page: { minHeight: "100vh", background: "#050505", color: "#fff", padding: "40px 20px", fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: "1000px", margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: "25px", marginBottom: "40px" },
  backBtn: { background: "#111", border: "1px solid #222", color: "#fff", padding: "12px", borderRadius: "14px", cursor: "pointer" },
  titleArea: { flex: 1 },
  tag: { fontSize: "10px", color: "#00e676", letterSpacing: "2px", fontWeight: "bold" },
  mainTitle: { fontSize: "32px", fontWeight: "800", margin: "5px 0 0", letterSpacing: "-1px" },
  
  statusBadge: (status) => ({
    padding: "8px 20px", borderRadius: "100px", fontSize: "12px", fontWeight: "bold",
    background: status === 'delivered' ? "#00e67615" : "#f59e0b15",
    color: status === 'delivered' ? "#00e676" : "#f59e0b",
    border: `1px solid ${status === 'delivered' ? "#00e67630" : "#f59e0b30"}`
  }),

  glassCard: { background: "#0f0f11", border: "1px solid #1a1a1c", borderRadius: "24px", padding: "25px", marginBottom: "20px" },
  sectionTitle: { fontSize: "14px", fontWeight: "700", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" },

  /* Tracker Styles */
  trackerContainer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" },
  stepWrapper: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" },
  node: (active) => ({
    width: "36px", height: "36px", borderRadius: "12px", background: active ? "#00e676" : "#1a1a1c",
    color: active ? "#000" : "#444", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "bold", fontSize: "14px", zIndex: 2, transition: "0.3s"
  }),
  stepLabel: (active) => ({ fontSize: "11px", marginTop: "10px", fontWeight: "bold", textTransform: "uppercase", color: active ? "#00e676" : "#333" }),
  connector: (active) => ({
    position: "absolute", top: "18px", left: "50%", width: "100%", height: "2px",
    background: active ? "#00e676" : "#1a1a1c", zIndex: 1
  }),

  grid: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "25px" },
  itemsList: { display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px" },
  itemRow: { display: "flex", alignItems: "center", gap: "15px", paddingBottom: "15px", borderBottom: "1px solid #1a1a1c" },
  itemImgBox: { width: "60px", height: "60px", background: "#fff", borderRadius: "12px", padding: "5px" },
  itemImg: { width: "100%", height: "100%", objectFit: "contain" },
  itemName: { fontSize: "15px", fontWeight: "700", margin: 0 },
  itemMeta: { fontSize: "12px", color: "#555", margin: "5px 0 0" },
  itemPrice: { marginLeft: "auto", fontWeight: "bold", color: "#00e676" },

  priceFooter: { display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid #1a1a1c", paddingTop: "20px" },
  priceRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#888" },
  totalRow: { display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "800", color: "#fff", marginTop: "10px" },

  detailItem: { display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" },
  detailRow: { display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", color: "#555" },
  valueText: { color: "#fff", fontWeight: "600" },
  detailText: { fontSize: "14px", lineHeight: "1.6", color: "#aaa" },
  
  printBtn: { width: "100%", padding: "16px", borderRadius: "16px", background: "transparent", border: "1px solid #00e676", color: "#00e676", fontWeight: "bold", cursor: "pointer", transition: "0.2s" },

  loader: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#050505" },
  spinner: { width: "40px", height: "40px", border: "3px solid #111", borderTopColor: "#00e676", borderRadius: "50%", animation: "spin 1s linear infinite" }
};

export default OrderDetails;