# CLOUD-WIRING-VERDICT — TASK-682

**Date:** 2026-07-24  
**SPEC:** approved (Vince, 2026-07-24T12:01:00Z)  
**Environment:** `2d1524f6-8755-11f1-a7d1-d6b4613131ce`  
**Run:** https://cursor.com/agents/bc-ac2127f2-cc87-4c48-9746-40925d4e4f06

## Verdict

**REPO DELIVERABLES: PASS** · **CONSOLE CUTOVER: BLOCKED (no write API)**

Attempted to execute the three operator moves from this Cloud Agent. Team Rules
and Team MCP registration are **dashboard-only**; Admin API cannot mutate them;
Cloud Agents API rejects the team Admin key (needs user/service-account key).

| Check | Result | Evidence |
|---|---|---|
| SPEC approved | PASS | SPEC frontmatter `status: approved` |
| Fleet always-apply paste source | PASS | `config/cloud-agent-fleet-always-apply.md` |
| Cloud wiring runbook | PASS | `docs/runbooks/cloud-agent-fleet-wiring.md` |
| REST `mc_self_check` with hydrated key | PASS | 2026-07-24 — `ok: true`, `mcpEnabled: true` |
| REST checkout mint | PASS | TASK-681/682 `dsp_*` |
| This session MCP catalog includes PLX-MC | FAIL | Only `cursor-cloud` |
| Team always-apply includes fleet slice | FAIL | No `team_rule` audit events |
| Team MCP Hub/Portal registered historically | LIKELY YES | Audit: create 2026-07-20 20:34Z, no later delete |
| Team MCP visible to this Cloud run | FAIL | Not in MCP tool catalog |
| Portal `--p-*` not in fleet slice | PASS | By design in paste source |
| Swarm dispatch default-OFF | PASS | Documented |

Details: `CONSOLE-CUTOVER-BLOCKED.md`

## Operator cutover checklist

- [ ] Paste rules from `config/cloud-agent-fleet-always-apply.md` into Team Rules
- [ ] Confirm/re-enable Team MCP HTTP `PLX-MC-Hub` + `PLX-MC-Portal` for Cloud + this environment
- [ ] Fresh Cloud Agent verify (`mc_self_check` / `mc_checkout_task` via MCP tools)
- [ ] Spot-check `local-inference` has no portal token blast radius
- [ ] Update this verdict to **CONSOLE CUTOVER: PASS** with new `bc-…` URL

## Kill switches

- Disable Team MCP server entries
- Vercel / server `PLX_MC_MCP_ENABLED=0`
- Remove Team Rules paste
