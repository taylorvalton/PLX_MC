# ADR-003: Mission Control as a Fourth Brand Surface

**Status:** Accepted
**Date:** 2026-06-10
**Extends:** ADR-002 (surface architecture)

## Context

ADR-002 established one shared PLX brand-token layer serving multiple surfaces, each with its own components and route-level rollout gates: Portal (customers), MRP (internal operations), and Homepage (public marketing, sibling track).

PLX Mission Control is a new product in its own repository (`PLX_MC`). It must speak the same brand language as the Portal without forking it.

## Decision

Mission Control is registered as the **fourth surface** under the ADR-002 architecture:

- **Same token layer.** `--p-*` tokens and the shadcn role-variable remap are consumed verbatim from the design system. No new token namespace, no value changes without a brand revision upstream.
- **Own components.** Mission Control builds its own composition layer on the shared primitives (`BrandBoundary`, `Kicker`, `MonoData`, `PMark`). Portal/MRP domain components are not imported.
- **Opt-in boundary.** Tokens activate via `.brand-plx` / `data-brand="plx"` exactly as in the Portal. No global activation.
- **Snapshot provenance.** This repo's copy of `docs/design-system/` was forked from `plx-customer-portal` branch `staging`, commit `c92f1df5697a4e109dcd0b7d2dc0000f8cb06905` (2026-05-19). See `HANDOFF-README.md`.

## Source-of-truth rule between repos

The Portal repo (`plx-customer-portal`) remains the **brand authority**. Token value changes, new ADRs about brand vocabulary, and asset revisions happen there first and are synced here with the provenance commit updated in `HANDOFF-README.md`.

Mission Control may add **surface-local** decisions (layout, chrome, navigation patterns) as ADRs in this folder without upstream sign-off, provided they do not alter token values or the brand vocabulary.

## Consequences

- Both products share one visual identity with a documented sync path instead of a silent fork.
- Drift is detectable: diff this repo's `tokens.css` against the Portal's at the recorded provenance commit.
- The responsive governance in `RESPONSIVE.md` (three breakpoints, 44px touch targets, table-only horizontal scroll) applies to Mission Control screens unchanged.
