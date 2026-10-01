# MAZARI-MEDIA-API

A standalone backend project for handling media extraction (YouTube Video and Audio) for MAZARI-MD.

## Features
- Extensible architecture for media providers.
- YouTube Video metadata & media format resolution.
- YouTube Audio metadata & media format resolution.
- Health Check endpoint.
- Ready for cloud deployment.

## Requirements
- Node.js v14+
- (Optional) ffmpeg installed on the system if muxing becomes necessary later.

## Setup & Running Locally

1. Clone or copy the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` (configure `PORT` if needed).
4. Start the development server:
   ```bash
   npm run dev
   ```
   Or production:
   ```bash
   npm start
   ```

## API Endpoints

### 1. Health Check
`GET /api/health`
```json
{
  "success": true,
  "service": "MAZARI-MEDIA-API",
  "status": "online"
}
```

### 2. YouTube Video
`GET /api/youtube/video?url=<YOUTUBE_URL>`
```json
{
  "success": true,
  "type": "video",
  "title": "Video Title",
  "thumbnail": "https://i.ytimg.com/vi/.../hqdefault.jpg",
  "duration": 123,
  "quality": "720p",
  "url": "https://googlevideo.com/videoplayback?...",
  "filename": "Video_Title.mp4"
}
```

### 3. YouTube Audio
`GET /api/youtube/audio?url=<YOUTUBE_URL>`
```json
{
  "success": true,
  "type": "audio",
  "title": "Video Title",
  "thumbnail": "https://i.ytimg.com/vi/.../hqdefault.jpg",
  "duration": 123,
  "url": "https://googlevideo.com/videoplayback?...",
  "filename": "Video_Title.mp3",
  "mime": "audio/webm; codecs=\"opus\""
}
```

## Cloud Deployment (e.g. Render, Heroku)

1. Connect the repository to your host.
2. Set the Environment Variables (`PORT`).
3. Set Start Command: `npm start`.
4. Ensure your host supports outgoing connections to YouTube.

## Future Providers
Additional providers (TikTok, etc.) can be added by creating a new service in `services/` and routing in `routes/` following the existing pattern.
