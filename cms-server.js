import express from 'express';
import fs from 'fs/promises';
import fsSync from 'fs'; // Import sync fs methods
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3030;
// CONFIGURATION DE SECURITE
// Changez ce chemin pour rendre l'accès plus difficile
const ADMIN_PATH = '/sys-ops'; 

app.use(bodyParser.json());
app.use(express.static('public')); // Serve the main site assets if needed for preview, or just use absolute paths
app.use('/cms-assets', express.static('cms')); // Serve the CMS frontend assets

// Serve the CMS Entry Point
app.get(ADMIN_PATH, (req, res) => {
    res.sendFile(path.join(__dirname, 'cms', 'index.html'));
});

// API Routes to read/write JSON files
const ALLOWED_FILES = ['config.json', 'seo.json'];

app.get('/api/get', async (req, res) => {
    const fileName = req.query.file;
    if (!fileName || !ALLOWED_FILES.includes(fileName)) {
        return res.status(403).json({ error: 'Access denied to this file' });
    }
    
    try {
        const filePath = path.join(__dirname, 'public', fileName);
        const data = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error reading file' });
    }
});

app.post('/api/save', async (req, res) => {
    const fileName = req.query.file;
    if (!fileName || !ALLOWED_FILES.includes(fileName)) {
        return res.status(403).json({ error: 'Access denied to this file' });
    }

    try {
        const publicPath = path.join(__dirname, 'public', fileName);
        const distPath = path.join(__dirname, 'dist', fileName);
        
        const content = JSON.stringify(req.body, null, 4);

        // 1. Save to PUBLIC (Source of Truth)
        // Backup
        try { await fs.copyFile(publicPath, publicPath + '.bak'); } catch (e) {}
        await fs.writeFile(publicPath, content, 'utf-8');

        // 2. FORCE COPY TO DIST (Production)
        // Nginx serves from here, so this MUST succeed for live updates
        try {
            // Ensure dist directory exists
            await fs.mkdir(path.dirname(distPath), { recursive: true });
            
            await fs.writeFile(distPath, content, 'utf-8');
            console.log(`[SUCCESS] Updated production file at ${distPath}`);
        } catch (e) {
            console.error('[ERROR] Failed to update dist file:', e);
            // Don't fail the request, but log clearly
        }

        res.json({ success: true, message: 'File saved and deployed to dist.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error writing file' });
    }
});

// Auto-init variables
const configPath = path.join(__dirname, 'public', 'config.json');
const examplePath = path.join(__dirname, 'public', 'config.example.json');
const imagePath = path.join(__dirname, 'public', 'assets', 'preview.jpg');
const exampleImagePath = path.join(__dirname, 'public', 'assets', 'preview_example.jpg');

// 1. Config
if (!fsSync.existsSync(configPath) && fsSync.existsSync(examplePath)) {
    console.log('⚡ First run detected: Initializing config.json...');
    try {
        fsSync.copyFileSync(examplePath, configPath);
        console.log('✅ config.json initialized.');
    } catch (err) { console.error('❌ Failed config init:', err); }
}

// 2. Image Asset
if (!fsSync.existsSync(imagePath) && fsSync.existsSync(exampleImagePath)) {
    console.log('⚡ First run detected: Initializing preview.jpg...');
    try {
        // Ensure directory exists
        const assetsDir = path.dirname(imagePath);
        if (!fsSync.existsSync(assetsDir)) fsSync.mkdirSync(assetsDir, { recursive: true });
        
        fsSync.copyFileSync(exampleImagePath, imagePath);
        console.log('✅ preview.jpg initialized.');
    } catch (err) { console.error('❌ Failed image init:', err); }
}

// 3. SEO Config
const seoPath = path.join(__dirname, 'public', 'seo.json');
const exampleSeoPath = path.join(__dirname, 'public', 'seo.example.json');

if (!fsSync.existsSync(seoPath) && fsSync.existsSync(exampleSeoPath)) {
    console.log('⚡ First run detected: Initializing seo.json...');
    try {
        fsSync.copyFileSync(exampleSeoPath, seoPath);
        console.log('✅ seo.json initialized.');
    } catch (err) { console.error('❌ Failed seo init:', err); }
}

// 4. Robots & Sitemap
const robotsPath = path.join(__dirname, 'public', 'robots.txt');
const exampleRobotsPath = path.join(__dirname, 'public', 'robots.example.txt');
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
const exampleSitemapPath = path.join(__dirname, 'public', 'sitemap.example.xml');

if (!fsSync.existsSync(robotsPath) && fsSync.existsSync(exampleRobotsPath)) {
    try { fsSync.copyFileSync(exampleRobotsPath, robotsPath); console.log('✅ robots.txt initialized.'); } catch (e) {}
}
if (!fsSync.existsSync(sitemapPath) && fsSync.existsSync(exampleSitemapPath)) {
    try { fsSync.copyFileSync(exampleSitemapPath, sitemapPath); console.log('✅ sitemap.xml initialized.'); } catch (e) {}
}


app.listen(PORT, () => {
    console.log(`CMS Server running at http://localhost:${PORT}/sys-ops`);
    console.log(`
    ===========================================
    SYSTEM CONTROL PANEL ACTIVE
    ===========================================
    Url: http://localhost:${PORT}${ADMIN_PATH}
    
    Sécurité:
    - Le panneau est accessible uniquement via ce lien.
    - Appuyez sur Ctrl+C pour arrêter le serveur quand vous avez fini.
    ===========================================
    `);
});
