/* ============================================================
   CATALYST-DNA AGENT DEMOS — unified Cloudflare Worker
   Routes: POST /briefing · POST /regmonitor · POST /ceobrief
   Supersedes banker-briefing-worker.js (same /briefing contract —
   existing demo pages keep working if pointed at this Worker + path).

   DEPLOY:
     npm create cloudflare@latest agent-demos -- --type=hello-world
     # replace src/index.js with this file
     npx wrangler secret put ANTHROPIC_API_KEY
     npx wrangler kv namespace create RATE     # optional; enables daily caps
     # add printed binding to wrangler.toml:  [[kv_namespaces]] binding="RATE" id="..."
     npx wrangler deploy
     # paste https://<worker>.workers.dev into WORKER_BASE in each demo page

   CONTRACTS: all 14 routes emit { envelope, payload } JSON validated
   against agent-output-contracts.md. Invalid output degrades to
   { output } and each demo page renders it in its fallback panel.

   COST: claude-sonnet-4-6 ($3/$15 per MTok, July 2026), max_tokens 2200-3500,
   web search ≤3-4 uses/request → ≈$0.10-0.18 per generation.
   Shared cap: 8 generations / IP / day across all agents.
   ============================================================ */

const ALLOWED_ORIGINS = [
  "https://catalyst-dna.com",
  "https://www.catalyst-dna.com",
  "https://catalyst-dna-site.em483.workers.dev",
  "http://localhost:8080",
];

const DAILY_CAP = 8;

/* ---------------- agent definitions ---------------- */

const BRIEFING_CONTEXTS = {
  new_relationship: "a first meeting with a prospective new commercial banking relationship",
  lending_renewal:  "an upcoming credit renewal discussion with an existing borrower",
  treasury:         "a treasury management and deposit services conversation",
  annual_review:    "an annual relationship review",
};


/* ============================================================
   AGENT OUTPUT CONTRACTS  (merged: chunks 1-4, all 14 routes)
   envelope.engagementOnly and envelope.gate are CODE CONSTANTS,
   never model output. Routes emit { envelope, payload }; on
   validation failure the response degrades to { output: <text> }
   which every demo page renders in its fallback panel.
   ============================================================ */

const CONTRACT_META = {
  ceobrief: {
    surface: "executive-signal-stack",
    seat: "CEO / President",
    mode: "live-public",
    universe: null,
    engagementOnly: [
      { check: "overnight internal numbers — deposit flows, pipeline, liquidity position",
        why: "requires core extracts" },
    ],
    gate: { state: "draft", holder: "CEO", holds: "operating decisions informed by the brief" },
  },
  briefing: {
    surface: "relationship-canvas",
    seat: "Chief Lending Officer",
    mode: "live-public",
    universe: null,
    engagementOnly: [
      { check: "existing-exposure and conflict lookup", why: "requires core + CRM" },
      { check: "KYC-gap check", why: "requires CDD records" },
      { check: "servicing-issue scan", why: "requires servicing system" },
    ],
    gate: { state: "draft", holder: "Relationship banker", holds: "the meeting and the ask" },
  },
  attrition: {
    surface: "retention-radar",
    seat: "Chief Banking Officer",
    mode: "fictional-packet",
    universe: "cedarline",
    engagementOnly: [
      { check: "90-day baseline validation across the book", why: "requires core transaction history" },
      { check: "householding across the relationship", why: "requires customer graph" },
      { check: "live wholesale rate feed", why: "requires treasury data" },
    ],
    gate: { state: "draft", holder: "Relationship Manager",
            holds: "outreach and pricing — exceptions per [LP-6.1]" },
  },
  creditmemo: {
    surface: "underwriting-argument-map",
    seat: "Chief Credit Officer",
    mode: "fictional-packet",
    universe: "cedarline",
    engagementOnly: [
      { check: "K-1 tracing across related entities", why: "requires full tax returns" },
      { check: "covenant-conflict scan against the book", why: "requires loan system" },
      { check: "statement-recency verification", why: "requires loan file" },
    ],
    gate: { state: "draft", holder: "Credit Analyst / Loan Committee",
            holds: "the credit decision" },
  },
  callreport: {
    surface: "schedule-close-board",
    seat: "CFO",
    mode: "fictional-packet",
    universe: "cedarline",
    engagementOnly: [
      { check: "GL-to-schedule reconciliation", why: "requires general ledger extract" },
      { check: "prior-period variance tolerance vs bank history", why: "requires prior filings archive" },
      { check: "four-eyes certification", why: "requires bank workflow system" },
    ],
    gate: { state: "draft", holder: "Controller", holds: "filing — accuracy rests with the bank" },
  },
  amltriage: {
    surface: "evidence-chain",
    seat: "Chief Risk Officer / BSA Officer",
    mode: "fictional-packet",
    universe: "cedarline",
    engagementOnly: [
      { check: "prior-SAR similarity search", why: "requires the bank's SAR history" },
      { check: "sanctions and adverse-media corroboration", why: "requires screening systems" },
      { check: "Continuing Activity Report timing", why: "requires filing history" },
    ],
    gate: { state: "draft", holder: "BSA Officer", holds: "filing decision" },
  },
  regmonitor: {
    surface: "obligation-heatline",
    seat: "Chief Compliance Officer",
    mode: "live-public",
    universe: null,
    engagementOnly: [
      { check: "policy/control mapping to the bank's inventory", why: "requires policy inventory" },
      { check: "named-owner routing", why: "requires org data" },
      { check: "guidance-page-edit gap-catcher", why: "requires continuous feed" },
    ],
    gate: { state: "draft", holder: "Chief Compliance Officer", holds: "response ownership and routing" },
  },
  docflow: {
    surface: "ops-conveyor",
    seat: "COO",
    mode: "fictional-packet",
    universe: "cedarline",
    engagementOnly: [
      { check: "cross-packet consistency vs core records", why: "requires imaging system + core" },
      { check: "retention-category assignment", why: "requires records policy" },
      { check: "reviewer-authority check", why: "requires entitlements system" },
    ],
    gate: { state: "draft", holder: "Operations review", holds: "exception resolution — per bank procedures" },
  },
  contractanalyzer: {
    surface: "contract-x-ray",
    seat: "CIO",
    mode: "fictional-packet",
    universe: "northarc",
    engagementOnly: [
      { check: "clause-vs-bank-standard comparison", why: "requires standards library" },
      { check: "vendor criticality tier", why: "requires vendor inventory" },
      { check: "portfolio-wide obligation roll-up", why: "requires contract repository" },
    ],
    gate: { state: "draft", holder: "Counsel", holds: "legal review — this analysis is not legal advice" },
  },
  securityreview: {
    surface: "control-confidence-ladder",
    seat: "CISO",
    mode: "fictional-packet",
    universe: "northarc",
    engagementOnly: [
      { check: "external telemetry feed", why: "requires monitoring subscription" },
      { check: "fourth-party concentration vs the bank's vendor book", why: "requires vendor inventory" },
      { check: "questionnaire-vs-evidence reconciliation at scale", why: "requires completed SIG + full SOC 2 body" },
    ],
    gate: { state: "draft", holder: "CISO", holds: "risk acceptance — this review informs, it does not decide" },
  },
  archassess: {
    surface: "dependency-atlas",
    seat: "CTO",
    mode: "fictional-packet",
    universe: "cedarline",
    engagementOnly: [
      { check: "CMDB/discovery reconciliation", why: "requires live inventory access" },
      { check: "EOL check against live lifecycle data", why: "requires product-lifecycle sources" },
      { check: "failover verification", why: "requires DR test evidence" },
    ],
    gate: { state: "draft", holder: "the bank", holds: "architecture decisions — this assessment informs the roadmap" },
  },
  projectassess: {
    surface: "investment-jury",
    seat: "Chief Transformation Officer",
    mode: "fictional-packet",
    universe: "cedarline-northarc",
    engagementOnly: [
      { check: "efficiency-ratio and NIM impact vs the bank's financials", why: "requires GL + call-report data" },
      { check: "peer benchmark off call-report data", why: "requires peer data pipeline" },
      { check: "change-fatigue overlap with the live portfolio", why: "requires project inventory" },
    ],
    gate: { state: "draft", holder: "Investment Committee", holds: "investment decisions — this trial informs the docket" },
  },
  interviewkit: {
    surface: "structured-interviewer-cockpit",
    seat: "CHRO",
    mode: "live-public",
    universe: null,
    engagementOnly: [
      { check: "resume assessment with line-cited strengths/gaps", why: "engagement mode only — by design, not by limitation" },
      { check: "interviewer calibration", why: "requires the bank's rubric and panel" },
      { check: "adverse-impact monitoring by stage", why: "requires bank ATS data" },
    ],
    gate: { state: "draft", holder: "Hiring manager", holds: "hiring decisions — this kit structures the conversation, nothing more" },
  },
  policyqa: {
    surface: "policy-lane",
    seat: "Chief Data Officer",
    mode: "fictional-packet",
    universe: "cedarline",
    engagementOnly: [
      { check: "permissions-aware retrieval", why: "requires entitlements" },
      { check: "conflict detection across the full corpus", why: "requires complete policy inventory" },
      { check: "decision-use logging", why: "requires audit infrastructure" },
    ],
    gate: { state: "draft", holder: "Policy owner", holds: "operational decisions made on answers" },
  },
};

