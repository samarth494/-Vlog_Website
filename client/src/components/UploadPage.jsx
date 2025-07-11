
import React, { useState, useEffect } from 'react';
import './UploadPage.css';

function UploadPage() {
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploads, setUploads] = useState([]);

  // Load videos from server
  useEffect(() => {
    const fetchUploads = async () => {
      const res = await fetch('http://localhost:5000/api/videos');
      const data = await res.json();
      setUploads(data);
    };
    fetchUploads();
  }, []);

  const handleUpload = async () => {
    if (!title || !videoFile) {
      alert('Please enter a title and select a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);  // even though not used on server yet

    const res = await fetch('http://localhost:5000/api/videos', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setUploads([data, ...uploads]);

    // Clear form
    setTitle('');
    setVideoFile(null);
    setThumbnailFile(null);
    setDescription('');
    setTags('');
  };

  const handleClear = () => {
    setTitle('');
    setVideoFile(null);
    setThumbnailFile(null);
    setDescription('');
    setTags('');
  };

  const handleDelete = (id) => {
    const updated = uploads.filter((item) => item.id !== id);
    setUploads(updated);
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h2>Upload New Video 🎥</h2>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnailFile(e.target.files[0])}
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="button-group">
          <button onClick={handleUpload}>Upload 🚀</button>
          <button onClick={handleClear} className="clear-btn">
            Clear 🗑️
          </button>
        </div>
      </div>

      <div className="uploaded-videos">
        <h3>Your Uploaded Videos</h3>
        {uploads.length === 0 && <p>No videos uploaded yet.</p>}

        <div className="video-grid">
          {uploads.map((item) => (
            <div key={item.id} className="video-card">
              {item.thumbnailUrl && (
                <img
                  src={item.thumbnailUrl}
                  alt="Thumbnail"
                  className="video-thumbnail"
                />
              )}
              <video controls src={item.videoUrl} className="video-player" />
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <p><strong>Tags:</strong> {item.tags || 'No tags'}</p>
              <button
                onClick={() => handleDelete(item.id)}
                className="delete-btn"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
