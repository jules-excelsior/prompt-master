require('dotenv').config();
const express   = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI    = require('openai');
const path      = require('path');
const fs        = require('fs');
const crypto    = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ── Dashboard route ───────────────────────────────────────── */
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

/* ── Data persistence ──────────────────────────────────────── */
const DATA_DIR      = path.join(__dirname, 'data');
const USERS_FILE    = path.join(DATA_DIR, 'users.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const USAGE_FILE    = path.join(DATA_DIR, 'usage.json');
const LIMITS_FILE   = path.join(DATA_DIR, 'limits.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadUsers() {
  try { return fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')) : []; }
  catch { return []; }
}
function saveUsers(u) { fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2)); }

function loadSettings() {
  try { return fs.existsSync(SETTINGS_FILE) ? JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')) : {}; }
  catch { return {}; }
}
function saveSettings(s) { fs.writeFileSync(SETTINGS_FILE, JSON.stringify(s, null, 2)); }

function getAdminPassword() {
  return loadSettings().adminPassword || process.env.ADMIN_PASSWORD || 'admin2025';
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}
function hashPassword(p, salt) {
  return crypto.createHash('sha256').update(p + (salt || 'pm_salt_2025')).digest('hex');
}

function loadUsage() {
  try { return fs.existsSync(USAGE_FILE) ? JSON.parse(fs.readFileSync(USAGE_FILE, 'utf-8')) : {}; }
  catch { return {}; }
}
function saveUsage(u) { fs.writeFileSync(USAGE_FILE, JSON.stringify(u, null, 2)); }

function loadLimits() {
  try { return fs.existsSync(LIMITS_FILE) ? JSON.parse(fs.readFileSync(LIMITS_FILE, 'utf-8')) : {}; }
  catch { return {}; }
}
function saveLimits(l) { fs.writeFileSync(LIMITS_FILE, JSON.stringify(l, null, 2)); }

function getDailyLimit()       { return loadLimits().dailyLimitPerUser || 20; }
function isGenerationPaused()  { return loadLimits().isPaused || false; }
function today() {
  // Philippine Standard Time (UTC+8) — daily limits reset at PH midnight
  return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function checkAndRecordUsage(key) {
  if (isGenerationPaused())
    return { allowed: false, reason: 'All generations are currently paused by the administrator.' };

  const usage = loadUsage();
  const limit = getDailyLimit();
  const count = (usage[key] || {})[today()] || 0;

  if (count >= limit)
    return { allowed: false, reason: `Daily limit of ${limit} generations reached. Resets at midnight.` };

  if (!usage[key]) usage[key] = {};
  usage[key][today()] = count + 1;
  saveUsage(usage);
  return { allowed: true, remaining: limit - count - 1 };
}

/* ── Server-side API keys ──────────────────────────────────── */
const SERVER_KEYS = {
  anthropic: process.env.ANTHROPIC_API_KEY || '',
  deepseek:  process.env.DEEPSEEK_API_KEY  || ''
};

const DEEPSEEK_MODELS  = ['deepseek-chat', 'deepseek-reasoner'];
const ANTHROPIC_MODELS = ['claude-opus-4-8', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'];

/* ── Config ────────────────────────────────────────────────── */
app.get('/api/config', (req, res) => {
  res.json({
    anthropic: { hasServerKey: !!SERVER_KEYS.anthropic },
    deepseek:  { hasServerKey: !!SERVER_KEYS.deepseek  }
  });
});

/* ── User Registration ─────────────────────────────────────── */
app.post('/api/register', rateLimit(10), (req, res) => {
  const { firstName, email, password } = req.body;
  if (!firstName || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const users = loadUsers();
  if (users.find(u => u.email === email.trim().toLowerCase()))
    return res.status(409).json({ error: 'Email is already registered.' });

  const salt = generateSalt();
  const user = {
    id:           crypto.randomUUID(),
    firstName:    firstName.trim(),
    email:        email.trim().toLowerCase(),
    salt,
    passwordHash: hashPassword(password, salt),
    joinedAt:     new Date().toISOString()
  };
  users.push(user);
  saveUsers(users);
  res.json({ success: true, firstName: user.firstName });
});

/* ── User Login ────────────────────────────────────────────── */
app.post('/api/user-login', rateLimit(10), (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

  const users = loadUsers();
  const user  = users.find(u => u.email === email.trim().toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password, user.salt))
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });

  res.json({ success: true, firstName: user.firstName });
});

/* ── Admin Auth ────────────────────────────────────────────── */
app.post('/api/verify-admin', rateLimit(5), (req, res) => {
  const { password } = req.body;
  if (password === getAdminPassword()) res.json({ success: true });
  else res.status(401).json({ success: false, error: 'Invalid password' });
});

/* ── Admin: Get Users ──────────────────────────────────────── */
app.get('/api/users', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (!pwd || pwd !== getAdminPassword())
    return res.status(401).json({ error: 'Unauthorized' });

  const users = loadUsers();
  res.json({
    total: users.length,
    users: users.map(u => ({ id: u.id, firstName: u.firstName, email: u.email, joinedAt: u.joinedAt }))
  });
});

