'use strict';

/* ── Module Definitions ─────────────────────────────────── */
const MODULES = [
  {
    id: 'growth-strategy',
    name: 'Growth Strategy Commander',
    short: 'Strategy',
    icon: '⚡',
    color: '#4f9cf9',
    gradient: 'linear-gradient(135deg,#4f9cf9,#1e6fd4)',
    desc: 'Elite social media manager mode — audience psychology, platform algorithms, viral distribution & scalable content ops.',
    inputs: [
      { id: 'niche',    label: 'Your Niche',    type: 'text',   ph: 'e.g., fitness coaching, SaaS, personal finance' },
      { id: 'platform', label: 'Platform',       type: 'select', opts: ['Instagram','TikTok','YouTube','LinkedIn','Twitter/X','Facebook','Pinterest','Threads'] },
      { id: 'goal',     label: 'Growth Goal',    type: 'text',   ph: 'e.g., reach 10K followers in 90 days' }
    ],
    system: 'You are an elite social media manager and growth strategist. Respond with richly formatted markdown: use ## for sections, bold key points, and bullet lists for actionable items.',
    prompt: (v) => `Act as an elite social media manager and growth strategist with deep expertise in audience psychology, retention-focused content, platform algorithms, viral distribution systems, and scalable content operations.

My niche: ${v.niche}
My platform: ${v.platform}
My growth goal: ${v.goal}

Deliver a comprehensive growth strategy with these sections:
## Strategic Positioning
## Core Content Pillars (5–7 pillars)
## Posting Schedule & Cadence
## Algorithm-Specific Engagement Tactics
## KPIs & Success Metrics
## 30-Day Action Plan (week by week)

Be specific, actionable, and focused on measurable results.`
  },
  {
    id: 'audience-psychology',
    name: 'Audience Psychology Decoder',
    short: 'Psychology',
    icon: '🧠',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)',
    desc: 'Deep audience analysis — desires, frustrations, emotional triggers, attention patterns & psychological motivations.',
    inputs: [
      { id: 'niche', label: 'Your Niche', type: 'text', ph: 'e.g., online fitness coaching, B2B SaaS, crypto investing' }
    ],
    system: 'You are an expert audience psychologist and consumer behavior researcher. Use markdown with clear ## section headers, bullet points, and bold key insights.',
    prompt: (v) => `Analyze my target audience deeply for the "${v.niche}" niche.

Identify their biggest desires, frustrations, emotional triggers, attention patterns, content preferences, and psychological motivations so future content becomes highly engaging and relevant.

Structure the analysis with these sections:
## Core Demographics & Psychographics
## Top 5 Desires & Aspirations
## Top 5 Frustrations & Pain Points
## Key Emotional Triggers (what makes them click, share, save)
## Attention Patterns & Scroll Behavior
## Content Format Preferences
## Psychological Motivations (the deeper WHY)
## Identity & Self-Perception Gap
## Content Strategy Implications

Be specific to "${v.niche}" — no generic filler.`
  },
  {
    id: 'viral-content',
    name: 'Viral Content Idea Engine',
    short: 'Content Ideas',
    icon: '🚀',
    color: '#f97316',
    gradient: 'linear-gradient(135deg,#f97316,#ea580c)',
    desc: 'Generate 30 highly engaging content ideas using curiosity triggers, emotional reactions & proven viral frameworks.',
    inputs: [
      { id: 'niche', label: 'Your Niche', type: 'text', ph: 'e.g., productivity for entrepreneurs, vegan recipes, web design' }
    ],
    system: 'You are a viral content strategist. Generate specific, high-potential ideas formatted in clear markdown sections.',
    prompt: (v) => `Generate 30 highly engaging content ideas for the "${v.niche}" niche using curiosity triggers, emotional reactions, controversy angles, transformation stories, audience pain points, and proven high-performing content frameworks.

Organize into 6 categories of 5 ideas each:

## 🔍 Curiosity & Mystery (5 ideas)
## 💥 Emotional Story & Transformation (5 ideas)
## 🔥 Controversy & Hot Takes (5 ideas)
## 😣 Pain Point Solutions (5 ideas)
## ✅ Proof & Social Validation (5 ideas)
## 📚 Education & Value Bombs (5 ideas)

For each idea provide:
- **Concept**: The specific content idea
- **Why it works**: Psychological trigger being used
- **Hook line**: The opening line ready to use

All 30 ideas must be specific to "${v.niche}".`
  },
  {
    id: 'hook-engineering',
    name: 'Hook Engineering Lab',
    short: 'Hook Lab',
    icon: '🎯',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg,#ef4444,#dc2626)',
    desc: 'Scroll-stopping opening hooks engineered to capture attention instantly using psychology & proven triggers.',
    inputs: [
      { id: 'niche', label: 'Your Niche', type: 'text', ph: 'e.g., real estate investing, mindset coaching, AI tools' }
    ],
    system: 'You are a master copywriter and hook engineer. Write powerful, platform-ready hooks organized in clear markdown sections.',
    prompt: (v) => `Generate powerful opening hooks for content in the "${v.niche}" niche optimized to stop scrolling immediately.

Create 20 hooks across these categories:

## 🕳️ Curiosity Gap Hooks (4 hooks)
*Create irresistible knowledge gaps*

## 🪞 Identity & Relatability Hooks (4 hooks)
*"This is you" statements that feel deeply personal*

## 📊 Shocking Stat & Fact Hooks (3 hooks)
*Numbers or facts that demand attention*

## ⏰ Urgency & Stakes Hooks (3 hooks)
*Create FOMO or a sense of consequence*

## 🚫 Contrarian & Controversy Hooks (3 hooks)
*Challenge what they think they know*

## 🔄 Transformation Hooks (3 hooks)
*Promise or reveal a dramatic before/after*

For each hook: write the **exact hook text** (copy-ready) followed by the psychological trigger in parentheses.

All hooks must be specific to "${v.niche}".`
  },
  {
    id: 'algorithm-strategy',
    name: 'Algorithm Intelligence Briefing',
    short: 'Algorithm',
    icon: '📡',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg,#22c55e,#16a34a)',
    desc: 'Platform-specific algorithm playbook for maximum organic reach, distribution & visibility.',
    inputs: [
      { id: 'platform', label: 'Platform', type: 'select', opts: ['Instagram','TikTok','YouTube','LinkedIn','Twitter/X','Facebook','Pinterest','Threads'] },
      { id: 'niche',    label: 'Your Niche', type: 'text', ph: 'e.g., fashion, tech reviews, business coaching' }
    ],
    system: 'You are a platform algorithm expert. Deliver specific, current, and actionable intelligence formatted with clear markdown sections.',
    prompt: (v) => `Act as a platform growth strategist. Based on my platform and niche, explain the content behaviors, engagement patterns, and content structures most likely to increase algorithmic distribution and audience reach.

Platform: ${v.platform}
Niche: ${v.niche}

Deliver a comprehensive algorithm intelligence briefing:

## How the ${v.platform} Algorithm Works
## Key Engagement Signals (ranked by importance)
## Optimal Content Structure & Format
## Posting Strategy (timing, frequency, consistency)
## Niche-Specific Tactics for "${v.niche}" on ${v.platform}
## Engagement Loop Strategy (driving comments, shares, saves)
## Reach Killers — What to Avoid
## 30-Day Algorithm Reset Plan

Be ${v.platform}-specific — not generic social media advice.`
  },
  {
    id: 'content-repurposing',
    name: 'Content Repurposing Multiplier',
    short: 'Repurpose',
    icon: '♻️',
    color: '#f5c842',
    gradient: 'linear-gradient(135deg,#f5c842,#d97706)',
    desc: 'Transform one content idea into 6+ platform-native formats for scalable, high-output content production.',
    inputs: [
      { id: 'content', label: 'Your Content Idea', type: 'textarea', ph: 'Paste your content idea, topic, script, or core message here...' }
    ],
    system: 'You are a content repurposing strategist. Transform ideas into platform-native formats. Use markdown with clear ## section headers for each format.',
    prompt: (v) => `Take the following content idea and repurpose it into multiple platform-specific formats so content production becomes scalable.

**Original Content Idea:**
${v.content}

Repurpose into 6 platform-specific formats:

## 1. Short-Form Video Script (TikTok / Reels / Shorts)
Include: Hook (0–3s) → Main content → CTA

## 2. Carousel Post (Instagram / LinkedIn)
Include: Cover slide text, slides 2–7 key points, final CTA slide

## 3. Long-Form Caption (Instagram / Facebook)
Include: Opening hook, story/value body, engagement CTA

## 4. Twitter/X Thread
Include: Tweet 1 (hook), tweets 2–7 (value), final tweet (CTA + summary)

## 5. LinkedIn Post
Include: Attention-grabbing opener, professional narrative, call to connect

## 6. Engagement Bait Post
Include: 2–3 question-based variations designed to maximize comments

Each format must be platform-native, copy-ready, and adapted from the original idea.`
  }
];

