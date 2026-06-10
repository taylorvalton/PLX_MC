# Module: design-system

## What

The PLX brand surface for Mission Control: `--p-*` design tokens (light +
dark), the Mazius/Inter/JetBrains Mono type system, brand primitives
(`BrandBoundary`, `Kicker`, `MonoData`, `PMark`, `AuthStatusBanner`), and the
canonical design governance docs. It owns visual identity only — it is NOT a
component library for product features (those compose on top of it).

## Why

Mission Control is the fourth brand surface under ADR-002 (Portal, MRP,
Homepage being the others). Sharing one token layer with a documented sync
path prevents the two repos from silently forking the Petra Lab-X visual
language. See `docs/design-system/decisions/ADR-003-mission-control-surface.md`.

## How

- Tokens activate only inside a `.brand-plx` / `data-brand="plx"` boundary —
  opt-in by design; wrap branded routes in `<BrandBoundary>`.
- Components consume `--p-*` variables (or remapped shadcn role variables);
  raw hex in components is a contract violation (enforced rule in
  `config/governance-contract.yaml` → code_standards.typescript).
- Brand authority lives upstream in `plx-customer-portal`; token value changes
  sync from there with provenance recorded in
  `docs/design-system/HANDOFF-README.md`. Surface-local ADRs (layout, chrome)
  may be added here without upstream sign-off.
- Responsive governance: exactly three breakpoints (≥1025 / 641–1024 / ≤640),
  44px touch targets, tables are the only horizontal-scroll surface.

## Dependencies

`clsx` + `tailwind-merge` (the `cn()` helper in `src/lib/utils/utils.ts`).
Depended on by: web (all screens).

### Key Files

- `src/styles/brand-tokens.css` — runtime tokens (imported by global CSS)
- `src/components/brand/` — primitives + barrel `index.ts`
- `public/brand/`, `public/fonts/mazius/` — logos, favicons, webfonts (OFL 1.1)
- `docs/design-system/` — canonical governance copy (tokens, ADRs, specs)
- `tests/brand.test.ts` — barrel import canary

## Owner

Vince

## Criticality

High
