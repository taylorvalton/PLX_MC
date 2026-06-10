# PLX_MC

PLX Mission Control.

## Design system

This repo carries the PLX design system, forked from `plx-customer-portal` (`staging` @ `c92f1df5`, 2026-05-19). Mission Control is the fourth brand surface under ADR-002 — see `docs/design-system/decisions/ADR-003-mission-control-surface.md`.

```
docs/design-system/        ← canonical governance copy (tokens, ADRs, specs, migration docs)
src/styles/                ← brand-tokens.css (runtime tokens) + mrp-design.css (optional MRP chrome)
src/components/brand/      ← brand primitives: BrandBoundary, Kicker, MonoData, PMark, AuthStatusBanner
src/lib/utils/utils.ts     ← cn() helper the brand components depend on
public/brand/              ← logos, favicons, marks
public/fonts/mazius/       ← Mazius Display webfonts (SIL OFL 1.1)
```

Read `docs/design-system/HANDOFF-README.md` first — it contains the full integration contract and the rules that must not be broken (`--p-*` namespace, three fixed breakpoints, opt-in `.brand-plx` boundary).

## Wiring the app (when scaffolding Next.js)

1. Scaffold with the App Router; keep the existing `src/` and `public/` contents in place.
2. Install the component deps: `clsx`, `tailwind-merge` (and shadcn/ui when needed).
3. In your global CSS: `@import "../styles/brand-tokens.css";`
4. In `app/layout.tsx`, load fonts exactly as documented in `docs/design-system/HANDOFF-README.md` §5 (Mazius Display via `next/font/local`, Inter + JetBrains Mono via `next/font/google`) and point favicon metadata at `/brand/*`.
5. Wrap branded routes in `<BrandBoundary>` (or a `.brand-plx` shell) — tokens are opt-in by design.
