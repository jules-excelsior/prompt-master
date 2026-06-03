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
  },
  {
    id: 'content-calendar',
    name: 'Content Calendar Generator',
    icon: '📅', color: '#06b6d4',
    gradient: 'linear-gradient(135deg,#06b6d4,#0891b2)',
    desc: 'Generate a complete 30-day content calendar with daily post ideas, hooks, content angles, and formats tailored to your niche and platform.',
    inputs: [
      { id: 'niche',     label: 'Your Niche',          type: 'text',   ph: 'e.g., personal finance, fitness coaching, SaaS startup' },
      { id: 'platform',  label: 'Platform',             type: 'select', opts: ['Instagram','TikTok','YouTube','LinkedIn','Twitter/X','Facebook','Pinterest','Threads'] },
      { id: 'frequency', label: 'Posting Frequency',   type: 'select', opts: ['Daily (7x/week)','5x per week','3x per week','2x per week','Weekly'] },
      { id: 'pillars',   label: 'Content Pillars',      type: 'text',   ph: 'e.g., education, inspiration, behind-the-scenes, promotion' }
    ],
    system: 'You are an expert content strategist and social media planner. Create detailed, actionable 30-day content calendars with richly structured markdown.',
    prompt: (v) => `Create a complete 30-day content calendar for a ${v.niche} creator on ${v.platform}, posting ${v.frequency}.\n\nContent Pillars: ${v.pillars}\n\nFor each post include:\n- **Day & Date label** (Day 1, Day 2, etc.)\n- **Content Pillar**\n- **Format** (Reel, carousel, static, story, thread, etc.)\n- **Hook / Opening Line** (copy-ready)\n- **Content Angle** (what the post is actually about)\n- **CTA** (call to action)\n\nOrganize into 4 weeks:\n## Week 1 — Foundation\n## Week 2 — Momentum\n## Week 3 — Authority\n## Week 4 — Conversion\n\nAdd a brief strategy note at the top explaining the arc for the month.`
  },
  {
    id: 'hashtag-strategy',
    name: 'Hashtag & SEO Strategy',
    icon: '🏷️', color: '#8b5cf6',
    gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    desc: 'Build a complete hashtag research playbook with tiered sets, rotation schedules, and platform-specific SEO tactics to maximize discoverability.',
    inputs: [
      { id: 'niche',       label: 'Your Niche',      type: 'text',   ph: 'e.g., sustainable fashion, B2B marketing, online fitness' },
      { id: 'platform',    label: 'Platform',         type: 'select', opts: ['Instagram','TikTok','LinkedIn','Twitter/X','YouTube','Pinterest','Threads'] },
      { id: 'contentType', label: 'Content Type',     type: 'text',   ph: 'e.g., transformation reels, thought leadership posts, tutorial videos' }
    ],
    system: 'You are a hashtag research specialist and social media SEO expert. Provide specific, data-driven hashtag and discoverability strategies in structured markdown.',
    prompt: (v) => `Create a complete hashtag and SEO strategy for a ${v.niche} creator posting ${v.contentType} on ${v.platform}.\n\n## Strategy Overview\n## Tier 1 — Mega Hashtags (1M+ posts) — Use sparingly (2–3)\n## Tier 2 — Large Hashtags (100K–1M posts) — Core reach (5–7)\n## Tier 3 — Medium Hashtags (10K–100K posts) — Sweet spot (8–10)\n## Tier 4 — Niche Hashtags (1K–10K posts) — High conversion (5–7)\n## Branded & Community Hashtags\n## 4-Week Rotation Schedule (vary sets to avoid shadowban)\n## Platform-Specific SEO Tips for ${v.platform}\n## Caption & Bio SEO Keywords\n## What to Avoid (shadowban triggers, banned tags)\n\nInclude 30–40 specific example hashtags throughout.`
  },
  {
    id: 'bio-optimizer',
    name: 'Bio & Profile Optimizer',
    icon: '🪪', color: '#ec4899',
    gradient: 'linear-gradient(135deg,#ec4899,#be185d)',
    desc: 'Craft an irresistible social media bio that converts profile visitors into followers — optimized for your platform, niche, and growth goals.',
    inputs: [
      { id: 'niche',    label: 'Your Niche / Profession', type: 'text',   ph: 'e.g., fitness coach, SaaS founder, travel photographer' },
      { id: 'platform', label: 'Platform',                 type: 'select', opts: ['Instagram','TikTok','LinkedIn','Twitter/X','YouTube','Pinterest','Threads'] },
      { id: 'audience', label: 'Target Audience',          type: 'text',   ph: 'e.g., busy moms who want to lose weight, early-stage startup founders' },
      { id: 'goal',     label: 'Profile Goal',             type: 'text',   ph: 'e.g., get DMs, drive link-in-bio clicks, build authority' }
    ],
    system: 'You are an expert personal brand strategist and conversion copywriter. Write compelling, platform-native bios with structured markdown.',
    prompt: (v) => `Create an optimized ${v.platform} bio and profile strategy for a ${v.niche} targeting ${v.audience}. Goal: ${v.goal}.\n\n## Bio Analysis Framework\n## 5 Bio Variations (from punchy to detailed)\nFor each: write the full bio text, then explain the psychological angle and what makes it work.\n\n## Keyword Optimization\nList the most important keywords to include for ${v.platform} SEO discoverability.\n\n## Profile Name & Username Strategy\nRecommendations for display name and handle optimization.\n\n## Link-in-Bio Strategy\nWhat to link to and how to frame the CTA in the bio.\n\n## Highlights / Featured Sections\nFor platforms that support it: what to pin, feature, or highlight.\n\n## Profile Photo & Banner Tips\nVisual identity recommendations for the ${v.niche} niche.\n\n## Profile Audit Checklist\n10-point checklist to ensure the full profile is conversion-optimized.`
  },
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis Module',
    icon: '🔍', color: '#14b8a6',
    gradient: 'linear-gradient(135deg,#14b8a6,#0d9488)',
    desc: 'Deep competitive intelligence report — analyze what top competitors are doing right, find gaps to exploit, and extract a winning differentiation strategy.',
    inputs: [
      { id: 'niche',       label: 'Your Niche',          type: 'text',   ph: 'e.g., online fitness coaching, B2B SaaS, personal finance' },
      { id: 'platform',    label: 'Platform',             type: 'select', opts: ['Instagram','TikTok','YouTube','LinkedIn','Twitter/X','Facebook','Pinterest','Threads'] },
      { id: 'competitors', label: 'Competitor Names / Handles', type: 'text', ph: 'e.g., @hubspot, @garyvee, Tony Robbins — list 2–4' }
    ],
    system: 'You are a competitive intelligence analyst and social media strategist. Deliver sharp, actionable competitor breakdowns in structured markdown.',
    prompt: (v) => `Conduct a deep competitor analysis for the ${v.niche} niche on ${v.platform}.\n\nCompetitors to analyze: ${v.competitors}\n\n## Competitive Landscape Overview\nHow this niche is structured on ${v.platform} — key players, audience size ranges, content volume.\n\n## Individual Competitor Breakdown\nFor each competitor listed:\n- **Positioning & Unique Angle** — what they stand for\n- **Content Strategy** — formats, frequency, themes\n- **Engagement Tactics** — what drives comments/shares\n- **Strengths** — what they do exceptionally well\n- **Weaknesses / Gaps** — what they're missing\n\n## Content Gap Analysis\nTopic areas and formats that are underserved in this niche.\n\n## Differentiation Strategy\n5 concrete ways to position differently and stand out from these competitors.\n\n## Steal & Improve\n3 tactics from competitors worth adapting (and how to do it better).\n\n## Your Competitive Moat\nHow to build a defensible content brand that's hard to replicate.\n\n## 30-Day Counter-Positioning Plan\nFirst month of content moves to establish differentiated positioning.`
  },
  {
    id: 'caption-rewriter',
    name: 'Caption Rewriter',
    icon: '✍️', color: '#f43f5e',
    gradient: 'linear-gradient(135deg,#f43f5e,#e11d48)',
    desc: 'Instantly rewrite any caption into 5 different tones — professional, casual, funny, inspirational, and bold — all optimized for maximum engagement.',
    inputs: [
      { id: 'caption',  label: 'Original Caption',  type: 'textarea', ph: 'Paste your existing caption here — or describe the post idea…' },
      { id: 'platform', label: 'Platform',           type: 'select',   opts: ['Instagram','TikTok','LinkedIn','Twitter/X','Facebook','Threads','YouTube'] },
      { id: 'niche',    label: 'Your Niche',         type: 'text',     ph: 'e.g., fitness coaching, real estate, food blogging' }
    ],
    system: 'You are a master copywriter who specializes in social media captions. Rewrite captions in multiple distinct tones with structured markdown.',
    prompt: (v) => `Rewrite this ${v.platform} caption for a ${v.niche} account in 5 distinct tones:\n\n**Original:**\n${v.caption}\n\nFor each rewrite:\n- Write the full caption (platform-native length for ${v.platform})\n- Include relevant emojis where natural\n- Add a CTA at the end\n- Note: [tone] + [psychological hook used]\n\n## ✍️ Version 1 — Professional & Authoritative\n## 😄 Version 2 — Casual & Conversational\n## 😂 Version 3 — Funny & Relatable\n## 🔥 Version 4 — Inspirational & Motivational\n## ⚡ Version 5 — Bold & Provocative\n\n## Recommended Hashtags\n15 targeted hashtags for this post in the ${v.niche} niche.\n\n## Best Version Recommendation\nWhich version to use and why, based on ${v.platform} engagement patterns.`
  },
  {
    id: 'dm-outreach',
    name: 'DM / Outreach Script Generator',
    icon: '💬', color: '#3b82f6',
    gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    desc: 'Generate high-converting DM and outreach scripts for collaborations, sales, networking, and community building — personalized and non-spammy.',
    inputs: [
      { id: 'purpose',  label: 'Outreach Purpose',   type: 'select', opts: ['Collaboration / Collab Post','Sales / Offer Introduction','Podcast / Interview Request','Networking / Build Relationship','Brand Partnership Pitch','Influencer Outreach','Community Invitation','Follow-Up Message'] },
      { id: 'niche',    label: 'Your Niche',          type: 'text',   ph: 'e.g., fitness coaching, SaaS, real estate investing' },
      { id: 'audience', label: 'Who You\'re DMing',   type: 'text',   ph: 'e.g., fitness influencers with 10K–100K followers, local business owners' },
      { id: 'offer',    label: 'Your Value / Offer',  type: 'text',   ph: 'e.g., free strategy call, revenue share collab, guest post on my 50K newsletter' }
    ],
    system: 'You are a direct response copywriter and outreach specialist. Write genuine, high-converting DM scripts that feel human and personal.',
    prompt: (v) => `Create a complete ${v.purpose} DM outreach script pack for a ${v.niche} creator reaching out to ${v.audience}.\n\nValue/Offer: ${v.offer}\n\n## Outreach Strategy\nBrief note on the psychology of this outreach type and why the approach works.\n\n## Script 1 — Cold Outreach (First Contact)\nFull DM script. Warm, specific, non-salesy. Under 150 words.\n\n## Script 2 — Warm Outreach (After Engaging Their Content)\nFull DM script referencing something specific about their content. Under 120 words.\n\n## Script 3 — Direct & Bold (For High-Volume Outreach)\nFull DM script. Get to the point fast. Under 80 words.\n\n## Follow-Up Script (No Reply After 5–7 Days)\nFull follow-up DM. Adds value, not desperation. Under 60 words.\n\n## Response Handling Scripts\n- If they say "not interested"\n- If they ask for more info\n- If they leave you on read\n\n## Personalization Variables\nList of [brackets] in the scripts to customize per recipient.\n\n## Outreach Sequence\nRecommended timing and order for a 3-touch outreach sequence.`
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

/* ── Session helpers ─────────────────────────────────────── */
function isAdmin()     { return sessionStorage.getItem('pm_role') === 'admin'; }
function getUserName() { return sessionStorage.getItem('pm_user_name') || ''; }
function getUserEmail(){ return sessionStorage.getItem('pm_user_email') || ''; }
function getAdminPw()  { return sessionStorage.getItem('pm_admin_pw') || ''; }

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
const viewSaved     = document.getElementById('view-saved');
const viewUsers     = document.getElementById('view-users');
const mIcon         = document.getElementById('m-icon');
const mTitle        = document.getElementById('m-title');
const mDesc         = document.getElementById('m-desc');
const inputFields   = document.getElementById('input-fields');
const btnGenerate   = document.getElementById('btn-generate');
const btnText       = document.getElementById('btn-text');
const btnSpinner    = document.getElementById('btn-spinner');
const btnClear      = document.getElementById('btn-clear');
const btnCopy       = document.getElementById('btn-copy');
const btnDownload   = document.getElementById('btn-download');
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

/* ── Auth Check ──────────────────────────────────────────── */
(function checkAuth() {
  const role = sessionStorage.getItem('pm_role');
  if (role === 'admin' || role === 'user') showDashboard();
})();

/* ── Login tab switching ─────────────────────────────────── */
document.querySelectorAll('.login-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const t = tab.dataset.tab;
    document.querySelectorAll('.login-tab').forEach(x => x.classList.toggle('active', x === tab));
    document.getElementById('tab-user').classList.toggle('hidden', t !== 'user');
    document.getElementById('tab-admin').classList.toggle('hidden', t !== 'admin');
  });
});

