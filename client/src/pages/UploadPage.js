import React, { useState } from 'react';

function UploadPage() {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');

  const handleUpload = () => {
    console.log({ title, videoUrl, thumbnail, description });
    alert('Vlog Uploaded!');
  };

  return (
    <div>
      <h2>Upload Your Vlog</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br/>
      <input placeholder="Video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} /><br/>
      <input placeholder="Thumbnail URL" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} /><br/>
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br/>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadPage;
