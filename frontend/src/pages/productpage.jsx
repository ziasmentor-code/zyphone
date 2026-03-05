import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartcontext";
import toast from "react-hot-toast";

import { 
  Star, ChevronDown, ChevronUp, Heart, Search,
  Smartphone, Headphones, SlidersHorizontal, ChevronRight
} from "lucide-react";

const featureData = [
  {
    id: 0,
    title: "Zyphone and Mac",
    desc: "With Zyphone Mirroring, you can view your phone screen on your Mac...",
    img: "/images/mac1.png",
  },
  {
    id: 1,
    title: "Zyphone and ZyWatch",
    desc: "Misplaced your phone? The latest ZyWatch can show you how far away it is...",
    img: "/images/mac2.png",
  },
  {
    id: 2,
    title: "Zyphone and AirPods",
    desc: "Adaptive Audio automatically tailors noise control...",
    img: "/images/ear1.png",
  }
];

export default function ProductPage() {

  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const navigate = useNavigate();

  // Fetch Products
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products/")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((err) => console.log("API Error:", err));
  }, []);

  // Filter Logic
  useEffect(() => {

    let result = products;

    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }

    setFilteredProducts(result);

  }, [searchQuery, activeCategory, products]);

  return (

    <div className="min-h-screen bg-[#f5f5f7] pt-24 font-['DM_Sans']">

      {/* SEARCH BAR */}

      <div className="max-w-[1400px] mx-auto p-4 mb-2 flex justify-center">

        <div className="relative w-full max-w-xl">

          <input
            type="text"
            placeholder="Search Zyphone devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 p-4 pl-12 rounded-full text-sm shadow-sm"
          />

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

        </div>

      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-4 p-4 mb-20">

        {/* FILTERS */}

        <div className="w-full md:w-[280px] bg-white shadow-sm rounded-3xl h-fit border border-gray-100 hidden md:block">

          <div className="p-6 border-b border-gray-100 flex items-center gap-2">

            <SlidersHorizontal size={18} />
            <h2 className="font-bold">Filters</h2>

          </div>

          <div className="p-6 space-y-4">

            <div onClick={() => setActiveCategory("All")} className="cursor-pointer flex gap-2 items-center">

              <Smartphone size={18} />
              <span>All Devices</span>

            </div>

            <div onClick={() => setActiveCategory("Smartphone")} className="cursor-pointer flex gap-2 items-center">

              <Smartphone size={18} />
              <span>Smartphones</span>

            </div>

            <div onClick={() => setActiveCategory("Audio")} className="cursor-pointer flex gap-2 items-center">

              <Headphones size={18} />
              <span>Audio</span>

            </div>

          </div>

        </div>

        {/* PRODUCT LIST */}

        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {filteredProducts.length > 0 ? (

            filteredProducts.map((p) => (

              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="flex flex-col md:flex-row p-8 border-b border-gray-100 hover:bg-gray-50 gap-8 cursor-pointer group m-2 rounded-2xl"
              >

                {/* IMAGE */}

                <div className="w-full md:w-[200px] h-[200px] flex justify-center items-center relative rounded-3xl p-4 bg-gray-50">

                  <Heart
                    className="absolute top-2 right-2 text-gray-400 hover:text-rose-600"
                    size={18}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Added to Wishlist");
                    }}
                  />

                  <img
                    src={`http://127.0.0.1:8000${p.image}`}
                    alt={p.name}
                    className="max-h-full object-contain"
                  />

                </div>

                {/* INFO */}

                <div className="flex-1">

                  <h2 className="text-xl font-bold mb-3 text-black">{p.name}</h2>

                  <div className="flex items-center gap-2 mb-4">

                    <span className="bg-green-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      4.7 <Star size={10} fill="white" />
                    </span>

                    <span className="text-gray-500 text-xs">910 Ratings</span>

                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>

                </div>

                {/* PRICE + BUTTON */}

                <div className="w-full md:w-[240px] flex flex-col justify-center items-start md:items-end gap-3">

                  <span className="text-3xl font-black text-black">

                    ₹{Number(p.price).toLocaleString("en-IN")}

                  </span>

                  <div className="flex gap-3">

<button
  onClick={(e) => {
    e.stopPropagation();
    addToCart(p);
    toast.success("Item added to cart 🛒");
  }}
  className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-800"
>
  Add to Cart
</button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${p.id}`);
                      }}
                      className="bg-rose-600 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-rose-700"
                    >
                      View Details
                    </button>

                  </div>

                </div>

              </div>

            ))

          ) : (

            <div className="p-16 text-center text-gray-400 italic">

              No devices found...

            </div>

          )}

        </div>

      </div>

    </div>

  );

}