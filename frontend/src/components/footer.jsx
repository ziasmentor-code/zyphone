// components/Footer.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Mail, MapPin, Phone, ArrowRight, 
  Heart, Shield, Truck, CreditCard,
  Instagram, Facebook, Twitter, Youtube
} from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/subscribe/", { email });
      toast.success("Subscribed successfully! 🎉");
      setEmail("");
    } catch (err) {
      toast.error("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: '#f5f5f7',
      padding: '60px 20px 30px',
      borderTop: '1px solid #e8e6df',
      fontFamily: "'DM Sans', sans-serif",
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Top Section: Brand & Newsletter */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand */}
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#000',
              marginBottom: '15px',
              fontFamily: "'Fraunces', serif"
            }}>
              Zyphone
            </h2>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
              maxWidth: '400px'
            }}>
              Experience the future of technology with our premium devices. 
              Innovation meets elegance.
            </p>
            <div style={{
              display: 'flex',
              gap: '15px',
              marginTop: '25px'
            }}>
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e8e6df',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <Icon size={18} color="#000" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid #e8e6df'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <Mail size={20} color="#dc2626" />
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#666'
              }}>
                Stay Updated
              </h4>
            </div>
            <p style={{
              color: '#666',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              Subscribe to get updates on new launches and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px 50px 15px 20px',
                  borderRadius: '30px',
                  border: '1px solid #e8e6df',
                  outline: 'none',
                  fontSize: '14px',
                  backgroundColor: '#faf9f6'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '5px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
          marginBottom: '50px'
        }}>
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹1000' },
            { icon: Shield, title: '1 Year Warranty', desc: 'Official warranty' },
            { icon: CreditCard, title: 'Secure Payment', desc: '100% secure' },
            { icon: Heart, title: 'Premium Support', desc: '24/7 assistance' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e8e6df',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <item.icon size={28} color="#dc2626" />
              <div>
                <p style={{ fontWeight: '600', color: '#000', marginBottom: '4px' }}>{item.title}</p>
                <p style={{ fontSize: '12px', color: '#666' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {/* Shop */}
          <div>
            <h5 style={{
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '20px'
            }}>
              Shop
            </h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { label: 'Smartphones', path: '/products?category=phone' },
                { label: 'Audio & Buds', path: '/products?category=headset' },
                { label: 'Wearables', path: '/products?category=watch' },
                { label: 'All Devices', path: '/products' }
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: 0,
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 style={{
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '20px'
            }}>
              Support
            </h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { label: 'Order Tracking', path: '/my-orders' },
                { label: 'My Account', path: '/profile' },
                { label: 'Warranty Info' },
                { label: 'FAQs' }
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <button
                    onClick={() => item.path && handleNavigation(item.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: 0,
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 style={{
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '20px'
            }}>
              Company
            </h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['About Us', 'Careers', 'Press', 'Blog'].map((item, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <span style={{
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 style={{
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '20px'
            }}>
              Contact
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="#dc2626" />
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Kochi, Kerala 682030
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#dc2626" />
                <span style={{ color: '#666', fontSize: '14px' }}>
                  +91 98765 43210
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#dc2626" />
                <span style={{ color: '#666', fontSize: '14px' }}>
                  support@zyphone.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '30px',
          borderTop: '1px solid #e8e6df',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <p style={{ color: '#999', fontSize: '12px' }}>
            © {new Date().getFullYear()} Zyphone Industries. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item, index) => (
              <span
                key={index}
                style={{
                  color: '#999',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;