# CLOUD-WIRING-VERDICT — TASK-682

**Date:** 2026-07-24  
**Status:** **ACCEPTED** (REST fallback + service-account path documented)  
**Checkout:** `MC-Checkout: dsp_mryw4pv5w1uabx` (completed)

## Verdict

| Layer | Result |
|---|---|
| Team Rules (18212–18215) | **PASS** |
| Team MCP Hub/Portal registered | **PASS** |
| Team MCP attached to Cloud runs | **FAIL** (Cursor platform bug) |
| REST `/api/cursor/*` fallback | **PASS** (proven this program) |
| Service-account launch path | **DOCUMENTED** — awaiting Vince key + `CURSOR_CLOUD_SERVICE_API_KEY` in secrets |

## Acceptance

Cloud wiring is **accepted for program progress**. Agents enforce MC checkout via
REST until Cursor attaches Team MCP or a service-account inline launch is
provisioned. Next program phase: **TASK-683** portal ADR-005 authority package.

## Operator follow-ups (non-blocking)

1. Create Cursor service account API key; store as `CURSOR_CLOUD_SERVICE_API_KEY`
   in `prod/ec2-secrets` — runbook:
   `docs/runbooks/cursor-cloud-service-account-api-key.md`
2. Optionally update Team Rule 4 text from
   `config/cloud-agent-fleet-always-apply.md` (REST fallback wording).
3. Re-test Hub/Portal attach when Cursor ships a fix.

## Kill switches

- Deactivate Team Rules 18212–18215
- Disable Hub/Portal in Integrations
- Rotate/remove service account key