/* ── User Login ──────────────────────────────────────────── */
document.getElementById('toggle-user-pw').onclick = () => {
  const i = document.getElementById('user-pw-input');
  i.type = i.type === 'password' ? 'text' : 'password';
};
document.getElementById('btn-user-login').onclick = userLogin;
document.getElementById('user-pw-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') userLogin(); });
document.getElementById('user-email-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') userLogin(); });

async function userLogin() {
  const email    = document.getElementById('user-email-input').value.trim();
  const password = document.getElementById('user-pw-input').value.trim();
  const errEl    = document.getElementById('user-login-error');
  errEl.classList.add('hidden');
  if (!email || !password) return;
  try {
    const res  = await fetch('/api/user-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem('pm_role', 'user');
      sessionStorage.setItem('pm_user_name', data.firstName);
      sessionStorage.setItem('pm_user_email', email.toLowerCase());
      showDashboard();
    } else {
      errEl.textContent = data.error || 'Invalid email or password.';
      errEl.classList.remove('hidden');
      document.getElementById('user-pw-input').value = '';
    }
  } catch {
    errEl.textContent = 'Connection error — is the server running?';
    errEl.classList.remove('hidden');
  }
}

/* ── Admin Login ─────────────────────────────────────────── */
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
    if (data.success) {
      sessionStorage.setItem('pm_role', 'admin');
      sessionStorage.setItem('pm_admin_pw', password);
      showDashboard();
    } else {
      loginError.classList.remove('hidden');
      pwInput.value = '';
      pwInput.focus();
    }
  } catch {
    loginError.textContent = 'Connection error — is the server running?';
    loginError.classList.remove('hidden');
  }
}

