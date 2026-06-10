# Design System Handoff Changelog

> Records each iteration of the PLX design system handoff bundle that lands in this repo.
> The handoff comes from a Claude.ai design exploration project; this file is the audit
> trail of what changed between iterations and why.

---

## v0.5 — 2026-05-18

**Source:** SharePoint `Petra Lab X public facing website (5).zip`, downloaded through Microsoft Graph into `artifacts/design-system/sharepoint-responsive-2026-05-18/`.

**Why:** Vince supplied the responsive handoff bundle as the governing contract for MRP portal responsive UI/UX work. This drop formalizes the three-tier breakpoint system, MRP chrome drawer contract, module grid reflow rules, touch-target requirements, and QA checklist.

### Files added

| Path | Purpose |
|---|---|
| `RESPONSIVE.md` | Canonical MRP responsive governance: breakpoints, layout rules, component behavior, typography, and QA checklist. |
| `CONTRIBUTING.md` | Engineering contribution contract for MRP chrome, module CSS, JSX conventions, and PR verification. |
| `PROMPT.md` | Self-contained handoff prompt for new chats, PR descriptions, and responsive work briefings. |
| `source-snapshot/**` | Responsive source snapshot from the handoff bundle; reference only, production code may have moved on. |

### Production follow-up

The first production invariant landed with this handoff: `/mrp` now has a tablet/phone hamburger drawer for the shared MRP sidebar, with backdrop, close-button, and nav-click dismissal.

---

## v0.4 — 2026-05-17

**Source:** SharePoint `New PLX Portal Design/bundle`, downloaded through Microsoft Graph into `artifacts/design-system/v0-4-canonical-bundle/source/`.

**Why:** Vince promoted the new bundle as the canonical design-system import material for Portal and staging MRP. This drop changes the system from a customer-portal-only rollout into an ADR-002 multi-surface architecture: one brand-token layer with Portal and MRP surface-specific component sheets. The homepage remains a sibling marketing track.

### Material decisions

| Decision | Outcome |
|---|---|
| Source of truth | `docs/design-system/**` remains the governed canonical source. SharePoint is the latest provenance/import bundle, not runtime source. |
| Surface architecture | `decisions/ADR-002-surface-architecture.md` is accepted for this repo. |
| Portal scope | Current shipped `/login`, auth companion screens, and `/projects` implementation status is preserved instead of overwritten by stale bundle plan text. |
| MRP scope | Bundle MRP docs are adapted to this repo's `portal/src/app/mrp/**` and `portal/src/components/mrp/**` route tree. |
| Homepage scope | `HOMEPAGE-SCOPE.md` records the homepage as a sibling marketing track, not part of Portal/MRP working-surface rollout. |
| Assets | Bundle favicons and `mark-ink-128.png` are archived under `docs/design-system/assets/**`; runtime promotion is deferred to the token/asset foundation phase. |

### Files added

| Path | Purpose |
|---|---|
| `MRP-MIGRATION.md` | MRP rollout sequence adapted from the bundle to this Next.js repo. |
| `MRP-REFERENCE.md` | MRP artifact index and production porting guidance. |
| `HOMEPAGE-SCOPE.md` | Marketing homepage sibling-track decision. |
| `decisions/ADR-002-surface-architecture.md` | Accepted design architecture for Portal + MRP. |
| `assets/favicons/**` | Canonical favicon inventory from the SharePoint bundle. |
| `assets/marks/mark-ink-128.png` | Canonical raster fallback for the periodic mark. |

### Follow-up phases

1. Apply the forest token layer to `docs/design-system/tokens.*` and `portal/src/styles/brand-tokens.css`. **Done in Phase B.**
2. Expand token/design audits to cover `.brand-plx` remaps, utilities, status colors, and shadcn governance. **Partially done in Phase B; hardcoded route color audit remains Phase C/D/E.**
3. Promote runtime-safe assets into `portal/public/brand` and app favicon paths. **Done in Phase B.**
4. Migrate Portal and MRP route families with screenshot and accessibility gates.

---

## v0.3 — 2026-05-08

**Source:** Post-PR #56/#58 staging state plus product decision to start the next customer-facing route at `(portal)/projects`.

**Why:** The auth suite now proves the PLX brand layer across the public account entry flow. The next rollout needs a customer workbench surface, but `(portal)/projects` must first obey the Prisma-only UI rule before visual migration.

### Material decisions

| Decision | Outcome |
|---|---|
| Next route | `(portal)/projects/page.tsx` is the next customer-facing workbench route. `/dashboard` remains a later customer shell pass. |
| Execution split | Projects rollout is split into data hygiene first, visual workbench second. |
| Data source | Customer UI must render project references from Prisma `Project.projectNumber`, not `@/lib/fm-source`, `queryFM`, or `/api/fm/*`. |
| Rollback | The visual PR keeps a legacy projects render adjacent to the workbench render during staging soak. |

---

## v0.2 — 2026-05-06

**Source:** Claude Design handoff already staged in `docs/design-system/**`, plus user decision to promote customer login as the active pilot.

**Why:** v0.1 documented an MRP-first validation path. The current product/design direction is to use `/login` as the first fully governed customer-facing screen, because it exercises the brand promise, auth contract, responsive design, dark mode, accessibility, and production-state coverage in one contained route.

### Material decisions

| Decision | Outcome |
|---|---|
| Source of truth | `docs/design-system/**` is canonical after reconciliation. OneDrive/Claude Design remains provenance/import material only. |
| Active pilot | `specs/portal/portal-login.jsx`, selected `PortalLogin_Instrument` direction. |
| Mock-only login controls | Google SSO and magic link remain non-production until backed by real auth providers/routes. |
| Required states | Loading, invalid credentials, disabled account, account-created success, reset success, success, forced reset, light, dark, and mobile. |
| Auth contract | Visual redesign must preserve and fix callback URL, disabled account, temporary password, and 2FA expectations before replacing staging `/login`. |

