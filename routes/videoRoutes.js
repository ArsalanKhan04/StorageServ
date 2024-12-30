const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authenticate = require('../middlewares/authMiddleware');
const upload = require('./../multer-config');

router.post('/upload', upload.single('file'),authenticate, videoController.uploadVideo);
router.get('/videos', authenticate, videoController.getAllVideos);
router.get('/videos/:id', authenticate, videoController.getVideoById);
router.delete('/videos/:id', authenticate, videoController.deleteVideo);
router.patch('/videos/:id', authenticate, videoController.updateVideoMetadata);

module.exports = router;
