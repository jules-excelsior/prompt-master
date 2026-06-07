# Changelog

All notable changes to PromptMaster are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.6.1] — 2026-06-04

### Security Hardening & Bug Fixes

#### Security — Auth

- **Per-user random salt** — each new user registration generates a 16-byte hex salt stored alongside the password hash; eliminates rainbow-table attacks on shared-salt hashes
- Backward-compatible: existing accounts without a stored salt fall back to the legacy static salt (`pm_salt_2025`) at login
- **Rate limiting extended** — `/api/register` and `/api/user-login` now capped at 10 req/min per IP; `/api/verify-admin` capped at 5 req/min per IP

#### Security — AI Output

- **DOMPurify XSS sanitization** — all AI-generated markdown is sanitized with DOMPurify before being set as `innerHTML` in `renderFinal()`; prevents script injection via model output
- DOMPurify loaded via CDN in `admin.html` (before `admin.js`)

#### Security — Session Storage

- **localStorage 50-session cap** — `saveSession()` now enforces a hard cap of 50 saved sessions, trimming oldest entries first; prevents unbounded `localStorage` growth
- `saveSessions()` wrapped in `try/catch` to handle `QuotaExceededError` gracefully

#### Security — Admin Bypass

- **`x-admin-password` header verification** in `/api/generate` — admin requests bypass per-user daily limits after password is validated server-side; prevents forged bypass attempts

#### Security — Usage Tracking

- **IP fallback tracking** — unauthenticated generate requests now tracked by `req.ip` instead of silently bypassing usage checks; closes the anonymous-request exemption

#### Security — Response Integrity

- **`res.writableEnded` guards** in the generate endpoint — prevents double `res.end()` crashes when an error occurs after streaming has started

#### Bug — Routing

- **`/dashboard` route added** — `GET /dashboard` now serves `admin.html`; route was documented but missing from `server.js`

#### Bug — Daily Limit Reset

- **Philippine Standard Time (PST UTC+8) reset** — `today()` now returns the current date in PST (`Date.now() + 8 * 60 * 60 * 1000`) instead of UTC; daily limits reset at Philippine midnight

#### Bug — Logout

- **`pm_user_email` cleared on logout** — `sessionStorage.removeItem('pm_user_email')` added to the logout flow; prevents stale email from carrying over to a new session

#### Bug — Admin Settings

- **Null guard on `loadAdminLimits`** — `limitInput` existence checked before setting `.value`; prevents a crash when the settings modal element is absent

---

## [1.6.0] — 2026-06-02

### 🚀 4 New Modules + Save Sessions Library

#### Added — Module 9: Bio & Profile Optimizer
- Inputs: Niche/Profession, Platform, Target Audience, Profile Goal
- Output: 5 bio variations (each with psychological angle), keyword optimization, profile name/username strategy, link-in-bio strategy, highlights recommendations, profile photo tips, 10-point conversion checklist

#### Added — Module 10: Competitor Analysis Module
- Inputs: Niche, Platform, Competitor names/handles (2–4)
- Output: Competitive landscape overview, individual competitor breakdowns (positioning, content strategy, strengths, weaknesses), content gap analysis, differentiation strategy, steal-and-improve tactics, 30-day counter-positioning plan

#### Added — Module 11: Caption Rewriter
- Inputs: Original caption, Platform, Niche
- Output: 5 caption rewrites in distinct tones (Professional, Casual, Funny, Inspirational, Bold), each with emojis, CTA, and hook explanation; 15 targeted hashtags; best version recommendation

#### Added — Module 12: DM / Outreach Script Generator
- Inputs: Outreach Purpose (8 options), Niche, Who You're DMing, Your Value/Offer
- Output: Outreach strategy note, 3 script variants (cold, warm, bold), follow-up script, response handling scripts, personalization variables, 3-touch sequence timing

#### Added — Save Sessions Library
- "💾 Save" button appears in the output toolbar after every successful generation
- Clicking prompts for a session name (pre-filled with module name + date)
- Sessions stored in `localStorage` — no server required
- New **💾 Saved Sessions** view in sidebar (under LIBRARY section)
- Session cards show: module icon, session name, module name, date, content preview
- "View" button opens the saved content in the module view with full markdown rendering
- Delete button with confirmation removes individual sessions
- Session badge on the sidebar nav item shows count