/* ── State ──────────────────────────────────────────────── */
let activeModule = null;
let isGenerating  = false;
let fullOutput    = '';
let completedIds  = new Set(JSON.parse(localStorage.getItem('pm_done') || '[]'));

/* ── DOM Refs ────────────────────────────────────────────── */
const nav             = document.getElementById('nav');
const welcome         = document.getElementById('welcome');
const welcomeCards    = document.getElementById('welcome-cards');
const moduleView      = document.getElementById('module-view');
const mIcon           = document.getElementById('m-icon');
const mTitle          = document.getElementById('m-title');
const mDesc           = document.getElementById('m-desc');
const moduleHeader    = document.getElementById('module-header');
const inputFields     = document.getElementById('input-fields');
const btnGenerate     = document.getElementById('btn-generate');
const btnText         = document.getElementById('btn-text');
const btnSpinner      = document.getElementById('btn-spinner');
const btnClear        = document.getElementById('btn-clear');
const btnCopy         = document.getElementById('btn-copy');
const outputPlaceholder = document.getElementById('output-placeholder');
const outputContent   = document.getElementById('output-content');
const settingsModal   = document.getElementById('settings-modal');
const apiKeyInput     = document.getElementById('api-key-input');
const modelSelect     = document.getElementById('model-select');
const savedMsg        = document.getElementById('saved-msg');

