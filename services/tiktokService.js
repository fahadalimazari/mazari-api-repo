const axios = require('axios');

/**
 * Validates if the given string is a valid TikTok URL.
 * @param {string} url - The URL to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidTiktokUrl(url) {
    return /^https?:\/\/(?:www\.)?(?:tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\/.*$/.test(url);
}

/**
 * Retrieves metadata and download URLs for a given TikTok URL.
 * Uses a public reliable API endpoint for TikTok extraction without watermarks.
 * @param {string} url - The TikTok URL.
 * @returns {Promise<Object>} The media data.
 */
async function getTiktokData(url) {
    try {
        // Using tikwm API as a reliable open endpoint for tiktok data
        const response = await axios.post('https://www.tikwm.com/api/', { url, count: 12, cursor: 0, hd: 1 });
        
        if (response.data && response.data.code === 0 && response.data.data) {
            const data = response.data.data;
            return {
                title: data.title,
                thumbnail: data.cover,
                duration: data.duration,
                author: data.author ? data.author.unique_id : 'unknown',
                url: data.play || data.wmplay, // play is no-watermark, wmplay is fallback
                filename: `TikTok_${data.id}.mp4`
            };
        } else {
            throw new Error('Upstream API failed to extract media');
        }
    } catch (error) {
        throw new Error('Failed to fetch TikTok metadata: ' + error.message);
    }
}

module.exports = {
    isValidTiktokUrl,
    getTiktokData
};
