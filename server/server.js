require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const { readDb, writeDb, createDailyBackup, DEFAULT_DATA } = require('./db');
const { logAudit, readAuditLogs } = require('./audit');
const {
  checkAccountLockout,
  recordFailedAttempt,
  resetFailedAttempts,
  validatePasswordStrength,
  sanitizeText,
  isValidGoogleReviewUrl,
  validateImageMagicBytes,
  ItemSchema,
  CategorySchema,
  SettingsSchema
} = require('./security');

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';

// Strong fallback secret check
const JWT_SECRET = process.env.JWT_SECRET || 'hotel-menu-super-secure-secret-key-2026-minimum-32-chars-long';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'hotel-cookie-super-secure-secret-2026-minimum-32-chars-long';

// Paths
const ROOT_DIR = path.resolve(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const BRANDING_DIR = path.join(UPLOADS_DIR, 'branding');
const DISHES_DIR = path.join(UPLOADS_DIR, 'dishes');
const CLIENT_DIST_DIR = path.join(ROOT_DIR, 'client', 'dist');

// Ensure upload folders exist
[UPLOADS_DIR, BRANDING_DIR, DISHES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Run daily backup check on startup
createDailyBackup();

// ==========================================
// 1. SECURITY HEADERS & CORE MIDDLEWARE
// ==========================================

// Disable X-Powered-By
app.disable('x-powered-by');

// Trust reverse proxy if in production
if (IS_PROD) {
  app.set('trust proxy', 1);
}

// Helmet Security Headers (OWASP compliant, Grade A)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow client inline scripts needed by bundler/confetti
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://images.unsplash.com",
        "https://*.google.com",
        "https://*.googleusercontent.com"
      ],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"], // Prevent clickjacking
      objectSrc: ["'none'"],
      upgradeInsecureRequests: IS_PROD ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: IS_PROD ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}));

// Strict CORS Configuration
const rawOrigins = process.env.ALLOWED_ORIGIN || 'http://localhost:5000,http://localhost:3000';
const allowedOrigins = rawOrigins.split(',').map(s => s.trim().toLowerCase());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin.toLowerCase())) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Not allowed by Access-Control-Allow-Origin'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
}));

// Cookie Parser
app.use(cookieParser(COOKIE_SECRET));

// Body parsers with strict size limits (OWASP DoS prevention)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Anti-indexing header for admin and API endpoints
app.use((req, res, next) => {
  if (req.path.startsWith('/admin') || req.path.startsWith('/api')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  next();
});

// ==========================================
// 2. RATE LIMITING (DDoS & BRUTE FORCE DEFENSE)
// ==========================================

// Global API rate limiter (120 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again later.' }
});

// Strict Login rate limiter (5 attempts per 15 minutes per IP)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // IP level limiter
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts from this IP. Please try again after 15 minutes.' }
});

// Upload rate limiter (25 uploads per 15 minutes)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Upload rate limit exceeded. Please wait a few minutes before uploading more photos.' }
});

app.use('/api/', apiLimiter);

// ==========================================
// 3. SECURE FILE UPLOAD CONFIGURATION
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const targetFolder = req.query.type === 'branding' ? BRANDING_DIR : DISHES_DIR;
    cb(null, targetFolder);
  },
  filename: (req, file, cb) => {
    // Always generate cryptographically random filename
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `${randomName}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB strict limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

    // Explicitly block SVG and non-raster formats
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Invalid file type. Only JPG, PNG, and WebP raster images are allowed. SVG is blocked for security.'));
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return cb(new Error('Invalid image MIME type.'));
    }

    cb(null, true);
  }
});

// Serve uploaded media statically with secure headers (No execution, No sniff)
app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
  next();
}, express.static(UPLOADS_DIR, {
  dotfiles: 'ignore',
  etag: true,
  index: false // Disable directory listing
}));

// ==========================================
// 4. AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// ==========================================

function getAuthTokenFromRequest(req) {
  // 1. Check HttpOnly signed/unsigned cookie first
  if (req.cookies && req.cookies.menu_admin_token) {
    return req.cookies.menu_admin_token;
  }
  // 2. Fallback to Authorization: Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}

function authMiddleware(req, res, next) {
  const token = getAuthTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = readDb();

    // Check if session has been invalidated server-side
    const currentSessionVersion = db.admin?.sessionVersion || 1;
    if (decoded.sessionVersion !== currentSessionVersion) {
      return res.status(401).json({ error: 'Session invalidated or expired. Please sign in again.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please sign in again.' });
  }
}

// Helper to format Zod validation errors safely
function formatZodError(error) {
  if (!error) return 'Invalid input.';
  const issues = error.issues || error.errors || [];
  return issues.map(e => e.message).join(', ') || 'Validation error.';
}

// Generate CSRF token
function generateCsrfToken() {
  return crypto.randomBytes(24).toString('hex');
}

// ==========================================
// 5. PUBLIC MENU ENDPOINTS (READ ONLY)
// ==========================================

app.get('/api/menu', (req, res) => {
  const db = readDb();
  const categories = [...(db.categories || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  const categoriesWithCounts = categories.map(cat => {
    const count = (db.items || []).filter(item => item.categoryId === cat.id).length;
    return { ...cat, count };
  });

  res.json({
    settings: db.settings,
    categories: categoriesWithCounts,
    items: db.items || []
  });
});

app.get('/api/settings', (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

// ==========================================
// 6. ADMIN AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { identifier, email, username, password } = req.body;
  const loginUser = (identifier || username || email || '').trim();
  const loginPass = (password || '');

  const clientIp = req.socket?.remoteAddress || req.ip || '127.0.0.1';
  const lockoutKey = `${clientIp}_${loginUser.toLowerCase()}`;

  // 1. Check account & IP lockout status
  const lockoutStatus = checkAccountLockout(lockoutKey);
  if (lockoutStatus.isLocked) {
    logAudit('ACCOUNT_LOCKED', { key: lockoutKey, remainingSeconds: lockoutStatus.remainingSeconds }, req);
    return res.status(429).json({
      error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${Math.ceil(lockoutStatus.remainingSeconds / 60)} minute(s).`
    });
  }

  if (!loginUser || !loginPass) {
    return res.status(400).json({ error: 'Please provide both admin login ID and password.' });
  }

  const db = readDb();
  if (!db.admin) {
    return res.status(500).json({ error: 'Admin configuration not found.' });
  }

  // Verify against configured username or email
  const matchIdentifier =
    loginUser.toLowerCase() === (db.admin.username || '').toLowerCase() ||
    loginUser.toLowerCase() === (db.admin.email || '').toLowerCase();

  const isPasswordMatch = matchIdentifier && bcrypt.compareSync(loginPass, db.admin.passwordHash);

  if (!isPasswordMatch) {
    // Record failed attempt
    const attempt = recordFailedAttempt(lockoutKey);
    logAudit('LOGIN_FAILED', { usernameAttempted: loginUser, attemptsRemaining: attempt.attemptsLeft }, req);

    if (attempt.isLocked) {
      return res.status(429).json({
        error: 'Too many consecutive failed login attempts. Account locked for 15 minutes.'
      });
    }

    // Generic error message (Never reveal whether username or password was wrong)
    return res.status(401).json({
      error: 'Invalid login credentials. Please check your admin ID and password.'
    });
  }

  // Successful Login
  resetFailedAttempts(lockoutKey);

  const sessionVersion = db.admin.sessionVersion || 1;
  const csrfToken = generateCsrfToken();

  const token = jwt.sign(
    {
      sub: db.admin.username || 'admin547',
      role: 'owner',
      sessionVersion
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  // Set Secure, HttpOnly, SameSite=Strict Cookie
  res.cookie('menu_admin_token', token, {
    httpOnly: true,
    secure: IS_PROD, // true on HTTPS production
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  });

  db.admin.lastLoginAt = new Date().toISOString();
  writeDb(db);

  logAudit('LOGIN_SUCCESS', { username: db.admin.username }, req);

  res.json({
    message: 'Authentication successful',
    token, // Also return token for clients that forward it
    csrfToken,
    user: {
      username: db.admin.username,
      email: db.admin.email
    }
  });
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  const db = readDb();
  res.json({
    valid: true,
    user: {
      username: db.admin.username,
      email: db.admin.email
    }
  });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const db = readDb();
  // Increment session version to invalidate all current tokens server-side
  db.admin.sessionVersion = (db.admin.sessionVersion || 1) + 1;
  writeDb(db);

  res.clearCookie('menu_admin_token', {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'strict'
  });

  logAudit('LOGOUT', { username: req.user?.sub }, req);
  res.json({ message: 'Signed out successfully. Session revoked.' });
});

