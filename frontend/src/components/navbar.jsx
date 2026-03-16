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
        boxShadow: isScrolled ? '0 2px 15px rgba(0,0,0,0.08)' : 'none',
        borderBottom: isScrolled ? 'none' : '1px solid #f0f0f0'
      }}>
        <div style={styles.container}>
          
          {/* Logo Section */}
          <Link to="/" style={styles.logoContainer}>
            <img 
              src="/logo.png" 
              alt="ZYPHONE" 
              style={styles.logoImage}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span style={styles.logoTextAlt}>ZYPHONE</span>
          </Link>

          {/* Desktop Navigation */}
          <div style={styles.desktopNav} className="desktop-nav">
            {user ? (
              <>
                <Link to="/wishlist" style={styles.iconLink}>
                  <Heart size={22} color="#111" />
                  {wishlistCount > 0 && <span style={styles.badge}>{wishlistCount}</span>}
                </Link>

                <Link to="/cart" style={styles.iconLink}>
                  <ShoppingCart size={22} color="#111" />
                  {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
                </Link>

                <div style={styles.userMenuContainer}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    style={styles.userButton}
                  >
                    <div style={styles.avatar}>
                      <User size={18} color="#fff" />
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div style={styles.dropdown}>
                      <div style={styles.userInfo}>
                        <p style={styles.userName}>{user?.email?.split('@')[0]}</p>
                        <p style={styles.userEmail}>{user?.email}</p>
                      </div>
                      <div style={styles.dropdownDivider} />
                      <Link to="/profile" style={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                        <User size={16} /> Profile
                      </Link>
                      <Link to="/my-orders" style={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                        <Package size={16} /> My Orders
                      </Link>
                      <div style={styles.dropdownDivider} />
                      <button onClick={handleLogout} style={{...styles.dropdownItem, color: '#dc2626'}}>
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={styles.authLinks}>
                <Link to="/login" style={styles.loginLink}>Login</Link>
                <Link to="/signup" style={styles.registerBtn}>Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={styles.menuButton}
            className="mobile-menu-btn"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={styles.mobileMenu}>
            {user ? (
              <>
                <Link to="/wishlist" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                  <Heart size={20} /> Wishlist ({wishlistCount})
                </Link>
                <Link to="/cart" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                  <ShoppingCart size={20} /> Cart ({cartCount})
                </Link>
                <div style={styles.mobileDivider} />
                <Link to="/profile" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                  <User size={20} /> Profile
                </Link>
                <button onClick={handleLogout} style={{...styles.mobileLink, color: '#dc2626'}}>
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <div style={styles.mobileAuthContainer}>
                <Link to="/login" style={styles.mobileAuthLink} onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" style={styles.mobileRegisterBtn} onClick={() => setIsMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>
      <div style={{ height: "70px" }} />
    </>
  );
};

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
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "0 20px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  logoImage: {
    height: "32px",
    width: "auto",
  },
  logoTextAlt: {
    display: "none",
    fontSize: "1.4rem",
    fontWeight: "800",
    color: "#000",
  },
  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  authLinks: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  loginLink: {
    textDecoration: "none",
    color: "#111",
    fontSize: "14px",
    fontWeight: "600",
  },
  registerBtn: {
    textDecoration: "none",
    background: "#000",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "600",
  },
  iconLink: {
    position: "relative",
    padding: "8px",
  },
  badge: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    background: "#000",
    color: "#fff",
    fontSize: "10px",
    minWidth: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
  },
  userMenuContainer: {
    position: "relative",
  },
  userButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    position: "absolute",
    top: "120%",
    right: 0,
    background: "#fff",
    borderRadius: "12px",
    width: "220px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    border: "1px solid #f0f0f0",
    overflow: "hidden",
  },
  userInfo: {
    padding: "15px",
    background: "#f9fafb",
  },
  userName: {
    margin: 0,
    fontWeight: "600",
    fontSize: "14px",
  },
  userEmail: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 15px",
    color: "#374151",
    textDecoration: "none",
    fontSize: "14px",
    width: "100%",
    border: "none",
    background: "none",
    textAlign: "left",
    cursor: "pointer",
  },
  dropdownDivider: {
    height: "1px",
    background: "#f0f0f0",
  },
  menuButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "none",
  },
  mobileMenu: {
    position: "absolute",
    top: "70px",
    left: 0,
    right: 0,
    background: "#fff",
    padding: "10px 20px 30px",
    display: "flex",
    flexDirection: "column",
  },
  mobileLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    textDecoration: "none",
    color: "#111",
    fontSize: "15px",
  },
  mobileAuthContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px 0",
  },
  mobileAuthLink: {
    textAlign: "center",
    padding: "12px",
    textDecoration: "none",
    color: "#111",
    fontWeight: "600",
    border: "1px solid #eee",
    borderRadius: "8px",
  },
  mobileRegisterBtn: {
    textAlign: "center",
    padding: "12px",
    textDecoration: "none",
    background: "#000",
    color: "#fff",
    fontWeight: "600",
    borderRadius: "8px",
  },
  mobileDivider: {
    height: "1px",
    background: "#f0f0f0",
    margin: "10px 0",
  }
};

export default Navbar;