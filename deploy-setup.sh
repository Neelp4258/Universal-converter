#!/bin/bash

# 🚀 Universal Converter Backend Deployment Setup Script
# This script helps you prepare for deployment

set -e  # Exit on error

echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║   🚀 Universal Converter Backend Setup 🚀            ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if required files exist
echo "📋 Checking required files..."
FILES=("server.js" "backend-package.json" "Dockerfile" ".dockerignore" "index.html")
MISSING=0

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file found"
    else
        echo "  ❌ $file missing"
        MISSING=$((MISSING + 1))
    fi
done

if [ $MISSING -gt 0 ]; then
    echo ""
    echo "❌ Missing required files! Please ensure all files are present."
    exit 1
fi

echo ""
echo "✅ All required files present!"
echo ""

# Ask deployment platform
echo "📦 Choose your deployment platform:"
echo "  1. Render (Recommended - Free, Docker support)"
echo "  2. Railway (Easy - $5 credit/month)"
echo "  3. Fly.io (Advanced - Free tier)"
echo "  4. Skip (I'll deploy manually)"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🎯 Render Deployment Instructions:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1. Go to: https://render.com"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New +' → 'Web Service'"
        echo "4. Connect GitHub and select this repository"
        echo "5. Configure:"
        echo "   - Environment: Docker"
        echo "   - Instance Type: Free"
        echo "   - Dockerfile Path: Dockerfile"
        echo "6. Click 'Create Web Service'"
        echo "7. Wait ~10 minutes for deployment"
        echo "8. Copy your URL: https://your-app.onrender.com"
        echo ""
        echo "📝 Next: Update API_URL in index.html with your backend URL"
        echo ""
        ;;
    2)
        echo ""
        echo "🚂 Railway Deployment Instructions:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1. Go to: https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "4. Select this repository"
        echo "5. Railway auto-detects Dockerfile ✨"
        echo "6. Settings → Generate Domain"
        echo "7. Copy your URL"
        echo ""
        echo "📝 Next: Update API_URL in index.html with your backend URL"
        echo ""
        ;;
    3)
        echo ""
        echo "✈️  Fly.io Deployment Instructions:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1. Install flyctl:"
        echo "   curl -L https://fly.io/install.sh | sh"
        echo ""
        echo "2. Login:"
        echo "   fly auth login"
        echo ""
        echo "3. Launch:"
        echo "   fly launch"
        echo ""
        echo "4. Deploy:"
        echo "   fly deploy"
        echo ""
        echo "5. Get URL:"
        echo "   fly info"
        echo ""
        echo "📝 Next: Update API_URL in index.html with your backend URL"
        echo ""
        ;;
    4)
        echo ""
        echo "📖 Manual Deployment"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Read DEPLOYMENT-BACKEND-FULL.md for detailed instructions"
        echo ""
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

# Git status check
echo "🔍 Checking Git status..."
if git diff --quiet && git diff --cached --quiet; then
    echo "  ✅ No uncommitted changes"
else
    echo "  ⚠️  You have uncommitted changes"
    echo ""
    read -p "Do you want to commit and push now? (y/n): " commit_choice

    if [ "$commit_choice" = "y" ] || [ "$commit_choice" = "Y" ]; then
        echo ""
        echo "📦 Preparing commit..."

        # Add files
        git add Dockerfile .dockerignore backend-package.json render.yaml DEPLOYMENT-BACKEND-FULL.md deploy-setup.sh

        # Commit
        git commit -m "🚀 Add Docker deployment config with LibreOffice + FFmpeg support

- Add Dockerfile with LibreOffice and FFmpeg
- Add backend-package.json with all dependencies
- Add comprehensive deployment guide
- Ready for Render/Railway/Fly.io deployment"

        echo "✅ Changes committed!"
        echo ""

        # Push
        echo "Pushing to remote..."
        BRANCH=$(git branch --show-current)
        git push origin $BRANCH

        echo "✅ Changes pushed to origin/$BRANCH"
        echo ""
        echo "🎉 Your code is ready for deployment!"
        echo ""
    fi
fi

# Summary
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║   ✅ Setup Complete!                                 ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "📚 Next Steps:"
echo "  1. Deploy backend using your chosen platform"
echo "  2. Get your backend URL"
echo "  3. Update API_URL in index.html (line ~1067)"
echo "  4. Commit and push index.html"
echo "  5. Netlify auto-deploys your frontend"
echo "  6. Test all conversions!"
echo ""
echo "📖 Need help? Read:"
echo "  - DEPLOYMENT-BACKEND-FULL.md (comprehensive guide)"
echo "  - DEPLOYMENT-BACKEND.md (quick reference)"
echo ""
echo "🎉 Good luck with your deployment!"
echo ""
