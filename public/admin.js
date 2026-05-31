'use strict';

/* ── Module Definitions ─────────────────────────────────── */
const MODULES = [
  {
    id: 'growth-strategy',
    name: 'Growth Strategy Commander',
    icon: '⚡', color: '#4f9cf9',
    gradient: 'linear-gradient(135deg,#4f9cf9,#1e6fd4)',
    desc: 'Elite social media manager mode — audience psychology, platform algorithms, viral distribution & scalable content ops.',
    inputs: [
      { id: 'niche',    label: 'Your Niche',  type: 'text',   ph: 'e.g., fitness coaching, SaaS, personal finance' },
      { id: 'platform', label: 'Platform',     type: 'select', opts: ['Instagram','TikTok','YouTube','LinkedIn','Twitter/X','Facebook','Pinterest','Threads'] },
      { id: 'goal',     label: 'Growth Goal',  type: 'text',   ph: 'e.g., reach 10K followers in 90 days' }
    ],
    system: 'You are an elite social media manager and growth strategist. Respond with richly structured markdown.',
    prompt: (v) => `Act as an elite social media manager and growth strategist.\n\nNiche: ${v.niche}\nPlatform: ${v.platform}\nGrowth Goal: ${v.goal}\n\nDeliver a comprehensive growth strategy:\n## Strategic Positioning\n## Core Content Pillars (5–7)\n## Posting Schedule & Cadence\n## Algorithm-Specific Engagement Tactics\n## KPIs & Success Metrics\n## 30-Day Action Plan (week by week)`
  },
  {
    id: 'audience-psychology',
    name: 'Audience Psychology Decoder',
    icon: '🧠', color: '#a855f7',
    gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)',
    desc: 'Deep audience analysis — desires, frustrations, emotional triggers, attention patterns & psychological motivations.',
    inputs: [{ id: 'niche', label: 'Your Niche', type: 'text', ph: 'e.g., online fitness coaching, B2B SaaS, crypto investing' }],
    system: 'You are an expert audience psychologist. Use markdown with clear section headers.',
    prompt: (v) => `Analyze the target audience for "${v.niche}" deeply.\n\n## Core Demographics & Psychographics\n## Top 5 Desires & Aspirations\n## Top 5 Frustrations & Pain Points\n## Key Emotional Triggers\n## Attention Patterns & Scroll Behavior\n## Content Format Preferences\n## Psychological Motivations\n## Identity & Self-Perception Gap\n## Content Strategy Implications`
  },
  {
    id: 'viral-content',
    name: 'Viral Content Idea Engine',
    icon: '🚀', color: '#f97316',
    gradient: 'linear-gradient(135deg,#f97316,#ea580c)',
    desc: 'Generate 30 highly engaging content ideas using curiosity triggers, emotional reactions & proven viral frameworks.',
    inputs: [{ id: 'niche', label: 'Your Niche', type: 'text', ph: 'e.g., productivity for entrepreneurs, vegan recipes, web design' }],
    system: 'You are a viral content strategist. Generate specific, high-potential ideas in clear markdown sections.',
    prompt: (v) => `Generate 30 highly engaging content ideas for "${v.niche}".\n\n## 🔍 Curiosity & Mystery (5 ideas)\n## 💥 Emotional Story & Transformation (5 ideas)\n## 🔥 Controversy & Hot Takes (5 ideas)\n## 😣 Pain Point Solutions (5 ideas)\n## ✅ Proof & Social Validation (5 ideas)\n## 📚 Education & Value Bombs (5 ideas)\n\nFor each: **Concept** | **Why it works** | **Hook line**`
  },
  {
    id: 'hook-engineering',
    name: 'Hook Engineering Lab',
    icon: '🎯', color: '#ef4444',
    gradient: 'linear-gradient(135deg,#ef4444,#dc2626)',
    desc: 'Scroll-stopping opening hooks engineered to capture attention instantly using psychology & proven triggers.',
    inputs: [{ id: 'niche', label: 'Your Niche', type: 'text', ph: 'e.g., real estate investing, mindset coaching, AI tools' }],
    system: 'You are a master copywriter and hook engineer. Write powerful, copy-ready hooks in clear markdown sections.',
    prompt: (v) => `Generate 20 scroll-stopping hooks for "${v.niche}".\n\n## 🕳️ Curiosity Gap Hooks (4)\n## 🪞 Identity & Relatability Hooks (4)\n## 📊 Shocking Stat & Fact Hooks (3)\n## ⏰ Urgency & Stakes Hooks (3)\n## 🚫 Contrarian & Controversy Hooks (3)\n## 🔄 Transformation Hooks (3)\n\nEach hook: **exact text** (copy-ready) + (psychological trigger)`
  },
  {
    id: 'algorithm-strategy',
    name: 'Algorithm Intelligence Briefing',
    icon: '📡', color: '#22c55e',
    gradient: 'linear-gradient(135deg,#22c55e,#16a34a)',
    desc: 'Platform-specific algorithm playbook for maximum organic reach, distribution & visibility.',
    inputs: [
      { id: 'platform', label: 'Platform', type: 'select', opts: ['Instagram','TikTok','YouTube','LinkedIn','Twitter/X','Facebook','Pinterest','Threads'] },
      { id: 'niche',    label: 'Your Niche', type: 'text', ph: 'e.g., fashion, tech reviews, business coaching' }
    ],
    system: 'You are a platform algorithm expert. Deliver specific, actionable intelligence in markdown.',
    prompt: (v) => `Algorithm intelligence briefing for ${v.platform} in "${v.niche}".\n\n## How the ${v.platform} Algorithm Works\n## Key Engagement Signals (ranked)\n## Optimal Content Structure & Format\n## Posting Strategy (timing, frequency)\n## Niche-Specific Tactics for "${v.niche}"\n## Engagement Loop Strategy\n## Reach Killers — What to Avoid\n## 30-Day Algorithm Reset Plan`
  },
  {
    id: 'content-repurposing',
    name: 'Content Repurposing Multiplier',
    icon: '♻️', color: '#f5c842',
    gradient: 'linear-gradient(135deg,#f5c842,#d97706)',
    desc: 'Transform one content idea into 6+ platform-native formats for scalable, high-output content production.',
    inputs: [{ id: 'content', label: 'Your Content Idea', type: 'textarea', ph: 'Paste your content idea, topic, script, or core message here…' }],
    system: 'You are a content repurposing strategist. Use markdown ## headers for each format.',
    prompt: (v) => `Repurpose this into 6 platform-specific formats:\n\n**Original Idea:**\n${v.content}\n\n## 1. Short-Form Video Script (TikTok/Reels/Shorts)\n## 2. Carousel Post (Instagram/LinkedIn)\n## 3. Long-Form Caption (Instagram/Facebook)\n## 4. Twitter/X Thread\n## 5. LinkedIn Post\n## 6. Engagement Bait Post\n\nEach format: platform-native and copy-ready.`
  }
];

