const ytDlp = require('yt-dlp-exec');
const ytSearch = require('yt-search');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Need to install uuid if not there, wait, I can just use crypto or Date.now()
const crypto = require('crypto');

function generateTempId() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * Retrieves metadata for a given YouTube URL using yt-dlp.
 */
async function getMetadata(url) {
    try {
        const args = {
            dumpSingleJson: true,
            noWarnings: true,
            playlistEnd: 1,
            // cookies: ... handled later if needed
        };
        
        if (process.env.YOUTUBE_COOKIES_PATH && fs.existsSync(process.env.YOUTUBE_COOKIES_PATH)) {
            args.cookies = process.env.YOUTUBE_COOKIES_PATH;
        }

        const info = await ytDlp(url, args);
        return info;
    } catch (error) {
        throw new Error('Failed to fetch YouTube metadata via yt-dlp: ' + error.message);
    }
}

/**
 * Downloads a video from YouTube to a temporary file using yt-dlp + ffmpeg.
 */
async function downloadMedia(url, type, quality = '') {
    const tempId = generateTempId();
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    
    let format = '';
    let ext = '';
    if (type === 'video') {
        ext = 'mp4';
        if (quality === 'hd') {
            format = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
        } else {
            format = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best';
        }
    } else if (type === 'audio') {
        ext = 'mp3';
        format = 'bestaudio';
    }

    const outputPath = path.join(tempDir, `${tempId}.${ext}`);

    const args = {
        output: outputPath,
        format: format,
        noWarnings: true,
        noPlaylist: true,
    };
    
    if (type === 'audio') {
        args.extractAudio = true;
        args.audioFormat = 'mp3';
    } else {
        args.mergeOutputFormat = 'mp4';
    }

    if (process.env.YOUTUBE_COOKIES_PATH && fs.existsSync(process.env.YOUTUBE_COOKIES_PATH)) {
        args.cookies = process.env.YOUTUBE_COOKIES_PATH;
    }

    try {
        await ytDlp(url, args);
        if (!fs.existsSync(outputPath)) {
            throw new Error('Download failed, file not found.');
        }
        return outputPath;
    } catch (error) {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        throw new Error('Failed to download media via yt-dlp: ' + error.message);
    }
}

/**
 * Searches for a YouTube video by query and returns the first result's URL.
 */
async function searchVideo(query) {
    try {
        const r = await ytSearch(query);
        const videos = r.videos;
        if (videos.length > 0) {
            return videos[0].url;
        }
        return null;
    } catch (error) {
        throw new Error('YouTube search failed: ' + error.message);
    }
}

module.exports = {
    getMetadata,
    downloadMedia,
    searchVideo
};
