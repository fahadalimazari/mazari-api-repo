FROM node:20-slim

# Install ffmpeg and python3 (yt-dlp fallback)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python-is-python3 \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Ensure temp directory exists and is writable
RUN mkdir -p temp && chmod 777 temp

EXPOSE 3000

# Start server
CMD [ "npm", "start" ]
