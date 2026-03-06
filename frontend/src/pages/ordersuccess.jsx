import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5); // 5 സെക്കൻഡ് ടൈമർ

  useEffect(() => {
    // ഓരോ സെക്കൻഡിലും കൗണ്ട് കുറയ്ക്കുന്നു
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // 5 സെക്കൻഡ് കഴിയുമ്പോൾ Order Page-ലേക്ക് വിടുന്നു
    const redirect = setTimeout(() => {
      navigate("/my-orders");
    }, 5000);

    // കമ്പോണന്റ് മാറുമ്പോൾ ടൈമറുകൾ ക്ലിയർ ചെയ്യുന്നു (Memory leak ഒഴിവാക്കാൻ)
    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-white p-6">
      {/* Success Icon with Animation */}
      <div className="bg-green-500/10 p-8 rounded-full mb-8 relative">
         <CheckCircle size={100} className="text-green-500 animate-pulse" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Order Placed!</h1>
      <p className="text-gray-400 text-center mb-8 max-w-md text-lg">
        Thank you for shopping with ZYPHONE. Your order has been confirmed.
      </p>

      {/* Timer Display */}
      <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 mb-8">
        <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-black font-bold rounded-full text-sm">
          {seconds}
        </div>
        <p className="text-sm text-gray-300">Redirecting to your orders...</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => navigate("/my-orders")}
          className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2 group"
        >
          View My Orders
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <button 
          onClick={() => navigate("/all-products")}
          className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}