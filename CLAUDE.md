# CLAUDE.md — Prompt Master

## What This Repository Is

Prompt Master is a **Claude skill** — a pure documentation project with no executable code, build system, or tests. When installed, it activates inside Claude (claude.ai or Claude Code) and operates as a prompt engineer: taking a user's rough idea, identifying their target AI tool, and generating a single production-ready prompt optimized for that tool.

The entire system lives in four Markdown files. There is nothing to compile, no dependencies to install, and no CI pipeline to run.

---

## Repository Structure

```
prompt-master/
├── SKILL.md                  # Operational skill definition — the "code" that runs
├── README.md                 # User-facing docs, examples, tool table, version history
├── references/
│   ├── templates.md          # 12 prompt templates — lazy-loaded, only when needed
│   └── patterns.md           # 37 failure patterns reference — lazy-loaded, only when needed
└── LICENSE                   # MIT
```

### File Roles

**SKILL.md** — The operative file. Structured in three attention zones:
- **Primacy Zone (first 30%)** — identity, hard rules, output format lock
- **Middle Zone (55%)** — intent extraction logic, tool routing for 30+ AI tools, diagnostic checklist, memory block system, safe techniques
- **Recency Zone (15%)** — verification checklist and success criteria

**README.md** — User installation guide, usage examples, full tool table, template table, pattern table, and version history. This is what users read on GitHub.

**references/templates.md** — Full template definitions for all 12 prompt architectures (RTF, CO-STAR, RISEN, CRISPE, Chain of Thought, Few-Shot, File-Scope, ReAct, Visual Descriptor, Reference Image Editing, ComfyUI, Prompt Decompiler, and Template M for Opus 4.7 agentic tasks).

**references/patterns.md** — Complete reference for all 37 prompt failure patterns organized in 6 categories: task, context, format, scope, reasoning, and agentic. Each pattern includes a before/after example.

---

## Development Workflow

### Making Changes

There is no build step. Edit the Markdown files directly, commit, and push. The branch for active development is `claude/claude-md-docs-Ayms7`.

```bash
git checkout claude/claude-md-docs-Ayms7
# edit files
git add <specific files>
git commit -m "descriptive message"
git push -u origin claude/claude-md-docs-Ayms7
```

### What to Edit and Where

| Task | File to Edit |
|------|-------------|
| Adding a new AI tool profile | `SKILL.md` — Tool Routing section |
| Updating an existing tool profile | `SKILL.md` — find the tool's block in Tool Routing |
| Adding a new prompt template | `references/templates.md`, then add entry to the template table in `README.md` and reference it in `SKILL.md` |
| Adding a new failure pattern | `references/patterns.md`, update the count in `README.md` header, add the before/after row to the relevant table in `README.md` |
| Changing the output format | `SKILL.md` — Output format section in Primacy Zone |
| Adding a hard rule | `SKILL.md` — Hard rules block in Primacy Zone |
| Updating installation instructions | `README.md` only |
| Updating the version number | `SKILL.md` frontmatter (`version:` field) AND `README.md` version history section |

---

## Conventions

### SKILL.md Structure — Do Not Reorder Zones

The three-zone structure (Primacy / Middle / Recency) maps to how transformer attention works. Critical constraints live in Primacy because models weight the first 30% of a prompt most heavily. Do not move hard rules or identity statements into the middle or recency sections.

### Section File Size

Keep individual files under 450 lines. If a section grows past this, move detailed content to a `references/` file and add a lazy-load pointer in SKILL.md (see the Reference Files table at the bottom of SKILL.md for the pattern).

### Tool Routing Format

Each tool block in SKILL.md follows this pattern:
1. Bold tool name with context in parentheses
2. 3–6 bullet points — one constraint or technique per bullet
3. One blank line separator before the next `---` divider

Do not merge multiple tools into one block unless they share identical routing logic (see Cursor / Windsurf as the only exception).

### Pattern Numbering

Patterns are numbered sequentially across all categories. When adding a new pattern, assign the next available number, add it to `references/patterns.md` in the correct category section, and add it to the matching table in `README.md`. Update the pattern count in the README header (currently "37 credit-killing patterns").

### Template Naming

Templates use the letter scheme (A through M currently). New templates get the next letter. Add the template letter and name to:
1. `references/templates.md` — full definition
2. `SKILL.md` — Tool Routing section for any tools that use it
3. `README.md` — template table in the 12 Prompt Templates section