#### Changed — Dashboard
- Module completion counter updated from 0/8 to 0/12

#### Changed — Landing Page
- Hero stat: "8 AI Modules" → "12 AI Modules"
- Hero subtitle updated to list all 12 module types
- Modules grid: 4 new module cards added (09–12)
- Signup perks: "6 AI-powered modules" → "12 AI-powered modules"
- Signup form subtitle updated to reference 12 modules

#### Changed — Roadmap (items completed)
- ✅ Bio & Profile Optimizer *(v1.6.0)*
- ✅ Competitor Analysis Module *(v1.6.0)*
- ✅ Caption Rewriter *(v1.6.0)*
- ✅ DM / Outreach Script Generator *(v1.6.0)*
- ✅ Save and name output sessions *(v1.6.0)*

---

## [1.5.0] — 2026-06-02

### 🛡️ API Abuse Controls & Per-User Daily Limits

#### Added — Daily Generation Limit Per User
- Each registered user is limited to a configurable number of AI generations per day (default: 20)
- Limit resets at midnight (server time)
- Usage tracked server-side in `data/usage.json` — keyed by email + date
- Admins are exempt from limits

#### Added — Admin: Pause / Resume All Generations
- One-click "Pause All" button in Settings → API Usage Controls
- Pausing blocks all AI generation immediately for every user
- Visual indicator: ⏸ Generations Paused / ✅ Generations Active
- State persisted in `data/limits.json`

#### Added — Admin: Configurable Daily Limit
- Numeric input in Settings → API Usage Controls to set the daily limit per user
- Range: 1–500 generations/day
- Takes effect immediately — no restart needed
- "Save" button with ✓ confirmation feedback

#### Added — Admin: Usage Dashboard in Settings
- Shows today's total generation count across all users
- Per-user breakdown: email, today's count, all-time total
- Top 10 users by today's usage listed in the modal

#### Added — Usage Pill on Dashboard
- Live counter in the overview stats bar: "X/Y today"
- Turns red when the daily limit is reached
- Refreshed on dashboard load and incremented after each successful generation

#### Added — `/api/usage` endpoint
- `GET /api/usage?email=...` returns `{ today, limit, remaining, isPaused }` per user
- Available to all authenticated sessions

#### Added — `/api/admin/usage` endpoint
- `GET /api/admin/usage` (requires `x-admin-password` header)
- Returns total today, per-user stats, and current limit settings

#### Added — `/api/admin/limits` endpoint
- `POST /api/admin/limits` (requires `x-admin-password` header)
- Updates `dailyLimitPerUser` and/or `isPaused` in `data/limits.json`

#### Changed — Generate endpoint
- `POST /api/generate` now accepts `userEmail` in request body
- Checks + records usage before proxying to AI provider
- Returns HTTP 429 with friendly message when limit hit or paused

#### Changed — Roadmap
- ✅ API abuse controls with per-user daily limits

---

## [1.4.0] — 2026-06-02

### ✨ New Modules, Export, Rate Limiting & Admin User Management

#### Added — Module 7: Content Calendar Generator
- Inputs: Niche, Platform, Posting Frequency (5 options), Content Pillars
- Output: 30-day content calendar organized across 4 themed weeks (Foundation → Momentum → Authority → Conversion)
- Each day includes: content pillar, format, hook/opening line, content angle, CTA
- Strategy overview summarizing the monthly arc

#### Added — Module 8: Hashtag & SEO Strategy
- Inputs: Niche, Platform, Content Type
- Output: 30–40 specific hashtags across 4 reach tiers (Mega / Large / Medium / Niche)
- Includes: branded hashtags, 4-week rotation schedule to avoid shadowbans, platform-specific SEO tips, caption and bio keywords, what to avoid

#### Added — Download Output (.txt)
- "↓ Download" button appears in the output toolbar alongside Copy after generation completes
- Downloads the raw markdown output as a `.txt` file named after the active module
- Works in all modern browsers via `Blob` + `URL.createObjectURL`

#### Added — Rate Limiting
- `/api/generate` limited to 20 requests per minute per IP address
- Returns HTTP 429 with a friendly error message when exceeded
- Implemented with a lightweight in-memory sliding window — no extra dependencies

