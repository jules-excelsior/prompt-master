# PromptMaster — System Workflow

## Overview

PromptMaster is a six-module AI Social Media Agency platform that connects users to AI APIs (Anthropic Claude and DeepSeek) through a secure Express proxy. Each module collects structured inputs, constructs an optimized prompt pair, streams the response in real time, and renders output as formatted markdown.

The platform supports two user roles: **Users** (registered via the landing page) and **Admins** (password-protected management access). User data is persisted server-side in JSON files inside `/data/`.

---

## Architecture

```
Landing Page (index.html)
        │
        │  Sign Up Free — POST /api/register
        │  { firstName, email, password }
        ▼
data/users.json  ◄── persisted user records (hashed passwords)

Browser (SPA — admin.html)
        │
        │  User Login  — POST /api/user-login  { email, password }
        │  Admin Login — POST /api/verify-admin { password }
        ▼
sessionStorage  { role: 'admin' | 'user', pm_admin_pw, pm_user_name }
        │
        │  HTTPS POST /api/generate
        │  { systemPrompt, userPrompt, apiKey, model, provider }
        ▼
Express Server (Node.js)
        │
        ├── provider === 'anthropic'
        │       Anthropic SDK — messages.stream()
        │       Chunked Transfer Encoding
        │       └──▶ Anthropic Claude API
        │
        └── provider === 'deepseek'
                OpenAI SDK (baseURL: api.deepseek.com)
                chat.completions.create({ stream: true })
                └──▶ DeepSeek API
        │
        │  text/plain — Transfer-Encoding: chunked
        ▼
Browser — ReadableStream reader → live DOM render → marked.js final render
```

---

## Authentication Flow

### User Registration
1. User fills in the "Create Free Account" form on `index.html` (first name, email, password)
2. Client sends `POST /api/register`
3. Server validates fields, SHA-256 hashes the password with a salt, and appends the record to `data/users.json`
4. Success confirmation + link to dashboard is shown

### User Login
1. User opens `admin.html` — **User Login** tab is shown by default
2. Enters email + password → `POST /api/user-login`
3. Server looks up email in `users.json` and compares password hash
4. On success: `sessionStorage` stores `pm_role = 'user'` and `pm_user_name`
5. Dashboard loads with personalized greeting; admin-only elements hidden

### Admin Login
1. User clicks the **Admin** tab on the login screen
2. Enters admin password → `POST /api/verify-admin`
3. Password is compared against `data/settings.json` → `ADMIN_PASSWORD` env var (fallback)
4. On success: `sessionStorage` stores `pm_role = 'admin'` and `pm_admin_pw`
5. Full dashboard loads, including Users panel, Settings, and provider configuration

---

## Generation Request Lifecycle

### Step 1 — Provider & Model Selection
- User picks **Anthropic Claude** or **DeepSeek** in the Settings modal
- Provider preference: `localStorage` → `pm_provider`
- Per-provider keys stored separately: `pm_key_anthropic`, `pm_key_deepseek`
- Server-side keys (`.env`) take priority over user-supplied keys

### Step 2 — User Input
- Module is opened from the sidebar or dashboard grid
- Input form rendered dynamically from the module's `inputs` config
- Fields validated client-side before submission

### Step 3 — Prompt Construction
- Each module has a `system` string (role context) and a `prompt(values)` function
- Prompt function interpolates user inputs into a structured, section-headed prompt
- Prompts are model-agnostic — the same prompts run on both Anthropic and DeepSeek

### Step 4 — API Request
- Client sends `POST /api/generate` with `{ systemPrompt, userPrompt, apiKey, model, provider }`
- Server routes by `provider` to the appropriate SDK

### Step 5 — Streaming
- **Anthropic**: `client.messages.stream()` → `stream.on('text', chunk => res.write(chunk))`
- **DeepSeek**: `chat.completions.create({ stream: true })` → iterate `AsyncIterable` of deltas
- Both use `Transfer-Encoding: chunked` and `Cache-Control: no-cache`
- Client reads via `response.body.getReader()` and appends each decoded chunk live

