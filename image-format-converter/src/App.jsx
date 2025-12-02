import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Converter from './pages/Converter';

import Compress from './pages/Compress';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/compress" element={<Compress />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