/* ── Provider Config ─────────────────────────────────────── */
const PROVIDER_MODELS = {
  anthropic: [
    { value: 'claude-opus-4-8',          label: 'Claude Opus 4.8 — Best quality' },
    { value: 'claude-sonnet-4-6',         label: 'Claude Sonnet 4.6 — Balanced' },
    { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 — Fast & economical' }
  ],
  deepseek: [
    { value: 'deepseek-chat',     label: 'DeepSeek Chat — General purpose' },
    { value: 'deepseek-reasoner', label: 'DeepSeek Reasoner — Advanced reasoning' }
  ]
};
const PROVIDER_KEY_CONFIG = {
  anthropic: { label: 'Anthropic API Key', placeholder: 'sk-ant-api03-…', link: 'https://console.anthropic.com/settings/keys', linkText: 'Get your Anthropic API key ↗' },
  deepseek:  { label: 'DeepSeek API Key',  placeholder: 'sk-…',           link: 'https://platform.deepseek.com/api_keys',         linkText: 'Get your DeepSeek API key ↗' }
};

/* ── State ──────────────────────────────────────────────── */
let activeModuleId  = null;
let isGenerating    = false;
let fullOutput      = '';
let completedIds    = new Set(JSON.parse(localStorage.getItem('pm_done') || '[]'));
let currentProvider = localStorage.getItem('pm_provider') || 'anthropic';
const serverKeys    = { anthropic: false, deepseek: false };

/* ── DOM ─────────────────────────────────────────────────── */
const loginScreen   = document.getElementById('login-screen');
const dashboard     = document.getElementById('dashboard');
const pwInput       = document.getElementById('pw-input');
const loginError    = document.getElementById('login-error');
const settingsModal = document.getElementById('settings-modal');
const apiKeyInput   = document.getElementById('api-key-input');
const modelSelect   = document.getElementById('model-select');
const savedMsg      = document.getElementById('saved-msg');
const moduleGrid    = document.getElementById('module-grid');
const viewOverview  = document.getElementById('view-overview');
const viewModule    = document.getElementById('view-module');
const mIcon         = document.getElementById('m-icon');
const mTitle        = document.getElementById('m-title');
const mDesc         = document.getElementById('m-desc');
const inputFields   = document.getElementById('input-fields');
const btnGenerate   = document.getElementById('btn-generate');
const btnText       = document.getElementById('btn-text');
const btnSpinner    = document.getElementById('btn-spinner');
const btnClear      = document.getElementById('btn-clear');
const btnCopy       = document.getElementById('btn-copy');
const outputPlaceholder = document.getElementById('output-placeholder');
const outputContent = document.getElementById('output-content');
const statusDot     = document.getElementById('status-dot');
const statusLabel   = document.getElementById('status-label');
const statDone      = document.getElementById('stat-done');
const modelPill     = document.getElementById('model-pill');
const docDrawer     = document.getElementById('doc-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerTitle   = document.getElementById('drawer-title');
const drawerLoader  = document.getElementById('drawer-loader');
const docsBody      = document.getElementById('docs-body');
const providerToggle = document.getElementById('provider-toggle');
const apiKeyLabel   = document.getElementById('api-key-label');
const apiKeyLink    = document.getElementById('api-key-link');

/* ── Auth ────────────────────────────────────────────────── */
(function checkAuth() {
  if (sessionStorage.getItem('pm_admin') === 'true') showDashboard();
})();

document.getElementById('toggle-pw').onclick = () => {
  pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
};
document.getElementById('btn-login').onclick = login;
pwInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') login(); });

async function login() {
  const password = pwInput.value.trim();
  if (!password) return;
  loginError.classList.add('hidden');
  try {
    const res  = await fetch('/api/verify-admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const data = await res.json();
    if (data.success) { sessionStorage.setItem('pm_admin', 'true'); showDashboard(); }
    else { loginError.classList.remove('hidden'); pwInput.value = ''; pwInput.focus(); }
  } catch { loginError.textContent = 'Connection error — is the server running?'; loginError.classList.remove('hidden'); }
}

document.getElementById('btn-logout').onclick = () => { sessionStorage.removeItem('pm_admin'); location.reload(); };

/* ── Show Dashboard ──────────────────────────────────────── */
async function showDashboard() {
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  await checkServerConfig();
  loadSettings();
  buildModuleGrid();
  buildNavHandlers();
  updateStats();
}

/* ── Check server config ─────────────────────────────────── */
async function checkServerConfig() {
  try {
    const res  = await fetch('/api/config');
    const data = await res.json();
    serverKeys.anthropic = data.anthropic?.hasServerKey || false;
    serverKeys.deepseek  = data.deepseek?.hasServerKey  || false;
    if (serverKeys.anthropic || serverKeys.deepseek) {
      statusDot.classList.add('on');
      statusLabel.textContent = 'API ready';
    }
  } catch { /* degrade gracefully */ }
}

function updateServerNotice() {
  const serverNotice   = document.getElementById('server-key-notice');
  const userKeySection = document.getElementById('user-key-section');
  const hasKey = serverKeys[currentProvider];
  serverNotice.classList.toggle('hidden', !hasKey);
  userKeySection.classList.toggle('hidden', hasKey);
}

/* ── Settings ────────────────────────────────────────────── */
function loadSettings() {
  switchProvider(currentProvider);
}

function saveSettings() {
  const key   = apiKeyInput.value.trim();
  const model = modelSelect.value;
  if (key) localStorage.setItem(`pm_key_${currentProvider}`, key);
  localStorage.setItem(`pm_model_${currentProvider}`, model);
  updateApiStatus(!!(key || serverKeys[currentProvider]), model);
  savedMsg.classList.remove('hidden');
  setTimeout(() => savedMsg.classList.add('hidden'), 2000);
}

function switchProvider(p) {
  currentProvider = p;
  localStorage.setItem('pm_provider', p);
  document.querySelectorAll('.provider-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.provider === p);
  });
  const cfg = PROVIDER_KEY_CONFIG[p];
  if (apiKeyLabel) apiKeyLabel.textContent = cfg.label;
  if (apiKeyLink)  { apiKeyLink.textContent = cfg.linkText; apiKeyLink.href = cfg.link; }
  apiKeyInput.placeholder = cfg.placeholder;
  const savedKey = localStorage.getItem(`pm_key_${p}`) || '';
  apiKeyInput.value = savedKey;
  modelSelect.innerHTML = '';
  PROVIDER_MODELS[p].forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.value; opt.textContent = m.label;
    modelSelect.appendChild(opt);
  });
  const savedModel = localStorage.getItem(`pm_model_${p}`) || PROVIDER_MODELS[p][0].value;
  modelSelect.value = savedModel;
  updateServerNotice();
  updateApiStatus(!!(savedKey || serverKeys[p]), savedModel);
}

