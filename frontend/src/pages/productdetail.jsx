// import React, { useState } from "react";
// import { 
//   ShoppingCart, 
//   ShieldCheck, 
//   Truck, 
//   RefreshCw, 
//   Star, 
//   ChevronRight,
//   ArrowLeft
// } from "lucide-react";

// // Image Imports
// import image16 from "../assets/images/image16.jpg";
// import image9 from "../assets/images/image9.jpg";

// export default function ProductPage() {
//   const [selectedColor, setSelectedColor] = useState("Titanium");
//   const [quantity, setQuantity] = useState(1);

//   const colors = [
//     { name: "Titanium", class: "bg-zinc-400" },
//     { name: "Midnight", class: "bg-slate-900" },
//     { name: "Rose", class: "bg-rose-300" }
//   ];

//   return (
//     <div className="min-h-screen bg-white text-black font-['DM_Sans']">
      
//       {/* ─────────────── BREADCRUMB / BACK ─────────────── */}
//       <nav className="px-[7vw] py-6 flex items-center gap-4 text-sm text-gray-500">
//         <button className="flex items-center gap-2 hover:text-black transition-colors">
//           <ArrowLeft size={16} /> Back to Shop
//         </button>
//         <span className="text-gray-300">|</span>
//         <span className="uppercase tracking-widest text-[10px] font-bold">Zyphone</span>
//         <ChevronRight size={12} />
//         <span className="uppercase tracking-widest text-[10px] font-bold text-black">Zyphone S26 Ultra</span>
//       </nav>

//       {/* ─────────────── MAIN PRODUCT SECTION ─────────────── */}
//       <main className="px-[7vw] py-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
//         {/* LEFT: Image Gallery */}
//         <div className="space-y-6">
//           <div className="bg-[#F8F8F8] rounded-[40px] p-12 flex items-center justify-center overflow-hidden group">
//             <img 
//               src={image16} 
//               alt="Product Main" 
//               className="max-h-[70vh] object-contain group-hover:scale-105 transition-transform duration-700"
//             />
//           </div>
//           <div className="grid grid-cols-4 gap-4">
//             {[image16, image9, image16, image9].map((img, i) => (
//               <div key={i} className="aspect-square bg-[#F8F8F8] rounded-2xl p-4 cursor-pointer hover:ring-2 ring-rose-500 transition-all">
//                 <img src={img} className="w-full h-full object-contain" alt="thumb" />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT: Product Info */}
//         <div className="flex flex-col">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
//             <span className="text-xs font-bold text-gray-400">(128 Customer Reviews)</span>
//           </div>

//           <h1 className="text-6xl font-black tracking-tighter uppercase mb-2">Zyphone S26 Ultra</h1>
//           <p className="text-rose-600 text-3xl font-bold mb-6">₹1,26,099</p>
          
//           <p className="text-gray-500 leading-relaxed mb-8 border-b pb-8">
//             Experience the pinnacle of mobile technology. The Zyphone S26 Ultra features our most advanced 
//             Titanium build, an revolutionary AI camera system, and the world's fastest mobile chip. 
//             Engineered for those who demand excellence.
//           </p>

//           {/* Color Selection */}
//           <div className="mb-8">
//             <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-gray-400">Select Finish</h4>
//             <div className="flex gap-4">
//               {colors.map((color) => (
//                 <button 
//                   key={color.name}
//                   onClick={() => setSelectedColor(color.name)}
//                   className={`group flex flex-col items-center gap-2 transition-all`}
//                 >
//                   <div className={`w-10 h-10 rounded-full ${color.class} ring-offset-2 ${selectedColor === color.name ? 'ring-2 ring-black' : 'ring-0'}`}></div>
//                   <span className="text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100">{color.name}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Quantity & Action */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-10">
//             <div className="flex items-center border-2 border-gray-100 rounded-full px-6 py-4">
//               <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl font-bold px-4">-</button>
//               <span className="w-12 text-center font-bold">{quantity}</span>
//               <button onClick={() => setQuantity(quantity + 1)} className="text-xl font-bold px-4">+</button>
//             </div>
//             <button className="flex-1 bg-black text-white rounded-full py-5 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-xl">
//               Add to Bag <ShoppingCart size={18} />
//             </button>
//           </div>

//           {/* Trust Badges */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
//             <div className="flex items-center gap-3">
//               <ShieldCheck className="text-rose-500" />
//               <div className="text-[10px] font-bold uppercase leading-tight">2 Year <br/> Warranty</div>
//             </div>
//             <div className="flex items-center gap-3">
//               <Truck className="text-rose-500" />
//               <div className="text-[10px] font-bold uppercase leading-tight">Free Express <br/> Shipping</div>
//             </div>
//             <div className="flex items-center gap-3">
//               <RefreshCw className="text-rose-500" />
//               <div className="text-[10px] font-bold uppercase leading-tight">7 Days <br/> Replacement</div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* ─────────────── SPECIFICATIONS TABLE ─────────────── */}
//       <section className="px-[7vw] py-24 bg-[#FBFBFB]">
//         <h2 className="font-display text-5xl mb-12 uppercase">Technical Specs</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
//           {[
//             { label: "Display", value: '6.9" Dynamic LTPO AMOLED 2X, 144Hz' },
//             { label: "Processor", value: "Zy-Chip A18 Bionic Max" },
//             { label: "Main Camera", value: "200MP Main + 50MP Periscope + 12MP Ultra-wide" },
//             { label: "Battery", value: "5500 mAh with 100W Fast Charge" },
//             { label: "Build", value: "Grade 5 Titanium Frame, Ceramic Shield Front" },
//             { label: "OS", value: "ZyOS 18 (Android 16 Based)" },
//           ].map((spec, i) => (
//             <div key={i} className="flex justify-between py-5 border-b border-gray-200">
//               <span className="font-bold text-[10px] uppercase tracking-widest text-gray-400">{spec.label}</span>
//               <span className="font-bold text-sm">{spec.value}</span>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }