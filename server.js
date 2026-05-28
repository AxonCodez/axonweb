const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'graphics');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Helper: read/write data
const DATA_PATH = path.join(__dirname, 'data', 'portfolio.json');

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// ==================== AUTH ====================
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  const data = readData();
  if (password === data.adminPassword) {
    res.json({ success: true, token: 'axon-admin-' + Date.now() });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// Simple auth middleware (checks header)
function authMiddleware(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token && token.startsWith('axon-admin-')) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// ==================== PROJECTS API ====================
app.get('/api/projects', (req, res) => {
  const data = readData();
  res.json(data.projects);
});

app.post('/api/projects', authMiddleware, (req, res) => {
  const data = readData();
  const { name, url, description } = req.body;
  const newProject = {
    id: Date.now().toString(),
    name,
    url,
    description: description || ''
  };
  data.projects.push(newProject);
  writeData(data);
  res.json(newProject);
});

app.put('/api/projects/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });

  const { name, url, description } = req.body;
  data.projects[idx] = { ...data.projects[idx], name, url, description };
  writeData(data);
  res.json(data.projects[idx]);
});

app.delete('/api/projects/:id', authMiddleware, (req, res) => {
  const data = readData();
  data.projects = data.projects.filter(p => p.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

// ==================== GRAPHICS API ====================
app.get('/api/graphics', (req, res) => {
  const data = readData();
  res.json(data.graphics);
});

app.get('/api/graphics/:category', (req, res) => {
  const data = readData();
  const category = req.params.category;
  res.json(data.graphics[category] || []);
});

// Add image URL to a category
app.post('/api/graphics/:category/url', authMiddleware, (req, res) => {
  const data = readData();
  const { category } = req.params;
  const { url } = req.body;

  if (!data.graphics[category]) {
    data.graphics[category] = [];
  }
  data.graphics[category].push(url);
  writeData(data);
  res.json({ success: true, images: data.graphics[category] });
});

// Upload image file to a category
app.post('/api/graphics/:category/upload', authMiddleware, upload.single('image'), (req, res) => {
  const data = readData();
  const { category } = req.params;

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const imageUrl = `/uploads/graphics/${req.file.filename}`;
  if (!data.graphics[category]) {
    data.graphics[category] = [];
  }
  data.graphics[category].push(imageUrl);
  writeData(data);
  res.json({ success: true, url: imageUrl, images: data.graphics[category] });
});

// Delete image from a category (by index)
app.delete('/api/graphics/:category/:index', authMiddleware, (req, res) => {
  const data = readData();
  const { category, index } = req.params;
  const idx = parseInt(index);

  if (!data.graphics[category] || idx < 0 || idx >= data.graphics[category].length) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // If it's a local uploaded file, delete it
  const imgUrl = data.graphics[category][idx];
  if (imgUrl.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, imgUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  data.graphics[category].splice(idx, 1);
  writeData(data);
  res.json({ success: true, images: data.graphics[category] });
});

// Add new category
app.post('/api/graphics-category', authMiddleware, (req, res) => {
  const data = readData();
  const { name } = req.body;
  const key = name.toLowerCase().replace(/\s+/g, '_');

  if (data.graphics[key]) {
    return res.status(400).json({ error: 'Category already exists' });
  }
  data.graphics[key] = [];
  writeData(data);
  res.json({ success: true, categories: Object.keys(data.graphics) });
});

// Delete category
app.delete('/api/graphics-category/:category', authMiddleware, (req, res) => {
  const data = readData();
  const { category } = req.params;

  if (!data.graphics[category]) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Clean up local files
  data.graphics[category].forEach(imgUrl => {
    if (imgUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, imgUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });

  delete data.graphics[category];
  writeData(data);
  res.json({ success: true });
});

// ==================== ADMIN PAGE ====================
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n  ⚡ Axon Portfolio Server running at http://localhost:${PORT}`);
  console.log(`  🔧 Admin Dashboard at http://localhost:${PORT}/admin\n`);
});
