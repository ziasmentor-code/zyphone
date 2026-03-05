import React, { useContext } from "react";
import { CartContext } from "../context/cartcontext";
import { WishlistContext } from "../context/wishlistcontext";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p>Wishlist is empty</p>
      ) : (
        wishlistItems.map((item) => (
          <div key={`wishlist-${item.id}`} className="flex justify-between border-b py-4">
            <div className="flex items-center gap-4">
              <img src={`http://127.0.0.1:8000${item.image}`} alt={item.name} className="w-16 h-16 object-contain" />
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p>₹{item.price}</p>
              </div>
            </div>

            <button
              onClick={() => removeFromWishlist(item.id)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))
      )}
      <Link to="/all-products" className="mt-6 inline-block text-blue-600 underline">
        Back to Store
      </Link>
    </div>
  );
}