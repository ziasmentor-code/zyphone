import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import ProductPage from './pages/productpage';
import Navbar from './components/Navbar'; // Navbar ഇമ്പോർട്ട് ചെയ്തു

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f7]"> {/* ബാക്ക്ഗ്രൗണ്ട് കുറച്ചുകൂടി പ്രീമിയം ആക്കി */}
        
        {/* Navbar ഇവിടെ നൽകിയാൽ എല്ലാ പേജിലും വരും */}
        <Navbar /> 

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-products" element={<ProductPage />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;