function updateApiStatus(hasKey, model) {
  statusDot.classList.toggle('on', hasKey);
  statusLabel.textContent = hasKey ? 'API ready' : 'No API key';
  if (modelPill) {
    let name;
    if (currentProvider === 'deepseek') {
      name = (model || '').includes('reasoner') ? 'DS Reasoner' : 'DS Chat';
    } else {
      name = (model || '').includes('opus') ? 'Opus 4.8' : (model || '').includes('sonnet') ? 'Sonnet 4.6' : 'Haiku 4.5';
    }
    modelPill.textContent = name;
  }
}

[document.getElementById('open-settings'), document.getElementById('open-settings-sb')].forEach(el => {
  if (el) el.onclick = () => settingsModal.classList.remove('hidden');
});
document.getElementById('close-settings').onclick = () => settingsModal.classList.add('hidden');
document.getElementById('save-settings').onclick  = saveSettings;
document.getElementById('toggle-key').onclick = () => { apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password'; };
settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.add('hidden'); });
if (providerToggle) {
  providerToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.provider-btn');
    if (btn) switchProvider(btn.dataset.provider);
  });
}

/* ── Stats ───────────────────────────────────────────────── */
function updateStats() { if (statDone) statDone.textContent = completedIds.size; }

/* ── Module Grid ─────────────────────────────────────────── */
function buildModuleGrid() {
  if (!moduleGrid) return;
  moduleGrid.innerHTML = '';
  MODULES.forEach(m => {
    const card = document.createElement('div');
    card.className = 'module-card';
    card.style.setProperty('--module-color', m.color);
    card.style.setProperty('--module-gradient', m.gradient);
    const done = completedIds.has(m.id);
    card.innerHTML = `
      <div class="mc-header">
        <div class="mc-icon-sm" style="background:${m.gradient}">${m.icon}</div>
      </div>
      <div class="mc-name">${m.name}</div>
      <div class="mc-desc">${m.desc}</div>
      ${done ? '<div class="mc-done">✓ Completed</div>' : ''}
    `;
    card.addEventListener('click', () => openModule(m.id));
    moduleGrid.appendChild(card);
  });
}

