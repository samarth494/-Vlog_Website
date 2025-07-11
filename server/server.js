import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join('uploads'))); // corrected to /uploads

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

let videos = [];

// Upload video + thumbnail API
app.post(
  '/api/videos',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files);
    console.log(req.body);

    const { title, description } = req.body;

    const videoFile = req.files['video'] ? req.files['video'][0] : null;
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

    if (!videoFile) {
      return res.status(400).json({ error: 'Video file is required.' });
    }

    const video = {
      id: Date.now().toString(),
      title,
      description,
      videoUrl: `http://localhost:5000/uploads/${videoFile.filename}`,
      thumbnailUrl: thumbnailFile
        ? `http://localhost:5000/uploads/${thumbnailFile.filename}`
        : '',
      views: 0,
      comments: [],
    };

    videos.push(video);
    res.json(video);
  }
);

// Get all videos
app.get('/api/videos', (req, res) => res.json(videos));

// Get single video + increment views
app.get('/api/videos/:id', (req, res) => {
  const video = videos.find((v) => v.id === req.params.id);
  if (!video) return res.status(404).send('Video not found');
  video.views++;
  res.json(video);
});

// Post comment on a video
app.post('/api/videos/:id/comments', (req, res) => {
  const video = videos.find((v) => v.id === req.params.id);
  if (!video) return res.status(404).send('Video not found');
  video.comments.push(req.body.comment);
  res.json(video.comments);
});

// Start server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
