# Agent Output Contracts · Phase A · v1.0

One envelope, fourteen payloads. Each Worker route stops emitting freeform markdown
(`{ output: "## Snapshot\n..." }`) and emits `{ envelope, payload }` JSON that its work
surface renders. Phase B implements route-by-route; nothing here changes the Worker's
plumbing (CORS, rate cap, single deploy) or the single-file-page rule.

**How these were derived.** Payload shapes come from three constraints intersected:
(a) the playbook's per-agent structures (four-question cards, claim→evidence→risk→mitigant
nodes, per-field confidence records, etc.); (b) what each route's *current* system prompt
already produces — every contract below is a re-shaping of sections the prompts
already mandate, so prompt rewrites in Phase B are structural, not substantive;
(c) the trust-layer kit — every payload references citations, confidence, exceptions,
engagement markers, and gates by the shared shapes in §0, so all fourteen surfaces
render trust identically.

**Locked rulings applied.** CFO = Call Report Prep only (no board-narrative payload
exists in this contract set). CHRO = interview kit only; the resume-assessment module
appears solely as a `describedCapability` — a marker the page may render as prose, with
no schema for candidate evaluation, so it cannot be wired even by accident. Deposit
attrition is seated with the Chief Banking Officer.

---

## §0 · Shared shapes

### 0.1 The envelope (every route, identical)

```json
{
  "envelope": {
    "agent": "amltriage",
    "surface": "evidence-chain",
    "seat": "Chief Risk Officer / BSA Officer",
    "generatedAt": "2026-07-07T14:22:09Z",
    "mode": "fictional-packet",
    "universe": "cedarline",
    "model": "claude-sonnet-4-6",
    "engagementOnly": [
      { "check": "prior-SAR similarity search",
        "why": "requires the bank's SAR history" },
      { "check": "cross-institution counterparty corroboration",
        "why": "requires bank-side transaction detail" }
    ],
    "gate": {
      "state": "draft",
      "holder": "BSA Officer",
      "holds": "filing decision"
    }
  },
  "payload": { }
}
```

- `mode`: `"live-public"` (briefing, regmonitor, ceobrief, interviewkit, policyqa*) or
  `"fictional-packet"` (the rest). *policyqa runs live generation on a fictional corpus;
  it reports `"fictional-packet"` with `universe:"cedarline"` — the badge logic keys off
  `mode`, matching the hub's current live/fictional split.
- `universe`: `"cedarline"` for every fictional packet (Cedarline Community Bank,
  NorthArc vendor, Tillman Fabrication, Lakemont Vending, Green Mountain Orthopedics —
  the interlocking cast stays consistent); `null` for live-public routes.
- `engagementOnly[]`: the named cross-checks this demo cannot run — renders as
  `.tl-engage`. Every fictional-packet route MUST name at least one; this is the honesty
  mechanism, and its absence is a contract violation, not a clean bill.
- `gate`: renders as `.tl-gate`. Demo emits `"draft"` only. `holder`/`holds` carry each
  route's existing closing-line ruling ("filing decisions rest with the BSA Officer") as
  data instead of prose.

### 0.2 Citation (`cite`)

```json
{ "kind": "doc",     "ref": "LP-7.3",  "quote": "minimum global debt service coverage 1.25x" }
{ "kind": "live",    "ref": "FDIC FIL-2026-14", "url": "https://…", "asOf": "2026-07-02" }
{ "kind": "derived", "ref": "calc:dscr-2025", "formula": "(1118 + 130) / (112.8 + 16 + 286.8) = 1.20x" }
```
Renders as `.tl-cite` / `.tl-cite--live` / `.tl-cite--derived`. Every numeric claim in
every payload carries `cites: [cite]`. A `derived` cite always ships its `formula` —
arithmetic shown is the house rule.

### 0.3 Confidence (`conf`)