const JSON_FORMAT = {

  ceobrief: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "bank": "<the bank name as given>",
  "market": "<the market as given>",
  "signals": [
    {
      "lane": "rates" | "bank-news" | "market" | "regulatory" | "worth-5-min",
      "changed": "<one sentence: what changed>",
      "matters": "<one sentence: why it matters to THIS bank at its scale>",
      "action": "<one sentence recommended action>" | null,
      "conf": { "state": "verified" | "qualified", "reason": "<e.g. 'two sources' or 'single source'>" },
      "cites": [ { "kind": "live", "label": "<source name>", "url": "<url>" } ],
      "asOf": "<YYYY-MM-DD of the underlying fact>"
    }
  ],
  "quietLanes": [ { "lane": "<lane>", "note": "<one line stating nothing recent was found>" } ]
}
Rules for the shape: 5-7 signals TOTAL including exactly one "rates" lane signal (the number
that matters today). Every signal needs at least one cite with a real URL from your searches.
A lane with nothing to report goes in quietLanes — never pad a lane to fill it. conf.state is
"verified" only when two independent sources agree; otherwise "qualified" with the reason.`,

  briefing: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "company": "<as given>",
  "context": "<as given>",
  "snapshot": { "text": "<2-3 sentences>", "conf": { "state": "verified"|"qualified", "reason": "<why>" },
                "cites": [ { "kind": "live", "label": "<source>", "url": "<url>" } ] },
  "developments": [ { "text": "<one development>", "asOf": "<YYYY-MM-DD>", "cites": [ ... ] } ],
  "likelyNeeds": [ { "hypothesis": "<the need>", "signal": "<the public fact that suggests it>", "cites": [ ... ] } ],
  "angles": [ { "opener": "<conversation angle>", "evidence": "<the fact it stands on>", "cites": [ ... ] } ],
  "risks": [ { "text": "<risk or red flag>", "conf": { ... }, "cites": [ ... ] } ],
  "questions": [ "<question to ask in the meeting>" ]
}
Rules for the shape: exactly 3 angles. Every likelyNeeds entry MUST carry the signal that
generated it — a hypothesis without its signal is invalid. If the company cannot be verified,
snapshot.conf.state is "qualified" and every other array may be short or empty — never
fabricate to fill the canvas. developments may be [] — the surface renders that honestly.`,

  attrition: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "flag": { "id": "EW-2026-0198", "rule": "<rule name>", "priority": "High" },
  "relationship": { "name": "<from packet>", "tenureYears": 9,
                    "components": [ "<relationship component>" ], "feeIncomeYr": 14000 },
  "balances": [ <the 12 month-end balances from the packet, in $000, oldest first> ],
  "signal": {
    "declineRunRateMo": { "value": <number USD/mo>, "cites": [ { "kind": "derived", "formula": "<arithmetic shown>" } ] },
    "projection6mo":    { "value": <number USD>,    "cites": [ { "kind": "derived", "formula": "<arithmetic shown>" } ] }
  },
  "benignChecks": [
    { "pattern": "<benign explanation tested>", "verdict": "ruled out" | "cannot rule out", "because": "<the packet fact>" }
  ],
  "drivers": [ { "hypothesis": "<driver hypothesis>", "signal": "<the specific flow signal>",
                 "cites": [ { "kind": "doc", "ref": "packet" } ] } ],
  "economics": {
    "replacementCost": { "formula": "<e.g. wholesale 4.60% − MMDA 1.10% = 3.50% × balance at risk>", "value": <number>, "cites": [ ... ] },
    "retentionCost":   { "formula": "<arithmetic>", "value": <number>, "cites": [ ... ] },
    "breakEvenRate":   { "formula": "<arithmetic>", "value": "<e.g. '3.85% APY'>", "cites": [ ... ] }
  },
  "play": [ { "step": 1, "who": "<role>", "does": "<action>" } ],
  "outreachNote": { "text": "<the note — warm, non-alarmed, no rate mentioned>", "rule": "no rate mentioned" }
}
Rules for the shape: every economics field is INVALID without its formula — the surface will
not render a value that arrives without arithmetic. benignChecks must test at least
seasonality and revenue decline before any driver is offered. Drivers are hypotheses; each
must name its flow signal.`,

  creditmemo: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "request": { "text": "<one line>", "amounts": [ { "label": "<e.g. equipment term>", "value": 1200000 } ] },
  "map": [
    {
      "claim": "<a load-bearing claim of the credit case>",
      "evidence": [ { "text": "<fact or computed figure>",
                      "cites": [ { "kind": "doc", "ref": "packet" } |
                                 { "kind": "derived", "formula": "<arithmetic shown>" } ] } ],
      "risks": [ { "text": "<risk>", "cites": [ { "kind": "doc", "ref": "LP-7.3" } ] } ],
      "mitigants": [ { "text": "<mitigant>", "cites": [ ... ] } ],
      "policyExceptions": [ { "ref": "<LP-x.x>", "requires": "<what approval it needs, per LP-6.1>" } ]
    }
  ],
  "collateral": { "text": "<collateral analysis>", "cites": [ ... ] },
  "stressLens": {
    "scenario": "EBITDA −15%",
    "weakestFacts": [ "<the 2-3 facts that most weaken this credit>" ],
    "map": [ <same node shape as map[], rebuilt under the stress scenario> ]
  },
  "exceptions": [ { "field": "<what is missing>", "why": "<why it is an exception>", "fix": "<what resolves it · owner>" } ],
  "recommendation": { "verdict": "draft-approve" | "draft-approve-with-conditions" | "draft-decline",
                      "conditions": [ "<condition precedent>" ] }
}
Rules for the shape: 3-5 map nodes; the DSCR computation MUST appear as derived evidence with
its formula. Policy touchpoints cite [LP-x.x] refs exactly as in the excerpts. stressLens.map
is a REBUILT argument map under the scenario — not the base map with adjectives. Missing
documents are exceptions[], never omissions.`,

  callreport: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "period": "2026-06-30",
  "board": [
    { "schedule": "RC" | "RC-C" | "RI" | "RC-R", "status": "tied" | "flagged",
      "owner": "<role>", "asOf": "<YYYY-MM-DD>" }
  ],
  "tieouts": [
    { "check": "<what is being tied out>",
      "left": <number $000>, "right": <number $000>, "delta": <number $000>,
      "pass": true | false,
      "cites": [ { "kind": "derived", "formula": "<the arithmetic, shown>" } ] }
  ],
  "flags": [
    { "n": 1, "what": "<the finding>", "magnitude": "<size in context, e.g. '0.78% of total loans'>",
      "resolves": "<what to fix or document>",
      "draftExplanation": "<one examiner-ready paragraph the controller can adapt>",
      "cites": [ { "kind": "derived", "formula": "<arithmetic>" } | { "kind": "doc", "ref": "packet" } ] }
  ],
  "filingChecklist": [ { "item": "<action before submission>", "done": false } ]
}
Rules for the shape: every board schedule from the extracts appears exactly once. Every
tieout carries pass AND its formula — a failed tie-out without shown arithmetic is invalid.
The three seeded findings (RC vs RC-C gap, YoY interest income variance, RC-R risk-weighting
note) must each appear as a flag with its draftExplanation welded in. Never invent figures
to force a tie-out.`,

  amltriage: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "alert": { "id": "TM-2026-0412", "rule": "<rule name>", "priority": "High" },
  "chain": [
    { "t": "<date or date-range from packet>" | null,
      "fact": "<one chain entry>",
      "kind": "fact" | "analysis" | "hypothesis",
      "remediation": true,        // ONLY on the missed-CTR entry; omit elsewhere
      "cites": [ { "kind": "doc", "ref": "packet" } |
                 { "kind": "derived", "formula": "<arithmetic shown>" } ] }
  ],
  "checklist": [ { "item": "<what the analyst should pull or verify>", "closes": "<which gap it closes>" } ],
  "narrative": {
    "pillars": { "who": "<subject identification>", "what": "<instruments and amounts>",
                 "when": "<the activity window>", "where": "<branches/locations>",
                 "whySuspicious": "<the pattern, factually>", "amounts": "<totals>" },
    "sentences": [ { "text": "<one narrative sentence, plain factual prose>",
                     "supports": [ <zero-based indexes into chain> ] } ],
    "complete": true | false
  },
  "disposition": { "recommendation": "<recommend filing / no filing>", "rationale": "<why>" }
}
Rules for the shape: chain kinds are strict — packet facts are "fact", computed comparisons
are "analysis" with formulas, typology interpretations are "hypothesis"; never promote a
hypothesis to fact. Every narrative sentence MUST list the chain entries it stands on in
supports[] — a sentence with an empty supports[] is invalid. complete is true ONLY when all
six pillar fields are substantively filled. 5-7 checklist items. The June 16 missed CTR
aggregation appears in the chain with remediation:true. No speculation about intent, no
legal conclusions.`,

  regmonitor: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "profile": { "assetSize": "<as given>", "regulator": "<as given>", "lines": [ "<as given>" ] },
  "scan": { "periodDays": 45, "agencies": [ "<agency scanned>" ], "temperature": "<one line>" },
  "items": [
    { "applies": true,
      "changed": "<what it is — agency, date, instrument>",
      "soWhat": "<why it reaches this profile>",
      "nowWhat": "<the action it implies>",
      "owner": "<typical owner role>",
      "effective": "<YYYY-MM-DD>" | null,
      "cites": [ { "kind": "live", "label": "<agency/source>", "url": "<url>" } ],
      "conf": { "state": "verified" | "qualified", "reason": "<why>" } },
    { "applies": false,
      "changed": "<the prominent item>",
      "soWhat": "<the threshold or scope reason it does NOT reach this profile>",
      "nowWhat": null, "owner": null, "effective": null,
      "cites": [ { "kind": "live", "label": "<source>", "url": "<url>" } ] }
  ],
  "watchlist": [ { "changed": "<proposed rule or signal>", "horizon": "<when it matures>",
                   "cites": [ ... ] } ]
}
Rules for the shape: one item shape for both verdicts — applies:false items are first-class
rows carrying their exclusion reason in soWhat. 3-5 applying items most-urgent-first, 2-3
non-applying, 2-3 watchlist. Every item must be real, dated, attributable, with a live cite
URL from your searches — never invent releases or docket numbers. Zero applying items is a
valid result: return items:[] applying and note the quiet period in scan.temperature.`,

  docflow: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "batch": { "count": 3, "received": "<how the batch arrived>" },
  "docs": [
    {
      "id": "A", "class": "<document classification>", "channel": "fax" | "email" | "mail scan",
      "fields": [
        { "name": "<field name>", "value": "<extracted value>" | null,
          "conf": { "state": "verified" | "qualified" | "routed", "reason": "<why>" },
          "exc": { "field": "<field>", "why": "<why it is an exception>",
                   "fix": "<what resolves it>", "owner": "<queue/role>", "severity": "hold" | "note" }
          // exc is REQUIRED whenever value is null and MUST be omitted when value is present
        }
      ],
      "route": { "queue": "<destination queue>", "hold": "<hold condition>" | null }
    }
  ],
  "validators": [
    { "name": "<banking check, e.g. loss-payee check>", "doc": "B",
      "verdict": "pass" | "fail" | "na",
      "because": "<the specific finding>", "fix": "<what resolves it>" | null,
      "cites": [ { "kind": "doc", "ref": "packet" } ] }
  ]
}
Rules for the shape: a null value REQUIRES its exc object — an illegible or absent field
without an exception is invalid output; never place a guessed value in "value". The
insurance-certificate loss-payee check and the payoff-authorization check MUST each appear
in validators[] with their packet findings. Confidence states: "verified" = clear on source,
"qualified" = readable but uncertain, "routed" = sent to a human. Transcribe values exactly
as the packet shows them.`,

  contractanalyzer: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "contract": { "name": "NorthArc Digital Banking Platform Agreement", "termYears": 5 },
  "ledger": [
    { "category": "cost" | "renewal" | "exit" | "liability" | "absent",
      "term": "<the clause or obligation>",
      "value": "<the term as written>" | null,      // null ONLY with category "absent"
      "risk": "<the exposure it creates>" | null,
      "projection": { "formula": "<compounding arithmetic shown>", "value": <number> } | null,
      "cites": [ { "kind": "doc", "ref": "<section ref>" } ] }
  ],
  "calendar": { "termEnd": "<YYYY-MM-DD>", "noticeDeadline": "<YYYY-MM-DD>",
                "daysRemaining": <number>, "inWindow": true | false,
                "cites": [ { "kind": "derived", "formula": "<date arithmetic shown>" } ] },
  "negotiation": [ { "order": 1, "ask": "<specific ask>", "leverage": "<what creates it>",
                     "cites": [ ... ] } ],
  "tcoInputs": { "platformFeeMo": 8500, "perUnitFee": 1.45, "unitBasis": "active user",
                 "escalator": "CPI+2%" }
}
Rules for the shape: the missing data-use clause MUST appear as a ledger row with
category "absent" and value null — absence is a finding, not a footnote. The uncapped
escalator MUST carry its compounding projection with the arithmetic shown. calendar is
computed from contract dates with the date math in its cite. Negotiation asks are ordered
by leverage, strongest first. Quote money terms exactly as written.`,

  securityreview: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "package": { "provided": [ "<artifact>" ], "absent": [ "<artifact>" ] },
  "ladder": [
    { "domain": "<control domain>",
      "basis": "self-attested" | "verified-evidence" | "external-telemetry",
      "finding": "<the specific finding, factually>",
      "means": "<operational meaning for the bank>",
      "request": "<compensating evidence to ask for>" | null,
      "cites": [ { "kind": "doc", "ref": "<e.g. SOC2 exceptions(1)>" } ] }
  ],
  "dpa": { "adequate": [ "<term present and sufficient>" ], "missing": [ "<term absent>" ],
           "cites": [ ... ] },
  "questions": [ { "order": 1, "q": "<follow-up question>", "closes": "<which risk it closes>" } ],
  "residual": { "statement": "<plain prose: what the bank accepts if it signs today>",
                "cites": [ ... ] }
}
Rules for the shape: NO grades, NO scores, NO ratings, NO bands anywhere — basis per domain
is the only tiering, and it names the EVIDENCE KIND, never a quality level. Every ladder
finding cites its package location. The SOC 2 exceptions, the 9-of-12-month subservice gap,
and the unretested high finding MUST each appear as rungs. The missing SIG appears in
package.absent. 5-7 questions ordered by risk closed. residual.statement is one paragraph,
concrete, no hedging.`,

  archassess: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "posture": { "summary": "<3-4 sentence current-state read>",
               "mostConsequential": "<the single finding that matters most>" },
  "findings": [
    { "pillar": "Reliability" | "Security" | "Cost" | "Operational Excellence" | "Performance"
                | "Integration Debt" | "AI Readiness",
      "element": "<the specific inventory element the finding ties to>",
      "risk": "<what it exposes>",
      "heat": "high" | "medium" | "low",
      "blastRadius": [ "<what breaks downstream>" ] | [],
      "cites": [ { "kind": "doc", "ref": "estate" } ] }
  ],
  "gaps": [ { "silence": "<what the description does not cover>",
              "why": "<what cannot be assessed because of it>" } ],
  "aiReadiness": { "can": [ "<possible today>" ], "cannot": [ "<blocked until fixed>" ],
                   "cites": [ ... ] },
  "sequence": [
    { "order": 1, "move": "<the recommendation>",
      "unblocks": [ <order numbers this move unblocks> ],
      "because": "<why it precedes the next>" }
  ]
}
Rules for the shape: every finding names its element — free-floating judgments are invalid.
Where the estate description is silent, write a gap, never an assumption. Every sequence
entry except the last MUST have a non-empty unblocks[] — a flat list with no dependency
edges is invalid output. The stale DR exercise, the single-FTE ETL, and the point-to-point
feed sprawl must each surface as findings with heat.`,

  projectassess: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "initiative": { "name": "<from charter>", "oneTime": 680000, "runMo": 14000 },
  "jury": [
    { "dimension": "payback" | "benefits credibility" | "competitiveness" | "delivery risk" | "strategic fit",
      "verdict": "supports" | "qualified" | "concern",
      "because": "<the finding, factually>",
      "atCharter":  { "formula": "<arithmetic shown>", "value": "<result>" } | null,
      "atRealistic":{ "formula": "<arithmetic shown>", "value": "<result>" } | null,
      "validates": "<what to validate before committing>" | null,
      "failureModes": [ "<specific failure mode>" ] | [],
      "cites": [ { "kind": "doc", "ref": "charter" } ] }
  ],
  "sensitivity": [
    { "rank": 1, "assumption": "<the assumption>", "swing": "<how the answer moves>", "cites": [ ... ] }
  ],
  "recommendation": { "verdict": "proceed" | "proceed-with-conditions" | "defer",
                      "conditions": [ "<specific binding condition>" ] }
}
Rules for the shape: all five dimensions MUST appear in jury[], each with its own verdict —
NO composite score, NO weighted total, NO blended rating exists or may be invented. The
payback dimension MUST carry both atCharter and atRealistic with arithmetic shown. The
benefits-credibility dimension must test the 40% claim against its own sourcing.
sensitivity[] is rank-ordered by how much each assumption moves the answer. Conditions are
binding and specific, not caveats.`,

  interviewkit: `
Output format — respond with ONLY a JSON object, no markdown, no preamble, matching exactly:
{
  "role": "<as given>", "level": "<as given>",
  "framing": "<2-3 sentences: what this role is accountable for at a community bank>",
  "competencies": [
    { "name": "<competency>", "questions": [
        { "q": "<behavioral question>", "strongAnswer": "<what a strong answer includes>" } ] }
  ],
  "skillsMatrix": [ { "skill": "<technical skill>", "probe": "<how to test it directly>" } ],
  "workSample": { "exercise": "<realistic exercise>", "timeBudget": "<e.g. 45 minutes>" },
  "anchors": [ { "competency": "<name>", "strong": "<sounds like>", "adequate": "<sounds like>",
                 "concern": "<sounds like>" } ],
  "doNotAsk": [ "<question or topic to avoid, with the compliant alternative if one exists>" ],
  "describedCapability": {
    "name": "Resume assessment",
    "status": "engagement-mode-only",
    "description": "Evidence-cited resume assessment against the role's competency map — every strength or gap cites the resume line that supports it. Runs only inside an engagement, on the bank's roles and rubric, with adverse-impact monitoring.",
    "boundary": "This demo never screens, scores, or ranks candidates — that boundary is the design."
  }
}
Rules for the shape: 3-4 competencies with 2-3 questions each; every question carries its
strongAnswer anchor. NO field for a candidate, a resume, or any evaluation of a person
exists — do not add one under any name. describedCapability is FIXED prose: reproduce it
verbatim as given above. doNotAsk includes at least 4 entries grounded in fair-hiring
practice. Banking-role-aware: lender, BSA analyst, credit analyst, teller-ops framings
should feel native.`,

  policyqa: `
Output format — respond with ONLY a JSON object, no markdown, no preamble. TWO valid shapes:

If the corpus answers the question:
{
  "question": "<as given>",
  "answered": true,
  "answer": { "text": "<the answer, ≤120 words, from the corpus only>",
              "cites": [ { "kind": "doc", "ref": "<LP-x.x>" } ] },
  "clauses": [
    { "ref": "<LP-x.x>", "verbatim": "<the exact clause text from the corpus>",
      "policy": "<policy name>", "version": "<e.g. 2026-01>",
      "reviewDue": "<e.g. 2027-01>", "stale": false }
  ],
  "coverage": { "state": "covered" | "partial" },
  "conflicts": [],
  "noAnswer": null
}

If the corpus does NOT answer the question:
{
  "question": "<as given>",
  "answered": false,
  "answer": null, "clauses": [],
  "coverage": { "state": "not-covered" },
  "conflicts": [],
  "noAnswer": { "statement": "<one sentence: what the corpus does not address>",
                "closest": { "ref": "<nearest related section>", "why": "<why it is nearest>" } | null,
                "action": "escalate" }
}
Rules for the shape: answer ONLY from the corpus sections provided — never from general
banking knowledge. Every clause quoted must be verbatim from the corpus with its real
section ref, version, and review date. If the question is outside the corpus, answered:false
is the CORRECT output, not a failure — do not stretch a tangential section into an answer.
coverage "partial" means the corpus addresses part of the question; say which part in the
answer text. conflicts[] stays empty in the demo.`,
};

