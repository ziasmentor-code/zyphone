// pages/Profile.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  LogOut, 
  Edit2, 
  Save, 
  X,
  Package,
  Heart,
  ShoppingBag,
  Calendar,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, orders, wishlist
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    spent: 0
  });
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bio: ''
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchStats();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("users/profile/");
      setProfile(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        city: response.data.city || '',
        state: response.data.state || '',
        pincode: response.data.pincode || '',
        bio: response.data.bio || ''
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const ordersRes = await api.get("orders/");
      const wishlistRes = await api.get("wishlist/");
      
      const totalSpent = ordersRes.data.reduce((sum, order) => 
        sum + Number(order.total_price || 0), 0
      );
      
      setStats({
        orders: ordersRes.data.length,
        wishlist: wishlistRes.data.length,
        spent: totalSpent
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("users/profile/update/", formData);
      toast.success("Profile updated successfully");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await api.post("users/profile/image/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Profile picture updated");
      fetchProfile();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Cover Photo */}
      <div style={styles.coverPhoto}>
        <div style={styles.coverOverlay}></div>
      </div>

      {/* Profile Content */}
      <div style={styles.content}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarContainer}>
            {profile?.profile_image ? (
              <img 
                src={profile.profile_image} 
                alt="Profile" 
                style={styles.avatar}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {getInitials()}
              </div>
            )}
            
            <label style={styles.cameraButton}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={styles.fileInput}
                disabled={uploading}
              />
              {uploading ? (
                <div style={styles.cameraSpinner}></div>
              ) : (
                <Camera size={16} />
              )}
            </label>
          </div>

          <div style={styles.profileInfo}>
            <h1 style={styles.name}>
              {profile?.first_name || profile?.last_name 
                ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                : 'Your Name'}
            </h1>
            <p style={styles.email}>{user?.email}</p>
            {profile?.bio && <p style={styles.bio}>{profile.bio}</p>}
          </div>

          {!editing && (
            <button 
              onClick={() => setEditing(true)}
              style={styles.editButton}
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard} onClick={() => navigate('/my-orders')}>
            <div style={styles.statIcon}><Package size={20} /></div>
            <div>
              <p style={styles.statValue}>{stats.orders}</p>
              <p style={styles.statLabel}>Orders</p>
            </div>
          </div>
          <div style={styles.statCard} onClick={() => navigate('/wishlist')}>
            <div style={styles.statIcon}><Heart size={20} /></div>
            <div>
              <p style={styles.statValue}>{stats.wishlist}</p>
              <p style={styles.statLabel}>Wishlist</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><ShoppingBag size={20} /></div>
            <div>
              <p style={styles.statValue}>₹{stats.spent.toLocaleString('en-IN')}</p>
              <p style={styles.statLabel}>Total Spent</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><Calendar size={20} /></div>
            <div>
              <p style={styles.statValue}>
                {profile?.date_joined 
                  ? new Date(profile.date_joined).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                  : 'N/A'}
              </p>
              <p style={styles.statLabel}>Joined</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'profile' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('profile')}
          >
            Profile Details
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'orders' ? styles.tabActive : {})
            }}
            onClick={() => navigate('/my-orders')}
          >
            Order History
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'wishlist' ? styles.tabActive : {})
            }}
            onClick={() => navigate('/wishlist')}
          >
            Wishlist
          </button>
        </div>

        {/* Profile Details */}
        {!editing ? (
          <div style={styles.detailsCard}>
            <div style={styles.detailSection}>
              <h3 style={styles.sectionTitle}>Personal Information</h3>
              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <Mail size={18} color="#666" />
                  <div>
                    <p style={styles.detailLabel}>Email</p>
                    <p style={styles.detailValue}>{user?.email}</p>
                  </div>
                </div>
                <div style={styles.detailItem}>
                  <Phone size={18} color="#666" />
                  <div>
                    <p style={styles.detailLabel}>Phone</p>
                    <p style={styles.detailValue}>{profile?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.detailSection}>
              <h3 style={styles.sectionTitle}>Address</h3>
              <div style={styles.detailItem}>
                <MapPin size={18} color="#666" />
                <div>
                  <p style={styles.detailValue}>
                    {profile?.address 
                      ? `${profile.address}${profile.city ? ', ' + profile.city : ''}${profile.state ? ', ' + profile.state : ''}${profile.pincode ? ' - ' + profile.pincode : ''}`
                      : 'No address provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.editForm}>
            <h3 style={styles.sectionTitle}>Edit Profile</h3>
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter first name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter last name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter phone number"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Tell us about yourself"
                  rows="3"
                />
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.formLabel}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Street address"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="City"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="State"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Pincode"
                />
              </div>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveButton}>
                <Save size={16} />
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setEditing(false)}
                style={styles.cancelButton}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Logout Button */}
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  coverPhoto: {
    height: '200px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative'
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.2)'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px 40px',
    position: 'relative',
    marginTop: '-80px'
  },
  profileHeader: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    marginBottom: '30px',
    position: 'relative'
  },
  avatarContainer: {
    position: 'relative'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  avatarPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: '600',
    border: '4px solid white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  cameraButton: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid white',
    transition: 'all 0.2s'
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer'
  },
  cameraSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid white',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  profileInfo: {
    flex: 1
  },
  name: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#111',
    margin: '0 0 5px'
  },
  email: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 5px'
  },
  bio: {
    fontSize: '14px',
    color: '#888',
    margin: '5px 0 0',
    lineHeight: '1.5'
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3b82f6'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111',
    margin: '0 0 5px'
  },
  statLabel: {
    fontSize: '13px',
    color: '#666',
    margin: 0
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '10px'
  },
  tab: {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#666',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabActive: {
    background: '#eff6ff',
    color: '#3b82f6'
  },
  detailsCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '20px'
  },
  detailSection: {
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111',
    margin: '0 0 20px'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '15px',
    background: '#f9fafb',
    borderRadius: '8px'
  },
  detailLabel: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 4px'
  },
  detailValue: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#111',
    margin: 0,
    lineHeight: '1.5'
  },
  editForm: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '20px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '30px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  formGroupFull: {
    gridColumn: 'span 2',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  formLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: 'vertical'
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end'
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#f3f4f6',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  logoutButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '15px',
    background: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#f8fafc'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f4f6',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  }
};

export default Profile;