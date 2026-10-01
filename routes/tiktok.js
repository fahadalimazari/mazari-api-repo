const express = require('express');
const router = express.Router();
const tiktokService = require('../services/tiktokService');
const { cleanupFile } = require('../utils/cleanup');

// Helper to handle async routes
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// TikTok Endpoint
router.get('/', asyncHandler(async (req, res) => {
    const { url } = req.query;

    if (!url || !tiktokService.isValidTiktokUrl(url)) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_URL',
                message: 'A valid TikTok URL is required.'
            }
        });
    }

    try {
        const metadata = await tiktokService.getTiktokData(url);

        if (!metadata.url) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'MEDIA_UNAVAILABLE',
                    message: 'The requested media is unavailable or extraction failed.'
                }
            });
        }

        res.json({
            success: true,
            platform: 'tiktok',
            type: 'video',
            title: metadata.title,
            thumbnail: metadata.thumbnail,
            duration: metadata.duration,
            author: metadata.author,
            url: metadata.url,
            filename: metadata.filename
        });

    } catch (error) {
        console.error('TikTok Error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'EXTRACTION_FAILED',
                message: 'Failed to extract TikTok media: ' + error.message
            }
        });
    }
}));

module.exports = router;
