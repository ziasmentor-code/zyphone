import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authcontext"; 
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (email && password) {
      // 1. User details set cheyyunnu
      const userData = { 
        name: email.split('@')[0].toUpperCase(), 
        email: email 
      };

      // 2. AuthContext-ile login function vilikkunnu (Ithu user-ne save cheyyum)
      login(userData);
      
      toast.success("Login Successful! Happy Shopping 🛍️");

      // 3. Nere All Products page-ilekk redirect cheyyunnu
      // "/all-products" enna path ningalude App.jsx-ile path aayirikkanam
      setTimeout(() => {
        navigate("/all-products");
      }, 500);

    } else {
      toast.error("Please enter email and password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white/5 p-10 rounded-[40px] border border-white/10 backdrop-blur-xl">
        <h2 className="text-4xl font-bold text-white mb-2 text-center">Sign In</h2>
        <p className="text-gray-500 text-center mb-10 text-sm">Access your ZYPHONE account</p>
        
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-green-500 transition-all"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-green-500 transition-all"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="w-full bg-white text-black py-4 rounded-full font-bold text-lg mt-8 hover:scale-95 transition-transform">
          Login & Start Shopping
        </button>
      </form>
    </div>
  );
}