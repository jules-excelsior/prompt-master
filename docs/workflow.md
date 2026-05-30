# PromptMaster — System Workflow

## Overview

PromptMaster is a six-module AI social media agency tool that connects users to the Anthropic Claude API through a secure Express proxy. Each module collects structured inputs, constructs an optimized system + user prompt pair, streams the response in real time, and renders the output as formatted markdown.

---

## Architecture

```
Browser (Vanilla JS SPA)
        │
        │  HTTPS POST /api/generate
        │  { systemPrompt, userPrompt, apiKey, model }
        ▼
Express Server (Node.js)
        │
        │  Anthropic SDK — messages.stream()
        │  Chunked Transfer Encoding
        ▼
Anthropic Claude API
        │
        │  text/plain stream (SSE chunks)
        ▼
Browser — ReadableStream reader → live DOM render → marked.js final render
```

---

## Request Lifecycle

### Step 1 — User Input
- User selects a module from the sidebar
- Input form is dynamically rendered based on the module's `inputs` configuration
- Required fields are validated client-side before submission

### Step 2 — Prompt Construction
- Each module has a `system` string (role context) and a `prompt(values)` function
- The prompt function interpolates user inputs into a richly structured prompt
- Prompts include explicit section headers so Claude's output is immediately structured

### Step 3 — API Request
- Client sends `POST /api/generate` with `{ systemPrompt, userPrompt, apiKey, model }`
- API key is transmitted encrypted over HTTPS — never stored server-side
- Server instantiates a fresh `Anthropic` client using the per-request key

### Step 4 — Streaming
- Server calls `client.messages.stream()` from the Anthropic SDK
- `stream.on('text', chunk => res.write(chunk))` pipes each text delta directly to the HTTP response
- `Transfer-Encoding: chunked` and `Cache-Control: no-cache` headers enable real-time delivery
- Client reads via `response.body.getReader()` and appends each decoded chunk to the DOM

### Step 5 — Render
- During streaming: raw text is rendered with a blinking cursor (`pre-wrap`)
- After `stream.finalMessage()` resolves: `marked.parse()` converts markdown to styled HTML
- Copy button becomes active; completed module is marked with a ✓ in the sidebar

### Step 6 — Persistence
- Completed module IDs saved to `localStorage` (`pm_done`)
- API key saved to `localStorage` (`pm_api_key`)
- Model preference saved to `localStorage` (`pm_model`)
- Admin session stored in `sessionStorage` (`pm_admin`) — cleared on tab close

---

## Module Workflow

### Module 1 — Growth Strategy Commander
```
Inputs:  Niche → Platform → Growth Goal
Process: Constructs elite SMM strategic brief prompt
Output:  6-section growth strategy (positioning, pillars, schedule, tactics, KPIs, 30-day plan)
```

### Module 2 — Audience Psychology Decoder
```
Inputs:  Niche
Process: Deep audience psychology analysis prompt
Output:  8-section psychology breakdown (demographics, desires, frustrations, triggers, attention, content prefs, motivation, identity gap)
```

### Module 3 — Viral Content Idea Engine
```
Inputs:  Niche
Process: 30-idea generation prompt across 6 content frameworks
Output:  30 ideas in 6 categories, each with concept + rationale + hook line
```

### Module 4 — Hook Engineering Lab
```
Inputs:  Niche
Process: 20-hook generation prompt across 6 psychological trigger types
Output:  20 copy-ready hooks categorized by type with trigger tags
```

### Module 5 — Algorithm Intelligence Briefing
```
Inputs:  Platform → Niche
Process: Platform-specific algorithm intelligence prompt
Output:  8-section algorithm playbook (mechanics, signals, structure, timing, niche tactics, engagement loops, reach killers, reset plan)
```

### Module 6 — Content Repurposing Multiplier
```
Inputs:  Content idea (free text)
Process: Multi-format repurposing prompt
Output:  6 platform-native formats (short video, carousel, caption, thread, LinkedIn post, engagement post)
```

---

## Security Model

| Concern | Implementation |
|---------|---------------|
| API key storage | Browser `localStorage` only — no server DB |
| Key in transit | HTTPS encrypted in request body |
| Server-side key logging | None — key used only for per-request Anthropic client |
| Admin auth | Session-scoped (`sessionStorage`), server-verified password |
| XSS prevention | All user-controlled content HTML-escaped before DOM insertion |
| CORS | Not needed — same-origin proxy architecture |

---

## Admin Dashboard Workflow

1. Navigate to `/admin.html`
2. Enter admin password → `POST /api/verify-admin`
3. On success: `sessionStorage.pm_admin = 'true'` unlocks the dashboard
4. Tabs (Workflow / Docs / Changelog) each `GET /api/content/:type`
5. Server reads the corresponding `.md` file from `/docs/` and returns JSON
6. Client renders via `marked.parse()` into styled HTML
7. Logout clears `sessionStorage` and reloads the login gate
