require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ADMIN_PASSWORD     = process.env.ADMIN_PASSWORD      || 'admin2025';
const SERVER_API_KEY     = process.env.ANTHROPIC_API_KEY    || '';
const DEEPSEEK_API_KEY   = process.env.DEEPSEEK_API_KEY     || '';
const DEFAULT_MODEL      = process.env.DEFAULT_MODEL        || 'claude-opus-4-8';
const DEFAULT_PROVIDER   = process.env.DEFAULT_PROVIDER     || 'claude';

/* ── Config endpoint — tells frontend whether a server key exists ── */
app.get('/api/config', (req, res) => {
  res.json({
    hasServerKey: !!SERVER_API_KEY,
    hasDeepSeekKey: !!DEEPSEEK_API_KEY,
    defaultModel: DEFAULT_MODEL,
    defaultProvider: DEFAULT_PROVIDER
  });
});

/* ── Provider key resolution ───────────────────────────────── */
function resolveApiKey(provider, userKey) {
  if (provider === 'deepseek') return DEEPSEEK_API_KEY || userKey;
  return SERVER_API_KEY || userKey;
}

/* ── Generate (streaming) ──────────────────────────────────────── */
app.post('/api/generate', async (req, res) => {
  const { systemPrompt, userPrompt, apiKey, model, provider } = req.body;
  const selectedProvider = provider || DEFAULT_PROVIDER;

  const effectiveKey = resolveApiKey(selectedProvider, apiKey);
  if (!effectiveKey) return res.status(400).json({ error: 'No API key configured. Add your key in Settings.' });
  if (!userPrompt)   return res.status(400).json({ error: 'Prompt required' });

  const selectedModel = model || DEFAULT_MODEL;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    if (selectedProvider === 'deepseek') {
      /* ── DeepSeek (OpenAI-compatible API) ──────────────────── */
      const deepseek = new OpenAI({
        apiKey: effectiveKey,
        baseURL: 'https://api.deepseek.com'
      });

      const stream = await deepseek.chat.completions.create({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt || 'You are an expert social media strategist.' },
          { role: 'user', content: userPrompt }
        ],
        stream: true,
        max_tokens: 4096
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) res.write(text);
      }
      res.end();
    } else {
      /* ── Claude (Anthropic SDK) ──────────────────────────── */
      const client = new Anthropic({ apiKey: effectiveKey });

      const stream = client.messages.stream({
        model: selectedModel,
        max_tokens: 4096,
        system: systemPrompt || 'You are an expert social media strategist.',
        messages: [{ role: 'user', content: userPrompt }]
      });

      stream.on('text', (text) => res.write(text));
      stream.on('error', (err) => { res.write(`\n\n[Error: ${err.message}]`); res.end(); });

      await stream.finalMessage();
      res.end();
    }
  } catch (err) {
    const msg = err.message || 'Unknown error';
    if (!res.headersSent) res.status(500).json({ error: msg });
    else { res.write(`\n\n[Error: ${msg}]`); res.end(); }
  }
});

/* ── Admin auth ─────────────────────────────────────────────────── */
app.post('/api/verify-admin', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) res.json({ success: true });
  else res.status(401).json({ success: false, error: 'Invalid password' });
});

/* ── Docs content ───────────────────────────────────────────────── */
app.get('/api/content/:type', (req, res) => {
  const allowed = ['workflow', 'documentation', 'changelog', 'deepseek-guide'];
  const type = req.params.type;
  if (!allowed.includes(type)) return res.status(404).json({ error: 'Not found' });
  const filePath = path.join(__dirname, 'docs', `${type}.md`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.json({ content: fs.readFileSync(filePath, 'utf-8') });
});

module.exports = app;

// Local development only — Vercel imports the app as a module
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PromptMaster running → http://localhost:${PORT}`);
    console.log(`                      http://127.0.0.1:${PORT}`);
    console.log(`Admin dashboard   → http://localhost:${PORT}/admin.html`);
    console.log(`Admin password    → ${ADMIN_PASSWORD}`);
    console.log(`API key mode      → ${SERVER_API_KEY ? '✓ Server key configured (users need no key)' : '⚠ No server key — users must enter their own'}`);
  });
}