```json
{ "state": "verified",  "reason": "two sources" }
{ "state": "qualified", "reason": "single source" }
{ "state": "routed",    "reason": "illegible on fax — exception raised" }
```
Three states, categorical, no numerics. Renders as `.tl-conf`.

### 0.4 Exception (`exc`)

```json
{ "field": "EIN", "why": "partially illegible on fax",
  "fix": "request re-fax or W-9", "owner": "Deposit Ops", "severity": "hold" }
```
Renders as `.tl-exc`. `severity`: `"hold"` | `"note"`.

### 0.5 As-of (`asOf`)

ISO-8601 string on any datum whose age matters; optional `"stale": true` when older than
the surface's freshness expectation. Renders as `.tl-asof`.

---

## §1 · `ceobrief` — executive signal stack (CEO/President) · live-public

```json
"payload": {
  "bank": "…", "market": "…",
  "signals": [
    {
      "lane": "rates|bank-news|market|regulatory|worth-5-min",
      "changed": "one sentence: what changed",
      "matters": "one sentence: why it matters to THIS bank at its scale",
      "action": "one sentence: recommended action, or null",
      "conf": { "state": "verified", "reason": "two sources" },
      "cites": [ { "kind": "live", "…": "…" } ],
      "asOf": "2026-07-07"
    }
  ],
  "quietLanes": [ { "lane": "bank-news", "note": "nothing recent found — normal for most community banks" } ]
}
```

5–7 signals max — the materiality gate lives in the prompt, and the surface renders
exactly what arrives, no pagination. The four-question card (changed/matters/action/
confidence) is the payload's atomic unit. `quietLanes` makes "no news" a rendered
finding rather than an omission. Production absorbs BOSS's queue roll-up here;
`signals[].lane` is already the join key.

## §2 · `briefing` — relationship canvas (Chief Lending Officer) · live-public

```json
"payload": {
  "company": "…", "context": "new_relationship",
  "snapshot":     { "text": "…", "conf": {…}, "cites": […] },
  "developments": [ { "text": "…", "asOf": "…", "cites": […] } ],
  "likelyNeeds":  [ { "hypothesis": "…", "signal": "what public fact suggests it", "cites": […] } ],
  "angles":       [ { "opener": "…", "evidence": "…", "cites": […] } ],
  "risks":        [ { "text": "…", "conf": {…}, "cites": […] } ],
  "questions":    [ "…" ]
}
```

Canvas blocks map 1:1 to the six sections the prompt already mandates. `likelyNeeds`
entries are hypotheses by shape — each must carry the `signal` that generated it, which
is the anti-fabrication check made structural. Single-source facts arrive
`conf.qualified`; the surface renders them visibly hedged. `engagementOnly` names the
relationship-side checks: existing-exposure lookup, KYC-gap check, servicing-issue scan.

## §3 · `attrition` — retention radar (Chief Banking Officer) · fictional-packet

```json
"payload": {
  "flag": { "id": "EW-2026-0198", "rule": "…", "priority": "High" },
  "relationship": { "name": "…", "tenureYears": 9, "components": ["…"], "feeIncomeYr": 14000 },
  "signal": {
    "declineRunRateMo": { "value": 74800, "cites": [ { "kind": "derived", "formula": "…" } ] },
    "projection6mo":    { "value": …,     "cites": [ {"kind":"derived","formula":"…"} ] }
  },
  "benignChecks": [
    { "pattern": "seasonality", "verdict": "ruled out", "because": "operating inflows stable throughout" },
    { "pattern": "revenue decline", "verdict": "ruled out", "because": "decline is outflow-driven" }
  ],
  "drivers": [ { "hypothesis": "yield-seeking transfer", "signal": "recurring $75k ACH to brokerage", "cites": […] } ],
  "economics": {
    "replacementCost": { "formula": "wholesale 4.60% − MMDA 1.10% = 3.50% × balance at risk", "value": …, "cites": […] },
    "retentionCost":   { "formula": "…", "value": …, "cites": […] },
    "breakEvenRate":   { "value": …, "cites": […] }
  },
  "play": [ { "step": 1, "who": "…", "does": "…" } ],
  "outreachNote": { "text": "…", "rule": "no rate mentioned" }
}
```

