# ⚡ Backend Quick Start - 3 Steps to Full DOC Conversion

## 🎯 Goal
Deploy backend with LibreOffice + FFmpeg to enable:
- ✅ DOC ↔ PDF conversion
- ✅ Video/Audio conversion
- ✅ All file formats working

**Time**: 15 minutes | **Cost**: $0 (FREE)

---

## 🚀 Method 1: Render (Recommended)

### Step 1: Deploy (5 minutes)

1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +" → "Web Service"**
3. **Connect GitHub** → Select `Universal-converter` repo
4. **Configure**:
   - Environment: **Docker**
   - Instance Type: **Free**
   - Branch: `main`
5. Click **"Create Web Service"**
6. ⏳ Wait 10 minutes (watch logs - LibreOffice installing)

### Step 2: Get URL (1 minute)

7. Copy your URL: `https://universal-converter-backend.onrender.com`
8. Test: Visit `https://your-url.onrender.com/api/health`
   - Should see: `{"status":"ok"}`

### Step 3: Connect Frontend (2 minutes)

9. Open `index.html` → Find line ~1067:
   ```javascript
   const API_URL = window.location.hostname === 'localhost'
       ? 'http://localhost:3000/api'
       : '/api';  // ← CHANGE THIS
   ```

10. Update to YOUR backend URL:
    ```javascript
    const API_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api'
        : 'https://universal-converter-backend.onrender.com/api';  // ← YOUR URL HERE
    ```

11. **Save, commit, push**:
    ```bash
    git add index.html
    git commit -m "🔗 Connect to backend"
    git push origin main
    ```

12. ⏳ Wait 1 minute for Netlify to redeploy

### ✅ Done! Test:
- Visit your Netlify site
- Upload a DOC file
- Convert to PDF
- Should work! 🎉

---

## 🚂 Method 2: Railway (Easier, Faster)

### Step 1: Deploy (3 minutes)

1. Go to **https://railway.app** → Sign up with GitHub
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Select `Universal-converter`
4. Railway auto-detects Dockerfile ✨
5. **Settings** → **Generate Domain**
6. Copy URL: `https://universal-converter.up.railway.app`

### Step 2: Connect (same as Render)

Follow Step 3 from Method 1 above, but use your Railway URL instead.

**Cost**: $5/month credit (free tier)

---

## 🏃 Quick Commands

### Run Setup Script
```bash
./deploy-setup.sh
```
This interactive script guides you through deployment!

### Manual Git Push
```bash
git add .
git commit -m "🚀 Deploy backend with full DOC support"
git push origin main
```

---

## 🐛 Troubleshooting

### "Build failed"
→ Check Dockerfile is in root directory
→ Check build logs on Render/Railway

### "502 Bad Gateway"
→ Backend not running - check deployment status
→ Wait a few more minutes for first deployment

### "CORS error"
→ Wrong API_URL in index.html
→ Make sure you used YOUR backend URL (not example URL)

### "DOC conversion failed"
→ Backend deployed but LibreOffice not installed
→ Check Dockerfile has `apt-get install -y libreoffice`
→ Check build logs show LibreOffice installation

---

## 📝 Files Checklist

Make sure these exist:
- ✅ `Dockerfile` (has LibreOffice + FFmpeg)
- ✅ `backend-package.json` (dependencies)
- ✅ `.dockerignore` (optimization)
- ✅ `server.js` (backend code)
- ✅ All files pushed to GitHub

---

## 🎉 Success Indicators

Your deployment is successful when:

1. ✅ Health endpoint returns `{"status":"ok"}`
2. ✅ Image conversion works (instant)
3. ✅ DOC → PDF works (~5 seconds)
4. ✅ Video/Audio works (~10-30 seconds)
5. ✅ No errors in browser console

---

## 📚 Full Documentation

Need more details? Read:
- **DEPLOYMENT-BACKEND-FULL.md** - Complete guide with all options
- **DEPLOYMENT-BACKEND.md** - Original deployment guide
- **README.md** - Project overview

---

## ⚡ One-Liner Summary

1. Deploy to Render (Docker, FREE)
2. Copy backend URL
3. Update `API_URL` in `index.html`
4. Push to GitHub
5. Done! 🎉

**That's it!** Your converter now has full DOC/DOCX support with LibreOffice!
