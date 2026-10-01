const ytDlp = require('yt-dlp-exec');

async function checkFormats() {
    try {
        const info = await ytDlp('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
            dumpSingleJson: true,
            noWarnings: true
        });
        const combinedFormats = info.formats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none');
        console.log("Combined formats:");
        combinedFormats.forEach(f => console.log(`- ${f.format_id}: ${f.ext} ${f.resolution}`));
        
        const audioFormats = info.formats.filter(f => f.vcodec === 'none' && f.acodec !== 'none');
        console.log("Audio formats:");
        audioFormats.forEach(f => console.log(`- ${f.format_id}: ${f.ext}`));
    } catch (e) {
        console.error("Error:", e.message);
    }
}
checkFormats();
