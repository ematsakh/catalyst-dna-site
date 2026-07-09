# Catalyst-DNA: Unified Competitive & Design Playbook
## 14 Bank Executive AI Agents — Combined Analysis

This document merges two independent analyses of the same 14 agents: a competitor-and-cross-check playbook (feature/data/UX/workflow detail per incumbent, with implementable validation steps) and a design-differentiation review (a distinct work-surface metaphor per agent). Where the two agreed, the claim is stated once. Where they covered different competitors, the union is used. Where they conflicted, the conflict is resolved explicitly and noted. Nothing in this document contradicts another item in it.

---

## The three cross-cutting principles both analyses converged on

1. **Don't out-feature the incumbents — out-fit them for the lean community/regional bank ($1B–$50B assets).** The winning position is a bank-native orchestration layer with built-in evidence, approvals, and cross-checks — tuned to examiner expectations and small teams that need an immediate decision, not a long implementation. This is Catalyst-DNA's operator-built, horizontal-infrastructure wedge (Claude API, Azure Document Intelligence, Python, RAG), not a reskinned enterprise copilot.

2. **One shared trust layer, fourteen distinct work surfaces.** Every agent shares the same controls — data-point-level citations, freshness/as-of markers, confidence tags, policy version/effective dates, exception queues, human sign-off where required, and contradiction checks. But no two agents should look like the same chat window. Each gets its own named work surface (listed below). This is how the portfolio reads as one platform operationally while satisfying the "no reused wording or design elements" constraint.

3. **Every agent has three layers: a role-specific workbench, a visible evidence layer, and a gated action layer.** Agents must not stop at summarization when the incumbent already operationalizes the outcome. **Resolved tension:** the action layer pushes work into the next bank workflow (draft, route, flag, prep the filing) but is always **gated by explicit human approval**. For SAR filing and hiring decisions specifically, the agent never auto-files or auto-decides — it prepares and a human commits. This reconciles the "operationalize the outcome" push with the "human-in-the-loop / examiner-defensible" requirement.

**Forbidden lexicon and layout (portfolio-wide anti-copying rule).** No agent ships if its wording or layout is confusable with a named incumbent. Avoid: "built by bankers, for bankers," "Cognitive Banking," "Contextual Decision Intelligence," "AI Overlay," the rows-×-columns "Matrix" grid, A–F or 250–900 score badges, "alert to case to filing," "horizon scanning," "fact sheet / meta-model," "connected planning," "one search bar." Each agent's distinct work-surface metaphor (below) is the primary defense against look-alike design.

---

## Executive, relationship, finance, and credit agents

### 1. CEO Morning Brief / "BOSS" (CEO/President) — work surface: **executive signal stack**

**Top competitors:** AlphaSense (AI search across 500M+ business documents, dashboards, alerts, expert insights, sentence-level citations); S&P Capital IQ Pro (AI search/screening/document intelligence across filings, news, research, transcripts); Dataminr (real-time event discovery from 1M+ public sources, executive alerting, geospatial context). KlariVis is the community-bank BI analog (nightly deposit/loan/performance dashboards; the "morning dashboard" routine). Common workflow: watchlist → prioritized alert → summarized brief → drill to evidence → escalate. Dominant pattern: high-signal "top of day" overview with drillable citations, not a blank chat box.

**How to win:** Build a single dated, printable morning ledger that surfaces only the 5–7 issues that materially change today's operating posture, fusing four lanes no incumbent co-locates: (a) internal portfolio/deposit movement (public call-report + FDIC data in the demo), (b) local-market news geofenced to the bank's branch counties, (c) regulatory items filtered to the bank's charter/asset tier, (d) peer moves (nearby banks of similar asset size). Each card answers four things at a glance: *what changed, why it matters to this bank, recommended action, confidence.*

**Cross-checks:** source-freshness stamp per item; contradictory-source detection; peer-relevance scoring; "impact-to-this-bank" materiality gate that suppresses items below CEO-relevant thresholds (with the threshold shown and editable); flag any figure not reconciled against two sources as "unverified — desk check."