document.getElementById('btn-logout').onclick = () => {
  sessionStorage.removeItem('pm_role');
  sessionStorage.removeItem('pm_admin_pw');
  sessionStorage.removeItem('pm_user_name');
  sessionStorage.removeItem('pm_user_email');
  location.reload();
};

/* ── Show Dashboard ──────────────────────────────────────── */
async function showDashboard() {
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  await checkServerConfig();
  applyRoleUI();
  loadSettings();
  buildModuleGrid();
  buildNavHandlers();
  updateStats();
  loadUsageStatus();
  updateSavedCount();
}

/* ── Usage status (per-user daily counter) ───────────────── */
async function loadUsageStatus() {
  try {
    const email = getUserEmail();
    const res   = await fetch(`/api/usage?email=${encodeURIComponent(email)}`);
    const data  = await res.json();
    const todayEl = document.getElementById('stat-usage-today');
    const limitEl = document.getElementById('stat-usage-limit');
    const pill    = document.getElementById('usage-pill');
    if (todayEl) todayEl.textContent = data.today;
    if (limitEl) limitEl.textContent = data.limit;
    if (pill) pill.classList.toggle('limit-hit', data.today >= data.limit);
  } catch { /* non-fatal */ }
}

/* ── Role-based UI ───────────────────────────────────────── */
function applyRoleUI() {
  const admin     = isAdmin();
  const firstName = getUserName();

  document.querySelectorAll('.admin-only').forEach(el => {
    el.classList.toggle('hidden', !admin);
  });

  if (!admin && firstName) {
    const tag = document.getElementById('brand-tag');
    if (tag) tag.textContent = `Hi, ${firstName}! 👋`;
    const title = document.getElementById('overview-title');
    if (title) title.textContent = `Welcome, ${firstName}`;
  }
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
  if (userKeySection) userKeySection.classList.toggle('hidden', hasKey);
}