The glass-box formula is the surface's signature: `economics.*` fields are unrenderable
without their `formula`. `benignChecks` structurally enforces the false-positive
discipline — the radar must show what it ruled out before what it flagged.
`gate.holder`: "Relationship Manager"; `holds`: "outreach and pricing — exceptions per
[LP-6.1]". `engagementOnly`: 90-day baseline validation, householding across the
relationship, live rate feed.

## §4 · `callreport` — schedule close board (CFO) · fictional-packet
*(Ruling applied: this is the CFO contract. No board-narrative payload exists.)*

```json
"payload": {
  "period": "2026-06-30",
  "board": [
    { "schedule": "RC",   "status": "tied",    "owner": "Controller", "asOf": "…" },
    { "schedule": "RC-C", "status": "flagged", "owner": "Controller", "asOf": "…" }
  ],
  "tieouts": [
    { "check": "RC total loans vs RC-C category sum",
      "left": 412300, "right": 409100, "delta": -3200,
      "pass": false,
      "cites": [ { "kind": "derived", "formula": "409,100 − 412,300 = −3,200" } ] }
  ],
  "flags": [
    { "n": 1, "what": "RC vs RC-C tie-out gap −$3.2M", "magnitude": "0.78% of total loans",
      "resolves": "…", "draftExplanation": "examiner-ready paragraph…", "cites": […] }
  ],
  "filingChecklist": [ { "item": "…", "done": false } ]
}
```

The board is the surface; `tieouts[]` are its cells — every one carries `pass` and shown
arithmetic, and a failed tie-out can never render as prose only. `draftExplanation`
lives inside its flag so explanation and evidence are inseparable on screen.
`gate.holder`: "Controller"; `holds`: "filing". `engagementOnly`: GL-to-schedule
reconciliation, prior-period variance tolerance vs bank history, four-eyes certification.

## §5 · `creditmemo` — underwriting argument map (Chief Credit Officer) · fictional-packet

```json
"payload": {
  "request": { "text": "…", "amounts": [ { "label": "…", "value": 1200000 } ] },
  "map": [
    {
      "claim": "Pro-forma global cash flow covers the combined debt load",
      "evidence": [ { "text": "2025 EBITDA + addback $1,248k", "cites": […] },
                    { "text": "global DSCR 1.20x", "cites": [ { "kind": "derived", "formula": "…" } ] } ],
      "risks":    [ { "text": "1.20x is below the 1.25x floor", "cites": [ { "kind": "doc", "ref": "LP-7.3" } ] } ],
      "mitigants":[ { "text": "…", "cites": […] } ],
      "policyExceptions": [ { "ref": "LP-7.3", "requires": "CCO written approval per LP-6.1" } ]
    }
  ],
  "collateral": { "…": "…", "cites": […] },
  "stressLens": {
    "scenario": "EBITDA −15%",
    "map": [ { "claim": "…", "evidence": […] } ],
    "weakestFacts": [ "…", "…" ]
  },
  "recommendation": { "verdict": "draft-approve-with-conditions", "conditions": [ "…" ] }
}
```

`map[]` nodes are the playbook's claim→evidence→risk→mitigant chain, verbatim as
structure. `stressLens` is a sibling of the base map, not a paragraph — the surface's
toggle flips between two argument maps built from the same packet. `policyExceptions`
carry `ref`s that render as `.tl-cite` chips into the same corpus policyqa serves —
first visible proof of the layer-zero claim. `gate.holder`: "Credit Analyst / Loan
Committee". `engagementOnly`: K-1 tracing across entities, covenant-conflict scan
against the book, statement-recency verification.

