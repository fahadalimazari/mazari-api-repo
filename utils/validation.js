const ytdl = require('@distube/ytdl-core');

/**
 * Validates if the given string is a valid YouTube URL.
 * @param {string} url - The URL to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidYoutubeUrl(url) {
    return ytdl.validateURL(url);
}

module.exports = {
    isValidYoutubeUrl
};