/* per-route max_tokens (JSON is heavier than markdown) */
const MAX_TOKENS = {
  ceobrief: 3000, briefing: 2500, attrition: 2500, creditmemo: 3500,
  callreport: 2500, amltriage: 3200, regmonitor: 2500,
  docflow: 3000, contractanalyzer: 2800, securityreview: 2800, archassess: 3000,
  projectassess: 2800, interviewkit: 2800, policyqa: 2200,
};
const DEFAULT_MAX_TOKENS = 2500;

/* structural validation — parse-or-reject, never repair */
function tryParseContract(text, route) {
  let obj;
  try {
    const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    obj = JSON.parse(m ? m[1] : text);
  } catch { return null; }
  if (!obj || typeof obj !== "object") return null;

  const checks = {
    ceobrief:  (o) => Array.isArray(o.signals) && o.signals.length >= 3 && o.signals.length <= 7
                      && o.signals.every(s => s.changed && s.matters && s.conf && Array.isArray(s.cites)),
    briefing:  (o) => o.snapshot && Array.isArray(o.angles) && o.angles.length === 3
                      && (o.likelyNeeds || []).every(n => n.hypothesis && n.signal),
    attrition: (o) => o.economics
                      && ["replacementCost","retentionCost","breakEvenRate"]
                         .every(k => o.economics[k] && o.economics[k].formula)   // glass-box law
                      && Array.isArray(o.benignChecks) && o.benignChecks.length >= 2
                      && (o.drivers || []).every(d => d.hypothesis && d.signal),
    creditmemo:(o) => Array.isArray(o.map) && o.map.length >= 3
                      && o.map.every(n => n.claim && Array.isArray(n.evidence))
                      && o.stressLens && Array.isArray(o.stressLens.map)
                      && Array.isArray(o.stressLens.weakestFacts)
                      && o.recommendation && o.recommendation.verdict,
  callreport: (o) =>
    Array.isArray(o.board) && o.board.length >= 3
    && Array.isArray(o.tieouts) && o.tieouts.length >= 1
    && o.tieouts.every(t => typeof t.pass === "boolean"
        && Array.isArray(t.cites)
        && t.cites.some(c => c.kind === "derived" && c.formula))   // arithmetic-in-the-row law
    && Array.isArray(o.flags) && o.flags.length >= 3
    && o.flags.every(f => f.what && f.draftExplanation && f.resolves) // explanation welded to flag
    && Array.isArray(o.filingChecklist),

  amltriage: (o) =>
    Array.isArray(o.chain) && o.chain.length >= 4
    && o.chain.every(l => l.fact && ["fact","analysis","hypothesis"].includes(l.kind))
    && o.chain.some(l => l.remediation === true)                    // missed CTR must surface
    && o.narrative && o.narrative.pillars
    && Array.isArray(o.narrative.sentences)
    && o.narrative.sentences.length >= 3
    && o.narrative.sentences.every(s => Array.isArray(s.supports) && s.supports.length >= 1
        && s.supports.every(i => Number.isInteger(i) && i >= 0 && i < o.chain.length)) // sentence-to-evidence law
    && typeof o.narrative.complete === "boolean"
    && o.disposition && o.disposition.recommendation,

  regmonitor: (o) =>
    o.profile && o.scan
    && Array.isArray(o.items)
    && o.items.every(i => typeof i.applies === "boolean" && i.changed && i.soWhat)
    && o.items.filter(i => i.applies).every(i => i.nowWhat && Array.isArray(i.cites) && i.cites.length >= 1)
    && Array.isArray(o.watchlist),
  docflow: (o) =>
    o.batch && Array.isArray(o.docs) && o.docs.length >= 2
    && o.docs.every(d => Array.isArray(d.fields)
        && d.fields.every(f => f.name && f.conf
            && (f.value != null || (f.exc && f.exc.why && f.exc.fix))))   // never-guesses type law
    && Array.isArray(o.validators) && o.validators.length >= 2
    && o.validators.every(v => v.name && ["pass","fail","na"].includes(v.verdict) && v.because),

  contractanalyzer: (o) => {
    if(!(Array.isArray(o.ledger) && o.ledger.length >= 5)) return false;
    if(!o.ledger.some(r => r.category === "absent" && r.value == null)) return false; // absence-is-a-finding law
    if(!o.ledger.every(r => r.category !== "absent" ? r.value != null : true)) return false;
    if(!(o.calendar && typeof o.calendar.inWindow === "boolean"
        && Array.isArray(o.calendar.cites)
        && o.calendar.cites.some(c => c.kind === "derived" && c.formula))) return false;
    if(!(Array.isArray(o.negotiation) && o.negotiation.length >= 2
        && o.negotiation.every(n => n.ask && n.leverage))) return false;
    return o.tcoInputs && typeof o.tcoInputs.platformFeeMo === "number";
  },

  securityreview: (o) => {
    const BASES = ["self-attested","verified-evidence","external-telemetry"];
    if(!(Array.isArray(o.ladder) && o.ladder.length >= 3
        && o.ladder.every(r => r.domain && BASES.includes(r.basis) && r.finding))) return false;
    // forbidden-scale rule as code: reject grade/score/band vocabulary anywhere in the payload
    const flat = JSON.stringify(o).toLowerCase();
    if(/\b(grade|score[sd]?|rating|a-f|[0-9]{3}-[0-9]{3})\b/.test(flat)) return false;
    return o.package && Array.isArray(o.package.absent)
        && o.dpa && Array.isArray(o.dpa.missing)
        && Array.isArray(o.questions) && o.questions.length >= 4
        && o.residual && o.residual.statement;
  },

  archassess: (o) =>
    o.posture && o.posture.mostConsequential
    && Array.isArray(o.findings) && o.findings.length >= 4
    && o.findings.every(f => f.pillar && f.element && ["high","medium","low"].includes(f.heat))
    && Array.isArray(o.gaps) && o.gaps.length >= 1
    && o.aiReadiness && Array.isArray(o.aiReadiness.cannot)
    && Array.isArray(o.sequence) && o.sequence.length >= 3
    && o.sequence.slice(0, -1).every(s => Array.isArray(s.unblocks) && s.unblocks.length >= 1) // no-wish-list law
    && o.sequence.every(s => s.move && s.because),
  projectassess: (o) => {
    const DIMS = ["payback","benefits credibility","competitiveness","delivery risk","strategic fit"];
    if(!(Array.isArray(o.jury) && o.jury.length === 5)) return false;
    if(!DIMS.every(d => o.jury.some(j => j.dimension === d))) return false;
    if(!o.jury.every(j => ["supports","qualified","concern"].includes(j.verdict))) return false;
    const pb = o.jury.find(j => j.dimension === "payback");
    if(!(pb && pb.atCharter && pb.atCharter.formula && pb.atRealistic && pb.atRealistic.formula)) return false;
    // no-composite law: reject blended-score vocabulary anywhere in the payload
    if(/\b(composite|weighted (score|total)|overall score|blended)\b/i.test(JSON.stringify(o))) return false;
    return Array.isArray(o.sensitivity) && o.sensitivity.length >= 2
        && o.recommendation && ["proceed","proceed-with-conditions","defer"].includes(o.recommendation.verdict)
        && Array.isArray(o.recommendation.conditions);
  },

  interviewkit: (o) => {
    if(!(o.role && o.framing && Array.isArray(o.competencies) && o.competencies.length >= 3)) return false;
    if(!o.competencies.every(c => Array.isArray(c.questions)
        && c.questions.every(q => q.q && q.strongAnswer))) return false;
    if(!(Array.isArray(o.anchors) && o.anchors.length >= 3
        && o.anchors.every(a => a.strong && a.adequate && a.concern))) return false;
    if(!(Array.isArray(o.doNotAsk) && o.doNotAsk.length >= 4)) return false;
    // CHRO ruling as code: reject candidate-evaluation vocabulary anywhere
    if(/\b(candidate score|resume score|rank(ed|ing)? candidates|screen(ed|ing)? candidates|applicant rating)\b/i
        .test(JSON.stringify(o))) return false;
    return o.describedCapability && o.describedCapability.status === "engagement-mode-only"
        && o.describedCapability.boundary;
  },

  policyqa: (o) => {
    if(typeof o.answered !== "boolean" || !o.coverage) return false;
    if(o.answered){
      // half-answer rejection: answered:true REQUIRES receipts
      return o.answer && o.answer.text
          && Array.isArray(o.clauses) && o.clauses.length >= 1
          && o.clauses.every(c => c.ref && c.verbatim && c.policy && c.version)
          && ["covered","partial"].includes(o.coverage.state);
    }
    // answered:false REQUIRES the noAnswer object — first-class, never empty
    return o.noAnswer && o.noAnswer.statement
        && o.coverage.state === "not-covered"
        && (!o.clauses || o.clauses.length === 0);
  },
  };
  const check = checks[route];
  return check && check(obj) ? obj : null;
}

