# Module: web

## What

The Next.js (App Router) application shell — the Mission Control UI. Currently
a scaffold: root layout (fonts, favicon metadata, global CSS) and a branded
placeholder home page. It owns routing, screens, and client state only — it is
NOT the system of record (SharePoint is) and NOT the sync engine (a future
`sync` module per `docs/product/SHAREPOINT_INTEGRATION.md`).

## Why

The product is a fast, opinionated lens over the SharePoint record. The
screens to build (Inbox, Board/List/Timeline, Traceability, Agent activity,
Bucket detail, Task detail, Sync console, Files, New Task modal) are specified
pixel-precisely in `docs/product/README.md` §6 and
`docs/product/screenshots/SCREENS.md`.

## How

- App Router under `src/app/`; brand wiring per
  `docs/design-system/HANDOFF-README.md` §5 (three font families as CSS
  variables on `<html>`, tokens imported in `globals.css`, branded routes
  wrapped in `<BrandBoundary>`).
- Rebuild screens from the handoff spec — treat `docs/product/prototype/` as
  the look/behavior spec, never as code to lift verbatim.
- Verification: `npm run typecheck`, `npm run lint`, `npm run test`,
  `npm run build` — all wrapped by `scripts/preflight.sh`.

## Dependencies

design-system (tokens + primitives). Future: the sync module's API surface
(`docs/product/SHAREPOINT_INTEGRATION.md` §6) replaces the prototype's
`window.MC_*` mutations.

### Key Files

- `src/app/layout.tsx` — root layout: fonts, metadata, global CSS
- `src/app/page.tsx` — branded placeholder home
- `src/app/globals.css` — imports `brand-tokens.css`
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`

## Owner

Vince

## Criticality

Critical
