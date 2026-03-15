// pages/Profile.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authcontext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Mail, Phone, MapPin, Camera, LogOut, Edit2, Save, X,
  Package, Heart, ShoppingBag, Star, Globe, Twitter,
  Instagram, Briefcase, Shield, Calendar, ChevronRight,
  Award, Clock, Truck, CheckCircle
} from "lucide-react";
import toast from "react-hot-toast";

/* ─── Inline keyframes via a style tag ─────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0);     }
    }
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(0,230,118,0.35); }
      70%  { box-shadow: 0 0 0 10px rgba(0,230,118,0);  }
      100% { box-shadow: 0 0 0 0 rgba(0,230,118,0);     }
    }

    .pf-fade { animation: fadeUp 0.45s ease both; }
    .pf-fade-1 { animation-delay: 0.05s; }
    .pf-fade-2 { animation-delay: 0.12s; }
    .pf-fade-3 { animation-delay: 0.20s; }
    .pf-fade-4 { animation-delay: 0.28s; }
    .pf-fade-5 { animation-delay: 0.36s; }

    .stat-card:hover { background: #21252b !important; transform: translateY(-2px); }
    .stat-card { transition: all 0.2s ease; cursor: pointer; }

    .tab-btn { transition: all 0.2s ease; }
    .tab-btn:hover { color: #fff !important; }

    .edit-btn-main:hover { background: rgba(0,230,118,0.12) !important; border-color: #00e676 !important; }
    .edit-btn-main { transition: all 0.2s; }

    .social-chip:hover { background: rgba(0,230,118,0.08) !important; border-color: rgba(0,230,118,0.3) !important; color: #00e676 !important; }
    .social-chip { transition: all 0.18s; }

    .info-row:hover { background: #21252b !important; }
    .info-row { transition: background 0.15s; }

    .logout-btn:hover { background: rgba(255,68,68,0.15) !important; }
    .logout-btn { transition: background 0.2s; }

    .cam-label:hover { background: #00b356 !important; }
    .cam-label { transition: background 0.15s; }

    input[class="pf-input"], textarea[class="pf-input"] {
      background: #1e2126;
      border: 1px solid #2e3238;
      color: #e8eaed;
      padding: 11px 14px;
      border-radius: 10px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      width: 100%;
    }
    input[class="pf-input"]:focus, textarea[class="pf-input"]:focus {
      border-color: #00e676;
    }
    textarea[class="pf-input"] { resize: vertical; min-height: 80px; }
  `}</style>
);

/* ─── Tier helper ───────────────────────────────────────────────── */
const getTier = (spent) => {
  if (spent > 500000) return { name: 'Platinum', color: '#c0c8d8', bg: 'rgba(192,200,216,0.10)' };
  if (spent > 200000) return { name: 'Gold',     color: '#fbbf24', bg: 'rgba(251,191,36,0.10)' };
  if (spent > 50000)  return { name: 'Silver',   color: '#94a3b8', bg: 'rgba(148,163,184,0.10)' };
  return                      { name: 'Member',  color: '#00e676', bg: 'rgba(0,230,118,0.10)' };
};

