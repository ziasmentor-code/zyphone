// components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { CartContext } from "../context/cartcontext";
import { WishlistContext } from "../context/wishlistcontext";
import { 
  Menu, X, ShoppingCart, Heart, User, LogOut, Home, 
  Package, Search, Sun, Moon, ChevronDown 
} from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.style.backgroundColor = savedTheme === 'dark' ? '#0a0a0a' : '#f5f5f7';
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.style.backgroundColor = newTheme === 'dark' ? '#0a0a0a' : '#f5f5f7';
  };

  // ✅ FIXED: Search function
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlistItems?.length || 0;

  // Theme-based styles
  const getStyles = () => {
    if (theme === 'dark') {
      return {
        navbar: {
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
          borderBottom: "1px solid #333",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
          ...(isScrolled ? { boxShadow: "0 2px 10px rgba(255,215,0,0.2)" } : {}),
        },
        logoText: {
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#FFD700",
          letterSpacing: "2px",
          textShadow: "0 2px 4px rgba(255,215,0,0.3)",
          textDecoration: "none",
        },
        navLink: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "500",
          padding: "8px 16px",
          borderRadius: "8px",
          transition: "all 0.2s",
          cursor: "pointer",
        },
        activeLink: {
          background: "rgba(255,215,0,0.1)",
          color: "#FFD700",
        },
        searchForm: {
          display: "flex",
          alignItems: "center",
          background: "#2a2a2a",
          borderRadius: "8px",
          padding: "5px 10px",
          margin: "0 10px",
          border: "1px solid #333",
        },
        searchInput: {
          border: "none",
          background: "transparent",
          padding: "8px 10px",
          width: "200px",
          outline: "none",
          fontSize: "14px",
          color: "#fff",
        },
        searchButton: {
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#FFD700",
        },
        iconLink: {
          position: "relative",
          textDecoration: "none",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        },
        badge: {
          position: "absolute",
          top: "0",
          right: "0",
          background: "#FFD700",
          color: "#000",
          fontSize: "10px",
          fontWeight: "600",
          minWidth: "18px",
          height: "18px",
          borderRadius: "9px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        userMenu: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: "8px",
          background: "rgba(255,215,0,0.05)",
        },
        userMenuDropdown: {
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "10px",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "8px",
          width: "200px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        },
        dropdownItem: {
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
          color: "#fff",
          textDecoration: "none",
          transition: "background 0.2s",
          cursor: "pointer",
          border: "none",
          background: "none",
          width: "100%",
          fontSize: "14px",
        },
        authButtons: {
          display: "flex",
          gap: "10px",
          marginLeft: "10px",
        },
        loginBtn: {
          textDecoration: "none",
          color: "#fff",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "8px",
          border: "1px solid #333",
        },
        signupBtn: {
          textDecoration: "none",
          background: "#FFD700",
          color: "#000",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
        },
        themeBtn: {
          background: "none",
          border: "1px solid #333",
          cursor: "pointer",
          color: "#FFD700",
          padding: "8px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "10px",
        },
        mobileMenu: {
          background: "#1a1a1a",
          padding: "20px",
          borderTop: "1px solid #333",
        },
        mobileLink: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
          color: "#fff",
          padding: "12px",
          borderRadius: "8px",
          transition: "background 0.2s",
          width: "100%",
          border: "none",
          background: "none",
          fontSize: "14px",
          cursor: "pointer",
        },
      };
    } else {
      // Light theme
      return {
        navbar: {
          background: "linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%)",
          borderBottom: "1px solid #e5e5e5",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
          ...(isScrolled ? { boxShadow: "0 2px 10px rgba(0,0,0,0.1)" } : {}),
        },
        logoText: {
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#3b82f6",
          letterSpacing: "2px",
          textDecoration: "none",
        },
        navLink: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          color: "#333",
          fontSize: "14px",
          fontWeight: "500",
          padding: "8px 16px",
          borderRadius: "8px",
          transition: "all 0.2s",
          cursor: "pointer",
        },
        activeLink: {
          background: "rgba(59,130,246,0.1)",
          color: "#3b82f6",
        },
        searchForm: {
          display: "flex",
          alignItems: "center",
          background: "#fff",
          borderRadius: "8px",
          padding: "5px 10px",
          margin: "0 10px",
          border: "1px solid #e5e5e5",
        },
        searchInput: {
          border: "none",
          background: "transparent",
          padding: "8px 10px",
          width: "200px",
          outline: "none",
          fontSize: "14px",
          color: "#333",
        },
        searchButton: {
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#3b82f6",
        },
        iconLink: {
          position: "relative",
          textDecoration: "none",
          color: "#333",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        },
        badge: {
          position: "absolute",
          top: "0",
          right: "0",
          background: "#3b82f6",
          color: "#fff",
          fontSize: "10px",
          fontWeight: "600",
          minWidth: "18px",
          height: "18px",
          borderRadius: "9px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        userMenu: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: "8px",
          background: "rgba(59,130,246,0.05)",
        },
        userMenuDropdown: {
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "10px",
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: "8px",
          width: "200px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
        dropdownItem: {
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
          color: "#333",
          textDecoration: "none",
          transition: "background 0.2s",
          cursor: "pointer",
          border: "none",
          background: "none",
          width: "100%",
          fontSize: "14px",
        },
        authButtons: {
          display: "flex",
          gap: "10px",
          marginLeft: "10px",
        },
        loginBtn: {
          textDecoration: "none",
          color: "#333",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "8px",
          border: "1px solid #e5e5e5",
        },
        signupBtn: {
          textDecoration: "none",
          background: "#3b82f6",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
        },
        themeBtn: {
          background: "none",
          border: "1px solid #e5e5e5",
          cursor: "pointer",
          color: "#3b82f6",
          padding: "8px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "10px",
        },
        mobileMenu: {
          background: "#fff",
          padding: "20px",
          borderTop: "1px solid #e5e5e5",
        },
        mobileLink: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
          color: "#333",
          padding: "12px",
          borderRadius: "8px",
          transition: "background 0.2s",
          width: "100%",
          border: "none",
          background: "none",
          fontSize: "14px",
          cursor: "pointer",
        },
      };
    }
  };

  const styles = getStyles();
  
