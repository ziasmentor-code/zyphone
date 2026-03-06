import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import ProductPage from "./pages/productpage";
import Cart from "./pages/cart";
import ProductDetail from "./pages/productdetail";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Wishlist from "./pages/wishlist"; 
import Checkout from "./pages/checkout";
import OrderSuccess from "./pages/ordersuccess";
import Login from "./pages/login";
import Profile from "./pages/profile";

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <Navbar />
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-products" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        
        {/* Ippo direct aayi kodukkunnu, Profile page-il login check cheythaal mathi */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;