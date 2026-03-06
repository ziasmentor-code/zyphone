import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Smartphone, Heart, Search, LogOut, LogIn } from 'lucide-react';
import { CartContext } from "../context/cartcontext";
import { WishlistContext } from "../context/wishlistcontext";
import { AuthContext } from "../context/authcontext";

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // AuthContext-ൽ നിന്ന് ഡാറ്റ എടുക്കുന്നു
  const auth = useContext(AuthContext);
  const user = auth ? auth.user : null;
  const logout = auth ? auth.logout : null;

  const handleLogout = () => {
    if (logout) {
      logout();
      setShowDropdown(false);
      navigate('/login');
    }
  };

  return (
    <nav className="w-full bg-[#0a0a0b] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-red-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <Smartphone className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-wider">ZYPHONE</span>
        </Link>

        {/* Action Icons Section */}
        <div className="flex items-center space-x-6 text-gray-400">
          
          {/* Search Icon */}
          <Search size={22} className="hover:text-white cursor-pointer transition-colors" />

          {/* User Profile Dropdown Container */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center p-2 rounded-full hover:bg-white/5 transition-all duration-300 focus:outline-none relative"
            >
              <User 
                size={22} 
                className={`transition-colors duration-300 ${user ? "text-green-400" : "hover:text-white"}`} 
              />
              {/* Login Status Indicator */}
              {user && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0b] animate-pulse"></span>
              )}
            </button>

            {/* Actual Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Overlay to close when clicking outside */}
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                
                <div className="absolute right-0 mt-3 w-60 bg-[#121214] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden z-50 transition-all duration-300">
                  {user ? (
                    <div className="flex flex-col">
                      {/* Header Area with User Details */}
                      <div className="px-5 py-4 bg-white/5 border-b border-white/10">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Signed in as</p>
                        <p className="text-sm text-white truncate font-semibold">{user.displayName || 'Zyphone User'}</p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      {/* Links Section */}
                      <div className="p-2">
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className="bg-white/5 p-1.5 rounded-md text-gray-400">
                             <User size={14} />
                          </div>
                          My Profile
                        </Link>
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                        >
                          <div className="bg-red-500/10 p-1.5 rounded-md">
                             <LogOut size={14} />
                          </div>
                          Logout Session
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Login Link (When not logged in) */
                    <div className="p-2">
                      <Link 
                        to="/login" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all font-medium justify-center"
                        onClick={() => setShowDropdown(false)}
                      >
                        <LogIn size={18} /> Login to Account
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Wishlist Link */}
          <Link to="/wishlist" className="relative hover:text-white transition-colors">
            <Heart size={22} />
            {wishlistItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link to="/cart" className="relative hover:text-white transition-colors">
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