# CLAUDE.md — Project Security & Standards Template

> HOW TO USE: Copy this file to the root of any new project as `CLAUDE.md`.
> Claude Code reads this automatically at the start of every session.
> Edit the sections marked [CUSTOMIZE] to match your project.

---

## Project Overview

[CUSTOMIZE: Replace this with 2-3 sentences about what your app does,
its tech stack, and any key architectural decisions.]

**Stack:** [e.g., Next.js 14 + Supabase + Tailwind + Stripe]
**Deploy target:** [e.g., Vercel]
**Database:** [e.g., Supabase PostgreSQL — never SQLite]

---

## Mandatory Security Rules

These rules apply to EVERY change, without exception. Do not skip them.

### Secrets & Environment Variables
- NEVER hardcode API keys, tokens, or secrets in source files
- NEVER use `NEXT_PUBLIC_`, `VITE_`, or `REACT_APP_` prefix for secret keys
- ALL secrets go in `.env.local` (local) and Vercel/host environment variables (production)
- `.env` and `.env.local` must always be in `.gitignore`
- Before any new external service is added, ask: "Does this key need to be server-side only?"

### Authentication & Authorization
- Every API endpoint that reads or writes user data MUST verify:
  1. The user is authenticated
  2. The user owns or has permission to access the specific record
- Pattern to follow every time:
  ```js
  const { user } = await getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const record = await db.findById(id);
  if (record.userId !== user.id) return res.status(403).json({ error: 'Forbidden' });
  ```

### Input Validation
- ALL API endpoints must validate inputs with Zod before any business logic
- Frontend validation is NOT a substitute for server-side validation
- Template:
  ```js
  const schema = z.object({ ... });
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error });
  ```

### Database
- Use parameterized queries only — never string interpolation in SQL
- If using an ORM (Prisma/Drizzle), use its query builder methods, not raw SQL strings
- Database connection string in `DATABASE_URL` env variable only

### Frontend Security
- Never use `dangerouslySetInnerHTML` without `DOMPurify.sanitize()`
- Never store JWT tokens or session data in `localStorage` — use httpOnly cookies
- Never log or display raw error objects from the server to users

### Session Management
- NEVER use the default `express-session` MemoryStore in production — it leaks memory and crashes the server
- ALWAYS configure a persistent session store:
  ```js
  // For SQLite-based apps (VPS/single server)
  const SQLiteStore = require('connect-sqlite3')(session);
  app.use(session({
    store: new SQLiteStore({ db: 'sessions.db', dir: path.dirname(process.env.DB_PATH) || __dirname }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 86400000 }
  }));
  ```
- For multi-server / cloud deployments use Redis (`connect-redis`) instead
- NOTE: If `DB_PATH` env var contains a full file path (e.g. `/opt/data/data.db`), use `path.dirname(DB_PATH)` for the session store `dir` — not `DB_PATH` itself

### API & Server
- CORS must specify allowed origins explicitly — no wildcard `*` on authenticated routes
- Rate limiting required on: login, signup, password reset, and any AI/paid API endpoint
- Secure HTTP headers via `helmet` (Express) or `next.config.js` headers (Next.js)
- On VPS deployments: install `fail2ban` to auto-block bots scanning for `.env`, `.git`, and exploit paths

---

## Code Patterns to Always Follow

### Data Fetching Components
Every component that fetches data must have all three states:
```jsx
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
if (!data || data.length === 0) return <EmptyState />;
return <ActualContent data={data} />;
```

### Async Error Handling
```js
try {
  setLoading(true);
  const data = await fetchSomething();
  setData(data);
} catch (err) {
  // Log internally, show user-friendly message
  console.error('[fetchSomething]', err);
  setError('Something went wrong. Please try again.');
} finally {
  setLoading(false);
}
```

### Password Storage
```js
// Hash: bcrypt with cost factor 12
const hash = await bcrypt.hash(password, 12);
// Verify: constant-time comparison
const valid = await bcrypt.compare(input, hash);
```

---

## Architecture Notes

[CUSTOMIZE: Document your key decisions here so Claude doesn't reverse them.]

- Auth: [e.g., Supabase Auth — do not replace with custom JWT]
- Payments: [e.g., Stripe — all payment logic server-side only]
- File storage: [e.g., Supabase Storage — never store files in the repo]
- Email: [e.g., Resend — API key server-side only]

---

## Before Every Commit

Run this mental checklist:
- [ ] No new hardcoded secrets
- [ ] New endpoints have auth + ownership checks
- [ ] New inputs have Zod validation
- [ ] New components have loading/error/empty states
- [ ] No `console.log` statements with user data left in
- [ ] Session store is NOT the default MemoryStore
- [ ] `DB_PATH` env var is a file path — use `path.dirname(DB_PATH)` where a directory is needed

---

## Pre-Launch Security Audit Prompt

When the app is ready to launch, start a new session and paste this:

```
You are a senior security engineer auditing this codebase before production launch.
Check for and fix the following, one at a time:

1. Hardcoded secrets or keys exposed to the client
2. API endpoints missing ownership/authorization checks (IDOR)
3. SQL string concatenation (SQL injection)
4. CORS wildcard on authenticated endpoints
5. Missing rate limiting on auth and paid API endpoints
6. SQLite as production database
7. Components missing loading/error/empty states
8. Missing Privacy Policy, Terms of Service, or consent mechanism
9. User content rendered without DOMPurify sanitization (XSS)
10. Missing secure HTTP headers
11. Passwords hashed with MD5/SHA instead of bcrypt/argon2
12. Missing server-side input validation
13. No error tracking (Sentry) configured
14. express-session using default MemoryStore (causes memory leak + server restarts in production)
15. DB_PATH env var used directly as a directory path (it is a full file path — use path.dirname())

For each issue: one-sentence risk explanation + exact code fix.
```