**Design differentiation:** narrative operating-memo format with an evidence-ledger sidebar; show the assembly pipeline ("compiled from N public sources at 6:03am") as a trust cue. Avoid KlariVis dashboard-grid aesthetics and the AlphaSense/S&P search-bar metaphor.

---

### 2. Banker Briefing (Chief Lending Officer) — work surface: **relationship canvas**

**Top competitors:** RelPro (relationship intelligence for commercial bankers — company/people search, leadership/funding-change alerts, prospecting workflow); nCino Banking Advisor (conversational banker copilot for portfolio management on the nCino platform); S&P Capital IQ Pro (borrower/industry intelligence from filings, transcripts, news). Common workflow: prospect selection → company/contact research → trigger-event review → meeting prep → follow-up. Dominant pattern: a briefing dossier, not a search page.

**How to win:** Put the borrower/prospect in the center of a meeting-ready canvas arranged around meeting-critical blocks: latest business signals, exposure snapshot, wallet/product gaps, upcoming maturities, likely credit needs, and three tailored "smart opener" talking points each with evidence attached. The defensible edge is blending external lender intelligence with the bank's own relationship data — which generic intelligence tools do not do. Support the dual audience (banker *or* the small-business owner prepping for the meeting), which none of the incumbents serve.

**Cross-checks:** reconcile prospect facts across ≥2 public sources and label single-source claims; verify contact recency and financial-statement staleness; surface existing exposure / conflict-of-interest if the prospect or affiliates already bank here; flag unresolved servicing issues, KYC gaps, and recent negative interactions before the meeting; timestamp every fact.

**Design differentiation:** briefing-card layout (person/company → situation → opportunities → risks → talking points) that prints to one page; a 90-second "read-aloud prep" mode. Avoid the rows-×-columns grid and search-first UI.

---

### 3. Deposit Attrition Early-Warning (Chief Banking Officer / CFO) — work surface: **retention radar**

**Top competitors:** Alkami (digital-banking data stack with silent-attrition detection and at-risk interventions); Personetics (transaction intelligence and personalization driving deposit growth/retention; embedded in the consumer app); BlastPoint (predictive AI for retail deposit/relationship growth using behavior + geospatial insight). KlariVis is the community-bank analog that *shows* customer-level outflow (nightly balance-change dashboards). Shared data: transaction/deposit patterns, digital engagement, segmentation, footprint context. Shared workflow: risk-score → segment → recommended outreach → campaign → measure.

**How to win:** Avoid a static churn list. Plot households/businesses on an attrition-probability × franchise-value radar, and — the wedge no deposit dashboard ships — attach **funding-cost math** to each at-risk relationship: replacement cost = wholesale/brokered spread × balance at risk × expected duration, shown as a glass-box formula so the RM and CFO see the dollar stakes. Separate "who is leaving" from "what to do next," with one-click playbooks (branch outreach, pricing review, treasury outreach, direct-deposit/bill-switch retention). Order the queue by dollars-at-risk, not alert count.

**Cross-checks:** distinguish true attrition from benign patterns (tax, payroll, seasonal draws) via a labeled pattern library with the reasoning shown; validate the flagged balance against the prior 90-day baseline; require the funding-cost formula to display its editable wholesale-spread input; fairness/proxy-bias screen on any segmentation; holdout-control framework so the bank can prove lift; escalate only above a configurable materiality threshold.

**Design differentiation:** a per-relationship "retention brief" — outflow signal, funding-cost-at-risk as a formula, recommended play, call script. Avoid Personetics "Cognitive Banking"/next-best-action consumer language and the dashboard-grid.

---

### 4. Call Report Prep / Board Narrative (CFO) — **two jobs, two surfaces** (resolves the blur)

**Resolved contradiction:** the two source analyses treated this differently — one as regulatory *schedule close*, one as *board-narrative generation*. These are genuinely different jobs with different competitors and different UIs, so the merged design splits them into two modes under one CFO agent.

