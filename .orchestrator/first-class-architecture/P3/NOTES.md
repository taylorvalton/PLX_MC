# P3 — CI parity for architecture diagram pack

- phase: P3
- branch: proj/first-class-architecture/phase-3-ci-parity
- base: proj/first-class-architecture/phase-2-diagram-pack @ ab655597b43378daadaf9cd13b2722cbc0bcbcad
- MC: TASK-501
- MC-Checkout: dsp_mrozcfc51hd10o
- worktree: C:\Users\vince\.cursor\worktrees\fca-p3-c2d5609e
- WORKTREE_ID: fca-p3-c2d5609e

## Delivered

1. `scripts/check-architecture-diagrams.py` — verifies context/containers/task-lifecycle `.mmd`+`.svg`, required honesty phrases in the `.mmd` set, hosting signal (`mc.plxcustomer.io` or `Vercel`), and forbids honesty-oracle lies under `docs/architecture/`.
2. Left `scripts/check-arch-parity.py` unchanged (honesty-oracle maturity gate intact).
3. Wired diagram gate into `scripts/preflight.sh` `run_policy()` immediately after arch-parity.
4. `tests/test_check_architecture_diagrams.py` — tempdir exit-code coverage + committed-pack smoke.
5. This P3 artifact bundle.

## Acceptance (exit 0)

- `python scripts/check-arch-parity.py` → 0
- `python scripts/check-architecture-diagrams.py` → 0
- `./scripts/preflight.sh --mode pre-commit` → 0 (Git Bash)

## Scope

Wrote only under owns: scripts (check-architecture-diagrams + preflight), tests, `.orchestrator/first-class-architecture/P3/**`. Did not touch `src/components/**` or `.github/workflows/compliance*.yml`.
