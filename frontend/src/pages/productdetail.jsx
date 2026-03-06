import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/authcontext"; // AuthContext import cheythu
import toast from "react-hot-toast";

import { Star, ArrowLeft, Heart, ShieldCheck, Truck } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // useContext component-nu ullil vilikkanam

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Detail API Error:", err);
        setError("Product not found or Server error");
        setLoading(false);
      });
  }, [id]);

  // --- BUY NOW LOGIC ---
const handleBuyNow = () => {
  // 1. User login aano ennu aadyam check cheyyunnu
  if (!user) {
    toast.error("Please login to continue");
    navigate("/login");
    return;
  }

  // 2. Product-ine cart-ilekk add cheyyunnu
  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image
  });

  // 3. Nere Profile page-ilekk redirect cheyyunnu
  // Ippo address undo ennu check cheyyilla, direct Profile-ilekk pookum
  toast("Redirecting to profile to confirm details", { icon: '👤' });
  navigate("/profile"); 
};

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button onClick={() => navigate("/all-products")} className="bg-black text-white px-8 py-3 rounded-full font-bold">
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black mb-10 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* IMAGE */}
          <div className="bg-[#f5f5f7] rounded-[3rem] p-12 flex items-center justify-center min-h-[500px]">
            <img 
              src={`http://127.0.0.1:8000${product.image}`} 
              alt={product.name} 
              className="max-h-[400px] object-contain hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            <span className="text-rose-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">New Release</span>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-green-700 text-white px-3 py-1 rounded-full gap-1 text-sm font-bold">
                4.8 <Star size={14} fill="white" />
              </div>
              <span className="text-gray-400 font-medium text-sm">| 1.2k Reviews</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-10">{product.description}</p>

            <div className="mb-10">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Price</p>
              <span className="text-4xl font-black text-black">₹{Number(product.price).toLocaleString("en-IN")}</span>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => {
                  addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
                  toast.success("Item added to cart 🛒");
                }}
                className="flex-1 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-rose-600 text-white px-8 py-4 rounded-full font-bold hover:bg-rose-700 transition"
              >
                Buy Now
              </button>

              <button className="w-16 h-16 border-2 border-gray-100 rounded-2xl flex items-center justify-center hover:border-rose-200 hover:text-rose-600 transition-all">
                <Heart size={24} />
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600"><Truck size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-black">Free Delivery</p>
                  <p className="text-[10px] text-gray-400">On all orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600"><ShieldCheck size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-black">1 Year Warranty</p>
                  <p className="text-[10px] text-gray-400">Official Brand Warranty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}