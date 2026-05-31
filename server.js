require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';

app.post('/api/generate', async (req, res) => {
  const { systemPrompt, userPrompt, apiKey, model } = req.body;

  if (!apiKey) return res.status(400).json({ error: 'API key required' });
  if (!userPrompt) return res.status(400).json({ error: 'Prompt required' });

  const selectedModel = model || 'claude-opus-4-8';

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const client = new Anthropic({ apiKey });

    const stream = client.messages.stream({
      model: selectedModel,
      max_tokens: 4096,
      system: systemPrompt || 'You are an expert social media strategist.',
      messages: [{ role: 'user', content: userPrompt }]
    });

    stream.on('text', (text) => {
      res.write(text);
    });

    stream.on('error', (err) => {
      res.write(`\n\n[Error: ${err.message}]`);
      res.end();
    });

    await stream.finalMessage();
    res.end();
  } catch (err) {
    const msg = err.message || 'Unknown error';
    if (!res.headersSent) {
      res.status(500).json({ error: msg });
    } else {
      res.write(`\n\n[Error: ${msg}]`);
      res.end();
    }
  }
});

app.post('/api/verify-admin', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

app.get('/api/content/:type', (req, res) => {
  const allowed = ['workflow', 'documentation', 'changelog'];
  const type = req.params.type;
  if (!allowed.includes(type)) return res.status(404).json({ error: 'Not found' });

  const filePath = path.join(__dirname, 'docs', `${type}.md`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

  const content = fs.readFileSync(filePath, 'utf-8');
  res.json({ content });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PromptMaster running → http://localhost:${PORT}`);
  console.log(`                      http://127.0.0.1:${PORT}`);
  console.log(`Admin dashboard   → http://localhost:${PORT}/admin.html`);
  console.log(`Admin password    → ${ADMIN_PASSWORD}`);
});
