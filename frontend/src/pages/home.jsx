import React, { useState, useEffect } from "react";
import { Smartphone, Laptop, Watch, Headphones, ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Image Imports (Existing files)
import image3     from "../assets/images/image3.jpg";
import image7     from "../assets/images/image7.jpg";
import image8     from "../assets/images/image8.jpg";
import image9     from "../assets/images/image9.jpg";
import image16    from "../assets/images/image16.jpg";

// ERROR FIX: Image 17-20 vareyulla files folder-il illatha kond 
// existing images-ine aayathu aayi thalkkaalam assign cheyyunnu.
import image17    from "../assets/image17.jpg"; // assets ഫോൾഡറിൽ നേരിട്ട്
import image18    from "../assets/images/image18.jpg"; 
import image19    from "../assets/images/image19.jpg"; 
import image20    from "../assets/images/image20.jpg";
import image21   from "../assets/images/image21.jpg";

// Media Imports
const earpodeImg = image8; 
import heroVideo  from "../assets/images/herovideo.mp4";
import bottomVideo from "../assets/images/herovideo1.mp4";
import modalVideo from "../assets/images/vedio1.mp4";

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

const products = [
  { id: 1, name: "Zyphone 15R", price: "₹32,924", img: image9 },
  { id: 2, name: "Zyphone S26 Ultra", price: "₹1,26,099", img: image16, highlight: true },
  { id: 3, name: "Zyphone Classic", price: "₹20,990", img: image3 },
  { id: 4, name: "Zyphone Buds Pro", price: "₹4,990", img: image7 },
  { id: 5, name: "Zyphone Airpods 3", price: "₹12,990", img: image8 },
  { id: 6, name: "Zyphone Earpodes Plus", price: "₹2,499", img: earpodeImg },
];

const stats = [
  { num: "2M+",   label: "Devices Sold" },
  { num: "150+", label: "Service Centers" },
  { num: "4.9★", label: "User Rating" },
  { num: "24/7", label: "Priority Support" },
];

const tickerItems = ["LIMITED TIME OFFERS", "NO-COST EMI AVAILABLE", "FREE EXPRESS DELIVERY", "CERTIFIED REFURBISHED"];

export default function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % 2), 6000);
    return () => clearInterval(interval);
  }, []);

