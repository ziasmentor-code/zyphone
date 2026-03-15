// pages/MyOrders.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import { 
  Package, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Truck,
  TrendingUp,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye
} from "lucide-react";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, delivered, etc.
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pending: 0,
    delivered: 0
  });

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view orders");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("orders/");
      const ordersData = response.data;
      setOrders(ordersData);
      
      // Calculate stats
      const stats = ordersData.reduce((acc, order) => {
        acc.totalOrders++;
        acc.totalSpent += Number(order.total_price || 0);
        if (order.status?.toLowerCase() === 'pending') acc.pending++;
        if (order.status?.toLowerCase() === 'delivered') acc.delivered++;
        return acc;
      }, { totalOrders: 0, totalSpent: 0, pending: 0, delivered: 0 });
      
      setStats(stats);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' };
      case 'confirmed': return { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' };
      case 'shipped': return { bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' };
      case 'delivered': return { bg: '#d1fae5', text: '#065f46', dot: '#10b981' };
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' };
      default: return { bg: '#f3f4f6', text: '#4b5563', dot: '#6b7280' };
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return <Clock size={14} />;
      case 'delivered': return <CheckCircle size={14} />;
      case 'shipped': return <Truck size={14} />;
      default: return <Package size={14} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filter !== 'all' && order.status?.toLowerCase() !== filter) return false;
    
    // Search by order ID or product name
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesId = order.id.toString().includes(searchLower);
      const matchesProduct = order.items?.some(item => 
        item.product_name?.toLowerCase().includes(searchLower)
      );
      return matchesId || matchesProduct;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header with Stats */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={styles.title}>My Orders</h1>
            <p style={styles.subtitle}>Track and manage your orders</p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.downloadBtn}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconBg}>
            <Package size={20} color="#3b82f6" />
          </div>
          <div>
            <p style={styles.statLabel}>Total Orders</p>
            <h2 style={styles.statValue}>{stats.totalOrders}</h2>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIconBg}>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <div>
            <p style={styles.statLabel}>Total Spent</p>
            <h2 style={styles.statValue}>₹{stats.totalSpent.toLocaleString('en-IN')}</h2>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIconBg}>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div>
            <p style={styles.statLabel}>Pending</p>
            <h2 style={styles.statValue}>{stats.pending}</h2>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIconBg}>
            <CheckCircle size={20} color="#10b981" />
          </div>
          <div>
            <p style={styles.statLabel}>Delivered</p>
            <h2 style={styles.statValue}>{stats.delivered}</h2>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={styles.filtersSection}>
        <div style={styles.filterTabs}>
          <button 
            onClick={() => setFilter('all')}
            style={{
              ...styles.filterTab,
              ...(filter === 'all' ? styles.filterTabActive : {})
            }}
          >
            All Orders
          </button>
          <button 
            onClick={() => setFilter('pending')}
            style={{
              ...styles.filterTab,
              ...(filter === 'pending' ? styles.filterTabActive : {})
            }}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('delivered')}
            style={{
              ...styles.filterTab,
              ...(filter === 'delivered' ? styles.filterTabActive : {})
            }}
          >
            Delivered
          </button>
          <button 
            onClick={() => setFilter('shipped')}
            style={{
              ...styles.filterTab,
              ...(filter === 'shipped' ? styles.filterTabActive : {})
            }}
          >
            Shipped
          </button>
        </div>
        
        <div style={styles.searchBox}>
          <Search size={18} color="#666" />
          <input
            type="text"
            placeholder="Search by order ID or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <Package size={60} color="#333" />
          <h2>No orders found</h2>
          <p>Try adjusting your filters or search term</p>
          <button onClick={() => navigate("/products")} style={styles.shopBtn}>
            Browse Products
          </button>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {filteredOrders.map((order) => {
            const statusColors = getStatusColor(order.status);
            const firstItem = order.items?.[0] || {};
            
            return (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div style={styles.orderInfo}>
                    <span style={styles.orderId}>#{order.id}</span>
                    <span style={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColors.bg,
                    color: statusColors.text
                  }}>
                    <span style={{
                      ...styles.statusDot,
                      backgroundColor: statusColors.dot
                    }} />
                    {getStatusIcon(order.status)}
                    <span>{order.status || 'Pending'}</span>
                  </span>
                </div>

                <div style={styles.orderContent}>
                  {/* Product Image */}
                  <div style={styles.productImageContainer}>
                    {firstItem.product_image ? (
                      <img 
                        src={`http://127.0.0.1:8000${firstItem.product_image}`}
                        alt={firstItem.product_name}
                        style={styles.productImage}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80/1a1a1a/666?text=Product";
                        }}
                      />
                    ) : (
                      <div style={styles.noImage}>
                        <Package size={24} color="#666" />
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div style={styles.orderDetails}>
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>
                        {firstItem.product_name || 'Product'}
                      </h3>
                      {order.items?.length > 1 && (
                        <span style={styles.moreItems}>
                          +{order.items.length - 1} more items
                        </span>
                      )}
                    </div>
                    
                    <div style={styles.orderMeta}>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Total:</span>
                        <span style={styles.metaValue}>
                          ₹{Number(order.total_price).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Payment:</span>
                        <span style={styles.metaValue}>{order.payment_method || 'COD'}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Button */}
                  <button 
                    onClick={() => navigate(`/order/${order.id}`)}
                    style={styles.viewButton}
                  >
                    <Eye size={16} />
                    <span>View</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    background: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  backButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'white',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#374151',
    transition: 'all 0.2s'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#111',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '5px 0 0'
  },
  headerRight: {
    display: 'flex',
    gap: '10px'
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  statIconBg: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111',
    margin: '5px 0 0'
  },
  filtersSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  filterTabs: {
    display: 'flex',
    gap: '10px',
    background: '#f1f5f9',
    padding: '4px',
    borderRadius: '10px'
  },
  filterTab: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  filterTabActive: {
    background: 'white',
    color: '#3b82f6',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'white',
    padding: '8px 16px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    width: '300px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    width: '100%',
    background: 'transparent'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  orderCard: {
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  orderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  orderId: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111'
  },
  orderDate: {
    fontSize: '14px',
    color: '#6b7280'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500'
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%'
  },
  orderContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px'
  },
  productImageContainer: {
    width: '80px',
    height: '80px',
    background: '#f3f4f6',
    borderRadius: '8px',
    overflow: 'hidden',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f3f4f6',
    color: '#9ca3af'
  },
  orderDetails: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#111',
    margin: 0
  },
  moreItems: {
    fontSize: '13px',
    color: '#6b7280'
  },
  orderMeta: {
    textAlign: 'right'
  },
  metaItem: {
    marginBottom: '4px'
  },
  metaLabel: {
    fontSize: '13px',
    color: '#9ca3af',
    marginRight: '8px'
  },
  metaValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111'
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '12px'
  },
  shopBtn: {
    padding: '12px 24px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '20px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f4f6',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  }
};

export default MyOrders;