### Version Numbering

Follows semver-style logic:
- Patch bump: typo fixes, wording improvements, adding a single tool profile
- Minor bump: new template, new pattern category, significant tool routing changes
- Major bump: structural overhaul (new zone system, new routing architecture)

Always update both `SKILL.md` frontmatter and the `README.md` version history table.

---

## Hard Rules for Editing SKILL.md

These mirror the skill's own hard rules and must not be violated in edits:

1. **Never add fabrication-prone techniques** as recommended approaches: Mixture of Experts, Tree of Thought, Graph of Thought, Universal Self-Consistency, prompt chaining as a meta-technique. These are explicitly banned in the Hard Rules section.
2. **Never recommend Chain of Thought for reasoning-native models** — o3, o4-mini, DeepSeek-R1, Qwen3 thinking mode. Existing patterns 27 and 36–37 enforce this.
3. **The output format block is locked** — one copyable prompt block + one-line target/strategy note. Do not add intermediate steps, framework names, or explanations visible to the user.
4. **Clarifying questions cap stays at 3** — do not raise this limit in any tool profile.
5. **Never embed credentials** — no API keys, tokens, or secrets. Any new tool profile requiring authentication must use generic references like "assumes [service] is already connected."

---

## Credential Safety (Applies to All Files)

No file in this repository should ever contain API keys, tokens, secrets, connection strings, or auth credentials. If a contributed tool profile example shows authentication, use placeholder references only:
- `assumes [APP] is already connected`
- `requires [ENV_VAR_NAME] to be set`
- `use your [service] API key`

---

## Adding a New Tool Profile — Checklist

When adding a routing block for a new AI tool:

- [ ] Tool name exactly matches the product name (check official branding)
- [ ] Category label included in the heading (e.g., `(agentic IDE)`, `(reasoning LLM)`, `(image AI)`)
- [ ] 3–6 specific routing constraints or techniques listed
- [ ] If reasoning-native (thinks internally): explicitly state no CoT
- [ ] If agentic (runs commands/edits files): stop conditions mentioned
- [ ] If image-based: note whether negative prompts are supported
- [ ] Tool added to the tool table in `README.md`
- [ ] Version bumped if this is part of a release

---

## Reference Files — Lazy Load Pattern

SKILL.md references `references/templates.md` and `references/patterns.md` with explicit "read only when needed" instructions. This keeps SKILL.md token-lean. When routing logic in SKILL.md points to a template (e.g., "Read Template M"), the full template definition must exist in `references/templates.md`. Never inline a full template inside SKILL.md.

---

## Agentic Output Warning Rule

Any tool profile in SKILL.md for a tool that executes commands, edits files, runs in terminal, or manages a filesystem — and any template that targets these tools (Templates G, H, M) — must trigger the Agentic Output Warning defined in the Middle Zone. Do not add new agentic tool profiles without ensuring they are covered by the warning trigger condition.

---

## Source Accuracy & Drafting Protocol

NEVER fabricate statistics, data points, or claims not explicitly present in source documents. If a fact cannot be verified from provided sources, flag it as `[NEEDS SOURCE]` rather than including it. Cross-reference all data attributions to ensure they match the correct source document and author.

### When drafting documents or conducting research from source materials:

1. **Read first, write second.** Read all provided source documents fully before drafting. Do not begin writing until all sources are loaded.
2. **Maintain a source map.** Track every factual claim, metric, name, or date back to its source. Present the draft clean (no inline tags), with a "Source Map" appendix listing each claim and its origin (document name, section/heading).
3. **Verify before delivering.** For substantive documents (strategy docs, external-facing reports, review comments, posts, presentations), spawn a verification agent that re-reads each source and checks every claim in the source map. Mark any unverifiable claim as `[UNVERIFIED]`.
4. **Separate verified from unverified.** Present the clean draft with unverified claims removed, plus a separate list of removed claims so the user can decide whether to add them back with proper sourcing.
5. **No invention.** Never generate statistics, percentages, quotes, or specific details not found in the sources — even if they seem plausible or "directionally correct."

---

## Current Version

**1.6.0** — Opus 4.7 compatibility update. Added Template M, updated Claude and Claude Code routing for adaptive thinking and xhigh effort defaults, added patterns 36–37 for Opus 4.7 prompt failures.
