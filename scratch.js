const ytDlp = require('yt-dlp-exec');

async function testYtDlp() {
    console.log("Testing YouTube...");
    try {
        const ytInfo = await ytDlp('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
            dumpSingleJson: true,
            noWarnings: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true
        });
        console.log("YouTube Success!");
        console.log("Title:", ytInfo.title);
        // Find a format
        const format = ytInfo.formats.find(f => f.ext === 'mp4' && f.vcodec !== 'none' && f.acodec !== 'none');
        console.log("Found combined format:", format ? "YES" : "NO");
    } catch (e) {
        console.error("YouTube Failed:", e.message);
    }

    console.log("Testing TikTok...");
    try {
        const tkInfo = await ytDlp('https://www.tiktok.com/@tiktok/video/7257218318625901866', {
            dumpSingleJson: true,
            noWarnings: true
        });
        console.log("TikTok Success!");
        console.log("Title:", tkInfo.title);
        console.log("URL:", tkInfo.url);
    } catch (e) {
        console.error("TikTok Failed:", e.message);
    }
}

testYtDlp();
