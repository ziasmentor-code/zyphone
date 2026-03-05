import { useContext } from "react";
import { CartContext } from "../context/cartcontext";

export default function Cart() {

  const { cartItems, removeFromCart } = useContext(CartContext);

  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (

        cartItems.map((item) => (

          <div key={item.id} className="flex justify-between border-b py-4">

            <div>
              <h2 className="font-bold">{item.name}</h2>
              <p>₹{item.price}</p>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500"
            >
              Remove
            </button>

          </div>

        ))

      )}

    </div>

  );
}