# Compliance OIDC Verify Evidence

## Mission

Replace bearer-only auth on `POST /api/compliance/verify` with GitHub Actions
OIDC as first-class auth, dual-auth cutover, dogfood on `petralabx/PLX_MC`, and
a mergeable PR. Bearer (`COMPLIANCE_CI_TOKEN`) remains as fallback/break-glass
until OIDC dogfood proves green.

## Work Context

- Task: [TASK-297](https://mc.plxcustomer.io/tasks/TASK-297)
- Checkout: `MC-Checkout: dsp_mrdittqo7fml8s`
- Bucket: `BKT-MISSION-CONTROL-OPS`
- Owner: Vince (`vince@petrasoap.com`)
- Delivery branch: `feat/compliance-verify-oidc`
- Base: `origin/main` @ `bdf98f5`

## What Changed

### P1 — OIDC module + secrets + jose
- `src/lib/compliance/github-oidc.ts` — JWKS-validated GitHub Actions OIDC JWT
  verify (`iss`, `aud`, repo allowlist; fail-closed when misconfigured)
- `src/lib/secrets.ts` — `complianceOidcEnabled/Audience/RepoAllowlist/Configured`
- `jose` promoted to direct dependency
- `tests/compliance-github-oidc.test.ts` — 9 contract tests

### P2 — Dual-auth verify route
- `src/app/api/compliance/verify/route.ts` — OIDC first when enabled+configured,
  constant-time bearer fallback; 503 when neither configured; uniform 401
- `tests/compliance-verify-route.test.ts` — 10 contract tests (19 with OIDC module)

### P3 — Workflow OIDC + bearer fallback
- `.github/workflows/compliance-gate.yml` — `id-token: write`, audience
  `plx-mc-compliance-verify`, `auth=oidc` / `auth=bearer-fallback` logging
- `scripts/generate-compliance-gate.py` — generator BODY aligned (preflight drift gate)

### P4 — Docs + evidence
- `docs/runbooks/compliance-gate-rollout.md` — OIDC first-class, cutover, kill switch
- `docs/modules/compliance/README.md` — OIDC module + dual-auth key files
- This bundle

## Verification (local, exit 0)

```text
npx vitest run tests/compliance-github-oidc.test.ts tests/compliance-verify-route.test.ts
→ 19 passed

./scripts/preflight.sh --mode pre-commit
→ All pre-commit checks passed

./scripts/preflight.sh --mode pre-push
→ All pre-push checks passed (833 vitest + python suite + next build + e2e)
```


## PR / CI (2026-07-09)

- PR: https://github.com/petralabx/PLX_MC/pull/112
- Head: `ba4fe9b`
- CI Preflight + full suite: **success** (run 29021273285)
- Compliance gate: **PASS** with `auth=bearer-fallback` (run 29021273058) — expected until OIDC enabled post-deploy
- Vercel pre-staged: `COMPLIANCE_OIDC_AUDIENCE`, `COMPLIANCE_OIDC_REPO_ALLOWLIST`; `COMPLIANCE_OIDC_ENABLED` still unset; `COMPLIANCE_CI_TOKEN` present

## Deploy And Dogfood Evidence

- SC 7 deploy evidence: **TODO** — after merge, set on Vercel/SM (booleans only):
  `COMPLIANCE_OIDC_ENABLED=1`, `COMPLIANCE_OIDC_AUDIENCE=plx-mc-compliance-verify`,
  `COMPLIANCE_OIDC_REPO_ALLOWLIST=petralabx/PLX_MC`; keep `COMPLIANCE_CI_TOKEN`
  present. Confirm READY on `mc.plxcustomer.io` and record deploy SHA here.
- SC 8 dogfood evidence: **TODO** — re-run compliance on this PR (or a follow-up
  sync) after deploy; workflow log must show `auth=oidc` and check PASS.
  Do not retire bearer before this passes.

## Rollback Plan

1. Runtime: `COMPLIANCE_OIDC_ENABLED=0` → bearer-only (token still configured).
2. Per-repo: unset `PLX_MC_BASE_URL` → gate skips (exit 0).
3. Code: revert this PR (no migrations / schema / secret rotations).

## Follow-Up

- Bearer is **not retired** in this PR.
- Fleet (`agentic-swarm`, `plx-customer-portal`) = Phase 2 after PLX_MC OIDC dogfood.
- Downstream copies of the gate must be regenerated from
  `python scripts/generate-compliance-gate.py --emit downstream`.

## Deploy / OIDC enable (2026-07-09)

- Merge: https://github.com/petralabx/PLX_MC/pull/112 (`f57b02fd`)
- Production deploy: `dpl_52pkPJFHcRoNy1ZeSZkW4KHC1VZ4` READY → `mc.plxcustomer.io`
- Env (booleans/config only): `COMPLIANCE_OIDC_ENABLED=1`, audience + allowlist set, `COMPLIANCE_CI_TOKEN` still present
- Live probes: missing/bad auth → 401; valid bearer → 200 pass
