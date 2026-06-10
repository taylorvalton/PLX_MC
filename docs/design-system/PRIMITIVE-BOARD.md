# PLX Primitive Board

> Durable review artifact for the PLX design-system primitives. Cursor Canvas
> remains useful for live review, but this file is the repo-local record that
> survives sessions and PR review.

## Source

- Canonical system: `docs/design-system/README.md`
- Token source: `docs/design-system/tokens.css`
- Runtime mirror: `portal/src/styles/brand-tokens.css`
- Component inventory: `docs/design-system/COMPONENT-INVENTORY.md`
- Active pilot: `docs/design-system/specs/portal/portal-login.jsx`

## Visual Contract

PLX is not a generic SaaS skin. The primitives preserve the Claude handoff
language:

- Warm paper surfaces: `--p-paper`, `--p-paper-2`, `--p-card`
- Near-black ink hierarchy: `--p-ink`, `--p-ink-2`, `--p-muted`
- One restrained accent: rust `--p-accent`
- Status tones: sage, amber, steel, tomato
- Hairline chrome instead of shadows
- Serif only for editorial/legal moments
- Mono labels for metadata, IDs, timestamps, and numeric data

## Extracted Now

| Primitive | Status | Production use |
|---|---|---|
| `BrandBoundary` | Extracted | Route-local `.brand-plx` activation without global restyling. |
| `Kicker` | Existing | Mono uppercase section labels. |
| `MonoData` | Existing | Tabular numeric and code spans. |
| `PMark` | Extracted | Periodic-table glyph for auth instrumentation and future workbench rows. |
| `AuthStatusBanner` | Extracted | Accessible auth success/info/warning/error feedback. |
| `Button variant="brand"` | Existing | Ink-on-paper primary action. |
| `Button variant="brand-ghost"` | Existing | Hairline secondary action. |
| `Badge variant="chassis"` | Existing | Neutral chassis status badge base. |

## Deferred

These remain out of `components/brand/` until a screen consumes them:

| Primitive | Defer until |
|---|---|
| `RunningHead` | Project detail or sign-off needs folio metadata strips. |
| `ChassisTicks` | A reusable folio/deed surface consumes corner ticks. |
| `ChassisFolio` | Sign-off or project detail needs a formal paper surface. |
| `WritStamp` | Deed/sign-off flow starts. |
| `AttestationChip` | Regulated legal mode starts. |
| `OpenFlagRow` | Real project flags/deviations are mapped. |
| `SignBlock` | DocuSign embedded signing UI is in scope. |
| `SlateFrame` | Pilot pour, artwork, or regulated asset placeholder is in scope. |

## API Snapshot

```tsx
import {
  AuthStatusBanner,
  BrandBoundary,
  Kicker,
  MonoData,
  PMark,
} from "@/components/brand";

<BrandBoundary>
  <Kicker>/ 001 - Authenticate</Kicker>
  <PMark num="14" sym="Px" label="PLX client workbench" />
  <MonoData>PLX-2614</MonoData>
  <AuthStatusBanner tone="success" title="Account created">
    Your account is ready. Sign in to continue.
  </AuthStatusBanner>
</BrandBoundary>
```

## Accessibility Rules

- `AuthStatusBanner tone="danger"` uses `role="alert"`.
- `AuthStatusBanner` non-danger tones use `role="status"`.
- `PMark` needs `label` when it carries meaning.
- Decorative `PMark` instances are hidden from assistive technology.
- Auth forms keep labels above inputs and errors below inputs.

## Token Drift Guard

`npm run audit:tokens` checks:

- `docs/design-system/tokens.css`
- `portal/src/styles/brand-tokens.css`
- `docs/design-system/tokens.ts`

The guard compares selector-scoped CSS tokens, so `:root --p-paper` and
`.dark --p-paper` are distinct values.

## Review Gate

Before applying these primitives to more screens:

1. `npm run audit:tokens` passes.
2. `npm run lint` passes.
3. `npx tsc --noEmit` passes.
4. The target route has loading, error, empty or success states specified.
5. Mobile layout uses `min-h-[100dvh]` for full-height surfaces.
6. Customer-facing routes do not import deprecated FM helpers or `/api/fm/*`; source mapped values from Prisma tables before visual migration.