/* ── Init ────────────────────────────────────────────────── */
function init() {
  buildNav();
  buildWelcomeCards();
  loadSettings();

  document.getElementById('open-settings').onclick  = () => settingsModal.classList.remove('hidden');
  document.getElementById('close-settings').onclick = () => settingsModal.classList.add('hidden');
  settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.add('hidden'); });

  document.getElementById('toggle-key').onclick = () => {
    apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
  };
  document.getElementById('save-settings').onclick = saveSettings;
  btnGenerate.onclick = generate;
  btnClear.onclick    = clearOutput;
  btnCopy.onclick     = copyOutput;
}

/* ── Nav ─────────────────────────────────────────────────── */
function buildNav() {
  nav.innerHTML = '';
  MODULES.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'nav-item' + (completedIds.has(m.id) ? ' done' : '');
    btn.dataset.id = m.id;
    btn.innerHTML = `<span class="nav-icon">${m.icon}</span><span class="nav-label">${m.short}</span><span class="nav-check">✓</span>`;
    btn.style.setProperty('--module-color', m.color);
    btn.onclick = () => openModule(m.id);
    nav.appendChild(btn);
  });
}

function buildWelcomeCards() {
  welcomeCards.innerHTML = '';
  MODULES.forEach(m => {
    const card = document.createElement('div');
    card.className = 'wc';
    card.style.setProperty('--module-color', m.color);
    card.innerHTML = `<div class="wc-icon">${m.icon}</div><div class="wc-name">${m.name}</div><div class="wc-desc">${m.desc}</div>`;
    card.onclick = () => openModule(m.id);
    welcomeCards.appendChild(card);
  });
}

/* ── Open Module ─────────────────────────────────────────── */
function openModule(id) {
  const m = MODULES.find(x => x.id === id);
  if (!m) return;
  activeModule = m;

  welcome.classList.add('hidden');
  moduleView.classList.remove('hidden');

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });

  moduleHeader.style.setProperty('--module-color', m.color);
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
      inp.opts.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o; opt.textContent = o;
        el.appendChild(opt);
      });
    } else if (inp.type === 'textarea') {
      el = document.createElement('textarea');
      el.placeholder = inp.ph;
    } else {
      el = document.createElement('input');
      el.type = 'text';
      el.placeholder = inp.ph;
    }
    el.id = `inp-${inp.id}`;
    group.appendChild(el);
    inputFields.appendChild(group);
  });
}

