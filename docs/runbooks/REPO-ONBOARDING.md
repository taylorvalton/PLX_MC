# Runbook: Onboarding a repo into PLX governance

**Audience:** maintainers / org admins adding a repository to the PLX-tracked fleet.  
**Owner:** Vince · **Effective:** 2026-07-06

Canonical inputs (all in this repo — the SSOT):

| Artifact | Path |
|----------|------|
| Governance contract | `config/governance-contract.yaml` |
| PR / MC discipline | `docs/COLLABORATOR-SOP.md` |
| Fleet registry | `config/tracked-repos-registry.json` |
| Scaffold script | `scripts/scaffold-tracked-repo.sh` |
| CONTRIBUTING stub | `docs/templates/CONTRIBUTING.repo-stub.md` |
| Drift-check template | `docs/templates/compliance-gate-drift.yml.tpl` |

Consumer repos get thin layers only — **never copy the contract**:

- `docs/GOVERNANCE.md` — pointer to PLX_MC (no duplicated rules)
- `CONTRIBUTING.md` — branch / deploy / validation specifics only
- `.github/workflows/plx-mc-compliance.yml` — generated from
  `scripts/generate-compliance-gate.py --emit downstream`
- `.github/workflows/compliance-gate-drift.yml` — pins the generator SHA and
  fails CI if the committed gate drifts from the PLX_MC source

---

## 1. Register the repo

1. Add an entry to `config/tracked-repos-registry.json` with
   `status: "pending_adoption"`. Pick a tier:

   | Tier | Meaning | Examples |
   |------|---------|----------|
   | `hub` | PLX_MC itself | `taylorvalton/PLX_MC` |
   | `product_app` | Customer-facing app | `plx-customer-portal` |
   | `product_platform` | Internal platform / swarm | `agentic-swarm` |
   | `skills` | Skill content repos | `petralabx/skills` |
   | `tooling` | Scripts / research / utilities | `petralabx/local-inference` |
   | `sandbox` | Temporary / experimental | `petralabx/test-perms-check` |

2. Open a PR to PLX_MC `main` with the registry change (hard compliance mode —
   agent PRs must carry an `MC-Checkout` stamp; see COLLABORATOR-SOP).

## 2. Scaffold the consumer repo

From a PLX_MC clone root, with the target repo cloned locally:

```bash
./scripts/scaffold-tracked-repo.sh \
  --repo <owner>/<name> --tier <tier> --branch <integration-branch> \
  --target /path/to/local/clone
```

- `--workflows-only` regenerates just the two workflow files (use when the
  gate generator changes and you need to re-sync a fleet repo).
- The script embeds the current PLX_MC HEAD SHA as `GEN_SHA` in the drift
  check. Commit from a PLX_MC checkout that is on `main` (or the merged hub
  commit) so the pinned SHA is fetchable from GitHub raw.
- `hub` tier is a no-op by design — PLX_MC uses COLLABORATOR-SOP directly.

## 3. Open the adoption PR on the consumer repo

Commit the four files on a branch (`chore/adopt-plx-governance`), open a PR to
the integration branch. Review that CONTRIBUTING's validation commands match
the repo's real test/build entry points — edit them; that section is
repo-owned.

## 4. Operator wiring (per repo)

1. **Secrets:** `PLX_MC_BASE_URL` (`https://mc.plxcustomer.io`),
   `COMPLIANCE_CI_TOKEN`.
2. **Variable:** `COMPLIANCE_MODE` — start `soft` (warn-only). Flip to `hard`
   only after the gate has run clean for a while.
3. **Branch protection** on the integration branch: require PR + status checks
   `compliance` (and the repo's CI contexts).

## 5. Activate

After the adoption PR merges and the gate runs green: PR to PLX_MC flipping
the repo's `status` to `"active"` in `config/tracked-repos-registry.json`.

---

## Deactivating / archiving

Set `status` to `"archived"` (or remove the entry) via PLX_MC PR; remove the
two workflows in the consumer repo if the repo lives on outside the fleet.

## Troubleshooting

- **`drift` check fails on the consumer repo** — the committed
  `plx-mc-compliance.yml` no longer matches the pinned generator. Re-run the
  scaffold with `--workflows-only` from current PLX_MC `main`, or bump
  `GEN_SHA` if the generator changed intentionally.
- **Gate startup-fails calling a reusable workflow** — expected; that's why
  the gate is a generated self-contained copy, not a `workflow_call` (private
  repo → public reusable with `secrets: inherit` startup-fails).
- **`compliance` skips** — `PLX_MC_BASE_URL` secret unset; the downstream gate
  no-ops without it (soft adoption path).
