import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/authcontext";

import toast from "react-hot-toast";

import { Star, ArrowLeft, Heart, ShieldCheck, Truck } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // FETCH PRODUCT
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

  // ADD TO CART
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

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/add/",
        {
          product_id: product.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description
      });

      toast.success("Item added to cart 🛒");
    } catch (error) {
      console.error(error);
      toast.error("Cart error");
    }
  };

  // ✅ FIXED: BUY NOW - Always go to checkout
  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to continue");
      
      // Save product for after login
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

    const loadingToast = toast.loading("Processing your request...");

    setTimeout(() => {
      // Add to cart
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });

      toast.success(`${product.name} added! Redirecting to checkout...`, {
        id: loadingToast
      });

      // ✅ Always go to checkout, not profile
      navigate("/checkout");

    }, 800);
  };

  // Add to wishlist
  const handleWishlist = () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      navigate("/login", { 
        state: { 
          from: `/product/${id}`,
          message: "Please login to add to wishlist"
        } 
      });
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-500 mb-8">{error || "Product not found"}</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
        >
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-10 transition group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          <span className="text-sm font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* IMAGE */}
          <div className="bg-[#f5f5f7] rounded-[3rem] p-12 flex items-center justify-center min-h-[500px] relative group">
            <img
              src={`http://127.0.0.1:8000${product.image}`}
              alt={product.name}
              className="max-h-[400px] object-contain group-hover:scale-105 transition duration-500"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            <span className="text-rose-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">
              New Release
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-green-700 text-white px-3 py-1 rounded-full gap-1 text-sm font-bold">
                4.8 <Star size={14} fill="white" />
              </div>
              <span className="text-gray-400 font-medium text-sm">| 1.2k Reviews</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="mb-10">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Price</p>
              <span className="text-4xl font-black text-black">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleAddToCart}
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

              <button 
                onClick={handleWishlist}
                className={`w-16 h-16 border-2 border-gray-100 rounded-2xl flex items-center justify-center hover:border-rose-200 transition ${
                  isWishlisted ? 'text-rose-600 border-rose-200' : 'text-gray-600'
                }`}
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-black">Free Delivery</p>
                  <p className="text-[10px] text-gray-400">On all orders</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                  <ShieldCheck size={20} />
                </div>
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