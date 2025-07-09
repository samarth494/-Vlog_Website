import React from 'react';
import HeroBanner from '../components/HeroBanner';
import VideoFeed from '../components/VideoFeed';

function Dashboard() {
  return (
    <div style={{ background: '#121212', minHeight: '100vh' }}>
      <HeroBanner />
      <VideoFeed />
    </div>
  );
}

export default Dashboard;