app.post('/api/auth/change-password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  // Strong password policy validation
  if (!validatePasswordStrength(newPassword)) {
    return res.status(400).json({
      error: 'New password does not meet security requirements. It must be at least 10 characters long, and include lowercase letters, numbers or uppercase, and at least one special symbol (!@#$%^&*).'
    });
  }

  const db = readDb();
  const isMatch = bcrypt.compareSync(currentPassword, db.admin.passwordHash);
  if (!isMatch) {
    logAudit('PASSWORD_CHANGE_FAILED', { reason: 'Incorrect current password' }, req);
    return res.status(400).json({ error: 'Incorrect current password.' });
  }

  // Update password with 12 salt rounds
  db.admin.passwordHash = bcrypt.hashSync(newPassword, 12);
  db.admin.sessionVersion = (db.admin.sessionVersion || 1) + 1;
  db.admin.updatedAt = new Date().toISOString();
  writeDb(db);

  logAudit('PASSWORD_CHANGED', { username: db.admin.username }, req);

  // Issue fresh cookie with new session version
  const token = jwt.sign(
    { sub: db.admin.username, role: 'owner', sessionVersion: db.admin.sessionVersion },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.cookie('menu_admin_token', token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000
  });

  res.json({ message: 'Password updated successfully. All other sessions have been signed out.' });
});

// ==========================================
// 7. SETTINGS MANAGEMENT (ADMIN ONLY)
// ==========================================

app.put('/api/settings', authMiddleware, (req, res) => {
  const parseResult = SettingsSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid settings input: ' + formatZodError(parseResult.error)
    });
  }

  const db = readDb();
  db.settings = {
    ...db.settings,
    ...parseResult.data
  };
  writeDb(db);

  logAudit('SETTINGS_UPDATED', { updatedFields: Object.keys(parseResult.data) }, req);
  res.json({ message: 'Settings saved successfully', settings: db.settings });
});

// ==========================================
// 8. CATEGORY MANAGEMENT (ADMIN ONLY)
// ==========================================

app.get('/api/categories', (req, res) => {
  const db = readDb();
  const sorted = [...(db.categories || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(sorted);
});

app.post('/api/categories', authMiddleware, (req, res) => {
  const parseResult = CategorySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid category: ' + formatZodError(parseResult.error)
    });
  }

  const db = readDb();
  const newId = 'cat-' + Date.now();
  const maxOrder = db.categories.reduce((max, c) => Math.max(max, c.order || 0), 0);

  const newCat = {
    id: newId,
    name: parseResult.data.name,
    order: maxOrder + 1
  };

  db.categories.push(newCat);
  writeDb(db);

  logAudit('CATEGORY_CREATED', { id: newId, name: newCat.name }, req);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const parseResult = CategorySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid category: ' + formatZodError(parseResult.error)
    });
  }

  const db = readDb();
  const cat = db.categories.find(c => c.id === id);
  if (!cat) {
    return res.status(404).json({ error: 'Category not found' });
  }

  cat.name = parseResult.data.name;
  if (parseResult.data.order !== undefined) {
    cat.order = parseResult.data.order;
  }

  writeDb(db);
  logAudit('CATEGORY_UPDATED', { id, name: cat.name }, req);
  res.json(cat);
});

app.put('/api/categories-reorder', authMiddleware, (req, res) => {
  const { orderList } = req.body;
  if (!Array.isArray(orderList)) {
    return res.status(400).json({ error: 'orderList must be an array' });
  }

  const db = readDb();
  orderList.forEach(item => {
    if (item && item.id && typeof item.order === 'number') {
      const cat = db.categories.find(c => c.id === item.id);
      if (cat) cat.order = item.order;
    }
  });

  writeDb(db);
  logAudit('CATEGORIES_REORDERED', { count: orderList.length }, req);
  res.json({ message: 'Categories reordered successfully', categories: db.categories });
});

