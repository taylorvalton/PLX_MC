# ADR-004: Mission Control Surface Tokens (`--p-rail`, `--p-canvas`)

**Status:** Accepted
**Date:** 2026-06-10
**Extends:** ADR-003 (Mission Control as a fourth brand surface)

## Context

ADR-003 commits Mission Control to consuming the PLX `--p-*` tokens verbatim
from the brand authority (`plx-customer-portal`), adding only surface-local
decisions that do not change token values.

The runtime token mirror shipped to this repo (`src/styles/brand-tokens.css`)
defines `--p-paper`, `--p-paper-2`, `--p-ink`, `--p-accent`, … but **not**
`--p-rail` or `--p-canvas`. Those two were never promoted into the Portal's
login-lane runtime subset. Mission Control's own design system, however, treats
the three-layer **rail < canvas < paper** hierarchy as fundamental to the
"instrument panel printed on warm stock" look (`docs/product/DESIGN_TOKENS.md`
§1–2). Without `--p-canvas`, page backgrounds are undefined and cards cannot
lift off the surface; without `--p-rail`, the sidebar cannot read as a rail.

## Decision

Add `--p-rail` and `--p-canvas` (light + dark) as **Mission-Control surface
tokens**, scoped to the `.mc` shell in `src/styles/mc-surface.css`.

- **No existing token value changes.** `--p-paper`, `--p-paper-2`, `--p-ink`,
  etc. stay exactly as the Portal mirror defines them. Only the two genuinely
  missing tokens are added.
- **Values are not invented.** They are taken from
  `docs/product/DESIGN_TOKENS.md` and match the precedent already present in
  this repo: `src/styles/mrp-design.css` (`.mrp-shell`) defines the same
  document-model hierarchy for the MRP surface.
- **`brand-tokens.css` is not edited.** It is the Portal runtime mirror that
  must stay in sync with `docs/design-system/tokens.css`; the additions live in
  a Mission-Control-owned stylesheet so the mirror stays clean.
- A small font-name alias (`--mazius`/`--sans`/`--mono` → `--p-font-*`) is
  defined in the same `.mc` scope so the ported prototype skin reads cleanly.

## Consequences

- The MC surface gets its full three-layer hierarchy without forking or
  re-valuing any shared token.
- **Reconciliation path:** if the Portal promotes `--p-rail`/`--p-canvas` into
  `brand-tokens.css` upstream, delete the additions here and consume the global
  values. Until then, the two definitions (here and in `mrp-design.css`) share
  the documented `DESIGN_TOKENS.md` values; a value drift between them is a
  hygiene failure to catch in review.
- This is a surface-local decision under ADR-003 (no shared-token value change),
  so it does not require upstream brand sign-off — but it is recorded here so
  the two repos do not silently diverge.
