import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/cartcontext";
import { AuthContext } from "../context/authcontext"; // User details edukkan
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Truck, CreditCard, Edit2, Check } from "lucide-react";

export default function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // Current logged-in user
  const navigate = useNavigate();

  // Address edit cheyyaanulla state
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  // User details maarumpol form update aakan
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalPrice = cartItems.reduce((total, item) => total + Number(item.price), 0);

  const handleOrder = () => {
  // 1. അഡ്രസ്സും ഫോണും ഉണ്ടോ എന്ന് ഉറപ്പ് വരുത്തുന്നു
  if (!formData.address || !formData.phone) {
    toast.error("Please provide shipping address and phone number", {
      style: {
        borderRadius: '15px',
        background: '#333',
        color: '#fff',
      },
    });
    setIsEditing(true); 
    return;
  }

 
  toast.success("Order Placed Successfully! 🎉");

 
  if (clearCart) {
    clearCart();
  }

  setTimeout(() => {
    navigate("/order-success");
  }, 1000); 
};
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-28 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        
        {/* LEFT - SHIPPING DETAILS WITH EDIT OPTION */}
        <div className="bg-white/5 p-8 rounded-[35px] border border-white/10 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Truck size={24} className="text-green-500" /> Shipping Details
            </h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 text-sm text-green-500 hover:underline"
            >
              {isEditing ? <><Check size={16} /> Done</> : <><Edit2 size={16} /> Edit Details</>}
            </button>
          </div>

          <div className="space-y-4">
            {isEditing ? (
              // EDIT MODE: Inputs kaanikunnu
              <>
                <input
                  name="name" value={formData.name} onChange={handleChange}
                  placeholder="Full Name" className="w-full bg-white/10 p-4 rounded-2xl outline-none border border-white/10"
                />
                <input
                  name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="Phone Number" className="w-full bg-white/10 p-4 rounded-2xl outline-none border border-white/10"
                />
                <textarea
                  name="address" value={formData.address} onChange={handleChange}
                  placeholder="Shipping Address" rows="4"
                  className="w-full bg-white/10 p-4 rounded-2xl outline-none border border-white/10"
                />
              </>
            ) : (
              // VIEW MODE: Just text aayi kaanikunnu
              <div className="bg-white/5 p-6 rounded-2xl space-y-3 border border-dashed border-white/20">
                <p><span className="text-gray-500">Deliver to:</span> <span className="font-bold">{formData.name || "Add Name"}</span></p>
                <p><span className="text-gray-500">Phone:</span> <span className="font-bold">{formData.phone || "Add Phone"}</span></p>
                <p><span className="text-gray-500">Address:</span> <br /> 
                   <span className="text-sm leading-relaxed">{formData.address || "No address added yet. Click edit to add."}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="bg-white/5 p-8 rounded-[35px] border border-white/10 h-fit">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CreditCard size={24} className="text-green-500" /> Order Summary
          </h2>
          {/* ... Cart map items ivide varum (pazhaya code thudaruka) ... */}
          <div className="border-t border-white/10 pt-4 mt-6">
             <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
             </div>
             <button 
                onClick={handleOrder}
                className="w-full bg-white text-black py-4 rounded-full font-bold mt-6 hover:scale-95 transition-all"
             >
                Confirm Order
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}