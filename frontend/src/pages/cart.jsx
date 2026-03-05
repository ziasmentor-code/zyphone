import { useContext } from "react";
import { CartContext } from "../context/cartcontext";

export default function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-4"
            >
              {/* IMAGE + NAME + PRICE */}
              <div className="flex items-center gap-4">
                <img
                  src={`http://127.0.0.1:8000${item.image}`} // product image
                  alt={item.name}
                  className="w-20 h-20 object-contain rounded-xl bg-gray-50 p-2"
                />
                <div>
                  <h2 className="font-bold text-black">{item.name}</h2>
                  <p className="text-gray-700">₹{Number(item.price).toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 font-bold hover:text-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}