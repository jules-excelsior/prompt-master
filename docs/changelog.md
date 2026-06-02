# Changelog

All notable changes to PromptMaster are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
- [ ] Export output as PDF or `.txt`
- [ ] Save and name output sessions
- [ ] Admin: delete or deactivate user accounts
- [ ] Rate limiting on `/api/generate`

### Future Modules
- [ ] Content Calendar Generator
- [ ] Hashtag & SEO Strategy Module
- [ ] Bio & Profile Optimizer
- [ ] Competitor Analysis Module
- [ ] Caption Rewriter (tone variations)
- [ ] DM / Outreach Script Generator

### Platform Enhancements
- [ ] User dashboard with saved history
- [ ] Team collaboration workspace
- [ ] Email notifications for new sign-ups (admin)
- [ ] Direct social platform integration (publish to Instagram, LinkedIn, etc.)
