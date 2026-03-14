import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Smartphone,
  Heart,
  Search,
  LogOut,
  LogIn
} from "lucide-react";

import { CartContext } from "../context/cartcontext";
import { WishlistContext } from "../context/wishlistcontext";
import { AuthContext } from "../context/authcontext";

const Navbar = () => {

  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const auth = useContext(AuthContext);

  const user = auth?.user;
  const logout = auth?.logout;

  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {

    if (logout) {
      logout();
      setShowDropdown(false);
      navigate("/login");
    }

  };

  const goToCart = () => {
    navigate("/cart");
  };

  return (

    <nav className="w-full bg-[#0a0a0b] border-b border-white/10 sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">

        {/* LOGO */}

        <Link to="/" className="flex items-center gap-2 group">

          <div className="bg-red-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">

            <Smartphone className="text-white" size={20} />

          </div>

          <span className="text-xl font-bold text-white tracking-wider">
            ZYPHONE
          </span>

        </Link>

        {/* RIGHT SIDE ICONS */}

        <div className="flex items-center space-x-6 text-gray-400">

          {/* SEARCH */}

          <Search size={22} className="hover:text-white cursor-pointer transition-colors" />

          {/* USER DROPDOWN */}

          <div className="relative">

            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center p-2 rounded-full hover:bg-white/5 transition-all relative"
            >

              <User
                size={22}
                className={`${user ? "text-green-400" : "hover:text-white"}`}
              />

              {user && (

                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0b]"></span>

              )}

            </button>

            {showDropdown && (

              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                ></div>

                <div className="absolute right-0 mt-3 w-60 bg-[#121214] border border-white/10 rounded-2xl shadow-lg overflow-hidden z-50">

                  {user ? (

                    <div className="flex flex-col">

                      <div className="px-5 py-4 bg-white/5 border-b border-white/10">

                        <p className="text-[10px] text-gray-500 uppercase">
                          Signed in as
                        </p>

                        <p className="text-sm text-white font-semibold">
                          {user.displayName || "Zyphone User"}
                        </p>

                        <p className="text-xs text-gray-400">
                          {user.email}
                        </p>

                      </div>

                      <div className="p-2">

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg"
                          onClick={() => setShowDropdown(false)}
                        >
                          <User size={14} />
                          My Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <LogOut size={14} />
                          Logout
                        </button>

                      </div>

                    </div>

                  ) : (

                    <div className="p-3">

                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl justify-center"
                        onClick={() => setShowDropdown(false)}
                      >
                        <LogIn size={18} />
                        Login
                      </Link>

                    </div>

                  )}

                </div>

              </>

            )}

          </div>

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="relative hover:text-white transition-colors"
          >

            <Heart size={22} />

            {wishlistItems?.length > 0 && (

              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">

                {wishlistItems.length}

              </span>

            )}

          </Link>

          {/* CART ICON */}

          <button
            onClick={goToCart}
            className="relative hover:text-white transition-colors"
          >

            <ShoppingCart size={22} />

            {cartItems?.length > 0 && (

           <span className="bg-green-500 text-white rounded-full px-2 text-xs">
  {cartItems.length}
</span>

            )}

          </button>

        </div>

      </div>

    </nav>

  );

};

export default Navbar;