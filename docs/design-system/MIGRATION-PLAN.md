# PLX Design System — Migration Plan

> Sequenced plan for landing the brand layer in `taylorvalton/plx-customer-portal`.
> Read this end-to-end before opening a single PR.

**Repo:** `taylorvalton/plx-customer-portal`
**Branch strategy:** `staging` (per `CLAUDE.md` — staging-only deployment)
**Stack:** Next.js 16 + Tailwind v4 + shadcn/ui + TypeScript strict
**Risk profile:** **Medium.** Touches `globals.css` (used by every page) and component primitives. Each phase below is independently revertable.

---

## Guiding principle

**Reskin first, refactor never.** The 33 modules already shipped are not getting rewritten. They're getting their tokens swapped underneath them. If a screen looks worse after Phase 1, the brand layer is wrong, not the screen.

As of 2026-05-06, the active pilot is the **customer login experience** at `/login`. This decision supersedes the previous MRP-first rollout sequence for the next execution lane. MRP pilot work remains retained as proof that the token layer can skin real data-heavy pages, but the login page is now the first production-quality screen that must validate the reconciled Claude Design handoff.

---

## Current execution lanes

| Lane | Scope | Touches | Reversible? | Effort |
|---|---|---|---|---|
| **0 — Canonicalize handoff** | Reconcile Claude Design docs/specs into `docs/design-system/**`; mark repo docs as canon and OneDrive as provenance. | Docs only | Yes | ~1 hr |
| **1 — Runtime token audit** | Verify `docs/design-system/tokens.css`, `tokens.ts`, and `portal/src/styles/brand-tokens.css` stay aligned. | Docs/CSS only unless drift is found | Yes | ~1 hr |
| **2 — Login product contract** | Resolve mock-only concepts in `portal-login.jsx` before coding: Microsoft only vs. Google/magic-link, telemetry copy, disabled/reset/error states, callback behavior, and dark/mobile requirements. | Docs and route contract | Yes | ~1-2 hrs |
| **3 — Production-shaped login prototype** | Build the selected Instrument login direction against real shadcn primitives, auth state, and tokens. Add a route-local `.brand-plx` boundary because `(auth)` is not inside the customer portal shell. | `(auth)/login`, leaf client component, auth docs | Per-file | ~4-8 hrs |
| **4 — Production login replacement** | Replace staging `/login` after validation of auth behavior, accessibility, light/dark/mobile states, and rollback path. | `(auth)/login`, possible auth bug fixes | Per-PR | ~4-8 hrs |
| **5 — Projects data hygiene** | Prepare `(portal)/projects` for workbench migration by removing deprecated FM helper usage and reading `Project.projectNumber` through Prisma only. | `(portal)/projects/page.tsx` | Per-file | ~1 hr |
| **6 — Projects workbench visual migration** | Rebuild the projects list against the workbench spec with route-local project components, legacy rollback, SOP updates, and mobile verification. | `(portal)/projects`, `components/projects`, SOPs | Per-screen | ~4-8 hrs |
| **7 — Broader rollout** | Continue to project detail, sign-off/deed, dashboard shell, and MRP surfaces after the workbench route soaks. | Per screen/module | Per-screen | Per screen |

The previous four-phase plan remains useful historical context for token/font/primitive sequencing. The active work should follow the lanes above.

---

## Historical Phase 1 — Tokens land (already landed)

**Goal:** Brand colors, type stack vars, and shadcn remap available app-wide. Existing pages unaffected unless they opt in via `data-brand="plx"`.

### 1.1 Create the directory

Drop these four files into `docs/design-system/` (canonical location per `REPO_HYGIENE_SPEC.md` §3.1 — root `.md` allowlist forbids us from putting it at root):

```
docs/design-system/
├── README.md
├── tokens.css
├── tokens.ts
├── MIGRATION-PLAN.md          ← this file
├── REFERENCE.md
├── COMPONENT-INVENTORY.md
└── decisions/
    └── ADR-001-brand-vocabulary.md
```

### 1.2 Symlink (or copy) tokens for build-time access

Tailwind v4's `@import` works with relative paths from `globals.css`. So either:

**Option A — direct import (simpler, recommended for v0):**
```css
/* portal/src/app/globals.css — line 4, after existing imports */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "../../../docs/design-system/tokens.css";  /* ← add this */
```

**Option B — symlink for cleaner imports:**
```bash
cd portal/src && ln -s ../../docs/design-system design-system
# Then @import "../design-system/tokens.css"
```

Option A keeps the canonical location obvious to anyone reading `globals.css`. Use it.

