---
name: project-hardener
description: Drive an integrated project branch to near-perfect quality with a bounded convergence loop: detect failures (full suite, E2E, lint, typecheck), triage findings, run adversarial fixer and auditor passes, and prove zero regressions versus a pre-harden baseline. Use when the user says "harden this", "drive to near-perfect", "fix bugs and tighten before merge", "post-build convergence", or asks for final quality hardening after implementation.
---

# PLX Mission Control — project-hardener adapter

This repo carries PLX-specific hardening scripts under `scripts/`. The full skill
contract (lifecycle, taxonomy, stop conditions, Edge-3 escalation) lives in
`agentic-swarm` at `.cursor/skills/project-hardener/SKILL.md`. Global install:
`git pull && .cursor/install-skills.sh` in that repo.

## PLX scripts (use these paths in this repo)

```bash
bash .cursor/skills/project-hardener/scripts/baseline-snapshot.sh \
  --out .orchestrator/<slug>/hardener/baseline.env \
  --tests-cmd "./scripts/preflight.sh --mode pre-push" \
  --lint-cmd "npm run lint" \
  --typecheck-cmd "npm run typecheck"

bash .cursor/skills/project-hardener/scripts/regression-diff.sh \
  --baseline .orchestrator/<slug>/hardener/baseline.env \
  --tests-cmd "./scripts/preflight.sh --mode pre-push"
```

Gate commits with `./scripts/preflight.sh` and record work on VMC tasks via `vmc-sync`.
