const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create necessary directories
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const OUTPUT_DIR = path.join(__dirname, 'outputs');

[UPLOAD_DIR, OUTPUT_DIR].forEach(dir => {
    if (!fsSync.existsSync(dir)) {
        fsSync.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

// Helper function to get file extension
function getExtension(filename) {
    return path.extname(filename).toLowerCase().slice(1);
}

// Helper function to clean up old files (runs every hour)
setInterval(async () => {
    try {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        for (const dir of [UPLOAD_DIR, OUTPUT_DIR]) {
            const files = await fs.readdir(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = await fs.stat(filePath);
                if (now - stats.mtimeMs > oneHour) {
                    await fs.unlink(filePath);
                    console.log(`Cleaned up old file: ${file}`);
                }
            }
        }
    } catch (error) {
        console.error('Cleanup error:', error);
    }
}, 60 * 60 * 1000);

// IMAGE CONVERSION
async function convertImage(inputPath, outputPath, format, quality = 80) {
    try {
        let sharpInstance = sharp(inputPath);
        
        switch (format) {
            case 'jpg':
            case 'jpeg':
                await sharpInstance.jpeg({ quality: parseInt(quality) }).toFile(outputPath);
                break;
            case 'png':
                await sharpInstance.png({ quality: parseInt(quality) }).toFile(outputPath);
                break;
            case 'webp':
                await sharpInstance.webp({ quality: parseInt(quality) }).toFile(outputPath);
                break;
            case 'bmp':
                await sharpInstance.toFormat('bmp').toFile(outputPath);
                break;
            case 'gif':
                await sharpInstance.gif().toFile(outputPath);
                break;
            case 'tiff':
                await sharpInstance.tiff({ quality: parseInt(quality) }).toFile(outputPath);
                break;
            case 'ico':
                await sharpInstance.resize(256, 256).toFormat('png').toFile(outputPath);
                break;
            default:
                throw new Error('Unsupported image format');
        }
        return true;
    } catch (error) {
        console.error('Image conversion error:', error);
        throw error;
    }
}

// VIDEO CONVERSION
async function convertVideo(inputPath, outputPath, format) {
    try {
        const formatMap = {
            'mp4': 'mp4',
            'avi': 'avi',
            'mov': 'mov',
            'mkv': 'matroska',
            'webm': 'webm',
            'flv': 'flv'
        };

        const outputFormat = formatMap[format] || format;
        const command = `ffmpeg -i "${inputPath}" -c:v libx264 -c:a aac "${outputPath}"`;
        
        await execPromise(command);
        return true;
    } catch (error) {
        console.error('Video conversion error:', error);
        throw new Error('Video conversion failed. Make sure FFmpeg is installed.');
    }
}

// AUDIO CONVERSION
async function convertAudio(inputPath, outputPath, format) {
    try {
        const formatMap = {
            'mp3': 'libmp3lame',
            'wav': 'pcm_s16le',
            'ogg': 'libvorbis',
            'aac': 'aac',
            'flac': 'flac',
            'm4a': 'aac'
        };

        const codec = formatMap[format] || 'copy';
        const command = `ffmpeg -i "${inputPath}" -acodec ${codec} "${outputPath}"`;
        
        await execPromise(command);
        return true;
    } catch (error) {
        console.error('Audio conversion error:', error);
        throw new Error('Audio conversion failed. Make sure FFmpeg is installed.');
    }
}

// DOCUMENT CONVERSION
async function convertDocument(inputPath, outputPath, format) {
    try {
        const inputExt = getExtension(inputPath);
        const content = await fs.readFile(inputPath, 'utf8');

        if (format === 'txt') {
            // Simple text conversion
            await fs.writeFile(outputPath, content);
            return true;
        }

        if (format === 'html' && inputExt === 'md') {
            // Markdown to HTML (basic conversion)
            const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; line-height: 1.6; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <pre>${content}</pre>
</body>
</html>`;
            await fs.writeFile(outputPath, html);
            return true;
        }

        if (format === 'pdf') {
            // For PDF conversion, we'd need puppeteer or similar
            throw new Error('PDF conversion requires additional setup. Use LibreOffice or Puppeteer.');
        }

        // For other formats, try LibreOffice if available
        try {
            const loCommand = `libreoffice --headless --convert-to ${format} --outdir "${path.dirname(outputPath)}" "${inputPath}"`;
            await execPromise(loCommand);
            
            // LibreOffice might create file with different name
            const baseName = path.basename(inputPath, path.extname(inputPath));
            const expectedOutput = path.join(path.dirname(outputPath), `${baseName}.${format}`);
            
            if (fsSync.existsSync(expectedOutput)) {
                await fs.rename(expectedOutput, outputPath);
            }
            return true;
        } catch (loError) {
            throw new Error('Document conversion requires LibreOffice to be installed.');
        }
    } catch (error) {
        console.error('Document conversion error:', error);
        throw error;
    }
}

// DATA FORMAT CONVERSION
async function convertData(inputPath, outputPath, format) {
    try {
        const content = await fs.readFile(inputPath, 'utf8');
        const inputExt = getExtension(inputPath);
        
        let data;
        
        // Parse input
        if (inputExt === 'json') {
            data = JSON.parse(content);
        } else if (inputExt === 'csv') {
            // Simple CSV parsing
            const lines = content.trim().split('\n');
            const headers = lines[0].split(',');
            data = lines.slice(1).map(line => {
                const values = line.split(',');
                const obj = {};
                headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
                return obj;
            });
        } else if (inputExt === 'xml') {
            // Basic XML to JSON
            data = { xml: content };
        }

        // Convert to output format
        if (format === 'json') {
            await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
        } else if (format === 'csv') {
            // JSON to CSV
            if (Array.isArray(data) && data.length > 0) {
                const headers = Object.keys(data[0]);
                const csvContent = [
                    headers.join(','),
                    ...data.map(row => headers.map(h => row[h]).join(','))
                ].join('\n');
                await fs.writeFile(outputPath, csvContent);
            }
        } else if (format === 'xml') {
            // Simple JSON to XML
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
${JSON.stringify(data, null, 2)}
</root>`;
            await fs.writeFile(outputPath, xml);
        } else if (format === 'yaml') {
            // Simple YAML output
            const yaml = JSON.stringify(data, null, 2)
                .replace(/[{}"]/g, '')
                .replace(/,/g, '');
            await fs.writeFile(outputPath, yaml);
        }

        return true;
    } catch (error) {
        console.error('Data conversion error:', error);
        throw error;
    }
}

// ARCHIVE CONVERSION
async function convertArchive(inputPath, outputPath, format) {
    try {
        const inputExt = getExtension(inputPath);
        
        if (format === 'zip') {
            // Extract and re-compress as ZIP
            const tempDir = path.join(UPLOAD_DIR, `temp-${Date.now()}`);
            await fs.mkdir(tempDir, { recursive: true });
            
            // Extract
            if (inputExt === 'tar' || inputExt === 'gz') {
                await execPromise(`tar -xf "${inputPath}" -C "${tempDir}"`);
            } else if (inputExt === 'zip') {
                await execPromise(`unzip -q "${inputPath}" -d "${tempDir}"`);
            }
            
            // Create ZIP
            const outputName = path.basename(outputPath);
            await execPromise(`cd "${tempDir}" && zip -r "${outputPath}" .`);
            
            // Cleanup
            await fs.rm(tempDir, { recursive: true, force: true });
            return true;
        }
        
        if (format === 'tar' || format === 'gz') {
            const tempDir = path.join(UPLOAD_DIR, `temp-${Date.now()}`);
            await fs.mkdir(tempDir, { recursive: true });
            
            // Extract first
            if (inputExt === 'zip') {
                await execPromise(`unzip -q "${inputPath}" -d "${tempDir}"`);
            }
            
            // Create tar/gz
            const tarFlag = format === 'gz' ? 'czf' : 'cf';
            await execPromise(`tar -${tarFlag} "${outputPath}" -C "${tempDir}" .`);
            
            // Cleanup
            await fs.rm(tempDir, { recursive: true, force: true });
            return true;
        }

        throw new Error('Archive conversion requires 7zip or tar utilities');
    } catch (error) {
        console.error('Archive conversion error:', error);
        throw error;
    }
}

// Main conversion endpoint
app.post('/api/convert', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { outputFormat, type, quality } = req.body;
        const inputPath = req.file.path;
        const outputFilename = `${Date.now()}-${path.basename(req.file.originalname, path.extname(req.file.originalname))}.${outputFormat}`;
        const outputPath = path.join(OUTPUT_DIR, outputFilename);

        console.log(`Converting ${type} from ${inputPath} to ${outputPath}`);

        // Route to appropriate converter
        switch (type) {
            case 'image':
                await convertImage(inputPath, outputPath, outputFormat, quality);
                break;
            case 'video':
                await convertVideo(inputPath, outputPath, outputFormat);
                break;
            case 'audio':
                await convertAudio(inputPath, outputPath, outputFormat);
                break;
            case 'document':
                await convertDocument(inputPath, outputPath, outputFormat);
                break;
            case 'data':
                await convertData(inputPath, outputPath, outputFormat);
                break;
            case 'archive':
                await convertArchive(inputPath, outputPath, outputFormat);
                break;
            default:
                throw new Error('Unsupported conversion type');
        }

        // Clean up input file
        await fs.unlink(inputPath);

        res.json({
            success: true,
            filename: outputFilename,
            message: 'Conversion completed successfully'
        });

    } catch (error) {
        console.error('Conversion error:', error);
        
        // Clean up files on error
        if (req.file && fsSync.existsSync(req.file.path)) {
            await fs.unlink(req.file.path).catch(console.error);
        }

        res.status(500).json({
            error: error.message || 'Conversion failed',
            details: error.toString()
        });
    }
});

// Download endpoint
app.get('/api/download/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(OUTPUT_DIR, filename);

        if (!fsSync.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.download(filePath, filename, async (err) => {
            if (err) {
                console.error('Download error:', err);
            }
            // Clean up file after download
            setTimeout(async () => {
                try {
                    await fs.unlink(filePath);
                } catch (e) {
                    console.error('Cleanup error:', e);
                }
            }, 5000);
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Download failed' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ConvertHub Pro API is running' });
});

// Serve static files (for production)
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        🚀 ConvertHub Pro Server Running! 🚀          ║
║                                                       ║
║   Server: http://localhost:${PORT}                      ║
║   API:    http://localhost:${PORT}/api                  ║
║                                                       ║
║   Open index.html in your browser to get started!    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
});