/* ── Settings ────────────────────────────────────────────── */
function loadSettings() { switchProvider(currentProvider); }

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
  if (el) el.onclick = () => { settingsModal.classList.remove('hidden'); if (isAdmin()) loadAdminLimits(); };
});

/* ── Admin Limits ────────────────────────────────────────── */
async function loadAdminLimits() {
  try {
    const res  = await fetch('/api/admin/usage', { headers: { 'x-admin-password': getAdminPw() } });
    if (!res.ok) return;
    const data = await res.json();
    const limitInput  = document.getElementById('daily-limit-input');
    const pauseBtn    = document.getElementById('btn-pause-toggle');
    const pauseLabel  = document.getElementById('pause-status-label');
    const summaryEl   = document.getElementById('usage-summary');
    if (limitInput && data.limits) limitInput.value = data.limits.dailyLimitPerUser;
    updatePauseUI(data.limits?.isPaused, pauseBtn, pauseLabel);
    if (summaryEl && data.stats.length > 0) {
      summaryEl.innerHTML = `<p class="usage-summary-title">Today's Usage — ${data.totalToday} total</p>` +
        data.stats.slice(0, 10).map(u => `<div class="usage-row"><span class="usage-email">${escapeHtml(u.email)}</span><span class="usage-count">${u.today} today · ${u.total} total</span></div>`).join('');
    } else if (summaryEl) {
      summaryEl.innerHTML = '<p style="color:#8899aa;font-size:13px">No usage recorded yet.</p>';
    }
  } catch { /* non-fatal */ }
}