#### Added — Admin: Delete Users
- Each row in the Users panel now has a ✕ delete button
- Clicking confirms before sending `DELETE /api/users/:id` with admin password header
- Row is removed from the table instantly; user counts update without a full reload

#### Changed — Platform Stats
- Hero stat updated from "6 AI Modules" to "8 AI Modules"
- Hero subtitle updated to mention content calendars and hashtag SEO
- Modules section subtitle: "8 modules engineered…"

#### Changed — Dashboard Stats
- "0/6 Completed" progress counter updated to "0/8 Completed"

#### Changed — Roadmap (items completed)
- ✅ Export output as `.txt`
- ✅ Rate limiting on `/api/generate`
- ✅ Admin: delete user accounts

---

## [1.3.0] — 2026-06-02

### 🔐 User Authentication & Admin Management

#### Added — User Registration
- New "Create Your Free Account" section on the landing page
- Registration form: first name, email, password (min. 6 characters)
- `POST /api/register` endpoint — validates, hashes password (SHA-256 + salt), saves to `data/users.json`
- Duplicate email detection with clear error message
- Success confirmation with direct link to dashboard

#### Added — User Login
- Login screen now has two tabs: **User Login** (default) and **Admin**
- `POST /api/user-login` endpoint — email + hashed password lookup
- Successful user login stores `pm_role = 'user'` and first name in `sessionStorage`
- User dashboard shows personalized greeting: "Hi, [First Name]! 👋"

#### Added — Admin: Users Panel
- New **👥 Users** section in the admin sidebar (Admin section)
- Live count badge on the nav item showing total registered users
- Full table: row number, first name, email, join date
- Empty state with encouragement to share the landing page
- Data fetched via `GET /api/users` with `x-admin-password` header

#### Added — Admin: Change Password
- New "Change Admin Password" section at the bottom of the Settings modal
- `POST /api/admin/change-password` endpoint — validates current password, writes new password to `data/settings.json`
- Takes effect immediately — no server restart needed
- Success and error messages shown inline

#### Added — Role-Based UI
- Admin-only elements (Settings, Users panel, provider config, change password) hidden for regular users
- Non-admin users see personalized brand tag instead of "AI Social Media Agency"
- Generate button shows an error for users if no server key is configured (directs to admin)

#### Added — Data Persistence
- `data/` directory auto-created on server startup
- `data/users.json` — stores all registered user records
- `data/settings.json` — stores runtime admin password override

#### Changed — Login Screen
- Default password hint (`admin2025`) removed completely from the login page
- Clean two-tab layout: User Login / Admin
- "Sign up free ↗" link in the user login hints

#### Changed — Landing Page
- Platform now positioned as **free** — "100% Free · No Credit Card Required"
- Hero eyebrow: "100% Free — No Credit Card Required"
- Hero stats updated: "Free Forever", "Multi AI Providers", "Secure & Stable"
- "How It Works" steps updated: Step 1 is now "Create Free Account"
- CTAs changed from "Access Dashboard" to "Get Free Access"
- Nav: "Sign Up Free" link added alongside "Sign In"
- Footer: "Free Forever" badge added

---

## [1.2.0] — 2026-06-02

### 🤖 Dual AI Provider Support (Anthropic + DeepSeek)

#### Added — DeepSeek Provider
- Full DeepSeek API support via the `openai` SDK package with custom `baseURL`
- DeepSeek models: `deepseek-chat` (general) and `deepseek-reasoner` (advanced reasoning)
- Streaming support for DeepSeek via `chat.completions.create({ stream: true })`

#### Added — Provider Selector in Settings
- New **⚡ Anthropic Claude / 🌊 DeepSeek** toggle in the Settings modal
- Switching provider dynamically updates: API key label, placeholder, "get key" link, model dropdown
- Per-provider API key storage: `pm_key_anthropic`, `pm_key_deepseek` in `localStorage`
- Per-provider model storage: `pm_model_anthropic`, `pm_model_deepseek` in `localStorage`

#### Added — Server-Side Dual Key Support
- `DEEPSEEK_API_KEY` added to `.env` and `.env.example`
- `/api/config` response updated: `{ anthropic: { hasServerKey }, deepseek: { hasServerKey } }`
- Settings modal shows "configured by admin" notice per-provider based on which is active
- Generate requests now include a `provider` field routed server-side