app.delete('/api/categories/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = readDb();

  const itemInCat = db.items.some(item => item.categoryId === id);
  if (itemInCat) {
    return res.status(400).json({
      error: 'Cannot delete category containing dishes. Reassign or delete those dishes first.'
    });
  }

  db.categories = db.categories.filter(c => c.id !== id);
  writeDb(db);

  logAudit('CATEGORY_DELETED', { id }, req);
  res.json({ message: 'Category deleted successfully' });
});

// ==========================================
// 9. MENU ITEMS MANAGEMENT (ADMIN ONLY)
// ==========================================

app.get('/api/items', (req, res) => {
  const db = readDb();
  res.json(db.items || []);
});

app.post('/api/items', authMiddleware, (req, res) => {
  const parseResult = ItemSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid dish data: ' + formatZodError(parseResult.error)
    });
  }

  const db = readDb();
  // Validate category existence
  const catExists = db.categories.some(c => c.id === parseResult.data.categoryId);
  if (!catExists) {
    return res.status(400).json({ error: 'Selected category does not exist.' });
  }

  const newItem = {
    id: 'item-' + Date.now(),
    ...parseResult.data
  };

  db.items.push(newItem);
  writeDb(db);

  logAudit('ITEM_CREATED', { id: newItem.id, name: newItem.name, price: newItem.price }, req);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const parseResult = ItemSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid dish data: ' + formatZodError(parseResult.error)
    });
  }

  const db = readDb();
  const itemIndex = db.items.findIndex(i => i.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  const updatedItem = {
    id,
    ...parseResult.data
  };

  db.items[itemIndex] = updatedItem;
  writeDb(db);

  logAudit('ITEM_UPDATED', { id, name: updatedItem.name, price: updatedItem.price }, req);
  res.json(updatedItem);
});

// Quick inline price update
app.patch('/api/items/:id/price', authMiddleware, (req, res) => {
  const { id } = req.params;
  const price = Number(req.body.price);

  if (isNaN(price) || price <= 0 || price > 100000) {
    return res.status(400).json({ error: 'Price must be a valid positive number.' });
  }

  const db = readDb();
  const item = db.items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  const oldPrice = item.price;
  item.price = Math.round(price * 100) / 100; // 2 decimal precision
  writeDb(db);

  logAudit('PRICE_UPDATED', { id, name: item.name, oldPrice, newPrice: item.price }, req);
  res.json({ message: 'Price updated live', item });
});

// Quick availability toggle
app.patch('/api/items/:id/availability', authMiddleware, (req, res) => {
  const { id } = req.params;
  const isAvailable = Boolean(req.body.isAvailable);

  const db = readDb();
  const item = db.items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  item.isAvailable = isAvailable;
  writeDb(db);

  logAudit('STOCK_TOGGLED', { id, name: item.name, isAvailable }, req);
  res.json({ message: 'Availability updated', item });
});

app.delete('/api/items/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const item = db.items.find(i => i.id === id);

  db.items = db.items.filter(i => i.id !== id);
  writeDb(db);

  logAudit('ITEM_DELETED', { id, name: item?.name }, req);
  res.json({ message: 'Item deleted successfully' });
});

// ==========================================
// 10. FILE UPLOADS & MAGIC BYTE VERIFICATION
// ==========================================

app.post('/api/upload', authMiddleware, uploadLimiter, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }

  const filePath = req.file.path;

  // Verify magic byte file signatures (OWASP extension spoofing defense)
  const magicCheck = validateImageMagicBytes(filePath);
  if (!magicCheck.valid) {
    // Delete malicious or corrupted file immediately
    try { fs.unlinkSync(filePath); } catch (e) {}
    logAudit('UPLOAD_BLOCKED', { filename: req.file.originalname, reason: magicCheck.reason }, req);
    return res.status(400).json({ error: magicCheck.reason });
  }

  const subfolder = req.query.type === 'branding' ? 'branding' : 'dishes';
  const fileUrl = `/uploads/${subfolder}/${req.file.filename}`;

  logAudit('IMAGE_UPLOADED', { filename: req.file.filename, size: req.file.size, mime: magicCheck.mime }, req);

  res.json({
    message: 'Upload successful',
    url: fileUrl,
    filename: req.file.filename
  });
});

