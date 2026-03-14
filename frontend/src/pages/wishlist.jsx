import React, { useContext, useState } from "react";
import { CartContext } from "../context/cartcontext";
import { WishlistContext } from "../context/wishlistcontext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = (id, silent = false) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromWishlist(id);
      setRemovingId(null);
      if (!silent) toast.success("Removed from Wishlist");
    }, 400); 
  };

  const handleMoveToCart = (item) => {
    addToCart(item);
    handleRemove(item.id, true); // വിഷ്‌ലിസ്റ്റിൽ നിന്ന് മെസ്സേജ് ഇല്ലാതെ നീക്കം ചെയ്യുന്നു
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideOutLeft { to { opacity: 0; transform: translateX(-50px); max-height: 0; margin: 0; padding: 0; } }
        .wishlist-item { animation: fadeInUp 0.5s ease both; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 20px; padding: 15px 25px; display: flex; align-items: center; gap: 20px; transition: all 0.3s ease; }
        .removing { animation: slideOutLeft 0.4s ease forwards !important; }
        .add-cart-btn { background: #fff; color: #000; border: none; padding: 10px 20px; border-radius: 50px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
        .add-cart-btn:hover { background: #5ccb5f; color: #fff; transform: translateY(-2px); }
      `}</style>

      <div style={styles.inner}>
        <header style={styles.header}>
          <h1 style={{ fontSize: '40px', fontFamily: 'serif' }}>Your Wishlist</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>{wishlistItems.length} items saved</p>
        </header>

        {wishlistItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: "50px" }}>✨</div>
            <h2>Wishlist is empty</h2>
            <button style={styles.shopBtn} onClick={() => navigate("/all-products")}>Go to Store</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {wishlistItems.map((item) => (
              <div key={item.id} className={`wishlist-item ${removingId === item.id ? "removing" : ""}`}>
                <img
                  src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`}
                  alt={item.name}
                  style={{ width: "70px", height: "70px", objectFit: "contain", borderRadius: "10px", background: "#1a1a1c" }}
                />
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '18px', margin: 0 }}>{item.name}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>₹{Number(item.price).toLocaleString("en-IN")}</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <button className="add-cart-btn" onClick={() => handleMoveToCart(item)}>Add to Cart</button>
                  <button onClick={() => handleRemove(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', textDecoration: 'underline' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0e0e10", color: "#fff", padding: "60px 20px", fontFamily: "sans-serif" },
  inner: { maxWidth: "800px", margin: "0 auto" },
  header: { marginBottom: "40px", textAlign: "center" },
  shopBtn: { background: "#ff5078", color: "#fff", border: "none", padding: "12px 30px", borderRadius: "50px", marginTop: "20px", cursor: "pointer" }
};