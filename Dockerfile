# Use Node.js 18 as base image
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    # LibreOffice for document conversion (DOC, DOCX, PDF, etc.)
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    # FFmpeg for video and audio conversion
    ffmpeg \
    # Utilities for archive handling
    zip \
    unzip \
    tar \
    # Clean up apt cache to reduce image size
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY backend-package.json ./package.json
COPY package-lock.json* ./

# Install Node.js dependencies
RUN npm install --production

# Copy server code
COPY server.js .
COPY index.html .

# Create necessary directories
RUN mkdir -p uploads outputs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server.js"]
