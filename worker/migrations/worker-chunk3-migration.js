/* ============================================================
   CHUNK 3 WORKER MIGRATION — agents-worker.js patch module
   Routes: docflow · contractanalyzer · securityreview · archassess
   Companion to chunks 1-2 — same apply pattern:
   1. Merge these entries into CONTRACT_META and JSON_FORMAT.
   2. Replace each route's "Output format — markdown" block with
      its JSON_FORMAT string (Rules above it unchanged).
   3. Merge the validators into tryParseContract()'s checks map.
   chunk1Assemble() handles any route in CONTRACT_META unchanged.

   DESIGN LAWS ENFORCED IN VALIDATORS:
   - docflow: a null field value without an exception object is
     REJECTED — "never guesses" as a type constraint.
   - securityreview: any grade/score/band token in the payload is
     REJECTED — the forbidden-scale rule as code.
   - archassess: a sequence entry without dependency data is
     REJECTED — no flat wish lists.
   ============================================================ */

/* ---------------- merge into CONTRACT_META ---------------- */

const CONTRACT_META_CHUNK3 = {
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
};

/* ---------------- merge into JSON_FORMAT ---------------- */

const JSON_FORMAT_CHUNK3 = {

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
};

/* ---------------- merge into tryParseContract() checks ---------------- */

const CONTRACT_CHECKS_CHUNK3 = {
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
};

/* ---------------- prompt patch notes per route ----------------

docflow         : keep Rules incl. "illegible → exception, never a guess" (now a type law);
                  delete section specs; append JSON_FORMAT_CHUNK3.docflow.
                  max_tokens → 3000 (three docs × field grids).
contractanalyzer: keep Rules incl. "absence is a finding"; delete section specs;
                  append JSON_FORMAT_CHUNK3.contractanalyzer. max_tokens 2800.
securityreview  : keep Rules incl. the no-scoring rule (now regex-enforced);
                  delete section specs; append JSON_FORMAT_CHUNK3.securityreview.
                  max_tokens 2800.
archassess      : keep Rules incl. dependency-order; delete section specs;
                  append JSON_FORMAT_CHUNK3.archassess. max_tokens 3000.

After this chunk: 11 of 14 routes on contracts. Chunk 4 closes it out:
projectassess, interviewkit, policyqa.
============================================================ */