## §6 · `amltriage` — evidence chain (CRO / BSA Officer) · fictional-packet

```json
"payload": {
  "alert": { "id": "TM-2026-0412", "rule": "…", "priority": "High" },
  "chain": [
    { "t": "2026-06-08..07-01", "fact": "11 currency deposits $8,400–$9,750, total $101,300",
      "kind": "fact", "cites": [ { "kind": "derived", "formula": "sum shown" } ] },
    { "t": "2026-06-16", "fact": "same-day multi-branch $18,200 — CTR not filed",
      "kind": "fact", "remediation": true, "cites": […] },
    { "t": null, "fact": "activity 3.4–4.1× CDD expectation",
      "kind": "analysis", "cites": [ {"kind":"derived","formula":"…"} ] },
    { "t": null, "fact": "possible structuring pattern",
      "kind": "hypothesis", "cites": […] }
  ],
  "checklist": [ { "item": "…", "closes": "which gap" } ],
  "narrative": {
    "pillars": { "who": "…", "what": "…", "when": "…", "where": "…", "whySuspicious": "…", "amounts": "…" },
    "sentences": [ { "text": "…", "supports": [ 0, 2 ] } ],
    "complete": true
  },
  "disposition": { "recommendation": "…", "rationale": "…" }
}
```

`chain[].kind` (`fact` | `analysis` | `hypothesis`) enforces the separation the surface
is named for — the renderer styles the three differently and never lets a hypothesis
sit visually as a fact. `narrative.sentences[].supports` indexes into `chain`, giving
the side-by-side highlight (each SAR sentence traces to its rows) as data. `complete`
is the five-pillar validator's verdict; a false blocks the gate from even rendering
"draft" without a visible incomplete warning. `gate.holder`: "BSA Officer"; `holds`:
"filing decision". `engagementOnly`: prior-SAR similarity, sanctions/adverse-media
corroboration, CAR timing off filing history.

## §7 · `regmonitor` — obligation heatline (Chief Compliance Officer) · live-public

```json
"payload": {
  "profile": { "assetSize": "$1B-$10B", "regulator": "FDIC", "lines": ["…"] },
  "scan": { "periodDays": 45, "agencies": ["FDIC","FinCEN","CFPB","FFIEC"], "temperature": "…" },
  "items": [
    {
      "applies": true,
      "changed": "what it is — agency, date, instrument",
      "soWhat": "why it reaches this profile",
      "nowWhat": "the action it implies",
      "owner": "BSA Officer",
      "effective": "2026-09-01",
      "cites": [ { "kind": "live", "…" } ],
      "conf": {…}
    },
    {
      "applies": false,
      "changed": "…",
      "soWhat": "does NOT reach this profile — asset-size threshold $10B",
      "nowWhat": null, "owner": null
    }
  ],
  "watchlist": [ { "changed": "…", "horizon": "next two quarters", "cites": […] } ]
}
```

One item shape for both verdicts — `applies:false` items carry their threshold reason in
`soWhat`, which the heatline renders in the "does not reach you" band; the negative
finding is a first-class row, unique among the reg-change tools. Three-column
what-changed/so-what/now-what is the card, direct from the playbook. `engagementOnly`:
policy/control mapping to the bank's own inventory, named-owner routing,
guidance-page-edit gap-catcher.

## §8 · `docflow` — ops conveyor (COO) · fictional-packet

