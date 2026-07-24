# Console cutover — blocked from Cloud Agent runtime

**Date:** 2026-07-24  
**Asked:** paste Team Rules, register Team MCP Hub/Portal, verify on fresh Cloud Agent  
**Result:** **cannot execute from this agent** — dashboard-only surfaces; no write API.

## What I tried

| Path | Result |
|---|---|
| Cursor Admin API (`CURSOR_ADMIN_API_KEY`) | Works for `/teams/members`, `/teams/spend`, `/teams/audit-logs` only |
| Admin API create/update Team Rules | **No endpoint** (docs + probes) |
| Admin API create/update Team MCP | **No endpoint** (docs + probes) |
| Cloud Agents API `POST /v0/agents` + `mcpServers` | **401** — team Admin key rejected; needs user or **service account** API key |
| `OTHERMCP` secret as user API key | Invalid |
| `cursor-cloud` MCP tools | Read-only diagnostics (run-info, environment-info, list agents, automations get) — no Team Rules/MCP writers |
| Browser login to dashboard | No Cursor session credentials in this VM |

## Audit finding (important for move 2)

Team audit logs (last ~7 days) show Vince already:

1. Deleted legacy `PLX-MC` HTTP team server (2026-07-20 18:24Z)
2. Created `PLX-MC-Hub` + `PLX-MC-Portal` HTTP team servers
3. Deleted both, then **re-created both** (2026-07-20 20:34Z)
4. **No later delete** of Hub/Portal in the audit window

So Team MCP **may already exist** at the team Integrations layer. This Cloud run still only exposes MCP server `cursor-cloud` — Hub/Portal are not in the session tool catalog. Likely cause: not enabled for this environment / Agents MCP dropdown / headers stale — not “never registered.”

Zero `team_rule` audit events in the window → fleet always-apply paste has **not** been applied as Team Rules yet.

## What Vince must click (I cannot)

### 1) Team Rules — https://cursor.com/dashboard/team-content

Paste from `/agent/repos/PLX_MC/config/cloud-agent-fleet-always-apply.md` (four rules, always-apply). Do **not** paste portal `--p-*` token rules.

### 2) Team MCP — https://cursor.com/dashboard/integrations

Confirm `PLX-MC-Hub` and `PLX-MC-Portal` still exist (audit says created). If missing, re-add Streamable HTTP:

| Name | URL | Headers |
|---|---|---|
| `PLX-MC-Hub` | `https://mc.plxcustomer.io/api/cursor/mcp` | `x-api-key: <PLX_MC_MCP_API_KEY>` · `x-mc-operator-email: cos@petrasoap.com` · `x-mc-repo: petralabx/PLX_MC` · `x-mc-runtime: cursor-cloud` |
| `PLX-MC-Portal` | same URL | same key/email · `x-mc-repo: petralabx/plx-customer-portal` · `x-mc-runtime: cursor-cloud` |

Ensure they are enabled for Cloud Agents / this multi-repo environment  
(`https://cursor.com/dashboard/cloud-agents/environments/e/2d1524f6-8755-11f1-a7d1-d6b4613131ce`).

### 3) Fresh Cloud Agent verify

Start a **new** Cloud Agent on that environment (this run will not pick up Team MCP mid-flight). Confirm:

- always-apply includes fleet slices
- MCP catalog includes `PLX-MC-Hub` (and Portal when relevant)
- `mc_self_check` / `mc_checkout_task` work via MCP tools
- `local-inference` does not get portal token blast

Optional unblock for future agents: create a **Service Account API key** (Dashboard → Settings → API Keys → Service Accounts) and store it in `prod/ec2-secrets` so agents can launch verification runs with inline `mcpServers` when Team MCP is missing.

## After you click

Reply in this thread (or a new agent) with “cutover done” + new `bc-…` URL; I will re-verify and flip `CLOUD-WIRING-VERDICT.md` to CONSOLE PASS.
