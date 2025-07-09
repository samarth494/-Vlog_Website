import React from 'react';
import './SplashScreen.css';
import logo from '../assets/vlogify-logo.png'; // adjust path if needed

function SplashScreen() {
  return (
    <div className="splash-screen">
      <img src={logo} alt="Vlogify Logo" className="splash-logo" />
      <div className="bar-loader">
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </div>
    </div>
  );
}

export default SplashScreen;
