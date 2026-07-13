# REPORT — petralabx GitHub PAT promote + org-wide wiring

## Verdict
`PETRALABX_GITHUB` promoted staging → prod (aliased `PETRALABX_GITHUB_TOKEN`).
**Org coverage OK: 9/9** petralabx repos for both PAT (`push`+`pull`) and GitHub App install.
PLX_MC wiring: owner-aware PAT fallback + workstation bootstrap.

## Org repos verified (2026-07-13)

| Repo | PAT | App install |
|------|-----|-------------|
| petralabx/1hr-after | push+pull | yes |
| petralabx/agentic-swarm | push+pull | yes |
| petralabx/for-and-against | push+pull | yes |
| petralabx/furgenics | push+pull | yes |
| petralabx/local-inference | push+pull | yes |
| petralabx/plx-customer-portal | push+pull | yes |
| petralabx/PLX_MC | push+pull | yes |
| petralabx/skills | push+pull | yes |
| petralabx/test-perms-check | push+pull | yes |

Gaps: none (`SUMMARY_PAT_FAIL` / `SUMMARY_NO_PUSH` / `SUMMARY_MISSING_FROM_APP` = none).

## Secrets
- Staging key name used: `PETRALABX_GITHUB`
- Prod: `PETRALABX_GITHUB` + `PETRALABX_GITHUB_TOKEN`
- Staging alias `PETRALABX_GITHUB_TOKEN` ensured

## Code / docs (this PR)
- `resolveGithubToken` — petralabx prefers org PAT; other owners keep legacy `GITHUB_TOKEN`
- `scripts/bootstrap-windows-secrets.py` — exports `PETRALABX_GITHUB_TOKEN`
- Module + provisioning runbook updated
- `tests/github-app.test.ts` covers preference + non-petralabx isolation

## Operator follow-through
1. Re-run `python scripts/bootstrap-windows-secrets.py` on agent boxes.
2. If `~/.aws/Secret_Github.txt` still holds the old limited PAT, remove or replace it so local `GITHUB_TOKEN` can inherit the org PAT (or rely on `PETRALABX_GITHUB_TOKEN`).
3. Ensure MC/Vercel env eventually includes `PETRALABX_GITHUB_TOKEN` for PAT-fallback hosts (App-only Vercel already covers reads via install).
4. New org repos: App “all repositories” auto-includes; confirm PAT still org-wide.

## Rollback
Revert Secrets Manager `prod/ec2-secrets` to prior version stage; revert this PR.
