

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';

// Pinneede namukku add cheyyaavunna pages
// import Products from './pages/Products';
// import Cart from './pages/Cart';

function App() {
  return (
    <Router>
      <div
        className="min-h-screen text-white selection:bg-red-600"
        style={{ backgroundColor: '#1a1c1e' }}
      >
        {/* Navbar ellaa page-ilum common aayi varum */}
        <Navbar />

        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<Home />} />

          {/* Products page undakkumpol ithu active aakkaam */}
          {/* <Route path="/products" element={<Products />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;