const goToProducts = () => {
  navigate("/all-products");
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
                onClick={goToProducts}
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

        {/* ─────────────── PRODUCT GRID ─────────────── */}
        <section className="px-[7vw] py-32">
          <h2 className="font-display text-6xl tracking-tight mb-16 italic">TRENDING MODELS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {products.map(item => (
              <div key={item.id} className="group p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-rose-500/30 transition-all duration-500">
                <div className="h-40 flex items-center justify-center mb-8">
                  <img src={item.img} alt="" className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <p className="font-display text-3xl text-rose-500">{item.price}</p>
              </div>
            ))}
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
            <button className="bg-white text-black font-bold text-[10px] tracking-[0.3em] px-12 py-5 rounded-full hover:bg-rose-600 hover:text-white transition-all">
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
              <button className="bg-white text-black font-bold text-[10px] tracking-widest px-14 py-5 rounded-full hover:bg-rose-600 hover:text-white transition-all shadow-2xl">
                BUY ZYPHONE S26
              </button>
              <button className="flex items-center gap-4 text-white font-bold text-[10px] tracking-widest uppercase group">
                WATCH THE FILM 
                <span className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">▶</span>
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────── PRODUCT COMPARISON SECTION (SAMSUNG STYLE) ─────────────── */}
       {/* ─────────────── PRODUCT COMPARISON SECTION ─────────────── */}
{/* ─────────────── PRODUCT COMPARISON SECTION (SAMSUNG STYLE) ─────────────── */}
<section className="bg-white py-24 px-[7vw] text-black">
          <div className="text-center mb-16">
            <a href="#" className="text-sm font-bold border-b-2 border-black pb-1 inline-flex items-center gap-2 group">
              Go to Find your Zyphone <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-[95vw] mx-auto">
            
            {/* 1. Zy Buds Pro 2 (Image 17) */}
            <div className="flex flex-col items-center">
              <div className="w-full border-b-[3px] border-black pb-3 mb-10">
                <h3 className="font-bold text-2xl tracking-tight uppercase">Zy Buds Pro 2</h3>
              </div>
              <div className="h-64 flex items-center justify-center mb-6 group">
                <img src={image17} alt="Buds Pro 2" className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-sm mb-2 uppercase">Zy Buds Pro 2</h4>
                <p className="text-[11px] text-gray-400 font-bold mb-4 uppercase">Silver Edition</p>
                <div className="flex gap-2 justify-center mb-6">
                   <span className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300"></span>
                   <span className="w-4 h-4 rounded-full bg-black border border-gray-800"></span>
                </div>
                <p className="font-bold text-xl mb-6">₹16,999</p>
                <button className="bg-black text-white px-12 py-3 rounded-full text-[11px] font-bold hover:bg-rose-600 transition-colors uppercase">BUY NOW</button>
              </div>
            </div>

            {/* 2. Zy Buds Air (Image 18) */}
            <div className="flex flex-col items-center">
              <div className="w-full border-b-[3px] border-gray-100 pb-3 mb-10 flex justify-between items-center">
                <h3 className="font-bold text-2xl tracking-tight text-gray-800 uppercase">Zy Buds Air</h3>
                <ChevronDown size={24} className="text-gray-300" />
              </div>
              <div className="h-64 flex items-center justify-center mb-6 group">
                <img src={image18} alt="Buds Air" className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-sm mb-2 uppercase">Zy Buds Air</h4>
                <p className="text-[11px] text-gray-400 font-bold mb-4 uppercase">Cloud White</p>
                <div className="flex gap-2 justify-center mb-6">
                   <span className="w-4 h-4 rounded-full bg-white border border-gray-200"></span>
                   <span className="w-4 h-4 rounded-full bg-pink-100 border border-pink-200"></span>
                </div>
                <p className="font-bold text-xl mb-6">₹8,499</p>
                <button className="bg-black text-white px-12 py-3 rounded-full text-[11px] font-bold hover:bg-rose-600 transition-colors uppercase">BUY NOW</button>
              </div>
            </div>

            {/* 3. Zy Watch X (Image 19) */}
            <div className="flex flex-col items-center">
              <div className="w-full border-b-[3px] border-gray-100 pb-3 mb-10 flex justify-between items-center">
                <h3 className="font-bold text-2xl tracking-tight text-gray-800 uppercase">Zy Watch X</h3>
                <ChevronDown size={24} className="text-gray-300" />
              </div>
              <div className="h-64 flex items-center justify-center mb-6 group">
                <img src={image19} alt="Watch X" className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-sm mb-2 uppercase">Zy Watch X</h4>
                <p className="text-[11px] text-gray-400 font-bold mb-4 uppercase">Midnight Blue</p>
                <div className="flex gap-2 justify-center mb-6">
                   <span className="w-4 h-4 rounded-full bg-blue-900 border border-blue-950"></span>
                   <span className="w-4 h-4 rounded-full bg-gray-500 border border-gray-600"></span>
                </div>
                <p className="font-bold text-xl mb-6">₹24,999</p>
                <button className="bg-black text-white px-12 py-3 rounded-full text-[11px] font-bold hover:bg-rose-600 transition-colors uppercase">BUY NOW</button>
              </div>
            </div>

            {/* 4. Zy S26 Pro (Image 20) */}
            <div className="flex flex-col items-center">
              <div className="w-full border-b-[3px] border-gray-100 pb-3 mb-10 flex justify-between items-center">
                <h3 className="font-bold text-2xl tracking-tight text-gray-800 uppercase">Zy S26 Pro</h3>
                <ChevronDown size={24} className="text-gray-300" />
              </div>
              <div className="h-64 flex items-center justify-center mb-6 group">
                <img src={image20} alt="S26 Pro" className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-sm mb-2 uppercase">Zyphone S26 Pro</h4>
                <p className="text-[11px] text-gray-400 font-bold mb-4 uppercase">Titanium Black</p>
                <div className="flex gap-2 justify-center mb-6">
                   <span className="w-4 h-4 rounded-full bg-black border border-gray-800"></span>
                   <span className="w-4 h-4 rounded-full bg-zinc-600 border border-zinc-700"></span>
                </div>
                <p className="font-bold text-xl mb-6">₹1,19,999</p>
                <button className="bg-black text-white px-12 py-3 rounded-full text-[11px] font-bold hover:bg-rose-600 transition-colors uppercase">BUY NOW</button>
              </div>
            </div>

          </div>
        </section>
        {showModal && selectedProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 modal-blur overflow-y-auto">
            <div className="bg-white rounded-[40px] overflow-hidden max-w-5xl w-full flex flex-col md:flex-row shadow-2xl relative my-auto">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 z-[210] bg-black text-white p-2 rounded-full hover:bg-red-600 transition-all">
                <X size={24}/>
              </button>
              <div className="w-full md:w-1/2 h-[400px] md:h-auto bg-black">
                 <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={modalVideo} type="video/mp4" />
                 </video>
              </div>
              <div className="w-full md:w-1/2 p-12 flex flex-col justify-center text-black">
                <h2 className="text-4xl font-black mb-2 uppercase tracking-tight">{selectedProduct.name}</h2>
                <p className="text-3xl font-black text-red-600 mb-8">{selectedProduct.price}</p>
                <button className="w-full bg-black text-white py-5 rounded-2xl font-black hover:bg-red-600 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                   ADD TO CART <ShoppingCart size={20}/>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────── NEW PRODUCT FEATURE SECTION (HOPPUP STYLE) ─────────────── */}
<section className="flex flex-col md:flex-row w-full min-h-[80vh] bg-[#1A1D2B] overflow-hidden">
  
  {/* Left Side: Product Image */}
  <div className="w-full md:w-1/2 relative bg-[#F3F3F3] flex items-center justify-center p-10">
    <img 
      src={image21} // നിന്റെ കയ്യിലുള്ള Zyphone ഇമേജ് ഇവിടെ നൽകാം
      alt="Zyphone Featured" 
      className="max-h-[70vh] object-contain hover:scale-105 transition-transform duration-700"
    />
  </div>

  {/* Right Side: Content */}
  <div className="w-full md:w-1/2 bg-[#1E2337] flex flex-col justify-center items-center text-center p-12 md:p-24">
    {/* Icon or Small Logo */}
    <div className="mb-6">
       <div className="w-12 h-12 border-2 border-white/20 rounded-xl flex items-center justify-center">
          <span className="text-white text-2xl">👍</span>
       </div>
    </div>

    <p className="text-rose-400 font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
      Enter The Dream Scape
    </p>

    <h2 className="font-display text-5xl md:text-7xl text-white mb-6 tracking-tight uppercase">
      AirDoze Z50 Edition
    </h2>

    <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md mb-10 font-light">
      Experience the future of sound with the Zyphone AirDoze Z50—where sleek design meets superior audio quality, 
      Dual Mic AI ENC, and 40-hour playtime for an unparalleled, immersive journey in music, calls, and gaming.
    </p>

    <button className="bg-white text-black px-12 py-4 rounded-full font-bold text-xs tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-xl uppercase">
      Buy Now
    </button>
  </div>
</section>


        
        {/* ─────────────── FOOTER ─────────────── */}
        <footer className="bg-black py-20 px-[7vw] text-center md:text-left border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center opacity-40">
             <h2 className="font-display text-4xl">ZYPHONE</h2>
             <p className="text-[10px] tracking-[.3em] uppercase">© 2026 ZYPHONE INDUSTRIES — KERALA</p>
          </div>
        </footer>

      </div>
    </>
  );
}