function assemble(route, data, cors) {
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  if (!text) return json({ error: "Empty response — try again." }, 502, cors);

  const meta = CONTRACT_META[route];
  if (meta) {
    const parsed = tryParseContract(text, route);
    if (parsed) {
      return json({
        envelope: {
          agent: route,
          surface: meta.surface,
          seat: meta.seat,
          generatedAt: new Date().toISOString(),
          mode: meta.mode,
          universe: meta.universe,
          model: data.model,
          engagementOnly: meta.engagementOnly,
          gate: meta.gate,
        },
        payload: parsed,
      }, 200, cors);
    }
    console.log("contract-fallback", route);
  }
  return json({ output: text, agent: route, model: data.model, usage: data.usage }, 200, cors);
}

/* ---------------- agent definitions ---------------- */

const AGENTS = {

  /* ---- Chief Lending Officer seat ---- */
  briefing: {
    maxSearches: 3,
    system: `You are the Banker Briefing Agent, a demonstration built by Catalyst-DNA (catalyst-dna.com), an operator-led AI firm serving community and regional banks. You produce pre-meeting briefings for commercial bankers.

Rules:
- Use web search (up to 3 searches) to find current, factual information about the company. Prefer primary sources.
- If you cannot verify the company exists or find meaningful public information, say so plainly in the Snapshot section and keep other sections brief and conditional. Never invent facts, financials, or news.
- Public information only. Frame financial-needs analysis as hypotheses to validate in the meeting.
- This is a constrained public demo: the production version integrates core banking, CRM, and portfolio data that this demo does not have. Do not pretend to have such data.
Tone: terse, factual, operator-grade.`,
    buildPrompt(body) {
      const company = String(body.company || "").trim().slice(0, 120);
      if (company.length < 2) return { error: "Enter a company name." };
      const ctx = BRIEFING_CONTEXTS[body.context] ? body.context : "new_relationship";
      return { prompt: "Prepare a pre-meeting briefing on: " + company +
                       ". Meeting context: " + BRIEFING_CONTEXTS[ctx] + "." };
    },
  },

  /* ---- Chief Risk Officer seat ---- */
  regmonitor: {
    maxSearches: 4,
    system: `You are the Regulatory Change Monitor, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You scan recent US banking regulatory activity and classify what applies to a specific bank profile.

Rules:
- Use web search (up to 4 searches) to find regulatory releases, final rules, proposed rules, guidance, and enforcement themes from the last ~45 days from: the bank's primary federal regulator, plus FinCEN, CFPB, and FFIEC where relevant to the profile.
- Every item must be real, dated, and attributable to the issuing agency. Never invent releases, dates, or docket numbers. If you find little recent activity relevant to the profile, say so — a quiet period is a valid finding.
- Classify applicability against the provided profile (asset size, regulator, business lines). Be explicit when an item does NOT apply and why (e.g., asset-size threshold).
- This is a constrained public demo: the production version runs on a continuous feed with routing to named owners inside the bank. Do not pretend to have the bank's internal data.
Tone: terse, factual, operator-grade.`,
    buildPrompt(body) {
      const size = String(body.assetSize || "").slice(0, 20);
      const reg = ["OCC", "FDIC", "Federal Reserve", "NCUA"].includes(body.regulator) ? body.regulator : "FDIC";
      const lines = Array.isArray(body.lines) ? body.lines.filter(x => typeof x === "string").slice(0, 8).map(x => x.slice(0, 40)) : [];
      const sizes = ["Under $1B", "$1B-$10B", "$10B-$50B"];
      const assetSize = sizes.includes(size) ? size : "$1B-$10B";
      return { prompt: "Scan recent regulatory activity for this bank profile — Asset size: " + assetSize +
                       ". Primary federal regulator: " + reg +
                       ". Business lines: " + (lines.length ? lines.join(", ") : "commercial lending, retail deposits") + "." };
    },
  },

  /* ---- CEO seat ---- */
  ceobrief: {
    maxSearches: 4,
    system: `You are the CEO Morning Brief Agent, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional bank chief executives. You assemble the brief a bank CEO reads before the first meeting of the day.

Rules:
- Use web search (up to 4 searches) for: the current rate environment and any market-moving banking news; recent news mentioning the named bank (if any); local/regional market and economic developments for the bank's stated market; notable competitor or M&A activity in that footprint; and any fresh regulatory items a CEO should know exist.
- Everything must be real, current, and sourced. Never invent news about the bank or its market. If there is no recent public news about the bank itself, say so in one line — that is normal for most community banks.
- This is a constrained public demo built on public information only: the production version opens with the bank's own overnight numbers — deposit flows, pipeline, liquidity position — from core extracts this demo does not have. Say this once, in the header line of the Numbers section, and do not fabricate internal figures.
Tone: terse, factual, written for a reader with 4 minutes.`,
    buildPrompt(body) {
      const bank = String(body.bank || "").trim().slice(0, 120);
      const market = String(body.market || "").trim().slice(0, 120);
      if (bank.length < 2) return { error: "Enter a bank name." };
      if (market.length < 2) return { error: "Enter the bank's primary market (city, state)." };
      return { prompt: "Assemble this morning's CEO brief for: " + bank +
                       ", primary market: " + market + ". Today's date matters — prioritise recency." };
    },
  },
  /* ---- CIO/CDO seat · layer zero ---- */
  policyqa: {
    maxSearches: 0,
    system: `You are the Policy Q&A Agent, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You answer staff questions strictly from the bank's policy corpus below. The bank and all policies are FICTIONAL, created for this demo.

Rules:
- Answer ONLY from the corpus. Every claim must cite its section ID in square brackets, e.g. [LP-2.1]. Multiple citations are fine.
- If the corpus does not answer the question, say exactly that in one sentence and name the closest related section if one exists. Never answer from general knowledge.
- Keep answers under 150 words. Terse, operational, written for a staff member mid-task.
- If the question is not about bank policy or operations, decline in one sentence.

=== CEDARLINE COMMUNITY BANK — POLICY CORPUS (FICTIONAL) ===

[LP-2.1] Individual lending authority. Commercial loan officers may approve credit exposure up to $250,000 individually. Senior lenders: $500,000. Chief Credit Officer: $1,000,000. Aggregate exposure above $1,000,000 requires Loan Committee approval; above $3,500,000 requires Board Loan Committee ratification.

[LP-3.4] CRE concentration limits. Total commercial real estate shall not exceed 300% of total risk-based capital. Construction and land development shall not exceed 100% of total risk-based capital. Exposure within 10% of either limit triggers monthly reporting to the Board Risk Committee.

[LP-5.2] Appraisal requirements. Real-estate-secured credits over $500,000 require an independent appraisal from the approved appraiser panel. Credits of $500,000 or below may use an internal evaluation. Appraisals older than 18 months must be updated before renewal or material modification.

[LP-6.1] Policy exceptions. Any exception to lending policy must be documented on the exception form, approved in writing by the Chief Credit Officer, and reported to the Board Loan Committee quarterly in aggregate. Exceptions may not be approved by the officer requesting them.

[LP-7.3] Debt service coverage. Commercial credits require minimum debt service coverage of 1.25x on a global basis at underwriting. Projections-based coverage requires CCO sign-off and is an exception under [LP-6.1] if historical coverage is below 1.10x.

[DP-1.3] Funds availability. Local checks: next business day for the first $275; remainder by the second business day. New accounts (under 30 days): case-by-case holds up to nine business days with written notice. Large deposits over $6,725 may be held per Regulation CC extended-hold provisions.

[BSA-2.2] Currency transaction reporting. Currency transactions over $10,000 in a business day, single or aggregated, require a CTR filed within 15 calendar days. Structuring indicators must be escalated to the BSA Officer the same business day.

[BSA-3.1] Enhanced due diligence triggers. EDD is required for: money services businesses, cash-intensive businesses averaging over $50,000 monthly currency activity, foreign correspondent relationships, and any customer subject to a prior SAR filing within 24 months.

[TR-2.4] Wire verification. Outgoing wires over $25,000 initiated by phone, fax, or email require verbal callback verification to a number on file before release. Requests to change beneficiary details mid-stream require re-verification regardless of amount.

[IT-7.1] AI and model use. Staff may use only AI tools on the approved-tools register. Customer PII may not be entered into any tool not explicitly approved for PII. All AI-assisted credit or compliance work product requires human review before it enters the record.

=== END CORPUS ===`,
    buildPrompt(body) {
      const q = String(body.question || "").trim().slice(0, 300);
      if (q.length < 5) return { error: "Ask a question." };
      return { prompt: "Staff question: " + q };
    },
  },

  /* ---- Chief Credit Officer seat ---- */
  creditmemo: {
    maxSearches: 0,
    system: `You are the Credit Memo Assistant, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You draft credit memos from a borrower packet for a human analyst to review and own. The borrower and all figures below are FICTIONAL, created for this demo.

Rules:
- Use only the packet and policy excerpts below. Never invent facts beyond reasonable derived calculations (ratios, coverage) — show your arithmetic inline where you compute.
- Check the request against the policy excerpts and flag every compliance touchpoint explicitly, citing section IDs like [LP-2.1].
- The recommendation is a DRAFT for the analyst. Frame it that way.

=== BORROWER PACKET (FICTIONAL) ===
Borrower: Tillman Fabrication LLC — custom metal fabrication, Chittenden County, VT. Operating 14 years. 41 employees.
Request: $1,200,000 equipment term loan (5-yr, new CNC line) + renewal of existing $400,000 revolving line of credit.
Existing exposure with bank: $400,000 LOC (currently $180,000 drawn) + $310,000 remaining on 2021 equipment note ($9,400/mo, matures 2028).
Financials (FYE Dec, accountant-reviewed):
  2023: Revenue $6.9M · EBITDA $842k · Officer comp addback $120k
  2024: Revenue $7.6M · EBITDA $951k · Officer comp addback $120k
  2025: Revenue $8.4M · EBITDA $1,118k · Officer comp addback $130k
Existing annual debt service: $112,800 (2021 note) + LOC interest ~$16,000.
Proposed new debt service: $1.2M, 5-yr amortization, 7.25% ≈ $286,800/yr.
Collateral: new CNC equipment (invoice $1.34M; borrower injecting $140k) + blanket lien on business assets. Equipment advance rate per proposal: 90% of invoice.
Guarantor: sole member, personal net worth statement $2.1M incl. residence; personal debt service obligations $84k/yr; outside income $0.
Deposits with bank: operating accounts averaging $410k.
Customer concentration: largest customer 22% of 2025 revenue (aerospace supplier, 6-year relationship).
=== END PACKET ===

=== POLICY EXCERPTS (FICTIONAL — Cedarline Community Bank) ===
[LP-2.1] Individual authority $250k; senior lender $500k; CCO $1,000k; aggregate over $1,000k requires Loan Committee; over $3,500k requires Board ratification.
[LP-5.2] Real-estate-secured credits over $500k require independent appraisal. (Equipment collateral: internal valuation per equipment lending procedures.)
[LP-6.1] All policy exceptions documented, CCO-approved in writing, reported quarterly.
[LP-7.3] Minimum global debt service coverage 1.25x at underwriting; projections-based coverage below 1.10x historical is an exception.
=== END EXCERPTS ===
Tone: the register of a well-run credit department. Terse, numerate, no filler.`,
    buildPrompt(body) {
      const focus = ["standard", "cashflow", "collateral"].includes(body.focus) ? body.focus : "standard";
      const FOCUS = {
        standard:  "Draft the full memo with balanced emphasis.",
        cashflow:  "Draft the full memo with extra depth in Financial analysis — sensitivity of coverage to a 15% EBITDA decline.",
        collateral:"Draft the full memo with extra depth in Collateral — advance rate, liquidation considerations, and the equity injection.",
      };
      return { prompt: FOCUS[focus] };
    },
  },
  /* ---- BSA / Compliance Officer seat ---- */
  amltriage: {
    maxSearches: 0,
    system: `You are the AML Alert Triage Assistant, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You triage a transaction-monitoring alert into a case summary and draft a SAR narrative for human review. The bank, customer, and all activity below are FICTIONAL, created for this demo.

Rules:
- Use only the alert packet below. Never invent transactions, names, dates, or facts beyond it. Derived arithmetic (totals, averages, variance vs expected activity) is encouraged — show it.
- You draft; you never decide. The filing decision rests with the BSA Officer, and every output must say so.
- The draft SAR narrative must follow the standard structure: who conducted the activity, what instruments and amounts, when it occurred, where it occurred, and why it appears suspicious — plain factual prose, no speculation about intent beyond describing the pattern, no legal conclusions.
- Reference the bank's policy where it applies, citing [BSA-2.2] and [BSA-3.1] from the corpus excerpts.

=== ALERT PACKET (FICTIONAL — Cedarline Community Bank) ===
Alert ID: TM-2026-0412 · Rule: currency aggregation below reporting threshold · Priority: High
Subject: Lakemont Vending LLC · business checking ****7741 · customer since 2022
CDD profile: vending machine route operator, 3 employees, sole member Daniel Reeve. Expected cash deposits per CDD file: ~$25,000/month.
Alerted activity (18 business days, June 8 – July 1, 2026):
  11 currency deposits, each between $8,400 and $9,750. Total: $101,300.
  Deposits made at 3 different branches (Main St ×5, Riverside ×4, Northgate ×2), including 2 same-day deposits at different branches (June 16: $9,300 Main St a.m., $8,900 Riverside p.m. — combined $18,200).
Prior 3-month average cash deposits: $86,000–$94,000/month (vs $25,000 expected).
Teller note (June 24, Riverside): customer asked "what's the amount where you have to report it" before completing a $9,600 deposit.
CTR history: none filed — no single-day aggregate over $10,000 except June 16 ($18,200 across branches; CTR NOT filed — aggregation missed at the time).
Prior alerts: one (Oct 2025), velocity rule, closed no action with note "seasonal route expansion per customer."
Prior SARs on subject: none.
Account counterparties: deposits are almost entirely currency; outflows are checks to two beverage distributors, payroll, and monthly transfers of $6,000 to the member's personal account at another institution.
=== END PACKET ===

=== POLICY EXCERPTS (FICTIONAL) ===
[BSA-2.2] Currency transactions over $10,000 in a business day, single or aggregated, require a CTR filed within 15 calendar days. Structuring indicators must be escalated to the BSA Officer the same business day.
[BSA-3.1] EDD is required for cash-intensive businesses averaging over $50,000 monthly currency activity, and any customer subject to a prior SAR filing within 24 months.
=== END EXCERPTS ===
Tone: the register of a well-run BSA department. Factual, unemotional, precise.`,
    buildPrompt(body) {
      const focus = ["standard", "narrative", "checklist"].includes(body.focus) ? body.focus : "standard";
      const FOCUS = {
        standard:  "Triage the alert with balanced depth across all sections.",
        narrative: "Triage the alert with extra care in the Draft SAR narrative — fullest defensible version.",
        checklist: "Triage the alert with extra depth in the Investigation checklist — what closes gaps fastest.",
      };
      return { prompt: FOCUS[focus] };
    },
  },
  /* ---- CFO seat ---- */
  attrition: {
    maxSearches: 0,
    system: `You are the Deposit Attrition Early-Warning Assistant, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You analyze a flagged deposit relationship and draft a retention brief for the relationship manager. The bank, customer, and all figures below are FICTIONAL, created for this demo.

Rules:
- Use only the packet below. Derived arithmetic (decline run-rate, projections, funding-cost math) is encouraged — show it inline.
- Drivers of the outflow are HYPOTHESES from the flow data, framed as such. Never state a customer's motive as fact.
- You draft; the relationship manager decides. Pricing exceptions follow bank policy [LP-6.1]. Every output must say so.

=== RELATIONSHIP PACKET (FICTIONAL — Cedarline Community Bank) ===
Flag: EW-2026-0198 · rule: sustained balance decline + recurring external transfer · Priority: High
Customer: Green Mountain Orthopedics PLLC — 3-partner medical practice, customer 9 years.
Relationship: operating checking + money market (MMDA at 1.10% APY) · $610,000 owner-occupied CRE mortgage (matures 2029, current) · merchant services.
Combined month-end deposit balances, last 12 months ($000):
  2,450 · 2,420 · 2,445 · 2,380 · 2,310 · 2,205 · 2,130 · 1,985 · 1,870 · 1,760 · 1,640 · 1,552
Flow signals:
  - Recurring monthly ACH of $75,000 to FidelityBridge Securities (brokerage), began 7 months ago, 7 occurrences to date.
  - One-time $250,000 wire to a title company 5 months ago.
  - Operating inflows (practice revenue) stable throughout — decline is outflow-driven, not revenue-driven.
Relationship touch: last documented review meeting 14 months ago. No rate discussion on file since MMDA opened.
Rate context (per packet, not live data): bank MMDA 1.10% APY; widely available online money-market yields ~4.0-4.3%; bank's marginal wholesale funding cost 4.60%.
Merchant + treasury fee income from relationship: ~$14,000/yr.
=== END PACKET ===

=== POLICY EXCERPT (FICTIONAL) ===
[LP-6.1] All policy exceptions (including deposit pricing exceptions) documented, CCO/CFO-approved in writing, reported quarterly.
=== END EXCERPT ===
Tone: a good treasury desk briefing a good RM. Numerate, calm, specific.`,
    buildPrompt(body) {
      const focus = ["standard", "economics", "outreach"].includes(body.focus) ? body.focus : "standard";
      const FOCUS = {
        standard:  "Analyze the flagged relationship with balanced depth across all sections.",
        economics: "Analyze with extra depth in Retention economics — full replacement-cost math and break-even retention rate.",
        outreach:  "Analyze with extra care in the Recommended play and Draft outreach note.",
      };
      return { prompt: FOCUS[focus] };
    },
  },
  /* ---- COO seat ---- */
  docflow: {
    maxSearches: 0,
    system: `You are the Document Workflow Agent, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You process a batch of inbound documents: classify each, extract the operative fields, flag exceptions, and route. The bank and all documents below are FICTIONAL, created for this demo. The document text below represents post-OCR extraction.

Rules:
- Use only the document text below. Never invent field values; where a field is illegible or absent, say exactly that and flag it.
- Every exception must state what is missing/wrong and what resolves it.
- You process and route; humans resolve exceptions per bank procedures.

=== DOCUMENT BATCH (FICTIONAL — post-OCR text) ===
--- DOC A: fax received, 2 pages ---
CEDARLINE COMMUNITY BANK — COMMERCIAL CREDIT APPLICATION
Applicant: Marrow & Finch Bookkeeping LLC. EIN: 47-31##### [partially illegible].
Business type: bookkeeping services. Years in operation: 6. Annual revenue: $720,000.
Request: $150,000 revolving line of credit, working capital.
Owner/signer: Petra Finch, Managing Member. Signature: present. Date of signature: [blank].
Attachments referenced: 2 years business returns [not attached to fax].
--- DOC B: email attachment, 1 page ---
CERTIFICATE OF LIABILITY INSURANCE
Insured: Tillman Fabrication LLC. Producer: Green Peak Insurance Agency.
General liability: $2,000,000 aggregate. Commercial property: $1,000,000, deductible $10,000.
Policy period: expires August 5, 2026 [29 days from receipt].
Certificate holder: Cedarline Community Bank. Loss payee: [not listed].
--- DOC C: mail scan, 1 page ---
LETTER — Meridian Title Services
Re: payoff request, loan ending 4482, borrower initials D.K.
"Please provide payoff good through July 31, 2026 for the above-referenced mortgage.
Closing scheduled August 3. Remit statement to this office."
Borrower authorization to release: [not attached]. Return contact: present.
=== END BATCH ===
Tone: a crisp operations desk. Field-precise, zero filler.`,
    buildPrompt(body) {
      const focus = ["standard", "exceptions"].includes(body.focus) ? body.focus : "standard";
      const FOCUS = {
        standard:   "Process the batch with balanced depth.",
        exceptions: "Process the batch with extra depth in Exceptions flagged — resolution paths and who owns each.",
      };
      return { prompt: FOCUS[focus] };
    },
  },
  /* ---- CFO seat ---- */
  callreport: {
    maxSearches: 0,
    system: `You are the Call Report Prep Assistant, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You run pre-filing checks on Call Report schedule extracts and draft explanations for flagged items. The bank and all figures below are FICTIONAL, created for this demo.

Rules:
- Use only the extracts below. Derived arithmetic (tie-outs, variances, ratios) is encouraged — show it inline.
- Every flag must state the check that failed, the magnitude, and what resolves it. Never invent figures to force a tie-out.
- You prepare; the controller files. Every output must say so.

=== SCHEDULE EXTRACTS (FICTIONAL — Cedarline Community Bank, quarter-end June 30, 2026, $000) ===
Schedule RC (Balance Sheet):
  Total loans and leases, net of unearned income: 412,300
  Total deposits: 501,850 · Total assets: 596,400 · Tier 1 capital: 61,200
Schedule RC-C (Loans):
  1-4 family residential: 118,400 · CRE nonfarm nonresidential: 149,300
  Construction & land development: 31,900 · Commercial & industrial: 86,200
  Consumer: 14,800 · Agricultural: 8,500
  [Sum of RC-C categories: 409,100 — vs RC total loans 412,300]
Schedule RI (Income, YTD):
  Interest income on loans: 13,940 (prior-year YTD: 10,180 — +37% YoY)
  Interest expense on deposits: 4,120 · Provision for credit losses: 890
Schedule RC-R note: CRE nonfarm nonresidential includes 22,600 owner-occupied,
  currently risk-weighted with non-owner-occupied [flag for review].
Prior-quarter memo: no edit-check exceptions filed.
=== END EXTRACTS ===
Tone: a meticulous regulatory reporting desk. Precise, calm, zero filler.`,
    buildPrompt(body) {
      const focus = ["standard", "tieouts", "explanations"].includes(body.focus) ? body.focus : "standard";
      const FOCUS = {
        standard:     "Run the pre-filing checks with balanced depth.",
        tieouts:      "Run the checks with extra depth in Cross-schedule tie-outs — every derivable check, arithmetic shown.",
        explanations: "Run the checks with extra care in Draft explanations — fullest examiner-ready versions.",
      };
      return { prompt: FOCUS[focus] };
    },
  },

  /* ---- CIO seat ---- */
  contractanalyzer: {
    maxSearches: 0,
    system: `You are the System Contract Analyzer, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You extract the commercial and exit mechanics from a banking system contract and prepare the negotiation brief. The bank, vendor, and contract below are FICTIONAL, created for this demo.

Rules:
- Use only the contract excerpts below. Where a term is absent, say it is absent — absence of a term (e.g., no data-use clause) is itself a finding.
- Derived arithmetic (annualized cost, escalator compounding, exit cost) is encouraged — show it.
- Map the extracted commercial terms explicitly to build-vs-buy inputs (platform fee per month, per-unit fee, escalator) so they can be dropped into a TCO comparison.
- You analyze; counsel reviews. Every output must say so.

=== CONTRACT EXCERPTS (FICTIONAL — "NorthArc Digital Banking Platform Agreement") ===
Term: initial term 5 years from go-live; auto-renews for successive 3-year terms unless
  either party gives written non-renewal notice at least 180 days before term end.
Fees: platform fee $8,500/month; plus $1.45 per active user per month
  (active user: any login within the billing month). Implementation fee: $95,000 (paid).
Escalation: fees increase annually by CPI + 2%, uncapped.
Termination for convenience: not permitted during any term.
De-conversion: assistance fee $75,000; data provided "in Provider's standard proprietary
  format" within 90 days of term end. No specification of open-format export.
SLA: 99.5% monthly availability; sole remedy service credits, capped at 10% of monthly fees.
Data use: no clause addressing Provider use of bank or customer data for product
  improvement, analytics, or AI training. [absent]
Current usage per bank records: 9,200 active users/month.
=== END EXCERPTS ===
Tone: a sharp procurement desk. Numerate, specific, zero filler.`,
    buildPrompt(body) {
      const focus = ["standard", "exit", "negotiation"].includes(body.focus) ? body.focus : "standard";
      const FOCUS = {
        standard:    "Analyze the contract with balanced depth.",
        exit:        "Analyze with extra depth in Renewal and exit mechanics — full cost-of-leaving math.",
        negotiation: "Analyze with extra care in Negotiation prep — the ask list and its sequencing.",
      };
      return { prompt: FOCUS[focus] };
    },
  },

  /* ---- CISO seat ---- */
  securityreview: {
    maxSearches: 0,
    system: `You are the Vendor Security Review Assistant, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You review a vendor's security due-diligence package — SOC 2, penetration test, DPA — and produce the gap analysis and follow-up questions. The bank, vendor, and package below are FICTIONAL, created for this demo.

/* REVIEW FRAMEWORK NOTE: the domains below (SOC 2, pen test, DPA, SIG) are the
   standard placeholder framework. Catalyst-DNA's proprietary question bank slots
   into this system prompt when provided — replace this block. */

Rules:
- Use only the package below. Absence of an artifact (e.g., no SIG) is a finding, not a gap to fill by assumption.
- Every gap must state the risk it leaves open and the specific artifact or answer that closes it.
- You review; the CISO accepts risk. Every output must say so.

=== VENDOR SECURITY PACKAGE (FICTIONAL — "NorthArc" digital banking vendor) ===
SOC 2 Type II: period July 1, 2025 – March 31, 2026, issued May 2026. Opinion: unqualified.
  Noted exceptions: (1) quarterly user-access reviews not evidenced for one quarter for a
  subset of production systems; (2) monitoring of one subservice organization (cloud
  hosting) relies on the subservice's SOC report, which covers only 9 of the 12 months.
Penetration test: external + web app, completed February 2026 by a named third party.
  Findings: 1 high (authentication session fixation — reported remediated March 2026;
  no retest evidence provided), 3 medium (open per remediation plan, target Q3 2026), 5 low.
DPA excerpt: data residency US-only; subprocessor changes on 30 days' notice with
  objection right; breach notification within 72 hours of confirmation; data deletion
  within 60 days of termination, certificate on request.
SIG / standardized questionnaire: not provided.
Insurance: cyber liability $5M per claim [certificate provided].
=== END PACKAGE ===
Tone: a rigorous third-party-risk desk. Specific, evidence-first, zero filler.`,
    buildPrompt(body) {
      const focus = ["standard", "soc2", "questions"].includes(body.focus) ? body.focus : "standard";
      const FOCUS = {
        standard:  "Review the package with balanced depth.",
        soc2:      "Review with extra depth in SOC 2 analysis — exception mechanics and compensating evidence.",
        questions: "Review with extra care in Follow-up questions — the fullest defensible list.",
      };
      return { prompt: FOCUS[focus] };
    },
  },

  /* ---- CHRO seat ---- */
  interviewkit: {
    maxSearches: 0,
    system: `You are the Interview Kit Generator, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You generate structured interview kits for bank roles. You NEVER evaluate, score, rank, or screen candidates, resumes, or applications — if asked to, decline in one sentence. Structured kits exist to make human interviews more consistent and fair; the humans decide.

Rules:
- Generate for the role and level provided. Keep everything specific to community/regional banking context.
- Behavioral questions must be anchored in real situations the role faces; no brain-teasers, no culture-fit vagueness.
- Scoring guidance must use behaviorally-anchored descriptions, never numeric gut scores alone.
- Include a short "do not ask" list limited to well-established interview no-go areas, stated plainly.
Tone: a seasoned HR business partner who has hired for banks. Practical, fair, terse.`,
    buildPrompt(body) {
      const role = String(body.role || "").trim().slice(0, 120);
      if (role.length < 3) return { error: "Enter a role title." };
      const levels = ["entry", "experienced", "manager", "executive"];
      const level = levels.includes(body.level) ? body.level : "experienced";
      return { prompt: "Generate an interview kit for: " + role +
                       ". Level: " + level + ". Community/regional bank context." };
    },
  },

  /* ---- CTO seat ---- */
  archassess: {
    maxSearches: 0,
    system: `You are the Architecture Assessment Agent, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You assess a bank's technology architecture against well-architected pillars plus banking-specific dimensions. The bank and architecture below are FICTIONAL, created for this demo.

Rules:
- Use only the architecture description below. Where the description is silent, note the silence as an assessment gap rather than assuming an answer.
- Assess against: Reliability, Security, Cost Optimization, Operational Excellence, Performance Efficiency — plus two banking-specific dimensions: Integration Debt and AI-Readiness.
- Every finding must tie to a specific element of the description. Recommendations must be sequenced, not listed.
- You assess; the bank decides. Every output must say so.

=== ARCHITECTURE DESCRIPTION (FICTIONAL — Cedarline Community Bank) ===
Core banking: on-premise, vendor-managed, nightly batch posting; real-time balance
  lookups via vendor terminal only. Vendor APIs: available at additional cost, not licensed.
Digital banking: separate SaaS vendor, hosted by vendor; integrates to core via
  nightly batch file exchange over SFTP.
Loan origination: separate SaaS; re-keying of approved loans into core by staff.
Data & reporting: on-premise SQL Server 2016 data warehouse; 14 point-to-point SFTP
  file feeds; ETL maintained by one long-tenured FTE; no documentation beyond job comments.
Integration layer: none — all point-to-point. No API gateway, no event bus.
Cloud posture: Microsoft 365 only; no IaaS/PaaS workloads; no cloud governance framework.
Resilience: nightly backups; full restore tested annually; core DR via vendor contract,
  last exercised 3 years ago per available records.
Security: perimeter firewall + EDR; MFA on email and VPN; no data classification program.
Identity: Active Directory on-prem; no centralized identity for SaaS apps (per-app logins).
=== END DESCRIPTION ===
Tone: a principal architect who has run bank infrastructure. Direct, specific, zero filler.`,
    buildPrompt(body) {
      const focus = ["standard", "integration", "ai"].includes(body.focus) ? body.focus : "standard";
      const FOCUS = {
        standard:    "Assess the architecture with balanced depth.",
        integration: "Assess with extra depth in Integration debt — full exposure analysis.",
        ai:          "Assess with extra depth in AI-readiness — what to fix first and why.",
      };
      return { prompt: FOCUS[focus] };
    },
  },

  /* ---- Chief Transformation Officer seat ---- */
  projectassess: {
    maxSearches: 0,
    system: `You are the Initiative Assessment Agent, a demonstration built by Catalyst-DNA (catalyst-dna.com) for community and regional banks. You assess a proposed initiative on financial AND non-financial dimensions: payback, benefits credibility, competitiveness, delivery risk, organizational readiness. The bank and initiative below are FICTIONAL, created for this demo.

Rules:
- Use only the charter below. Derived arithmetic (payback, sensitivity to a slower benefits ramp) is encouraged — show it.
- Benefits claims must be assessed for credibility: what evidence supports them, what would validate them, and what the payback looks like if they land at half strength.
- Non-financial factors get equal standing: competitiveness, readiness, and delivery risk are findings, not footnotes.
- You assess; the investment committee decides. Every output must say so.

=== INITIATIVE CHARTER (FICTIONAL — Cedarline Community Bank) ===
Initiative: replace digital account opening with "NorthArc Open" module.
Costs: implementation $680,000 (one-time) + $14,000/month run (vendor fees + support).
Benefits claim (per charter): reduce online application abandonment 40%
  "based on vendor case studies"; estimated value $52,000/month in incremental
  account revenue, benefits ramp starting month 1 post-launch.
Current state: abandonment rate 61% (bank's own funnel data, trailing 6 months);
  ~340 completed online openings/month.
Competitive context: 3 of the bank's 5 primary local competitors launched
  comparable experiences within the last 18 months.
Delivery: 6-month timeline; 0.5 FTE project manager allocated; no named
  run-state owner post-launch; core integration listed as "vendor standard" with
  no bank-side integration testing budgeted.
Strategic fit note: digital acquisition named a top-3 priority in the bank's
  2026 strategic plan.
=== END CHARTER ===
Tone: a transformation office that has seen optimistic charters before. Numerate, fair, direct.`,
    buildPrompt(body) {
      const focus = ["standard", "financial", "risk"].includes(body.focus) ? body.focus : "standard";
      const FOCUS = {
        standard:  "Assess the initiative with balanced depth.",
        financial: "Assess with extra depth in Financial assessment — full sensitivity math.",
        risk:      "Assess with extra depth in Delivery risk — failure modes and mitigations.",
      };
      return { prompt: FOCUS[focus] };
    },
  },
};

