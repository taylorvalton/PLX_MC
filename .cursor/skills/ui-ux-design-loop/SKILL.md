---
name: ui-ux-design-loop
description: Drive any web surface to near-perfect UI/UX quality with a bounded convergence loop specialized for design-system conformance, interaction wiring, responsive integrity, and accessibility. Composes project-hardener and adds a manifest-driven UI gate pack (G1–G4). Use when the user asks for "UI/UX loop", "harden the UI", "design-system alignment", "fix dead buttons/wiring", "responsive polish", or "accessibility pass" on a web route.
---

# PLX Mission Control — ui-ux-design-loop adapter

This repo is the **PLX_MC reference adapter** for the UI/UX design loop. Repo-specific
bindings are resolved by `scripts/ui-loop-config.mjs` from `ui-loop.config.json`
at the repo root (create or update that manifest before running the loop).

The full gate pack (G1–G4), roles, and enhance-phase contract live in
`agentic-swarm` at `.cursor/skills/ui-ux-design-loop/SKILL.md`.

## Validate the adapter manifest

```bash
node .cursor/skills/ui-ux-design-loop/scripts/ui-loop-config.mjs --selftest
node .cursor/skills/ui-ux-design-loop/scripts/ui-loop-config.mjs --validate ui-loop.config.json
```

## PLX gate scripts

```bash
bash .cursor/skills/ui-ux-design-loop/scripts/ui-conformance-scan.sh --base origin/main
bash .cursor/skills/ui-ux-design-loop/scripts/ui-responsive-matrix.sh
```

Compose with `project-hardener` baseline/regression scripts in this repo. Preview
the app with `npm run dev`; gate commits with `./scripts/preflight.sh`.
