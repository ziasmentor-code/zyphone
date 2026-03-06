import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/authcontext";
import toast from 'react-hot-toast';
import { ArrowLeft, CreditCard, MapPin, User } from 'lucide-react';

export default function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ഫോം ഡാറ്റ സ്റ്റേറ്റ്
  const [formData, setFormData] = useState({
    fullName: user?.displayName || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  // കാർട്ടിലുള്ള ഐറ്റങ്ങളുടെ ആകെ തുക കണക്കാക്കുന്നു
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const loadingToast = toast.loading("Processing your order...");

    // 2 സെക്കൻഡിന് ശേഷം ഓർഡർ കൺഫേം ആകുന്നു
    setTimeout(() => {
      // പുതിയ ഓർഡർ ഒബ്ജക്റ്റ് ഉണ്ടാക്കുന്നു (ഇതിൽ കാർട്ടിലെ ഇമേജുകളും ഉൾപ്പെടും)
      const newOrder = {
        id: "ORD-" + Math.floor(Math.random() * 90000 + 10000),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: "Processing",
        total: subtotal.toLocaleString("en-IN"),
        items: cartItems.map(item => ({
          name: item.name,
          image: item.image, // ബാക്കെൻഡിൽ നിന്നുള്ള ഇമേജ് പാത്ത്
          price: item.price
        })),
        customerName: formData.fullName,
        deliveryAddress: formData.address
      };

      // localStorage-ലേക്ക് സേവ് ചെയ്യുന്നു
      try {
        const existingOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem("myOrders", JSON.stringify(updatedOrders));
        
        toast.dismiss(loadingToast);
        toast.success(`Order Placed Successfully, ${formData.fullName}! 🎉`);
        
        if (clearCart) clearCart();
        navigate("/order-success");
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Something went wrong!");
        console.error("Order Save Error:", error);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-6 flex items-center justify-center">
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/5 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-3xl w-full bg-[#111113] p-8 sm:p-12 rounded-[40px] border border-white/5 shadow-2xl relative z-10">
        <button onClick={() => navigate("/cart")} className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to shopping bag
        </button>

        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-white tracking-tight">Shipping Details</h2>
          <p className="text-gray-500 mt-2">Confirm your information to place the order</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Enter your name" 
                  required 
                  className="w-full p-4 pl-12 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-green-500 transition-all text-white" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contact Number</label>
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel" 
                placeholder="+91 0000000000" 
                required 
                className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-green-500 transition-all text-white" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Delivery Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-5 text-gray-600" size={18} />
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="House No, Street, City, Pincode" 
                required 
                className="w-full p-4 pl-12 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-green-500 transition-all text-white h-32 resize-none"
              ></textarea>
            </div>
          </div>
          
          <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-green-500/30 transition-all cursor-pointer">
             <div className="flex items-center gap-4">
                <div className="bg-green-500/10 p-3 rounded-xl">
                   <CreditCard className="text-green-500" size={24} />
                </div>
                <div>
                   <p className="font-bold text-white">Cash on Delivery</p>
                   <p className="text-xs text-gray-500">Pay when you receive the phone</p>
                </div>
             </div>
             <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
             </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total Amount</span>
              <span className="text-2xl font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <button 
              type="submit" 
              className="w-full bg-white text-black py-5 rounded-2xl font-bold text-lg hover:bg-green-400 hover:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/5"
            >
              Confirm Order & Pay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}