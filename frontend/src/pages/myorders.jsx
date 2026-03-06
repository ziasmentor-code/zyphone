import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authcontext";
import { Smartphone, Package, ChevronRight, Clock, CheckCircle, Truck } from 'lucide-react';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Mock Orders Data (യഥാർത്ഥത്തിൽ ഇത് backend-ൽ നിന്ന് വരണം)
  const orders = [
    {
      id: "ORD-99210",
      date: "Oct 24, 2023",
      status: "Delivered",
      total: "₹1,24,900",
      items: [{ name: "iPhone 15 Pro", image: "/iphone15.jpg" }]
    },
    {
      id: "ORD-88542",
      date: "Oct 28, 2023",
      status: "On the way",
      total: "₹79,900",
      items: [{ name: "Nothing Phone (2)", image: "/nothing2.jpg" }]
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Please login to view your orders</h2>
        <button onClick={() => navigate("/login")} className="bg-red-600 px-8 py-3 rounded-full font-bold">Login Now</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Orders</h1>
            <p className="text-gray-500 mt-2">Track and manage your ZYPHONE purchases</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
             <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 font-bold">
                {user.name?.charAt(0) || "U"}
             </div>
             <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Customer</p>
                <p className="text-sm font-medium">{user.name}</p>
             </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-[#111113] border border-white/5 rounded-[32px] p-6 md:p-8 hover:border-white/20 transition-all group cursor-pointer"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl">
                      <Package className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{order.id}</h3>
                      <p className="text-gray-500 text-sm">{order.date}</p>
                    </div>
                  </div>
                  
                  {/* Status Badges */}
                  <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${
                    order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {order.status === 'Delivered' ? <CheckCircle size={14} /> : <Truck size={14} />}
                    {order.status}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                       <Smartphone className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Products</p>
                      <p className="font-semibold">{order.items[0].name} {order.items.length > 1 && `+ ${order.items.length - 1} more`}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total Amount</p>
                      <p className="text-xl font-bold text-white">{order.total}</p>
                    </div>
                    <div className="bg-white text-black p-3 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
               <Clock size={48} className="mx-auto text-gray-600 mb-4" />
               <h3 className="text-xl font-bold">No orders yet</h3>
               <p className="text-gray-500 mt-2">When you buy a phone, it will appear here.</p>
               <button onClick={() => navigate("/all-products")} className="mt-6 bg-white text-black px-8 py-3 rounded-full font-bold">Start Shopping</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;