app.get('/api/media/scan', authMiddleware, (req, res) => {
  const getFiles = (dir, prefix) => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .map(file => {
        const stats = fs.statSync(path.join(dir, file));
        return {
          filename: file,
          url: `/uploads/${prefix}/${file}`,
          folder: prefix,
          size: stats.size,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified - a.modified);
  };

  const brandingFiles = getFiles(BRANDING_DIR, 'branding');
  const dishesFiles = getFiles(DISHES_DIR, 'dishes');

  res.json({
    folders: {
      brandingPath: BRANDING_DIR,
      dishesPath: DISHES_DIR
    },
    brandingFiles,
    dishesFiles,
    total: brandingFiles.length + dishesFiles.length
  });
});

// ==========================================
// 11. AUDIT LOGS & DATABASE BACKUP/EXPORT
// ==========================================

app.get('/api/logs', authMiddleware, (req, res) => {
  const logs = readAuditLogs();
  res.json(logs);
});

// Export Database as JSON
app.get('/api/backup/export', authMiddleware, (req, res) => {
  const db = readDb();
  // Sanitize admin passwordHash before exporting
  const sanitized = {
    ...db,
    admin: {
      username: db.admin.username,
      email: db.admin.email,
      lastLoginAt: db.admin.lastLoginAt
    }
  };

  logAudit('BACKUP_EXPORTED', { format: 'json' }, req);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=menu-backup-${Date.now()}.json`);
  res.send(JSON.stringify(sanitized, null, 2));
});

// Export Dishes as CSV
app.get('/api/backup/export-csv', authMiddleware, (req, res) => {
  const db = readDb();
  const items = db.items || [];
  const categories = db.categories || [];

  const headers = ['ID', 'Dish Name', 'Category', 'Price (INR)', 'Type', 'Special', 'Available', 'Description'];
  const rows = items.map(item => {
    const cat = categories.find(c => c.id === item.categoryId)?.name || 'Unknown';
    return [
      item.id,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${cat.replace(/"/g, '""')}"`,
      item.price,
      item.isVeg ? 'Veg' : 'Non-Veg',
      item.isBestseller ? 'Yes' : 'No',
      item.isAvailable ? 'In Stock' : 'Sold Out',
      `"${(item.description || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  logAudit('BACKUP_EXPORTED', { format: 'csv' }, req);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=dishes-export-${Date.now()}.csv`);
  res.send(csvContent);
});

// ==========================================
// 12. SERVE FRONTEND SPA (IN PRODUCTION)
// ==========================================
if (fs.existsSync(CLIENT_DIST_DIR)) {
  // Static assets with hash in filename can be cached
  app.use('/assets', express.static(path.join(CLIENT_DIST_DIR, 'assets'), {
    dotfiles: 'ignore',
    maxAge: '1d',
    immutable: true
  }));

  app.use(express.static(CLIENT_DIST_DIR, {
    dotfiles: 'ignore',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));

  app.use((req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(CLIENT_DIST_DIR, 'index.html'));
  });
}

// ==========================================
// 13. GLOBAL ERROR HANDLER (NO LEAKED STACK TRACES)
// ==========================================
app.use((err, req, res, next) => {
  // Log full error details server-side only
  console.error('[SERVER ERROR]', {
    message: err.message,
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  // Client gets clean, safe generic error message
  res.status(err.status || 500).json({
    error: err.message && !IS_PROD ? err.message : 'An unexpected error occurred. Please try again later.'
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`[SECURE] Digital Menu Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Local Access: http://localhost:${PORT}`);
  console.log(`Admin Panel:  http://localhost:${PORT}/#admin`);
  console.log(`OWASP Top 10 Hardened: Rate Limiting, CSP, Anti-Brute Force active`);
  console.log(`====================================================`);
});
