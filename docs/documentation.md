# PromptMaster — Documentation

> AI Social Media Agency | v1.0.0 | Built with Anthropic Claude API

---

## Getting Started

### Prerequisites
- Node.js 18+
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com/settings/keys))

### Installation
```bash
npm install
npm start
```

The server starts on **http://localhost:3000** by default.

### Configuration
Create a `.env` file (copy from `.env.example`):
```
PORT=3000
ADMIN_PASSWORD=your_secure_password
```

### First Use
1. Open `http://localhost:3000`
2. Click **⚙ Settings** in the sidebar
3. Paste your Anthropic API key
4. Choose a model (Opus 4.8 recommended for best results)
5. Click **Save Settings**
6. Select any module and start generating

---

## Modules

---

### Module 1 — Growth Strategy Commander

**Purpose:** Builds a complete, bespoke social media growth strategy tailored to your specific niche, platform, and goal.

**Inputs:**
| Field | Type | Description |
|-------|------|-------------|
| Your Niche | Text | The specific topic or market you operate in |
| Platform | Dropdown | Target social media platform |
| Growth Goal | Text | Specific, measurable goal (e.g., "10K followers in 90 days") |

**Output Sections:**
1. Strategic Positioning — how to stand out in your niche on this platform
2. Core Content Pillars — 5–7 recurring content categories
3. Posting Schedule & Cadence — optimal frequency and timing
4. Algorithm-Specific Engagement Tactics — platform-native growth behaviors
5. KPIs & Success Metrics — how to measure progress
6. 30-Day Action Plan — weekly milestones

**Best Used For:** Starting a new account, relaunching a stagnant account, or scaling an existing presence.

---

### Module 2 — Audience Psychology Decoder

**Purpose:** Produces a deep psychological profile of your target audience to inform every content decision.

**Inputs:**
| Field | Type | Description |
|-------|------|-------------|
| Your Niche | Text | The audience niche to analyze |

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

**Best Used For:** Before creating a content calendar, understanding a new niche, or diagnosing low engagement.

---

### Module 3 — Viral Content Idea Engine

**Purpose:** Generates 30 high-potential content ideas using proven viral content frameworks, organized by psychological category.

**Inputs:**
| Field | Type | Description |
|-------|------|-------------|
| Your Niche | Text | The niche to generate ideas for |

**Output:** 30 ideas across 6 categories:
- Curiosity & Mystery (5)
- Emotional Story & Transformation (5)
- Controversy & Hot Takes (5)
- Pain Point Solutions (5)
- Proof & Social Validation (5)
- Education & Value Bombs (5)

Each idea includes: concept, psychological rationale, and an opening hook line.

**Best Used For:** Building a content calendar, breaking creative blocks, quarterly content planning.

---

### Module 4 — Hook Engineering Lab

**Purpose:** Generates 20 scroll-stopping opening hooks for your niche, categorized by psychological trigger type.

**Inputs:**
| Field | Type | Description |
|-------|------|-------------|
| Your Niche | Text | The niche to write hooks for |

**Output:** 20 copy-ready hooks across 6 trigger types:
- Curiosity Gap (4)
- Identity & Relatability (4)
- Shocking Stat & Fact (3)
- Urgency & Stakes (3)
- Contrarian & Controversy (3)
- Transformation (3)

**Best Used For:** Writing video scripts, crafting captions, A/B testing opening lines, improving content retention.

---

### Module 5 — Algorithm Intelligence Briefing

**Purpose:** Delivers a platform-specific algorithm playbook explaining exactly what content behaviors drive organic reach.

**Inputs:**
| Field | Type | Description |
|-------|------|-------------|
| Platform | Dropdown | The platform to analyze |
| Your Niche | Text | Your content niche on that platform |

**Output Sections:**
1. How the Platform Algorithm Works
2. Key Engagement Signals (ranked)
3. Optimal Content Structure & Format
4. Posting Strategy (timing, frequency)
5. Niche-Specific Tactics
6. Engagement Loop Strategy
7. Reach Killers — What to Avoid
8. 30-Day Algorithm Reset Plan

**Best Used For:** Diagnosing declining reach, optimizing an existing strategy, or understanding a new platform.

---

### Module 6 — Content Repurposing Multiplier

**Purpose:** Transforms a single content idea into 6 platform-native formats, dramatically increasing content output efficiency.

**Inputs:**
| Field | Type | Description |
|-------|------|-------------|
| Your Content Idea | Textarea | The core idea, topic, script, or message to repurpose |

**Output Formats:**
1. Short-Form Video Script (TikTok / Reels / Shorts)
2. Carousel Post (Instagram / LinkedIn)
3. Long-Form Caption (Instagram / Facebook)
4. Twitter/X Thread
5. LinkedIn Post
6. Engagement Bait Post

**Best Used For:** Scaling content output, repurposing evergreen content, maximizing ROI from each idea.

---

## Settings

| Setting | Description | Storage |
|---------|-------------|---------|
| API Key | Your Anthropic API key | `localStorage` (browser only) |
| Model | Claude model to use for generation | `localStorage` |

### Available Models
| Model ID | Name | Best For |
|----------|------|----------|
| `claude-opus-4-8` | Claude Opus 4.8 | Highest quality output (recommended) |
| `claude-sonnet-4-6` | Claude Sonnet 4.6 | Balanced quality + speed |
| `claude-haiku-4-5-20251001` | Claude Haiku 4.5 | Fast, economical generation |

---

## Admin Dashboard

Access at `/admin.html`. Default password: `admin2025` (change via `ADMIN_PASSWORD` env var).

**Tabs:**
- **Workflow** — Full system architecture and request lifecycle documentation
- **Docs** — This module documentation file
- **Changelog** — Version history and release notes

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/generate` | Stream Claude response for a module |
| `POST` | `/api/verify-admin` | Verify admin password |
| `GET`  | `/api/content/:type` | Fetch workflow/documentation/changelog |

### POST /api/generate
**Body:**
```json
{
  "systemPrompt": "string",
  "userPrompt":   "string",
  "apiKey":       "sk-ant-...",
  "model":        "claude-opus-4-8"
}
```
**Response:** Chunked `text/plain` stream

### POST /api/verify-admin
**Body:** `{ "password": "string" }`
**Response:** `{ "success": true }` or `401`

### GET /api/content/:type
**Params:** `type` = `workflow` | `documentation` | `changelog`
**Response:** `{ "content": "markdown string" }`
