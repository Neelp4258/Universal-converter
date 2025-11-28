# 🚀 Complete Backend Deployment Guide with DOC Conversion

## 📋 Overview

This guide will help you deploy the backend server with **full DOC/DOCX conversion support** using LibreOffice, plus video/audio conversion using FFmpeg.

### ✅ What You'll Get
- ✅ **DOC ↔ PDF ↔ DOCX** conversion
- ✅ **Video conversion** (MP4, AVI, MOV, MKV, WEBM)
- ✅ **Audio conversion** (MP3, WAV, OGG, AAC, FLAC)
- ✅ **Advanced image formats** (HEIC, TIFF, BMP)
- ✅ **Archive operations** (ZIP, TAR, GZ)
- ✅ **100% Free** deployment options

---

## 🎯 Quick Start (Recommended: Render with Docker)

### Prerequisites
- GitHub account
- Your repository pushed to GitHub

### Step 1: Prepare Your Repository

Make sure these files are in your repo:
- ✅ `server.js` (backend server)
- ✅ `backend-package.json` (dependencies)
- ✅ `Dockerfile` (with LibreOffice + FFmpeg)
- ✅ `.dockerignore` (optimization)

### Step 2: Deploy to Render (FREE)

1. **Go to Render**: https://render.com
2. **Sign up** with your GitHub account
3. **Click "New +"** → **"Web Service"**
4. **Connect GitHub** and select your repository
5. **Configure Service**:
   - **Name**: `universal-converter-backend`
   - **Environment**: `Docker`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your branch)
   - **Instance Type**: `Free`

6. **Advanced Settings** (click to expand):
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Context**: `.`
   - **Auto-Deploy**: `Yes`

7. **Click "Create Web Service"**

8. **Wait for deployment** (5-15 minutes first time)
   - You'll see logs showing:
     - Installing LibreOffice ✓
     - Installing FFmpeg ✓
     - Building Node.js app ✓
     - Starting server ✓

9. **Get your URL**:
   - Example: `https://universal-converter-backend.onrender.com`
   - Test it: `https://your-url.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"ConvertHub Pro API is running"}`

### Step 3: Connect Frontend to Backend

1. **Open `index.html`** in your code editor

2. **Find the API_URL** (around line 1067):
   ```javascript
   const API_URL = window.location.hostname === 'localhost'
       ? 'http://localhost:3000/api'
       : '/api';
   ```

3. **Update to**:
   ```javascript
   const API_URL = window.location.hostname === 'localhost'
       ? 'http://localhost:3000/api'
       : 'https://universal-converter-backend.onrender.com/api'; // ← Your Render URL
   ```

4. **Commit and push**:
   ```bash
   git add index.html
   git commit -m "🔗 Connect frontend to backend with DOC conversion"
   git push origin main
   ```

5. **Netlify auto-deploys** - wait 1-2 minutes

### Step 4: Test Everything

Visit your Netlify site and test:
- ✅ **Images**: PNG → JPG (client-side, instant)
- ✅ **Documents**: DOC → PDF (backend, ~5 seconds)
- ✅ **Videos**: MP4 → WEBM (backend, ~10-30 seconds)
- ✅ **Audio**: MP3 → WAV (backend, ~3-5 seconds)

**🎉 Done! Everything works!**

---

## 🐳 Docker Deployment Explained

Our `Dockerfile` installs everything needed:

```dockerfile
# Base: Node.js 18
FROM node:18-bullseye

# Install LibreOffice (for DOC/DOCX/PDF)
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    ffmpeg \
    zip unzip tar

# Copy code and start server
COPY . .
RUN npm install
CMD ["node", "server.js"]
```

This gives you:
- **LibreOffice**: Converts DOC ↔ PDF ↔ DOCX ↔ TXT
- **FFmpeg**: Converts videos and audio
- **Archive tools**: ZIP, TAR, GZ operations

---

## 🔄 Alternative Deployment Options

### Option 2: Railway (Easy Docker Deployment)

1. **Create Account**: https://railway.app
2. **New Project** → **Deploy from GitHub**
3. **Select your repo**
4. **Railway auto-detects Dockerfile** ✨
5. **Generate Domain**: Settings → Generate Domain
6. **Copy URL**: `https://universal-converter.up.railway.app`
7. **Update `index.html`** with your Railway URL
8. **Push to GitHub**

**Cost**: $5/month credit (free tier)

---

### Option 3: Fly.io (Advanced, but Powerful)