**4a. Schedule-close control — work surface: schedule close board.** Competitors: FedReporter SmartCall (syncs with the FFIEC Central Data Repository; streamlined bank-specific Call Report), Regnology (AI-powered regulatory reporting, straight-through ambitions), Wolters Kluwer OneSumX (integrated data repository, lineage, validations, four-eyes, submission). Workflow: ingest → populate schedules → edit-checks/variance review → sign-off → submit. Winning move: a quarter-end control room where each schedule carries visible status, source-system tie-out, prior-quarter variance flag, owner tag, and attestation checkpoint. Cross-checks: GL-to-schedule reconciliation, cross-footing, prior-period variance tolerance, source lineage, unresolved regulatory-change prompts, four-eyes certification, locked submission history.

**4b. Board-narrative generation — work surface: narrative + evidence (two-pane).** Competitors: Workiva (connected reporting; data-to-narrative linking, source-to-sign-off lineage, secure GenAI drafting), Abrigo (community-bank regulatory/financial suite), OneSumX (regulatory calc + lineage). Winning move: auto-draft NIM-movement explanation, ALCO briefing text, and variance commentary where every sentence links to the GL line/ratio that drives it, with a rate/volume/mix variance bridge. Cross-checks: a tie-out panel reconciling every number in the narrative to source financials (flag anything that doesn't foot); the variance bridge must reconcile to total NIM change before the narrative generates; a prior-period consistency check flagging claims that contradict last quarter's board pack. Output into the bank's own board-deck template — not a proprietary doc environment.

**Design differentiation:** the two modes look different on purpose (a status control board vs. a prose+evidence pane). Avoid Workiva's "connected reporting"/"source to sign-off" phrasing.

---

### 5. Credit Memo (Chief Credit Officer) — work surface: **underwriting argument map**

**Resolved tension:** one analysis leaned on memo *generation*; the other warned against the generic "auto-write my memo" pattern. Resolution: generate the memo, but structure it as an argument map with a mandatory stress/devil's-advocate lens — satisfying both.

**Top competitors:** nCino Credit Analysis (pulls platform data into an institution-specific template; spreading + forecast), Moody's Lending Suite / Credit Memo (automated spreading, scoring, approval workflow, GenAI memo generation), Abrigo Sageworks (standardized memos, risk-rating docs, controlled workflow with audit trail). Aloan is the community-bank AI-native benchmark that set the bar on **data-point-level source citations with override history** and examiner-ready trails. Common inputs: borrower financials, relationship data, collateral, risk ratings, policy rules. Common workflow: intake → spreading → analysis → memo → approval → archival.

**How to win:** Build the memo as a visible chain of claims → evidence → risks → mitigants → policy exceptions, so committee members see exactly how the conclusion was formed. Match Aloan's data-point citation + override history (now table stakes) and go further with a **"stress lens" toggle** that reframes the memo pessimistically and lists the 2–3 facts that would most weaken the credit. Make extracted figures and covenants into live monitoring objects for the portfolio early-warning follow-on. Offer a side-by-side "committee view" and "analyst workbench" so one engine serves both production and governance.

**Cross-checks:** global-cash-flow tie-out across all entities/guarantors with K-1 tracing shown; "does the math foot" reconciliation between spreads and memo; DSCR/LTV recomputed with inputs shown; missing documents raised as exceptions (never silent gaps); a policy-exception checker mapping each deviation to the specific credit-policy clause; a narrative-vs-numbers consistency test; statement-recency and covenant-conflict checks.

**Design differentiation:** an "evidence-linked memo" where each figure is a chip revealing source page and any override; a distinct stress-lens view. Avoid Abrigo's "one-click memo" framing and Aloan's exact "source-cited" wording. Output into the bank's own template.

---

## Risk and compliance agents

### 6. AML Alert Triage + SAR Narrative (CRO / BSA Officer) — work surface: **evidence chain**

**Top competitors:** Hawk (explainable AI transaction monitoring + AML Investigative Agent that gathers data, summarizes, identifies typologies, drafts SARs, supports QA), Unit21 (agentic L1 triage, unified fraud/AML entity model, SAR/CTR auto-fill, direct FinCEN/goAML submission, Continuing Activity Report tracking), Hummingbird (case management + structured SAR narrative templates), NICE Actimize (entity-centric AML, case management, investigation productivity). Common data: transactions, entity records, watchlists, prior investigations, external risk info. Common workflow: alert → enrich → typology review → investigate → SAR/CTR → QA/close.

**How to win:** For community banks stuck on legacy monitoring they can't rip out, position as an overlay/drafting agent, not a platform replacement. Present investigation as an evidence chain — a timeline + network view keeping facts, typology hypotheses, and recommended actions visibly separate. **Human sign-off is mandatory before any filing language is finalized (the agent never auto-files).** Win on SAR-narrative quality via a five-pillar completeness check (who / what / when / where / why + dollar amounts) and a fully explainable triage rationale that names the typology rule that fired.

**Cross-checks:** SAR-completeness validator that blocks finalization if any FinCEN-required element is missing; "no unsupported assertion" check tying every narrative sentence to underlying transaction rows; false-positive clear rationale citing the specific rule; duplicate-alert merge and prior-SAR similarity checks; sanctions/adverse-media corroboration; narrative-vs-facts consistency test; auto-suggested Continuing Activity Report timing; mandatory QA prompt before submission.

**Design differentiation:** an evidence-to-narrative workspace with the draft and the supporting transaction ledger side by side, each sentence highlighting its source rows. Avoid Unit21's "alert to case to filing" tagline and Hawk's "AI Overlay" language. Sell "works on top of your existing monitoring" + "every SAR sentence traces to a transaction."

---

### 7. Regulatory Change Monitor (Chief Compliance Officer) — work surface: **obligation heatline**

**Top competitors:** Ascent (regulatory lifecycle — scanning, obligations inventory, rule-compare/redline, impact analysis, GRC integration), Corlytics (regulatory content in original language + redline compare + no-code workflow engine), Compliance.ai (expert-in-the-loop ML, obligation extraction, task assignment), CUBE (obligation management, regulatory inventory mapping, ontological classification), 360factors Predict360 (change tracking, impact evaluation, executive view). RegAlytics is the transparent-priced data feed (8,000+ agencies). Common workflow: ingest text → classify/profile relevance → map obligations → assign owners → manage remediation → report.

**How to win:** The incumbents excel at global *breadth* — overkill for a US community bank. Win on precision-for-my-charter: monitor only the regulators that matter (OCC/FDIC/Fed/CFPB/state) and deliver a "what-changed / so-what / now-what" translation per item — which of *this* bank's products/policies/procedures it hits, who owns the response, and a drafted action item — rather than raw text or a normalized alert. Show what is new, when it's effective, which policies/controls are affected, and where the bank has no mapped owner.

**Cross-checks:** every item links to primary-source rule text and effective date; charter/product-scoped relevance filter with reasoning shown; supersedes/duplicate-obligation collapse; jurisdiction-applicability check; policy/control mapping-completeness gate; a gap-catcher that flags agency guidance-page edits made without a formal release (the blind spot of feed-based tools); side-by-side legal-vs-compliance interpretation when reviewers disagree.

**Design differentiation:** a three-column "what-changed / so-what / now-what" card per item with primary source one click away; a printable compliance-committee digest. Avoid Ascent's "horizon scanning" and Corlytics's "regulation actioned" language. Live public-data demo (Federal Register / agency feeds).

---

## Operations and technology agents

### 8. Document Processing Workflow (COO) — work surface: **ops conveyor**

**Top competitors (installed base a community bank already runs):** Hyland OnBase, Laserfiche, M-Files (content capture + workflow automation + audited routing + retention; used for onboarding, collateral, insurance, escrow). **IDP specialists to benchmark the extraction layer against:** Ocrolus (lending-focused IDP, confidence-scored consistency checks, human-in-the-loop) and Hyperscience (field-level confidence-based routing — only uncertain fields go to reviewers). Common workflow: capture → classify → route → review/approve → archive. Winning design elements incumbents rely on: inboxes, queues, SLA visibility, status transparency.

**How to win:** Make it a throughput/bottleneck/package-completeness conveyor: instantly show which packages are missing documents, stuck in review, missing signatures, or aging past SLA, and have the agent actively chase missing items. Honor the core rule — **illegible fields become exceptions, never guesses** (match Hyperscience's field-level routing) — and add banking-specific validators the horizontal tools don't ship: insurance-certificate checks (coverage type/limits/expiry/named-insured vs. the loan requirement) and payoff-authorization checks (payoff figure, good-through date, authorized signer). Build the extraction layer on Azure Document Intelligence with agentic validation on top.

**Cross-checks:** per-field confidence gate routing anything below threshold to a human-review exception with the raw image snippet attached (never a guessed value); package-completeness test; cross-document consistency (name/address/amount agreement across the packet); duplicate-file and missing-metadata checks; insurance-cert validator flagging coverage gaps/expired dates; payoff-authorization validator checking good-through date against funding date; retention-category correctness; reviewer-has-authority check.

**Design differentiation:** an "exception ledger" per document — what was extracted with confidence, what was routed as an exception and why, the source image inline. Reinforces "we flag, we don't fabricate." Avoid Ocrolus "queue-based validation" and "straight-through processing" phrasing. Position as "post-OCR intelligence on your OCR of choice," not a rip-and-replace capture platform.

---

### 9. System Contract Analyzer (CIO) — work surface: **contract x-ray**

**Top competitors:** Ironclad (AI across the full contract lifecycle — Assistant that finds/answers/acts, Renewal agent), Icertis (contract intelligence — obligations, deadlines, risk clauses, financial terms, RiskAI), LinkSquares (repository search, OCR, clause analytics, 100+ data-point extraction), Evisort/Workday (proprietary contract LLM, cited clause Q&A, renewal management). Common workflow: ingest → extract → compare → negotiate → execute → track obligations.

**How to win:** Specialize in the bank vendor/system contract — core-banking (Fiserv/FIS/Jack Henry), digital banking, and software agreements — with a role-specific x-ray that surfaces only the clauses a CIO cares about: data-use rights, uptime/SLAs, audit rights, information-security commitments, subcontractor language, renewal/termination windows, change-of-control, source-code escrow, exit/de-conversion obligations. Build a bank-core-contract obligation library the horizontal tools lack. Offer a "show me everything that breaks our standard" mode.

**Cross-checks:** a renewal/termination-window calendar computing the notice deadline and days-remaining, flagging anything inside the window; a cost-escalator extractor projecting fee increases over the remaining term; a de-conversion-risk check specific to core contracts (data-egress fees, transition-services terms); comparison of clauses against the bank's security/architecture/data-residency standards and vendor criticality; every extracted term links to the exact clause and page.

**Design differentiation:** a "contract obligation ledger" organized by risk category (cost / exit / renewal / liability / security) with a deadline timeline, plus a one-page "renewal decision brief" per contract. Avoid Ironclad's "finds/answers/acts" and Evisort's "Ask AI" naming.

---

### 10. Vendor Security Review (CISO) — work surface: **control confidence ladder**

**Top competitors:** Ncontracts/Venminder (dominant community-bank TPRM — questionnaires, expert control assessments, Venmonitor continuous monitoring, contract tracking, exam-ready reports to Interagency Guidance), SecurityScorecard (A–F ratings, findings + remediation, TITAN AI questionnaire automation), UpGuard (continuous vendor insights, assessments, ratings, AI workflows), Black Kite (real-time multi-source standards-based cyber risk + nth-party visibility), BitSight (breach-correlated 250–900 ratings). Common workflow: vendor tiering → questionnaire/evidence collection → external validation → remediation → continuous monitoring.

**How to win:** Replace the flat scorecard with a control confidence ladder: for each control domain, show whether the bank's view rests on self-attestation, verified evidence, external telemetry, or a combination — a more defensible risk statement than a single score. The wedge: an agent that **reads the vendor's actual evidence** (SOC 2 Type II, pen-test summaries, questionnaire responses) and auto-validates claims against the report contents, producing a written, examiner-facing assessment mapped to FFIEC/GLBA. Fold in contract obligations, criticality tier, and internal architecture dependency so the CISO sees what matters to *this* bank.

**Cross-checks:** a SOC 2 analyzer extracting audit period, scope, exceptions/qualified opinions, and CUECs, flagging stale reports (>12 months) and carve-out subservice risk; a questionnaire-vs-evidence reconciliation flagging answers unsupported by the SOC 2; a fourth-party/concentration check; expired-evidence and missing-remediation-proof checks; mismatch detection between a vendor's stated controls and the bank's required minimums; citation to the exact SOC 2 page per finding.

**Design differentiation:** a "due-diligence findings brief" — narrative risk conclusion, evidence citations, required-remediation list — not a score badge. Avoid SecurityScorecard's A–F letter grade, BitSight's 250–900 scale, and Venminder's "control assessment" phrasing. Sell "reads the SOC 2 so your one-person infosec team doesn't have to."

---

### 11. Architecture Assessment (CTO) — work surface: **dependency atlas**

**Top competitors:** SAP LeanIX (application portfolio assessment, automated discovery, capability mapping, tech-debt/obsolescence visibility, AI-assisted redundancy insights), Ardoq (connected mapping of processes/capabilities/people/IT with dashboards), Bizzdesign (EA + APM aligning strategy/architecture/operations, showing owners/costs/lifecycle risk). Common workflow: inventory → map relationships → assess risk/cost/fit → identify change scenarios → roadmap.

**How to win:** These are heavyweight platforms built for a dedicated EA team a community bank doesn't have. Deliver a point-in-time dependency atlas the small IT shop can run without maintaining an EA repository: enter through a business capability, customer journey, or application and immediately see concentration risk, unsupported/EOL technologies, duplicate apps serving the same capability, resilience bottlenecks, and change blast radius — tuned to banking systems (core, digital, payments rails, BSA/AML). Output a standalone board/CTO deliverable, not an ongoing platform commitment.

**Cross-checks:** reconcile architecture records against CMDB/discovery data; EOL/obsolescence check against known product-lifecycle dates with source noted; core-provider concentration flag; resilience check for systems with no documented failover; duplicate-capability detection; policy-exception exposure; verify proposed remediation timelines match business criticality; flag incomplete inventory rather than assuming coverage; every finding cites the inventory item and the evidence for its risk rating.

**Design differentiation:** a "current-state architecture assessment report," risk heat-mapped, with a prioritized remediation roadmap. Avoid LeanIX's "fact sheet"/"meta-model" vocabulary and the persistent-repository model. Sell "assessment as a deliverable, not a platform subscription."

---

### 12. Initiative / Project Assessment (Chief Transformation Officer) — work surface: **investment jury**

**Whitespace flag:** there is no banking-software incumbent here — the job is owned by consultants (Cornerstone Advisors, CCG Catalyst) today. This is Catalyst-DNA's clearest greenfield agent. Closest software comparables: Planview (strategic portfolio management, NPV sensitivity, NPV/IRR/payback ranking, what-if scenarios), ServiceNow SPM (strategy-to-outcome alignment, intake, investment assessment), IBM Apptio Targetprocess (objectives-to-execution line of sight, investment optimization), Anaplan (real-time scenario/sensitivity modeling — but explicitly "not the greatest fit for midsize or small businesses" and requires specialized modeling skill), and My Business Case Hub (AI-native NPV/ROI/payback + scenario/sensitivity + auto board decks, but no ERP integration and not banking-specific). Common workflow: intake → strategic scoring → capacity/dependency review → scenario planning → funding/execution tracking.

**How to win:** Frame each initiative as "tried" before an investment jury across the dimensions a bank actually decides on — strategic fit, regulatory necessity, customer impact, operational resilience, dependency load, capacity reality, payback confidence — and model impact in **bank math** (efficiency ratio, NIM, regulatory capital), not generic corporate ROI, benchmarked against peer call-report data. The value is making trade-offs explicit and replacing a consulting engagement with an operator-built agent.

**Cross-checks:** a tornado/sensitivity panel showing the 2–3 assumptions that most drive NPV, with editable ranges; a regulatory/capital-impact check flagging initiatives affecting capital ratios; base/upside/downside scenarios reconciling to the same cost inputs; resource-realism and benefit-double-counting tests; hidden-dependency and change-fatigue-overlap checks against other initiatives; a "measurable post-launch success metric" gate rejecting vague transformation language; flag unsupported assumptions as "estimate — validate."

**Design differentiation:** an "initiative viability brief" — recommendation, financial base case, the tornado of key sensitivities, regulatory-capital note, go/refine/kill call — as a board-ready one-pager with interactive sliders on the top 2–3 drivers. Avoid Anaplan's "connected planning" and Planview's "strategic portfolio" vocabulary.

---

## People and knowledge agents

### 13. Interview Kit / Resume Assessment (CHRO) — work surface: **structured interviewer cockpit**

**Top competitors:** Greenhouse (structured interviewing — interview kits, scorecards, competency-tied question sets), Workday Recruiting (structured scorecards, coordination, process automation), Ashby (interview plans, rubrics, interviewer briefings, AI note-taking). HireVue is the enterprise AI-hiring incumbent (structured guides, video interviewing, AI content scoring) — benchmarked but deliberately *not* imitated. Common workflow: role calibration → interview plan → interviewer briefing → feedback capture → debrief. Dominant pattern: a structured scorecard with interviewer guidance.

**How to win:** For low-volume community-bank hiring, deliver a hiring-manager cockpit: from a resume + job description, generate the competencies to test, role-approved questions with follow-ups, "what good vs. weak evidence sounds like," and a note area organized by competency (not free text) — plus a structured, evidence-cited resume assessment for banking roles (lender, BSA analyst, teller-ops, credit analyst). The differentiator vs. enterprise tools is **strong governance for institutions without mature recruiting ops**, and a deliberate avoidance of video-scoring (an ethical and EEOC/state-AI-hiring-law risk the bank won't want). **The human makes the decision — the agent never auto-scores or auto-rejects.**

**Cross-checks:** resume assessment cites the specific resume line for each strength/gap (no unsupported inferences); a bias-guard that ignores protected-class proxies and documents that it did so (EEOC-defensible); a "claims to verify" list flagging assertions needing reference/background confirmation; a question-bank mapping each question to the requirement it tests; scorecard-completion, evidence-quality, and vague-feedback detection; adverse-impact monitoring by stage.

**Design differentiation:** a printable interview kit (structured guide + rubric + red-flag/verify list) plus a separate resume-assessment card. Avoid HireVue's game-based-assessment/video-scoring paradigm entirely.

---

### 14. Policy Q&A (Chief Data Officer) — work surface: **policy lane** ("layer zero")

**Top competitors:** Glean (permission-aware cited answers grounded in company knowledge, broad connectivity, governed rollout, audit trails), Moveworks (permission-aware enterprise search, cited answers, search-to-action), Posh Knowledge Assistant (purpose-built for banking — summarization, policy comparison, form location, drafting, workflow guidance, version-aware access). Hebbia is the citation-first document-reasoning benchmark. Common workflow: ask → retrieve permissioned source → cited answer → optional draft/route.

**How to win:** As the shared retrieval substrate the other 13 agents call, credibility rests on retrieval quality + citation trust + permissions. Don't chase Glean's connector breadth; win on bank-policy-specific grounding and governance: every answer shows the precise source excerpt, policy owner, version date, and any related policy conflict, with an escalation path when the query crosses a risk threshold. Answers must depend correctly on state, product, customer segment, role, or exception authority — and must say "not addressed in current policy — escalate" rather than infer.

**Cross-checks:** every answer cites document, section number, and version/effective date; a no-answer guardrail (escalate instead of guessing); a policy-conflict detector flagging contradictory guidance; permissions-aware retrieval so users see only entitled policies; a staleness flag when the cited policy is past its review date; a log when an answer is used to make an operational decision.

**Design differentiation:** a "policy answer with receipts" — the answer, then the verbatim quoted clause with a document/section/version chip and a coverage/confidence indicator. Avoid Hebbia's rows-×-columns grid and Glean's "one search bar" enterprise-search framing. Built on Catalyst-DNA's own RAG stack (Claude + vector store + Python), deployed in-tenant against the bank's policy corpus.

---

## Portfolio work-surface map (the anti-copying guarantee)

| # | Agent | Seat | Work surface |
|---|-------|------|--------------|
| 1 | CEO Morning Brief / BOSS | CEO/President | Executive signal stack |
| 2 | Banker Briefing | Chief Lending Officer | Relationship canvas |
| 3 | Deposit Attrition | Chief Banking Officer / CFO | Retention radar |
| 4a | Call Report Prep | CFO | Schedule close board |
| 4b | Board Narrative | CFO | Narrative + evidence (two-pane) |
| 5 | Credit Memo | Chief Credit Officer | Underwriting argument map |
| 6 | AML / SAR Triage | CRO / BSA Officer | Evidence chain |
| 7 | Regulatory Change Monitor | Chief Compliance Officer | Obligation heatline |
| 8 | Document Workflow | COO | Ops conveyor |
| 9 | System Contract Analyzer | CIO | Contract x-ray |
| 10 | Vendor Security Review | CISO | Control confidence ladder |
| 11 | Architecture Assessment | CTO | Dependency atlas |
| 12 | Initiative Assessment | Chief Transformation Officer | Investment jury |
| 13 | Interview Kit | CHRO | Structured interviewer cockpit |
| 14 | Policy Q&A | CDO | Policy lane |

Fourteen agents, fifteen surfaces (the CFO agent carries two modes), one shared trust layer — the portfolio reads as one platform operationally while no two surfaces share wording or design.

---

## Staged build plan

**Stage 1 — Build the shared evidence layer first.** Data-point-level citations, override history, confidence-scored exception routing, and as-of timestamps, common to all 14 agents. This is the single most repeated competitive frontier (Aloan, Hebbia, Workiva) and the cheapest way to read as production-grade. Benchmark: every material figure in every agent traces to a source in one click.

**Stage 2 — Ship the four whitespace differentiators.** Prioritize where "operator-built for community banks" wins fastest and no incumbent structurally competes: #12 Initiative Assessment (no software incumbent), #3 Deposit Attrition (funding-cost math no dashboard ships), #8 Document Workflow (banking-specific insurance/payoff validators), #10 Vendor Security (evidence-vs-claim SOC 2 validation).

**Stage 3 — Enforce anti-copying at design review.** Maintain the forbidden-lexicon-and-layout list per agent. No agent ships if its wording or layout is confusable with the named incumbent; the distinct work-surface metaphor is the primary defense.

**Thresholds that change the plan:** if a bank already runs Abrigo/KlariVis/Ncontracts, reposition overlapping agents as complements (e.g., the SAR drafter on top of existing monitoring) rather than replacements; if regulators tighten AI-model-risk explainability, accelerate Stage 1 (it becomes a selling point); if a vertical incumbent ships true data-point citations broadly, shift weight to the Stage 2 whitespace agents.

---

## Caveats

- **Two-source provenance.** This document merges a sourced competitor playbook with a design-differentiation review whose competitor claims were lighter on verifiable citations. Vendor capabilities are largely self-reported marketing claims; single-source metrics (e.g., engagement or false-positive figures) and "Leader" analyst positions are not independently verified. Re-verify specific product claims before any client pitch.
- **Concepts, not screens.** Both analyses worked from the agent concepts, not the actual mockup screens. Once the real mockups are in hand, map each recommendation to specific screen elements — several design differentiators (e.g., the exception ledger, the funding-cost formula, the stress lens) are concrete enough to check against the current build directly.
- **Fast-moving market.** AI features ship monthly across these categories; competitor capabilities cited here will drift.
- **Action-layer boundary is deliberate.** The gated-action design (draft/route/flag but human-commits, with no auto-file on SAR and no auto-decision on hiring) is a compliance choice, not a capability limit. Deployments touching SAR filing or hiring should be reviewed against FinCEN, EEOC, and applicable state AI-hiring laws.