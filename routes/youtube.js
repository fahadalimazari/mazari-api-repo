const express = require('express');
const router = express.Router();
const youtubeService = require('../services/youtubeService');
const { cleanupFile } = require('../utils/cleanup');
const fs = require('fs');
const mime = require('mime-types'); // We need to install mime-types or just hardcode

// Simple regex validation instead of ytdl-core since we removed it
function isValidYoutubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url);
}

// Helper to handle async routes
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const errorResponse = (res, code, message, status = 500) => {
    return res.status(status).json({
        success: false,
        error: { code, message }
    });
};

function streamMedia(res, filePath, filename, contentType) {
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    
    stream.on('end', () => cleanupFile(filePath));
    stream.on('error', (err) => {
        console.error('Stream error:', err);
        cleanupFile(filePath);
    });
    res.on('close', () => cleanupFile(filePath));
}

// Video Endpoint
router.get('/video', asyncHandler(async (req, res) => {
    const { url, quality } = req.query;

    if (!url || !isValidYoutubeUrl(url)) {
        return errorResponse(res, 'INVALID_URL', 'A valid YouTube URL is required.', 400);
    }

    try {
        const metadata = await youtubeService.getMetadata(url);
        if (!metadata) {
            return errorResponse(res, 'MEDIA_UNAVAILABLE', 'Video metadata not found.', 404);
        }

        const filePath = await youtubeService.downloadMedia(url, 'video', quality);
        const filename = `${metadata.title ? metadata.title.replace(/[^a-zA-Z0-9]/g, '_') : 'video'}.mp4`;
        
        streamMedia(res, filePath, filename, 'video/mp4');
    } catch (error) {
        console.error('YouTube Video Error:', error);
        return errorResponse(res, 'EXTRACTION_FAILED', 'Failed to extract video: ' + error.message);
    }
}));

// Audio Endpoint
router.get('/audio', asyncHandler(async (req, res) => {
    const { url } = req.query;

    if (!url || !isValidYoutubeUrl(url)) {
        return errorResponse(res, 'INVALID_URL', 'A valid YouTube URL is required.', 400);
    }

    try {
        const metadata = await youtubeService.getMetadata(url);
        if (!metadata) {
            return errorResponse(res, 'MEDIA_UNAVAILABLE', 'Audio metadata not found.', 404);
        }

        const filePath = await youtubeService.downloadMedia(url, 'audio');
        const filename = `${metadata.title ? metadata.title.replace(/[^a-zA-Z0-9]/g, '_') : 'audio'}.mp3`;
        
        streamMedia(res, filePath, filename, 'audio/mpeg');
    } catch (error) {
        console.error('YouTube Audio Error:', error);
        return errorResponse(res, 'EXTRACTION_FAILED', 'Failed to extract audio: ' + error.message);
    }
}));

// Play Endpoint
router.get('/play', asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return errorResponse(res, 'INVALID_QUERY', 'A search query is required.', 400);
    }

    try {
        const url = await youtubeService.searchVideo(query);
        if (!url) {
            return errorResponse(res, 'MEDIA_UNAVAILABLE', 'No video found for the given query.', 404);
        }

        const metadata = await youtubeService.getMetadata(url);
        const filePath = await youtubeService.downloadMedia(url, 'audio');
        const filename = `${metadata.title ? metadata.title.replace(/[^a-zA-Z0-9]/g, '_') : 'audio'}.mp3`;
        
        streamMedia(res, filePath, filename, 'audio/mpeg');
    } catch (error) {
        console.error('YouTube Play Error:', error);
        return errorResponse(res, 'EXTRACTION_FAILED', 'Failed to execute play search: ' + error.message);
    }
}));

module.exports = router;