1. **Install flyctl**:
   ```bash
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh

   # Windows
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login**:
   ```bash
   fly auth login
   ```

3. **Create fly.toml**:
   ```toml
   app = "universal-converter"
   primary_region = "iad"

   [build]
     dockerfile = "Dockerfile"

   [env]
     PORT = "3000"

   [[services]]
     internal_port = 3000
     protocol = "tcp"

     [[services.ports]]
       port = 80
       handlers = ["http"]

     [[services.ports]]
       port = 443
       handlers = ["tls", "http"]

   [[services.http_checks]]
     interval = 30000
     timeout = 2000
     grace_period = "10s"
     method = "get"
     path = "/api/health"
   ```

4. **Launch**:
   ```bash
   fly launch
   # Follow prompts, select region
   ```

5. **Deploy**:
   ```bash
   fly deploy
   ```

6. **Get URL**:
   ```bash
   fly info
   # URL: https://universal-converter.fly.dev
   ```

7. **Update `index.html`** and push

**Cost**: Free tier with 3 VMs

---

## 🛠️ Local Testing (Before Deployment)

Want to test locally first?

### 1. Install Dependencies

#### Mac:
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install LibreOffice and FFmpeg
brew install --cask libreoffice
brew install ffmpeg

# Verify
libreoffice --version
ffmpeg -version
```

#### Ubuntu/Debian:
```bash
# Install LibreOffice and FFmpeg
sudo apt-get update
sudo apt-get install -y libreoffice ffmpeg

# Verify
libreoffice --version
ffmpeg -version
```

#### Windows:
```powershell
# Install using Chocolatey
choco install libreoffice ffmpeg

# Or download manually:
# LibreOffice: https://www.libreoffice.org/download/download/
# FFmpeg: https://ffmpeg.org/download.html
```

### 2. Run Locally

```bash
# Use the backend package.json
cp backend-package.json package.json

# Install Node dependencies
npm install

# Start server
npm start
```

Visit: http://localhost:3000/api/health

### 3. Test Conversions

```bash
# Test image (using curl)
curl -X POST http://localhost:3000/api/convert \
  -F "file=@test.png" \
  -F "outputFormat=jpg" \
  -F "type=image"

# Test document (DOC to PDF)
curl -X POST http://localhost:3000/api/convert \
  -F "file=@test.doc" \
  -F "outputFormat=pdf" \
  -F "type=document"
```

---

## 📊 DOC Conversion Formats Supported

With LibreOffice installed, you can convert:

### From DOC/DOCX:
- ✅ DOC → PDF
- ✅ DOC → TXT
- ✅ DOC → HTML
- ✅ DOCX → PDF
- ✅ DOCX → DOC
- ✅ DOCX → ODT (OpenDocument)

### To DOC/DOCX:
- ✅ PDF → DOC (via text extraction)
- ✅ TXT → DOC
- ✅ HTML → DOC
- ✅ ODT → DOCX

### Other Document Formats:
- ✅ XLS ↔ XLSX ↔ CSV ↔ PDF (spreadsheets)
- ✅ PPT ↔ PPTX ↔ PDF (presentations)
- ✅ RTF ↔ DOC ↔ PDF

---

## 🔍 Troubleshooting

### Backend Deployment Fails

**Error**: "Build failed"
```bash
# Check build logs on Render/Railway
# Usually missing Dockerfile or wrong path
```

**Solution**: Ensure `Dockerfile` is in root directory

---

### LibreOffice Not Found

**Error**: "Document conversion requires LibreOffice"

**Solution**:
1. Check Dockerfile includes LibreOffice installation
2. Verify build logs show LibreOffice installation
3. SSH into server and check: `libreoffice --version`

For Render:
```bash
# In Dockerfile, ensure this line exists:
RUN apt-get install -y libreoffice libreoffice-writer
```

---

### FFmpeg Not Found

**Error**: "Video conversion failed. Make sure FFmpeg is installed."

**Solution**:
1. Check Dockerfile includes FFmpeg
2. Verify in build logs: "Setting up ffmpeg"
3. Test: `ffmpeg -version`

---

### CORS Errors

**Error**: "Access to fetch blocked by CORS policy"

**Solution**:
1. Verify `server.js` has CORS enabled (line 16):
   ```javascript
   app.use(cors());
   ```

2. Check frontend API_URL is correct

3. Ensure backend is deployed (not localhost)

---

### Conversion Timeout

**Error**: "Request timed out"

**Solution**:
- Large files take longer (up to 60 seconds)
- Increase timeout in frontend (index.html):
  ```javascript
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes

  fetch(API_URL + '/convert', {
      signal: controller.signal,
      // ...
  });
  ```

---

### Free Tier Limitations

**Render Free Tier**:
- ⚠️ Server sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes ~30 seconds
- ⚠️ 750 hours/month limit

**Solution**: Upgrade to $7/month plan, or use Railway

---

## 💰 Cost Comparison (with Docker)

