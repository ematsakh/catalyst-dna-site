/* ============================================================
   CHUNK 4 WORKER MIGRATION — agents-worker.js patch module
   Routes: projectassess · interviewkit · policyqa
   FINAL CHUNK — after this merge, all 14 routes are on contracts.
   Same apply pattern as chunks 1-3:
   1. Merge these entries into CONTRACT_META and JSON_FORMAT.
   2. Replace each route's "Output format — markdown" block with
      its JSON_FORMAT string (Rules above it unchanged).
   3. Merge the validators into tryParseContract()'s checks map.

   RULINGS ENFORCED AS CODE:
   - interviewkit: no candidate/resume/score field exists in the
     schema; the validator REJECTS any payload containing
     candidate-evaluation vocabulary. The resume assessment exists
     only as describedCapability prose (the CHRO ruling).
   - projectassess: no composite score field exists; the validator
     REJECTS any blended-score vocabulary.
   - policyqa: answered:false is a FIRST-CLASS shape; the validator
     accepts either shape and rejects half-answers (answered:true
     without clauses, or answered:false without a noAnswer object).
   ============================================================ */

/* ---------------- merge into CONTRACT_META ---------------- */

const CONTRACT_META_CHUNK4 = {
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

/* ---------------- merge into JSON_FORMAT ---------------- */

const JSON_FORMAT_CHUNK4 = {

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

/* ---------------- merge into tryParseContract() checks ---------------- */

const CONTRACT_CHECKS_CHUNK4 = {
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

/* ---------------- prompt patch notes per route ----------------

projectassess: keep Rules incl. the two-ramp payback math; delete section specs;
               append JSON_FORMAT_CHUNK4.projectassess. max_tokens 2800.
interviewkit : keep Rules incl. the never-screens boundary (now regex-enforced);
               delete section specs; append JSON_FORMAT_CHUNK4.interviewkit.
               max_tokens 2800.
policyqa     : keep Rules incl. corpus-only answering; delete section specs;
               append JSON_FORMAT_CHUNK4.policyqa. max_tokens 2200.

MIGRATION COMPLETE after this merge: 14 of 14 routes on contracts.
Final assembled CONTRACT_META spans chunks 1-4; single Worker deploy throughout.
============================================================ */