/* ── Nav Handlers ────────────────────────────────────────── */
function buildNavHandlers() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    const view = btn.dataset.view;
    btn.onclick = () => {
      if (view === 'overview') switchView('overview');
      if (view === 'module')   openModule(btn.dataset.id);
      setActiveNav(btn);
    };
    if (view === 'module' && completedIds.has(btn.dataset.id)) btn.classList.add('done');
  });

  document.querySelectorAll('.header-doc-btn').forEach(btn => {
    btn.onclick = () => openDrawer(btn.dataset.doc);
  });
}

function setActiveNav(target) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  target.classList.add('active');
}

/* ── View Switcher ───────────────────────────────────────── */
function switchView(name) {
  viewOverview.classList.toggle('active', name === 'overview');
  viewModule.classList.toggle('active',   name === 'module');
}

/* ── Open Module ─────────────────────────────────────────── */
function openModule(id) {
  const m = MODULES.find(x => x.id === id);
  if (!m) return;
  activeModuleId = id;
  switchView('module');

  const navBtn = document.querySelector(`.nav-item[data-id="${id}"]`);
  if (navBtn) setActiveNav(navBtn);

  mIcon.style.background = m.gradient;
  mIcon.textContent = m.icon;
  mTitle.textContent = m.name;
  mDesc.textContent  = m.desc;
  btnGenerate.style.background = m.gradient;

  buildInputs(m);
  clearOutput();
}

