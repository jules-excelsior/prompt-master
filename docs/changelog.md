# Changelog

All notable changes to PromptMaster are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2026-05-30

### 🚀 Initial Release

**PromptMaster** launched as a full-stack AI Social Media Agency tool powered by the Anthropic Claude API.

#### Added — Core App
- Single-page application with dark premium navy/blue/gold design system
- Sidebar navigation with 6 module buttons and completion checkmarks
- Welcome screen with module overview cards
- Settings modal with API key management and model selector
- Security notice explaining client-side key storage and HTTPS transmission
- Module completion tracking persisted in `localStorage`

#### Added — Module 1: Growth Strategy Commander
- Inputs: Niche, Platform (8 options), Growth Goal
- Output: 6-section growth strategy (positioning, content pillars, schedule, tactics, KPIs, 30-day plan)
- System prompt engineered for elite SMM strategic output

#### Added — Module 2: Audience Psychology Decoder
- Input: Niche
- Output: 8-section psychology breakdown with demographics, desires, frustrations, triggers, attention patterns, content preferences, motivations, and identity gap analysis

#### Added — Module 3: Viral Content Idea Engine
- Input: Niche
- Output: 30 content ideas across 6 frameworks (curiosity, emotion, controversy, pain point, proof, education)
- Each idea includes concept, psychological rationale, and ready-to-use hook line

#### Added — Module 4: Hook Engineering Lab
- Input: Niche
- Output: 20 scroll-stopping hooks across 6 psychological trigger types
- All hooks copy-ready with trigger type tags

#### Added — Module 5: Algorithm Intelligence Briefing
- Inputs: Platform (8 options), Niche
- Output: 8-section platform-specific algorithm playbook including engagement signals, content structure, reach killers, and 30-day reset plan

#### Added — Module 6: Content Repurposing Multiplier
- Input: Free-text content idea
- Output: 6 platform-native formats (TikTok/Reels script, carousel, caption, Twitter thread, LinkedIn post, engagement post)

#### Added — Streaming Infrastructure
- Real-time token streaming via Anthropic SDK `messages.stream()`
- `Transfer-Encoding: chunked` HTTP streaming from Express
- Client-side `ReadableStream` reader with live DOM updates
- Blinking cursor animation during generation
- Smooth transition from streaming text to `marked.js` rendered markdown on completion

#### Added — Admin Dashboard (`/admin.html`)
- Password-protected login gate (`sessionStorage`-scoped session)
- Stats bar (modules count, model family, streaming type, version, release date)
- Three content tabs: **Workflow**, **Docs**, **Changelog**
- All tab content served from `/docs/*.md` files via `/api/content/:type`
- Full markdown rendering via `marked.js`
- Logout clears session and returns to login gate

#### Added — Security
- API key stored exclusively in browser `localStorage` — zero server-side storage
- Per-request Anthropic client instantiation using user-supplied key
- Admin password configurable via `ADMIN_PASSWORD` environment variable
- HTML escape applied to all user-controlled content before DOM insertion

#### Added — Backend (Node.js + Express)
- `POST /api/generate` — streaming proxy endpoint
- `POST /api/verify-admin` — admin password verification
- `GET /api/content/:type` — markdown file serving for admin docs
- Static file serving from `/public`
- `.env` support via `dotenv`

#### Added — Developer Experience
- `npm start` — production server
- `npm run dev` — nodemon hot-reload
- `.env.example` for environment setup
- Three markdown documentation files: `workflow.md`, `documentation.md`, `changelog.md`

---

## Roadmap

### [1.1.0] — Planned
- [ ] Export output as PDF or `.txt` file
- [ ] Save/load named sessions
- [ ] Dark/light theme toggle
- [ ] Rate limiting on `/api/generate`

### [1.2.0] — Planned
- [ ] Content calendar generator module
- [ ] Hashtag strategy module
- [ ] Bio & profile optimization module
- [ ] Competitor analysis module

### [2.0.0] — Future
- [ ] User account system with saved history
- [ ] Team collaboration mode
- [ ] Scheduled content generation
- [ ] Direct platform integration (publish to Instagram, LinkedIn, etc.)