function updatePauseUI(isPaused, btn, label) {
  if (!btn || !label) return;
  label.textContent = isPaused ? '⏸ Generations Paused' : '✅ Generations Active';
  btn.textContent   = isPaused ? 'Resume All' : 'Pause All';
  btn.classList.toggle('paused', isPaused);
}

document.getElementById('btn-save-limit').addEventListener('click', async () => {
  const val   = parseInt(document.getElementById('daily-limit-input').value) || 20;
  const msgEl = document.getElementById('limits-saved-msg');
  try {
    const res = await fetch('/api/admin/limits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': getAdminPw() },
      body: JSON.stringify({ dailyLimitPerUser: val })
    });
    if (res.ok) {
      msgEl.classList.remove('hidden');
      setTimeout(() => msgEl.classList.add('hidden'), 2000);
    }
  } catch { /* non-fatal */ }
});

document.getElementById('btn-pause-toggle').addEventListener('click', async () => {
  const pauseBtn   = document.getElementById('btn-pause-toggle');
  const pauseLabel = document.getElementById('pause-status-label');
  const isPaused   = pauseBtn.textContent.trim() === 'Pause All';
  try {
    const res = await fetch('/api/admin/limits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': getAdminPw() },
      body: JSON.stringify({ isPaused })
    });
    if (res.ok) updatePauseUI(isPaused, pauseBtn, pauseLabel);
  } catch { /* non-fatal */ }
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

/* ── Change Admin Password ───────────────────────────────── */
document.getElementById('btn-change-pw').onclick = changeAdminPassword;