### Step 6 — Render & Persist
- During streaming: raw text with blinking cursor (`pre-wrap`)
- After stream completes: `marked.parse()` converts markdown to styled HTML
- Copy button activates; module marked ✓ in sidebar; completion saved to `localStorage`

---

## Module Workflow

### Module 1 — Growth Strategy Commander
```
Inputs:  Niche → Platform → Growth Goal
Output:  6-section growth strategy
         (positioning, content pillars, schedule, tactics, KPIs, 30-day plan)
```

### Module 2 — Audience Psychology Decoder
```
Inputs:  Niche
Output:  8-section psychology breakdown
         (demographics, desires, frustrations, triggers, attention, formats, motivations, identity gap)
```

### Module 3 — Viral Content Idea Engine
```
Inputs:  Niche
Output:  30 content ideas across 6 viral frameworks
         (each with concept + rationale + hook line)
```

### Module 4 — Hook Engineering Lab
```
Inputs:  Niche
Output:  20 copy-ready hooks across 6 psychological trigger types
```

### Module 5 — Algorithm Intelligence Briefing
```
Inputs:  Platform → Niche
Output:  8-section algorithm playbook
         (mechanics, signals, structure, timing, niche tactics, loops, reach killers, reset plan)
```

### Module 6 — Content Repurposing Multiplier
```
Inputs:  Content idea (free text)
Output:  6 platform-native formats
         (TikTok/Reels script, carousel, caption, X thread, LinkedIn post, engagement post)
```

---

## Admin Dashboard Workflow

1. Log in via Admin tab → session stores role + password
2. **AI Modules** — same as regular users; full generation access
3. **Users Panel** (`GET /api/users` with `x-admin-password` header):
   - Lists all registered users with first name, email, and join date
   - Live count badge on the sidebar nav item
4. **Change Password** (Settings modal → bottom section):
   - Sends `POST /api/admin/change-password` with current + new password
   - Updates `data/settings.json` immediately; no server restart required
5. **Doc Drawer** (header buttons Workflow / Docs / Changelog):
   - `GET /api/content/:type` → server reads `/docs/*.md` → rendered via `marked.js`
6. **Logout** — clears `sessionStorage`, reloads login gate

---

## Security Model

| Concern | Implementation |
|---------|---------------|
| User passwords | SHA-256 hashed with static salt before storage — never stored in plaintext |
| Admin password | `data/settings.json` (runtime) or `ADMIN_PASSWORD` env var (initial) |
| API key (user-supplied) | Browser `localStorage` only — never sent to or stored on the server |
| API key (server-side) | `.env` file — never exposed to the client |
| Key in transit | HTTPS encrypted in request body |
| Session scope | `sessionStorage` — clears on tab close; logout wipes all session keys |
| XSS prevention | All user-controlled content HTML-escaped before DOM insertion |
| Admin API routes | `x-admin-password` header validated server-side on every request |
| CORS | Not needed — same-origin proxy architecture |

---

## Data Storage Map

| Location | Key / File | Contents |
|----------|-----------|----------|
| `data/users.json` | — | User records: id, firstName, email, passwordHash, joinedAt |
| `data/settings.json` | `adminPassword` | Runtime admin password override |
| `localStorage` | `pm_provider` | Selected AI provider |
| `localStorage` | `pm_key_anthropic` | Anthropic API key |
| `localStorage` | `pm_key_deepseek` | DeepSeek API key |
| `localStorage` | `pm_model_anthropic` | Selected Anthropic model |
| `localStorage` | `pm_model_deepseek` | Selected DeepSeek model |
| `localStorage` | `pm_done` | JSON array of completed module IDs |
| `sessionStorage` | `pm_role` | `admin` or `user` |
| `sessionStorage` | `pm_admin_pw` | Admin password (session only, admin logins only) |
| `sessionStorage` | `pm_user_name` | User's first name (user logins only) |
