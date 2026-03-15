import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { 
  Star, ChevronDown, ChevronUp, Search, ArrowRight, 
  Smartphone, Headphones, SlidersHorizontal, ChevronRight, Heart 
} from "lucide-react";
import toast from "react-hot-toast";
import { CartContext } from "../context/cartcontext";
import { WishlistContext } from "../context/wishlistcontext";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const featureData = [
  { id: 0, title: "Zyphone and Mac", desc: "With Zyphone Mirroring, you can view your phone screen on your Mac...", img: "/images/mac1.png" },
  { id: 1, title: "Zyphone and ZyWatch", desc: "Misplaced your phone? The latest ZyWatch can show you how far away it is...", img: "/images/mac2.png" },
  { id: 2, title: "Zyphone and AirPods", desc: "Adaptive Audio automatically tailors noise control...", img: "/images/ear1.png" }
];

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchParams] = useSearchParams();
const categoryFilter = searchParams.get("category");

  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, wishlistItems } = useContext(WishlistContext);

  // ✅ Fixed login check function
  const checkLoginBeforeAction = (action, product) => {
    const token = localStorage.getItem("access");
    
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login?redirect=products");
      return false;
    }
    
    action(product);
    return true;
  };

  // Fetch products
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products/")
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(err => console.log("API Error:", err));
  }, []);
  

  // Search and filter logic
