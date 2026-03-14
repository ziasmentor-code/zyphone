// pages/OrderDetails.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
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

const fmtDate = (d, opts) =>
  d ? new Date(d).toLocaleDateString("en-IN", opts) : "N/A";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/80/f3f4f6/9ca3af?text=";
  if (imagePath.startsWith("http") || imagePath.startsWith("data:image"))
    return imagePath;
  const base = "http://127.0.0.1:8000";
  if (imagePath.startsWith("/media/")) return `${base}${imagePath}`;
  return `${base}/media/${imagePath}`;
};

const STATUS_CONFIG = {
  pending:   { bg: "#fef3c7", color: "#92400e", Icon: Clock },
  confirmed: { bg: "#dbeafe", color: "#1e40af", Icon: Package },
  shipped:   { bg: "#ede9fe", color: "#5b21b6", Icon: Truck },
  delivered: { bg: "#d1fae5", color: "#065f46", Icon: CheckCircle },
  cancelled: { bg: "#fee2e2", color: "#991b1b", Icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase() || "pending";
  const cfg = STATUS_CONFIG[key] || { bg: "#f3f4f6", color: "#374151", Icon: Package };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 11px", borderRadius: 20,
      fontSize: 11, fontWeight: 500, letterSpacing: "0.05em",
      textTransform: "uppercase", background: cfg.bg, color: cfg.color,
      fontFamily: "'DM Mono', monospace",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
      {status || "Pending"}
    </span>
  );
};

/* ─── Status Timeline ───────────────────────────────────────────────────────── */
const STEPS = ["pending", "confirmed", "shipped", "delivered"];

