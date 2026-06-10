# Coding-Team Prompt — MRP Portal Responsive Work

Copy-paste the block below into any new chat, PR description, or briefing when handing off responsive UI/UX work on the MRP Portal. It's written to be self-sufficient — the recipient should be able to follow it without first reading the rest of the bundle.

For deeper context they can then read `RESPONSIVE.md`, `CONTRIBUTING.md`, and the ADRs.

---

## 📋 Copy-paste prompt

> You are working on the **Petra Lab-X MRP Portal** — an internal manufacturing resource planning suite. You must follow the responsive UI/UX system defined below **without deviation**. If anything seems ambiguous, ask before guessing.
>
> ### Scope
> Every screen — every module — must work cleanly on phone, tablet, and desktop. There is no "mobile version"; there is one design that adapts.
>
> ### Breakpoints (do not add new ones)
> | Tier        | Width range      | CSS query                    |
> |-------------|------------------|------------------------------|
> | **Desktop** | ≥ 1025 px        | base styles (no query)       |
> | **Tablet**  | 641–1024 px      | `@media (max-width: 1024px)` |
> | **Phone**   | ≤ 640 px         | `@media (max-width: 640px)`  |
>
> If a layout needs help between these tiers, use `flex-wrap`, `clamp()`, or `minmax()` — not a new breakpoint.
>
> ### Chrome contract
> - **Never roll your own chrome.** Use `<MrpShell>` (for React-mounted pages) or `installMrpChrome()` (for vanilla HTML). Both live in `mrp/chrome.jsx`. They provide the global sidebar, topbar, hamburger, drawer, and notifications.
> - At ≤ 1024 px, the sidebar **slides out as a drawer** triggered by the hamburger in the topbar. Backdrop tap, close button, and nav clicks all dismiss it.
> - At ≤ 1024 px, the topbar's centered search hides; on phone the workspace switcher also hides.
> - Do not add `position: fixed` elements with `z-index > 50` — that's reserved for the drawer (60) and its backdrop (59).
>
> ### Layout rules
> - **Author desktop-first**, then add two `@media` blocks at the **bottom** of the module's CSS file — one for `1024px`, one for `640px`.
> - **Use CSS Grid with `gap`** for any row of sibling tiles. Never use floats or inline flow with whitespace separators.
> - **`min-width: 0` on grid children** so they can shrink.
> - **No fixed widths** on content. `max-width` is allowed for text columns and modals only.
> - **No horizontal page scroll, ever.** Only wide tables may horizontally scroll — wrap them in `overflow-x: auto` and set `min-width` on the `<table>`.
> - At ≤ 1024 px: drop `position: sticky` from table headers (it fights horizontal scroll).
> - At ≤ 640 px: modals go **full-screen** — `top: 0`, `left: 0`, `width: 100vw`, `min-height: 100vh`, no transform.
> - **Hide controls, not data.** If a row of action buttons doesn't fit, move secondary actions into a "…" menu.
>
> ### How module grids must reflow
> - 4-column KPI strips → 2×2 (tablet) → 1 column (phone).
> - 5-column kanban (Pipeline) → 2-up (tablet) → 1-up (phone).
> - Master/detail splits (Workshop, Std Costs body) → stacked vertically at tablet (index above doc).
> - Modal grids → 1 column at tablet, fully stacked at phone.
> - Form rows (label · value) → label-above-value at tablet.
> - Phase rail tracks → stacked vertically at tablet, with each track horizontally scrolling its steps.
> - Margin/range sliders → hide the slider on phone, keep the numeric input.
>
> ### Tokens & typography
> - **No new hex codes.** Use the CSS variables from `mrp/styles.css` (`--p-ink`, `--p-accent`, `--p-paper`, `--p-grid`, etc.). Light/dark mode is automatic when you use tokens.
> - **Fonts:** `--mazius` (display), `--sans` (Inter), `--mono` (JetBrains Mono). Never hard-code font families.
> - **Minimum readable sizes on phone:** 12 px body, 8.5 px kickers/meta. Line-height ≥ 1.3 on phone.
> - **Touch targets:** ≥ 44 × 44 px on phone and tablet.
>
> ### CSS conventions
> - One namespace prefix per module: `q-` for Quote, `sc-` for Standard Costs, `pq-` for Pre-Quote, `fp-` for FP Anatomy, `sp-` for Sample Pour, etc. Never reuse another module's prefix.
> - **No `!important`** unless overriding a runtime inline style. If you're tempted for normal CSS, your selector is wrong.
> - **No width-based device queries** (`iPad`, `iPhone`). Width-only, using the three tiers above.
>
> ### JSX conventions
> - Cross-file JSX scope sharing is via `window` — every component file ends with `Object.assign(window, { Foo, Bar });`. Consumers do `const { Foo } = window;`.
> - **Pinned React + Babel only.** Use the exact `<script>` tags from `CONTRIBUTING.md` §3 with integrity hashes intact. No `react@18` (unpinned).
> - **No inline `style={…}` for layout.** Inline `style` is OK for per-instance dynamic values (e.g. a bar width computed from data); not for grid templates, padding, or breakpoint behavior.
> - Hooks at the top; return at the bottom; no conditional hooks.
>
> ### Files that own responsive code (touch these)
> ```
> mrp/chrome.jsx          ← sidebar drawer, topbar hamburger, slot rules
> mrp/styles.css          ← shared chrome (rail, opstrip, projcrumb, phaserail)
> mrp/quote.css           ← Quote module
> mrp/stdcost.css         ← Standard Costs + FP Anatomy + Quote Builder
> mrp/intake.css          ← Intake / Tech-Transfer
> mrp/prequote.css        ← Pre-Quote / Go-No-Go
> MRP Workbench.html      ← inline (dashboard hero, pin grid)
> MRP Sample Pour.html    ← inline (rd-stepper, hero stats, modals)
> MRP BOM Dossier.html    ← inline (dossier-id, dossier-toc + grid flattening)
> MRP Assembly Dossier.html ← same pattern (ad-* sections)
> ```
>
> ### PR checklist — every PR
> Before requesting review, verify all of these at 390 / 768 / 1440 px viewport widths:
> - [ ] No console errors at any tier.
> - [ ] No horizontal scroll on `<body>` at any width 320–1920 px.
> - [ ] Hamburger appears at ≤ 1024 px; sidebar slides in/out cleanly.
> - [ ] All multi-column module grids collapse correctly at each tier.
> - [ ] Wide tables scroll inside their wrapper, not the page.
> - [ ] All modals reach their content while the page is scrolled.
> - [ ] Touch targets ≥ 44 × 44 px on phone.
> - [ ] Tab-key focus order matches visual order at every tier.
> - [ ] All buttons have visible text or `aria-label`.
> - [ ] No new hex codes; tokens used throughout.
> - [ ] No new breakpoints; no `!important`.
>
> ### What to read for more detail
> - `RESPONSIVE.md` — full governance doc (breakpoints, layout rules, component patterns, typography table).
> - `CONTRIBUTING.md` — chrome contract, module HTML recipe, how to add a new module.
> - `MRP-REFERENCE.md` — module-by-module reference.
> - `MRP-MIGRATION.md` — migration path to production code.
> - `decisions/ADR-001-brand-vocabulary.md` — token system.
> - `decisions/ADR-002-surface-architecture.md` — Portal vs MRP surface model.
> - `source-snapshot/` — actual `.css` and `.jsx` files for reference. These are the source of truth at handoff time; the live repo may have moved on.
>
> ### When in doubt
> 1. Read `RESPONSIVE.md` §4 (Component-level rules).
> 2. Look at how an existing module solves the same problem — e.g. Quote's KPI strip, Standard Costs' drawer-as-overlay, Pre-Quote's prices grid.
> 3. Ask before inventing.
>
> **Hard requirement:** every change must be tested at 390 px, 768 px, and 1440 px before merge. No exceptions.

---

## How to use this prompt

- **Starting a fresh thread with an AI coding assistant** — paste the block above as your first message. Add: "Here's the work I need: [task]."
- **PR description template** — paste a condensed version of the checklist section under a "## Responsive checklist" heading.
- **Onboarding doc** — link new contributors to this file before they open their first PR.
- **Design QA** — pair the prompt with `RESPONSIVE.md` §8 (the QA checklist) as a sign-off gate.

— end —
