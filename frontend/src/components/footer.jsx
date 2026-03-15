import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter an email");

    try {
      // Backend URL (Ninte Django api endpoint)
      await axios.post("http://127.0.0.1:8000/api/subscribe/", { email });
      toast.success("Subscribed successfully!");
      setEmail(""); // Input clear cheyyaan
    } catch (err) {
      toast.error("Something went wrong or already subscribed");
    }
  };

  return (
    <footer className="bg-[#0a0a0b] text-white pt-24 pb-12 border-t border-white/5 font-['DM_Sans']">
      <div className="container mx-auto px-[7vw]">
        
        {/* ─── TOP SECTION: BRAND & NEWSLETTER ─── */}
       <div className="flex flex-col justify-center">
      <h4 className="text-sm font-bold tracking-[0.3em] uppercase mb-6 text-rose-500">Stay in the Loop</h4>
      <form onSubmit={handleSubscribe} className="relative flex items-center">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" 
          className="w-full bg-white/5 border-b border-white/20 py-4 px-2 outline-none focus:border-rose-500 transition-colors text-xl font-light text-white"
          required
        />
        <button type="submit" className="absolute right-0 p-2 hover:text-rose-500 transition-colors text-white">
          <ArrowRight size={28} />
        </button>
      </form>
    </div>

        <hr className="border-white/5 mb-20" />

        {/* ─── MIDDLE SECTION: LINKS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
  
  {/* Shop Column */}
  <div className="flex flex-col gap-6">
    <h5 className="text-[11px] font-black tracking-[0.2em] uppercase text-gray-500">Shop</h5>
    <ul className="flex flex-col gap-4 text-gray-300">
      <li 
        className="hover:text-rose-500 cursor-pointer transition-colors" 
        onClick={() => navigate('/all-products?category=phone')}
      >
        Smartphones
      </li>
      <li 
        className="hover:text-rose-500 cursor-pointer transition-colors" 
        onClick={() => navigate('/all-products?category=headset')}
      >
        Audio & Buds
      </li>
      <li 
        className="hover:text-rose-500 cursor-pointer transition-colors" 
        onClick={() => navigate('/all-products?category=watch')}
      >
        Wearables
      </li>
      <li 
        className="hover:text-rose-500 cursor-pointer transition-colors" 
        onClick={() => navigate('/all-products')}
      >
        All Devices
      </li>
    </ul>
  </div>

  {/* Support Column */}
  <div className="flex flex-col gap-6">
    <h5 className="text-[11px] font-black tracking-[0.2em] uppercase text-gray-500">Support</h5>
    <ul className="flex flex-col gap-4 text-gray-300">
      <li className="hover:text-white cursor-pointer" onClick={() => navigate('/my-orders')}>Order Tracking</li>
      <li className="hover:text-white cursor-pointer" onClick={() => navigate('/profile')}>My Account</li>
      <li className="hover:text-white cursor-pointer">Warranty Info</li>
      <li className="hover:text-white cursor-pointer">FAQs</li>
    </ul>
  </div>
          {/* Contact Column */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <h5 className="text-[11px] font-black tracking-[0.2em] uppercase text-gray-500">Connect</h5>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-gray-300">
                <MapPin size={18} className="text-rose-500" />
                <span>Zyphone HQ, Silicon Valley, Kochi, Kerala</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <Phone size={18} className="text-rose-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex gap-6 mt-4">
                <Instagram className="hover:text-rose-500 cursor-pointer transition-colors" size={24} />
                <Facebook className="hover:text-rose-500 cursor-pointer transition-colors" size={24} />
                <Twitter className="hover:text-rose-500 cursor-pointer transition-colors" size={24} />
                <Youtube className="hover:text-rose-500 cursor-pointer transition-colors" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM SECTION: LEGAL ─── */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs tracking-widest uppercase">
            © 2026 ZYPHONE INDUSTRIES. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] tracking-widest uppercase text-gray-500">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Cookie Settings</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;