```json
"payload": {
  "batch": { "count": 3, "received": "…" },
  "docs": [
    {
      "id": "A", "class": "commercial credit application", "channel": "fax",
      "fields": [
        { "name": "Applicant", "value": "Marrow & Finch Bookkeeping LLC", "conf": { "state": "verified", "reason": "clear on source" } },
        { "name": "EIN", "value": null, "conf": { "state": "routed", "reason": "partially illegible" },
          "exc": { "field": "EIN", "why": "partially illegible on fax", "fix": "request re-fax or W-9", "owner": "Deposit Ops", "severity": "hold" } },
        { "name": "Signature date", "value": null, "conf": { "state": "routed", "reason": "blank" }, "exc": {…} }
      ],
      "route": { "queue": "Commercial intake", "hold": "pending EIN + signature date" }
    }
  ],
  "validators": [
    { "name": "loss-payee check", "doc": "B", "verdict": "fail",
      "because": "certificate holder listed; loss payee absent", "fix": "corrected certificate from producer",
      "cites": […] },
    { "name": "payoff authorization check", "doc": "C", "verdict": "fail",
      "because": "borrower authorization not attached", "fix": "signed authorization before statement release",
      "cites": […] }
  ],
  "exceptions": [ "…rollup of all exc objects across docs+validators, conveyor-ordered…" ]
}
```

Per-field confidence records are the contract's core: a field is `value + conf`, and a
routed field carries its `exc` inline — null values without an exception object cannot
exist, which is "never guesses" as a type constraint. `validators[]` are the
banking-specific checks (insurance cert, payoff auth) as named first-class results.
`gate.holder`: "Operations review". `engagementOnly`: cross-packet consistency vs core
records, retention-category assignment, reviewer-authority check.

## §9 · `contractanalyzer` — contract x-ray (CIO) · fictional-packet

```json
"payload": {
  "contract": { "name": "NorthArc Digital Banking Platform Agreement", "termYears": 5 },
  "ledger": [
    { "category": "cost",    "term": "platform fee", "value": "$8,500/mo", "cites": […] },
    { "category": "cost",    "term": "escalator", "value": "CPI + 2%, uncapped",
      "projection": { "formula": "compounded over 3-yr renewal at CPI 2.5%: …", "value": … }, "cites": […] },
    { "category": "exit",    "term": "termination for convenience", "value": "not permitted", "cites": […] },
    { "category": "exit",    "term": "de-conversion", "value": "$75k + proprietary format",
      "risk": "no open-format export specified", "cites": […] },
    { "category": "renewal", "term": "auto-renewal", "value": "3-yr terms, 180-day notice", "cites": […] },
    { "category": "absent",  "term": "data-use clause", "value": null,
      "risk": "no restriction on Provider use of bank/customer data", "cites": […] }
  ],
  "calendar": { "termEnd": "…", "noticeDeadline": "…", "daysRemaining": …,
                "inWindow": false, "cites": [ {"kind":"derived","formula":"…"} ] },
  "negotiation": [ { "order": 1, "ask": "…", "leverage": "notice window timing", "cites": […] } ],
  "tcoInputs": { "platformFeeMo": 8500, "perUnitFee": 1.45, "unitBasis": "active user", "escalator": "CPI+2%" }
}
```

`category:"absent"` makes a missing clause a ledger row, not a footnote — absence is a
finding, per the prompt's own rule. `calendar` is computed, chip-cited, and drives the
deadline timeline. `tcoInputs` keeps the existing bridge to the FinAI TCO calculator as
machine-readable fields. `gate.holder`: "Counsel"; `holds`: "legal review — not legal
advice". `engagementOnly`: clause-vs-bank-standard comparison, vendor criticality tier,
portfolio-wide obligation roll-up.

## §10 · `securityreview` — control confidence ladder (CISO) · fictional-packet

```json
"payload": {
  "package": { "provided": ["SOC 2 Type II","pen test","DPA","cyber insurance cert"], "absent": ["SIG"] },
  "ladder": [
    { "domain": "access control",
      "basis": "verified-evidence",
      "finding": "quarterly user-access reviews not evidenced one quarter (subset of production)",
      "means": "operational meaning…", "request": "compensating evidence to ask for…",
      "cites": [ { "kind": "doc", "ref": "SOC2 §exceptions(1)" } ] },
    { "domain": "subservice oversight", "basis": "self-attested",
      "finding": "cloud-hosting subservice SOC covers 9 of 12 months", "…": "…" },
    { "domain": "vulnerability management", "basis": "verified-evidence",
      "finding": "high finding (session fixation) reported remediated — no retest evidence",
      "request": "retest letter", "cites": […] }
  ],
  "dpa": { "adequate": ["US-only residency","72-hr breach notice"], "missing": ["audit rights","AI/data-use terms"], "cites": […] },
  "questions": [ { "order": 1, "q": "…", "closes": "which risk" } ],
  "residual": { "statement": "what the bank accepts if it signs today", "cites": […] }
}
```

