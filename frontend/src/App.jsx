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
import MyOrders from "./pages/myorders"; 
import OrderDetails from "./pages/orderdetails";
import Register from "./pages/Register";
import Signup from "./pages/signup";

// Context Providers
import { CartProvider } from "./context/cartcontext";
import { WishlistProvider } from "./context/wishlistcontext";
import AddProduct from "./pages/addproduct";

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#0a0a0b]">
          <Navbar />
          
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
            
            {/* ✅ Product Routes - Both work */}
            <Route path="/products" element={<ProductPage />} />
            <Route path="/all-products" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* User Related Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order/:orderId" element={<OrderDetails />} />
            <Route path="/add-product" element={<AddProduct />} />

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;