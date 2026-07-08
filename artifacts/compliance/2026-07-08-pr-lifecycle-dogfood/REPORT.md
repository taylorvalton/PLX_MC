# EN-007 P5 — PR lifecycle dogfood evidence

**Date:** 2026-07-08  
**Project:** `pr-lifecycle-fleet-enforcement` (EN-007)  
**Operator:** vince@petrasoap.com  
**Verdict:** Pass — task stages flipped to `merged` in MC DB, `task.promoted` events recorded, SharePoint ToDos pushed on sweep.

## Summary

Two **dogfood** PRs (one on `PLX_MC`, one on `plx-customer-portal`) were opened with `MC-Checkout` stamps, passed the compliance gate in **hard** mode, and merged. Initial webhook ingestion recorded `pr.merged` + `task.promotion.requested` but **did not** project task state because Vercel **Production** was still on commit `fae743a` (deployed 15:47 UTC) while projection code landed in PR #105 (merged 18:17 UTC). Operator replayed `projectPullRequest` against the production DB using code at `ea708be`, then ran a SharePoint outbound sweep. Both tasks now show `stage=merged`, populated `prs[]`, `sync_state=synced`, and audit rows.

## Dogfood PRs

| Repo | PR | Task | Checkout | Merged (UTC) |
|------|-----|------|----------|--------------|
| `taylorvalton/PLX_MC` | [#106](https://github.com/taylorvalton/PLX_MC/pull/106) | TASK-264 | `dsp_mrcen0lnwlw796` | 2026-07-08T18:29:11Z |
| `taylorvalton/plx-customer-portal` | [#129](https://github.com/taylorvalton/plx-customer-portal/pull/129) | TASK-265 | `dsp_mrcen7mfclb1xi` | 2026-07-08T18:28:57Z |

## DB state (after replay + sweep)

```text
TASK-264 | stage=merged | sync_state=synced | sp_item_id=57
  prs=[{repo:PLX_MC, num:106, status:merged}]

TASK-265 | stage=merged | sync_state=synced | sp_item_id=58
  prs=[{repo:plx-customer-portal, num:129, status:merged}]
```

## `mc_events` timeline (selected)

| seq | kind | task | pr | repo |
|-----|------|------|-----|------|
| 1530 | pr.opened | TASK-264 | 106 | PLX_MC |
| 1531 | pr.opened | TASK-265 | 129 | plx-customer-portal |
| 1540 | gate.passed | TASK-264 | 106 | PLX_MC |
| 1541 | gate.passed | TASK-265 | 129 | plx-customer-portal |
| 1542 | pr.merged | TASK-265 | 129 | plx-customer-portal |
| 1543 | task.promotion.requested | TASK-265 | 129 | plx-customer-portal |
| 1544 | pr.merged | TASK-264 | 106 | PLX_MC |
| 1545 | task.promotion.requested | TASK-264 | 106 | PLX_MC |
| **1546** | **task.promoted** | TASK-264 | 106 | PLX_MC |
| **1547** | **task.promoted** | TASK-265 | 129 | plx-customer-portal |

## `sync_audit_log` (selected)

| id | actor | body | state |
|----|-------|------|-------|
| 94–95 | compliance-projection | Edited TASK-264 (stage) — pending push. | pending |
| 96–97 | compliance-projection | Edited TASK-265 (stage) — pending push. | pending |
| **98** | p5-dogfood-replay | Sweep completed — **2 outbound pushes**, 0 inbound changes. | synced |

## Root cause — deploy window

| Observation | Value |
|-------------|-------|
| Last Vercel Production deploy (pre-replay) | `fae743a` @ 2026-07-08T15:47:33Z |
| Projection code merged (#105) | `0e3e484` @ ~18:17Z |
| Dogfood merges | ~18:28–18:29Z |
| `COMPLIANCE_PROJECTION_ENABLED` | default on (not `=0`) |

**Action required:** redeploy MC Production to `main` (`ea708be` or later) so live webhooks invoke `projectPullRequest` without operator replay.

## Operator replay procedure (used 2026-07-08)

1. `P5_DOGFOOD_REPLAY=1` vitest run calling `projectPullRequest` for opened + closed/merged events (checkout-resolved task IDs).
2. `runSweep("p5-dogfood-replay")` — 2 outbound ToDos pushes.

## Acceptance mapping

- [x] Merged PR on PLX_MC + portal with `MC-Checkout`
- [x] Task `stage=merged` in DB with `prs[]` attachment
- [x] `task.promoted` events (not just `task.promotion.requested`)
- [x] SharePoint sync audit row after sweep
- [x] Hard-mode compliance gate passed before merge
