const ShortVideo = require('../models/shortVideoModel');
const { uploadToGCS, deleteFromGCS } = require('../services/storageService');
const axios = require('axios');
const { unlink } = require('fs/promises');

const uploadVideo = async (req, res) => {
    const { file, body } = req;
    const { title, description } = body;

    console.log(req);
    console.log(file);
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = file.path;
    try {
        // Upload to Google Cloud Storage
      const datenow = Date.now();
        const publicUrl = await uploadToGCS(inputPath, datenow);


      console.log(req.username);
        const shortVideo = new ShortVideo({
            username: req.username,
            originalName: file.originalname,
            size: file.size / (1024 * 1024), // Convert to MB
            url: publicUrl,
            title: title || '',
            description: description || '',
            uploadedAt: new Date(),
            compressedName: `videos/${datenow}-${inputPath}`,
        });
        await shortVideo.save();

    
        // Clean up temporary files
        await unlink(inputPath);

        res.status(200).json({ message: 'File uploaded successfully', video: shortVideo });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Failed to upload file' });

        // Clean up in case of errors
        if (fs.existsSync(inputPath)) await unlink(inputPath);
    }
};

const getAllVideos = async (req, res) => {
    try {
        const videos = await ShortVideo.find({ username: req.username });
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};

const getVideoById = async (req, res) => {
    try {
        const video = await ShortVideo.findOne({ _id: req.params.id, username: req.username });
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.status(200).json(video);
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ error: 'Failed to fetch video' });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const video = await ShortVideo.findOneAndDelete({ _id: req.params.id, username: req.username });
        if (!video) return res.status(404).json({ error: 'Video not found' });

        // Delete from GCS
        await deleteFromGCS(video.compressedName);

        // Log deletion
        // await axios.post(`${process.env.USAGE_MONITORING_SERVICE_URL}/log-deletion`, {
        //     size: video.compressedSize,
        // }, {
        //     headers: { Authorization: req.headers['authorization'] }
        // });

        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'Failed to delete video' });
    }
};

const updateVideoMetadata = async (req, res) => {
    const { title, description } = req.body;
    try {
        const video = await ShortVideo.findOneAndUpdate(
            { _id: req.params.id, username: req.username },
            { title, description },
            { new: true }
        );
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.status(200).json(video);
    } catch (error) {
        console.error('Error updating video metadata:', error);
        res.status(500).json({ error: 'Failed to update video metadata' });
    }
};

module.exports = { uploadVideo, getAllVideos, getVideoById, deleteVideo, updateVideoMetadata };
