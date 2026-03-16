// components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { CartContext } from "../context/cartcontext";
import { WishlistContext } from "../context/wishlistcontext";
import { Menu, X, User, LogOut, Heart, ShoppingCart, Package, Settings } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlistItems?.length || 0;

  return (
    <>
      <nav style={{
        ...styles.navbar,
        background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : '#ffffff',
        boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={styles.container}>
          
          {/* Logo - Always visible */}
          <Link to="/" style={styles.logo}>
            ZYPHONE
          </Link>

          {/* Desktop Navigation - Only for logged in users */}
          {user && (
            <div style={styles.desktopNav} className="desktop-nav">
              {/* Wishlist */}
              <Link to="/wishlist" style={styles.iconLink}>
                <Heart size={20} color="#4b5563" />
                {wishlistCount > 0 && (
                  <span style={styles.badge}>{wishlistCount}</span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" style={styles.iconLink}>
                <ShoppingCart size={20} color="#4b5563" />
                {cartCount > 0 && (
                  <span style={styles.badge}>{cartCount}</span>
                )}
              </Link>

              {/* User Menu with Dropdown */}
              <div style={styles.userMenuContainer}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={styles.userButton}
                >
                  <User size={20} color="#4b5563" />
                </button>

                {isUserMenuOpen && (
                  <div style={styles.dropdown}>
                    <div style={styles.userInfo}>
                      <strong>{user?.email?.split('@')[0]}</strong>
                      <small>{user?.email}</small>
                    </div>
                    <div style={styles.dropdownDivider} />
                    
                    <Link to="/profile" style={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    
                    <Link to="/my-orders" style={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                      <Package size={16} />
                      <span>My Orders</span>
                    </Link>
                    
                    <Link to="/settings" style={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    
                    <div style={styles.dropdownDivider} />
                    
                    <button onClick={handleLogout} style={styles.dropdownItem}>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button - Only for logged in users */}
          {user && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={styles.menuButton}
              className="mobile-menu-btn"
            >
              {isMenuOpen ? <X size={24} color="#4b5563" /> : <Menu size={24} color="#4b5563" />}
            </button>
          )}
        </div>

        {/* Mobile Menu - Only for logged in users */}
        {user && isMenuOpen && (
          <div style={styles.mobileMenu}>
            {/* User Info in Mobile */}
            <div style={styles.mobileUserInfo}>
              <User size={24} color="#4b5563" />
              <div>
                <strong>{user?.email?.split('@')[0]}</strong>
                <small>{user?.email}</small>
              </div>
            </div>
            
            <div style={styles.mobileDivider} />

            <Link to="/wishlist" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
              <Heart size={18} />
              <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
            </Link>

            <Link to="/cart" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart size={18} />
              <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
            </Link>

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

            <div style={styles.mobileDivider} />

            <button onClick={handleLogout} style={styles.mobileLink}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
      
      {/* Spacer */}
      <div style={{ height: "70px" }} />
    </>
  );
};

// Styles
const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: "all 0.3s ease",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 30px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#111",
    textDecoration: "none",
    letterSpacing: "-0.5px",
  },
  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  iconLink: {
    position: "relative",
    textDecoration: "none",
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: "0",
    right: "0",
    background: "#dc2626",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "600",
    minWidth: "16px",
    height: "16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userMenuContainer: {
    position: "relative",
  },
  userButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    width: "200px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  userInfo: {
    padding: "15px",
    background: "#f9fafb",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 15px",
    color: "#4b5563",
    textDecoration: "none",
    fontSize: "14px",
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "none",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  dropdownDivider: {
    height: "1px",
    background: "#e5e7eb",
    margin: "4px 0",
  },
  menuButton: {
    display: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
  },
  mobileMenu: {
    padding: "20px",
    borderTop: "1px solid #e5e7eb",
    background: "#fff",
  },
  mobileUserInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 0",
    marginBottom: "10px",
  },
  mobileDivider: {
    height: "1px",
    background: "#e5e7eb",
    margin: "10px 0",
  },
  mobileLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    color: "#4b5563",
    textDecoration: "none",
    fontSize: "14px",
    width: "100%",
    border: "none",
    background: "none",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background 0.2s",
  },
};

// Add this to your global CSS file or create a new CSS file
// For now, adding it to the component
const GlobalStyles = () => {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 768px) {
        .desktop-nav {
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
        .desktop-nav {
          display: flex !important;
        }
      }
      
      .dropdown-item:hover,
      .mobile-link:hover {
        background-color: #f3f4f6;
      }
      
      button:hover,
      a:hover {
        opacity: 0.8;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
};

// Wrap your component with GlobalStyles
const NavbarWithStyles = (props) => (
  <>
    <GlobalStyles />
    <Navbar {...props} />
  </>
);

export default NavbarWithStyles;