/* ── Build Inputs ────────────────────────────────────────── */
function buildInputs(m) {
  inputFields.innerHTML = '';
  m.inputs.forEach(inp => {
    const group = document.createElement('div');
    group.className = 'form-group';
    const label = document.createElement('label');
    label.textContent = inp.label;
    label.setAttribute('for', `inp-${inp.id}`);
    group.appendChild(label);
    let el;
    if (inp.type === 'select') {
      el = document.createElement('select');
      inp.opts.forEach(o => { const opt = document.createElement('option'); opt.value = o; opt.textContent = o; el.appendChild(opt); });
    } else if (inp.type === 'textarea') {
      el = document.createElement('textarea'); el.placeholder = inp.ph;
    } else {
      el = document.createElement('input'); el.type = 'text'; el.placeholder = inp.ph;
    }
    el.id = `inp-${inp.id}`;
    group.appendChild(el);
    inputFields.appendChild(group);
  });
}

/* ── Generate ────────────────────────────────────────────── */
btnGenerate.onclick = generate;
btnClear.onclick    = clearOutput;
btnCopy.onclick     = copyOutput;

async function generate() {
  if (isGenerating) return;
  const apiKey = localStorage.getItem(`pm_key_${currentProvider}`) || localStorage.getItem('pm_api_key') || '';
  if (!serverKeys[currentProvider] && !apiKey) { settingsModal.classList.remove('hidden'); return; }
  const m = MODULES.find(x => x.id === activeModuleId);
  if (!m) return;
  const values = {}; let valid = true;
  m.inputs.forEach(inp => { const el = document.getElementById(`inp-${inp.id}`); values[inp.id] = el ? el.value.trim() : ''; if (!values[inp.id] && inp.type !== 'select') valid = false; });
  if (!valid) { alert('Please fill in all fields before generating.'); return; }
  setGenerating(true); clearOutput(); showOutputArea(); fullOutput = '';
  const model = modelSelect.value || PROVIDER_MODELS[currentProvider][0].value;
  try {
    const resp = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ systemPrompt: m.system, userPrompt: m.prompt(values), apiKey, model, provider: currentProvider }) });
    if (!resp.ok) { const err = await resp.json().catch(() => ({ error: resp.statusText })); throw new Error(err.error || resp.statusText); }
    const reader = resp.body.getReader(); const decoder = new TextDecoder();
    while (true) { const { done, value } = await reader.read(); if (done) break; fullOutput += decoder.decode(value, { stream: true }); renderStreaming(fullOutput); }
    renderFinal(fullOutput); markDone(m.id);
  } catch (err) { renderError(err.message); }
  finally { setGenerating(false); }
}