`basis` per domain (`self-attested` | `verified-evidence` | `external-telemetry`) is the
ladder — the defensible alternative to a score, and the forbidden-scale rule holds: no
grades, no bands anywhere in the payload. The question-bank slot in the current prompt
survives: engagement mode swaps the domain list without touching this shape.
`gate.holder`: "CISO"; `holds`: "risk acceptance". `engagementOnly`: external telemetry
feed, fourth-party concentration vs the bank's vendor book, questionnaire-vs-evidence
reconciliation at scale.

## §11 · `archassess` — dependency atlas (CTO) · fictional-packet

```json
"payload": {
  "posture": { "summary": "…", "mostConsequential": "…" },
  "findings": [
    { "pillar": "Reliability", "element": "core DR last exercised 3 years ago",
      "risk": "…", "heat": "high", "cites": […] },
    { "pillar": "Integration Debt", "element": "14 point-to-point SFTP feeds, single-FTE ETL",
      "risk": "keyperson + change fragility", "heat": "high",
      "blastRadius": ["data warehouse","all reporting"], "cites": […] }
  ],
  "gaps": [ { "silence": "no data classification program described", "why": "cannot assess…" } ],
  "aiReadiness": { "can": ["…"], "cannot": ["…"], "cites": […] },
  "sequence": [
    { "order": 1, "move": "…", "unblocks": [2,3], "because": "why it precedes the next" }
  ]
}
```

`heat` is three-state (`high|medium|low`) styled by the same status tokens as `.tl-conf`
— one visual language for severity everywhere. `gaps[]` renders description-silence as
findings, never assumptions. `sequence[].unblocks` makes dependency order explicit
graph data: recommendations literally cannot render as a flat wish list.
`gate.holder`: "the bank"; `holds`: "architecture decisions". `engagementOnly`:
CMDB/discovery reconciliation, EOL check against live lifecycle data, failover
verification.

## §12 · `projectassess` — investment jury (Chief Transformation Officer) · fictional-packet

```json
"payload": {
  "initiative": { "name": "NorthArc Open replacement", "oneTime": 680000, "runMo": 14000 },
  "jury": [
    { "dimension": "payback", "verdict": "qualified",
      "atCharter":  { "formula": "680,000 / (52,000 − 14,000) = 17.9 mo", "value": "17.9 mo" },
      "atRealistic":{ "formula": "benefits 50% for six months: …", "value": "…" },
      "cites": […] },
    { "dimension": "benefits credibility", "verdict": "concern",
      "because": "40% claim rests on vendor case studies; bank funnel data implies…", "validates": "…", "cites": […] },
    { "dimension": "competitiveness", "verdict": "supports",
      "because": "3 of 5 competitors live — do-nothing case…", "cites": […] },
    { "dimension": "delivery risk", "verdict": "concern",
      "because": "0.5 FTE PM; no run-state owner; integration testing unbudgeted",
      "failureModes": [ "…" ], "cites": […] },
    { "dimension": "strategic fit", "verdict": "supports", "cites": […] }
  ],
  "sensitivity": [
    { "assumption": "benefits ramp", "swing": "payback 17.9 → … mo", "rank": 1, "cites": […] }
  ],
  "recommendation": { "verdict": "proceed-with-conditions", "conditions": [ "…" ] }
}
```

