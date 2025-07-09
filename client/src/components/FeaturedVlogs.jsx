import React, { useEffect, useState } from 'react';
import VideoCard from './VideoCard';
import { fetchVideos } from '../youtubeAPI'; // Or use dummy for now

function FeaturedVlogs() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos('vlog').then(setVideos).catch(console.error);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>🔥 Featured Vlogs</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {videos.map((video) => (
          <VideoCard
            key={video.id.videoId}
            videoId={video.id.videoId}
            thumbnail={video.snippet.thumbnails.high.url}
            title={video.snippet.title}
            channel={video.snippet.channelTitle}
          />
        ))}
      </div>
    </div>
  );
}

export default FeaturedVlogs;