// Search and filter logic update cheythathu
// Search and filter logic - FIXED VERSION
useEffect(() => {
  let result = products;
  
  // URL-il ninnu "Headset" allenkil "Watch" kittunnu
  const urlCategory = searchParams.get("category")?.toLowerCase();

  // 1. Search Bar filtering
  if (searchQuery) {
    result = result.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  // 2. Category Click filtering (Fleet section-il ninnu varumpol)
  if (urlCategory) {
    result = result.filter(p => {
      const prodName = p.name?.toLowerCase() || "";
      
      if (urlCategory === "headset") {
        // Name-il earbuds, headphones, allenkil buds ennu kandaal select cheyyum
        return prodName.includes("earbuds") || 
               prodName.includes("headphones") || 
               prodName.includes("buds") ||
               prodName.includes("airdoze");
      }
      
      if (urlCategory === "watch") {
        return prodName.includes("watch");
      }

      if (urlCategory === "phone") {
        return prodName.includes("iphone") || prodName.includes("samsung") || prodName.includes("galaxy");
      }

      return true;
    });
  }

  setFilteredProducts(result);
}, [searchQuery, products, searchParams]); // activeCategory ippo avashyamilla, URL filter mathi
  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-24 font-['DM_Sans']">
      
      {/* SEARCH BAR */}
      <div className="max-w-[1400px] mx-auto p-4 mb-2 flex justify-center">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search Zyphone devices..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 p-4 pl-12 rounded-full text-sm shadow-sm focus:ring-1 focus:ring-rose-300 transition-all outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-4 p-4 mb-20">
        
        {/* FILTERS */}
        <div className="w-full md:w-[280px] bg-white shadow-sm rounded-3xl h-fit sticky top-28 border border-gray-100 hidden md:block overflow-hidden transition-all duration-300">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="bg-black p-1.5 rounded-lg">
                <SlidersHorizontal size={16} className="text-white" />
              </div>
              <h2 className="font-bold text-lg text-black">Filters</h2>
            </div>
          </div>

          <div className="p-6 border-b border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">Categories</p>
            <div className="space-y-3">
              {/* All */}
              <div
                onClick={() => setActiveCategory("All")}
                className={`flex items-center justify-between group cursor-pointer p-3 rounded-2xl transition-all ${activeCategory === "All" ? 'bg-rose-50 text-rose-600 border border-rose-100/50' : 'hover:bg-gray-50 text-gray-500 hover:text-black'}`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className="stroke-[2.5px]" />
                  <span className="text-sm font-bold">All Devices</span>
                </div>
                <ChevronRight size={14} />
              </div>

              {/* Smartphones */}
              <div
                onClick={() => setActiveCategory("Smartphone")}
                className={`flex items-center justify-between group cursor-pointer p-3 rounded-2xl transition-all ${activeCategory === "Smartphone" ? 'bg-rose-50 text-rose-600 border border-rose-100/50' : 'hover:bg-gray-50 text-gray-500 hover:text-black'}`}
              >
                <div className="flex items-center gap-3 pl-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${activeCategory === "Smartphone" ? 'bg-rose-600' : 'bg-gray-300 group-hover:bg-black'}`}></div>
                  <span className="text-sm font-medium">Smartphones</span>
                </div>
              </div>

              {/* Audio */}
              <div
                onClick={() => setActiveCategory("Audio")}
                className={`flex items-center justify-between group cursor-pointer p-3 rounded-2xl transition-all ${activeCategory === "Audio" ? 'bg-rose-50 text-rose-600 border border-rose-100/50' : 'hover:bg-gray-50 text-gray-500 hover:text-black'}`}
              >
                <div className="flex items-center gap-3">
                  <Headphones size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Audio</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50/50">
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-600 transition-colors border-2 border-dashed border-gray-200 rounded-2xl hover:border-rose-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* PRODUCT LIST */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredProducts.length > 0 ? filteredProducts.map(p => (
            <div key={p.id} className="flex flex-col md:flex-row p-8 border-b border-gray-100 hover:bg-gray-50 gap-8 cursor-pointer group m-2 rounded-2xl">
              <div className="w-full md:w-[200px] h-[200px] flex justify-center items-center relative rounded-3xl p-4 bg-gray-50">
                {/* ✅ Fixed Heart click handler */}
                <Heart
                  onClick={(e) => {
                    e.stopPropagation();
                    checkLoginBeforeAction(() => {
                      addToWishlist(p);
                      toast.success("Added to wishlist ❤️");
                    }, p);
                  }}
                  className={`absolute top-2 right-2 cursor-pointer transition-colors ${
                    wishlistItems.some(item => item.id === p.id)
                      ? "text-rose-600 fill-rose-600"
                      : "text-gray-400 hover:text-rose-600"
                  }`}
                  size={18}
                />
                <img 
                  src={`http://127.0.0.1:8000${p.image}`} 
                  alt={p.name} 
                  className="max-h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200/1a1a1a/666?text=No+Image";
                  }}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3 text-black">{p.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    4.7 <Star size={10} fill="white" />
                  </span>
                  <span className="text-gray-500 text-xs">910 Ratings</span>
                </div>
                {/* ✅ Description is now properly displayed */}
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{p.description}</p>
              </div>

              <div className="w-full md:w-[220px] flex flex-col justify-center items-start md:items-end gap-3">
                <span className="text-3xl font-black text-black">
                  ₹{Number(p.price).toLocaleString("en-IN")}
                </span>
                <div className="flex gap-3">
                  {/* ✅ Fixed Add to Cart button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      checkLoginBeforeAction(() => {
                        // ✅ Make sure all product data is passed to cart
                        addToCart({
                          id: p.id,
                          name: p.name,
                          price: p.price,
                          image: p.image,
                          description: p.description,  // ✅ Important: Include description
                          category: p.category
                        });
                        toast.success("Item added to cart 🛒");
                      }, p);
                    }}
                    className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="bg-rose-600 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-rose-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-16 text-center text-gray-400 italic">No devices found...</div>
          )}
        </div>
      </div>

      {/* EXPLORE LINE-UP SECTION */}
      <section className="max-w-[1400px] mx-auto py-24 px-6 bg-[#f5f5f7]">
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-black tracking-tight mb-4">Explore the line-up.</h2>
          <p className="text-xl text-gray-500 font-medium">Find the Zyphone that's right for you.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Zyphone 17 Pro", desc: "The ultimate Zyphone.", price: "From ₹1,34,900", img: "/images/pro.png", color: "bg-[#f2f2f2]" },
            { name: "Zyphone Air", desc: "Surprisingly thin.", price: "From ₹1,19,900", img: "/images/air.png", color: "bg-[#eef4f9]" },
            { name: "Zyphone 17", desc: "A total standout.", price: "From ₹82,900", img: "/images/17.png", color: "bg-[#f9f2ff]" },
            { name: "Zyphone 17e", desc: "All kinds of awesome.", price: "From ₹64,900", img: "/images/17e.png", color: "bg-[#fff2f6]" }
          ].map((item, i) => (
            <div key={i} className="group bg-white rounded-[2.5rem] overflow-hidden flex flex-col h-full shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
              <div className={`relative w-full h-80 overflow-hidden ${item.color}`}>
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => {e.target.src="https://via.placeholder.com/400x500"}}
                />
              </div>
              <div className="p-10 flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{item.desc}</p>
                <p className="text-lg font-bold text-gray-900 mb-8">{item.price}</p>
                <button className="bg-[#0071e3] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-[#0077ed] transition-all">Learn more</button>
                <button className="mt-4 text-[#0071e3] text-sm font-bold flex items-center group/btn">
                  Buy <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="bg-white py-32 px-6 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-black">Get to know Zyphone.</h2>
          <div className="flex overflow-x-auto gap-8 pb-12 no-scrollbar">
            {[
              { title: "Innovation", sub: "Beautiful and durable, by design.", color: "text-white", img: "/images/feat1.png" },
              { title: "Cameras", sub: "Picture your best photos and videos.", color: "text-white", img: "/images/feat2.png" },
              { title: "Performance", sub: "Fast that lasts with A19 Chip.", color: "text-black", img: "/images/feat3.png" },
              { title: "Intelligence", sub: "New look. Even more magic.", color: "text-white", img: "/images/feat4.png" }
            ].map((card, i) => (
              <div 
                key={i} 
                className={`min-w-[400px] h-[550px] rounded-[3rem] p-12 flex flex-col justify-between shadow-lg relative overflow-hidden ${card.color} bg-gray-100`}
              >
                <img 
                  src={card.img} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover z-0" 
                />
                <div className="absolute inset-0 bg-black/10 z-[1]" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black mb-4 uppercase tracking-[0.2em] opacity-80">{card.title}</p>
                  <h3 className="text-4xl font-bold leading-[1.1] tracking-tight">{card.sub}</h3>
                </div>
                <div className="relative z-10">
                  {/* Optional button can go here */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE AND LINE-UP SECTIONS */}
      <section className="bg-white py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-black tracking-tight">Get to know Zyphone.</h2>
          <div className="flex flex-col md:flex-row items-stretch bg-[#f5f5f7] rounded-[3rem] overflow-hidden min-h-[600px]">
            <div className="w-full md:w-1/2 p-8 md:p-20 flex flex-col justify-center">
              <div className="space-y-4">
                {featureData.map((item, index) => (
                  <div key={item.id} className="border-b border-gray-200 last:border-0">
                    <button onClick={() => setActiveIndex(index)} className="w-full flex justify-between items-center text-left py-8 focus:outline-none group">
                      <h3 className={`text-2xl md:text-4xl font-bold transition-all duration-500 ${activeIndex === index ? 'text-black' : 'text-gray-300 group-hover:text-gray-400'}`}>{item.title}</h3>
                      {activeIndex === index ? <ChevronUp size={28} /> : <ChevronDown size={28} className="text-gray-300" />}
                    </button>
                    {activeIndex === index && (
                      <p className="text-gray-600 text-lg leading-relaxed pb-8 animate-in fade-in slide-in-from-top-2 duration-500">{item.desc}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 relative bg-gray-200">
              <img key={activeIndex} src={featureData[activeIndex].img} alt="Feature" className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-105 duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* WHY ZYPHONE SECTION */}
      <section className="max-w-[1400px] mx-auto py-32 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-black">Why Zyphone is the best place to buy.</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: "Zyphone Trade In", desc: "Save on a new Zyphone.", img: "/images/multi.png" },
            { title: "Ways to Buy", desc: "Monthly payment options.", img: "/images/credit.png" },
            { title: "Personal Setup", desc: "Make the most of your device.", img: "/images/setup.png" },
            { title: "Delivery & Pickup", desc: "Get free delivery.", img: "/images/delivery.png" }
          ].map((info, i) => (
            <div key={i} className="relative bg-white rounded-[2.5rem] h-[500px] shadow-sm hover:shadow-xl transition-all border border-gray-50 group overflow-hidden">
              <img src={info.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/10"></div>
              <div className="relative z-10 p-12">
                <p className="text-[10px] font-black mb-5 uppercase tracking-widest text-gray-500">{info.title}</p>
                <h3 className="text-2xl font-bold text-black">{info.desc}</h3>
              </div>
              <button className="absolute bottom-8 right-8 bg-black/80 text-white w-10 h-10 rounded-full font-bold text-xl hover:bg-black transition-colors">+</button>
            </div>
          ))}
        </div>
      </section>
      
      <div className="text-center pb-20 mt-10">
        <p className="text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase cursor-pointer hover:text-rose-600 transition-colors inline-block border-b border-transparent hover:border-rose-600 pb-2">
          ← Back to Experience
        </p>
      </div>
    </div>
  );
}