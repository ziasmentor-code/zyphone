import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/cartcontext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  // Context safe aayi access cheyyunnu
  const cartContext = useContext(CartContext);
  
  // Oru fallback empty array kodukkunnu (Ithaanu main fix)
  const cartItems = cartContext?.cartItems || [];
  const removeFromCart = cartContext?.removeFromCart;

  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({});
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const qtys = {};
    // cartItems undefined aavilla ippo
    cartItems.forEach(item => {
      qtys[item.id] = quantities[item.id] || 1;
    });
    setQuantities(qtys);
  }, [cartItems]);

  const updateQty = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      if (removeFromCart) removeFromCart(id);
      setRemovingId(null);
    }, 400); 
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (quantities[item.id] || 1),
    0
  );

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;700&display=swap');
        .cart-item { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 20px; display: flex; align-items: center; gap: 20px; transition: all 0.3s; animation: fadeInUp 0.5s ease both; }
        .cart-item:hover { transform: translateY(-4px); border-color: rgba(92, 203, 95, 0.4); }
        .removing { animation: slideOut 0.4s ease forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideOut { to { opacity: 0; transform: translateX(50px); max-height: 0; padding: 0; margin: 0; } }
        .checkout-btn { background: linear-gradient(135deg, #a8edaa, #5ccb5f); color: #051a06; border: none; padding: 18px; border-radius: 60px; font-weight: 700; cursor: pointer; width: 100%; margin-top: 20px; transition: 0.3s; }
      `}</style>

      <div style={styles.container}>
        <header style={styles.header}>
          <p style={styles.eyebrow}>YOUR SELECTION</p>
          <h1 style={styles.title}>Shopping Bag</h1>
          {/* length access cheyyumpol optional chaining use cheyyanam */}
          <p style={styles.itemCount}>{cartItems?.length || 0} items</p>
        </header>

        {cartItems.length === 0 ? (
          <div style={styles.empty}>
            <div style={{fontSize: '60px'}}>🛍️</div>
            <h2 style={styles.emptyTitle}>Your bag is empty</h2>
            <button style={styles.shopBtn} onClick={() => navigate("/all-products")}>Shop Now</button>
          </div>
        ) : (
          <div style={styles.layout}>
            <div style={styles.list}>
              {cartItems.map((item) => (
                <div key={item.id} className={`cart-item ${removingId === item.id ? 'removing' : ''}`}>
                  <img src={`http://127.0.0.1:8000${item.image}`} alt={item.name} style={styles.img} />
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemPrice}>₹{Number(item.price).toLocaleString("en-IN")}</p>
                    <div style={styles.qtyContainer}>
                      <div style={styles.qtyBox}>
                        <button onClick={() => updateQty(item.id, -1)} style={styles.qtyBtn}>−</button>
                        <span>{quantities[item.id] || 1}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={styles.qtyBtn}>+</button>
                      </div>
                      <button onClick={() => handleRemove(item.id)} style={styles.removeText}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.summary}>
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Summary</h3>
                <div style={styles.row}><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div style={styles.divider}></div>
                <div style={styles.totalRow}><span>Total</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                <button className="checkout-btn" onClick={() => navigate("/checkout")}>Checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0a0a0b", color: "#fff", padding: "60px 20px", fontFamily: "'DM Sans', sans-serif" },
  container: { maxWidth: "1100px", margin: "0 auto" },
  header: { marginBottom: "40px" },
  eyebrow: { color: "#5ccb5f", fontSize: "11px", fontWeight: "700" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "40px", marginTop: "10px" },
  itemCount: { color: "rgba(255,255,255,0.4)", fontSize: "14px" },
  layout: { display: "flex", gap: "30px", flexWrap: "wrap" },
  list: { flex: "1.8", display: "flex", flexDirection: "column", gap: "15px" },
  summary: { flex: "1", minWidth: "300px" },
  img: { width: "90px", height: "90px", objectFit: "cover", borderRadius: "15px" },
  itemName: { fontSize: "18px", fontWeight: "600" },
  itemPrice: { color: "rgba(255,255,255,0.5)", margin: "5px 0" },
  qtyContainer: { display: "flex", alignItems: "center", gap: "20px", marginTop: "10px" },
  qtyBox: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: "50px", padding: "5px 15px", gap: "15px" },
  qtyBtn: { background: "none", border: "none", color: "#fff", cursor: "pointer" },
  removeText: { background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: "12px" },
  summaryCard: { background: "rgba(255,255,255,0.02)", padding: "30px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.06)" },
  summaryTitle: { fontSize: "20px", marginBottom: "20px" },
  row: { display: "flex", justifyContent: "space-between", marginBottom: "10px", opacity: 0.6 },
  divider: { height: "1px", background: "rgba(255,255,255,0.1)", margin: "15px 0" },
  totalRow: { display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "700" },
  empty: { textAlign: "center", padding: "100px 0" },
  shopBtn: { background: "#fff", color: "#000", border: "none", padding: "10px 30px", borderRadius: "50px", fontWeight: "700", cursor: "pointer", marginTop: "20px" }
};