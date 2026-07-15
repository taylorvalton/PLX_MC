# Colleague-ready MC — suggestion visibility + `/welcome`

**Date:** 2026-07-15  
**Accountable owner:** vince@petrasoap.com  
**Parent task:** TASK-465 (`MC-Checkout: dsp_mrmem5hbskbet3`)  
**Child tasks:** TASK-466 (portal), TASK-467 (for-and-against), TASK-468 (skills)

## Verdict

Colleague-ready on the four target repos: suggestion deep links appear in Actions job summaries (no candidate dump), `/welcome` is live, confirm/fuzzy remain **OFF**.

## Three-click colleague path

1. Open https://mc.plxcustomer.io/welcome → **Open Mission Control** (Entra sign-in).
2. On `/welcome` → **Connect Cursor** (copy team HTTP MCP URL `https://mc.plxcustomer.io/api/cursor/mcp`; keys from team MCP / Secrets Manager — never on the page).
3. On `/welcome` → **Install company skills** → existing bootstrap (`scripts/bootstrap-company-skills.*` / runbook).

Canonical prose: `docs/runbooks/mc-for-colleagues.md`.

## Hub (PLX_MC)

| Item | Value |
|------|-------|
| Checkout | `dsp_mrmem5hbskbet3` (TASK-465) |
| PR | https://github.com/petralabx/PLX_MC/pull/141 |
| Merge SHA | `e1bfa7c4af8a469559131d68f99a4793c99a9229` |
| Preflight CI | `29440743234` (pass) |
| Compliance | `29440741162` (pass) |
| Routing (suggestion deep link) | `29440741080` — summary: “An MC suggestion is ready” + **Open Mission Control** (`proposal=rpp_petralabx_PLX_MC:141`) |
| Production deploy | GitHub deployment `5462266162` @ `e1bfa7c`; Vercel `dpl_Vd3wWEKgKhYn7JfofXZgvCE4en1n` |
| `/welcome` | https://mc.plxcustomer.io/welcome (public; HTTP 200 after redirect) |

**Config:** `for-and-against` + `skills` promoted to `mode: "suggestion"`; portal + PLX_MC already suggestion. Rollout expectation **5 suggestion / 3 shadow**.

## plx-customer-portal

| Item | Value |
|------|-------|
| Checkout | `dsp_mrmfdz3ucwz0zh` (TASK-466) |
| PR | https://github.com/petralabx/plx-customer-portal/pull/214 → `staging` |
| Merge SHA | `d4389dfde4062d83125e587bcdf3b7a86a08f3e3` |
| Compliance | `29441706034` (pass) |
| Routing | `29441705941` — “An MC suggestion is ready” + **Open Mission Control** (`proposal=rpp_petralabx_plx-customer-portal:214`); no candidates |
| Note | Shadow-era workflow lacked deep-link writer; PR upgraded to hub-generated template |

## for-and-against

| Item | Value |
|------|-------|
| Checkout | `dsp_mrmfdz9tig4q15` (TASK-467) |
| PR | https://github.com/petralabx/for-and-against/pull/4 |
| Merge SHA | `bc06b21dbc617b1ab23a9519d921239226850701` |
| Compliance | `29441711738` (pass) |
| Routing | `29441562438` / `29441709794` — suggestion deep link present (`proposal=rpp_petralabx_for-and-against:4`); no candidates |

### Kill-switch (FAA representative)

| Step | Proof |
|------|-------|
| Set repo `PLX_MC_ROUTING_METADATA_ENABLED=0` | Variable list shows `0` |
| Skip | Run `29441864606` **skipped** (temp PR #5, closed) |
| Delete repo override (restore org inherit) | Variable deleted |
| Resume | Run `29441912033` **success** (temp PR #6, closed) |

Keyring OAuth used for Actions var admin; PAT env stripped for that process.

## skills

| Item | Value |
|------|-------|
| Checkout | `dsp_mrmfdzfqpq56gf` (TASK-468) |
| PR | https://github.com/petralabx/skills/pull/9 |
| Merge SHA | `3c670143f38423ddd46328528c6d1b745755806b` |
| Compliance | `29441705917` (pass) |
| Routing | `29441705715` — **Open Mission Control** present; no candidates |

## Confirm / fuzzy / OIDC

- All four cohort pilots: `fuzzyAutoLinkEnabled: false`
- Runbook / production contract: `PLX_MC_ROUTING_CONFIRM_ENABLED=0`, `PLX_MC_ROUTING_FUZZY_AUTOLINK_ENABLED=0` (forced)
- OIDC allowlist **not** broadened (exact 8 unchanged)
- TASK-448/450/453/454 **not** started

## Rollback

1. Routing visibility: set `PLX_MC_ROUTING_METADATA_ENABLED=0` (repo or org) — job skips; compliance unaffected.
2. `/welcome` can remain (docs-only surface; no secrets).
3. Revert hub pilot modes to shadow for FAA/skills if suggestion must be withdrawn.

## Screenshots

- `screenshots/welcome-first-viewport.png`
- `screenshots/faa-suggestion-deeplink.png`
- `screenshots/portal-suggestion-deeplink.png`
