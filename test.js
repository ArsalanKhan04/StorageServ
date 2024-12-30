const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// API endpoint
const API_URL = 'http://localhost:3001/api/upload';

// Path to the video file you want to upload
const videoFilePath = './video.mp4'; // Replace with the path to your test video

// Metadata
const videoMetadata = {
    title: 'Sample Video',
    description: 'This is a test video for API testing.',
};

// Test function to call the API
const testUploadVideo = async () => {
    try {
        // Ensure the file exists
        if (!fs.existsSync(videoFilePath)) {
            console.error('File does not exist:', videoFilePath);
            return;
        }

        // Create form data
        const formData = new FormData();
        formData.append('file', fs.createReadStream(videoFilePath));
        formData.append('title', videoMetadata.title);
        formData.append('description', videoMetadata.description);

        // Send the POST request
        const response = await axios.post(API_URL, formData, {
            headers: {
                ...formData.getHeaders(),
                // Add authorization header if required
                // Authorization: 'Bearer YOUR_TOKEN',
            },
        });

        // Log the response
        console.log('API Response:', response.data);
    } catch (error) {
        console.error('Error calling the API:', error.response ? error.response.data : error.message);
    }
};

// Run the test
testUploadVideo();
