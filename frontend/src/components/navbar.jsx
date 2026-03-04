import React from 'react';
import { Search, ShoppingCart, User, Smartphone } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-red-600 p-1 rounded-sm">
              <Smartphone className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-black">ZYPHONE</span>
          </div>

          {/* Center: Desktop Menu Items (OnePlus style) */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-red-600 transition">Store</a>
            <a href="#" className="hover:text-red-600 transition">Phone</a>
            <a href="#" className="hover:text-red-600 transition">Tablet</a>
            <a href="#" className="hover:text-red-600 transition">Audio</a>
            <a href="#" className="hover:text-red-600 transition">Support</a>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-5 text-gray-600">
            <button className="hover:text-black transition">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="hover:text-black transition">
              <User size={20} strokeWidth={1.5} />
            </button>
            <button className="relative hover:text-black transition">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {/* Cart Count Badge */}
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;