// pages/ProductDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/authcontext";
import { WishlistContext } from "../context/wishlistcontext";
import toast from "react-hot-toast";
import { 
  Star, ArrowLeft, Heart, ShieldCheck, Truck, Package, Zap, ChevronRight,
  ZoomIn, ZoomOut, Maximize, X 
} from "lucide-react";

// Import Footer
import Footer from "../components/footer";

/* ─── Google Fonts ─────────────────────────────────────────────────────────── */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .pd-fadein { animation: fadeUp 0.45s ease both; }
    .pd-fadein-1 { animation: fadeUp 0.45s 0.05s ease both; }
    .pd-fadein-2 { animation: fadeUp 0.45s 0.12s ease both; }
    .pd-fadein-3 { animation: fadeUp 0.45s 0.20s ease both; }
    .pd-fadein-4 { animation: fadeUp 0.45s 0.28s ease both; }
    .pd-fadein-5 { animation: fadeUp 0.45s 0.36s ease both; }
    .pd-zoom-in { animation: zoomIn 0.3s ease both; }

    /* Image Zoom Styles */
    .pd-image-container {
      position: relative;
      overflow: hidden;
      cursor: crosshair;
    }

    .pd-image-container.zoomed {
      cursor: zoom-out;
    }

    .pd-main-image {
      transition: transform 0.3s ease-out;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .pd-image-container.zoomed .pd-main-image {
      transform: scale(2.5);
    }

    .pd-zoom-lens {
      position: absolute;
      border: 2px solid #dc2626;
      background: rgba(255, 255, 255, 0.2);
      width: 150px;
      height: 150px;
      pointer-events: none;
      display: none;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }

    .pd-image-container:hover .pd-zoom-lens {
      display: block;
    }

    .pd-zoom-controls {
      position: absolute;
      bottom: 20px;
      right: 20px;
      display: flex;
      gap: 8px;
      z-index: 10;
    }

    .pd-zoom-btn {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.9);
      border: 0.5px solid #e8e6df;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      backdrop-filter: blur(4px);
    }

    .pd-zoom-btn:hover {
      background: #fff;
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    /* Fullscreen Modal */
    .pd-fullscreen-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: zoomIn 0.3s ease;
    }

    .pd-fullscreen-image {
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
      cursor: zoom-in;
    }

    .pd-fullscreen-image.zoomed {
      cursor: zoom-out;
      transform: scale(2);
      transition: transform 0.3s ease;
    }

    .pd-fullscreen-close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      transition: all 0.2s;
    }

    .pd-fullscreen-close:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .pd-cart-btn:hover { background: #111 !important; }
    .pd-buy-btn:hover  { background: #b91c1c !important; }
    .pd-back-btn:hover { color: #111 !important; }
    .pd-wish-btn:hover { border-color: #fca5a5 !important; }

    .pd-rel-card { transition: box-shadow 0.2s, transform 0.2s; cursor: pointer; }
    .pd-rel-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.10); transform: translateY(-3px); }
    .pd-rel-card:hover .pd-rel-img { transform: scale(1.05); }
    .pd-rel-img { transition: transform 0.4s ease; }

    @media (max-width: 700px) {
      .pd-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
      .pd-rel-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 440px) {
      .pd-rel-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const BASE = "http://127.0.0.1:8000";
const fmt  = (n) => Number(n || 0).toLocaleString("en-IN");
const imgUrl = (path) => {
  if (!path) return "https://via.placeholder.com/400/f5f5f0/999?text=";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/media")) return `${BASE}${path}`;
  return `${BASE}${path}`;
};

/* ─── Star Row ──────────────────────────────────────────────────────────────── */
const Stars = ({ rating = 4.8 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      background: "#166534", color: "#fff",
      padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono', monospace",
    }}>
      {rating} <Star size={11} fill="#fff" />
    </div>
    <span style={{ fontSize: 13, color: "#9ca3af", fontFamily: "'Outfit', sans-serif" }}>
      1.2k Reviews
    </span>
  </div>
);

/* ─── Feature Pill ──────────────────────────────────────────────────────────── */
const FeaturePill = ({ Icon, title, sub }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "14px 16px",
    background: "#f9f8f5",
    borderRadius: 12,
    border: "0.5px solid #e8e6df",
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: "#fff", border: "0.5px solid #e8e6df",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Icon size={17} color="#374151" />
    </div>
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#111", fontFamily: "'Outfit', sans-serif" }}>{title}</p>
      <p style={{ fontSize: 11, color: "#9ca3af", fontFamily: "'Outfit', sans-serif", marginTop: 1 }}>{sub}</p>
    </div>
  </div>
);

/* ─── Image Zoom Component with Wishlist ──────────────────────────────────── */
const ImageZoom = ({ src, alt, isWishlisted, onWishlistClick }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [fullscreenZoom, setFullscreenZoom] = useState(false);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setPosition({ x, y });
    
    const lensX = e.clientX - left - 75;
    const lensY = e.clientY - top - 75;
    setLensPosition({ x: lensX, y: lensY });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenZoom(false);
    document.body.style.overflow = 'auto';
  };

  const toggleFullscreenZoom = () => {
    setFullscreenZoom(!fullscreenZoom);
  };

  return (
    <>
      <div 
        className={`pd-image-container ${isZoomed ? 'zoomed' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
        style={{
          background: "#f0efe9",
          borderRadius: 28,
          padding: "48px 40px",
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: 460, overflow: "hidden",
          border: "0.5px solid #e8e6df",
          position: "relative",
        }}
      >
        {/* Featured Tag */}
        <div style={{
          position: "absolute", top: 20, left: 20,
          background: "#fff", border: "0.5px solid #e8e6df",
          borderRadius: 20, padding: "4px 12px",
          fontSize: 11, fontWeight: 600, color: "#dc2626",
          letterSpacing: "0.08em", textTransform: "uppercase",
          fontFamily: "'DM Mono', monospace",
          zIndex: 2,
        }}>
          New Arrival
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistClick();
          }}
          style={{
            position: "absolute", top: 20, right: 20,
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#fff",
            border: isWishlisted ? "2px solid #dc2626" : "1px solid #e8e6df",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
          onMouseEnter={(e) => {
            if (!isWishlisted) e.currentTarget.style.borderColor = "#dc2626";
          }}
          onMouseLeave={(e) => {
            if (!isWishlisted) e.currentTarget.style.borderColor = "#e8e6df";
          }}
        >
          <Heart
            size={20}
            color={isWishlisted ? "#dc2626" : "#9ca3af"}
            fill={isWishlisted ? "#dc2626" : "none"}
          />
        </button>

        {/* Zoom Lens */}
        {isZoomed && (
          <div 
            className="pd-zoom-lens"
            style={{
              left: lensPosition.x,
              top: lensPosition.y,
            }}
          />
        )}

        {/* Main Image */}
        <img
          src={src}
          alt={alt}
          className="pd-main-image"
          onClick={toggleZoom}
          style={{
            maxHeight: 380,
            maxWidth: "100%",
            objectFit: "contain",
            transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
            transformOrigin: `${position.x}% ${position.y}%`,
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
          }}
        />

        {/* Zoom Controls */}
        <div className="pd-zoom-controls">
          <button 
            className="pd-zoom-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            title={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          </button>
          <button 
            className="pd-zoom-btn"
            onClick={(e) => {
              e.stopPropagation();
              openFullscreen();
            }}
            title="Fullscreen"
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="pd-fullscreen-modal" onClick={closeFullscreen}>
          <img
            src={src}
            alt={alt}
            className={`pd-fullscreen-image ${fullscreenZoom ? 'zoomed' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreenZoom();
            }}
            style={{
              transform: fullscreenZoom ? 'scale(2)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          />
          <button className="pd-fullscreen-close" onClick={closeFullscreen}>
            <X size={24} />
          </button>
        </div>
      )}
    </>
  );
};

/* ─── Related Product Card ──────────────────────────────────────────────────── */
const RelCard = ({ product, onClick }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    console.log("Product clicked:", product.id);
    onClick();
  };

  return (
    <div 
      className="pd-rel-card" 
      onClick={handleClick}
      style={{
        background: "#fff", 
        borderRadius: 16,
        border: "0.5px solid #e8e6df", 
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s",
        position: "relative"
      }}
    >
      <div style={{
        background: "#f5f5f0", 
        height: 160,
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        overflow: "hidden", 
        padding: 16,
        pointerEvents: "none"
      }}>
        <img
          className="pd-rel-img"
          src={imgUrl(product.image)}
          alt={product.name}
          style={{ 
            maxHeight: 130, 
            maxWidth: "100%", 
            objectFit: "contain",
            pointerEvents: "none"
          }}
        />
      </div>
      <div style={{ 
        padding: "14px 16px",
        pointerEvents: "none"
      }}>
        <p style={{
          fontSize: 13, 
          fontWeight: 600, 
          color: "#111",
          fontFamily: "'Outfit', sans-serif",
          overflow: "hidden", 
          textOverflow: "ellipsis", 
          whiteSpace: "nowrap",
          marginBottom: 6,
        }}>{product.name}</p>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <span style={{
            fontSize: 15, 
            fontWeight: 600, 
            color: "#111",
            fontFamily: "'DM Mono', monospace",
          }}>₹{fmt(product.price)}</span>
          <div style={{
            display: "flex", 
            alignItems: "center", 
            gap: 3,
            background: "#f0fdf4", 
            padding: "2px 8px", 
            borderRadius: 10,
          }}>
            <Star size={10} fill="#16a34a" color="#16a34a" />
            <span style={{ 
              fontSize: 11, 
              color: "#16a34a", 
              fontFamily: "'DM Mono', monospace" 
            }}>4.8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ────────────────────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);

  // Check if product is in wishlist when product loads
  useEffect(() => {
    if (product) {
      const inWishlist = isInWishlist(product.id);
      setIsWishlisted(inWishlist);
      console.log("Product in wishlist?", inWishlist);
    }
  }, [product, isInWishlist]);

  /* fetch product */
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`${BASE}/api/products/${id}/`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Product not found or server error");
        setLoading(false);
      });
  }, [id]);

  /* fetch related products */
  useEffect(() => {
    axios.get(`${BASE}/api/products/?limit=8`)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setRelated(list.filter((p) => String(p.id) !== String(id)).slice(0, 4));
      })
      .catch(() => {});
  }, [id]);

  /* handlers */
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login", { 
        state: { 
          from: `/product/${id}`,
          message: "Please login to add items to cart"
        } 
      });
      return;
    }
    
    setAdding(true);
    try {
      addToCart({ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image, 
        description: product.description 
      });
      
      toast.success("Added to cart! 🛒");
      
      setTimeout(() => {
        navigate("/cart");
      }, 800);
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to continue");
      localStorage.setItem("redirectAfterLogin", "/checkout");
      localStorage.setItem("buyNowProduct", JSON.stringify({ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image, 
        quantity: 1 
      }));
      navigate("/login", { 
        state: { 
          from: `/product/${id}`,
          message: "Please login to buy this product"
        } 
      });
      return;
    }
    
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.image, 
      quantity: 1 
    });
    toast.success("Redirecting to checkout...");
    navigate("/checkout");
  };

  const handleWishlist = () => {
    if (!user) { 
      toast.error("Please login to wishlist");
      navigate("/login", { 
        state: { 
          from: `/product/${id}`,
          message: "Please login to add to wishlist"
        } 
      });
      return; 
    }
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
      toast.success("Added to wishlist! ❤️");
    }
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/products");
    }
  };

  const handleViewAll = () => {
    navigate("/products");
  };

  /* ── Loading ── */
  if (loading) return (
    <>
      <FontImport />
      <div style={{ minHeight: "100vh", background: "#faf9f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #e5e7eb", borderTopColor: "#111", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 13, color: "#9ca3af", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.05em" }}>Loading product…</p>
        </div>
      </div>
    </>
  );

  /* ── Error ── */
  if (error || !product) return (
    <>
      <FontImport />
      <div style={{ minHeight: "100vh", background: "#faf9f6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Package size={52} color="#d1d5db" />
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: "#111", marginTop: 20, marginBottom: 10 }}>Product not found</h2>
        <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 28 }}>{error}</p>
        <button onClick={() => navigate("/products")} style={{ padding: "11px 28px", background: "#111", color: "#fff", border: "none", borderRadius: 30, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
          Back to Store
        </button>
      </div>
    </>
  );

  return (
    <>
      <FontImport />
      {/* Main container with flex column for footer */}
      <div style={{ 
        minHeight: "100vh", 
        background: "#faf9f6", 
        fontFamily: "'Outfit', sans-serif",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Content wrapper */}
        <div style={{ 
          flex: "1 0 auto",
          maxWidth: 1160, 
          margin: "0 auto", 
          padding: "40px 24px 80px", 
          width: "100%" 
        }}>

          {/* Back button */}
          <button
            className="pd-back-btn pd-fadein"
            onClick={handleBack}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "none", border: "none", cursor: "pointer",
              color: "#9ca3af", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase",
              marginBottom: 36, fontFamily: "'DM Mono', monospace",
              transition: "color 0.2s",
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {/* Main grid */}
          <div className="pd-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>

            {/* Left: Image with Zoom and Wishlist */}
            <div className="pd-fadein-1">
              <ImageZoom 
                src={imgUrl(product.image)} 
                alt={product.name}
                isWishlisted={isWishlisted}
                onWishlistClick={handleWishlist}
              />
            </div>

            {/* Right: Info */}
            <div style={{ display: "flex", flexDirection: "column", paddingTop: 8 }}>

              {/* Category label */}
              <p className="pd-fadein-1" style={{
                fontSize: 11, fontWeight: 600, color: "#dc2626",
                letterSpacing: "0.18em", textTransform: "uppercase",
                marginBottom: 14, fontFamily: "'DM Mono', monospace",
              }}>
                {product.category || "New Release"}
              </p>

              {/* Name */}
              <h1 className="pd-fadein-2" style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700, color: "#111",
                lineHeight: 1.15, marginBottom: 20,
              }}>
                {product.name}
              </h1>

              {/* Stars */}
              <div className="pd-fadein-2" style={{ marginBottom: 22 }}>
                <Stars />
              </div>

              {/* Description */}
              <p className="pd-fadein-3" style={{
                fontSize: 15, color: "#6b7280", lineHeight: 1.75,
                marginBottom: 28,
              }}>
                {product.description}
              </p>

              {/* Price */}
              <div className="pd-fadein-3" style={{
                background: "#f5f5f0", borderRadius: 14,
                padding: "18px 20px", marginBottom: 28,
                border: "0.5px solid #e8e6df",
              }}>
                <p style={{
                  fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "#9ca3af", fontFamily: "'DM Mono', monospace", marginBottom: 6,
                }}>
                  Price
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 38, fontWeight: 700, color: "#111",
                  }}>
                    ₹{fmt(product.price)}
                  </span>
                  <span style={{ fontSize: 13, color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>
                    incl. taxes
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="pd-fadein-4" style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                <button
                  className="pd-cart-btn"
                  onClick={handleAddToCart}
                  disabled={adding}
                  style={{
                    flex: 1, padding: "14px 20px",
                    background: "#111", color: "#fff",
                    border: "none", borderRadius: 30,
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    transition: "background 0.2s", fontFamily: "'Outfit', sans-serif",
                    opacity: adding ? 0.7 : 1,
                  }}
                >
                  {adding ? "Adding…" : "Add to Cart"}
                </button>

                <button
                  className="pd-buy-btn"
                  onClick={handleBuyNow}
                  style={{
                    flex: 1, padding: "14px 20px",
                    background: "#dc2626", color: "#fff",
                    border: "none", borderRadius: 30,
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    transition: "background 0.2s", fontFamily: "'Outfit', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  }}
                >
                  <Zap size={15} fill="#fff" /> Buy Now
                </button>
              </div>

              {/* Feature pills */}
              <div className="pd-fadein-5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <FeaturePill Icon={Truck} title="Free Delivery" sub="On all orders" />
                <FeaturePill Icon={ShieldCheck} title="1 Year Warranty" sub="Official warranty" />
                <FeaturePill Icon={Package} title="Easy Returns" sub="7-day return policy" />
                <FeaturePill Icon={Star} title="Top Rated" sub="4.8 / 5 stars" />
              </div>

            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div style={{ marginTop: 80 }}>
              {/* Section header */}
              <div style={{
                display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                borderBottom: "1.5px solid #111", paddingBottom: 14, marginBottom: 28,
              }}>
                <div>
                  <p style={{
                    fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                    color: "#9ca3af", fontFamily: "'DM Mono', monospace", marginBottom: 5,
                  }}>
                    You might also like
                  </p>
                  <h2 style={{
                    fontFamily: "'Fraunces', serif", fontSize: 26,
                    fontWeight: 700, color: "#111",
                  }}>
                    Related Products
                  </h2>
                </div>
                <button
                  onClick={handleViewAll}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "none", border: "0.5px solid #d1d5db",
                    borderRadius: 20, padding: "7px 14px",
                    fontSize: 12, fontWeight: 500, color: "#374151",
                    cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                    marginBottom: 4,
                  }}
                >
                  View all <ChevronRight size={14} />
                </button>
              </div>

              {/* Related products grid */}
              <div
                className="pd-rel-grid"
                style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}
              >
                {related.map((p) => (
                  <RelCard
                    key={p.id}
                    product={p}
                    onClick={() => {
                      console.log("Navigating to product:", p.id);
                      navigate(`/product/${p.id}`);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}