import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/cartcontext";
import { WishlistProvider } from "./context/wishlistcontext";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <WishlistProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <App />
      </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  </React.StrictMode>
);