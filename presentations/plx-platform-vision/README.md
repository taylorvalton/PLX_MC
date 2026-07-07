# Handoff: PLX Platform Vision — Team Briefing Deck

## Overview
An 8-slide presentation deck, **"PLX Platform Vision — Where we're going,"** for a Petra Lab-X (PLX) engineering & ops team briefing. It explains the AI operating model: the new org chart, the layered AI-native stack, the three pillars (Mission Control, the Portal, Shared Context), how those stand on shared Infra, and the operating principles that govern the work.

The deck is authored in the **PLX Design System** (editorial / instrument-panel: warm paper, near-black ink, one rationed forest accent, hairlines over shadows, mono chassis labels). Design width is **1920 × 1080** per slide.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype that shows the intended look, copy, and slide behavior. They are **not** meant to be treated as a component library to import wholesale into a product app.

Two valid paths, depending on intent:
1. **Deploy as a presentation (most likely).** This IS a finished slide deck. It runs as-is in any modern browser — open `PLX Platform Vision.dc.html`. To host it (e.g. at `mc.plxcustomer.io/presentations/`), see **Running / Deploying** below. Nothing needs to be rebuilt.
2. **Recreate the layouts in a target codebase.** If these slides need to become live product screens or a React-based deck, recreate them in that codebase's existing environment (React/Vue/etc.) using its established patterns, pulling the design tokens and copy from this README. Do **not** ship the prototype's runtime as production app code.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and layout. Recreate pixel-for-pixel if rebuilding. All values are grounded in the PLX Design System token layer (`_ds/.../colors_and_type.css`).

## How the deck is built (architecture)
- **Single file:** `PLX Platform Vision.dc.html` — a "Design Component" (`.dc.html`). It contains a `<helmet>` (fonts + design-system CSS/JS) and one `<x-import>` mounting the `deck-stage` web component, whose children are eight `<section>` slides.
- **`deck-stage.js`** — a self-contained web component that handles slide scaling to fit the viewport, keyboard/scroll/click navigation, a thumbnail rail, speaker-notes, and print-to-PDF (one page per slide). Programmatic nav: `document.querySelector('deck-stage').goTo(n)` (0-indexed).
- **`support.js`** — the Design Component runtime (renders the `<x-dc>` template). Required for the file to render.
- **Styling is 100% inline** on each element (the PLX design system is loaded for tokens/fonts; layout is inline styles referencing `var(--p-*)` tokens). There are no CSS classes to port except the design-system base (`.plx`, `.mono`).
- Each slide is a `<section class="plx" data-label="…" data-speaker-notes="…" style="width:1920px; height:1080px; …">`.

## Running / Deploying
- **View locally:** open `PLX Platform Vision.dc.html` in a browser (served over http, not `file://`, so the relative `_ds/`, `deck-stage.js`, `support.js`, `assets/` load). E.g. `npx serve .` from this folder.
- **Deploy:** upload this whole folder (preserving relative paths) to the target host. The deck references:
  - `./support.js`, `./deck-stage.js`
  - `./_ds/plx-design-system-1bf47fe1-5630-4129-9785-73c202815eec/{colors_and_type.css, styles.css, _ds_bundle.js, fonts/}`
  - `./assets/logo-mark.svg`
  - Google Fonts + Fontshare (Mazius) via CDN `<link>` in the helmet (needs network; fonts fall back to serif/sans/mono otherwise).
- **Export to PDF:** deck-stage supports print (Cmd/Ctrl+P → one page per slide).

## Type system
- **Mazius Display** (serif, via Fontshare CDN) — hero titles, slide taglines, card titles. Signature move: exactly **one** italic forest-accent word per headline (`<em style="font-style:italic; color:var(--p-accent)">`).
- **Inter** (sans, Google Fonts) — body copy, card bodies, meta values.
- **JetBrains Mono** (mono, Google Fonts) — kickers, chassis labels, pills, IDs, tier labels. Always UPPERCASE with generous letter-spacing (0.12–0.26em). Applied via `class="mono"` (design-system class) or inline `font-family:'JetBrains Mono',monospace`.

