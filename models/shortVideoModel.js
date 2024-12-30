const mongoose = require('mongoose');

const shortVideoSchema = new mongoose.Schema({
    username: String,
    originalName: String,
    size: Number,
    url: String,
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now },
    compressedName: { type: String, default: '' },
});

module.exports = mongoose.model('ShortVideo', shortVideoSchema);
