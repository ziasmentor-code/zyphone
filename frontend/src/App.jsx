import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import ProductPage from "./pages/productpage";
import Cart from "./pages/cart";
import ProductDetail from "./pages/productdetail";
import Navbar from "./components/navbar";
import { Toaster } from "react-hot-toast";
import Wishlist from "./pages/wishlist"; 
import Checkout from "./pages/checkout";
import OrderSuccess from "./pages/ordersuccess";
import Login from "./pages/login";
import Profile from "./pages/profile";
import MyOrders from "./pages/myorders"; // MyOrders import ചെയ്തു എന്ന് ഉറപ്പുവരുത്തുക

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* എല്ലാ പേജിലും കാണേണ്ട മുകൾഭാഗം */}
      <Navbar />
      
      {/* നോട്ടിഫിക്കേഷൻ കാണിക്കാൻ */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#161618',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/all-products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        
        {/* User Related Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* തെറ്റായ URL അടിച്ചാൽ ഹോം പേജിലേക്ക് വിടാൻ */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;