### 1.3 Wire `tokens.ts` for type-safe access

```bash
# From portal/
ln -s ../docs/design-system/tokens.ts src/lib/design-tokens.ts
```

Or copy and add a CI check that diffs them. Symlink is cheaper for v0.

### 1.4 Opt the portal layout into the brand

In `portal/src/app/(portal)/layout.tsx` (the customer-facing portal route group), add:

```tsx
<body data-brand="plx" className={...}>
```

This activates the shadcn token remap (see `tokens.css` §3) for portal pages only. The `(auth)`, `admin`, and `operations` route groups stay on default shadcn until each is opted in deliberately.

### 1.5 Verify

```bash
cd portal && npm run dev
```

- Open a portal route. Backgrounds should warm up to `#F8F6F1`. Existing components shouldn't break.
- Open `/admin` — should still look like default shadcn (neutral).
- Open the public homepage — purple/rose gradients still intact (no `data-brand` attribute).

If anything looks broken on a portal page, the screen is hardcoding a color that should have been a token. Fix it in that screen, not in the brand layer.

### 1.6 Open the PR

- Title: `feat(design-system): add v0 brand token layer`
- Update `docs/modules/README.md` to register `design-system` as a planned module (per hygiene spec §2.3 — planned-only stub allowed).
- Update `tasks/todo.md` with the Phase 2/3/4 backlog.
- No new shims; no logic changes.

---

## Historical Phase 2 — Type & font

**Goal:** Mazius Display and JetBrains Mono load via `next/font`. Brand utility classes available.

### 2.1 License Mazius

Mazius Display is bundled under the SIL Open Font License 1.1. The production
regular/italic files live in `portal/public/fonts/mazius/` and
`docs/design-system/assets/fonts/mazius/` for the canonical design archive.

### 2.2 Wire fonts in `app/layout.tsx`