function renderStreaming(text) {
  outputContent.classList.remove('hidden'); outputPlaceholder.classList.add('hidden');
  outputContent.style.whiteSpace = 'pre-wrap';
  outputContent.innerHTML = escapeHtml(text) + '<span class="cursor"></span>';
  outputContent.parentElement.scrollTop = outputContent.parentElement.scrollHeight;
}
function renderFinal(text) {
  outputContent.style.whiteSpace = '';
  outputContent.innerHTML = window.marked ? marked.parse(text) : escapeHtml(text).replace(/\n/g,'<br>');
  btnCopy.classList.remove('hidden'); btnClear.classList.remove('hidden');
}
function renderError(msg) {
  outputContent.classList.remove('hidden'); outputPlaceholder.classList.add('hidden');
  outputContent.style.whiteSpace = 'pre-wrap';
  outputContent.innerHTML = `<span style="color:#ef4444">⚠ Error: ${escapeHtml(msg)}\n\nCheck your API key in Settings.</span>`;
}
function showOutputArea() { outputContent.classList.remove('hidden'); outputPlaceholder.classList.add('hidden'); outputContent.innerHTML = ''; }
function clearOutput() { outputContent.classList.add('hidden'); outputContent.innerHTML = ''; outputPlaceholder.classList.remove('hidden'); btnCopy.classList.add('hidden'); btnClear.classList.add('hidden'); fullOutput = ''; }
function setGenerating(state) { isGenerating = state; btnGenerate.disabled = state; btnText.classList.toggle('hidden', state); btnSpinner.classList.toggle('hidden', !state); }
function copyOutput() {
  if (!fullOutput) return;
  navigator.clipboard.writeText(fullOutput).then(() => { btnCopy.textContent = 'Copied!'; btnCopy.classList.add('copied'); setTimeout(() => { btnCopy.textContent = 'Copy'; btnCopy.classList.remove('copied'); }, 2000); });
}
function markDone(id) {
  completedIds.add(id); localStorage.setItem('pm_done', JSON.stringify([...completedIds]));
  document.querySelectorAll(`.nav-item[data-id="${id}"]`).forEach(b => b.classList.add('done'));
  updateStats(); buildModuleGrid();
}

/* ── Doc Drawer ──────────────────────────────────────────── */
const DOC_TITLES = { workflow: '⚙ Workflow', documentation: '📖 Documentation', changelog: '📋 Changelog' };

async function openDrawer(type) {
  drawerTitle.textContent = DOC_TITLES[type] || type;
  drawerLoader.classList.remove('hidden');
  docsBody.classList.add('hidden');
  docsBody.innerHTML = '';
  docDrawer.classList.remove('hidden');
  drawerOverlay.classList.remove('hidden');

  try {
    const res  = await fetch(`/api/content/${type}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    docsBody.innerHTML = window.marked ? marked.parse(data.content) : `<pre>${data.content}</pre>`;
    drawerLoader.classList.add('hidden');
    docsBody.classList.remove('hidden');
  } catch (err) {
    drawerLoader.classList.add('hidden');
    docsBody.innerHTML = `<p style="color:#ef4444">Failed to load: ${err.message}</p>`;
    docsBody.classList.remove('hidden');
  }
}

function closeDrawer() {
  docDrawer.classList.add('hidden');
  drawerOverlay.classList.add('hidden');
}

document.getElementById('close-drawer').onclick = closeDrawer;
drawerOverlay.onclick = closeDrawer;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

/* ── Util ────────────────────────────────────────────────── */
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