#### Changed — Model Pill
- Header model pill now shows provider-aware names: "DS Chat", "DS Reasoner", "Opus 4.8", etc.

#### Changed — .env.example
- Documents both `ANTHROPIC_API_KEY` and `DEEPSEEK_API_KEY`

---

## [1.1.0] — 2026-05-31

### 🎨 UI Overhaul, Landing Page & Server-Side API Key

#### Added — Public Landing Page (`index.html`)
- Animated hero with floating orbs
- 6 module showcase cards with gradient icons
- "Expert Output in 3 Simple Steps" section
- "A Secure & Stable Platform" section
- CTA section with gradient background
- Footer with branding and links

#### Added — Server-Side API Key
- `ANTHROPIC_API_KEY` in `.env` configures a server-side key for all users
- `/api/config` endpoint returns `{ hasServerKey: true/false }` per provider
- Settings modal shows green "API key configured by admin" notice when active
- Users can generate without entering their own API key

#### Added — Doc Drawer
- Slide-in right drawer for Workflow / Docs / Changelog
- Triggered from header buttons (⚙ Workflow | 📖 Docs | 📋 Changelog)
- Content loaded from `/api/content/:type` and rendered with `marked.js`
- Overlay backdrop with click-to-close and Escape key support

#### Changed — Dashboard Layout
- Premium dark navy design with glassmorphism cards
- Sidebar with icon + label nav items and completion checkmarks (✓)
- Animated gradient top-accent on module cards
- API status dot (green when key active, red otherwise)
- Model pill showing current model family in the stats bar
- Responsive grid: 3-column → 2-column → 1-column module cards

#### Changed — Module View
- Input column + output column split-panel workspace
- Animated blinking cursor during streaming
- Smooth transition to `marked.js` rendered markdown on completion
- Copy button (with "Copied!" confirmation) and Clear button

#### Fixed — Module Navigation
- Module cards and sidebar buttons now correctly switch to the module view
- Removed `hidden` class conflict that blocked view switching via CSS `!important`

---

## [1.0.0] — 2026-05-30

### 🚀 Initial Release

#### Added — Core Application
- Single-page Express + Vanilla JS application
- 6 AI social media modules with streaming output
- Admin password-protected dashboard
- Real-time token streaming via Anthropic SDK `messages.stream()`
- `marked.js` markdown rendering
- Module completion tracking in `localStorage`
- `.env` configuration via `dotenv`

#### Added — All 6 Modules
- **Growth Strategy Commander** — niche + platform + goal → full growth strategy
- **Audience Psychology Decoder** — niche → 8-section psychology profile
- **Viral Content Idea Engine** — niche → 30 ideas across 6 frameworks
- **Hook Engineering Lab** — niche → 20 copy-ready hooks in 6 trigger types
- **Algorithm Intelligence Briefing** — platform + niche → 8-section algorithm playbook
- **Content Repurposing Multiplier** — content idea → 6 platform-native formats

#### Added — Backend
- `POST /api/generate` — streaming Anthropic proxy
- `POST /api/verify-admin` — admin password verification
- `GET /api/content/:type` — markdown doc file serving
- `GET /api/config` — server configuration

---

## Roadmap

### Upcoming
- [x] Export output as `.txt` *(v1.4.0)*
- [x] Rate limiting on `/api/generate` *(v1.4.0)*
- [x] Admin: delete user accounts *(v1.4.0)*
- [ ] Export output as PDF
- [ ] Save and name output sessions

### Future Modules
- [x] Content Calendar Generator *(v1.4.0)*
- [x] Hashtag & SEO Strategy *(v1.4.0)*
- [x] Bio & Profile Optimizer *(v1.6.0)*
- [x] Competitor Analysis Module *(v1.6.0)*
- [x] Caption Rewriter (tone variations) *(v1.6.0)*
- [x] DM / Outreach Script Generator *(v1.6.0)*

### Platform Enhancements
- [x] API abuse controls with per-user daily limits *(v1.5.0)*
- [x] Save and name output sessions *(v1.6.0)*
- [ ] User dashboard with saved history
- [ ] Team collaboration workspace
- [ ] Email notifications for new sign-ups (admin)
- [ ] Direct social platform integration (publish to Instagram, LinkedIn, etc.)
