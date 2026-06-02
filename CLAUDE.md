# PromptMaster — Claude Code Guidelines

## Workflow preferences

- **Never stop mid-task without asking.** If something needs a fix, ask the user whether to proceed with the fix rather than stopping silently.
- **Run git commands directly in this container.** Never ask the user to run git commands themselves — do it here (commit, push, pull, branch, etc.).
- **Always commit and push after completing a task** unless the user asks otherwise.

## Project overview

PromptMaster is an AI Social Media Agency platform built with Node.js + Express.
Users access the dashboard at `/dashboard` (served as `admin.html`).
The landing page is `public/index.html`.

## Tech stack

- **Backend:** Node.js + Express (`server.js`)
- **AI SDKs:** `@anthropic-ai/sdk`, `openai` (for DeepSeek via custom baseURL)
- **Frontend:** Vanilla JS (`public/admin.js`), CSS (`public/admin.css`, `public/landing.css`)
- **Data:** JSON file persistence in `data/` (users, settings, usage, limits)
- **Auth:** SHA-256 password hashing with per-user random salt (backward compatible: old users fall back to static salt `pm_salt_2025`)

## Development branch

Always develop on `claude/ai-social-media-agency-uqBOq` and push to `jules-excelsior/prompt-master`.

## Key files

| File | Purpose |
|------|---------|
| `server.js` | Express backend, all API routes, streaming proxy |
| `public/admin.js` | Full SPA logic — modules, generate, sessions, admin |
| `public/admin.html` | Dashboard HTML shell |
| `public/index.html` | Landing page |
| `public/admin.css` | Dashboard styles (Inter font, dark theme) |
| `public/landing.css` | Landing page styles |
| `docs/changelog.md` | Version history |
| `data/users.json` | Registered users |
| `data/settings.json` | Admin password + settings |
| `data/usage.json` | Per-user daily generation counts |
| `data/limits.json` | Daily limit and pause state |

## Security notes

- Rate-limit all auth endpoints (register: 10/min, login: 10/min, verify-admin: 5/min, generate: 20/min).
- Always sanitize AI-generated HTML with DOMPurify before setting `innerHTML`.
- Admins bypass daily generation limits via `x-admin-password` header verification.
- Per-user usage is tracked by email; unauthenticated requests fall back to IP tracking.