/* ── Admin: Change Password ────────────────────────────────── */
app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || currentPassword !== getAdminPassword())
    return res.status(401).json({ error: 'Current password is incorrect.' });
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });

  const settings = loadSettings();
  settings.adminPassword = newPassword;
  saveSettings(settings);
  res.json({ success: true });
});

/* ── Admin: Delete User ────────────────────────────────────── */
app.delete('/api/users/:id', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (!pwd || pwd !== getAdminPassword())
    return res.status(401).json({ error: 'Unauthorized' });

  const users   = loadUsers();
  const idx     = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(idx, 1);
  saveUsers(users);
  res.json({ success: true });
});

/* ── Rate limiting ─────────────────────────────────────────── */
const _rl = new Map();
function rateLimit(maxPerMin) {
  return (req, res, next) => {
    const ip  = req.ip;
    const now = Date.now();
    const e   = _rl.get(ip) || { n: 0, reset: now + 60000 };
    if (now > e.reset) { e.n = 0; e.reset = now + 60000; }
    e.n++; _rl.set(ip, e);
    if (e.n > maxPerMin) return res.status(429).json({ error: 'Too many requests — please wait a moment before trying again.' });
    next();
  };
}

/* ── Generate (streaming) ──────────────────────────────────── */
/* ── Usage info (per user) ─────────────────────────────────── */
app.get('/api/usage', (req, res) => {
  const email  = (req.query.email || '').toLowerCase().trim();
  const limit  = getDailyLimit();
  const paused = isGenerationPaused();
  const count  = email ? ((loadUsage()[email] || {})[today()] || 0) : 0;
  res.json({ today: count, limit, remaining: Math.max(0, limit - count), isPaused: paused });
});

/* ── Admin: usage stats ────────────────────────────────────── */
app.get('/api/admin/usage', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (!pwd || pwd !== getAdminPassword()) return res.status(401).json({ error: 'Unauthorized' });

  const usage  = loadUsage();
  const limits = loadLimits();
  const t      = today();

  const stats = Object.entries(usage)
    .map(([email, days]) => ({
      email,
      today: days[t] || 0,
      total: Object.values(days).reduce((a, b) => a + b, 0)
    }))
    .filter(u => u.total > 0)
    .sort((a, b) => b.today - a.today);

  res.json({
    totalToday: stats.reduce((s, u) => s + u.today, 0),
    stats,
    limits: { dailyLimitPerUser: limits.dailyLimitPerUser || 20, isPaused: limits.isPaused || false }
  });
});