/* ── Generate ────────────────────────────────────────────── */
async function generate() {
  if (isGenerating) return;

  const apiKey = localStorage.getItem('pm_api_key');
  if (!apiKey) {
    settingsModal.classList.remove('hidden');
    return;
  }

  const m = activeModule;
  const values = {};
  let valid = true;

  m.inputs.forEach(inp => {
    const el = document.getElementById(`inp-${inp.id}`);
    values[inp.id] = el ? el.value.trim() : '';
    if (!values[inp.id] && inp.type !== 'select') valid = false;
  });

  if (!valid) {
    alert('Please fill in all fields before generating.');
    return;
  }

  setGenerating(true);
  clearOutput();
  showOutput();

  const userPrompt   = m.prompt(values);
  const systemPrompt = m.system;
  const model        = localStorage.getItem('pm_model') || 'claude-opus-4-8';

  fullOutput = '';

  try {
    const resp = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userPrompt, apiKey, model })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: resp.statusText }));
      throw new Error(err.error || resp.statusText);
    }

    const reader  = resp.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullOutput += chunk;
      renderStreaming(fullOutput);
    }

    renderFinal(fullOutput);
    markDone(m.id);
  } catch (err) {
    renderError(err.message);
  } finally {
    setGenerating(false);
  }
}

/* ── Render helpers ──────────────────────────────────────── */
function renderStreaming(text) {
  outputContent.classList.remove('hidden');
  outputPlaceholder.classList.add('hidden');
  outputContent.style.whiteSpace = 'pre-wrap';
  outputContent.innerHTML = escapeHtml(text) + '<span class="cursor"></span>';
  outputContent.parentElement.scrollTop = outputContent.parentElement.scrollHeight;
}

function renderFinal(text) {
  outputContent.style.whiteSpace = '';
  if (window.marked) {
    outputContent.innerHTML = marked.parse(text);
  } else {
    outputContent.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');
  }
  btnCopy.classList.remove('hidden');
  btnClear.classList.remove('hidden');
}

function renderError(msg) {
  outputContent.classList.remove('hidden');
  outputPlaceholder.classList.add('hidden');
  outputContent.style.whiteSpace = 'pre-wrap';
  outputContent.innerHTML = `<span style="color:#ef4444">⚠ Error: ${escapeHtml(msg)}\n\nPlease check your API key in Settings and try again.</span>`;
}

function showOutput() {
  outputContent.classList.remove('hidden');
  outputPlaceholder.classList.add('hidden');
  outputContent.innerHTML = '';
}

function clearOutput() {
  outputContent.classList.add('hidden');
  outputContent.innerHTML = '';
  outputPlaceholder.classList.remove('hidden');
  btnCopy.classList.add('hidden');
  btnClear.classList.add('hidden');
  fullOutput = '';
}

function setGenerating(state) {
  isGenerating = state;
  btnGenerate.disabled = state;
  btnText.classList.toggle('hidden', state);
  btnSpinner.classList.toggle('hidden', !state);
}

/* ── Copy ────────────────────────────────────────────────── */
function copyOutput() {
  if (!fullOutput) return;
  navigator.clipboard.writeText(fullOutput).then(() => {
    btnCopy.textContent = 'Copied!';
    btnCopy.classList.add('copied');
    setTimeout(() => { btnCopy.textContent = 'Copy'; btnCopy.classList.remove('copied'); }, 2000);
  });
}

/* ── Completed modules ───────────────────────────────────── */
function markDone(id) {
  completedIds.add(id);
  localStorage.setItem('pm_done', JSON.stringify([...completedIds]));
  const navBtn = document.querySelector(`.nav-item[data-id="${id}"]`);
  if (navBtn) navBtn.classList.add('done');
}

/* ── Settings ────────────────────────────────────────────── */
function loadSettings() {
  const key   = localStorage.getItem('pm_api_key') || '';
  const model = localStorage.getItem('pm_model')   || 'claude-opus-4-8';
  apiKeyInput.value = key;
  modelSelect.value = model;
}

function saveSettings() {
  const key   = apiKeyInput.value.trim();
  const model = modelSelect.value;
  if (key) localStorage.setItem('pm_api_key', key);
  localStorage.setItem('pm_model', model);
  savedMsg.classList.remove('hidden');
  setTimeout(() => savedMsg.classList.add('hidden'), 2000);
}

/* ── Util ────────────────────────────────────────────────── */
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Boot ────────────────────────────────────────────────── */
init();
