import React, { useState, useEffect } from "react";
import { Smartphone, Laptop, Watch, Headphones, ArrowRight, ChevronDown, ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Image Imports
import image3     from "../assets/images/image3.jpg";
import image7     from "../assets/images/image7.jpg";
import image8     from "../assets/images/image8.jpg";
import image9     from "../assets/images/image9.jpg";
import image16    from "../assets/images/image16.jpg"; 
import image17    from "../assets/image17.jpg"; 
import image18    from "../assets/images/image18.jpg"; 
import image19    from "../assets/images/image19.jpg"; 
import image20    from "../assets/images/image20.jpg"; 
import image21    from "../assets/images/image21.jpg";
import img20      from "../assets/images/img20.jpg";
import img18 from '../assets/img18.jpg'; 

// Media Imports
import heroVideo  from "../assets/images/herovideo.mp4";
import bottomVideo from "../assets/images/herovideo1.mp4";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap');
  
  .font-display { font-family: 'Bebas Neue', sans-serif; }
  .hero-title-size { font-size: clamp(60px, 12vw, 160px); line-height: 0.85; }
  .stat-num-size { font-size: clamp(32px, 4vw, 50px); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes ticker {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .anim-1 { opacity: 0; animation: fadeUp 0.8s 0.2s forwards; }
  .anim-2 { opacity: 0; animation: fadeUp 0.8s 0.4s forwards; }
  .anim-3 { opacity: 0; animation: fadeUp 0.8s 0.6s forwards; }

  .ticker-track { display: flex; width: max-content; animation: ticker 25s linear infinite; }
  
  .ticker-gradient {
    background: linear-gradient(90deg, #9F1239, #E11D48, #FB7185, #E11D48, #9F1239);
    background-size: 200% 100%;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #1A0A0E; }
  ::-webkit-scrollbar-thumb { background: #BE123C; border-radius: 10px; }
`;

const stats = [
  { num: "2M+",   label: "Devices Sold" },
  { num: "150+", label: "Service Centers" },
  { num: "4.9★", label: "User Rating" },
  { num: "24/7", label: "Priority Support" },
];

const tickerItems = ["LIMITED TIME OFFERS", "NO-COST EMI AVAILABLE", "FREE EXPRESS DELIVERY", "CERTIFIED REFURBISHED"];

export default function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % 2), 6000);
    return () => clearInterval(interval);
  }, []);

  // Button clicks handle cheyyaan ulla common function
  const handleBuyNow = (productId) => {
    // Product details page-ilekk povaan (id undenkil)
    if (productId) {
      navigate(`/product/${productId}`);
    } else {
      navigate("/all-products");
    }
  };
const handleFleetNavigation = (productName) => {
  const name = productName.toLowerCase();
  
  if (name.includes("buds")) {
    // Ninte database-il exact enthanu category peril ullath (e.g., "Headset" or "Earbuds") athu kodukkuka
    navigate("/all-products?category=Headset"); 
  } else if (name.includes("watch")) {
    navigate("/all-products?category=Headset");
  } else {
    navigate("/all-products");
  }
};

  return (
    <>
      <style>{globalStyles}</style>

      <div className="min-h-screen bg-[#1A0A0E] text-[#FFF0F3] font-['DM_Sans'] selection:bg-rose-600 selection:text-white">

        {/* ─────────────── HERO SECTION ─────────────── */}
        <section className="relative w-full h-[95vh] flex flex-col justify-end overflow-hidden">
          <video key={current} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A0E] via-[#1A0A0E]/40 to-transparent" />
          
          <div className="relative z-10 px-[7vw] pb-[12vh]">
            <p className="anim-1 text-[#F472B6] font-bold tracking-[0.4em] text-[10px] uppercase mb-5">Introducing Zyphone S26</p>
            <h1 className="font-display hero-title-size anim-2 tracking-tighter uppercase">
              Pro. Beyond <br /> <span className="text-[#F472B6]">Compare.</span>
            </h1>
            <div className="anim-3 flex gap-5 mt-12">
             <button 
                onClick={() => navigate("/all-products")}
                className="bg-gradient-to-r from-[#BE123C] to-[#F43F5E] px-10 py-4 rounded-full font-bold text-[10px] tracking-widest uppercase hover:scale-105 transition-transform shadow-lg"
              >
                Explore Features
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────── ANNOUNCEMENT TICKER ─────────────── */}
        <div className="ticker-gradient py-4 overflow-hidden shadow-2xl relative z-20">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((text, idx) => (
              <div key={idx} className="font-display text-black text-xl tracking-[0.15em] px-12 flex items-center gap-8">
                {text} <span className="w-2 h-2 bg-black/30 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────── QUICK STATS ─────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-white/5 bg-white/[0.02]">
          {stats.map((s, i) => (
            <div key={i} className="px-10 py-16 border-r border-white/5 last:border-0 text-center">
              <p className="font-display stat-num-size text-[#F472B6] mb-2">{s.num}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-bold">{s.label}</p>
            </div>
          ))}
        </div>


{/* ─────────────── iPHONE AIR - LAYERED STYLE ─────────────── */}
{/* ─────────────── FULL WIDTH iPHONE AIR SECTION ─────────────── */}
<section className="bg-[#f5f5f7] pt-24 pb-0 text-center overflow-hidden w-full">
      <div className="w-full flex flex-col items-center">
        
        <div className="px-6 mb-12">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            iPhone Air
          </h3>

          <h2 className="text-5xl md:text-8xl font-bold tracking-tight text-gray-900 leading-none">
            So this is what <br />
            <span className="text-gray-400">the future feels like.</span>
          </h2>

          <div className="flex justify-center gap-6 mt-10 mb-16">
            {/* 3. onClick ചേർക്കുക */}
            <button 
              onClick={() => navigate('/all-products')} // നിങ്ങളുടെ product page path നൽകുക
              className="bg-[#0071e3] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#0077ed] transition shadow-lg active:scale-95"
            >
              Buy
            </button>
            
            <button 
              onClick={() => navigate('/product-details/iphone-air')} // ഉദാഹരണത്തിന്
              className="text-[#0071e3] text-lg font-medium hover:underline flex items-center"
            >
              Learn more &nbsp; {'>'}
            </button>
          </div>
        </div>

        {/* Full Width Image with Hover Effect */}
        <div className="w-full overflow-hidden">
          <img 
            src={img18} 
            alt="iPhone Air Full View" 
            className="w-full h-auto object-cover block transition-transform duration-1000 ease-out hover:scale-105 cursor-pointer"
            onClick={() => navigate('/all-products')} // ഇമേജിൽ ക്ലിക്ക് ചെയ്താലും വർക്ക് ആകും
          />
        </div>

        <div className="py-16 px-6 max-w-2xl text-xl md:text-2xl text-gray-600 font-medium leading-relaxed text-center mx-auto">
          <p>
            The all-new iPhone Air is so incredibly light that it nearly disappears in your hand. 
            Weighting just 165 grams, it's the thinnest iPhone ever.
          </p>
        </div>
      </div>
    </section>
        {/* ─────────────── BEYOND LIMITS ─────────────── */}
        <section className="relative w-full h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={image16} className="w-full h-full object-cover brightness-[0.25]" alt="Beyond Limits" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A0E] via-transparent to-transparent" />
          </div>
          <div className="relative z-10 px-[8vw]">
            <p className="text-rose-500 font-bold tracking-[0.5em] uppercase text-xs mb-6">Display Technology</p>
            <h2 className="font-display text-[13vw] md:text-[10vw] leading-[0.8] mb-12 uppercase text-white">
              BEYOND <br/><span className="text-rose-600">LIMITS</span>
            </h2>
            <button 
              onClick={() => navigate("/all-products")}
              className="bg-white text-black font-bold text-[10px] tracking-[0.3em] px-12 py-5 rounded-full hover:bg-rose-600 hover:text-white transition-all">
              PRE-ORDER NOW
            </button>
          </div>
        </section>

        {/* ─────────────── EXPERIENCE EXCELLENCE ─────────────── */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={bottomVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 text-center px-6">
            <p className="text-rose-400 font-bold tracking-[0.5em] uppercase text-[10px] mb-6">Designed by Zyphone</p>
            <h2 className="font-display text-[13vw] md:text-[11vw] leading-[0.8] tracking-tighter mb-12 text-white">
              EXPERIENCE <br/><span className="text-rose-600">EXCELLENCE</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate("/all-products")}
                className="bg-white text-black font-bold text-[10px] tracking-widest px-14 py-5 rounded-full hover:bg-rose-600 hover:text-white transition-all shadow-2xl">
                BUY ZYPHONE S26
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────── COMPARISON FLEET SECTION ─────────────── */}
        <section className="bg-white text-black py-40 px-[8vw]">
          <div className="mb-24 flex flex-col items-center text-center border-b border-gray-100 pb-12">
             <h2 className="font-display text-[10vw] leading-none mb-4 tracking-tighter">THE FLEET.</h2>
             <p className="text-gray-400 font-bold tracking-widest text-[11px] uppercase">Compare and Conquer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { name: "Zy Buds Pro 2", price: "₹16,999", img: image17, color: "Lunar Silver" },
              { name: "Zy Buds Air",   price: "₹8,499",  img: image18, color: "Cloud White" },
              { name: "Zy Watch X",    price: "₹24,999", img: image19, color: "Obsidian" },
              { name: "Zy S26 Pro",    price: "₹1,19,999", img: image20, color: "Titanium" }
            ].map((prod, i) => (
              <div key={i} className="flex flex-col group border-b-2 border-transparent hover:border-black transition-all pb-10">
                <div className="h-64 flex items-center justify-center mb-12 bg-[#F9F9FB] rounded-[3rem] p-10 group-hover:bg-[#F1F1F4] transition-colors">
                  <img src={prod.img} alt="" className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h4 className="font-display text-4xl mb-2 tracking-tight">{prod.name}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{prod.color}</p>
                <div className="mt-auto flex justify-between items-center">
                   <p className="text-xl font-black">{prod.price}</p>
                   {/* Arrow-il click cheythaal correct category-ilekk pokum */}
                   <button 
                     onClick={() => handleFleetNavigation(prod.name)}
                     className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
                   >
                      <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ─────────────── HOPPUP STYLE FEATURE ─────────────── */}
        <section className="flex flex-col md:flex-row w-full min-h-[80vh] bg-[#1A1D2B] overflow-hidden">
          <div className="w-full md:w-1/2 relative bg-[#F3F3F3] flex items-center justify-center p-10">
            <img src={image21} alt="Z50" className="max-h-[70vh] object-contain hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="w-full md:w-1/2 bg-[#1E2337] flex flex-col justify-center items-center text-center p-12 md:p-24">
            <p className="text-rose-400 font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Enter The Dream Scape</p>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-6 tracking-tight uppercase">AirDoze Z50 Edition</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md mb-10 font-light">
              Experience the future of sound with the Zyphone AirDoze Z50—where sleek design meets superior audio quality.
            </p>
            <button 
              onClick={() => navigate("/all-products")}
              className="bg-white text-black px-12 py-4 rounded-full font-bold text-xs tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-xl uppercase">
              Buy Now
            </button>
          </div>
        </section>

        {/* ─────────────── LIFESTYLE FEATURE SECTION ─────────────── */}
        <section className="relative w-full h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={img20} 
              className="w-full h-full object-cover object-center" 
              alt="Premium Sound" 
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="relative z-10 px-[7vw] max-w-4xl">
            <h2 className="font-display text-[70px] md:text-[100px] leading-[0.9] mb-4 text-white tracking-tight uppercase">
              PREMIUM SOUND <br />
              <span className="text-white">PREMIUM STYLE</span>
            </h2>
            <p className="text-white/90 text-sm md:text-lg max-w-lg mb-10 font-medium leading-relaxed">
              Icon ANC takes a legendary look and levels it up with powerful, immersive 
              audio and premium comfort. Turn up the music, block out the noise, and step 
              into a sound experience that hits as hard as it looks.
            </p>

            <button 
              onClick={() => navigate("/all-products")}
              className="bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-[11px] tracking-widest px-12 py-4 rounded-md transition-all uppercase shadow-lg">
              SHOP NOW 
            </button>
          </div>

          {/* Trust Badges Bar */}
          <div className="absolute bottom-0 w-full bg-[#D4E67E] py-4 flex flex-wrap justify-center gap-8 md:gap-16 px-4">
            <div className="flex items-center gap-3 text-black font-bold text-[10px] tracking-tighter uppercase">
              <span className="text-lg">🚚</span> FREE SHIPPING
            </div>
            <div className="flex items-center gap-3 text-black font-bold text-[10px] tracking-tighter uppercase">
              <span className="text-lg">🧾</span> GST BILLING
            </div>
            <div className="flex items-center gap-3 text-black font-bold text-[10px] tracking-tighter uppercase">
              <span className="text-lg">🛡️</span> 1-YEAR PRODUCT WARRANTY
            </div>
          </div>
        </section>

        {/* ─────────────── FOOTER ─────────────── */}
        {/* <footer className="bg-black py-20 px-[7vw] border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center opacity-40">
             <h2 className="font-display text-4xl text-white cursor-pointer" onClick={() => navigate("/")}>ZYPHONE</h2>
             <p className="text-[10px] tracking-[.3em] uppercase text-white">© 2026 ZYPHONE INDUSTRIES — KERALA</p>
          </div>
        </footer> */}

      </div>
    </>
  );
}