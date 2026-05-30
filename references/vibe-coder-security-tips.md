# Vibe Coder Security & Developer Experience: The Complete Guide

> Fact-checked and expanded from real-world audits of 80+ AI-generated apps.
> Verified against OWASP, MDN, GDPR guidance, and framework documentation.

---

## The Original 5 Time Bombs — Verified & Expanded

### 1. The "Vanishing Database" Trap

**Claim:** SQLite on Vercel/Netlify resets and deletes data on sleep or redeployment.

**Verdict: ACCURATE — but the mechanism is more severe than described.**

Vercel and Netlify run serverless functions with **ephemeral filesystems**. SQLite stores your entire database in a single file on disk. On these platforms:

- The filesystem is wiped **on every cold start** (not just redeployment)
- On Vercel, each function invocation can run on a *different* container — meaning two simultaneous users can write to *different copies* of your database
- "Sleep" is not the trigger — **every request to a cold container** starts fresh

**What actually happens:**
```
User A writes data → container A has it
User B arrives → serverless spins new container B → empty database
User A's data is gone to User B (and possibly to User A next request)
```

**The Fix:** Use a managed database that lives outside your code.

```
Ask your AI: "Migrate my database from SQLite to Supabase (PostgreSQL) 
or Neon. Store the connection string in an environment variable called 
DATABASE_URL and never commit it to git."
```

**Recommended options:** Supabase (Postgres + auth + storage bundle), Neon (serverless Postgres), PlanetScale (MySQL, now paid), Turso (SQLite-compatible but remote — fine for low traffic).

---

### 2. The "Open Wallet" Mistake — API Key Exposure

**Claim:** AI tools paste API keys directly into code files, making them visible via browser DevTools.

**Verdict: ACCURATE — with a critical nuance most guides miss.**

Any value bundled into frontend JavaScript is readable by anyone — browser DevTools, `view-source:`, or network inspection tools. This applies to:

- React/Next.js/Vue/Svelte apps (anything compiled to client-side JS)
- Environment variables prefixed with `NEXT_PUBLIC_`, `VITE_`, or `REACT_APP_` — these are **intentionally exposed to the browser**; the prefix does NOT hide or encrypt them

**Common AI mistake pattern:**
```js
// AI-generated code — THIS IS DANGEROUS
const openai = new OpenAI({ apiKey: "sk-proj-abc123..." }); // hardcoded
// or
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY }); // still exposed!
```

**The Fix:**
```
Ask your AI: "Move all my API keys to a .env file. Make sure any key 
that calls a paid external API (OpenAI, Stripe, Resend) only lives in 
server-side code — API routes, server actions, or backend endpoints. 
Never use NEXT_PUBLIC_ prefix for secret keys."
```

