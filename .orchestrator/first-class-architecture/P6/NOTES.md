# P6 — Discoverability, dual-audience review, evidence closeout

## Branch
`proj/first-class-architecture/phase-6-discoverability`

## Base
- Created from `proj/first-class-architecture/phase-5-hub-seed` @ `88004bf2d67eef4d453a11ca9ca98586bfefa060`
- Merged `proj/first-class-architecture/phase-3-ci-parity` @ `385e612e6013467ebba5b6d0855f8d1143ed02b4` (clean ort merge)

## Worktree
- `WORKTREE_ID=fca-p6-fc24cead`
- `WORKTREE_PATH=C:\Users\vince\.cursor\worktrees\fca-p6-fc24cead`
- Setup: no `.cursor/worktrees.json` in REPO_ROOT or WORKTREE_PATH — skipped

## Delivered
1. `AGENTS.md` — Runtime Entry Points + Architecture table rows link to `/?screen=architecture` and `docs/architecture/`.
2. `README.md` — Architecture block links to in-app screen and `docs/architecture/`.
3. `artifacts/platform/2026-07-17-first-class-architecture/` — REPORT, index, technical-review, nontechnical-review (SC1–SC8 verdicts; five invariants recoverable).

## Out of scope / forbidden respected
- No edits under `src/**`, `scripts/**`, `.github/workflows/**`.

## MC
- Task: TASK-501
- Checkout stamp: `MC-Checkout: dsp_mrozcfc51hd10o`
- Human owner: Vince

## Acceptance
- P6 scoped gates (rg, REPORT.md, check-architecture-diagrams.py): exit 0
- Full `./scripts/preflight.sh --mode pre-push`: exit 1 — Docker Desktop unavailable (`tests/routing-postgres.test.ts`); environment blocker, not P6 diff
