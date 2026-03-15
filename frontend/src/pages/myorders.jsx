import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import { 
  Package, ArrowLeft, Clock, CheckCircle, Truck,
  TrendingUp, ChevronRight, Search, Filter, Download,
  Eye, ShoppingBag, XCircle, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, pending: 0, delivered: 0 });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("orders/");
      const ordersData = response.data;
      setOrders(ordersData);
      
      const calculatedStats = ordersData.reduce((acc, order) => {
        acc.totalOrders++;
        acc.totalSpent += Number(order.total_price || 0);
        if (order.status?.toLowerCase() === 'pending') acc.pending++;
        if (order.status?.toLowerCase() === 'delivered') acc.delivered++;
        return acc;
      }, { totalOrders: 0, totalSpent: 0, pending: 0, delivered: 0 });
      
      setStats(calculatedStats);
    } catch (error) {
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return { color: '#f59e0b', bg: '#f59e0b15', icon: <Clock size={14} /> };
      case 'delivered': return { color: '#00e676', bg: '#00e67615', icon: <CheckCircle size={14} /> };
      case 'shipped': return { color: '#3b82f6', bg: '#3b82f615', icon: <Truck size={14} /> };
      case 'cancelled': return { color: '#ff4444', bg: '#ff444415', icon: <XCircle size={14} /> };
      default: return { color: '#888', bg: '#ffffff10', icon: <Package size={14} /> };
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status?.toLowerCase() !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return order.id.toString().includes(searchLower) || 
             order.items?.some(item => item.product_name?.toLowerCase().includes(searchLower));
    }
    return true;
  });

  if (loading) return <div style={styles.loader}><div style={styles.spinner}></div></div>;

  return (
    <div style={styles.container}>
      {/* Navbar / Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={20} /></button>
          <div>
            <h1 style={styles.title}>Order Intelligence</h1>
            <p style={styles.subtitle}>Track your tech ecosystem</p>
          </div>
        </div>
        <button style={styles.exportBtn}><Download size={16} /> Export JSON</button>
      </div>

      {/* Stats Dashboard */}
      <div style={styles.statsGrid}>
        <StatCard label="Total Orders" value={stats.totalOrders} icon={<Package />} color="#3b82f6" />
        <StatCard label="Total Investment" value={`₹${stats.totalSpent.toLocaleString()}`} icon={<TrendingUp />} color="#00e676" />
        <StatCard label="In Transit" value={stats.pending} icon={<Clock />} color="#f59e0b" />
        <StatCard label="Success Rate" value={stats.totalOrders > 0 ? `${Math.round((stats.delivered/stats.totalOrders)*100)}%` : '0%'} icon={<CheckCircle />} color="#00e676" />
      </div>

      {/* Controls: Search & Filter */}
      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            style={styles.searchInput} 
            placeholder="Search Order ID or Device..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.filterTabs}>
          {['all', 'pending', 'shipped', 'delivered'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              style={{...styles.tab, ...(filter === t ? styles.activeTab : {})}}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div style={styles.ordersList}>
        {filteredOrders.length === 0 ? (
          <div style={styles.emptyState}>
            <ShoppingBag size={48} color="#222" />
            <p>No orders matching your criteria</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.cardHeader}>
                <div style={styles.idGroup}>
                  <span style={styles.idLabel}>ORDER ID</span>
                  <span style={styles.idValue}>#TZ-{order.id}</span>
                </div>
                <div style={{...styles.statusBadge, color: getStatusStyle(order.status).color, background: getStatusStyle(order.status).bg}}>
                  {getStatusStyle(order.status).icon}
                  {order.status || 'Processing'}
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.itemPreview}>
                  <div style={styles.imgWrapper}>
                    <img 
                      src={order.items?.[0]?.product_image ? `http://127.0.0.1:8000${order.items[0].product_image}` : "https://via.placeholder.com/80"} 
                      style={styles.prodImg} 
                      alt="Product"
                    />
                  </div>
                  <div style={styles.prodDetails}>
                    <h3 style={styles.prodName}>{order.items?.[0]?.product_name || 'Tech Component'}</h3>
                    <p style={styles.dateText}>{new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>

                <div style={styles.priceSection}>
                  <div style={styles.priceLabel}>TOTAL AMOUNT</div>
                  <div style={styles.priceValue}>₹{Number(order.total_price).toLocaleString()}</div>
                </div>

                <button onClick={() => navigate(`/order/${order.id}`)} style={styles.viewBtn}>
                  Manage <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Reusable Stat Component
const StatCard = ({ label, value, icon, color }) => (
  <div style={styles.statCard}>
    <div style={{...styles.statIcon, color: color, background: `${color}15`}}>{icon}</div>
    <div>
      <p style={styles.statLabel}>{label}</p>
      <h2 style={styles.statValue}>{value}</h2>
    </div>
  </div>
);

const styles = {
  container: { minHeight: '100vh', background: '#050505', padding: '40px 5%', color: '#fff', fontFamily: '"Inter", sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  backBtn: { background: '#111', border: '1px solid #222', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer' },
  title: { fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-1px' },
  subtitle: { color: '#666', fontSize: '14px', margin: '4px 0 0' },
  exportBtn: { background: 'transparent', border: '1px solid #222', color: '#888', padding: '10px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' },
  statCard: { background: '#0f0f11', border: '1px solid #1a1a1c', padding: '20px', borderRadius: '20px', display: 'flex', gap: '15px', alignItems: 'center' },
  statIcon: { width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 },
  statValue: { fontSize: '20px', fontWeight: '800', margin: '4px 0 0' },

  controls: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '20px' },
  searchWrapper: { position: 'relative', flex: 1 },
  searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#444' },
  searchInput: { width: '100%', background: '#0f0f11', border: '1px solid #1a1a1c', padding: '14px 15px 14px 45px', borderRadius: '14px', color: '#fff', outline: 'none' },
  filterTabs: { display: 'flex', background: '#0f0f11', padding: '5px', borderRadius: '14px', border: '1px solid #1a1a1c' },
  tab: { padding: '8px 16px', border: 'none', background: 'transparent', color: '#555', fontSize: '11px', fontWeight: '700', cursor: 'pointer', borderRadius: '10px' },
  activeTab: { background: '#1a1a1c', color: '#00e676' },

  ordersList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  orderCard: { background: '#0f0f11', borderRadius: '24px', border: '1px solid #1a1a1c', overflow: 'hidden', transition: '0.3s' },
  cardHeader: { padding: '15px 25px', background: '#131315', borderBottom: '1px solid #1a1a1c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  idGroup: { display: 'flex', flexDirection: 'column' },
  idLabel: { fontSize: '9px', color: '#555', fontWeight: 'bold' },
  idValue: { fontSize: '14px', fontWeight: '700', color: '#00e676' },
  statusBadge: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 'bold' },

  cardBody: { padding: '25px', display: 'flex', alignItems: 'center', gap: '30px' },
  itemPreview: { flex: 2, display: 'flex', gap: '20px', alignItems: 'center' },
  imgWrapper: { width: '70px', height: '70px', background: '#fff', borderRadius: '16px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  prodImg: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  prodDetails: { display: 'flex', flexDirection: 'column', gap: '4px' },
  prodName: { fontSize: '17px', fontWeight: '700', margin: 0 },
  dateText: { fontSize: '13px', color: '#555' },
  
  priceSection: { flex: 1, textAlign: 'right' },
  priceLabel: { fontSize: '10px', color: '#555', fontWeight: 'bold' },
  priceValue: { fontSize: '20px', fontWeight: '800' },
  viewBtn: { background: '#fff', color: '#000', padding: '12px 20px', borderRadius: '14px', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },

  emptyState: { padding: '80px', textAlign: 'center', background: '#0f0f11', borderRadius: '24px', border: '1px dashed #222' },
  loader: { height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  spinner: { width: '40px', height: '40px', border: '3px solid #111', borderTopColor: '#00e676', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};

export default MyOrders;