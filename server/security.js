const { z } = require('zod');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');

// 1. In-memory Rate Limiting & Account Lockout Tracker
const failedAttempts = new Map(); // key -> { count, lockedUntil, lastAttempt }

const MAX_FAILED_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);
const LOCKOUT_MS = parseInt(process.env.LOCKOUT_MINUTES || '15', 10) * 60 * 1000;

function checkAccountLockout(key) {
  const record = failedAttempts.get(key);
  if (!record) return { isLocked: false, remainingSeconds: 0 };

  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }

  // If lockout duration has expired, reset
  if (record.lockedUntil && record.lockedUntil <= now) {
    failedAttempts.delete(key);
    return { isLocked: false, remainingSeconds: 0 };
  }

  return { isLocked: false, remainingSeconds: 0 };
}

function recordFailedAttempt(key) {
  const now = Date.now();
  const record = failedAttempts.get(key) || { count: 0, lockedUntil: null, lastAttempt: now };

  record.count += 1;
  record.lastAttempt = now;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }

  failedAttempts.set(key, record);
  return {
    isLocked: record.count >= MAX_FAILED_ATTEMPTS,
    attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - record.count),
    lockedUntil: record.lockedUntil
  };
}

function resetFailedAttempts(key) {
  failedAttempts.delete(key);
}

// 2. Strict Password Strength Policy
// Minimum 10 characters, at least 1 lowercase, 1 number or uppercase, and 1 special character
function validatePasswordStrength(password) {
  if (typeof password !== 'string') return false;
  if (password.length < 10) return false;
  const hasLower = /[a-z]/.test(password);
  const hasUpperOrNum = /[A-Z0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  return hasLower && hasUpperOrNum && hasSpecial;
}

// 3. String Sanitizer (XSS Neutralization)
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  const cleaned = sanitizeHtml(str, {
    allowedTags: [], // Strip all HTML tags completely
    allowedAttributes: {}
  });
  return cleaned.trim();
}

// 4. Google Review URL Validator (HTTPS + Google domains only)
function isValidGoogleReviewUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'https:') return false;

    const hostname = parsed.hostname.toLowerCase();
    const isGoogleDomain = 
      hostname === 'maps.app.goo.gl' ||
      hostname === 'g.page' ||
      hostname === 'goo.gl' ||
      hostname.endsWith('.google.com') ||
      hostname === 'google.com';

    return isGoogleDomain;
  } catch (err) {
    return false;
  }
}

// 5. Magic Byte / File Signature Validation (JPEG, PNG, WebP only. SVG BLOCKED.)
function validateImageMagicBytes(filePath) {
  try {
    const buffer = Buffer.alloc(16);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 16, 0);
    fs.closeSync(fd);

    // JPEG signature: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return { valid: true, mime: 'image/jpeg', ext: '.jpg' };
    }

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4E &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0D &&
      buffer[5] === 0x0A &&
      buffer[6] === 0x1A &&
      buffer[7] === 0x0A
    ) {
      return { valid: true, mime: 'image/png', ext: '.png' };
    }

    // WebP signature: RIFF....WEBP (52 49 46 46 ... 57 45 42 50)
    if (
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
    ) {
      return { valid: true, mime: 'image/webp', ext: '.webp' };
    }

    // Any other format (including SVG, HTML, PHP, EXE) is rejected
    return { valid: false, reason: 'Invalid or unsupported image signature. Only authentic JPG, PNG, and WebP files are allowed.' };
  } catch (err) {
    return { valid: false, reason: 'Could not read image file header.' };
  }
}

// 6. Zod Schemas for Input Validation
const ItemSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeText),
  categoryId: z.string().min(1).max(50),
  price: z.number().positive().max(100000),
  description: z.string().max(500).default('').transform(sanitizeText),
  isVeg: z.boolean().default(true),
  isBestseller: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().max(500).optional().default('')
});

const CategorySchema = z.object({
  name: z.string().min(1).max(60).transform(sanitizeText),
  order: z.number().int().optional()
});

const SettingsSchema = z.object({
  hotelName: z.string().min(1).max(120).transform(sanitizeText).optional(),
  tagline: z.string().max(200).transform(sanitizeText).optional(),
  phone: z.string().max(30).transform(sanitizeText).optional(),
  whatsapp: z.string().max(30).transform(sanitizeText).optional(),
  address: z.string().max(300).transform(sanitizeText).optional(),
  googleMapsUrl: z.string().url().max(500).optional(),
  googleReviewUrl: z.string().url().max(500).refine(isValidGoogleReviewUrl, {
    message: 'Google review link must be a valid HTTPS URL pointing to a Google domain (e.g. https://maps.app.goo.gl/... or https://search.google.com/...)'
  }).optional(),
  logoUrl: z.string().max(500).optional(),
  heroBgUrl: z.string().max(500).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color code').optional(),
  currencySymbol: z.string().max(5).optional(),
  openingHours: z.string().max(100).transform(sanitizeText).optional(),
  diningNotice: z.string().max(200).transform(sanitizeText).optional(),
  isPureVegOnly: z.boolean().optional()
});

module.exports = {
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
};
