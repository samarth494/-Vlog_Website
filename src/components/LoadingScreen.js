// src/components/LoadingScreen.js
import React, { useEffect, useState } from "react";
import "./LoadingScreen.css"; // Import the CSS for animations

const LoadingScreen = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false); // Hide the loading screen after 3 seconds
    }, 3000);
  }, []);

  if (!show) {
    return null; // Hide the loading screen after 3 seconds
  }

  return (
    <div className="loading-screen">
      <img src="/assets/vlogify-logo.jpg" alt="Vlogify Logo" className="logo" />
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default LoadingScreen;
