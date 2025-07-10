import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroBanner.css';

function HeroBanner() {
  const navigate = useNavigate();

  return (
    <div className="hero-banner">
      <h1>Unleash Your Story with Vlogify 🎥</h1>
      <p>Stream. Share. Inspire. Join thousands of creators building their vlog universe.</p>
      <button onClick={() => navigate('/upload')}>Start Uploading</button>
    </div>
  );
}

export default HeroBanner;