const navLinks = [
  { name: "Home", path: "/", icon: <Home size={18} /> },
  { name: "Products", path: "/all-products", icon: <Package size={18} /> }, // ✅ This also works
];

  return (
    <>
      <nav style={styles.navbar}>
        <div style={containerStyle}>
          {/* Logo */}
          <Link to="/" style={styles.logoText}>
            ZYPHONE
          </Link>

          {/* Desktop Menu */}
          <div style={desktopMenuStyle}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  ...styles.navLink,
                  ...(location.pathname === link.path ? styles.activeLink : {})
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.searchButton}>
                <Search size={16} />
              </button>
            </form>

            {/* Cart Icon */}
            <Link to="/cart" style={styles.iconLink} onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={styles.badge}>{cartCount}</span>
              )}
            </Link>

            {/* Wishlist Icon */}
            <Link to="/wishlist" style={styles.iconLink} onClick={() => setIsMenuOpen(false)}>
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span style={styles.badge}>{wishlistCount}</span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} style={styles.themeBtn}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Menu */}
            {user ? (
              <div 
                style={styles.userMenu}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={18} />
                <span style={{ fontSize: "14px" }}>{user.email?.split('@')[0]}</span>
                <ChevronDown size={14} />
                
                {isUserMenuOpen && (
                  <div style={styles.userMenuDropdown}>
                    <Link 
                      to="/profile" 
                      style={styles.dropdownItem}
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    
                    <Link 
                      to="/my-orders" 
                      style={styles.dropdownItem}
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Package size={16} />
                      <span>My Orders</span>
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      style={styles.dropdownItem}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.authButtons}>
                <Link to="/login" style={styles.loginBtn} onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" style={styles.signupBtn} onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: theme === 'dark' ? '#FFD700' : '#3b82f6',
              display: "none",
              padding: "8px",
            }}
            className="mobile-menu-btn"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={styles.mobileMenu}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            <form onSubmit={handleSearch} style={mobileSearchStyle}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={mobileSearchInputStyle(theme)}
              />
              <button type="submit" style={mobileSearchButtonStyle(theme)}>
                Search
              </button>
            </form>

            <Link to="/cart" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart size={18} />
              <span>Cart ({cartCount})</span>
            </Link>

            <Link to="/wishlist" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
              <Heart size={18} />
              <span>Wishlist ({wishlistCount})</span>
            </Link>

            <button onClick={toggleTheme} style={styles.mobileLink}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {user ? (
              <>
                <Link to="/profile" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                
                <Link to="/my-orders" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                  <Package size={18} />
                  <span>My Orders</span>
                </Link>
                
                <button onClick={handleLogout} style={styles.mobileLink}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div style={mobileAuthStyle}>
                <Link to="/login" style={mobileLoginStyle(theme)} onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" style={mobileSignupStyle(theme)} onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
      
      {/* Spacer */}
      <div style={{ height: "80px" }} />

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

// Standalone styles
const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px",
  height: "70px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const desktopMenuStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const mobileSearchStyle = {
  display: "flex",
  gap: "10px",
  margin: "10px 0",
};

const mobileSearchInputStyle = (theme) => ({
  flex: 1,
  padding: "12px",
  border: theme === 'dark' ? "1px solid #333" : "1px solid #e5e5e5",
  borderRadius: "8px",
  outline: "none",
  background: theme === 'dark' ? "#2a2a2a" : "#fff",
  color: theme === 'dark' ? "#fff" : "#333",
});

const mobileSearchButtonStyle = (theme) => ({
  padding: "12px 20px",
  background: theme === 'dark' ? "#FFD700" : "#3b82f6",
  color: theme === 'dark' ? "#000" : "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
});

const mobileAuthStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
};

const mobileLoginStyle = (theme) => ({
  flex: 1,
  textAlign: "center",
  padding: "12px",
  border: theme === 'dark' ? "1px solid #333" : "1px solid #e5e5e5",
  borderRadius: "8px",
  textDecoration: "none",
  color: theme === 'dark' ? "#fff" : "#333",
});

const mobileSignupStyle = (theme) => ({
  flex: 1,
  textAlign: "center",
  padding: "12px",
  background: theme === 'dark' ? "#FFD700" : "#3b82f6",
  color: theme === 'dark' ? "#000" : "#fff",
  borderRadius: "8px",
  textDecoration: "none",
});

export default Navbar;