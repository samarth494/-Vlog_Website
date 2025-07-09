import React from 'react';
import './VideoCard.css';

function VideoCard({ videoId, title, channel, thumbnail }) {
  return (
    <div className="video-card">
      <iframe
        width="100%"
        height="180"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <h4>{title}</h4>
      <p>{channel}</p>
    </div>
  );
}

export default VideoCard;
