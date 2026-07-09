/* ============================================================
   CHUNK 2 WORKER MIGRATION — agents-worker.js patch module
   Routes: callreport · amltriage · regmonitor
   Companion to worker-chunk1-migration.js — same apply pattern:
   1. Merge these entries into CONTRACT_META and JSON_FORMAT.
   2. Replace each route's "Output format — markdown" block with
      its JSON_FORMAT string (Rules above it unchanged).
   3. Merge the validators into tryParseContract()'s checks map.
   chunk1Assemble() already handles any route present in
   CONTRACT_META — no plumbing changes beyond the merge.

   RULING HONORED: callreport is the complete CFO contract.
   No board-narrative fields exist anywhere in this module (4b
   remains OUT per the Phase A locked ruling).

   DESIGN LAW: envelope.engagementOnly and envelope.gate are
   code constants below, never model output.
   ============================================================ */

/* ---------------- merge into CONTRACT_META ---------------- */

const CONTRACT_META_CHUNK2 = {
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
};

/* ---------------- merge into JSON_FORMAT ---------------- */

const JSON_FORMAT_CHUNK2 = {

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
};

/* ---------------- merge into tryParseContract() checks ---------------- */

const CONTRACT_CHECKS_CHUNK2 = {
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
};

/* ---------------- prompt patch notes per route ----------------

callreport: keep all Rules; delete the five "## …" section specs; append
            JSON_FORMAT_CHUNK2.callreport. max_tokens 2500 holds.
amltriage : keep all Rules INCLUDING the SAR-structure rule (now enforced by
            pillars+supports validation); delete the six section specs; append
            JSON_FORMAT_CHUNK2.amltriage. max_tokens → 3200 (chain + indexed narrative).
regmonitor: keep all Rules; delete the five section specs; append
            JSON_FORMAT_CHUNK2.regmonitor. max_tokens 2500 holds; maxSearches 4 holds.

Gate closers move from model output to envelope constants, verbatim, per Phase A.
After this chunk: 7 of 14 routes on contracts. Remaining for Chunks 3-4:
policyqa, docflow, contractanalyzer, securityreview, interviewkit, archassess,
projectassess.
============================================================ */
