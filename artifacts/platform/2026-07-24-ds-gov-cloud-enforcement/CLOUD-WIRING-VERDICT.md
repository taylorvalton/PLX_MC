# CLOUD-WIRING-VERDICT — TASK-682

**Date:** 2026-07-24  
**SPEC:** approved (Vince, 2026-07-24T12:01:00Z)  
**Environment:** `2d1524f6-8755-11f1-a7d1-d6b4613131ce`  
**Run:** https://cursor.com/agents/bc-ac2127f2-cc87-4c48-9746-40925d4e4f06

## Verdict

**REPO DELIVERABLES: PASS** · **CONSOLE CUTOVER: PENDING OPERATOR**

In-repo wiring artifacts are landed. Live Cloud always-apply + Team MCP attachment
still require Vince to paste/enable settings in the Cursor dashboard (agents cannot
mutate Team Rules / Team MCP from this runtime).

| Check | Result | Evidence |
|---|---|---|
| SPEC approved | PASS | SPEC frontmatter `status: approved` |
| Fleet always-apply paste source | PASS | `config/cloud-agent-fleet-always-apply.md` |
| Cloud wiring runbook | PASS | `docs/runbooks/cloud-agent-fleet-wiring.md` |
| REST `mc_self_check` with hydrated key | PASS | 2026-07-24T11:51Z — `ok: true`, `mcpEnabled: true` |
| REST checkout mint | PASS | TASK-681 → `dsp_mryvrl8gj222kz` |
| This session MCP catalog includes PLX-MC | FAIL (expected pre-cutover) | Only `cursor-cloud` MCP server present |
| Team always-apply includes fleet slice | FAIL (expected pre-cutover) | Session always-apply = thin ops rules only |
| Portal `--p-*` not in fleet slice | PASS (by design) | Explicit “out of fleet” table in paste source |
| Swarm dispatch default-OFF | PASS | Documented; committed mcp.json stays `SWARM_DISPATCH_ENABLED=0` |

## Operator cutover checklist (blocks full SUCCESS criteria)

- [ ] Paste rules from `config/cloud-agent-fleet-always-apply.md` into Cursor Team Rules (always-apply)
- [ ] Register Team MCP HTTP `PLX-MC-Hub` (+ `PLX-MC-Portal`) per `docs/runbooks/cloud-agent-fleet-wiring.md`
- [ ] Start a **fresh** Cloud Agent and confirm always-apply + `mc_self_check` / `mc_checkout_task` via MCP tools
- [ ] Spot-check `local-inference` session: no portal token blast radius
- [ ] Update this verdict to **CONSOLE CUTOVER: PASS** with the new `bc-…` URL

## Kill switches

- Disable Team MCP server entries
- Vercel / server `PLX_MC_MCP_ENABLED=0`
- Remove Team Rules paste

## Next program phase

After console cutover (or in parallel if Vince prefers): portal project-orchestrator for **TASK-683** (ADR-005 authority package).