## Design Tokens (from PLX Design System)
Colors (CSS vars in `_ds/.../colors_and_type.css`):
- `--p-paper #FBF9F5` — page & card surface
- `--p-paper-2 #F2EDE2` — recesses / bands
- `--p-rail #EEEBE3` — foundation rows / dense surfaces
- `--p-canvas #F5F3EC` — app canvas
- `--p-ink #1B1A17` — primary text
- `--p-ink-2 #3A3833` — secondary text
- `--p-muted #807A6F` — mono labels / tertiary
- `--p-accent #244A39` — forest accent (rationed; one per headline)
- `--p-accent-soft #BCCFBF` — accent wash (e.g. "powered output" / continual-learning tiles)
- Status: `--p-ok #5C7A55` (sage), `--p-warn #C99340` (amber), `--p-info #5B7B91` (steel), `--p-hot #52606E` (mineral, destructive only)
- Hairlines: `--p-grid rgba(27,26,23,0.16)` (cards/dividers), `--p-grid-2 rgba(27,26,23,0.08)` (row separators)

Radius: cards `4px`, tiles `6px`; **buttons & status pills = 0 (sharp rectangles)**.
Spacing base: 4px with an editorial 14px break (`4 · 8 · 14 · 22 · 32 · 48 · 72`).
Elevation: **none** — hairline borders + surface steps, no drop shadows.
Motion: `cubic-bezier(0.2,0.8,0.2,1)`, 120/180/320ms; fades/short slides only.

## Reusable slide patterns
- **Section shell:** `width:1920px; height:1080px; background:var(--p-paper); padding:76px 110px; display:flex; flex-direction:column;` — top header block (kicker + h1), middle content (`flex:1`), bottom serif tagline.
- **Kicker:** `class="mono"`, 13px, letter-spacing 0.24em, uppercase, `--p-muted`.
- **H1:** Mazius, ~54–66px, line-height 1, letter-spacing -0.02em, one `<em>` accent word.
- **Tagline:** Mazius, ~31px, `--p-ink-2`, one `<em>` accent word.
- **Card:** `border:1px solid var(--p-grid); border-radius:4px; background:var(--p-paper); padding:26px 30px;` → mono kicker (11px/0.2em) + Mazius 26px title (one accent) + 17px body (`--p-ink-2`).
- **Status pill:** sharp rectangle, `border:1px solid var(--p-grid); padding:7px 12px;` mono 12px uppercase, leading 7px circular status dot (ok/warn/info/accent).
- **Bullet marker:** 14px-wide, 1.5px accent top-border tick in a flex row (no glyph bullets).
- **Connectors:** thin 1px lines + CSS triangles in `--p-ink-2` (down) or `--p-accent` (up); the org-chart feedback loops are dotted SVG paths (`stroke-dasharray:0.5 10`, round caps) with an accent chevron marker and origin dots.

## Screens / Views (8 slides, in order)

### 1 · Title — "Where we're *going* — and how you get involved"
- **Layout:** full-bleed paper, padding 104×130; `justify-content:space-between` column. Top row: mono kicker left ("Petra Lab-X · Platform vision · team briefing") + `logo-mark.svg` (76×76) right. Center: Mazius h1 92px, max-width 1480, "going" italic accent. Bottom: 4-column meta grid over a top hairline.
- **Meta grid:** Repos = "MC · Portal · Infra"; Method = "Spec → build → verify"; Audience = "PLX engineering & ops"; Issued = "Rev 1 · July 2026". Each: mono 12px label (`--p-muted`) + 22px semibold value (`--p-ink`); columns divided by `--p-grid-2` left borders.

### 2 · The new *org chart*
- **Layout:** centered kicker ("Petra Lab-X · AI operating model") + h1. Middle is a vertical org diagram; a dotted SVG **feedback loop** runs up both outer sides from the shared-context row to the humans band (origin dots + accent chevron arrowheads + rotated "FEEDBACK" mono labels).
- **Nodes (top→bottom):** Humans band (ink `#1B1A17` fill, cream text): kicker "HUMANS" + "Strategy · Taste · Judgment · Trust" → ink connector (down arrow) → **Agent harness** chassis box (hairline border, notched mono label "Agent harness · tools · memory · guardrails · evals · logs") containing a 3×2 grid of agent cards (Customer support, Sales, Formulation & R&D, Finance, Operations, Quality & compliance; each: mono "AGENTS" + 26px title) → three accent down-connectors → **Shared context layer** (accent-soft fill, accent border): "Shared context layer" + mono "MCPs · PLX Portal · Company SOPs & repos · Knowledge graph / second brain" → accent connector → **Vectorized Postgres DB** rail row.
- **Tagline:** "The future org chart has fewer routers and more *reviewers*."

