# CLOUD-WIRING-VERDICT — TASK-682

**Date:** 2026-07-24  
**SPEC:** approved (Vince, 2026-07-24T12:01:00Z)  
**Environment:** `2d1524f6-8755-11f1-a7d1-d6b4613131ce`  
**Run:** https://cursor.com/agents/bc-ac2127f2-cc87-4c48-9746-40925d4e4f06

## Verdict

**REPO DELIVERABLES: PASS** · **TEAM RULES: PASS** · **TEAM MCP VISIBLE TO THIS RUN: FAIL** · **FRESH-AGENT VERIFY: PENDING**

| Check | Result | Evidence |
|---|---|---|
| SPEC approved | PASS | SPEC frontmatter `status: approved` |
| Fleet always-apply paste source | PASS | `config/cloud-agent-fleet-always-apply.md` |
| Team Rules created (dashboard) | PASS | Audit `team_rule` 2026-07-24T12:19–12:21Z — rules 18212–18215, active+required |
| REST `mc_self_check` / checkout | PASS | This run via hydrated key |
| This session MCP catalog includes PLX-MC | FAIL | Only `cursor-cloud` (re-checked after rules paste) |
| Team MCP Hub/Portal registered historically | LIKELY YES | Audit create 2026-07-20 20:34Z, no later delete |
| Fresh Cloud Agent verify | PENDING | Needs Hub/Portal enabled for Cloud + new `bc-…` |

### Team Rules audit (Vince)

| rule_id | name | action | time (UTC) |
|---|---|---|---|
| 18212 | Rule 1 — Mission Control checkout & evidence | create→update | 12:19 / 12:20 |
| 18213 | Rule 2 — Thin fleet governance pillars | create | 12:21:10 |
| 18214 | Rule 3 — Openable file paths (Cloud-safe) | create | 12:21:22 |
| 18215 | Rule 4 — PLX-MC MCP expected in Cloud | create | 12:21:30 |

## Remaining checklist

- [x] Paste fleet Team Rules
- [ ] Confirm/re-enable Team MCP HTTP `PLX-MC-Hub` + `PLX-MC-Portal` for Cloud + this environment ([Integrations](https://cursor.com/dashboard/integrations))
- [ ] Fresh Cloud Agent: MCP catalog shows Hub/Portal; `mc_self_check` / `mc_checkout_task` via MCP tools
- [ ] Spot-check `local-inference` has no portal token blast radius
- [ ] Flip this verdict to full **CONSOLE CUTOVER: PASS** with new `bc-…` URL

## Kill switches

- Disable Team MCP server entries
- Vercel / server `PLX_MC_MCP_ENABLED=0`
- Remove/deactivate Team Rules 18212–18215