### Files updated

| File | Material change |
|---|---|
| `README.md` | Declares repo-canonical status and login-first rollout decision. |
| `MIGRATION-PLAN.md` | Adds current execution lanes and login product/auth gates. |
| `REFERENCE.md` | Promotes `PortalLogin_Instrument` as the active visual spec and labels mock-only elements. |
| `specs/README.md` | Moves login to the top of the active portal mock mapping. |
| `COMPONENT-INVENTORY.md` | Narrows component guidance for login and documents required login states. |
| `decisions/ADR-001-brand-vocabulary.md` | Records login as the first production-quality brand threshold. |
| `docs/modules/design-system/README.md` | Tracks the module contract against the login-first pilot. |
| `tasks/todo.md` | Tracks the login-first execution backlog. |

---

## v0.1 — 2026-05-05

**Source:** `Petra Lab X public facing website.zip` (5.6 MB, 78 files)

**Why:** First refresh since the v0.0 stubs landed (2026-05-03). v0.0 documented intent;
v0.1 documents *exactly how* to execute, with concrete file paths, line numbers, and a
disciplined component surface. Also delivers the spec mock artifacts that v0.0
`REFERENCE.md` was already pointing at.

### Files changed (all 7 design-system docs got richer)

| File | v0.0 | v0.1 | Material change |
|---|---:|---:|---|
| `README.md` | 6,284 B | 6,654 B | Tighter "what this is/is not", explicit reading order, status block updated. |
| `tokens.css` | 5,930 B | 8,461 B | More verbose comments; selector clarification (`:root[data-brand="plx"], .brand-plx` — the class form is what `(portal)/layout.tsx` uses, so this is backward-compatible). Color values **unchanged** byte-for-byte. |
| `tokens.ts` | 2,844 B | 3,234 B | Mirror of `tokens.css` updates. |
| `MIGRATION-PLAN.md` | 6,172 B | 15,298 B | **Major.** Collapsed 5 phases (A–E) into 4 (1–4). Phase 1 is now ~1 hour of infra. Phase 4 is per-screen feature work. Concrete code blocks for `globals.css`, `layout.tsx`, font loading. |
| `REFERENCE.md` | 4,618 B | 5,798 B | Now lists every spec artifact by filename (which now exist in `specs/` — see below). Mock-vs-real labelling per artifact. |
| `COMPONENT-INVENTORY.md` | 4,833 B | 7,891 B | **Major.** Concrete inventory: 0 forks, 4 extended shadcn variants, 11 net-new brand components. Total surface ~14 files. Explicit "what we do NOT build". |
| `decisions/ADR-001-brand-vocabulary.md` | 5,864 B | 8,497 B | Expanded rationale on the three big bets: serif-for-legal, mono-for-data, chassis-and-folio chrome. |

### Files added in v0.1 (net-new in this repo)

| Path | Count | What it is |
|---|---:|---|
| `specs/portal/` | 21 | Portal spec mocks: workbench, project detail, sign-off (and its sub-sections), login, navigation map, phase indicator, design canvas, tweaks panel, iOS frame, canvas state. The artifacts `REFERENCE.md` was already pointing at. |
| `specs/homepage/` | 10 | Public-facing marketing site mocks (`homepage.jsx`, `apothecary-*.jsx`, `Petra Lab-X Homepage*.html`, `hero-spec-sheet.html`). **Staged as reference only** — the v0.1 design docs continue to mark the public homepage out of scope. Scope decision pending (see `tasks/todo.md` §8). |
| `specs/hyperframes-diagram-boot/` | 4 | Standalone HTML+GSAP diagram-boot animation. Not portal-related; included for provenance. |
| `specs/_handoff-context/claude-design-hyperframes.md` | 1 | The 47 KB instruction document Claude.ai itself follows when producing HyperFrames-style design output. **Not a portal spec** — recorded for provenance so future readers understand how the JSX/HTML mocks were authored. |
| `specs/_handoff-context/reference-images/` | 31 | Mood-board pasted images, screenshots of the existing portal taken during the design process, logo source PDF. Reference only; not used by production. |
| `assets/logos/` | 6 | Canonical brand logo set: full / horizontal / stacked × cream / ink. (Zip's `assets/` had 5; missing `logo-stacked-cream.png` was sourced from `uploads/`.) |

### What did NOT change

- The token import in `portal/src/app/globals.css` line 4 (`@import "../../../docs/design-system/tokens.css"`) is unchanged; the file content underneath it just got refreshed.
- `(portal)/layout.tsx` still uses `className="brand-plx"` — fully compatible with both the old and new selector form in `tokens.css`.
- No `portal/src/` files modified by this drop.
- `docs/modules/design-system/README.md` (the module contract) — needs a future review pass to see if the v0.1 phase reorg requires module-doc updates.

### Open decisions parked for the v0.1 rollout (see `tasks/todo.md`)

1. **Pilot screen pick** — which MRP page to validate the brand layer on first.
2. **Public homepage scope** — out of scope, deferred, parallel track, or priority-flip?
3. **Mazius Display** — resolved with bundled SIL OFL 1.1 webfonts; Times New Roman remains the runtime fallback.

---

## v0.0 — 2026-05-03

Initial stub set committed: 7 docs in `docs/design-system/` and `decisions/`. No spec
artifacts, no logos. Phase A token pilot landed in `portal/src/app/globals.css` and
`(portal)/layout.tsx` per the Phase A checklist in `tasks/todo.md`. Verification evidence
bundle in `artifacts/design-system/phase-a/`.