### 3 · Accountability flows down, context flows *up* (the AI-native stack)
- **Layout:** centered kicker + h1 ("Accountability flows down, context flows *up*", 54px). Middle: a centered **pyramid stack** of 7 stepped rows (each 84px tall, widening downward from 560→1280px) + a 2-cell foundation row.
- **Rows (top→bottom):** 06 Continual learning (accent-soft) · 05 Human review — "Gates & approvals" · 04 Agent workflows — "Agent explicitly defined process layer" · 03 Permissions & policies — "Azure — ERP (BC) & Portal · Gov-contracts (repos) · MCPs" · 02 Structured knowledge — "Wikis · Skills · SOPs · Brand voice & design systems · Repos · SharePoint · APIs" · 01 Clean data — "Operational plane | Financial plane". Each row: mono number top-left + 26px title + mono sublabel. Foundation: two rail cards — "PLX Portal" (mono "Incl. EQMS · CMMS · LIMMS · E-comm · WMS") and "ERP" (mono "Business Central").
- **Tagline:** "You do not get agent leverage by buying a tool. You get it by making the business *readable*."

### 4 · The *pillars* we're building on
- **Layout:** centered kicker + h1 + mono sub-line ("Three ways you engage — work on · work in · interact with"). Middle: one bordered panel, `grid-template-columns:1fr 1fr 1fr`, three columns divided by `--p-grid-2`, with a **full-width Infra floor band** (`grid-column:1/-1`, `--p-rail` bg, top hairline) below all three.
- **Columns:** each = Lucide icon (30px, `--p-muted`) + mono kicker + Mazius 34px title (one accent) + mono code line + a bordered **"You" framing band** (mono "You" + Mazius 23px phrase) + 4 tick bullets + hairline + mono "You interact: …" + 2 status pills.
  - **Mission Control** (Lucide `gauge`): kicker "Cockpit · directs work"; title "Mission *Control*"; code "PLX_MC · mc.plxcustomer.io"; band "Work *on* your function"; bullets: Two-way SharePoint mirror with full audit trail / Task board, insights & saved views / PLX-MC MCP with optional swarm dispatch / Every PR traces back to a requirement; interact "checkout tasks · review PRs · resolve conflicts"; pills ● Live app (ok) · ● Cycle 2 active (accent).
  - **PLX Portal** (Lucide `package`): kicker "Product · customer value"; title "PLX *Portal*"; code "plx-customer-portal · staging"; band "Work *in* your function"; bullets: Onboarding, DocuSign & the manufacturing suite / Source of truth for PLX brand tokens / SharePoint-backed workflows with UAT feedback / Where most Mission Control work ships; interact "feature work · SOP updates · staging deploy"; pills ● Brand SoT (info) · ● Staging deploy (ok).
  - **Shared Context** (Lucide `network`): kicker "Connective · one record"; title "Shared *Context*"; code "governance-contract · SharePoint SoR"; band "Interact *with* colleagues, partners & agents"; bullets: One SharePoint system of record — no forks / Shared brand voice, tokens & design system / QMS, SOPs & permissions everyone reads from / Agent doctrine — AGENTS.md · SOUL.md · evidence; interact "handoffs · approvals · shared docs"; pills ● One record (ok) · ● Governed (info).
- **Floor band:** mono "Shared Infra · PLX_Infra" + Mazius "Three surfaces, one *floor*" (left) and mono "Secrets Manager · preflight gates · staging Postgres · MCP kill switches" (right).
- **Tagline:** "Same brand, same record, same floor — however you *engage*."

### 5 · Mission Control — the *cockpit*
- **Layout:** centered kicker ("Mission Control · PLX_MC · mc.plxcustomer.io") + h1. Middle: two-column row (`gap:60`): left = 480px lead paragraph (23px, bold "review, approve, assign and resolve") + 2 pills (● Live app / ● Cycle 2 active); right = 2×2 card grid.
- **Cards:** System of record → "SharePoint *mirror*" (Site /sites/plx-mission-control — five lists & libraries, delta sync + webhooks, manual conflict resolution, full audit trail) · Agent surface → "PLX-MC *MCP*" (Task checkout, lifecycle tools, swarm dispatch opt-in; every tool call appends to mc_events; disabled by default) · Now shipping → "Cycle 2 *workspace*" (saved filter views, native-SVG insights with click-to-filter, timeline due-range, command-palette task actions, 5-minute sync cadence) · Design → "Fourth brand *surface*" (Mazius/ledger aesthetic; tokens from the Portal; MC owns layout & chrome only, ADR-003).
- **Tagline:** "Agents produce; people *decide* — and the record never forks."

