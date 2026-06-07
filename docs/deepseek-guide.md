# 🔮 DeepSeek Social Media Guide

> Using DeepSeek AI (DeepSeek-V3 & DeepSeek-R1) for social media strategy, content creation, and audience growth

---

## About DeepSeek

DeepSeek is a powerful AI model family developed by DeepSeek (深度求索). Two models are available in PromptMaster:

| Model | ID | Best For |
|-------|-----|----------|
| **DeepSeek-V3** | `deepseek-chat` | General social media content, fast generation, captions, hooks, and repurposing |
| **DeepSeek-R1** | `deepseek-reasoner` | Deep strategy, audience psychology analysis, algorithm breakdowns, complex planning |

---

## Key Differences: DeepSeek vs Claude

| Aspect | DeepSeek | Claude |
|--------|----------|--------|
| **API endpoint** | `api.deepseek.com` | `api.anthropic.com` |
| **API format** | OpenAI-compatible | Anthropic Messages API |
| **Strengths** | Reasoning (R1), cost-efficiency, long context | Nuanced tone, structured markdown, creative writing |
| **Thinking mode** | R1 has internal CoT (like o1) | Opus uses direct generation |
| **Max tokens** | 8K output (V3), 8K output (R1) | 8K output (Opus), 8K (Sonnet) |

---

## When to Use Each for Social Media

### Use DeepSeek-V3 When You Need:
- **Fast content generation** — captions, hooks, quick posts
- **Data-driven strategy** — analytical breakdowns of audience behavior
- **Threads & long-form** — Twitter/X threads, LinkedIn articles
- **Multi-format repurposing** — transforming one idea into many formats
- **Cost-effective scaling** — generating large volumes of content

### Use DeepSeek-R1 When You Need:
- **Deep strategic thinking** — 30-day growth plans, competitive analysis
- **Algorithm intelligence** — understanding platform mechanics
- **Audience psychology** — uncovering deep motivations and triggers
- **Complex problem-solving** — diagnosing engagement drops, content audit

### Use Claude When You Need:
- **Polished, brand-aligned copy** — nuanced tone and style control
- **Creative storytelling** — emotional narratives, brand voice
- **Highly structured markdown** — formatted reports with exact section control

---

## Optimizing Prompts for DeepSeek

### DeepSeek-V3 Best Practices

1. **Be direct and specific** — V3 responds best to clear instructions with expected output format
2. **Use markdown structure** — Include `##` headers in your prompt to guide the output shape
3. **Keep system prompts concise** — V3 works well with a focused system prompt + detailed user message
4. **Add examples where format matters** — Few-shot examples significantly improve consistency

**Example optimized prompt:**
```
You are a social media strategist. Create a 30-day content plan.

Niche: Fitness coaching for busy professionals
Platform: Instagram
Goal: 5K followers in 90 days

Format each week as:
## Week [N]: [Theme]
- Day 1: [Post type] — [Hook]
- Day 2: [Post type] — [Hook]
...
- Day 7: [Post type] — [Hook]
```

### DeepSeek-R1 Best Practices

1. **DO NOT add Chain of Thought** — R1 thinks internally. Adding "think step by step" degrades output quality
2. **Frame as analysis/reasoning tasks** — R1 excels at "analyze," "diagnose," "compare," "evaluate"
3. **Request structured output after reasoning** — R1 can think deeply then output a structured result
4. **Set a context window** — R1 can over-reason; specifying scope helps

**Example R1-optimized prompt:**
```
Analyze why my Instagram engagement dropped 40% this month.

Niche: Sustainable fashion
Audience: Women 25-40, eco-conscious
Current engagement rate: 1.2% (was 2.0%)
Recent changes: Posting 5x/week instead of 3x, more carousel posts

Diagnose the likely causes and provide a 14-day recovery plan.
```

---

## Platform-Specific Tips for DeepSeek

### Instagram
- V3 excels at **caption writing** with CTA hooks
- R1 is great for **algorithm analysis** and hashtag strategy
- Best prompt: "Write 5 Instagram captions for [topic]. Each: hook (2 lines), body (3 lines), CTA (1 line). Include emojis."

### TikTok
- V3 can generate **short-form video scripts** with hook → body → CTA
- R1 can analyze **trend patterns** and recommend content angles
- Best prompt: "Create 3 TikTok scripts for [niche]. Each: hook (0-3s), content (3-30s), CTA (30-60s). Platform-native language."

### LinkedIn
- V3 handles **thought leadership posts** well
- R1 excels at **industry analysis** and authority-building content
- Best prompt: "Write a LinkedIn post about [topic]. Opening hook, personal story, 3 key insights, discussion CTA. Professional but conversational."

### Twitter/X
- V3 is good at **thread structuring**
- R1 can find **angle and argument logic**
- Best prompt: "Create a Twitter thread on [topic]. 7 tweets. Tweet 1: hook. Tweets 2-6: value. Tweet 7: CTA + summary."

### YouTube
- V3 can generate **script outlines** and **title variations**
- R1 is strong at **SEO analysis** and **audience retention strategies**
- Best prompt: "Create a YouTube video outline for [topic]. Title (clickable), hook, 5 sections with timestamps, CTA, end screen elements."

---

## Pricing Comparison

| Provider | Model | Input Cost (per 1M tokens) | Output Cost (per 1M tokens) |
|----------|-------|---------------------------|----------------------------|
| DeepSeek | V3 | $0.27 | $1.10 |
| DeepSeek | R1 | $0.55 | $2.19 |
| Anthropic | Opus 4.8 | $15.00 | $75.00 |
| Anthropic | Sonnet 4.6 | $3.00 | $15.00 |
| Anthropic | Haiku 4.5 | $0.80 | $4.00 |

**DeepSeek V3 is ~50x cheaper than Opus and ~10x cheaper than Sonnet** for similar-quality social media content. R1 is ~25x cheaper than Opus for deep analysis tasks.

---

## Getting Started with DeepSeek

1. Sign up at [platform.deepseek.com](https://platform.deepseek.com)
2. Create an API key
3. Open PromptMaster **Settings** → Switch provider to **🔮 DeepSeek**
4. Paste your DeepSeek API key
5. Select model: **V3** for general content, **R1** for deep strategy
6. Select any module and generate
