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
