const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Write cookies if provided via environment variables
let cookieData = process.env.YOUTUBE_COOKIES || '';
for (let i = 1; i <= 5; i++) {
    if (process.env[`YOUTUBE_COOKIES_${i}`]) {
        cookieData += process.env[`YOUTUBE_COOKIES_${i}`];
    }
}

if (cookieData) {
    const cookiesPath = path.join(__dirname, 'cookies.txt');
    fs.writeFileSync(cookiesPath, cookieData.replace(/\\n/g, '\n'), 'utf8');
    process.env.YOUTUBE_COOKIES_PATH = cookiesPath;
    console.log('YouTube cookies loaded from environment variables.');
}

// Routes
const youtubeRoutes = require('./routes/youtube');
const tiktokRoutes = require('./routes/tiktok');
app.use('/api/youtube', youtubeRoutes);
app.use('/api/tiktok', tiktokRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        service: 'MAZARI-MEDIA-API',
        status: 'online'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
