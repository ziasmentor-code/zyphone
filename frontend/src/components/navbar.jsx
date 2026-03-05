import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Smartphone } from 'lucide-react';
import { CartContext } from "../context/cartcontext";

const Navbar = () => {

  const { cartItems } = useContext(CartContext);

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-red-600 p-1 rounded-sm">
              <Smartphone className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-black">
              ZYPHONE
            </span>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-red-600">Store</Link>
            <Link to="/all-products" className="hover:text-red-600">Phone</Link>
            <Link to="/all-products" className="hover:text-red-600">Audio</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5 text-gray-600">

            <Search size={20} />

            <User size={20} />

            <Link to="/cart" className="relative">

              <ShoppingCart size={20} />

              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>

            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;