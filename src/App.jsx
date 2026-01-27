import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import './index.css';

import Home from './pages/Home';
import Register from './pages/Register';
import introV from "./assets/intro.mp4";

const IntroVideo = ({ onVideoEnd }) => {
  return (
    <div className="video-container">
      <video 
        autoPlay 
        muted 
        playsInline
        onEnded={onVideoEnd} 
        className="fullscreen-video"
      >
        <source src={introV} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleVideoEnd = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  if (showIntro) {
    return <IntroVideo onVideoEnd={handleVideoEnd} />;
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}