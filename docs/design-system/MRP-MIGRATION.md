# MRP-MIGRATION — Production Rollout for the MRP Surface

> Sibling to `MIGRATION-PLAN.md` (which targets the customer Portal).
> Same shape: phases, the smallest revertable PR first.

This document assumes ADR-002 (Surface Architecture) has been adopted.
The original handoff assumed a separate MRP production codebase. In this
repo, staging MRP is implemented inside the same Next.js portal under
`portal/src/app/mrp/**` and `portal/src/components/mrp/**`, so this plan
adapts the surface architecture to the current route tree.

---

## Phase 1 — Token reconciliation (smallest revertable PR)

**Goal:** make the staging MRP surface consume the shared brand layer instead
of duplicating or hardcoding surface palettes. Token changes should be staged
as a visible migration with screenshots because this repo already has live
MRP routes.

**Scope:** token mirror, MRP shell/chrome, and documented exceptions only.
Do not port module screens in this phase.

**Reference diff from the handoff prototype:**

```diff
  /* PLX MRP — internal instrument-panel skin layered on brand tokens */

- @import url('https://api.fontshare.com/v2/css?f[]=mazius-display@400,401&display=swap');
- @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
-
- :root {
-   --p-paper:#F8F6F1; --p-paper-2:#F4F0E7; --p-card:#F2EDE2;
-   --p-ink:#1B1A17; --p-ink-2:#3A3833; --p-muted:#8C857B;
-   --p-grid:rgba(27,26,23,0.16); --p-grid-2:rgba(27,26,23,0.08);
-   --p-accent:#B65A3E; --p-accent-soft:#E9C7B7;          /* legacy rust */
-   --p-ok:#5C7A55; --p-warn:#C99340; --p-info:#5B7B91; --p-hot:#C84B2C;
-   --mazius:"Mazius Display","Times New Roman",serif;
-   --sans:"Inter",-apple-system,system-ui,sans-serif;
-   --mono:"JetBrains Mono",ui-monospace,monospace;
- }
- .dark {
-   --p-paper:#1A1816; --p-paper-2:#22201D; --p-card:#272421;
-   --p-ink:#F1ECE0; --p-ink-2:#C9C2B5; --p-muted:#827B6F;
-   --p-grid:rgba(241,236,224,0.12); --p-grid-2:rgba(241,236,224,0.06);
-   --p-accent:#D87253; --p-accent-soft:#5A3327;          /* legacy rust */
-   --p-ok:#7A9E6F; --p-warn:#D9A85C; --p-info:#7A9DB3; --p-hot:#E26648;
- }
+ /* Brand tokens — single source of truth.
+    See design-system/decisions/ADR-002-surface-architecture.md */
+ @import url("../design-system/tokens.css");
+
+ /* MRP-specific font families. Brand layer declares face stacks via
+    --p-font-* variables; we still need the @font-face imports because
+    the brand layer doesn't host the font files itself. */
+ @import url('https://api.fontshare.com/v2/css?f[]=mazius-display@400,401&display=swap');
+ @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
+
+ /* Compatibility aliases — MRP component CSS uses these short names.
+    Keep until a follow-up renames usages to --p-font-serif/sans/mono. */
+ :root {
+   --mazius: var(--p-font-serif);
+   --sans:   var(--p-font-sans, "Inter", -apple-system, system-ui, sans-serif);
+   --mono:   var(--p-font-mono);
+ }

  * { box-sizing:border-box; }
  html,body { … }   /* unchanged */
```

**Repo adaptation:**

- Update `portal/src/styles/brand-tokens.css` in the token foundation phase,
  not directly from `mrp/styles.css`.
- Normalize `portal/src/components/mrp/layout/**` away from hardcoded teal
  and generic status ramps into `--p-*` tokens.
- Keep AG Grid density choices as a documented exception until the grid token
  bridge lands.
- Do not query FileMaker replica tables to make a visual migration work.

**Verification:**

1. Open every canonical MRP HTML in the design exploration:
   - `MRP Workbench.html`
   - `MRP Pre-Quote.html`
   - `MRP Product Development.html`
   - `MRP Sample Pour v2.html`
   - `MRP BOM Dossier.html`
   - `MRP Assembly Dossier.html`
   - `MRP Design Process Flow.html`
2. Capture before/after screenshots for staging `/mrp` and one representative
   list/detail route.
3. Record computed-style snapshots for `--p-paper`, `--p-ink`, `--p-accent`,
   `--p-ok`, `--p-warn`, `--p-hot`, and font stacks.
4. Toggle `.dark` where supported; verify the shared dark palette resolves
   from the brand layer.

**Risk:** medium. The handoff prototype token swap was zero-diff, but this
repo has already shipped `.brand-plx` surfaces and MRP components with their
own Tailwind classes. Treat Phase 1 as a controlled token and chrome migration,
not a blind copy.

**Revert:** restore the prior `portal/src/styles/brand-tokens.css` values and
MRP shell classes from the previous commit. No database or API change should
be included in this phase.

---

## Phase 2 — Production component port (Workbench shell)

**Goal:** the MRP shell renders from React components against
production data, not from a static HTML file.