`jury[]` verdicts are per-dimension (`supports|qualified|concern`), so trade-offs render
as a tried case, not a blended score — no composite number exists in the payload.
`sensitivity[]` rank-orders which assumptions move the answer (the payback math at two
ramps is already in the prompt; this makes it the tornado). `gate.holder`: "Investment
Committee". `engagementOnly`: efficiency-ratio/NIM impact vs the bank's own financials,
peer benchmark off call-report data, change-fatigue overlap with the live portfolio.

## §13 · `interviewkit` — structured interviewer cockpit (CHRO) · live-public
*(Ruling applied: kit-only in public. No candidate-evaluation schema exists here.)*

```json
"payload": {
  "role": "…", "level": "experienced",
  "framing": "…",
  "competencies": [
    { "name": "…", "questions": [ { "q": "…", "strongAnswer": "…" } ] }
  ],
  "skillsMatrix": [ { "skill": "…", "probe": "…" } ],
  "workSample": { "exercise": "…", "timeBudget": "…" },
  "anchors": [ { "competency": "…", "strong": "…", "adequate": "…", "concern": "…" } ],
  "doNotAsk": [ "…" ],
  "describedCapability": {
    "name": "Resume assessment",
    "status": "engagement-mode-only",
    "description": "Evidence-cited resume assessment against the role's competency map — every strength or gap cites the resume line that supports it. Runs only inside an engagement, on the bank's roles and rubric, with adverse-impact monitoring.",
    "boundary": "This demo never screens, scores, or ranks candidates — that boundary is the design."
  }
}
```

`describedCapability` is the contract's enforcement of the CHRO ruling: it is a prose
object the page renders inside a `.tl-engage` block. No field anywhere accepts a resume,
a candidate, or a score — the assessment cannot be wired into the public demo without
changing the contract itself. `gate.holder`: "Hiring manager"; `holds`: "hiring
decisions". `engagementOnly` mirrors `describedCapability` plus interviewer-calibration
and adverse-impact monitoring.

## §14 · `policyqa` — policy lane (CDO · layer zero) · fictional corpus

```json
"payload": {
  "question": "…",
  "answered": true,
  "answer": { "text": "…", "cites": [ { "kind": "doc", "ref": "LP-2.1", "quote": "…verbatim clause…" } ] },
  "clauses": [
    { "ref": "LP-2.1", "verbatim": "…full quoted section…", "policy": "Lending Policy",
      "version": "2026-01", "reviewDue": "2027-01", "stale": false }
  ],
  "coverage": { "state": "covered" },
  "conflicts": [],
  "noAnswer": null
}
```

Not-covered shape:

```json
{ "answered": false,
  "noAnswer": { "statement": "The corpus does not address …",
                "closest": { "ref": "TR-2.4", "why": "nearest related section" },
                "action": "escalate" },
  "coverage": { "state": "not-covered" } }
```

`answered:false` is a first-class payload, not an error — the hub already sells this
("note what it does when the corpus does not have the answer"), and the surface renders
the escalation as the product behavior. `clauses[].version/reviewDue/stale` carry the
receipts chips. `conflicts[]` is reserved for the engagement-mode conflict detector —
present, typed, empty in the demo. `coverage.state`: `covered | partial | not-covered`.
`gate.holder`: "Policy owner"; `holds`: "operational decisions made on answers".
`engagementOnly`: permissions-aware retrieval, conflict detection across the full
corpus, decision-use logging.

---

## Worker-side note (Phase B, recorded here so the contract is buildable)

Routes keep their current envelope of plumbing; the change is `response_format`-style
prompting (emit JSON matching the contract, validated server-side before return).
Validation rule per route: parse-or-reject — a payload that fails its shape returns the
existing `"Empty response — try again."` path rather than half-rendered trust UI.
`engagementOnly` and `gate` are injected by the Worker from per-route constants, not
generated by the model — the honesty layer is code, not prompt compliance.
