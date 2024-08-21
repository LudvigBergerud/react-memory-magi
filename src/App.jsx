import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import Create from './pages/Create';  

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<Create />} />  
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer></footer>
      </Router>
    </>
  );
}

export default App;

