# PromptMaster — Documentation

> Free AI Social Media Agency | v1.3.0 | Anthropic Claude + DeepSeek

---

## Getting Started

### Prerequisites
- Node.js 18+
- An Anthropic API key **or** a DeepSeek API key (or set one server-side in `.env` so users don't need their own)

### Installation
```bash
git clone <repo>
cd prompt-master
npm install
npm start
```

The server starts on **http://localhost:3000** (or `http://127.0.0.1:3000` on Windows).

### Configuration
Copy `.env.example` to `.env` and fill in your values:
```env
PORT=3000
ADMIN_PASSWORD=your_secure_password

# Optional — set so all users can generate without their own key
ANTHROPIC_API_KEY=sk-ant-api03-...
DEEPSEEK_API_KEY=sk-...
```

If `ANTHROPIC_API_KEY` or `DEEPSEEK_API_KEY` are set in `.env`, users do **not** need to enter their own key — the server key is used automatically.

---

## User Accounts

PromptMaster is a **free platform**. Anyone can sign up and access all 6 AI modules at no cost.

### Registering
1. Open the landing page (`http://localhost:3000`)
2. Scroll to **Create Your Free Account**
3. Enter your first name, email, and a password (min. 6 characters)
4. Click **Create Free Account** — your account is ready instantly
5. Click the link to go to the dashboard and sign in

### Signing In (Users)
1. Go to `http://localhost:3000/admin.html`
2. The **User Login** tab is shown by default
3. Enter your email and password
4. You'll see a personalized dashboard greeting and full access to all 6 AI modules

### Signing In (Admin)
1. Go to `http://localhost:3000/admin.html`
2. Click the **Admin** tab
3. Enter your admin password
4. You'll have full access including Settings, Users panel, and password management

---

## AI Providers

PromptMaster supports two AI providers. Switch between them in Settings at any time.

### Anthropic Claude
| Model | ID | Best For |
|-------|----|---------|
| Claude Opus 4.8 | `claude-opus-4-8` | Highest quality (recommended) |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | Balanced quality + speed |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | Fast, economical |

Get your key: [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

### DeepSeek
| Model | ID | Best For |
|-------|----|---------|
| DeepSeek Chat | `deepseek-chat` | General social media tasks |
| DeepSeek Reasoner | `deepseek-reasoner` | Complex strategic analysis |

Get your key: [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)

> **Note:** All 6 AI module prompts are engineered to produce structured, expert-level output regardless of which provider you use.

---

## The 6 AI Modules

---

### Module 1 — Growth Strategy Commander

**Purpose:** Builds a complete social media growth strategy tailored to your niche, platform, and specific goal.

**Inputs:**
| Field | Type | Example |
|-------|------|---------|
| Your Niche | Text | `fitness coaching`, `B2B SaaS`, `personal finance` |
| Platform | Dropdown | Instagram, TikTok, YouTube, LinkedIn, Twitter/X, Facebook, Pinterest, Threads |
| Growth Goal | Text | `reach 10K followers in 90 days` |

**Output Sections:**
1. Strategic Positioning
2. Core Content Pillars (5–7)
3. Posting Schedule & Cadence
4. Algorithm-Specific Engagement Tactics
5. KPIs & Success Metrics
6. 30-Day Action Plan (week by week)

**Best Used For:** Starting a new account, relaunching a stagnant presence, or scaling existing growth.

---

### Module 2 — Audience Psychology Decoder

**Purpose:** Produces a deep psychological profile of your target audience to inform every content decision.

**Inputs:**
| Field | Type | Example |
|-------|------|---------|
| Your Niche | Text | `online fitness coaching`, `crypto investing` |

**Output Sections:**
1. Core Demographics & Psychographics
2. Top 5 Desires & Aspirations
3. Top 5 Frustrations & Pain Points
4. Key Emotional Triggers
5. Attention Patterns & Scroll Behavior
6. Content Format Preferences
7. Psychological Motivations
8. Identity & Self-Perception Gap
9. Content Strategy Implications

**Best Used For:** Before building a content calendar, entering a new niche, or diagnosing low engagement.

---

### Module 3 — Viral Content Idea Engine

**Purpose:** Generates 30 high-potential content ideas across 6 proven viral frameworks.

**Inputs:**
| Field | Type | Example |
|-------|------|---------|
| Your Niche | Text | `productivity for entrepreneurs`, `vegan recipes` |

**Output:** 30 ideas across 6 categories:
- Curiosity & Mystery (5)
- Emotional Story & Transformation (5)
- Controversy & Hot Takes (5)
- Pain Point Solutions (5)
- Proof & Social Validation (5)
- Education & Value Bombs (5)

Each idea includes: concept, why it works, and a ready-to-use hook line.

**Best Used For:** Monthly content planning, breaking creative blocks, building a full content calendar.

---

### Module 4 — Hook Engineering Lab

**Purpose:** Generates 20 scroll-stopping opening hooks for your niche, categorized by psychological trigger type. All hooks are copy-ready.

**Inputs:**
| Field | Type | Example |
|-------|------|---------|
| Your Niche | Text | `real estate investing`, `mindset coaching`, `AI tools` |

**Output:** 20 hooks across 6 trigger types:
- Curiosity Gap (4)
- Identity & Relatability (4)
- Shocking Stat & Fact (3)
- Urgency & Stakes (3)
- Contrarian & Controversy (3)
- Transformation (3)

**Best Used For:** Writing video scripts, crafting captions, A/B testing opening lines.

---

### Module 5 — Algorithm Intelligence Briefing

**Purpose:** Delivers a platform-specific algorithm playbook explaining exactly what content behaviors drive organic reach.

**Inputs:**
| Field | Type | Example |
|-------|------|---------|
| Platform | Dropdown | Instagram, TikTok, YouTube, LinkedIn, Twitter/X... |
| Your Niche | Text | `fashion`, `tech reviews`, `business coaching` |

**Output Sections:**
1. How the Platform Algorithm Works
2. Key Engagement Signals (ranked)
3. Optimal Content Structure & Format
4. Posting Strategy (timing, frequency)
5. Niche-Specific Tactics
6. Engagement Loop Strategy
7. Reach Killers — What to Avoid
8. 30-Day Algorithm Reset Plan

**Best Used For:** Diagnosing declining reach, optimizing strategy, or understanding a new platform.

---

### Module 6 — Content Repurposing Multiplier

**Purpose:** Transforms a single content idea into 6 platform-native formats, dramatically increasing content output efficiency.

**Inputs:**
| Field | Type | Example |
|-------|------|---------|
| Your Content Idea | Textarea | A topic, script, caption, or core message |

**Output Formats:**
1. Short-Form Video Script (TikTok / Reels / Shorts)
2. Carousel Post (Instagram / LinkedIn)
3. Long-Form Caption (Instagram / Facebook)
4. Twitter/X Thread
5. LinkedIn Post
6. Engagement Bait Post

**Best Used For:** Scaling content output, repurposing evergreen content, maximizing ROI from every idea.

---

## Settings (Admin)

The Settings modal is available to admins. It includes:

### AI Provider & Model
| Setting | Description | Storage |
|---------|-------------|---------|
| Provider | Anthropic Claude or DeepSeek | `localStorage` → `pm_provider` |
| API Key (Anthropic) | Your Anthropic API key | `localStorage` → `pm_key_anthropic` |
| API Key (DeepSeek) | Your DeepSeek API key | `localStorage` → `pm_key_deepseek` |
| Model | Model for the selected provider | `localStorage` → `pm_model_<provider>` |

### Change Admin Password
1. Open Settings → scroll to "Change Admin Password"
2. Enter current password and new password (min. 6 characters)
3. Click **Update Password**
4. The new password takes effect immediately — no server restart needed

---

## Admin Users Panel

Admins can see every registered user under **Admin → 👥 Users** in the sidebar.

Columns shown:
- **#** — Row number
- **First Name** — Registered first name
- **Email** — Registered email address
- **Joined** — Registration date

The total user count appears as a badge on the sidebar nav item and in the stats bar.

---

## API Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|--------------|
| `GET`  | `/api/config` | Returns server key availability per provider | None |
| `POST` | `/api/register` | Register a new user | None |
| `POST` | `/api/user-login` | Authenticate a registered user | None |
| `POST` | `/api/verify-admin` | Verify admin password | None |
| `POST` | `/api/generate` | Stream AI response for a module | None (key in body) |
| `GET`  | `/api/users` | List registered users | `x-admin-password` header |
| `POST` | `/api/admin/change-password` | Change admin password | Body: currentPassword |
| `GET`  | `/api/content/:type` | Fetch workflow/documentation/changelog | None |

### POST /api/register
```json
{ "firstName": "string", "email": "string", "password": "string (min 6 chars)" }
```
Response: `{ "success": true, "firstName": "string" }` or `400/409`

### POST /api/user-login
```json
{ "email": "string", "password": "string" }
```
Response: `{ "success": true, "firstName": "string" }` or `401`

### POST /api/generate
```json
{
  "systemPrompt": "string",
  "userPrompt":   "string",
  "apiKey":       "string (optional if server key is set)",
  "model":        "claude-opus-4-8 | deepseek-chat | ...",
  "provider":     "anthropic | deepseek"
}
```
Response: Chunked `text/plain` stream

### GET /api/users
Headers: `x-admin-password: <admin-password>`
Response: `{ "total": number, "users": [{ id, firstName, email, joinedAt }] }`

### POST /api/admin/change-password
```json
{ "currentPassword": "string", "newPassword": "string (min 6 chars)" }
```
Response: `{ "success": true }` or `400/401`

---

## File Structure

```
prompt-master/
├── server.js             # Express server, all API routes
├── package.json
├── .env                  # Your config (not committed)
├── .env.example          # Config template
├── data/                 # Auto-created on first run
│   ├── users.json        # Registered user records
│   └── settings.json     # Admin password override
├── docs/
│   ├── workflow.md       # System architecture doc
│   ├── documentation.md  # This file
│   └── changelog.md      # Version history
└── public/
    ├── index.html        # Landing page (free signup)
    ├── landing.css
    ├── admin.html        # Dashboard (login + all views)
    ├── admin.css
    └── admin.js
```
