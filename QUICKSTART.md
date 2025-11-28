# 🚀 ConvertHub Pro - QUICK START GUIDE

## 📥 What You Have

All files for a complete full-stack file conversion system:

1. **index.html** - Beautiful corporate UI (frontend)
2. **server.js** - Node.js backend API server
3. **package.json** - Dependencies configuration
4. **setup.sh** - Linux/Mac setup script
5. **setup.bat** - Windows setup script
6. **.gitignore** - Git ignore rules
7. **README.md** - Full documentation

## ⚡ FASTEST SETUP (3 Steps)

### Linux/Mac:
```bash
# 1. Run setup script
chmod +x setup.sh
./setup.sh

# 2. Start server
npm start

# 3. Open browser
# Go to: http://localhost:3000
```

### Windows:
```cmd
REM 1. Run setup script
setup.bat

REM 2. Start server
npm start

REM 3. Open browser
REM Go to: http://localhost:3000
```

## 📋 Manual Setup (If scripts don't work)

1. **Install Node.js** (if not installed)
   - Download from: https://nodejs.org/
   - Version 14 or higher required

2. **Install FFmpeg** (Required for video/audio)
   ```bash
   # Ubuntu/Debian
   sudo apt install ffmpeg
   
   # macOS
   brew install ffmpeg
   
   # Windows
   # Download from: https://ffmpeg.org/download.html
   # Add to PATH
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Create Directories**
   ```bash
   mkdir uploads outputs
   ```

5. **Start Server**
   ```bash
   npm start
   ```

6. **Open Browser**
   - Navigate to: http://localhost:3000

## ✅ What Works Out of the Box

- ✅ **Images**: PNG, JPG, WEBP, BMP, GIF, TIFF, ICO
- ✅ **Data**: JSON, CSV, XML, YAML
- ✅ **Archives**: ZIP, TAR, GZ (basic)
- ✅ **Documents**: TXT, HTML, MD (basic)

## 🔧 What Needs Additional Software

- **Video/Audio Conversions** → Requires FFmpeg
- **Advanced Document Conversions** → Requires LibreOffice
- **Advanced Archive** → Requires 7zip/unrar

## 🎯 First Test

1. Open http://localhost:3000 in browser
2. Click "Image Converter" card
3. Upload any PNG image
4. Select JPG format
5. Click "Convert Now"
6. Download converted file

## 📁 File Structure After Setup

```
converthub-pro/
├── index.html          ← Frontend UI
├── server.js           ← Backend server
├── package.json        ← Dependencies
├── README.md          ← Full docs
├── setup.sh           ← Linux/Mac setup
├── setup.bat          ← Windows setup
├── .gitignore         ← Git ignore
├── node_modules/      ← Auto-created (npm packages)
├── uploads/           ← Auto-created (temp uploads)
└── outputs/           ← Auto-created (converted files)
```

## 🚨 Common Issues

### "Cannot find module 'express'"
```bash
# Run:
npm install
```

### "Port 3000 already in use"
```bash
# Kill process on port 3000:
sudo lsof -ti:3000 | xargs kill -9

# Or change port in server.js (line 13)
```

### "FFmpeg not found" error
```bash
# Install FFmpeg (see step 2 above)
```

### Image conversion fails
```bash
# Reinstall sharp:
npm uninstall sharp
npm install sharp --ignore-scripts=false
```

## 🌐 Access from Other Devices

To access from phone/tablet on same network:

1. Find your local IP:
   ```bash
   # Linux/Mac
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Update index.html (line 450):
   ```javascript
   const API_URL = 'http://YOUR_LOCAL_IP:3000/api';
   ```

3. Access from other device:
   ```
   http://YOUR_LOCAL_IP:3000
   ```

## 💡 Tips

1. **File Size Limit**: Default 100MB (change in server.js line 35)
2. **Auto Cleanup**: Files deleted after 1 hour
3. **Security**: Files processed server-side
4. **Mobile**: Fully responsive design

## 📞 Need Help?

1. Check README.md for detailed documentation
2. Check server console for error messages
3. Test with small files first
4. Ensure all dependencies installed

## 🎉 You're Ready!

Your full-stack conversion hub is ready to use!

- Professional UI/UX ✅
- Server-side processing ✅
- Multiple formats ✅
- Mobile optimized ✅
- Auto cleanup ✅

**Enjoy converting files! 🚀**
