# P0 Copy Sync — catalyst-dna staging
**Scope:** v2+ service catalogue, kill "data mesh," resolve naming, footer year.
**Format:** exact FIND → REPLACE blocks for Claude Code. Apply in order.

---

## 1 · Services section — replace all six cards with the five-service catalogue

**FIND:** the entire Capabilities card grid (six cards: Data Platform Modernization → Managed Optimization).

**REPLACE with five cards, in this order** (AI Workflow Deployment gets lead billing — it's the fastest sales entry point):

---

**Section header (unchanged structure, updated copy):**

> **Services**
>
> ## What we build and operate.
>
> Five engagement types, one system. Each produces something that runs in production — not observations.

---

**Card 1 — △ AI Workflow Deployment**

Production-grade agentic AI systems for regulated environments — from use-case selection through build, deployment, monitoring, and governance. Working software in weeks, on infrastructure you own.

**Card 2 — ◈ DNA Blueprint**

A 2–4 week strategy and vendor assessment engagement. Target operating model, prioritized use-case portfolio with value mapping, reference architecture, and a 90-day execution plan with investment logic.

**Card 3 — ◇ Data Foundation Sprint**

The analytical data layer your AI needs, built in 6–10 weeks. Cloud-native landing zone, initial data products, governance-as-code, and LLM-safe access patterns — RAG-ready from day one.

**Card 4 — ○ Analytics Programme**

Predictive models designed, built, and moved into production — with the evaluation pipelines, monitoring, and model risk documentation regulated environments require.

**Card 5 — ▽ DNA Ops**

Managed run-state operations on a monthly retainer. Platform reliability with defined SLOs, model monitoring, data quality SLAs, cost control, and a quarterly roadmap refresh.

---

## 2 · Kill "data mesh"

Resolved automatically by Block 1 — the "Data Platform Modernization" card (which contained "data mesh implementation") is retired. **Verify no other instance exists:** grep the repo for `data mesh` after applying.

## 3 · Naming: "DNA Foundation Sprint" → "Data Foundation Sprint"

**FIND** (How We Work, stage 02):
> DNA Foundation Sprint

**REPLACE:**
> Data Foundation Sprint

Grep repo-wide for `DNA Foundation` — canonical name everywhere is **Data Foundation Sprint**.

## 4 · How We Work, stage 02 "Build" — sync bullets to catalogue

The Build stage delivers three of the five services, not just the data platform.

**FIND** (stage 02 bullets):
> - Modern data platform landing zone
> - Initial data products and analytics workflows
> - Governance-as-code starter set
> - LLM-safe data access patterns (RAG-ready)

**REPLACE:**
> - Agentic AI workflows deployed to production
> - Analytical data foundation — landing zone, data products, governance-as-code
> - Predictive models with evaluation and monitoring built in
> - LLM-safe data access patterns (RAG-ready)

**FIND** (stage 02 label):
> Data Foundation Sprint

*(after Block 3 rename)* **REPLACE:**
> AI Workflow Deployment · Data Foundation Sprint · Analytics Programme

## 5 · Footer year

**FIND:**
> © 2025 Catalyst-DNA LLC

**REPLACE:**
> © 2026 Catalyst-DNA LLC

---

## Flagged, not actioned (your call — outside P0 scope)

**A. Industries section dilutes the front door.** Cards give equal billing to Financial Services / Insurance / Capital Markets. The "horizontal engine, vertical front door" positioning says community and regional banks lead. Suggested minimal fix: retitle card 01 to "Community & Regional Banks" with copy naming the $1B–$50B segment explicitly, demote Insurance and Capital Markets to a single "Also serving" line or secondary visual weight.

**B. Hero subhead** still reads platform-era ("data and AI foundations"). Fine for P0; revisit at P1 when the hero is rebuilt anyway.

---

## Post-apply checklist
- [ ] `grep -ri "data mesh" .` → zero hits
- [ ] `grep -ri "DNA Foundation" .` → zero hits
- [ ] Five service cards render, AI Workflow Deployment first
- [ ] Footer shows 2026
- [ ] Mobile: five-card grid reflows cleanly (was six — check last-row alignment)