/* ── Admin: update limits ──────────────────────────────────── */
app.post('/api/admin/limits', (req, res) => {
  const pwd = req.headers['x-admin-password'];
  if (!pwd || pwd !== getAdminPassword()) return res.status(401).json({ error: 'Unauthorized' });

  const { dailyLimitPerUser, isPaused } = req.body;
  const limits = loadLimits();
  if (dailyLimitPerUser !== undefined) limits.dailyLimitPerUser = Math.max(1, parseInt(dailyLimitPerUser) || 20);
  if (isPaused !== undefined)          limits.isPaused = !!isPaused;
  saveLimits(limits);
  res.json({ success: true, limits });
});

/* ── Generate (streaming) ──────────────────────────────────── */
app.post('/api/generate', rateLimit(20), async (req, res) => {
  const { systemPrompt, userPrompt, apiKey, model, provider = 'anthropic', userEmail } = req.body;

  // Validate provider before setting streaming headers
  if (provider !== 'anthropic' && provider !== 'deepseek')
    return res.status(400).json({ error: 'Unknown provider.' });

  const effectiveKey = SERVER_KEYS[provider] || apiKey;
  if (!effectiveKey) return res.status(400).json({ error: 'No API key configured for this provider.' });
  if (!userPrompt)   return res.status(400).json({ error: 'Prompt required.' });

  // Admins bypass daily limits; regular users tracked by email or IP fallback
  const isAdminReq = req.headers['x-admin-password'] === getAdminPassword();
  if (!isAdminReq) {
    const trackingKey = (userEmail || '').toLowerCase().trim() || req.ip;
    const usageCheck  = checkAndRecordUsage(trackingKey);
    if (!usageCheck.allowed) return res.status(429).json({ error: usageCheck.reason });
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    if (provider === 'anthropic') {
      const selectedModel = ANTHROPIC_MODELS.includes(model) ? model : 'claude-opus-4-8';
      const client = new Anthropic({ apiKey: effectiveKey });
      const stream = client.messages.stream({
        model: selectedModel, max_tokens: 4096,
        system: systemPrompt || 'You are an expert social media strategist.',
        messages: [{ role: 'user', content: userPrompt }]
      });
      stream.on('text', (text) => res.write(text));
      stream.on('error', (err) => {
        if (!res.writableEnded) { res.write(`\n\n[Error: ${err.message}]`); res.end(); }
      });
      await stream.finalMessage();
      if (!res.writableEnded) res.end();

    } else {
      const selectedModel = DEEPSEEK_MODELS.includes(model) ? model : 'deepseek-chat';
      const client = new OpenAI({ apiKey: effectiveKey, baseURL: 'https://api.deepseek.com' });
      const stream = await client.chat.completions.create({
        model: selectedModel, stream: true, max_tokens: 4096,
        messages: [
          { role: 'system', content: systemPrompt || 'You are an expert social media strategist.' },
          { role: 'user',   content: userPrompt }
        ]
      });
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) res.write(text);
      }
      if (!res.writableEnded) res.end();
    }
  } catch (err) {
    const msg = err.message || 'Unknown error';
    if (!res.headersSent) res.status(500).json({ error: msg });
    else if (!res.writableEnded) { res.write(`\n\n[Error: ${msg}]`); res.end(); }
  }
});

/* ── Docs ──────────────────────────────────────────────────── */
app.get('/api/content/:type', (req, res) => {
  const allowed = ['workflow', 'documentation', 'changelog'];
  const type = req.params.type;
  if (!allowed.includes(type)) return res.status(404).json({ error: 'Not found' });
  const filePath = path.join(__dirname, 'docs', `${type}.md`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.json({ content: fs.readFileSync(filePath, 'utf-8') });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PromptMaster running → http://localhost:${PORT}`);
  console.log(`                      http://127.0.0.1:${PORT}`);
  console.log(`Admin password    → [set in .env or data/settings.json]`);
  console.log(`Anthropic key     → ${SERVER_KEYS.anthropic ? '✓ configured' : '⚠ not set'}`);
  console.log(`DeepSeek key      → ${SERVER_KEYS.deepseek  ? '✓ configured' : '⚠ not set'}`);
});
