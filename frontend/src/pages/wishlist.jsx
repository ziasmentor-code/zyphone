import React, { useContext, useState } from "react";
import { CartContext } from "../context/cartcontext";
import { WishlistContext } from "../context/wishlistcontext";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromWishlist(id);
      setRemovingId(null);
    }, 400); // Animation kazhinju remove aakan
  };

  const handleMoveToCart = (item) => {
    addToCart(item);
    handleRemove(item.id); // Cart-ilekk poyal pinne wishlist-il ninnu kalayam
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideOutLeft {
          to { opacity: 0; transform: translateX(-50px); max-height: 0; margin: 0; padding: 0; }
        }

        .wishlist-item {
          animation: fadeInUp 0.5s ease both;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          padding: 15px 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
        }

        .wishlist-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 80, 120, 0.3);
          transform: scale(1.01);
        }

        .removing {
          animation: slideOutLeft 0.4s ease forwards !important;
        }

        .add-cart-btn {
          background: #fff;
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-cart-btn:hover {
          background: #5ccb5f;
          color: #fff;
          transform: translateY(-2px);
        }

        @media (max-width: 600px) {
          .wishlist-item { flex-direction: column; text-align: center; }
          .actions { width: 100%; justify-content: center; }
        }
      `}</style>

      <div style={styles.inner}>
        <header style={styles.header}>
          <p style={styles.eyebrow}>FAVOURITES</p>
          <h1 style={styles.title}>Your Wishlist</h1>
          <p style={styles.subtitle}>Items you've been eyeing lately</p>
        </header>

        {wishlistItems.length === 0 ? (
          <div style={styles.emptyWrap}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>✨</div>
            <h2 style={styles.emptyTitle}>Wishlist is empty</h2>
            <p style={styles.emptyText}>Start adding items you love!</p>
            <button style={styles.shopBtn} onClick={() => navigate("/all-products")}>
              Go to Store
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {wishlistItems.map((item, index) => (
              <div
                key={item.id}
                className={`wishlist-item ${removingId === item.id ? "removing" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={`http://127.0.0.1:8000${item.image}`}
                  alt={item.name}
                  style={styles.img}
                />

                <div style={{ flex: 1 }}>
                  <h2 style={styles.itemName}>{item.name}</h2>
                  <p style={styles.itemPrice}>₹{Number(item.price).toLocaleString("en-IN")}</p>
                </div>

                <div style={styles.actions} className="actions">
                  <button 
                    className="add-cart-btn"
                    onClick={() => handleMoveToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={styles.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlistItems.length > 0 && (
          <button 
            style={styles.backLink}
            onClick={() => navigate("/all-products")}
          >
            ← Continue Shopping
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e10",
    color: "#fff",
    padding: "60px 20px",
    fontFamily: "'DM Sans', sans-serif",
  },
  inner: { maxWidth: "900px", margin: "0 auto" },
  header: { marginBottom: "50px", textAlign: "center" },
  eyebrow: { color: "#ff5078", fontSize: "12px", letterSpacing: "3px", fontWeight: "bold" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "48px", margin: "10px 0" },
  subtitle: { color: "rgba(255,255,255,0.4)", fontSize: "15px" },
  list: { display: "flex", flexDirection: "column", gap: "15px" },
  img: { width: "80px", height: "80px", objectFit: "contain", borderRadius: "12px", background: "#1a1a1c" },
  itemName: { fontSize: "18px", fontWeight: "500", marginBottom: "5px" },
  itemPrice: { color: "rgba(255,255,255,0.5)", fontSize: "16px" },
  actions: { display: "flex", alignItems: "center", gap: "15px" },
  removeBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.3)",
    cursor: "pointer",
    fontSize: "13px",
    textDecoration: "underline",
  },
  backLink: {
    marginTop: "40px",
    background: "none",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.6)",
    padding: "10px 25px",
    borderRadius: "50px",
    cursor: "pointer",
    display: "block",
    margin: "40px auto 0",
    transition: "all 0.3s ease"
  },
  emptyWrap: { textAlign: "center", padding: "80px 0" },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: "30px", marginBottom: "10px" },
  emptyText: { color: "rgba(255,255,255,0.4)", marginBottom: "30px" },
  shopBtn: {
    background: "linear-gradient(135deg, #ff5078, #ff80a0)",
    border: "none",
    padding: "12px 35px",
    borderRadius: "50px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  }
};