### 6 · The Portal — where customers and colleagues *live*
- **Layout:** same deep-dive pattern as slide 5. Kicker "PLX Portal · plx-customer-portal". Left lead: "The Portal is the **operational plane** for PLX — the customer and colleague interface for everything we do." + pills ● Live (ok) · ● Fully traceable (info).
- **Cards (2×2):** Briefs → approvals → "Onboarding *suite*" (Briefs, tech-transfers, artwork, contracts and approvals) · Orders → output → "Manufacturing *suite*" (Customer orders, manufacturing orders, purchase orders, work orders and more) · EQMS · digital → "SOPs & *evidence*" (EQMS, finally digital — fully traceable, full transparency) · Plan → ship → "Operations *suite*" (Planning, reporting, receiving, warehousing and more).
- **Tagline:** "Customers and colleagues meet on one product — and one *brand*."

### 7 · The floor we *stand* on (Shared Context & Infra)
- **Layout:** centered kicker ("Shared Context & Infra · the foundation") + h1 + lead (max-width 1180). Middle: a 1360px-wide **ladder diagram** of three tiers, each a labeled row of cells (112px tall) with up-arrow connectors between tiers.
- **Tiers (top→bottom):** "Powered output" → 2 accent-soft cells: Cloud production code · Agentic layer → ↑ → "Cross-functional" → 2 paper cells: Cross-functional MCPs · Central compute (sub "Postgres + vector") → ↑ → "Department nodes & MCPs" → 4 rail cells: Product & R&D, Customer & Sales, Engineering, Ops & Finance (each sub "Dept MCP").
- **Tagline:** "Every node ladders up to one compute core — on one shared *floor*."

### 8 · Agents do the work. Humans *direct* the work.
- **Layout:** centered kicker ("Operating principles · Rev A") + h1 + intro paragraph (max-width 1280). Middle: 3-column grid of numbered principles (columns divided by `--p-grid-2`). Bottom: mono strip over a hairline.
- **Intro:** "We have three active engineering surfaces — Mission Control, the Portal, and the Shared Context Layer — that must share one brand, one governance model, and one traceable record. The opportunity is speed with accountability, not speed without it."
- **Principles:** 01 Everything resolves to a *Task* — "PRD → task → PR → evidence → merge. No orphan work — every change traces to a stated requirement." · 02 One record, one *mirror* — "Postgres is the database of record, the Portal is the system of record, and SharePoint is the mirror. The app is a fast lens; conflicts are resolved by a human, never auto-merged." · 03 One definition of *green* — "./scripts/preflight.sh locally and in CI. No bypassing the gate — the same bar applies to every agent and every human." (Each: JetBrains Mono 44px accent number + Mazius 28px title + 18px body.)
- **Footer strip:** mono "One brand · one governance model · one traceable record".

## Interactions & Behavior (deck-stage)
- **Navigation:** ← / → / ↑ / ↓ / space / scroll / click advance & retreat; slide index persists in the URL. Thumbnail rail: click to jump, drag to reorder, right-click for skip/duplicate/delete.
- **Speaker notes:** each slide carries `data-speaker-notes`; the stage surfaces them (and via postMessage).
- **Scaling:** slides are authored at 1920×1080 and auto-scaled to fit the viewport.
- **Print/PDF:** one page per slide.
- No decorative animation — the design system prohibits it. Hover states (if rebuilt as interactive): cards darken border `--p-grid`→`--p-ink-2`; buttons shift ink fill → forest; links get a forest underline at 2px offset.

## State Management
Minimal — presentation only. The single piece of state is the **current slide index**, owned by `deck-stage` and reflected in the URL hash. No data fetching. If rebuilding as an app, mirror that: `currentSlide` integer + next/prev/goTo.

## Assets
- `assets/logo-mark.svg` — PLX periodic-element mark ("14" + italic "Px"), used on the title slide (76×76). Ink-on-paper.
- `assets/logo-horizontal-ink.svg` — PLX wordmark (included for convenience; not currently placed in the deck).
- Lucide line icons (inlined SVG) on slide 4: `gauge`, `package`, `network`. If rebuilding, use `lucide` / `lucide-react` rather than copying the inline paths.
- No photography. All other graphics are CSS/inline-SVG (connectors, feedback loops, tier cells).
- Fonts loaded from CDN: Mazius Display (Fontshare), Inter + JetBrains Mono (Google Fonts).

## Files
- `PLX Platform Vision.dc.html` — the deck (all 8 slides; inline-styled).
- `deck-stage.js` — slide-stage web component (nav, scaling, notes, print).
- `support.js` — Design Component runtime (required to render the `.dc.html`).
- `assets/` — logo mark + wordmark SVGs.
- `_ds/plx-design-system-1bf47fe1-5630-4129-9785-73c202815eec/` — the PLX Design System: `colors_and_type.css` (tokens), `styles.css` (entry + font imports), `_ds_bundle.js` (components), `fonts/`. This is the source of truth for all colors, type, and spacing.