**Scope:**
- `<MrpTopbar>` — `.topbar` chrome.
- `<MrpOpStrip>` — `.opstrip` (live KPIs).
- `<MrpProjectCrumb>` — `.projcrumb` (project identity).
- `<MrpProjectContext>` — `.projctx` (team / flags / activity).
- `<MrpPhaseRail>` — `.phaserail` (8-stop pipeline, two tracks).
- `<MrpWorkspace>` — `.workspace` two-column shell.
- `<MrpSidebar>` and `<MrpMainPane>` — workspace slots.

**Data contracts (define in Phase 2 PR):**
- `Project` → identity, stage, phase, team, flags, last activity.
- `Flag` → `{ code, title, severity: "hot" | "warn" | "info" }`.
- `Phase` → `{ track: "formulation" | "packaging", step, status }`.
- `KpiCell` → `{ label, value, tone? }`.

**What stays in `mrp/styles.css`:** the CSS classes. React components
render `<div class="topbar">`, etc. Do not migrate classes into
CSS-in-JS until a v2 design system decision says so.

**Verification:**
- Visual diff against `MRP Workbench.html` at 1440 and 1920 widths.
- Light + dark.
- Real project data with: 0 flags, 1 hot + 3 warn flags, 7 mixed flags
  (overflow case).

---

## Phase 3 — Production component port (per-stage modules)

In dependency order — each PR is small and self-contained:

| PR | Module | Source artifact |
|---|---|---|
| 3a | Pre-Quote (Stage 02) | `MRP Pre-Quote.html`, `mrp/prequote.jsx` |
| 3b | Formulation (Stage 03) | `MRP Product Development.html`, `mrp/formulation.jsx` |
| 3c | Sample Pour (Stage 04) | `MRP Sample Pour.html` |
| 3d | BOM Dossier (locked) | `MRP BOM Dossier.html`, `mrp/dossier.jsx` |
| 3e | Assembly + Pack-out (Stage 05) | `MRP Assembly Dossier.html`, `mrp/assembly*.jsx` |

**Each module PR contains:**
- The React component tree (production names, see `MRP-REFERENCE.md`).
- Storybook stories for the empty / loading / full / error states.
- Wiring into the Workbench shell from Phase 2.

**Do not combine modules in a single PR.** Each is a comprehensible,
revertable change.

---

## Phase 4 — Shared-data alignment with Portal

**Goal:** the BOM Dossier (MRP) and the Sign-off Deed (Portal) render
from the same upstream record, with surface-appropriate framings.

**Scope:**
- Define the shared `Formulation` record (the source of truth for both
  ops and customer documents).
- Define which fields are "internal only" (cost, supplier, allergen
  margins) vs. "customer-visible" (ingredients, percentages, claims).
- Update both surfaces to read from this record.

**Why this is Phase 4:** the two surfaces ship separately. Doing this
earlier blocks both teams; doing it later means each surface evolves a
parallel data shape that has to be reconciled. Phase 4 is the
synchronization point.

**Coordination:** Portal `MIGRATION-PLAN.md` Phase 4 references this
same data-shape conversation. Land both in coordinated PRs.

---

## Phase 5 — Process flow ↔ state machine

**Goal:** the MRP Design Process Flow diagram is enforced by the
backend state machine, not just rendered as a static reference.

**Scope:**
- Codify the stage transitions in `mrp/state/projectFsm.ts`.
- Each transition writes an activity event that the Workbench
  `.projctx .activity` cell consumes.
- The phase rail (`.phaserail`) renders directly from the current FSM
  state, so the chrome can never disagree with the model.

**Why last:** the static artifacts work fine without it. This is the
PR that turns the design from a beautiful mockup into a process
enforcement system. It is the highest-value PR but also the most
expensive — do it once the surface is stable.

---

## Open questions for the MRP rollout

1. **Stage 01 (Intake)** — partially designed via `mrp/intake*.jsx` but
   no canonical HTML spec. Block before Phase 3 or accept the gap?
2. **Field use cases** — Stage 04 Sample Pour has a "ship/track"
   sub-track. Does an operator need a mobile view to check shipment
   status on the floor? If yes, that's an addition to the
   "MRP is desktop-only" decision in `MRP-REFERENCE.md`.
3. **Dark mode** — token values exist; no screen has been audited
   under it. Run an audit pass during Phase 2 verification.
4. **Multi-project switching cost** — the `.projcrumb` workspace
   switcher implies project switching is a frequent action. Confirm
   with ops staff before investing in fast-switch keybindings.

---

## File-by-file impact summary

| File | Phase | Change |
|---|---|---|
| `portal/src/styles/brand-tokens.css` | 1 | Mirror accepted bundle tokens at runtime. |
| `portal/src/components/mrp/layout/**` | 1-2 | Shell/chrome React components and tokenized nav. |
| `portal/src/components/mrp/**` | 2-3 | One module/archetype per PR. |
| `portal/src/lib/mrp/**` | 4 | Shared record/data-shape helpers when needed. |
| `portal/src/lib/mrp/state/**` | 5 | Process state machine if/when implemented. |

Once Phase 1 lands, every other phase is independently revertable.
