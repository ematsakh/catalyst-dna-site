/* ============================================================
   BOSS TOKEN REMAP — Phase B closing patch
   Target: BOSS_Demo.html (React-in-Babel single file)
   Resolves: the Phase A compliance note — BOSS carried a local
   Tailwind light palette (#F8FAFC ground, #3B82F6 accent, plus
   emerald/amber/violet/red families) that violated the palette
   law by inheritance. This patch lands BOSS on the Catalyst-DNA
   token system WITHOUT touching component structure: the entire
   visual identity routes through the PALETTE constants block at
   the top of the file, so the remap is one block swap plus five
   literal-hex cleanups.

   APPLY:
   Step 1 — replace the "─── PALETTE ───" constants block
            (lines ~26-47) with the block below.
   Step 2 — apply the five literal-hex cleanups listed after it
            (scrollbar styles + two stragglers found outside the
            constants block).
   Step 3 — verify: grep for old hexes returns zero; visual pass
            confirms the dark register.

   REGISTER NOTE: BOSS was designed light; the token system is a
   dark register. The mapping below is a REGISTER INVERSION, not a
   hue swap — grounds map to dark surfaces, inks map to light text,
   and the semantic families (positive/caution/alert) map to the
   trust-layer status colors, killing the violet family entirely
   (no token equivalent; its two uses were decorative accents that
   map to accent-bright).
   ============================================================ */

/* ---------- Step 1: replacement PALETTE constants block ---------- */

// ─── PALETTE (catalyst-dna tokens · dark register) ──────────
const BG   = "#09090B";   // was #F8FAFC  → --bg-primary
const CARD = "#18181B";   // was #FFFFFF  → --surface
const SIDE = "#18181B";   // was #0F172A  → --surface (sidebar joins the surface plane)
const INK  = "#FAFAFA";   // was #0F172A  → --text-primary (register inversion)
const MID  = "#A1A1AA";   // was #475569  → --text-secondary
const LT   = "#6F6F78";   // was #94A3B8  → --text-tertiary
const BLU  = "#2E71E5";   // was #3B82F6  → --accent (the hex the tokens moved off)
const BLUD = "#6FA2F5";   // was #1D4ED8  → --accent-bright (dark register: hover LIGHTENS)
const BLUL = "rgba(46,113,229,.14)";  // was #EFF6FF → accent-dim wash
const BLUB = "#33415C";   // was #BFDBFE  → --border-active
const GRN  = "#4C9E7E";   // was #10B981  → --ok (trust-layer positive)
const GRNL = "rgba(76,158,126,.14)";  // was #ECFDF5 → --ok-dim
const GRNB = "#4C9E7E";   // was #6EE7B7  → --ok (border joins fill in dark register)
const AMB  = "#E0A43C";   // was #F59E0B  → --warn
const AMBL = "rgba(224,164,60,.14)";  // was #FFFBEB → --warn-dim
const AMBB = "#E0A43C";   // was #FCD34D  → --warn
const RED  = "#C4574E";   // was #EF4444  → --alert (trust-layer alert)
const REDL = "rgba(196,87,78,.14)";   // was #FEF2F2 → --alert-dim
const REDB = "#C4574E";   // was #FCA5A5  → --alert
const BDR  = "#27272A";   // was #E2E8F0  → --border
const RUL  = "#1F1F24";   // was #F1F5F9  → --surface-raised (rules/zebra rows)

/* ---------- Step 2: literal-hex cleanups outside the block ----------

2a. Scrollbar styles in the <style> head (three literals):
      ::-webkit-scrollbar-track  { background: #F1F5F9; }  →  background: #1F1F24;
      ::-webkit-scrollbar-thumb  { background: #CBD5E1; }  →  background: #27272A;
      ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }  →  background: #33415C;

2b. Violet family (#8B5CF6, two occurrences) — decorative module
    accents with no token equivalent. Replace both with BLUD
    (accent-bright). The violet family does not survive the remap.

2c. Amber-dark text (#92400E, three occurrences) — dark amber text
    on light amber chips. In the dark register the chip wash is
    already dim, so the text maps to AMB (#E0A43C) directly.

2d. #065F46 (emerald-dark text, one occurrence) → GRN (#4C9E7E),
    same logic as 2c.

2e. Any remaining #fff / #FFFFFF used as text-on-accent (e.g.
    button labels on BLU) stays #fff — text on accent buttons is
    white in both registers, matching the .btn token pattern.

---------- Step 3: verification ----------

  grep -c "#F8FAFC\|#3B82F6\|#0F172A\|#10B981\|#F59E0B\|#EF4444\|#8B5CF6\|#E2E8F0\|#94A3B8\|#475569" BOSS_Demo.html
  → must return 0.

  Then a visual pass on the four BOSS panes (brief, queues, saves,
  flags) confirming: dark ground, one accent family, status colors
  matching the trust layer, hover states lightening not darkening.

---------- Also applies to boss_demo.jsx ----------

The JSX source carries the same constants block at the same
location; apply Step 1 and cleanups 2b-2d identically. Fonts need
no change in either file (DM Sans already matches --font-body;
add Outfit for headings where fontWeight >= 600 in a follow-up
polish pass if desired — optional, not blocking).

---------- Why this closes the Phase A note ----------

The compliance note said: "Phase B chunk that touches the CEO
surface must remap BOSS onto these tokens before the BOSS surface
absorbs the ceobrief route." ceo-brief.html (Chunk 1) is the
contract-native signal stack; with this patch applied, BOSS and
the signal stack share one palette, one type system, and one
status vocabulary — the CEO can move between the demo surface and
the BOSS mock without a register break, and the fourteenth-seat
story ("it all rolls up into one operating picture") holds
visually.
============================================================ */
