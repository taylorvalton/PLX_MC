# MRP REFERENCE — Internal Operations Surface

> Sibling document to `REFERENCE.md` (which covers the customer Portal).
> Indexes every MRP design artifact: what it covers, what's mock, what's
> production-shaped.

The **MRP** suite (Manufacturing Resource Planning) is the internal
operations surface PLX staff use to move a project through its lifecycle
— from intake through pre-quote, formulation, sample pours, BOM lock,
assembly, and pack-out. It is **not** customer-facing. It shares the
brand token layer (see `decisions/ADR-002-surface-architecture.md`) but
has its own component vocabulary and information density.

---

## How MRP relates to Portal

| Aspect | Customer Portal | MRP (Internal Ops) |
|---|---|---|
| Audience | Brand owners signing formulations | PLX product devs, formulators, operators |
| Density | Editorial — generous whitespace, one decision per screen | Instrument-panel — many decisions per screen, tabular |
| Chrome | Single project at a time | Multi-project workbench, live ops strip |
| Type voice | Mazius Display headings, Inter body | Mazius accents only; mostly mono + sans |
| Token source | `tokens.css` | `tokens.css` (via `@import` after ADR-002) |
| Component sheet | shadcn + brand variants | `mrp/styles.css` (this surface's classes) |

MRP dashboard project cards are dense workbench list rows. Use Inter for
active-project titles and subtitles; reserve Mazius for module headings,
hero/stat numerals, true phase/project identity accents, and glyph marks.

---

## How to read the artifacts

Each MRP screen in the SharePoint bundle is a self-contained HTML file at
the project root that imports `mrp/styles.css` (and sometimes
`mrp/prequote.css`). In this repo, those files are visual specs, not runtime
source. The CSS class names (`.topbar`, `.opstrip`, `.projcrumb`, `.phaserail`,
`.workspace`, `.modhead`, `.pill`, `.btn`) are **the canonical names**
production should use. Match them in the production component library
when you build the React equivalents.

The React component scripts in `mrp/*.jsx` are mock-data implementations
written for the design artifacts. **Do not lift them into production
verbatim** — they hard-code data shapes that production will source
from real models. Lift the *layout patterns* and *class structures*.

---

## The artifacts (in production order)

### 1. `MRP Workbench.html` — Multi-project workbench

**Stage:** All — this is the persistent shell. Every other screen
loads inside this chrome.

**What it covers:**
- The standard top chrome: `.topbar` (brand mark, workspace switcher,
  module nav, search, user avatar), `.opstrip` (live KPIs strip).
- Project crumb (`.projcrumb`) — the *which project am I in* identity bar.
- Project context bar (`.projctx`) — team avatars, flag count with
  severity bars, last activity, with a hover-revealed flag drop-down.
- Phase rail (`.phaserail`) — 8-stop pipeline visualizer across two
  parallel tracks (formulation + packaging).
- The two-column workspace (`.workspace` → `.sidebar` + `.mainpane`).

**What's mock:**
- Project list (`PLX-2614`, etc.) and KPI values.
- Flag list (severity, codes, titles).
- Team roster + presence dots.

**What to lift:**
- The exact chrome stack. This is the production shell signature.
- The flag-severity sidebar pattern (`.flagrow` with code/title/severity columns).

---

### 2. `MRP Pre-Quote.html` — Stage 02 · Pre-Quote / Go–No-Go

**Stage:** 02 — early triage before commitment.

**What it covers:**
- Pre-quote intake review (specs, target margin, feasibility flags).
- Go/no-go decision affordance.
- Imports the supplemental `mrp/prequote.css` for one-off layout
  primitives specific to this stage.

**What's mock:**
- All feasibility data and pricing.

**What to lift:**
- The go/no-go decision pattern.
- `mrp/prequote.css` is a candidate for promotion into `mrp/styles.css`
  once a second screen reuses any of its primitives. Until then, keep
  it scoped.

---

### 3. `MRP Product Development.html` — Stage 03 · Develop

**Stage:** 03 — formulation lock; ingredient and phase architecture.

**What it covers:**
- Formulation table (phases, ingredients, percentages).
- The formulation-side editing experience.

**What's mock:**
- All ingredient rows, percentages, supplier links.

**What to lift:**
- The phase-grouped ingredient table layout.
- How the right rail surfaces ingredient detail without leaving the
  master table.

> Note: this file's `<title>` is "PLX MRP — Product Development" but it
> is distinct from `MRP Workbench.html` which uses the same title. Treat
> Workbench as the shell, Product Development as the active module.

---

### 4. `MRP Sample Pour.html` — Stage 04 · Develop · Sample · pour

**Stage:** 04 — pours, panel evaluation, ship/track.

**What it covers:**
- Sample stream tabs (`.sp-streams`) — bulk pour vs. packaging vs. all,
  with running counts and side-by-side toggles.
- 8-stop status pipeline within the sample stage (`.sp-pipeline`).
- The pour log table, panel feedback summary, ship/track sub-track.

**What's mock:**
- All pour rows, panel scores, ship records.

**What to lift:**
- The two parallel sub-tracks (bulk + packaging) joining at FG approval.
  This is a key information-architecture decision; production must
  model it the same way.
- The `.sp-modhead` pattern (kicker + display headline with italic
  accent fragment + sub-line) — this is the MRP module-head signature.

**Versions:** the current SharePoint bundle contains the canonical exported
file as `MRP Sample Pour.html`. Older design iterations are excluded from the
canonical bundle.

---

### 5. `MRP BOM Dossier.html` — Bill of Materials dossier (B-PT-00234)

**Stage:** Output of Stage 03 → input to Stage 05.

**What it covers:**
- The locked, citable BOM document for a specific project (here
  `B-PT-00234 · Niacinamide 5% Renewal Serum`).
- Sectioned: header/identity, ingredient table, totals, signatures,
  appendix.

**What's mock:**
- All ingredient rows and identifiers.

**What to lift:**
- This is the **internal counterpart** to the customer Sign-off Deed
  (`portal-signoff.jsx`). The two documents share the same source data
  but with different framings: BOM Dossier is for ops; the Deed is for
  the brand owner. Match the data model so both can render from the
  same upstream record.

---

### 6. `MRP Assembly Dossier.html` — Pack-out assembly dossier (A-PT-00234)

**Stage:** 05 · Pack-out.

**What it covers:**
- Pack-out instructions, components, sequence, QC checks.
- Lot tracking, packaging artwork references.

**What's mock:**
- All pack-out detail.

**What to lift:**
- The BOM-dossier sibling pattern: identity + numbered procedure +
  attestation/sign-off block.

---

### 7. `MRP Design Process Flow.html` — Process flow diagram

**Stage:** All — this is a planning/reference artifact.

**What it covers:**
- A schematic of the full PLX product development process flow.
- Stages, sub-tracks, decision gates, document outputs.

**What's mock:**
- The diagram is illustrative; the production system enforces flow
  via state machines, not a diagram.

**What to lift:**
- Treat as the **canonical reference map** for which stage produces
  which document, and where parallel tracks converge. Use this when
  modeling project state transitions in the backend.

---

## Component scripts (`mrp/*.jsx`)

These are React mock implementations the design artifacts use. They are
**not production code**, but they tell you what the production
components should be called and what they're expected to render.

| Script | Production component name | Purpose |
|---|---|---|
| `mrp/formulation.jsx` | `<FormulationTable>` | Phase-grouped ingredient table for Stage 03. |
| `mrp/assembly.jsx` | `<AssemblyLayout>` | Pack-out workspace shell. |
| `mrp/assembly-dossier.jsx` | `<AssemblyDossier>` | Locked pack-out document. |
| `mrp/dossier.jsx` | `<BOMDossier>` | Locked BOM document. |
| `mrp/intake.jsx` | `<IntakeForm>` (internal view) | PLX-staff intake/review. |
| `mrp/intake-customer.jsx` | `<IntakeCustomer>` (customer panel) | Customer-facing intake summary inside ops. |
| `mrp/prequote.jsx` | `<PreQuotePanel>` | Stage 02 go/no-go. |

When you port, copy the **structure and class names**, never the data.
The mock data is illustrative.

---

## What's NOT specified for MRP

Same out-of-scope notes as Portal apply, plus:

- **Stage 01 (Intake)** — partially designed via `mrp/intake.jsx` and
  `mrp/intake-customer.jsx` but no dedicated HTML spec exists. Treat as
  next-design-pass when you reach it in the migration plan.
- **Stage 06+ (post-pack-out: warehouse, logistics, returns)** — not
  designed. Use current internal tooling until designed.
- **Mobile / tablet** — the bundle prototypes include responsive behavior,
  but production MRP remains workstation-first. Preserve existing staff mobile
  navigation where it already exists; do not invent full phone workflows for
  dense MRP tables until a field-use case is confirmed.
- **Dark mode** — `tokens.css` defines dark values that flow through to
  MRP, but no MRP screen has been audited under dark mode. The bones
  should work; verify before shipping a dark toggle.
- **Real-time collaboration cursors** — the team avatars hint at presence
  but no live-cursor system is designed. v1 follow-up.

---

## Sign-off

When the MRP migration ships its token/chrome phase in this repo, update this
file's status header. Until then, the artifacts and the production code may
both legitimately claim to be "the spec."