| Platform | Free Tier | Pros | Cons |
|----------|-----------|------|------|
| **Render** | ✅ 750hrs/month | Easy, Docker support, Auto-deploy | Sleeps after 15min inactivity |
| **Railway** | ✅ $5 credit/mo | Very easy, Fast, No sleep | Credit runs out faster |
| **Fly.io** | ✅ 3 VMs free | No sleep, Fast, Global CDN | More complex setup |
| **Heroku** | ❌ No free tier | Easy, Reliable | $7/month minimum |

**Recommendation**:
- **Personal use**: Render (free)
- **Professional**: Railway ($5-10/month) or Fly.io

---

## 🔐 Security Best Practices

1. **File Size Limits**: Already set to 100MB in server.js
2. **File Type Validation**: Server validates file types
3. **Auto Cleanup**: Files deleted after 1 hour
4. **CORS**: Restricted to your frontend domain (optional)

To restrict CORS to your domain only:
```javascript
// In server.js, replace:
app.use(cors());

// With:
app.use(cors({
    origin: 'https://your-site.netlify.app'
}));
```

---

## 📈 Performance Optimization

### Caching
Add caching headers in `server.js`:
```javascript
app.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=31536000');
    next();
});
```

### Compression
Install and use compression:
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### Keep-Alive (Render)
Prevent server from sleeping:
```javascript
// Add to server.js
setInterval(() => {
    fetch('https://your-backend.onrender.com/api/health')
        .catch(err => console.log('Keep-alive ping failed'));
}, 14 * 60 * 1000); // Every 14 minutes
```

Or use external service: https://uptimerobot.com (free)

---

## ✅ Deployment Checklist

- [ ] `Dockerfile` created with LibreOffice + FFmpeg
- [ ] `backend-package.json` with all dependencies
- [ ] `.dockerignore` to exclude unnecessary files
- [ ] Pushed all files to GitHub
- [ ] Created Render/Railway account
- [ ] Deployed backend service
- [ ] Verified `/api/health` endpoint works
- [ ] Updated `API_URL` in `index.html`
- [ ] Pushed frontend changes to GitHub
- [ ] Netlify auto-deployed
- [ ] Tested image conversion (should work client-side)
- [ ] Tested DOC → PDF conversion (should work via backend)
- [ ] Tested video/audio conversion (should work via backend)

---

## 🎉 Success Indicators

Your backend is fully working when:

1. ✅ Health endpoint returns 200: `https://your-backend.com/api/health`
2. ✅ Image conversions work (instant, client-side)
3. ✅ DOC → PDF works (~5-10 seconds)
4. ✅ PDF → DOC works (~10-15 seconds)
5. ✅ Video conversions work (~20-60 seconds)
6. ✅ Audio conversions work (~5-10 seconds)
7. ✅ No CORS errors in browser console
8. ✅ Files download successfully after conversion

---

## 🆘 Still Need Help?

### Check Logs

**Render**:
1. Dashboard → Your Service → Logs tab
2. Look for errors mentioning LibreOffice or FFmpeg

**Railway**:
1. Project → Deployment → View Logs
2. Check build and runtime logs

**Fly.io**:
```bash
fly logs
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "LibreOffice not found" | Not installed | Check Dockerfile |
| "FFmpeg not found" | Not installed | Check Dockerfile |
| "502 Bad Gateway" | Server not running | Check deployment status |
| "CORS error" | Wrong API URL | Update index.html |
| "File too large" | >100MB file | Increase limit or use smaller file |
| "Conversion timeout" | File too complex | Increase timeout or simplify file |

---

## 📚 Additional Resources

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **Fly.io Docs**: https://fly.io/docs
- **LibreOffice CLI**: https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html
- **FFmpeg Docs**: https://ffmpeg.org/documentation.html

---

## 🚀 Quick Deploy Commands

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/Universal-converter.git
cd Universal-converter

# Ensure all files are present
ls -la Dockerfile backend-package.json .dockerignore

# Push to GitHub (triggers Render/Railway auto-deploy)
git add .
git commit -m "🚀 Deploy backend with LibreOffice support"
git push origin main

# Your backend deploys automatically!
# Get URL from Render/Railway dashboard
# Update index.html with backend URL
# Push again - done!
```

---

## 🎯 Summary

**3 Steps to Full Functionality:**

1. **Deploy Backend** (Render + Docker) → 10 minutes
2. **Update Frontend** (API_URL in index.html) → 1 minute
3. **Test Everything** → 2 minutes

**Total Time**: ~15 minutes
**Total Cost**: $0 (free tier)

**You get**:
- ✅ All file conversions working
- ✅ DOC/DOCX support via LibreOffice
- ✅ Video/Audio support via FFmpeg
- ✅ Professional, fast, reliable
- ✅ 100% FREE

---

**Ready to deploy? Start with Step 1 above!** 🚀
