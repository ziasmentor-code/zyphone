// pages/OrderDetails.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view order details");
      navigate("/login");
      return;
    }

    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      console.log(`Fetching order details for ID: ${orderId}`);
      const response = await api.get(`orders/${orderId}/`);
      console.log("Order details response:", response.data);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/100/1a1a1a/666?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('data:image')) return imagePath;
    
    const baseURL = 'http://127.0.0.1:8000';
    if (imagePath.startsWith('/media/')) {
      return `${baseURL}${imagePath}`;
    }
    return `${baseURL}/media/${imagePath}`;
  };

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return <CheckCircle size={20} color="#10b981" />;
      case 'shipped': return <Truck size={20} color="#8b5cf6" />;
      case 'pending': return <Clock size={20} color="#f59e0b" />;
      default: return <Package size={20} color="#6b7280" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return '#10b981';
      case 'shipped': return '#8b5cf6';
      case 'confirmed': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorState}>
            <Package size={60} color="#333" />
            <h2 style={styles.errorTitle}>Order not found</h2>
            <button 
              onClick={() => navigate("/my-orders")}
              style={styles.backBtn}
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 style={styles.title}>Order Details</h1>
          <div style={styles.icon}>
            <Package size={24} />
          </div>
        </div>

        {/* Order Status */}
        <div style={styles.statusCard}>
          <div style={styles.statusHeader}>
            <span style={styles.statusLabel}>Order Status</span>
            <span style={{
              ...styles.statusBadge,
              backgroundColor: getStatusColor(order.status),
              color: '#fff'
            }}>
              {order.status || 'Pending'}
            </span>
          </div>
          <div style={styles.statusInfo}>
            <div style={styles.statusItem}>
              {getStatusIcon(order.status)}
              <span style={styles.statusText}>
                {order.status === 'delivered' ? 'Delivered on' : 'Expected delivery'}
              </span>
            </div>
            <span style={styles.statusDate}>
              {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div style={styles.summaryCard}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Order ID:</span>
            <span style={styles.summaryValue}>#{order.id}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Order Date:</span>
            <span style={styles.summaryValue}>
              {order.created_at ? new Date(order.created_at).toLocaleString('en-IN') : 'N/A'}
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Payment Method:</span>
            <span style={styles.summaryValue}>{order.payment_method || 'COD'}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Total Items:</span>
            <span style={styles.summaryValue}>{order.items?.length || 0}</span>
          </div>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total Amount:</span>
            <span style={styles.totalValue}>₹{Number(order.total_price || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Shipping Details */}
        <div style={styles.shippingCard}>
          <h3 style={styles.sectionTitle}>Shipping Details</h3>
          <div style={styles.shippingRow}>
            <span style={styles.shippingLabel}>Address:</span>
            <span style={styles.shippingValue}>{order.shipping_address}</span>
          </div>
          <div style={styles.shippingRow}>
            <span style={styles.shippingLabel}>Phone:</span>
            <span style={styles.shippingValue}>{order.phone}</span>
          </div>
        </div>

        {/* Order Items */}
        <div style={styles.itemsCard}>
          <h3 style={styles.sectionTitle}>Order Items</h3>
          {order.items && order.items.map((item, index) => {
            const imgUrl = imageErrors[item.id] 
              ? "https://via.placeholder.com/80/1a1a1a/666?text=No+Image"
              : getImageUrl(item.product_image);
            
            const itemTotal = Number(item.price) * Number(item.quantity);
            
            return (
              <div key={index} style={styles.itemRow}>
                <img 
                  src={imgUrl}
                  alt={item.product_name}
                  style={styles.itemImage}
                  onError={() => handleImageError(item.id)}
                />
                <div style={styles.itemDetails}>
                  <span style={styles.itemName}>{item.product_name}</span>
                  <div style={styles.itemMeta}>
                    <span style={styles.itemPrice}>₹{Number(item.price).toLocaleString('en-IN')}</span>
                    <span style={styles.itemQty}>x {item.quantity}</span>
                  </div>
                  <span style={styles.itemTotal}>₹{itemTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button 
            onClick={() => navigate("/my-orders")}
            style={styles.secondaryBtn}
          >
            Back to Orders
          </button>
          <button 
            onClick={() => navigate("/products")}
            style={styles.primaryBtn}
          >
            Continue Shopping
          </button>
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
    padding: "40px 20px"
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto"
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px"
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
  icon: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#3b82f6"
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    color: "#888"
  },
  errorState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#1a1a1a",
    borderRadius: "12px"
  },
  errorTitle: {
    fontSize: "1.5rem",
    marginTop: "20px",
    marginBottom: "30px"
  },
  backBtn: {
    padding: "12px 30px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer"
  },
  statusCard: {
    background: "#1a1a1a",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #2a2a2a"
  },
  statusHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },
  statusLabel: {
    color: "#888",
    fontSize: "0.9rem"
  },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "500"
  },
  statusInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statusItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  statusText: {
    color: "#fff",
    fontSize: "0.95rem"
  },
  statusDate: {
    color: "#888",
    fontSize: "0.9rem"
  },
  summaryCard: {
    background: "#1a1a1a",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #2a2a2a"
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#fff"
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "0.95rem"
  },
  summaryLabel: {
    color: "#888"
  },
  summaryValue: {
    color: "#fff"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    paddingTop: "15px",
    borderTop: "1px solid #2a2a2a"
  },
  totalLabel: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#fff"
  },
  totalValue: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#3b82f6"
  },
  shippingCard: {
    background: "#1a1a1a",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #2a2a2a"
  },
  shippingRow: {
    display: "flex",
    marginBottom: "10px"
  },
  shippingLabel: {
    color: "#888",
    width: "80px"
  },
  shippingValue: {
    color: "#fff",
    flex: 1
  },
  itemsCard: {
    background: "#1a1a1a",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #2a2a2a"
  },
  itemRow: {
    display: "flex",
    gap: "15px",
    padding: "15px 0",
    borderBottom: "1px solid #2a2a2a"
  },
  itemImage: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover",
    background: "#111"
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "5px",
    color: "#fff"
  },
  itemMeta: {
    display: "flex",
    gap: "15px",
    marginBottom: "5px"
  },
  itemPrice: {
    fontSize: "0.95rem",
    color: "#888"
  },
  itemQty: {
    fontSize: "0.95rem",
    color: "#888"
  },
  itemTotal: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#3b82f6"
  },
  actionButtons: {
    display: "flex",
    gap: "15px",
    marginTop: "20px"
  },
  primaryBtn: {
    flex: 1,
    padding: "14px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer"
  },
  secondaryBtn: {
    flex: 1,
    padding: "14px",
    background: "transparent",
    color: "#fff",
    border: "2px solid #333",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default OrderDetails;