async function changeAdminPassword() {
  const currentPw = document.getElementById('current-pw-input').value.trim();
  const newPw     = document.getElementById('new-pw-input').value.trim();
  const msgEl     = document.getElementById('change-pw-msg');
  msgEl.className = 'change-pw-msg hidden';

  if (!currentPw || !newPw) {
    msgEl.textContent = 'Both fields are required.';
    msgEl.className = 'change-pw-msg error';
    return;
  }
  try {
    const res  = await fetch('/api/admin/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }) });
    const data = await res.json();
    if (res.ok) {
      sessionStorage.setItem('pm_admin_pw', newPw);
      msgEl.textContent = '✓ Password updated!';
      msgEl.className = 'change-pw-msg success';
      document.getElementById('current-pw-input').value = '';
      document.getElementById('new-pw-input').value = '';
    } else {
      msgEl.textContent = data.error || 'Failed to update password.';
      msgEl.className = 'change-pw-msg error';
    }
  } catch {
    msgEl.textContent = 'Connection error.';
    msgEl.className = 'change-pw-msg error';
  }
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
      else if (view === 'module') openModule(btn.dataset.id);
      else if (view === 'saved') openSavedView();
      else if (view === 'users' && isAdmin()) openUsersView();
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
  if (viewSaved) viewSaved.classList.toggle('active', name === 'saved');
  if (viewUsers) viewUsers.classList.toggle('active', name === 'users');
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
const btnSave = document.getElementById('btn-save');
btnGenerate.onclick = generate;
btnClear.onclick    = clearOutput;
btnCopy.onclick     = copyOutput;
if (btnDownload) btnDownload.onclick = downloadOutput;
if (btnSave)     btnSave.onclick     = saveSession;

async function generate() {
  if (isGenerating) return;
  const apiKey = localStorage.getItem(`pm_key_${currentProvider}`) || localStorage.getItem('pm_api_key') || '';
  if (!serverKeys[currentProvider] && !apiKey) {
    if (isAdmin()) settingsModal.classList.remove('hidden');
    else { alert('The AI service is not available right now. Please contact the admin.'); }
    return;
  }
  const m = MODULES.find(x => x.id === activeModuleId);
  if (!m) return;
  const values = {}; let valid = true;
  m.inputs.forEach(inp => {
    const el = document.getElementById(`inp-${inp.id}`);
    values[inp.id] = el ? el.value.trim() : '';
    if (!values[inp.id] && inp.type !== 'select') valid = false;
  });
  if (!valid) { alert('Please fill in all fields before generating.'); return; }
  setGenerating(true); clearOutput(); showOutputArea(); fullOutput = '';
  const model = modelSelect.value || PROVIDER_MODELS[currentProvider][0].value;
  try {
    const resp = await fetch('/api/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt: m.system, userPrompt: m.prompt(values), apiKey, model, provider: currentProvider, userEmail: getUserEmail() })
    });
    if (!resp.ok) { const err = await resp.json().catch(() => ({ error: resp.statusText })); throw new Error(err.error || resp.statusText); }
    const reader = resp.body.getReader(); const decoder = new TextDecoder();
    while (true) { const { done, value } = await reader.read(); if (done) break; fullOutput += decoder.decode(value, { stream: true }); renderStreaming(fullOutput); }
    renderFinal(fullOutput); markDone(m.id);
    const todayEl = document.getElementById('stat-usage-today');
    if (todayEl && !isAdmin()) todayEl.textContent = parseInt(todayEl.textContent || '0') + 1;
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
  const raw = window.marked ? marked.parse(text) : escapeHtml(text).replace(/\n/g,'<br>');
  outputContent.innerHTML = window.DOMPurify ? DOMPurify.sanitize(raw) : raw;
  btnCopy.classList.remove('hidden');
  if (btnDownload) btnDownload.classList.remove('hidden');
  if (btnSave)     btnSave.classList.remove('hidden');
  btnClear.classList.remove('hidden');
}
function renderError(msg) {
  outputContent.classList.remove('hidden'); outputPlaceholder.classList.add('hidden');
  outputContent.style.whiteSpace = 'pre-wrap';
  outputContent.innerHTML = `<span style="color:#ef4444">⚠ Error: ${escapeHtml(msg)}\n\nCheck your API key in Settings.</span>`;
}
function showOutputArea() { outputContent.classList.remove('hidden'); outputPlaceholder.classList.add('hidden'); outputContent.innerHTML = ''; }
function clearOutput() { outputContent.classList.add('hidden'); outputContent.innerHTML = ''; outputPlaceholder.classList.remove('hidden'); btnCopy.classList.add('hidden'); if (btnDownload) btnDownload.classList.add('hidden'); if (btnSave) btnSave.classList.add('hidden'); btnClear.classList.add('hidden'); fullOutput = ''; }
function setGenerating(state) { isGenerating = state; btnGenerate.disabled = state; btnText.classList.toggle('hidden', state); btnSpinner.classList.toggle('hidden', !state); }
function copyOutput() {
  if (!fullOutput) return;
  navigator.clipboard.writeText(fullOutput).then(() => { btnCopy.textContent = 'Copied!'; btnCopy.classList.add('copied'); setTimeout(() => { btnCopy.textContent = 'Copy'; btnCopy.classList.remove('copied'); }, 2000); });
}
function downloadOutput() {
  if (!fullOutput) return;
  const m    = MODULES.find(x => x.id === activeModuleId);
  const name = (m ? m.name.toLowerCase().replace(/\s+/g, '-') : 'output');
  const blob = new Blob([fullOutput], { type: 'text/plain; charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `promptmaster-${name}.txt`; a.click();
  URL.revokeObjectURL(url);
}
function markDone(id) {
  completedIds.add(id); localStorage.setItem('pm_done', JSON.stringify([...completedIds]));
  document.querySelectorAll(`.nav-item[data-id="${id}"]`).forEach(b => b.classList.add('done'));
  updateStats(); buildModuleGrid();
}

/* ── Saved Sessions ──────────────────────────────────────── */
function getSessions() {
  try { return JSON.parse(localStorage.getItem('pm_sessions') || '[]'); } catch { return []; }
}
function saveSessions(s) {
  try { localStorage.setItem('pm_sessions', JSON.stringify(s)); } catch { /* storage full — silently skip */ }
}

function updateSavedCount() {
  const count  = getSessions().length;
  const badge  = document.getElementById('nav-saved-count');
  const statEl = document.getElementById('stat-saved-count');
  if (badge)  badge.textContent  = count > 0 ? count : '';
  if (statEl) statEl.textContent = count;
}

function saveSession() {
  if (!fullOutput) return;
  const m = MODULES.find(x => x.id === activeModuleId);
  const defaultName = m ? `${m.name} — ${new Date().toLocaleDateString()}` : 'Saved Output';
  const name = prompt('Name this session:', defaultName);
  if (name === null) return;
  const sessions = getSessions();
  sessions.unshift({
    id: Date.now().toString(),
    moduleId:   activeModuleId,
    moduleName: m ? m.name  : 'Output',
    moduleIcon: m ? m.icon  : '✨',
    moduleGrad: m ? m.gradient : 'linear-gradient(135deg,#4f9cf9,#1e6fd4)',
    name:    name.trim() || defaultName,
    content: fullOutput,
    savedAt: new Date().toISOString()
  });
  saveSessions(sessions.slice(0, 50));
  updateSavedCount();
  if (btnSave) { btnSave.textContent = '✓ Saved!'; setTimeout(() => { btnSave.textContent = '💾 Save'; }, 2000); }
}

function openSavedView() {
  switchView('saved');
  updateSavedCount();
  const sessions = getSessions();
  const listEl   = document.getElementById('saved-sessions-list');
  if (!listEl) return;

  if (sessions.length === 0) {
    listEl.innerHTML = `
      <div class="saved-empty">
        <div class="se-icon">💾</div>
        <h3>No saved sessions yet</h3>
        <p>Generate output in any module and click "💾 Save" to store it here.</p>
      </div>`;
    return;
  }

  listEl.innerHTML = sessions.map(s => `
    <div class="saved-card" data-id="${escapeHtml(s.id)}">
      <div class="sc-icon" style="background:${escapeHtml(s.moduleGrad || '#4f9cf9')}">${escapeHtml(s.moduleIcon || '✨')}</div>
      <div class="sc-body">
        <div class="sc-name">${escapeHtml(s.name)}</div>
        <div class="sc-meta">${escapeHtml(s.moduleName)} · ${new Date(s.savedAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</div>
        <div class="sc-preview">${escapeHtml(s.content.slice(0, 180))}…</div>
      </div>
      <div class="sc-actions">
        <button class="sc-view-btn" data-id="${escapeHtml(s.id)}">View</button>
        <button class="sc-del-btn" data-id="${escapeHtml(s.id)}" title="Delete">✕</button>
      </div>
    </div>`).join('');

  listEl.querySelectorAll('.sc-view-btn').forEach(btn => {
    btn.addEventListener('click', () => viewSavedSession(btn.dataset.id));
  });
  listEl.querySelectorAll('.sc-del-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteSavedSession(btn.dataset.id));
  });
}

function viewSavedSession(id) {
  const s = getSessions().find(x => x.id === id);
  if (!s) return;
  activeModuleId = s.moduleId;
  const m = MODULES.find(x => x.id === s.moduleId);
  if (m) {
    mIcon.style.background = m.gradient;
    mIcon.textContent = m.icon;
    mTitle.textContent = m.name;
    mDesc.textContent  = m.desc;
    btnGenerate.style.background = m.gradient;
    buildInputs(m);
  }
  fullOutput = s.content;
  switchView('module');
  showOutputArea();
  renderFinal(s.content);
}

function deleteSavedSession(id) {
  if (!confirm('Delete this saved session?')) return;
  saveSessions(getSessions().filter(x => x.id !== id));
  openSavedView();
}

/* ── Users View ──────────────────────────────────────────── */
async function openUsersView() {
  switchView('users');
  const wrap     = document.getElementById('users-table-wrap');
  const statEl   = document.getElementById('stat-total-users');
  const navBadge = document.getElementById('nav-user-count');
  wrap.innerHTML = '<div class="users-loading"><div class="loader-spin"></div> Loading users…</div>';

  try {
    const res  = await fetch('/api/users', { headers: { 'x-admin-password': getAdminPw() } });
    if (!res.ok) throw new Error('Unauthorized or server error');
    const data = await res.json();
    if (statEl)   statEl.textContent   = data.total;
    if (navBadge) navBadge.textContent = data.total;

    if (data.users.length === 0) {
      wrap.innerHTML = `
        <div class="users-empty">
          <div class="ue-icon">👥</div>
          <h3>No users yet</h3>
          <p>Share the landing page to start getting sign-ups!</p>
        </div>`;
      return;
    }

    const table = document.createElement('table');
    table.className = 'users-table';
    table.innerHTML = `
      <thead>
        <tr><th>#</th><th>First Name</th><th>Email</th><th>Joined</th><th></th></tr>
      </thead>
      <tbody>
        ${data.users.map((u, i) => `
          <tr id="user-row-${escapeHtml(u.id)}">
            <td class="row-num">${i + 1}</td>
            <td><strong>${escapeHtml(u.firstName)}</strong></td>
            <td class="email-cell">${escapeHtml(u.email)}</td>
            <td class="date-cell">${new Date(u.joinedAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</td>
            <td><button class="user-del-btn" data-id="${escapeHtml(u.id)}" data-name="${escapeHtml(u.firstName)}" title="Delete user">✕</button></td>
          </tr>`).join('')}
      </tbody>`;
    wrap.innerHTML = '';
    wrap.appendChild(table);
    wrap.querySelectorAll('.user-del-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteUser(btn.dataset.id, btn.dataset.name));
    });
  } catch (err) {
    wrap.innerHTML = `<div class="users-empty"><p style="color:#ef4444">Failed to load: ${escapeHtml(err.message)}</p></div>`;
  }
}

async function deleteUser(id, name) {
  if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE', headers: { 'x-admin-password': getAdminPw() }
    });
    if (res.ok) {
      const row = document.getElementById(`user-row-${id}`);
      if (row) row.remove();
      const countEl = document.getElementById('stat-total-users');
      const badge   = document.getElementById('nav-user-count');
      if (countEl) countEl.textContent = Math.max(0, parseInt(countEl.textContent || '0') - 1);
      if (badge)   badge.textContent   = Math.max(0, parseInt(badge.textContent   || '0') - 1);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Failed to delete user.');
    }
  } catch { alert('Connection error.'); }
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
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDrawer(); settingsModal.classList.add('hidden'); } });

/* ── Util ────────────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