/* ─── Status helper ─────────────────────────────────────────────── */
const getStatusStyle = (status) => {
  switch(status?.toLowerCase()) {
    case 'delivered': return { color: '#00e676', bg: 'rgba(0,230,118,0.08)', icon: <CheckCircle size={12} /> };
    case 'shipped':   return { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', icon: <Truck size={12} /> };
    case 'pending':   return { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: <Clock size={12} /> };
    case 'confirmed': return { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', icon: <CheckCircle size={12} /> };
    default:          return { color: '#6b7280', bg: 'rgba(107,114,128,0.08)', icon: <Package size={12} /> };
  }
};

/* ─── Component ─────────────────────────────────────────────────── */
const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile,   setProfile]   = useState(null);
  const [orders,    setOrders]    = useState([]);
  const [wishlist,  setWishlist]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [editing,   setEditing]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [stats, setStats] = useState({
    orders: 0, wishlist: 0, spent: 0, reviews: 0, memberSince: ''
  });

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone: '', address: '',
    city: '', state: '', pincode: '', bio: '',
    occupation: '', website: '', twitter: '', instagram: ''
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchProfile();
    fetchOrders();
    fetchWishlist();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("users/profile/");
      setProfile(data);
      setFormData({
        first_name: data.first_name || '', last_name: data.last_name || '',
        phone: data.phone || '', address: data.address || '',
        city: data.city || '', state: data.state || '',
        pincode: data.pincode || '', bio: data.bio || '',
        occupation: data.occupation || '', website: data.website || '',
        twitter: data.twitter || '', instagram: data.instagram || ''
      });
      if (data.date_joined) {
        setStats(p => ({
          ...p,
          memberSince: new Date(data.date_joined).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        }));
      }
    } catch { toast.error("Failed to load profile"); }
    finally   { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("orders/");
      setOrders(data);
      const spent = data.reduce((s, o) => s + Number(o.total_price || 0), 0);
      setStats(p => ({ ...p, orders: data.length, spent }));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get("wishlist/");
      setWishlist(data);
      setStats(p => ({ ...p, wishlist: data.length }));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("users/profile/update/", formData);
      toast.success("Profile updated!");
      setEditing(false);
      fetchProfile();
    } catch { toast.error("Update failed"); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Max 2MB"); return; }
    const fd = new FormData(); fd.append('image', file);
    setUploading(true);
    try {
      await api.post("users/profile/image/", fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Photo updated!");
      fetchProfile();
    } catch { toast.error("Upload failed"); }
    finally  { setUploading(false); }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const getInitials = () => {
    const f = profile?.first_name?.[0] || '';
    const l = profile?.last_name?.[0]  || '';
    return (f + l).toUpperCase() || user?.email?.[0].toUpperCase() || 'U';
  };

  const fullName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : 'Your Name';

  const fullAddress = [
    profile?.address, profile?.city,
    profile?.state, profile?.pincode ? `– ${profile.pincode}` : ''
  ].filter(Boolean).join(', ');

  const tier = getTier(stats.spent);

  /* ── Loading ── */
  if (loading) return (
    <div style={{ height:'100vh', background:'#0d0f12', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:40, height:40, border:'2.5px solid #1e2126', borderTopColor:'#00e676', borderRadius:'50%', animation:'spin 0.9s linear infinite' }} />
    </div>
  );

  /* ── Render ── */
  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight:'100vh', background:'#0d0f12', fontFamily:"'Inter', sans-serif", padding:'32px 20px 60px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>

          {/* ── Card ── */}
          <div className="pf-fade" style={{ background:'#161a1f', borderRadius:20, border:'1px solid #1e2329', overflow:'hidden' }}>

            {/* Banner */}
            <div style={{ height:170, position:'relative', overflow:'hidden', background:'#0d0f12' }}>
              <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00e676" stopOpacity="0.06"/>
                    <stop offset="100%" stopColor="#00e676" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#lg1)"/>
                <line x1="0" y1="170" x2="340" y2="0"  stroke="#00e676" strokeOpacity="0.06" strokeWidth="1"/>
                <line x1="100" y1="170" x2="500" y2="0" stroke="#00e676" strokeOpacity="0.04" strokeWidth="1"/>
                <line x1="220" y1="170" x2="700" y2="0" stroke="#00e676" strokeOpacity="0.03" strokeWidth="1"/>
              </svg>
              <svg style={{ position:'absolute', top:16, right:20, opacity:0.18 }} width="90" height="60">
                {[0,1,2,3,4].map(row => [0,1,2,3,4,5].map(col => (
                  <circle key={`${row}-${col}`} cx={col*16} cy={row*14} r="1.5" fill="#00e676"/>
                )))}
              </svg>
            </div>

            {/* Header */}
            <div className="pf-fade pf-fade-1" style={{ padding:'0 32px 28px', display:'flex', alignItems:'flex-end', gap:20, marginTop:-60, flexWrap:'wrap' }}>
              {/* Avatar */}
              <div style={{ position:'relative', flexShrink:0 }}>
                {profile?.profile_image ? (
                  <img
                    src={profile.profile_image.startsWith('http') ? profile.profile_image : `http://127.0.0.1:8000${profile.profile_image}`}
                    alt="avatar"
                    style={{ width:112, height:112, borderRadius:16, objectFit:'cover', border:'4px solid #161a1f', display:'block' }}
                  />
                ) : (
                  <div style={{
                    width:112, height:112, borderRadius:16,
                    background:'#1e2126', border:'4px solid #161a1f',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:38, fontWeight:700, color:'#00e676',
                    fontFamily:"'Syne', sans-serif", letterSpacing:-1
                  }}>
                    {getInitials()}
                  </div>
                )}
                <label className="cam-label" style={{
                  position:'absolute', bottom:-6, right:-6,
                  background:'#00e676', width:32, height:32, borderRadius:9,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', border:'3px solid #161a1f'
                }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display:'none' }} disabled={uploading}/>
                  {uploading
                    ? <div style={{ width:14, height:14, border:'2px solid #000', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                    : <Camera size={14} color="#000"/>
                  }
                </label>
              </div>

              {/* Name block */}
              <div style={{ flex:1, paddingBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:4 }}>
                  <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:26, fontWeight:700, color:'#f0f2f5', letterSpacing:-0.5, margin:0 }}>
                    {fullName}
                  </h1>
                  <span style={{
                    fontSize:11, fontWeight:500, padding:'3px 10px', borderRadius:20,
                    border:`1px solid ${tier.color}`, color:tier.color, background:tier.bg,
                    letterSpacing:0.4
                  }}>
                    <Award size={10} style={{ marginRight:4, verticalAlign:'middle' }}/>{tier.name}
                  </span>
                </div>
                <p style={{ color:'#5a6070', fontSize:13, marginBottom:10 }}>{user?.email}</p>
                {profile?.bio && (
                  <p style={{ color:'#7a8494', fontSize:13, lineHeight:1.65, maxWidth:460, marginBottom:10 }}>
                    {profile.bio}
                  </p>
                )}
                {/* Social chips */}
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {profile?.website && (
                    <a className="social-chip" href={profile.website} target="_blank" rel="noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, padding:'4px 10px',
                        borderRadius:8, border:'1px solid #2a2f38', color:'#7a8494',
                        textDecoration:'none', background:'transparent' }}>
                      <Globe size={12}/> Website
                    </a>
                  )}
                  {profile?.twitter && (
                    <a className="social-chip" href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, padding:'4px 10px',
                        borderRadius:8, border:'1px solid #2a2f38', color:'#7a8494',
                        textDecoration:'none', background:'transparent' }}>
                      <Twitter size={12}/> @{profile.twitter}
                    </a>
                  )}
                  {profile?.instagram && (
                    <a className="social-chip" href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, padding:'4px 10px',
                        borderRadius:8, border:'1px solid #2a2f38', color:'#7a8494',
                        textDecoration:'none', background:'transparent' }}>
                      <Instagram size={12}/> {profile.instagram}
                    </a>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              {!editing && (
                <div style={{ display:'flex', flexDirection:'column', gap:8, paddingBottom:6 }}>
                  <button className="edit-btn-main" onClick={() => setEditing(true)}
                    style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 18px',
                      background:'transparent', border:'1px solid #2e3338', color:'#c0c8d8',
                      borderRadius:10, fontSize:13, fontWeight:500, cursor:'pointer',
                      fontFamily:"'Inter', sans-serif" }}>
                    <Edit2 size={14}/> Edit profile
                  </button>
                  <button className="logout-btn" onClick={handleLogout}
                    style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 18px',
                      background:'rgba(255,68,68,0.07)', border:'1px solid rgba(255,68,68,0.2)',
                      color:'#ff6b6b', borderRadius:10, fontSize:13, fontWeight:500,
                      cursor:'pointer', fontFamily:"'Inter', sans-serif" }}>
                    <LogOut size={14}/> Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height:1, background:'#1e2329', margin:'0 32px' }}/>

            {/* Stats row */}
            <div className="pf-fade pf-fade-2" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', padding:'20px 32px', gap:12 }}>
              {[
                { label:'Orders',      val: stats.orders,                          icon:<Package size={16}/>,     link:'/my-orders' },
                { label:'Wishlist',    val: stats.wishlist,                        icon:<Heart size={16}/>,       link:'/wishlist'  },
                { label:'Total spent', val:`₹${stats.spent.toLocaleString('en-IN')}`, icon:<ShoppingBag size={16}/> },
                { label:'Reviews',     val: stats.reviews,                         icon:<Star size={16}/>         },
              ].map((s, i) => (
                <div key={i} className="stat-card"
                  onClick={() => s.link && navigate(s.link)}
                  style={{ background:'#1a1e24', borderRadius:12, padding:'14px 16px',
                    border:'1px solid #1e2329', cursor: s.link ? 'pointer' : 'default',
                    display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ color:'#00e676', opacity:0.8 }}>{s.icon}</div>
                  <div>
                    <p style={{ fontFamily:"'Syne', sans-serif", fontSize:20, fontWeight:700, color:'#e8eaed', margin:0, lineHeight:1 }}>{s.val}</p>
                    <p style={{ fontSize:11, color:'#4a5568', margin:'4px 0 0', letterSpacing:0.4, textTransform:'uppercase' }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Meta bar */}
            <div className="pf-fade pf-fade-3" style={{ display:'flex', gap:20, padding:'0 32px 16px', flexWrap:'wrap' }}>
              {[
                { icon:<Calendar size={12}/>, text:`Member since ${stats.memberSince || '–'}` },
                { icon:<div style={{ width:7, height:7, borderRadius:'50%', background:'#00e676', animation:'pulse-ring 2s ease-out infinite' }}/>, text:'Active now' },
                { icon:<Shield size={12}/>, text:'Verified account' },
              ].map((m, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#4a5568' }}>
                  <span style={{ color:'#3a4252' }}>{m.icon}</span>{m.text}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height:1, background:'#1e2329' }}/>

            {/* Tabs */}
            <div className="pf-fade pf-fade-4" style={{ display:'flex', gap:0, padding:'0 32px', borderBottom:'1px solid #1e2329' }}>
              {['profile','orders','wishlist'].map(tab => (
                <button key={tab} className="tab-btn"
                  onClick={() => setActiveTab(tab)}
                  style={{ padding:'14px 18px', background:'none', border:'none',
                    borderBottom: activeTab === tab ? '2px solid #00e676' : '2px solid transparent',
                    color: activeTab === tab ? '#00e676' : '#4a5568',
                    fontSize:13, fontWeight:500, cursor:'pointer',
                    fontFamily:"'Inter', sans-serif", textTransform:'capitalize',
                    marginBottom:-1 }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="pf-fade pf-fade-5" style={{ padding:'28px 32px 32px' }}>

              {/* ── Profile tab ── */}
              {activeTab === 'profile' && !editing && (
                <div>
                  <p style={{ fontSize:10, fontWeight:600, letterSpacing:1.2, color:'#3a4252', textTransform:'uppercase', marginBottom:14 }}>
                    Personal information
                  </p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:20 }}>
                    {[
                      { icon:<Mail size={14}/>,     label:'Email',      val: user?.email },
                      { icon:<Phone size={14}/>,    label:'Phone',      val: profile?.phone      || 'Not provided' },
                      { icon:<Briefcase size={14}/>,label:'Occupation', val: profile?.occupation || 'Not provided' },
                    ].map((d,i) => (
                      <div key={i} className="info-row" style={{ display:'flex', alignItems:'center', gap:12,
                        background:'#1a1e24', borderRadius:10, padding:'12px 14px',
                        border:'1px solid #1e2329' }}>
                        <span style={{ color:'#3a4252', flexShrink:0 }}>{d.icon}</span>
                        <div>
                          <p style={{ fontSize:9, letterSpacing:0.8, textTransform:'uppercase', color:'#3a4252', margin:'0 0 2px' }}>{d.label}</p>
                          <p style={{ fontSize:13, color:'#c0c8d8', margin:0 }}>{d.val}</p>
                        </div>
                      </div>
                    ))}

                    <div className="info-row" style={{ display:'flex', alignItems:'center', gap:12,
                      background:'#1a1e24', borderRadius:10, padding:'12px 14px',
                      border:'1px solid #1e2329', gridColumn:'span 1' }}>
                      <span style={{ color:'#3a4252', flexShrink:0 }}><MapPin size={14}/></span>
                      <div>
                        <p style={{ fontSize:9, letterSpacing:0.8, textTransform:'uppercase', color:'#3a4252', margin:'0 0 2px' }}>Address</p>
                        <p style={{ fontSize:13, color:'#c0c8d8', margin:0, lineHeight:1.5 }}>
                          {fullAddress || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Edit form ── */}
              {activeTab === 'profile' && editing && (
                <form onSubmit={handleSubmit}>
                  <p style={{ fontSize:10, fontWeight:600, letterSpacing:1.2, color:'#3a4252', textTransform:'uppercase', marginBottom:16 }}>
                    Edit profile
                  </p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:16 }}>
                    {[
                      { name:'first_name', placeholder:'First name' },
                      { name:'last_name',  placeholder:'Last name'  },
                      { name:'phone',      placeholder:'Phone number' },
                      { name:'occupation', placeholder:'Occupation'  },
                      { name:'website',    placeholder:'Website URL' },
                      { name:'twitter',    placeholder:'Twitter username' },
                      { name:'instagram',  placeholder:'Instagram username' },
                    ].map(f => (
                      <input key={f.name} className="pf-input" name={f.name}
                        value={formData[f.name]} onChange={handleInput}
                        placeholder={f.placeholder}
                        style={{ gridColumn: f.name === 'website' ? 'span 2' : undefined }}
                      />
                    ))}
                    <textarea className="pf-input" name="bio" value={formData.bio}
                      onChange={handleInput} placeholder="Bio"
                      style={{ gridColumn:'span 2' }}/>
                    <input className="pf-input" name="address" value={formData.address}
                      onChange={handleInput} placeholder="Street address"
                      style={{ gridColumn:'span 2' }}/>
                    <input className="pf-input" name="city"    value={formData.city}    onChange={handleInput} placeholder="City"   />
                    <input className="pf-input" name="state"   value={formData.state}   onChange={handleInput} placeholder="State"  />
                    <input className="pf-input" name="pincode" value={formData.pincode} onChange={handleInput} placeholder="Pincode"/>
                  </div>
                  <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                    <button type="button" onClick={() => setEditing(false)}
                      style={{ padding:'9px 20px', background:'transparent', border:'1px solid #2e3338',
                        color:'#7a8494', borderRadius:10, fontSize:13, cursor:'pointer',
                        fontFamily:"'Inter', sans-serif", display:'flex', alignItems:'center', gap:6 }}>
                      <X size={14}/> Cancel
                    </button>
                    <button type="submit"
                      style={{ padding:'9px 22px', background:'#00e676', border:'none',
                        color:'#000', borderRadius:10, fontSize:13, fontWeight:600,
                        cursor:'pointer', fontFamily:"'Inter', sans-serif",
                        display:'flex', alignItems:'center', gap:6 }}>
                      <Save size={14}/> Save changes
                    </button>
                  </div>
                </form>
              )}

              {/* ── Orders tab with REAL data ── */}
              {activeTab === 'orders' && (
                <div>
                  <p style={{ fontSize:10, fontWeight:600, letterSpacing:1.2, color:'#3a4252', textTransform:'uppercase', marginBottom:14 }}>
                    Recent orders ({orders.length})
                  </p>
                  {orders.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'40px 20px', background:'#1a1e24', borderRadius:12 }}>
                      <Package size={40} color="#3a4252" />
                      <p style={{ color:'#5a6070', marginTop:10 }}>No orders yet</p>
                      <button onClick={() => navigate('/products')}
                        style={{ marginTop:15, padding:'8px 20px', background:'#00e676',
                          border:'none', borderRadius:8, color:'#000', fontSize:13, cursor:'pointer' }}>
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      {orders.slice(0, 5).map((order) => {
                        const statusStyle = getStatusStyle(order.status);
                        const date = order.created_at 
                          ? new Date(order.created_at).toLocaleDateString('en-IN', { 
                              day:'numeric', month:'short', year:'numeric' 
                            })
                          : 'N/A';
                        
                        return (
                          <div key={order.id} className="info-row" 
                            onClick={() => navigate(`/order/${order.id}`)}
                            style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                              background:'#1a1e24', border:'1px solid #1e2329', borderRadius:10, 
                              padding:'14px 16px', cursor:'pointer' }}>
                            <div>
                              <p style={{ fontSize:12, color:'#3a4252', letterSpacing:0.3, margin:'0 0 3px' }}>
                                #{order.id}
                              </p>
                              <p style={{ fontSize:14, color:'#c0c8d8', margin:0 }}>
                                {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''} · {date}
                              </p>
                            </div>
                            <div style={{ textAlign:'right', display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                              <p style={{ fontFamily:"'Syne', sans-serif", fontSize:15, fontWeight:600, color:'#e8eaed', margin:0 }}>
                                ₹{Number(order.total_price || 0).toLocaleString('en-IN')}
                              </p>
                              <span style={{ 
                                fontSize:11, padding:'2px 9px', borderRadius:20, 
                                color: statusStyle.color, background: statusStyle.bg, 
                                border:`1px solid ${statusStyle.color}33`,
                                display:'flex', alignItems:'center', gap:4
                              }}>
                                {statusStyle.icon} {order.status || 'Pending'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {orders.length > 5 && (
                        <button onClick={() => navigate('/my-orders')}
                          style={{ marginTop:5, padding:'10px', background:'transparent',
                            border:'1px solid #2e3338', borderRadius:8, color:'#7a8494',
                            fontSize:12, cursor:'pointer', display:'flex', alignItems:'center',
                            justifyContent:'center', gap:5 }}>
                          View all {orders.length} orders <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Wishlist tab ── */}
              {activeTab === 'wishlist' && (
                <div>
                  <p style={{ fontSize:10, fontWeight:600, letterSpacing:1.2, color:'#3a4252', textTransform:'uppercase', marginBottom:14 }}>
                    Saved items ({wishlist.length})
                  </p>
                  {wishlist.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'40px 20px', background:'#1a1e24', borderRadius:12 }}>
                      <Heart size={40} color="#3a4252" />
                      <p style={{ color:'#5a6070', marginTop:10 }}>Your wishlist is empty</p>
                      <button onClick={() => navigate('/products')}
                        style={{ marginTop:15, padding:'8px 20px', background:'#00e676',
                          border:'none', borderRadius:8, color:'#000', fontSize:13, cursor:'pointer' }}>
                        Explore Products
                      </button>
                    </div>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:10 }}>
                      {wishlist.map((item) => (
                        <div key={item.id} className="info-row stat-card" 
                          onClick={() => navigate(`/product/${item.id}`)}
                          style={{ background:'#1a1e24', border:'1px solid #1e2329',
                            borderRadius:12, padding:14, cursor:'pointer', display:'flex', flexDirection:'column', gap:8 }}>
                          <div style={{ fontSize:28, height:60, display:'flex', alignItems:'center', justifyContent:'center',
                            background:'#12151a', borderRadius:8 }}>
                            {item.image ? '🖼️' : '📦'}
                          </div>
                          <p style={{ fontSize:13, color:'#7a8494', margin:0, lineHeight:1.4 }}>{item.name}</p>
                          <p style={{ fontFamily:"'Syne', sans-serif", fontSize:15, fontWeight:600, color:'#e8eaed', margin:0 }}>
                            ₹{Number(item.price || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;