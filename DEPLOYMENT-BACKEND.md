# 🚀 Backend Deployment Guide

The Universal Converter Pro frontend works on Netlify, but for **video, audio, document conversions**, you need to deploy the backend (`server.js`) separately.

## ✅ What Works Without Backend

- ✅ **Image Conversions**: PNG ↔ JPG ↔ WEBP (client-side)
- ✅ **Quality Adjustment**: Full quality control
- ✅ **100% Free**: No server costs for basic image conversion

## 🔧 What Requires Backend

- ❌ Video conversions (requires FFmpeg)
- ❌ Audio conversions (requires FFmpeg)
- ❌ Document conversions (requires LibreOffice)
- ❌ Archive operations (requires system tools)
- ❌ Advanced image formats (HEIC, TIFF, etc.)

---

## 🌐 Backend Deployment Options

### Option 1: Render (Recommended - Free Tier)

**Cost**: FREE

1. **Create Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the Universal-converter repo

3. **Configure Service**
   - **Name**: `universal-converter-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

4. **Add Environment Variables** (if needed)
   - `PORT`: 3000 (auto-set by Render)
   - `NODE_ENV`: production

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment

6. **Get Your API URL**
   - Copy the URL: `https://universal-converter-api.onrender.com`

7. **Update Frontend**
   - In `index.html`, line 1067-1069, update:
   ```javascript
   const API_URL = window.location.hostname === 'localhost'
       ? 'http://localhost:3000/api'
       : 'https://universal-converter-api.onrender.com/api'; // Your Render URL
   ```
   - Commit and push to redeploy on Netlify

**Done!** 🎉

---

### Option 2: Railway (Easy - Free $5 Credit)

**Cost**: FREE $5/month credit

1. **Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose Universal-converter

3. **Configure**
   - Railway auto-detects Node.js
   - Add start command: `node server.js`

4. **Generate Domain**
   - Settings → Generate Domain
   - Copy URL: `https://universal-converter.up.railway.app`

5. **Update Frontend**
   - Update `API_URL` in `index.html` (line 1069)
   - Push changes

**Done!** 🚀

---

### Option 3: Heroku (Classic)

**Cost**: $5-7/month (Eco Dyno)

1. **Install Heroku CLI**
   ```bash
   # Mac
   brew tap heroku/brew && brew install heroku

   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create universal-converter-api
   ```

4. **Add FFmpeg Buildpack**
   ```bash
   heroku buildpacks:add --index 1 https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
   heroku buildpacks:add --index 2 heroku/nodejs
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Get URL**
   ```bash
   heroku open
   # Your URL: https://universal-converter-api.herokuapp.com
   ```

7. **Update Frontend**
   - Update `API_URL` in `index.html`
   - Push to GitHub (auto-deploys to Netlify)

---

### Option 4: Fly.io (Advanced)

**Cost**: FREE tier available

1. **Install flyctl**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Launch App**
   ```bash
   fly launch
   # Follow prompts
   ```

4. **Deploy**
   ```bash
   fly deploy
   ```

5. **Get URL**
   - URL: `https://universal-converter.fly.dev`

6. **Update Frontend**
   - Update `API_URL` in `index.html`

---

## 📝 After Backend Deployment

### 1. Update Frontend API URL

Edit `index.html` (around line 1067):

```javascript
// OLD (Netlify only - limited to images)
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api';

// NEW (with backend deployed)
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://YOUR-BACKEND-URL.com/api'; // ← Your deployed backend URL
```

### 2. Enable CORS on Backend

`server.js` already has CORS enabled:
```javascript
const cors = require('cors');
app.use(cors());
```

### 3. Test Backend

Visit: `https://your-backend-url.com/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "ConvertHub Pro API is running"
}
```

### 4. Commit and Push

```bash
git add index.html
git commit -m "Connect frontend to deployed backend"
git push origin main
```

Netlify will auto-deploy the update!

---

## 🔍 Troubleshooting

### Backend won't start
- Check logs: `heroku logs --tail` (or equivalent)
- Verify `package.json` has all dependencies
- Ensure `PORT` environment variable is set

### CORS errors
- Verify `cors()` is enabled in server.js
- Check backend URL is correct in frontend
- Ensure backend is accessible (not localhost)

### Conversions fail
- Video/Audio: Check FFmpeg is installed on server
- Documents: Check LibreOffice is available
- Check server logs for specific errors

### 502 Bad Gateway
- Backend server not running
- Check backend deployment status
- Verify backend URL is correct

---

## 💰 Cost Comparison

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Render** | ✅ 750hrs/month | $7/month |
| **Railway** | ✅ $5 credit | $5-20/month |
| **Fly.io** | ✅ Limited | $1.94/month |
| **Heroku** | ❌ | $5-7/month |

**Recommendation**: Start with **Render** (completely free)

---

## 🎯 Two-Deployment Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (Netlify)                     │
│  - Static HTML/CSS/JS                   │
│  - Client-side image conversion         │
│  - Free forever                         │
│  https://your-site.netlify.app          │
└──────────────┬──────────────────────────┘
               │ API Calls
               ▼
┌─────────────────────────────────────────┐
│  Backend (Render/Railway/Heroku)        │
│  - Node.js + Express                    │
│  - FFmpeg (video/audio)                 │
│  - LibreOffice (documents)              │
│  - Sharp (advanced images)              │
│  https://your-api.render.com            │
└─────────────────────────────────────────┘
```

---

## ✅ Quick Start Summary

1. **Deploy Frontend to Netlify** (Already done! ✓)
2. **Deploy Backend to Render** (5 minutes)
3. **Update API_URL in index.html** (1 line)
4. **Push to GitHub** (auto-deploys to Netlify)
5. **Done!** All conversions work! 🎉

---

## 📞 Need Help?

- Check server logs first
- Verify all environment variables
- Test backend health endpoint
- Ensure FFmpeg/LibreOffice are installed on server

**For Render/Railway**, FFmpeg is usually pre-installed!