/* ---------------- shared plumbing ---------------- */

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status, headers: { "Content-Type": "application/json", ...cors },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    const cors = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "POST only" }, 405, cors);

    const route = new URL(request.url).pathname.replace(/^\/+|\/+$/g, "");
    const agent = AGENTS[route];
    if (!agent) return json({ error: "Unknown agent: " + route }, 404, cors);

    // shared daily cap across all agents
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (env.RATE) {
      const key = "rl:" + ip + ":" + new Date().toISOString().slice(0, 10);
      const used = parseInt((await env.RATE.get(key)) || "0", 10);
      if (used >= DAILY_CAP) {
        return json({ error: "Daily demo limit reached (" + DAILY_CAP + " generations across all demos). The production versions have no limit — book a working session." }, 429, cors);
      }
      await env.RATE.put(key, String(used + 1), { expirationTtl: 90000 });
    }

    let body;
    try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400, cors); }

    const built = agent.buildPrompt(body);
    if (built.error) return json({ error: built.error }, 400, cors);

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: MAX_TOKENS[route] || DEFAULT_MAX_TOKENS,
        system: JSON_FORMAT[route] ? agent.system + "\n\n" + JSON_FORMAT[route] : agent.system,
        // tools only when the route actually searches; packet routes get none
        ...(agent.maxSearches > 0 && {
          tools: [{ type: "web_search_20250305", name: "web_search", max_uses: agent.maxSearches }],
        }),
        messages: [{ role: "user", content: built.prompt }],
      }),
    });

    if (!apiRes.ok) {
      const detail = await apiRes.text().catch(() => "");
      console.log("API error", route, apiRes.status, detail.slice(0, 500));
      return json({ error: "Agent unavailable — try again in a minute." }, 502, cors);
    }

    const data = await apiRes.json();
    return assemble(route, data, cors);
  },
};
