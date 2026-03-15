// components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { CartContext } from "../context/cartcontext";
import { WishlistContext } from "../context/wishlistcontext";
import { 
  Menu, X, ShoppingCart, Heart, User, LogOut, Home, 
  Package, Search, Sun, Moon, ChevronDown, Bell,
  Settings, HelpCircle, Sparkles
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
  const [notifications, setNotifications] = useState(3); // Example notification count

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
          background: isScrolled ? 'rgba(10, 10, 10, 0.95)' : '#0a0a0a',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none',
        },
        logoText: {
          fontSize: "1.8rem",
          fontWeight: "800",
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: "-0.5px",
          textDecoration: "none",
          fontFamily: "'Poppins', sans-serif",
        },
        navLink: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          color: "#e0e0e0",
          fontSize: "14px",
          fontWeight: "500",
          padding: "8px 16px",
          borderRadius: "8px",
          transition: "all 0.2s",
          cursor: "pointer",
        },
        activeLink: {
          background: "rgba(102, 126, 234, 0.1)",
          color: "#667eea",
        },
        searchForm: {
          display: "flex",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          padding: "8px 12px",
          margin: "0 10px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "all 0.2s",
        },
        searchInput: {
          border: "none",
          background: "transparent",
          padding: "4px 8px",
          width: "220px",
          outline: "none",
          fontSize: "14px",
          color: "#fff",
        },
        searchButton: {
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#667eea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        iconLink: {
          position: "relative",
          textDecoration: "none",
          color: "#e0e0e0",
          padding: "8px",
          borderRadius: "8px",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        badge: {
          position: "absolute",
          top: "0",
          right: "0",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          fontSize: "10px",
          fontWeight: "600",
          minWidth: "18px",
          height: "18px",
          borderRadius: "9px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
        },
        userMenu: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          padding: "6px 12px",
          borderRadius: "10px",
          background: "rgba(102, 126, 234, 0.1)",
          border: "1px solid rgba(102, 126, 234, 0.2)",
          transition: "all 0.2s",
        },
        userMenuDropdown: {
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "10px",
          background: "#1a1a1a",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          width: "220px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          backdropFilter: 'blur(10px)',
        },
        dropdownItem: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          color: "#e0e0e0",
          textDecoration: "none",
          transition: "all 0.2s",
          cursor: "pointer",
          border: "none",
          background: "none",
          width: "100%",
          fontSize: "14px",
        },
        authButtons: {
          display: "flex",
          gap: "8px",
          marginLeft: "10px",
        },
        loginBtn: {
          textDecoration: "none",
          color: "#e0e0e0",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "all 0.2s",
        },
        signupBtn: {
          textDecoration: "none",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          border: "none",
          transition: "all 0.2s",
        },
        themeBtn: {
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          cursor: "pointer",
          color: "#667eea",
          padding: "8px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        },
        mobileMenu: {
          background: "#1a1a1a",
          padding: "20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        },
        mobileLink: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
          color: "#e0e0e0",
          padding: "12px",
          borderRadius: "8px",
          transition: "all 0.2s",
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
          background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : '#ffffff',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
        },
        logoText: {
          fontSize: "1.8rem",
          fontWeight: "800",
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: "-0.5px",
          textDecoration: "none",
          fontFamily: "'Poppins', sans-serif",
        },
        navLink: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          color: "#4a5568",
          fontSize: "14px",
          fontWeight: "500",
          padding: "8px 16px",
          borderRadius: "8px",
          transition: "all 0.2s",
          cursor: "pointer",
        },
        activeLink: {
          background: "rgba(102, 126, 234, 0.1)",
          color: "#667eea",
        },
        searchForm: {
          display: "flex",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.02)",
          borderRadius: "12px",
          padding: "8px 12px",
          margin: "0 10px",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          transition: "all 0.2s",
        },
        searchInput: {
          border: "none",
          background: "transparent",
          padding: "4px 8px",
          width: "220px",
          outline: "none",
          fontSize: "14px",
          color: "#1a202c",
        },
        searchButton: {
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#667eea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        iconLink: {
          position: "relative",
          textDecoration: "none",
          color: "#4a5568",
          padding: "8px",
          borderRadius: "8px",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        badge: {
          position: "absolute",
          top: "0",
          right: "0",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          fontSize: "10px",
          fontWeight: "600",
          minWidth: "18px",
          height: "18px",
          borderRadius: "9px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
        },
        userMenu: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          padding: "6px 12px",
          borderRadius: "10px",
          background: "rgba(102, 126, 234, 0.05)",
          border: "1px solid rgba(102, 126, 234, 0.1)",
          transition: "all 0.2s",
        },
        userMenuDropdown: {
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "10px",
          background: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          borderRadius: "12px",
          width: "220px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        },
        dropdownItem: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          color: "#4a5568",
          textDecoration: "none",
          transition: "all 0.2s",
          cursor: "pointer",
          border: "none",
          background: "none",
          width: "100%",
          fontSize: "14px",
        },
        authButtons: {
          display: "flex",
          gap: "8px",
          marginLeft: "10px",
        },
        loginBtn: {
          textDecoration: "none",
          color: "#4a5568",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "8px",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          transition: "all 0.2s",
        },
        signupBtn: {
          textDecoration: "none",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          border: "none",
          transition: "all 0.2s",
        },
        themeBtn: {
          background: "rgba(0, 0, 0, 0.02)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          cursor: "pointer",
          color: "#667eea",
          padding: "8px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        },
        mobileMenu: {
          background: "#ffffff",
          padding: "20px",
          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
        },
        mobileLink: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
          color: "#4a5568",
          padding: "12px",
          borderRadius: "8px",
          transition: "all 0.2s",
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
    { name: "Products", path: "/products", icon: <Package size={18} /> },
  ];

  return (
    <>
      <nav style={styles.navbar}>
        <div style={containerStyle}>
          {/* Logo with Sparkle */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Sparkles size={24} color="#667eea" />
            <span style={styles.logoText}>ZYPHONE</span>
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

            {/* Notification Bell */}
            <button style={styles.iconLink}>
              <Bell size={20} />
              {notifications > 0 && (
                <span style={styles.badge}>{notifications}</span>
              )}
            </button>

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
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  {user.email?.split('@')[0]}
                </span>
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

                    <Link 
                      to="/settings" 
                      style={styles.dropdownItem}
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    
                    <div style={{ height: '1px', background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', margin: '8px 0' }} />
                    
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
              color: theme === 'dark' ? '#fff' : '#4a5568',
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
                <Search size={16} /> Search
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

                <Link to="/settings" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                  <Settings size={18} />
                  <span>Settings</span>
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
        
        /* Hover Effects */
        a:hover, button:hover {
          transform: translateY(-1px);
        }
        
        /* Transitions */
        * {
          transition: all 0.2s ease;
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
  gap: "8px",
};

const mobileSearchStyle = {
  display: "flex",
  gap: "10px",
  margin: "10px 0",
};

const mobileSearchInputStyle = (theme) => ({
  flex: 1,
  padding: "12px",
  border: theme === 'dark' ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
  borderRadius: "8px",
  outline: "none",
  background: theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
  color: theme === 'dark' ? "#fff" : "#1a202c",
  fontSize: "14px",
});

const mobileSearchButtonStyle = (theme) => ({
  padding: "12px 20px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
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
  border: theme === 'dark' ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
  borderRadius: "8px",
  textDecoration: "none",
  color: theme === 'dark' ? "#fff" : "#4a5568",
  fontSize: "14px",
  fontWeight: "500",
});

const mobileSignupStyle = (theme) => ({
  flex: 1,
  textAlign: "center",
  padding: "12px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "600",
});

export default Navbar;