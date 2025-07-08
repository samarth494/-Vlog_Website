import React from 'react';
import './SplashScreen.css';
import logo from '../assets/vlogify-logo.png';

function SplashScreen() {
  return (
    <div className="splash-screen">
      <img src={logo} alt="Vlogify Logo" className="logo" />
      <div className="loader">
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
