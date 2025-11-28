# 🚀 Universal Converter Pro

Professional file conversion and compression platform with ultra-modern mobile-first design, user registration system, and corporate-grade UI/UX.

## ✨ Features

### Supported Conversions:

**🖼️ Images**
- PNG, JPG, JPEG, WEBP, HEIC, SVG, BMP, GIF, TIFF, ICO
- Quality adjustment (1-100%)
- Compression options
- Instant conversion

**📄 Documents**
- PDF, DOCX, DOC, TXT, HTML, MD, RTF
- Text extraction
- Format preservation
- Document compression

**🎬 Videos**
- MP4, AVI, MOV, MKV, WEBM, FLV, WMV
- High-quality encoding
- Format optimization
- Quality control

**🎵 Audio**
- MP3, WAV, OGG, AAC, FLAC, M4A, WMA
- Bitrate optimization
- Lossless conversion

**📦 Archives**
- ZIP, TAR, GZ, 7Z
- Extract and repackage
- Compression optimization
- Multi-level compression

**📊 Data**
- JSON, CSV, XML, YAML, XLSX, XLS
- Structure preservation
- Format validation

### 🎨 Design Features

- **Corporate Theme**: Professional blue, white, and grey color scheme
- **Ultra Mobile-Friendly**: Fully responsive, mobile-first design
- **Touch Optimized**: Perfect for tablets and smartphones
- **User Registration**: Optional login system with user profiles
- **Professional UI**: Modern, clean, and intuitive interface
- **100% Free**: No hidden fees, completely free to use forever

### 👤 User System

- **Guest Access**: Use without registration
- **Optional Registration**:
  - Full Name
  - Email Address
  - Contact Number
  - ID Number (optional)
  - Role Selection (Student, Employee, Freelancer, Developer, etc.)
- **User Profile**: Avatar with initials, personalized experience
- **Persistent Login**: LocalStorage-based authentication

## 🛠️ Installation

### Prerequisites

1. **Node.js** (v18 or higher)
   ```bash
   # Check if installed
   node --version
   npm --version
   ```

2. **FFmpeg** (Required for video/audio conversions)
   
   **Ubuntu/Debian:**
   ```bash
   sudo apt update
   sudo apt install ffmpeg
   ```
   
   **macOS:**
   ```bash
   brew install ffmpeg
   ```
   
   **Windows:**
   - Download from https://ffmpeg.org/download.html
   - Add to PATH

3. **LibreOffice** (Optional, for advanced document conversions)
   
   **Ubuntu/Debian:**
   ```bash
   sudo apt install libreoffice
   ```
   
   **macOS:**
   ```bash
   brew install --cask libreoffice
   ```

### Setup Steps

1. **Clone/Download the project**
   ```bash
   cd /path/to/converthub-pro
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser
   - Go to: `http://localhost:3000`

## 🌐 Deploy to Netlify

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your repository
   - Build settings are auto-detected from `netlify.toml`
   - Click "Deploy site"

3. **Your site is live!**
   - Get your free `.netlify.app` URL
   - Add custom domain if desired

### Manual Deploy

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## 🚀 Usage

1. **Select Conversion Type**
   - Click on any conversion card (Image, Document, Video, etc.)

2. **Upload File**
   - Drag & drop your file
   - Or click "Choose File" to browse

3. **Choose Output Format**
   - Select desired output format
   - Adjust quality settings (for images)

4. **Convert & Download**
   - Click "Convert Now"
   - Wait for processing
   - Download your converted file

## 📁 Project Structure

```
converthub-pro/
├── index.html          # Frontend UI (single file)
├── server.js           # Backend API server
├── package.json        # Node.js dependencies
├── README.md          # Documentation
├── uploads/           # Temporary upload storage (auto-created)
└── outputs/           # Converted files (auto-created)
```

## ⚙️ Configuration

### File Size Limits

Default: 100MB per file

To change, edit `server.js`:
```javascript
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // Change this value
    }
});
```

### Server Port

Default: 3000

To change, edit `server.js`:
```javascript
const PORT = 3000; // Change to your preferred port
```

Also update in `index.html`:
```javascript
const API_URL = 'http://localhost:3000/api'; // Update port here
```

### Auto-Cleanup

