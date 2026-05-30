# Global CLAUDE.md — Vibe Coder Security Standards

> HOW TO USE: Save this as `~/.claude/CLAUDE.md` on your machine.
> This file applies automatically to EVERY project you open in Claude Code,
> with no setup required per project.
>
> For project-specific rules, also keep a CLAUDE.md in the project root —
> project-level CLAUDE.md is merged with this global one.

---

## Who I Am

I build full-stack web apps using AI tools (Claude Code, Cursor, Bolt, etc.).
I ship fast, so I need you to enforce security and quality standards automatically —
I should not have to ask for these every session.

---

## Non-Negotiable Rules (Apply to Every Project)

### 1. Secrets — Always Server-Side
- NEVER put API keys, tokens, or secrets in frontend code
- NEVER suggest `NEXT_PUBLIC_`, `VITE_`, or `REACT_APP_` for anything secret
- ALWAYS put secrets in `.env` / `.env.local` and remind me to add them to my host's environment variable settings
- If I paste a key into chat, warn me to rotate it and use an env var instead

### 2. Database — No SQLite on Serverless
- If the project is deploying to Vercel, Netlify, Railway, Fly.io, or any serverless host:
  reject SQLite as the database
- Always recommend: Supabase, Neon, or PlanetScale (Postgres/MySQL)
- Always store connection strings in `DATABASE_URL` env variable

### 3. Authorization — Ownership Checks Are Mandatory
- Every endpoint that fetches or mutates a record by ID must verify the requesting user owns it
- Remind me if I add an endpoint without this check
- Pattern to enforce:
  ```js
  if (record.userId !== authenticatedUser.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  ```

### 4. Input Validation — Server-Side Always
- Every API endpoint must validate its inputs with Zod or equivalent
- Frontend validation alone is not acceptable
- Add validation before any database operation or business logic

### 5. SQL — Parameterized Queries Only
- Never generate SQL with string interpolation or template literals containing user input
- Always use parameterized queries or ORM query builder methods

### 6. Passwords — bcrypt or argon2 Only
- Never suggest MD5, SHA1, SHA256, or SHA512 for password storage
- Always use bcrypt (cost 12) or argon2id

### 7. Error Handling — Never a White Screen
- Every component that fetches data must have: loading state, error state, empty state
- Every async operation must have try/catch with user-visible error messages
- Never let an uncaught promise rejection reach the user as a blank screen

### 8. CORS — Explicit Origins Only
- Never generate `cors()` with no config or `origin: '*'` on authenticated routes
- Always specify the explicit domain(s)

### 9. Rate Limiting — Required on Key Endpoints
- Auth endpoints (login, signup, password reset, magic link): max 3-5 req/min/IP
- Any endpoint calling a paid external API (OpenAI, etc.): rate limited
- Remind me if I add these endpoints without rate limiting

### 10. Secure Headers
- For Express: suggest `helmet` middleware
- For Next.js: suggest headers in `next.config.js`
- Don't skip this step at project setup

---

## Reminders at Project Start

When I start a new project or say "I'm starting a new app", do the following automatically:

1. Create `.gitignore` with `.env`, `.env.local`, `*.pem`, `*.key` excluded
2. Create `.env.example` with placeholder values (no real secrets)
3. Set up the database with an external provider (not SQLite)
4. Ask: "What external APIs will this use?" — so we can plan server-side key handling upfront
5. Set up CORS, helmet/security headers, and rate limiting stubs

---

## Reminders Before Deployment

When I say "deploy", "launch", "go live", or "push to production", pause and ask me:

```
Before deploying, have you:
1. Moved all secrets to your host's environment variables?
2. Checked that no .env file is committed? (git log -p | grep "sk-\|AKIA")
3. Enabled database backups?
4. Added a Privacy Policy if you collect any user data?
5. Run: npm audit --audit-level=high?
```

---

## Code Style Defaults

- TypeScript preferred over JavaScript for all new projects
- Zod for all schema validation
- Prisma or Drizzle for database ORM (not raw SQL)
- bcrypt for password hashing
- Sentry for error tracking (add at project start, not as an afterthought)

---

## What NOT to Do

- Do not add features beyond what I asked for
- Do not refactor working code unless I ask
- Do not add comments explaining what code does — only add comments for non-obvious WHY
- Do not create README or documentation files unless I ask
- Do not commit or push without me explicitly asking

---

*This global config enforces the security patterns from the Vibe Coder Security Guide
stored at references/vibe-coder-security-tips.md in the prompt-master skill repo.*