```tsx
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const mazius = localFont({
  src: [
    { path: '../../public/fonts/mazius/MaziusDisplay-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/mazius/MaziusDisplay-Italic.otf', weight: '400', style: 'italic' },
  ],
  variable: '--font-mazius-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// in <html>:
<html className={`${mazius.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
```

### 2.3 Update `tokens.css`

Once the fonts are loaded, swap the var references:

```css
--p-font-serif: var(--font-mazius-display, "Mazius Display"), "Times New Roman", Georgia, serif;
--p-font-sans:  var(--font-inter, "Inter"), "Segoe UI", "Helvetica Neue", Arial, sans-serif;
--p-font-mono:  var(--font-jetbrains-mono, "JetBrains Mono"), ui-monospace, monospace;
```

### 2.4 Add Tailwind utilities

In `globals.css` `@theme inline` block:

```css
@theme inline {
  /* ... existing entries ... */
  --font-sans:  var(--p-font-sans);
  --font-serif: var(--p-font-serif);
  --font-mono:  var(--p-font-mono);
}
```

This exposes `font-sans`, `font-serif`, and `font-mono` Tailwind utilities globally.

### 2.5 Verify

A test page using `<h1 className="font-serif text-5xl">` should render Mazius. `<span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">` should render JetBrains Mono with the chassis-tick aesthetic.
CI runs `next build --webpack` with an expanded Node heap because the portal now has enough routes for type-aware build validation to exceed the runner default.

---

## Historical Phase 3 — Brand primitives

**Goal:** Brand-aware variants of shadcn primitives, plus the small set of brand-only compound components needed for the deed/sign-off/formula screens.

### 3.1 Directory

```
portal/src/components/brand/
├── README.md             ← consumer copy, points to docs/design-system/
├── chassis-folio.tsx     ← the bordered container with corner ticks
├── chassis-ticks.tsx     ← the 4-corner mono tick marks
├── writ-stamp.tsx        ← the editorial mono+serif date+ID block
├── attestation-chip.tsx  ← the row of pills used in the sign block
├── open-flag-row.tsx     ← the hairline-divided issue row
├── kicker.tsx            ← thin wrapper around `<span class="p-kicker">`
├── pmark.tsx             ← the periodic-glyph mark
└── index.ts              ← barrel export
```

This sits **alongside** `components/ui/` (shadcn), not inside it. Critical: shadcn primitives stay third-party-managed; brand compounds are ours.

### 3.2 Extend shadcn primitives

For shadcn primitives that need a brand variant, prefer **adding a variant** over forking the file. Example for Button:

```tsx
// portal/src/components/ui/button.tsx — extend the cva definition
variant: {
  default: "...",
  destructive: "...",
  outline: "...",
  secondary: "...",
  ghost: "...",
  link: "...",
  // NEW:
  brand: "bg-[var(--p-ink)] text-[var(--p-paper)] hover:bg-[var(--p-accent)] font-mono uppercase tracking-[0.2em] text-[11px]",
  "brand-ghost": "border border-[var(--p-grid)] text-[var(--p-ink)] hover:border-[var(--p-ink)] font-mono uppercase tracking-[0.2em] text-[11px] bg-transparent",
}
```

`shadcn/ui` is designed to be edited in-place. Per `components.json` it's a vendored copy, not a dependency. So extending the cva definitions is correct — not a fork.

### 3.3 Compound components — what each is and what it wraps

These are the brand-specific pieces in the design artifacts. Each maps to a cluster of CSS in `portal-signoff-styles.jsx` / `portal-system.jsx`. See `COMPONENT-INVENTORY.md` for the full catalog.

| Component | Wraps | Spec lives |
|---|---|---|
| `<ChassisFolio>` | `<Card>` + corner ticks + folio borders | `portal-signoff.jsx` `.deed`, `.psd .chassis-tick.*` |
| `<ChassisTicks position="four-corners">` | Decorative ticks | `portal-system.jsx` `.pf .ticks` |
| `<WritStamp>` | A small block of mono + serif metadata | `portal-signoff.jsx` `.writ-stamp` |
| `<AttestationChip>` | Inline pill: glyph + label + value | `portal-signoff.jsx` `.attest-chip` |
| `<OpenFlagRow>` | Hairline-divided issue row | `portal-signoff.jsx` `.flag-row` |
| `<Kicker>` | Mono uppercase eyebrow text | `.p-kicker` utility class |
| `<PMark>` | Periodic-table-style 2-line glyph | `portal-system.jsx` `.pf .pmark` |

### 3.4 Where to NOT use brand primitives

- **Forms inside the portal:** stay on shadcn `<Form>`, `<Input>`, `<Label>`. They inherit the brand via tokens — no wrapping needed.
- **Tables:** stay on shadcn `<Table>` (or AG-Grid for the heavy ones). The formula table on mobile (stacked card variant) IS a custom layout — that's domain-level, lives in `components/formula/`.
- **Dialogs, dropdowns, sheets:** all shadcn. They inherit.

The brand primitives are for the editorial/legal moments. Everywhere else, shadcn + brand tokens does the work.

---

## Screen Rollout Sequence

**Goal:** Build the screens specified in the design artifacts, in order of leverage.

### 4.1 Recommended sequence

1. **Login** (`/login`) — active pilot. Spec: `specs/portal/portal-login.jsx`, selected `PortalLogin_Instrument` direction. Must preserve real NextAuth behavior and include loading, invalid-credentials, disabled-account, reset-success, registered-success, success, and forced-reset states.
2. **Workbench / projects list** — next customer-facing portal surface after login approval. Spec: `portal-workbench.jsx` with `portal-system.jsx` as supporting context. Before visual work, remove any route-level FM helper usage and render project references from Prisma `Project.projectNumber`.
3. **Project detail formula tab** — partial reskin of an existing screen. Spec: `portal-system.jsx` (project-detail mock). Mostly token swap + add formula stacked-card mobile variant.
4. **Sign-off deed screen** (`/projects/[id]/sign/[version]`) — net-new flow. Spec: `portal-signoff.jsx`. Uses Phase 3 compounds heavily and requires product/legal/DocuSign readiness before implementation.

### 4.2 Per-screen workflow (apply this template)

For each screen in the sequence:

1. Read the spec HTML artifact end-to-end (link in `REFERENCE.md`).
2. Read the existing route file in `portal/src/app/...` if one exists.
3. Read the relevant module contract in `docs/modules/<module>/README.md`.
4. Identify which existing components, services, and Prisma queries the new screen consumes.
5. For existing business surfaces, build the new screen *as a new file* alongside the old one (`page.brand.tsx` next to `page.tsx`) behind a feature flag. **Do not delete the old route file in the same PR.** For `/login`, where the auth route is a focused single page, use a leaf client component or internal branchable component boundary so rollback remains a small diff. For `(portal)/projects`, preserve the old render as `projects-page-legacy.tsx`, add the new render as `projects-page-workbench.tsx`, and keep `page.tsx` as the small selector during staging soak.
6. Open a PR with screenshots from staging. Tag a designer + an engineer.
7. After 1 week of staging soak, delete the old `page.tsx` and rename `page.brand.tsx` → `page.tsx`.

This is a deliberate "two-trees" approach. It keeps blast radius small and makes rollback a one-line revert.

### 4.3 Mock vs. real data — what to expect

Every spec artifact uses fictional data. Translation guide:

| In the spec | In production |
|---|---|
| `PLX-2614` | Real project ID from `Project.id` (Prisma) |
| `12 ingredients across 4 phases` | Real BOM rows from `Formulation.bomLines` |
| `niacinamide 4.0% hero row` | Whichever line has `isHero: true` (or first by `sortOrder`) |
| The DocuSign frame chrome (toolbar dots, "SIGN HERE" tag) | The real DocuSign embedded signing iframe — chrome is theirs, not ours. We wrap it in `<ChassisFolio>` but don't restyle the iframe contents. |
| Static "Open flags" list | Query `Flag.where({ projectId, status: 'open' })` — assuming this model exists; if not, see `COMPONENT-INVENTORY.md` notes on the flags model. |
| The DocuSign envelope ID and routing | Real DocuSign `EnvelopeId` from `portal/src/lib/docusign.ts` — already exists, see `ARCHITECTURE.md` integration surface. |

### 4.4 Known integration gaps

These came up while reading the codebase. None block Phase 1–3.

- **`Flag` model** — open flags row spec assumes a flags-per-project model. Need to confirm against Prisma schema. If absent, add to schema or surface from existing `Deviation`/`CAPA` models in `quality/`.
- **DocuSign embedded signing UI** — `portal/src/lib/docusign.ts` exists. Confirm it returns an embedded signing URL (vs. email-only). The spec assumes embedded.
- **PDF generation** — `PROJECT-STATUS.md` lists this as a stub. The "after sign" receipt state in the spec assumes a generated PDF exists. Implementing this stub is a Phase 4 prerequisite for the sign-off screen.

---

## Rollback plan

Each phase can be reverted in isolation:

- **Phase 1:** Remove `@import` from `globals.css`. Remove `data-brand="plx"`. Delete `docs/design-system/`.
- **Phase 2:** Remove `next/font` calls. Revert `globals.css` `@theme` additions.
- **Phase 3:** Delete `portal/src/components/brand/`. Revert button cva variants.
- **Phase 4:** Revert per-screen PR. Old `page.tsx` is still there (per §4.2 step 5).

The "two-trees" approach in Phase 4 means a bad deploy is a one-commit revert, not a hot patch.

---

## Open questions for the team

Things to decide before coding the production login replacement:

1. **SSO surface.** `portal-login.jsx` shows Microsoft, Google, and magic link options. Production currently supports credentials and Azure AD. Recommendation: ship Microsoft + credentials only until Google or magic link exists.
2. **Callback behavior.** Existing login should respect middleware `callbackUrl` instead of hardcoding `/dashboard` for both credentials and Microsoft/Azure sign-in.
3. **Temporary password behavior.** Confirm the intended `mustResetPassword` rule before visual replacement. Recommendation: temporary-password users must reset while the temporary credential is active, not only after expiration.
4. **2FA behavior.** `verify-2fa` UI exists but the route wiring needs confirmation before making 2FA a visible login promise.
5. **Telemetry copy.** The Instrument panel can show operational trust signals, but must not claim SOC 2, webhook guarantees, or live BC sync unless those claims are backed by implemented systems.
6. **Brand activation on auth routes.** The existing `(portal)` shell can opt in globally, but `(auth)/login` needs its own route-local `.brand-plx` wrapper so shadcn token remaps apply.
7. **Dark mode.** Tokens exist. Login must render correctly in light and dark; a user-facing toggle can be deferred if the route follows current theme provider behavior.
8. **Mazius license.** Resolved: webfont files are bundled under SIL Open Font License 1.1. Keep `LICENSE.txt` with any redistributed font copies.

---

## Definition of done

The current login-first plan is ready to implement when:
- `docs/design-system/` states repo-canonical status after Claude Design reconciliation.
- `REFERENCE.md` identifies `specs/portal/portal-login.jsx` as the selected login source.
- `tasks/todo.md` tracks the login-first product/auth/responsive gates.
- `docs/modules/design-system/README.md` reflects the login-first pilot.
- Mock-only login affordances are either removed from the production target or explicitly tracked as future features.
- The login implementation checklist includes loading, invalid-credentials, disabled-account, registered-success, reset-success, success, forced-reset, light, dark, and mobile states.
- Auth behavior fixes are scoped before visual replacement.

---

*This plan is a contract between design and engineering. If reality diverges, update this file in the same PR that diverges. Don't let the plan drift.*
