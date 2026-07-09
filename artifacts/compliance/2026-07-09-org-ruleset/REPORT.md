# Org ruleset + EN-008 transfer evidence

**Date:** 2026-07-09  
**Operator:** agent session (Vince accountable)  
**Verdict:** EN-008 platform transfers **done**. Org required-workflow ruleset **blocked** — GitHub API still reports `petralabx` plan `free` (rulesets 403). Script + runbook ready; re-run after Team is active.

## EN-008 transfers

| Before | After | Notes |
|--------|-------|-------|
| `taylorvalton/PLX_MC` | [`petralabx/PLX_MC`](https://github.com/petralabx/PLX_MC) | public; branch protection `compliance` retained |
| `taylorvalton/plx-customer-portal` | [`petralabx/plx-customer-portal`](https://github.com/petralabx/plx-customer-portal) | private |
| `taylorvalton/agentic-swarm` | [`petralabx/agentic-swarm`](https://github.com/petralabx/agentic-swarm) | private |

Registries, MCP `MC_REPO`, `GEN_REPO`, DB `repos.owner`, fleet scripts, and tests updated to `petralabx/*`.

## Org plan (blocker for Track C)

```json
{"login":"petralabx","plan":"free","seats":4,"filled":7}
```

```text
GET /orgs/petralabx/rulesets → 403 Upgrade to GitHub Team to enable this feature.
```

`./scripts/provision-org-ruleset-required-workflows.sh` fail-closes with the same message (exit 1).  
`--dry-run` is unreachable until Team unlocks the list API.

## Branch protection after transfer

| Repo | Result |
|------|--------|
| `petralabx/PLX_MC` (public) | OK — `compliance` required on `main` |
| `petralabx/plx-customer-portal` (private) | 403 — needs Team/Pro for private branch protection API |
| `petralabx/agentic-swarm` (private) | 403 — same |

## Operator next steps (when Team is live)

1. Confirm `gh api orgs/petralabx --jq .plan.name` returns `team` (or higher).
2. `./scripts/provision-org-ruleset-required-workflows.sh`
3. `./scripts/provision-fleet-branch-protection.sh` (restores private-repo protection).
4. Reconnect Vercel projects to `petralabx/PLX_MC` and `petralabx/plx-customer-portal`.
5. Confirm GitHub App installation covers the three transferred repos under the PLX install id.

## Related

- Script: `scripts/provision-org-ruleset-required-workflows.sh`
- Runbook Step 9: `docs/runbooks/compliance-gate-rollout.md`
- EN-008: `docs/runbooks/github-org-phased-migration.md`
