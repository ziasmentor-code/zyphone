import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authcontext"; 
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Smartphone } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (email && password) {
      const userData = { 
        name: email.split('@')[0].toUpperCase(), 
        email: email 
      };

      login(userData);
      toast.success("Login Successful! Welcome to ZYPHONE 📱");

      setTimeout(() => {
        navigate("/all-products");
      }, 800);
    } else {
      toast.error("Please enter email and password");
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#0a0a0b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600/10 rounded-full blur-[120px]"></div>

      <form 
        onSubmit={handleLogin} 
        className="w-full max-w-md bg-[#111113]/50 backdrop-blur-2xl p-8 sm:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl z-10"
      >
        {/* Logo Icon */}
        <div className="flex justify-center mb-6">
           <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-600/20">
              <Smartphone className="text-white" size={28} />
           </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to continue to ZYPHONE</p>
        </div>
        
        <div className="space-y-5">
          {/* Email Field */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full p-4 pl-12 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all placeholder:text-gray-600"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-4 pl-12 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all placeholder:text-gray-600"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <button type="button" className="text-xs text-gray-500 hover:text-white transition-colors">Forgot Password?</button>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-white text-black py-4 rounded-2xl font-bold text-base mt-8 hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          Login to Account
          <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-gray-500 text-xs mt-8">
          Don't have an account? <span className="text-white cursor-pointer hover:underline">Create one</span>
        </p>
      </form>
    </div>
  );
}