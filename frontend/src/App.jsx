import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import ProductPage from "./pages/productpage";
import Cart from "./pages/cart";
import ProductDetail from "./pages/productdetail";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <div className="min-h-screen bg-[#f5f5f7]">

      <Navbar />
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-products" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>

    </div>
  );

}

export default App;