Also do this immediately:
1. Add `.env` and `.env.local` to `.gitignore` before your first commit
2. Check your git history: `git log --all --full-history -- .env` — if you already committed a key, **rotate it now** (see Time Bomb #7 below)

---

### 3. The "Goldfish Memory" — Context Window Degradation

**Claim:** AI has a limited context window; it starts breaking old features when adding new ones.

**Verdict: REAL PROBLEM — but the cause is more nuanced than stated.**

The term "context rot" is informal, not a documented AI phenomenon. What actually happens is a combination of:

- **Context window overflow:** The AI literally cannot see your earlier code and re-implements it incorrectly
- **Attention dilution:** As context grows, older tokens receive less "attention weight" — documented in transformer architecture research
- **Prompt contamination:** Contradictory instructions in a long conversation cause inconsistent output

**Concrete symptoms:**
- AI re-adds code it previously deleted
- Auth checks disappear from refactored endpoints
- Variable names or API contracts silently change

**The Fixes:**
```
1. Keep a CLAUDE.md or .cursorrules file with your app's architecture, 
   key decisions, and patterns. Reference it at the start of each session.

2. Break large changes into small, focused prompts. One feature = one conversation.

3. After any major AI session, ask: "List all the files you modified and 
   summarize what changed in each one." Review the diff before committing.

4. Use git commits as checkpoints. Never let AI accumulate changes across 
   more than 2-3 features without a commit.
```

---

### 4. The "White Screen of Death" — Missing Error Handling

**Claim:** AI codes for the "happy path" and skips loading states and error boundaries.

**Verdict: ACCURATE — but "Error Boundary" is React-specific; the real issue is broader.**

**Error Boundaries** are a React class component API that catches errors during rendering. They do NOT catch:
- Errors in event handlers
- Errors in async code (`setTimeout`, `fetch`, promises)
- Server-side errors

Other frameworks have equivalents:
- **Vue:** `errorCaptured` lifecycle hook, `app.config.errorHandler`
- **Angular:** `ErrorHandler` class
- **Svelte:** `<svelte:window on:error>` or try/catch in `onMount`

The real root cause of white screens is **unhandled promise rejections** from async data fetching — the most common pattern in AI-generated apps.

**The Fix:**
```
Ask your AI: "Add proper loading states, error states, and empty states 
to every component that fetches data. For React, wrap page-level components 
in Error Boundaries. For all async calls, add try/catch with user-visible 
error messages — never let an error produce a blank screen."
```

**What good error handling looks like:**
```jsx
// Instead of: const data = await fetchUser(id)
try {
  setLoading(true);
  const data = await fetchUser(id);
  setUser(data);
} catch (err) {
  setError("Couldn't load your profile. Please try again.");
} finally {
  setLoading(false);
}
```

---

### 5. The Legal Landmine — Privacy & Compliance

**Claim:** Collecting emails without a Privacy Policy violates GDPR; Stripe can ban you.

**Verdict: MOSTLY ACCURATE — but a Privacy Policy alone does not equal GDPR compliance.**

**What GDPR actually requires** (for anyone processing EU residents' data, regardless of where your business is):

| Requirement | What it means |
|---|---|
| Lawful basis | Consent, contract, or legitimate interest — must be documented |
| Privacy Policy | Required, but not sufficient alone |
| Consent mechanism | Checkbox (not pre-ticked) before collecting data |
| Data deletion | Must honor "right to be forgotten" requests within 30 days |
| Data breach notification | Must notify authorities within 72 hours of a breach |
| Data Processing Agreements | Required if you use third-party processors (Stripe, Mailchimp, etc.) |

**On Stripe:** Stripe's ToS prohibits using their platform in ways that violate applicable law. They don't auto-ban for a missing Privacy Policy — but they can terminate accounts found to be violating GDPR, CCPA, or consumer protection laws. Payment processors also require Privacy Policies before approving merchant accounts.

**The Fix:**
```
Ask your AI: "Generate a Privacy Policy, Terms of Service, and Cookie 
Notice for a SaaS app. Host them at /privacy, /terms, and /cookies. 
Add a consent checkbox to my signup form that is unchecked by default."
```

For a more thorough solution, use iubenda, Termly, or Cookiebot for dynamically generated, jurisdiction-aware policies.

---

## 5 Additional Time Bombs NOT in the Original List

### 6. Secrets Buried in Git History

**Severity: Critical | Discovery: Immediate**

Deleting a `.env` file and committing the deletion does NOT remove the secret from git history. Anyone who clones your repo (including if it ever becomes public) can run:

```bash
git log --all --full-history -p -- .env
git grep "sk-" $(git rev-list --all)
```

GitHub's secret scanning will also flag keys in history and notify the provider (OpenAI, AWS, etc.) who may auto-revoke them.

**The Fix:**
```
1. Rotate the key immediately at the provider's dashboard
2. Run: git filter-repo --invert-paths --path .env (to scrub history)
3. Force-push the cleaned history to all remotes
4. Add .env* to .gitignore before your very first commit
```

Prevention prompt:
```
Ask your AI: "Create a .gitignore file for this project that excludes 
all .env files, private keys, and credential files before we write any code."
```

---

### 7. No Rate Limiting — The Abuse & Bill Shock Trap

**Severity: High | Discovery: When you get the bill**

AI-generated APIs have no rate limiting by default. Without it:

- A single script can make 10,000 API calls to your OpenAI-backed endpoint in minutes — your bill, not theirs
- Form submissions can be spammed without limit (fake signups, data pollution)
- Password reset endpoints can be abused to enumerate valid email addresses
- Your free-tier database gets hit until it locks or bills you overage

**The Fix:**
```
Ask your AI: "Add rate limiting to all my API endpoints using 
[Upstash Redis / express-rate-limit / next-rate-limit]. 
Limit to 10 requests per minute per IP for public endpoints 
and 3 requests per minute for auth endpoints."
```

---

### 8. Broken Authentication & Authorization

**Severity: Critical | Discovery: After a breach**

This is the #1 security issue in AI-generated apps. AI correctly implements authentication (who you are) but routinely skips authorization (what you're allowed to do).

**Common AI-generated vulnerability:**
```js
// AI generates this — looks fine, is broken
app.get('/api/documents/:id', authenticate, async (req, res) => {
  const doc = await db.documents.findById(req.params.id);
  // ❌ MISSING: check that doc.userId === req.user.id
  res.json(doc);
});
```

Any authenticated user can access any other user's document by changing the ID in the URL. This is called an **Insecure Direct Object Reference (IDOR)** — #1 on the OWASP API Security Top 10.

**The Fix:**
```
Ask your AI: "Audit every API endpoint that reads or modifies data. 
For each one, add a check that the authenticated user owns or has 
permission to access the requested resource. Show me every endpoint 
that fetches by ID without an ownership check."
```

---

### 9. SQL Injection via Unsanitized Inputs

**Severity: Critical | Discovery: After database is wiped**

If your AI built raw SQL queries with string concatenation, your database can be deleted or stolen with a single malicious input.

**Vulnerable pattern (AI generates this):**
```js
// ❌ SQL injection vulnerability
const users = await db.query(
  `SELECT * FROM users WHERE email = '${req.body.email}'`
);
// Input: ' OR '1'='1 — returns ALL users
// Input: '; DROP TABLE users; -- — deletes your database
```

**The Fix:**
```
Ask your AI: "Audit my database queries for SQL injection. Replace 
any string interpolation in SQL with parameterized queries or use 
an ORM like Prisma/Drizzle that handles sanitization automatically."
```

Safe parameterized version:
```js
// ✅ Safe
const users = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [req.body.email]
);
```

---

### 10. CORS Misconfiguration — Silent Data Theft

**Severity: High | Discovery: Never (until exploited)**

AI frequently sets `Access-Control-Allow-Origin: *` (allow all origins) on APIs. This means any website a user visits can silently make authenticated requests to your API using the user's session cookie or token.

**The Fix:**
```
Ask your AI: "Set my CORS policy to only allow requests from my 
own frontend domain(s). Do not use wildcard (*) on authenticated 
endpoints. Show me every place cors() or Access-Control-Allow-Origin 
is configured."
```

```js
// ❌ AI default
app.use(cors()); // allows everything

// ✅ Correct
app.use(cors({ 
  origin: ['https://yourdomain.com', 'http://localhost:3000'],
  credentials: true
}));
```

---

## Quick Audit Checklist

Run this against any vibe-coded app before launch:

```
[ ] Database is NOT SQLite on a serverless host
[ ] .env is in .gitignore and was never committed
[ ] No secret API keys in frontend/client-side code
[ ] No NEXT_PUBLIC_ / VITE_ / REACT_APP_ prefix on secret keys
[ ] Every data-fetching component has loading + error states
[ ] Privacy Policy and Terms of Service pages exist and are linked
[ ] Consent checkbox exists before collecting any personal data
[ ] Rate limiting is on all public API endpoints
[ ] Every endpoint that reads/writes by ID checks ownership
[ ] SQL queries use parameterized inputs (not string concatenation)
[ ] CORS is restricted to known domains (not *)
[ ] git history has no committed secrets (run: git log -p | grep "sk-\|AKIA\|password")
[ ] npm audit shows no critical vulnerabilities
```

---

## The Master Prompt to Audit Any Vibe-Coded App

Paste this at the start of a new AI session with your codebase loaded:

```
You are a senior security engineer auditing this codebase before production launch.
Check for and fix the following, one at a time:

1. Any API keys or secrets hardcoded in source files or exposed to the client
2. Missing ownership/authorization checks on data endpoints (IDOR vulnerabilities)
3. SQL queries using string concatenation instead of parameterized queries
4. CORS policy — is it using wildcard (*)?
5. Missing rate limiting on public endpoints
6. SQLite used as the production database
7. Missing error boundaries / loading states in data-fetching components
8. Absence of Privacy Policy, Terms of Service, or consent mechanism

For each issue found, explain the risk and provide the exact code fix.
```

---

*Sources: OWASP API Security Top 10, GDPR Article 6 & 13, MDN Web Docs (Error Boundaries, CORS), 
Vercel/Netlify ephemeral filesystem documentation, Next.js environment variable documentation.*
