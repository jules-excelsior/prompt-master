require('dotenv').config();
const express   = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI    = require('openai');
const path      = require('path');
const fs        = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';

// Server-side keys (optional — set in .env so users don't need their own)
const SERVER_KEYS = {
  anthropic: process.env.ANTHROPIC_API_KEY || '',
  deepseek:  process.env.DEEPSEEK_API_KEY  || ''
};

const DEEPSEEK_MODELS = ['deepseek-chat', 'deepseek-reasoner'];
const ANTHROPIC_MODELS = ['claude-opus-4-8', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'];

/* ── Config — tells frontend which providers are ready ─────── */
app.get('/api/config', (req, res) => {
  res.json({
    anthropic: { hasServerKey: !!SERVER_KEYS.anthropic },
    deepseek:  { hasServerKey: !!SERVER_KEYS.deepseek  }
  });
});

/* ── Generate (streaming) ──────────────────────────────────── */
app.post('/api/generate', async (req, res) => {
  const { systemPrompt, userPrompt, apiKey, model, provider = 'anthropic' } = req.body;

  const effectiveKey = SERVER_KEYS[provider] || apiKey;
  if (!effectiveKey) return res.status(400).json({ error: 'No API key configured for this provider.' });
  if (!userPrompt)   return res.status(400).json({ error: 'Prompt required.' });

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
      stream.on('error', (err) => { res.write(`\n\n[Error: ${err.message}]`); res.end(); });
      await stream.finalMessage();
      res.end();

    } else if (provider === 'deepseek') {
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
      res.end();

    } else {
      res.status(400).json({ error: 'Unknown provider.' });
    }
  } catch (err) {
    const msg = err.message || 'Unknown error';
    if (!res.headersSent) res.status(500).json({ error: msg });
    else { res.write(`\n\n[Error: ${msg}]`); res.end(); }
  }
});

/* ── Admin auth ────────────────────────────────────────────── */
app.post('/api/verify-admin', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) res.json({ success: true });
  else res.status(401).json({ success: false, error: 'Invalid password' });
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
  console.log(`Admin password    → ${ADMIN_PASSWORD}`);
  console.log(`Anthropic key     → ${SERVER_KEYS.anthropic ? '✓ configured' : '⚠ not set'}`);
  console.log(`DeepSeek key      → ${SERVER_KEYS.deepseek  ? '✓ configured' : '⚠ not set'}`);
});
