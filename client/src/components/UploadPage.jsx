import React, { useState, useEffect, useCallback, useRef } from 'react';
import './UploadPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom components
const GlowingInput = ({ icon, label, type = 'text', value, onChange, placeholder }) => (
  <div className="glowing-input-container">
    <div className="input-icon">{icon}</div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="neon-input"
    />
    <label className="input-label">{label}</label>
  </div>
);

const VideoCard = ({ video, onLike, onView, onDelete, index }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const card = cardRef.current;
    if (card && isHovered) {
      card.style.transform = `perspective(1000px) rotateY(${(index % 2) * 5 - 2.5}deg) translateY(-10px) scale(1.05)`;
      card.style.boxShadow = `0 20px 40px rgba(0, 242, 254, 0.3)`;
    } else {
      card.style.transform = 'perspective(1000px) rotateY(0) translateY(0) scale(1)';
      card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
    }
  }, [isHovered, index]);

  return (
    <div
      ref={cardRef}
      className="video-card-neon"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(video.id)}
    >
      <div className="card-glow"></div>
      
      <div className="video-thumbnail-container" style={{ width: '100%', height: '200px', marginBottom: '15px' }}>
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt="Thumbnail"
            className="video-thumbnail-neon"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://picsum.photos/seed/video${video.id}/400/225.jpg`;
            }}
          />
        ) : (
          <div className="video-thumbnail-placeholder">
            <div className="placeholder-content">
              <span className="icon">🎬</span>
              <div className="placeholder-title">{video.title}</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="video-content">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-description">{video.description}</p>
        
        <div className="video-stats">
          <div className="stat">
            <span className="icon">👍</span>
            <span className="value">{video.likes || 0}</span>
          </div>
          <div className="stat">
            <span className="icon">👁️</span>
            <span className="value">{video.views || 0}</span>
          </div>
          <div className="stat">
            <span className="icon">⏱️</span>
            <span className="value">{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="video-player-container">
        <video 
          controls 
          className="video-player"
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          onPlay={() => onView(video.id)}
          onError={(e) => {
            console.error('Video error:', e.target.error);
            e.target.src = 'https://picsum.photos/seed/video/400/225.jpg';
          }}
        >
          <source src={video.videoUrl} type="video/mp4" />
          <source src={video.videoUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="card-actions">
        <button
          className="action-btn like-btn"
          onClick={(e) => {
            e.stopPropagation();
            onLike(video.id);
          }}
          disabled={video.liked}
        >
          <span className="icon">❤️</span>
          <span>{video.liked ? 'Liked' : 'Like'}</span>
        </button>
        
        <button
          className="action-btn delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(video.id);
          }}
        >
          <span className="icon">🗑️</span>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

function UploadPage() {
  // State management
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [vibeMode, setVibeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showTutorial, setShowTutorial] = useState(true);
  
  // Memoized filtered uploads
  const filteredUploads = React.useMemo(() => {
    let result = uploads;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply tab filter
    if (activeTab === 'favorites') {
      result = result.filter(item => item.liked);
    } else if (activeTab === 'recent') {
      result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return result;
  }, [uploads, searchTerm, activeTab]);
  
  // API calls with error handling
  const fetchUploads = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/videos', {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch videos');
      const data = await res.json();
      setUploads(data.map(video => ({ ...video, createdAt: new Date().toISOString() })));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const handleLike = useCallback((id) => {
    if (selectedVideo?.id === id && selectedVideo.liked) {
      toast.info("You already liked this video!");
      return;
    }
    
    setUploads(prev => 
      prev.map(video => 
        video.id === id 
          ? { ...video, likes: (video.likes || 0) + 1, liked: true } 
          : video
      )
    );
    
    if (selectedVideo?.id === id) {
      setSelectedVideo(prev => ({ ...prev, likes: (prev.likes || 0) + 1, liked: true }));
    }
  }, [selectedVideo]);

  const handleView = useCallback((id) => {
    setUploads(prev => 
      prev.map(video => 
        video.id === id 
          ? { ...video, views: (video.views || 0) + 1 } 
          : video
      )
    );
    
    if (selectedVideo?.id === id) {
      setSelectedVideo(prev => ({ ...prev, views: (prev.views || 0) + 1 }));
    }
  }, [selectedVideo]);

  const handleUpload = async () => {
    if (!title || !videoFile) {
      toast.error('Please enter a title and select a video.');
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('video', videoFile);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    
    try {
      const res = await fetch('http://localhost:5000/api/videos', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setUploads(prev => [{ 
        ...data, 
        likes: 0, 
        views: 0, 
        liked: false,
        createdAt: new Date().toISOString()
      }, ...prev]);
      
      toast.success('Video uploaded successfully!');
      handleClear();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = useCallback(() => {
    setTitle('');
    setVideoFile(null);
    setThumbnailFile(null);
    setDescription('');
    setTags('');
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await fetch(`http://localhost:5000/api/videos/${id}`, { method: 'DELETE' });
      setUploads(prev => prev.filter(item => item.id !== id));
      toast.info('Video deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete video');
    }
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedVideo) {
        setSelectedVideo(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectedVideo && !e.target.closest('.video-modal')) {
        setSelectedVideo(null);
      }
    };
    
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [selectedVideo]);

  return (
    <div className={`upload-page-neon ${vibeMode ? 'vibe-active' : ''}`}>
      
      
      {/* Tutorial overlay */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-content">
            <h2>Welcome to Vlogify</h2>
            <p>Upload, share, and discover amazing videos!</p>
            <ul>
              <li>• Fill in video details</li>
              <li>• Upload your video file</li>
              <li>• Add tags to help others find your content</li>
              <li>• Use the search to find videos</li>
              <li>• Toggle Vibe Mode for a unique experience</li>
            </ul>
            <button 
              className="close-tutorial-btn"
              onClick={() => setShowTutorial(false)}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
      
      <div className="content-container">
        <div className="header-section">
          <div className="logo">
            <span className="logo-text">VLOGIFY</span>
            <span className="logo-subtext">Create. Share. Inspire.</span>
          </div>
          
          <div className="upload-section">
            <h2>🎬 Upload New Video</h2>
            
            <div className="upload-form">
              <GlowingInput
                icon="📝"
                label="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title"
              />
              
              <div className="file-upload-group">
                <div className="file-input-wrapper">
                  <div className="file-input-label">
                    <span className="icon">🎥</span>
                    <span>Choose Video</span>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    style={{ display: 'none' }}
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="file-select-btn">
                    Select Video File
                  </label>
                  <div className="file-name">
                    {videoFile ? videoFile.name : 'No video chosen'}
                  </div>
                </div>
                
                <div className="file-input-wrapper">
                  <div className="file-input-label">
                    <span className="icon">🖼️</span>
                    <span>Choose Thumbnail</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                    style={{ display: 'none' }}
                    id="thumbnail-upload"
                  />
                  <label htmlFor="thumbnail-upload" className="file-select-btn">
                    Select Thumbnail
                  </label>
                  <div className="file-name">
                    {thumbnailFile ? thumbnailFile.name : 'No thumbnail chosen'}
                  </div>
                </div>
              </div>
              
              <GlowingInput
                icon="📝"
                label="Video Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your video"
                type="textarea"
              />
              
              <GlowingInput
                icon="🏷️"
                label="Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="comma,separated,tags"
              />
              
              <div className="upload-actions">
                <button
                  className="upload-btn"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span>
                      <span className="spinner"></span>
                      Uploading...
                    </span>
                  ) : (
                    <span>Upload 🚀</span>
                  )}
                </button>
                
                <button
                  className="clear-btn"
                  onClick={handleClear}
                >
                  Clear 🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="video-library-section">
          <div className="library-header">
            <h2>🎞️ Your Video Library</h2>
            
            <div className="search-container">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-neon"
                />
                <div className="search-icon">🔍</div>
              </div>
            </div>
            
            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Videos
              </button>
              <button
                className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites
              </button>
              <button
                className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
                onClick={() => setActiveTab('recent')}
              >
                Recent
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your videos...</p>
            </div>
          ) : filteredUploads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <h3>No videos found</h3>
              <p>{searchTerm ? 'Try a different search term' : 'Upload your first video!'}</p>
            </div>
          ) : (
            <div className="video-grid">
              {filteredUploads.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onLike={handleLike}
                  onView={handleView}
                  onDelete={handleDelete}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedVideo && (
        <div className="video-modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setSelectedVideo(null)}
            >
              ✖
            </button>
            
            <div className="modal-header">
              <h2>{selectedVideo.title}</h2>
              <div className="modal-stats">
                <div className="stat">
                  <span className="icon">👍</span>
                  <span>{selectedVideo.likes || 0}</span>
                </div>
                <div className="stat">
                  <span className="icon">👁️</span>
                  <span>{selectedVideo.views || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="modal-video-container">
              {selectedVideo.videoUrl ? (
                <video
                  controls
                  src={selectedVideo.videoUrl}
                  className="modal-video"
                  poster={selectedVideo.thumbnailUrl}
                  onPlay={() => handleView(selectedVideo.id)}
                />
              ) : (
                <div className="video-placeholder">
                  <div className="placeholder-content">
                    <span className="icon">🎬</span>
                    <div className="placeholder-title">Video not available</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-description">
              <p>{selectedVideo.description}</p>
              
              <div className="modal-tags">
                <span className="icon">🏷️</span>
                <span>{selectedVideo.tags || 'No tags'}</span>
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                className="action-btn like-btn"
                onClick={() => handleLike(selectedVideo.id)}
                disabled={selectedVideo.liked}
              >
                <span className="icon">❤️</span>
                <span>{selectedVideo.liked ? 'Liked' : 'Like'}</span>
              </button>
              
              <button
                className="action-btn share-btn"
              >
                <span className="icon">📤</span>
                <span>Share</span>
              </button>
              
              <button
                className="action-btn download-btn"
              >
                <span className="icon">⬇️</span>
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button
        className={`vibe-btn ${vibeMode ? 'active' : ''}`}
        onClick={() => setVibeMode(!vibeMode)}
      >
        {vibeMode ? '🎵 Turn Off Vibe Mode' : '🎶 Turn On Vibe Mode'}
      </button>
      
      <ToastContainer />
    </div>
  );
}

export default UploadPage;