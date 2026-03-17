import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import ProductPage from "./pages/productpage";
import Cart from "./pages/cart";
import ProductDetail from "./pages/productdetail";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
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
import { isAuthenticated } from './services/auth';

// Context Providers
import { CartProvider } from "./context/cartcontext";
import { WishlistProvider } from "./context/wishlistcontext";
import AddProduct from "./pages/addproduct";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Admin Route Component (if needed)
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return isAuthenticated() && user.is_staff ? children : <Navigate to="/" />;
};

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#0a0a0b] flex flex-col">
          
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

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/all-products" element={<ProductPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes (Require Login) */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              
              <Route path="/my-orders" element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } />
              
              <Route path="/order/:orderId" element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              } />
              
              <Route path="/order-success" element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } />
              
              {/* Admin Only Route */}
              <Route path="/add-product" element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              } />

              {/* Default Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer /> 
          
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;