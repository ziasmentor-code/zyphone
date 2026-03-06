import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authcontext";
import { User, MapPin, Camera, LogOut, Save, ArrowRight, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // File input handle ചെയ്യാൻ

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    profileImg: user?.profileImg || null, // Image state
  });

  if (!user) { navigate("/login"); return null; }

  // --- Image Upload Handler ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, profileImg: base64String });
        // ഉടനടി സേവ് ചെയ്യണമെങ്കിൽ:
        login({ ...user, profileImg: base64String });
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    login({ ...user, ...formData });
    setIsEditing(false);
    toast.success("Profile Updated!");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 mb-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-md relative overflow-hidden">
          
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-36 h-36 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full p-1 shadow-2xl overflow-hidden">
              {formData.profileImg ? (
                <img src={formData.profileImg} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-[#0a0a0b] rounded-full flex items-center justify-center text-5xl font-black text-white uppercase">
                  {user.name[0]}
                </div>
              )}
            </div>
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            
            {/* Upload Button */}
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 bg-white text-black p-2.5 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-[#0a0a0b]"
            >
              <Camera size={18} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              {user.name} <BadgeCheck className="inline text-green-500 ml-2" size={30} />
            </h1>
            <p className="text-gray-400 font-medium">{user.email}</p>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className={`px-8 py-3 rounded-full font-bold transition-all ${isEditing ? 'bg-green-500 text-black' : 'bg-white text-black hover:bg-gray-200'}`}
          >
            {isEditing ? <span className="flex items-center gap-2"><Save size={18}/> SAVE</span> : "EDIT PROFILE"}
          </button>
        </div>

        {/* --- FORM SECTION (Same as before) --- */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 italic">
              <MapPin className="text-green-500" /> SHIPPING HUB
            </h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Username</label>
                  <input 
                    disabled={!isEditing} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-green-500 disabled:opacity-40 transition-all" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Contact Line</label>
                  <input 
                    disabled={!isEditing} 
                    placeholder="Phone Number" 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-green-500 disabled:opacity-40 transition-all" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Global Address</label>
                <textarea 
                  disabled={!isEditing} 
                  placeholder="Address" 
                  rows="4" 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-green-500 disabled:opacity-40 transition-all resize-none" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                />
              </div>
              {isEditing && (
                <button type="submit" className="w-full bg-green-500 text-black py-5 rounded-2xl font-black text-lg shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all">
                  CONFIRM CHANGES
                </button>
              )}
            </form>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-600 to-emerald-900 p-8 rounded-[2.5rem] shadow-xl">
              <h3 className="font-black text-xl mb-3 italic">READY TO ORDER?</h3>
              <p className="text-sm text-white/60 mb-8">Items in cart are ready for dispatch.</p>
              <button 
                onClick={() => navigate("/checkout")} 
                className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:gap-5 transition-all"
              >
                CHECKOUT <ArrowRight size={20} />
              </button>
            </div>
            <button onClick={logout} className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-5 rounded-[2rem] font-black hover:bg-red-500 hover:text-white transition-all">
              LOGOUT ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}