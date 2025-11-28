# 🚀 ConvertHub Pro - Production Deployment Guide

## 📊 Deployment Options

### Option 1: VPS Deployment (Recommended for Full Control)
**Cost**: ₹400-2000/month
**Providers**: DigitalOcean, Linode, Vultr, AWS EC2

### Option 2: Cloud Functions (For Scaling)
**Cost**: Pay-per-use
**Providers**: AWS Lambda, Google Cloud Functions, Azure Functions

### Option 3: Heroku (Easiest)
**Cost**: Free to ₹500/month
**Provider**: Heroku

---

## 🔧 OPTION 1: VPS Deployment (DigitalOcean)

### Step 1: Create Droplet

1. Sign up at https://www.digitalocean.com/
2. Create Droplet:
   - **OS**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($6/month - ₹500)
   - **Size**: 1GB RAM minimum
   - **Region**: Bangalore/Mumbai (for India)

### Step 2: Connect to Server

```bash
ssh root@YOUR_SERVER_IP
```

### Step 3: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install FFmpeg
apt install -y ffmpeg

# Install LibreOffice (optional)
apt install -y libreoffice

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Certbot (for SSL)
apt install -y certbot python3-certbot-nginx
```

### Step 4: Upload Project

```bash
# On your local machine:
scp -r /path/to/converthub-pro root@YOUR_SERVER_IP:/var/www/

# Or use Git:
# On server:
cd /var/www
git clone YOUR_REPO_URL converthub-pro
cd converthub-pro
```

### Step 5: Setup Project

```bash
cd /var/www/converthub-pro

# Install dependencies
npm install --production

# Create directories
mkdir -p uploads outputs

# Set permissions
chmod 755 uploads outputs
```

### Step 6: Configure PM2

```bash
# Start application
pm2 start server.js --name converthub

# Set PM2 to start on boot
pm2 startup
pm2 save

# Monitor logs
pm2 logs converthub
```

### Step 7: Configure Nginx

```bash
# Create Nginx config
nano /etc/nginx/sites-available/converthub
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Increase upload size
    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for large file uploads
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }
}
```

Enable site:
```bash
# Create symlink
ln -s /etc/nginx/sites-available/converthub /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 8: Setup SSL (HTTPS)

```bash
# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal test
certbot renew --dry-run
```

### Step 9: Update Frontend

Update `index.html` line 450:
```javascript
const API_URL = 'https://your-domain.com/api';
```

Upload updated index.html to server.

### Step 10: Setup Firewall

```bash
# Configure UFW
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 🌐 OPTION 2: Heroku Deployment

### Step 1: Prepare Files

Create `Procfile` in project root:
```
web: node server.js
```

Update `package.json`:
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### Step 2: Deploy

```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create converthub-pro

# Add buildpacks for FFmpeg
heroku buildpacks:add --index 1 https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
heroku buildpacks:add --index 2 heroku/nodejs

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Open app
heroku open
```

### Step 3: Environment Variables

```bash
heroku config:set NODE_ENV=production
```

---

## 🔐 Security Best Practices

### 1. Rate Limiting

Add to `server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

Install: `npm install express-rate-limit`

### 2. Helmet (Security Headers)

Add to `server.js`:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

Install: `npm install helmet`

### 3. File Type Validation

Add to `server.js`:
```javascript
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mp3/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Invalid file type'));
};
```

### 4. Environment Variables

Create `.env` file:
```env
PORT=3000
NODE_ENV=production
MAX_FILE_SIZE=104857600
UPLOAD_DIR=/var/www/converthub/uploads
OUTPUT_DIR=/var/www/converthub/outputs
```

Use in `server.js`:
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

Install: `npm install dotenv`

---

## 📊 Performance Optimization

### 1. Compression

```javascript
const compression = require('compression');
app.use(compression());
```

Install: `npm install compression`

### 2. Queue System for Heavy Jobs

```javascript
const Queue = require('bull');
const conversionQueue = new Queue('conversion', {
    redis: {
        host: 'localhost',
        port: 6379
    }
});

// Add job to queue
conversionQueue.add({ inputPath, outputPath, format });

// Process jobs
conversionQueue.process(async (job) => {
    // Conversion logic here
});
```

Install: `npm install bull redis`

### 3. Caching

```javascript
const redis = require('redis');
const client = redis.createClient();
```

---

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/converthub-pro
            git pull
            npm install
            pm2 restart converthub
```

---

## 📈 Monitoring

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Logs
pm2 logs converthub

# Status
pm2 status
```

### Log Management

```bash
# Install pm2-logrotate
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

---

## 💰 Cost Breakdown

### VPS (DigitalOcean):
- **Basic Droplet**: $6/month (₹500)
- **Domain**: $10/year (₹800)
- **Backup**: $1.20/month (₹100)
- **Total**: ~₹600/month

### Heroku:
- **Free Tier**: $0 (with sleep)
- **Hobby**: $7/month (₹600)
- **Professional**: $25/month (₹2100)

### AWS/GCP:
- **Varies based on usage**
- **Pay-per-request model**

---

## 🎯 Production Checklist

- [ ] SSL Certificate installed
- [ ] Rate limiting configured
- [ ] File size limits set
- [ ] Auto-cleanup scheduled
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Error logging enabled
- [ ] PM2 startup configured
- [ ] Firewall rules set
- [ ] Domain DNS configured
- [ ] Environment variables set
- [ ] Security headers added
- [ ] CORS properly configured

---

## 🆘 Troubleshooting Production

### High Memory Usage
```bash
# Check processes
pm2 status
top

# Restart if needed
pm2 restart converthub
```

### Disk Space Full
```bash
# Check space
df -h

# Clean old files
pm2 flush  # Clear logs
```

### Server Crash
```bash
# Check logs
pm2 logs converthub --lines 100

# Restart
pm2 restart converthub
```

### Slow Performance
- Enable Redis caching
- Implement queue system
- Increase server resources
- Add CDN for static files

---

## 📞 Support & Maintenance

### Regular Tasks:
1. **Weekly**: Check logs and disk space
2. **Monthly**: Update dependencies (`npm update`)
3. **Quarterly**: Security audit
4. **Yearly**: SSL certificate renewal (auto with Certbot)

### Updates:
```bash
cd /var/www/converthub-pro
git pull
npm install
pm2 restart converthub
```

---

**Your ConvertHub Pro is now production-ready! 🚀**
