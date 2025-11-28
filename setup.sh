#!/bin/bash

# ConvertHub Pro - Quick Setup Script
# This script installs dependencies and sets up the server

echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║        🚀 ConvertHub Pro Setup Script 🚀             ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "📦 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version) found"
echo ""

# Check npm
echo "📦 Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi
echo "✅ npm $(npm --version) found"
echo ""

# Check FFmpeg
echo "🎬 Checking FFmpeg installation..."
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg is not installed (required for video/audio conversion)"
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt install ffmpeg"
    echo "  macOS: brew install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/"
    echo ""
else
    echo "✅ FFmpeg found"
    echo ""
fi

# Check LibreOffice
echo "📄 Checking LibreOffice installation..."
if ! command -v libreoffice &> /dev/null; then
    echo "⚠️  LibreOffice is not installed (optional for advanced document conversion)"
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt install libreoffice"
    echo "  macOS: brew install --cask libreoffice"
    echo ""
else
    echo "✅ LibreOffice found"
    echo ""
fi

# Install npm packages
echo "📦 Installing Node.js packages..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi
echo "✅ Packages installed successfully"
echo ""

# Create directories
echo "📁 Creating required directories..."
mkdir -p uploads outputs
echo "✅ Directories created"
echo ""

echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║           ✅ Setup Complete! ✅                       ║"
echo "║                                                       ║"
echo "║   Run the server with:  npm start                    ║"
echo "║   Or for development:   npm run dev                  ║"
echo "║                                                       ║"
echo "║   Then open: http://localhost:3000                   ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
