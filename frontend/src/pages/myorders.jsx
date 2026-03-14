// pages/MyOrders.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import { Package, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

/* ─── Google Fonts ─────────────────────────────────────────────────────────── */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap');
  `}</style>
);

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 0 });

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/40/eef2ff/6366f1?text=";
  if (imagePath.startsWith("http") || imagePath.startsWith("data:image"))
    return imagePath;
  const base = "http://127.0.0.1:8000";
  if (imagePath.startsWith("/media/")) return `${base}${imagePath}`;
  if (imagePath.startsWith("/")) return `${base}/media${imagePath}`;
  return `${base}/media/${imagePath}`;
};

const STATUS_CONFIG = {
  pending:   { bg: "#fef3c7", color: "#92400e" },
  confirmed: { bg: "#dbeafe", color: "#1e40af" },
  shipped:   { bg: "#ede9fe", color: "#5b21b6" },
  delivered: { bg: "#d1fae5", color: "#065f46" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase() || "pending";
  const cfg = STATUS_CONFIG[key] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 11px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: cfg.bg,
        color: cfg.color,
        fontFamily: "'DM Mono', monospace",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.color,
          display: "inline-block",
        }}
      />
      {status || "Pending"}
    </span>
  );
};

/* ─── Main Component ────────────────────────────────────────────────────────── */
const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

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
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (key) =>
    setImageErrors((prev) => ({ ...prev, [key]: true }));

  const imgSrc = (path, key) =>
    imageErrors[key]
      ? "https://via.placeholder.com/40/f3f4f6/9ca3af?text="
      : getImageUrl(path);

  const totalSpent = orders.reduce(
    (s, o) => s + Number(o.total_price || 0),
    0
  );
  const pendingCount = orders.filter(
    (o) => o.status?.toLowerCase() === "pending"
  ).length;

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <FontImport />
        <div style={s.page}>
          <div style={s.loadingWrap}>
            <span style={s.loadingText}>Loading orders…</span>
          </div>
        </div>
      </>
    );
  }

  /* ── Empty ── */
  if (!orders.length) {
    return (
      <>
        <FontImport />
        <div style={s.page}>
          <div style={s.container}>
            <button onClick={() => navigate(-1)} style={s.backBtn}>
              <ArrowLeft size={15} /> Back
            </button>
            <div style={s.emptyCard}>
              <Package size={48} color="#c7d2fe" />
              <h2 style={s.emptyTitle}>No orders yet</h2>
              <p style={s.emptyText}>
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => navigate("/products")}
                style={s.shopBtn}
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Main ── */
  return (
    <>
      <FontImport />
      <div style={s.page}>
        <div style={s.container}>

          {/* Back */}
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            <ArrowLeft size={15} /> Back
          </button>

          {/* Page Header */}
          <div style={s.pageHead}>
            <div>
              <p style={s.pageLabel}>Account / Purchase History</p>
              <h1 style={s.pageTitle}>My Orders</h1>
            </div>
            <div style={s.pageMeta}>
              <span>As of {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          {/* Stats */}
          <div style={s.statRow}>
            {[
              { label: "Total Orders", value: orders.length },
              { label: "Total Spent", value: `₹${fmt(totalSpent)}` },
              { label: "Pending", value: pendingCount },
            ].map((st) => (
              <div key={st.label} style={s.statCard}>
                <p style={s.statLabel}>{st.label}</p>
                <p style={s.statVal}>{st.value}</p>
              </div>
            ))}
          </div>

          {/* Orders List */}
          <div style={s.list}>
            {orders.map((order) => {
              const isOpen = expandedOrder === order.id;
              return (
                <div key={order.id} style={s.card}>

                  {/* Card Header — clickable */}
                  <div
                    style={s.cardHead}
                    onClick={() =>
                      setExpandedOrder(isOpen ? null : order.id)
                    }
                  >
                    <div>
                      <p style={s.orderId}>ORD-{String(order.id).padStart(5, "0")}</p>
                      <p style={s.orderDate}>{fmtDate(order.created_at)}</p>
                    </div>
                    <div style={s.headRight}>
                      <span style={s.orderAmt}>₹{fmt(order.total_price)}</span>
                      <StatusBadge status={order.status} />
                      <span style={{ ...s.chevron, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                        <ChevronDown size={16} color="#9ca3af" />
                      </span>
                    </div>
                  </div>

                  {/* Preview Strip (always visible) */}
                  {order.items?.length > 0 && (
                    <div style={s.previewStrip}>
                      {order.items.slice(0, 3).map((item, i) => (
                        <img
                          key={i}
                          src={imgSrc(item.product_image, `prev-${order.id}-${i}`)}
                          alt={item.product_name}
                          style={s.previewImg}
                          onError={() => handleImageError(`prev-${order.id}-${i}`)}
                        />
                      ))}
                      <span style={s.previewNames}>
                        {order.items
                          .slice(0, 2)
                          .map((it) => it.product_name)
                          .join(", ")}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </span>
                      <span style={s.payMethod}>
                        {order.payment_method || "COD"}
                      </span>
                    </div>
                  )}

                  {/* Expanded Body */}
                  {isOpen && (
                    <div style={s.cardBody}>

                      {/* Items Table */}
                      <table style={s.table}>
                        <thead>
                          <tr>
                            {["Item", "Qty", "Unit Price", "Total"].map((h) => (
                              <th
                                key={h}
                                style={{
                                  ...s.th,
                                  textAlign: h === "Item" ? "left" : "right",
                                }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {order.items?.map((item, i) => (
                            <tr key={i}>
                              <td style={s.td}>
                                <div style={s.itemNameWrap}>
                                  <img
                                    src={imgSrc(item.product_image, `exp-${order.id}-${i}`)}
                                    alt={item.product_name}
                                    style={s.itemImg}
                                    onError={() => handleImageError(`exp-${order.id}-${i}`)}
                                  />
                                  <span style={s.itemName}>{item.product_name}</span>
                                </div>
                              </td>
                              <td style={{ ...s.td, ...s.mono, textAlign: "right", color: "#6b7280" }}>
                                ×{item.quantity}
                              </td>
                              <td style={{ ...s.td, ...s.mono, textAlign: "right" }}>
                                ₹{fmt(item.price)}
                              </td>
                              <td style={{ ...s.td, ...s.mono, textAlign: "right", fontWeight: 600 }}>
                                ₹{fmt(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Footer: shipping + total */}
                      <div style={s.cardFooter}>
                        <div>
                          <p style={s.detailLabel}>Shipped to</p>
                          <p style={s.detailVal}>{order.shipping_address}</p>
                          <p style={{ ...s.detailVal, marginTop: 2 }}>{order.phone}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={s.detailLabel}>Order Total</p>
                          <p style={s.totalVal}>₹{fmt(order.total_price)}</p>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
};

/* ─── Styles ─────────────────────────────────────────────────────────────────── */
const FONT_BODY = "'Outfit', sans-serif";
const FONT_MONO = "'DM Mono', monospace";
const FONT_DISPLAY = "'DM Serif Display', serif";

const s = {
  page: {
    minHeight: "100vh",
    background: "#f8f7f4",
    padding: "40px 20px 60px",
    fontFamily: FONT_BODY,
  },
  container: {
    maxWidth: 780,
    margin: "0 auto",
  },
  loadingWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  loadingText: {
    fontFamily: FONT_MONO,
    fontSize: 14,
    color: "#9ca3af",
    letterSpacing: "0.05em",
  },

  /* Back */
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#6b7280",
    background: "none",
    border: "0.5px solid #e5e7eb",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    marginBottom: 28,
    fontFamily: FONT_BODY,
  },

  /* Page head */
  pageHead: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottom: "2px solid #1a2744",
    paddingBottom: 14,
    marginBottom: 28,
  },
  pageLabel: {
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#9ca3af",
    fontFamily: FONT_MONO,
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 30,
    color: "#1a2744",
    margin: 0,
  },
  pageMeta: {
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: FONT_MONO,
    textAlign: "right",
  },

  /* Stats */
  statRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    background: "#fff",
    border: "0.5px solid #e5e7eb",
    borderRadius: 10,
    padding: "14px 18px",
  },
  statLabel: {
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#9ca3af",
    marginBottom: 6,
    fontFamily: FONT_MONO,
  },
  statVal: {
    fontSize: 24,
    fontWeight: 600,
    color: "#1a2744",
    fontFamily: FONT_MONO,
    margin: 0,
  },

  /* List */
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  /* Card */
  card: {
    background: "#fff",
    border: "0.5px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "0.5px solid #f3f4f6",
    cursor: "pointer",
  },
  orderId: {
    fontFamily: FONT_MONO,
    fontSize: 13,
    fontWeight: 500,
    color: "#2a5bd7",
    margin: 0,
    marginBottom: 3,
  },
  orderDate: {
    fontSize: 12,
    color: "#9ca3af",
    margin: 0,
  },
  headRight: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  orderAmt: {
    fontFamily: FONT_MONO,
    fontSize: 15,
    fontWeight: 600,
    color: "#1a2744",
  },
  chevron: {
    display: "flex",
    alignItems: "center",
    transition: "transform 0.2s ease",
  },

  /* Preview strip */
  previewStrip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    background: "#f9fafb",
    borderBottom: "0.5px solid #f3f4f6",
  },
  previewImg: {
    width: 30,
    height: 30,
    borderRadius: 6,
    objectFit: "cover",
    border: "0.5px solid #e5e7eb",
    background: "#f3f4f6",
  },
  previewNames: {
    flex: 1,
    fontSize: 12,
    color: "#6b7280",
  },
  payMethod: {
    fontSize: 11,
    color: "#9ca3af",
    fontFamily: FONT_MONO,
  },

  /* Expanded body */
  cardBody: {
    padding: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20,
  },
  th: {
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#9ca3af",
    fontFamily: FONT_MONO,
    fontWeight: 500,
    padding: "0 0 10px 0",
    borderBottom: "0.5px solid #e5e7eb",
  },
  td: {
    padding: "12px 0",
    borderBottom: "0.5px solid #f3f4f6",
    fontSize: 13,
    color: "#111827",
    verticalAlign: "middle",
  },
  mono: {
    fontFamily: FONT_MONO,
  },
  itemNameWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
  },
  itemImg: {
    width: 36,
    height: 36,
    borderRadius: 7,
    objectFit: "cover",
    border: "0.5px solid #e5e7eb",
    background: "#f3f4f6",
    flexShrink: 0,
  },
  itemName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#111827",
  },

  /* Footer */
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 16,
    borderTop: "0.5px solid #e5e7eb",
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#9ca3af",
    fontFamily: FONT_MONO,
    marginBottom: 4,
    margin: 0,
  },
  detailVal: {
    fontSize: 13,
    color: "#374151",
    margin: 0,
    marginTop: 4,
    lineHeight: 1.5,
  },
  totalVal: {
    fontFamily: FONT_MONO,
    fontSize: 22,
    fontWeight: 600,
    color: "#2a5bd7",
    margin: 0,
    marginTop: 4,
  },

  /* Empty state */
  emptyCard: {
    background: "#fff",
    border: "0.5px solid #e5e7eb",
    borderRadius: 12,
    padding: "60px 40px",
    textAlign: "center",
  },
  emptyTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 22,
    color: "#1a2744",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 28,
  },
  shopBtn: {
    padding: "10px 28px",
    background: "#2a5bd7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
};

export default MyOrders;