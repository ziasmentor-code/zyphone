import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Smartphone, Heart, Search } from 'lucide-react';
import { CartContext } from "../context/cartcontext";
import { WishlistContext } from "../context/wishlistcontext";
import { AuthContext } from "../context/authcontext";

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  
  // AuthContext safe aayi access cheyyunnu
  const auth = useContext(AuthContext);
  const user = auth ? auth.user : null;

  return (
    <nav className="w-full bg-[#0a0a0b] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <Smartphone className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-white">ZYPHONE</span>
        </Link>

        {/* Icons */}
        <div className="flex items-center space-x-6 text-gray-400">
          <Search size={22} className="hover:text-white cursor-pointer" />

          {/* User Profile Icon */}
          <Link to={user ? "/profile" : "/login"} className="relative hover:text-white">
            <User size={22} color={user ? "#5ccb5f" : "currentColor"} />
            {user && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0b]"></span>
            )}
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative hover:text-white">
            <Heart size={22} />
            {wishlistItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative hover:text-white">
            <ShoppingCart size={22} />
            {cartItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;