Files are automatically deleted after 1 hour. To change, edit `server.js`:
```javascript
const oneHour = 60 * 60 * 1000; // Change interval
```

## 🔧 API Endpoints

### POST `/api/convert`
Convert a file to different format

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: File to convert
  - `outputFormat`: Target format (e.g., 'png', 'mp4')
  - `type`: Conversion type ('image', 'video', 'audio', 'document', 'data', 'archive')
  - `quality`: (Optional) Quality setting for images (1-100)

**Response:**
```json
{
  "success": true,
  "filename": "converted-file.png",
  "message": "Conversion completed successfully"
}
```

### GET `/api/download/:filename`
Download converted file

**Request:**
- Method: `GET`
- URL: `/api/download/filename.ext`

**Response:**
- File download stream

### GET `/api/health`
Check server status

**Response:**
```json
{
  "status": "ok",
  "message": "ConvertHub Pro API is running"
}
```

## 🎨 Features Highlights

- ✅ **Mobile Responsive** - Works perfectly on all devices
- ✅ **Drag & Drop** - Easy file upload
- ✅ **Progress Tracking** - Real-time conversion status
- ✅ **Auto Cleanup** - Files deleted after download/1 hour
- ✅ **Quality Control** - Adjustable quality for images
- ✅ **Multiple Formats** - 30+ file formats supported
- ✅ **Secure** - Files processed server-side
- ✅ **Fast** - Optimized conversion algorithms
- ✅ **Professional UI** - Corporate-grade design

## 🚨 Troubleshooting

### FFmpeg not found
```bash
# Install FFmpeg
sudo apt install ffmpeg  # Ubuntu/Debian
brew install ffmpeg      # macOS
```

### LibreOffice conversion fails
```bash
# Install LibreOffice
sudo apt install libreoffice  # Ubuntu/Debian
```

### Port already in use
```bash
# Find and kill process using port 3000
sudo lsof -ti:3000 | xargs kill -9

# Or change port in server.js
```

### File upload fails
- Check file size (default limit: 100MB)
- Check disk space
- Verify uploads/ directory exists and is writable

### Image conversion fails
```bash
# Reinstall sharp
npm uninstall sharp
npm install sharp --ignore-scripts=false
```

## 📊 Performance Tips

1. **For Large Files:**
   - Increase file size limit in server.js
   - Use compression before uploading
   - Consider cloud storage for 500MB+ files

2. **For Multiple Conversions:**
   - Implement queue system (Bull + Redis)
   - Add worker processes
   - Use PM2 for process management

3. **For Production:**
   - Use reverse proxy (Nginx)
   - Enable HTTPS
   - Add rate limiting
   - Implement caching

## 🔐 Security Notes

- Files are auto-deleted after 1 hour
- No permanent storage of user data
- Server-side validation
- CORS enabled for API access
- File size limits enforced

## 📝 TODO / Future Enhancements

- [ ] Add batch conversion
- [ ] Implement queue system for heavy jobs
- [ ] Add user authentication
- [ ] Cloud storage integration (S3, Google Drive)
- [ ] Advanced PDF operations (merge, split)
- [ ] OCR for images
- [ ] Real-time progress tracking
- [ ] Conversion presets
- [ ] API rate limiting
- [ ] Docker containerization

## 💡 Deployment

### Deploy to VPS (DigitalOcean, Linode, etc.)

1. **Setup server:**
   ```bash
   ssh root@your-server-ip
   apt update && apt upgrade
   apt install nodejs npm ffmpeg libreoffice
   ```

2. **Upload files:**
   ```bash
   scp -r /local/path root@your-server-ip:/var/www/converthub
   ```

3. **Install & run:**
   ```bash
   cd /var/www/converthub
   npm install
   npm install -g pm2
   pm2 start server.js --name converthub
   pm2 startup
   pm2 save
   ```

4. **Setup Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Deploy to Cloud (Heroku, AWS, etc.)

See deployment guides for specific platforms.

## 📞 Support

For issues, questions, or suggestions:
- Email: support@trivantaedge.com
- GitHub Issues: [Create an issue]

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 🎯 Credits

Developed by **Trivanta Edge**
- Parking Automation Solutions
- Business Automation Tools
- Web Application Development

---

**Made with ❤️ for efficient file conversions**
