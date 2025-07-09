import React, { useEffect, useState, useRef, useCallback } from 'react';
import VideoCard from './VideoCard';
import { fetchVideos } from '../utils/youtubeAPI';
import CategoryTags from './CategoryTags';
import './VideoFeed.css';

function VideoFeed() {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('vlog');

  const observer = useRef();

  const lastVideoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextPageToken !== null) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, nextPageToken]
  );

  const loadMore = async () => {
    setLoading(true);
    const { items, nextPageToken: newToken } = await fetchVideos(query, nextPageToken);
    setVideos((prev) => [...prev, ...items]);
    setNextPageToken(newToken || null);
    setLoading(false);
  };

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      const { items, nextPageToken } = await fetchVideos(query);
      setVideos(items);
      setNextPageToken(nextPageToken);
      setLoading(false);
    };

    fetchInitial();
  }, [query]);

  return (
    <div style={{ background: '#121212', minHeight: '100vh' }}>
      <CategoryTags onSelect={setQuery} />
      <div className="video-grid">
        {videos.map((video, index) => {
          const isLast = index === videos.length - 1;
          return (
            <div key={video.id.videoId} ref={isLast ? lastVideoRef : null}>
              <VideoCard
                videoId={video.id.videoId}
                thumbnail={video.snippet.thumbnails.high.url}
                title={video.snippet.title}
                channel={video.snippet.channelTitle}
              />
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

export default VideoFeed;