const StatusTimeline = ({ status }) => {
  const current = STEPS.indexOf(status?.toLowerCase());
  const isCancelled = status?.toLowerCase() === "cancelled";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "20px 0 4px" }}>
      {STEPS.map((step, i) => {
        const done = !isCancelled && current >= i;
        const active = !isCancelled && current === i;
        const cfg = STATUS_CONFIG[step];
        const Icon = cfg.Icon;
        return (
          <React.Fragment key={step}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? cfg.bg : "#f3f4f6",
                border: active ? `2px solid ${cfg.color}` : "1.5px solid #e5e7eb",
                transition: "all 0.3s",
              }}>
                <Icon size={15} color={done ? cfg.color : "#d1d5db"} />
              </div>
              <span style={{
                fontSize: 10, marginTop: 6, fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: done ? cfg.color : "#9ca3af", fontWeight: active ? 500 : 400,
              }}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                height: 1.5, flex: 1, marginBottom: 22,
                background: !isCancelled && current > i ? "#c7d2fe" : "#e5e7eb",
                transition: "background 0.3s",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ─── Section Card ──────────────────────────────────────────────────────────── */
const SectionCard = ({ title, children, style }) => (
  <div style={{ ...s.card, ...style }}>
    <p style={s.sectionLabel}>{title}</p>
    {children}
  </div>
);

/* ─── Main Component ────────────────────────────────────────────────────────── */
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
      const response = await api.get(`orders/${orderId}/`);
      setOrder(response.data);
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (key) =>
    setImageErrors((prev) => ({ ...prev, [key]: true }));

  const imgSrc = (path, key) =>
    imageErrors[key]
      ? "https://via.placeholder.com/80/f3f4f6/9ca3af?text="
      : getImageUrl(path);

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <FontImport />
        <div style={s.page}>
          <div style={s.loadingWrap}>
            <span style={s.loadingText}>Loading order details…</span>
          </div>
        </div>
      </>
    );
  }

  /* ── Not Found ── */
  if (!order) {
    return (
      <>
        <FontImport />
        <div style={s.page}>
          <div style={s.container}>
            <button onClick={() => navigate("/my-orders")} style={s.backBtn}>
              <ArrowLeft size={15} /> Back to Orders
            </button>
            <div style={{ ...s.card, textAlign: "center", padding: "60px 40px" }}>
              <Package size={48} color="#c7d2fe" />
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1a2744", marginTop: 20 }}>
                Order not found
              </h2>
              <button onClick={() => navigate("/my-orders")} style={{ ...s.primaryBtn, marginTop: 24, maxWidth: 200 }}>
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const subtotal = order.items?.reduce(
    (sum, it) => sum + Number(it.price) * Number(it.quantity), 0
  ) || 0;

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
              <p style={s.pageLabel}>Order / Details</p>
              <h1 style={s.pageTitle}>Order Details</h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={s.pageLabel}>Order ID</p>
              <p style={s.pageOrderId}>ORD-{String(order.id).padStart(5, "0")}</p>
            </div>
          </div>

          {/* Status Card */}
          <SectionCard title="Order Status">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {(() => {
                  const key = order.status?.toLowerCase() || "pending";
                  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.pending;
                  const Icon = cfg.Icon;
                  return <Icon size={18} color={cfg.color} />;
                })()}
                <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
                  {order.status === "delivered" ? "Delivered on" : "Order placed on"}{" "}
                  {fmtDate(order.created_at, { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <StatusTimeline status={order.status} />
          </SectionCard>

          {/* Two-column: Summary + Shipping */}
          <div style={s.twoCol}>

            {/* Order Summary */}
            <SectionCard title="Order Summary">
              {[
                ["Order ID",       `ORD-${String(order.id).padStart(5, "0")}`],
                ["Date",           fmtDate(order.created_at, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })],
                ["Payment",        order.payment_method || "COD"],
                ["Items",          order.items?.length || 0],
              ].map(([label, val]) => (
                <div key={label} style={s.infoRow}>
                  <span style={s.infoLabel}>{label}</span>
                  <span style={s.infoVal}>{val}</span>
                </div>
              ))}
              <div style={s.totalRow}>
                <span style={s.totalLabel}>Order Total</span>
                <span style={s.totalVal}>₹{fmt(order.total_price)}</span>
              </div>
            </SectionCard>

            {/* Shipping */}
            <SectionCard title="Shipping Details">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <p style={s.infoLabel}>Delivery Address</p>
                  <p style={{ ...s.infoVal, marginTop: 4, lineHeight: 1.6, color: "#374151" }}>
                    {order.shipping_address}
                  </p>
                </div>
                <div>
                  <p style={s.infoLabel}>Phone</p>
                  <p style={{ ...s.infoVal, marginTop: 4, fontFamily: "'DM Mono', monospace", color: "#374151" }}>
                    {order.phone}
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Order Items */}
          <SectionCard title="Order Items">
            <table style={s.table}>
              <thead>
                <tr>
                  {["Item", "Qty", "Unit Price", "Total"].map((h) => (
                    <th key={h} style={{ ...s.th, textAlign: h === "Item" ? "left" : "right" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i}>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          src={imgSrc(item.product_image, `item-${i}`)}
                          alt={item.product_name}
                          style={s.itemImg}
                          onError={() => handleImageError(`item-${i}`)}
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
                      ₹{fmt(Number(item.price) * Number(item.quantity))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Price Breakdown */}
            <div style={s.priceBreakdown}>
              <div style={s.priceRow}>
                <span style={s.priceLabel}>Subtotal</span>
                <span style={{ ...s.mono, fontSize: 14, color: "#374151" }}>₹{fmt(subtotal)}</span>
              </div>
              <div style={s.priceRow}>
                <span style={s.priceLabel}>Shipping</span>
                <span style={{ ...s.mono, fontSize: 14, color: "#059669" }}>Free</span>
              </div>
              <div style={{ ...s.priceRow, borderTop: "1.5px solid #1a2744", paddingTop: 12, marginTop: 4 }}>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: "#1a2744" }}>
                  Grand Total
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 600, color: "#2a5bd7" }}>
                  ₹{fmt(order.total_price)}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Action Buttons */}
          <div style={s.actions}>
            <button onClick={() => navigate("/my-orders")} style={s.secondaryBtn}>
              ← Back to Orders
            </button>
            <button onClick={() => navigate("/products")} style={s.primaryBtn}>
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

/* ─── Styles ─────────────────────────────────────────────────────────────────── */
const FONT_BODY    = "'Outfit', sans-serif";
const FONT_MONO    = "'DM Mono', monospace";
const FONT_DISPLAY = "'DM Serif Display', serif";

const s = {
  page: {
    minHeight: "100vh",
    background: "#f8f7f4",
    padding: "40px 20px 60px",
    fontFamily: FONT_BODY,
  },
  container: { maxWidth: 780, margin: "0 auto" },
  loadingWrap: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" },
  loadingText: { fontFamily: FONT_MONO, fontSize: 14, color: "#9ca3af", letterSpacing: "0.05em" },

  /* Back */
  backBtn: {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontSize: 13, color: "#6b7280", background: "none",
    border: "0.5px solid #e5e7eb", borderRadius: 6,
    padding: "6px 12px", cursor: "pointer",
    marginBottom: 28, fontFamily: FONT_BODY,
  },

  /* Page Head */
  pageHead: {
    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
    borderBottom: "2px solid #1a2744", paddingBottom: 14, marginBottom: 24,
  },
  pageLabel: {
    fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
    color: "#9ca3af", fontFamily: FONT_MONO, marginBottom: 4, margin: 0,
  },
  pageTitle: { fontFamily: FONT_DISPLAY, fontSize: 30, color: "#1a2744", margin: 0 },
  pageOrderId: { fontFamily: FONT_MONO, fontSize: 15, fontWeight: 600, color: "#2a5bd7", margin: 0, marginTop: 4 },

  /* Card */
  card: {
    background: "#fff", border: "0.5px solid #e5e7eb",
    borderRadius: 12, padding: "20px 22px", marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
    color: "#9ca3af", fontFamily: FONT_MONO, margin: "0 0 16px 0",
  },

  /* Two column */
  twoCol: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 0,
  },

  /* Info rows */
  infoRow: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  infoLabel: { fontSize: 12, color: "#9ca3af", fontFamily: FONT_MONO },
  infoVal: { fontSize: 13, color: "#111827", fontWeight: 500, textAlign: "right" },

  totalRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    borderTop: "0.5px solid #e5e7eb", paddingTop: 14, marginTop: 8,
  },
  totalLabel: { fontFamily: FONT_DISPLAY, fontSize: 15, color: "#1a2744" },
  totalVal: { fontFamily: FONT_MONO, fontSize: 20, fontWeight: 600, color: "#2a5bd7" },

  /* Table */
  table: { width: "100%", borderCollapse: "collapse", marginBottom: 20 },
  th: {
    fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
    color: "#9ca3af", fontFamily: FONT_MONO, fontWeight: 500,
    padding: "0 0 10px 0", borderBottom: "0.5px solid #e5e7eb",
  },
  td: {
    padding: "13px 0", borderBottom: "0.5px solid #f3f4f6",
    fontSize: 13, color: "#111827", verticalAlign: "middle",
  },
  mono: { fontFamily: FONT_MONO },
  itemImg: {
    width: 48, height: 48, borderRadius: 8,
    objectFit: "cover", border: "0.5px solid #e5e7eb",
    background: "#f3f4f6", flexShrink: 0,
  },
  itemName: { fontSize: 13, fontWeight: 500, color: "#111827" },

  /* Price breakdown */
  priceBreakdown: {
    background: "#f9fafb", borderRadius: 8,
    padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10,
  },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  priceLabel: { fontSize: 13, color: "#6b7280" },

  /* Actions */
  actions: { display: "flex", gap: 12, marginTop: 8 },
  primaryBtn: {
    flex: 1, padding: "13px", background: "#2a5bd7",
    color: "#fff", border: "none", borderRadius: 8,
    fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONT_BODY,
  },
  secondaryBtn: {
    flex: 1, padding: "13px", background: "transparent",
    color: "#374151", border: "0.5px solid #d1d5db", borderRadius: 8,
    fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONT_BODY,
  },
};

/* Responsive: stack two-col on small screens */
const ResponsiveStyle = () => (
  <style>{`
    @media (max-width: 560px) {
      .order-two-col { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

export default OrderDetails;