import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authcontext";
import { User, MapPin, Phone, Mail, Camera, LogOut, Save, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Edit cheyyaanulla state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    login({ ...user, ...formData }); // Context-ilum LocalStorage-ilum update aakum
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-28 pb-10 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 bg-white/5 p-10 rounded-[40px] border border-white/10">
          <div className="relative group">
            <div className="w-32 h-32 bg-gradient-to-tr from-green-500 to-emerald-700 rounded-full flex items-center justify-center text-5xl font-black text-black shadow-2xl">
              {user.name[0]}
            </div>
            <button className="absolute bottom-1 right-1 bg-white text-black p-2 rounded-full shadow-lg hover:scale-110 transition">
              <Camera size={18} />
            </button>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black tracking-tight">{user.name}</h1>
            <p className="text-gray-400 mt-1">{user.email}</p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
              <span className="bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-white/10">
                Premium Member
              </span>
              <span className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-green-500/20">
                Verified Account
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            {isEditing ? <><Save size={18}/> Save Changes</> : <><User size={18}/> Edit Profile</>}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/5 p-8 rounded-[35px] border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-green-500" /> Delivery Information
              </h3>
              
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-2">Full Name</label>
                    <input 
                      disabled={!isEditing}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mt-2 outline-none focus:border-green-500 disabled:opacity-50"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-2">Phone Number</label>
                    <input 
                      disabled={!isEditing}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mt-2 outline-none focus:border-green-500 disabled:opacity-50"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-2">Shipping Address</label>
                  <textarea 
                    disabled={!isEditing}
                    placeholder="House Name, Street, City, ZIP"
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mt-2 outline-none focus:border-green-500 disabled:opacity-50"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                {isEditing && (
                  <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition">
                    Update Profile Details
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-600 to-emerald-900 p-8 rounded-[35px] text-white">
              <h3 className="font-bold text-lg mb-2">Ready to Order?</h3>
              <p className="text-sm text-white/70 mb-6">Your items are waiting in the cart. Complete your purchase now.</p>
              <button 
                onClick={() => navigate("/checkout")}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-95 transition"
              >
                Go to Checkout <ArrowRight size={18} />
              </button>
            </div>

            <button 
              onClick={logout}
              className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-[25px] font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}