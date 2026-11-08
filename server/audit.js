const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LOG_FILE = path.join(__dirname, 'data', 'audit_log.json');
const MAX_LOG_ENTRIES = 500;

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getClientIp(req) {
  if (!req) return 'unknown';
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || '127.0.0.1';
}

function readAuditLogs() {
  ensureDir(LOG_FILE);
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const raw = fs.readFileSync(LOG_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading audit logs:', err.message);
    return [];
  }
}

function writeAuditLogs(logs) {
  ensureDir(LOG_FILE);
  const tempPath = `${LOG_FILE}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(logs, null, 2), 'utf-8');
  fs.renameSync(tempPath, LOG_FILE);
}

function logAudit(action, details, req = null) {
  try {
    const logs = readAuditLogs();
    const entry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      ip: getClientIp(req),
      userAgent: req ? (req.headers['user-agent'] || '').slice(0, 120) : 'system',
      details: typeof details === 'object' ? details : { message: String(details) }
    };

    logs.unshift(entry); // newest first
    if (logs.length > MAX_LOG_ENTRIES) {
      logs.length = MAX_LOG_ENTRIES;
    }

    writeAuditLogs(logs);
    return entry;
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

module.exports = {
  logAudit,
  readAuditLogs
};
