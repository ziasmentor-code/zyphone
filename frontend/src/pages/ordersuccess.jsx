import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { CartContext } from "../context/cartcontext";

const OrderSuccess = () => {
  const { setCartItems } = useContext(CartContext);

  // Page load aakumbol cart empty aakkunnu
  useEffect(() => {
    if (setCartItems) {
      setCartItems([]);
    }
  }, [setCartItems]);

  const orderId = "ZYP-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .success-icon { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
      `}</style>

      <div style={styles.card}>
        <div className="success-icon" style={styles.iconWrapper}>
          <CheckCircle size={80} color="#5ccb5f" />
        </div>
        
        <h1 style={styles.title}>Order Placed Successfully!</h1>
        <p style={styles.text}>Thank you for shopping with ZYPHONE. Your premium tech is on its way.</p>
        
        <div style={styles.orderInfo}>
          <div style={styles.infoRow}>
            <span>Order ID:</span>
            <span style={styles.idText}>{orderId}</span>
          </div>
          <div style={styles.infoRow}>
            <span>Estimated Delivery:</span>
            <span style={{color: '#fff'}}>3-5 Business Days</span>
          </div>
        </div>

        <div style={styles.btnGroup}>
          <Link to="/all-products" style={styles.primaryBtn}>
            Continue Shopping <ArrowRight size={18} />
          </Link>
          <Link to="/" style={styles.secondaryBtn}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0b",
    padding: "20px"
  },
  card: {
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.02)",
    padding: "50px 40px",
    borderRadius: "32px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(10px)"
  },
  iconWrapper: { marginBottom: "25px", display: "inline-block" },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "32px",
    color: "#fff",
    marginBottom: "15px"
  },
  text: { color: "rgba(255, 255, 255, 0.5)", lineHeight: "1.6", marginBottom: "30px" },
  orderInfo: {
    background: "rgba(255, 255, 255, 0.03)",
    padding: "20px",
    borderRadius: "18px",
    marginBottom: "35px",
    textAlign: "left"
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.4)"
  },
  idText: { color: "#5ccb5f", fontWeight: "bold", fontFamily: "monospace", fontSize: "16px" },
  btnGroup: { display: "flex", flexDirection: "column", gap: "15px" },
  primaryBtn: {
    background: "#fff",
    color: "#000",
    padding: "16px",
    borderRadius: "50px",
    fontWeight: "bold",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "0.3s"
  },
  secondaryBtn: {
    color: "rgba(255, 255, 255, 0.6)",
    textDecoration: "underline",
    fontSize: "14px"
  }
};

export default OrderSuccess;