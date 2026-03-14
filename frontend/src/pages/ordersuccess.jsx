// pages/OrderSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, total } = location.state || {};
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // If no order data, redirect to home
    if (!orderId) {
      navigate("/");
      return;
    }

    // Auto redirect to my-orders after 5 seconds
    const timer = setTimeout(() => {
      navigate("/my-orders");
    }, 5000);

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Cleanup timers
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [orderId, navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <CheckCircle size={80} color="#4ade80" style={styles.icon} />
          
          <h1 style={styles.title}>Order Placed Successfully!</h1>
          
          <p style={styles.message}>
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          <div style={styles.details}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Order ID:</span>
              <span style={styles.detailValue}>#{orderId}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Total Amount:</span>
              <span style={styles.detailValue}>₹{total?.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div style={styles.redirectMessage}>
            <p>Redirecting to My Orders in <span style={styles.countdown}>{countdown}</span> seconds...</p>
          </div>
          
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => navigate("/my-orders")}
              style={styles.ordersButton}
            >
              <Package size={16} />
              View My Orders Now
            </button>
          </div>
          
          <p style={styles.note}>
            You will receive an email confirmation shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  },
  container: {
    maxWidth: "500px",
    width: "100%"
  },
  card: {
    background: "#1a1a1a",
    padding: "40px",
    borderRadius: "16px",
    border: "1px solid #2a2a2a",
    textAlign: "center"
  },
  icon: {
    marginBottom: "20px"
  },
  title: {
    fontSize: "2rem",
    marginBottom: "10px",
    fontWeight: "600"
  },
  message: {
    color: "#888",
    marginBottom: "30px",
    lineHeight: "1.6"
  },
  details: {
    background: "#222",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "left"
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },
  detailLabel: {
    color: "#888"
  },
  detailValue: {
    color: "#fff",
    fontWeight: "600"
  },
  redirectMessage: {
    marginBottom: "20px",
    color: "#888"
  },
  countdown: {
    color: "#3b82f6",
    fontWeight: "bold",
    fontSize: "1.2rem"
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginBottom: "20px"
  },
  ordersButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  note: {
    color: "#666",
    fontSize: "0.9rem"
  }
};

export default OrderSuccess;