# Vendor Spend (AI Spend) — Project Plan

Execution contract for the Mission Control **AI Spend** module: company-wide vendor
subscription and API cost tracking with budgets, period filters, and in-app warnings.

- **Date:** 2026-06-30
- **Domain:** platform
- **Status:** Executed 2026-07-07 — module shipped (see `docs/modules/vendor-spend/README.md`; migration landed as `014_vendor_spend.sql`, not `011` as drafted)
- **Orchestrator slug:** `vendor-spend`
- **UI screen:** `ai-spend` (sidebar label: **AI Spend**)

## Contents

| File | What |
|---|---|
| [SPEC.md](SPEC.md) | Full project-orchestrator contract — mission, success criteria, 5-phase DAG, risks, worktree plan |

## Operator prerequisites (before P2)

Add to AWS Secrets Manager (`prod/ec2-secrets`) if automated seed is required on day one:

- `ANTHROPIC_ADMIN_API_KEY` — Anthropic org cost API (`sk-ant-admin01-…`)
- `CURSOR_ADMIN_API_KEY` — Cursor Enterprise Admin API (`admin:*` scope)

AWS Cost Explorer is already accessible via current IAM credentials.

## Execution

When ready to build, run from repo root using the project-orchestrator skill against
`.orchestrator/vendor-spend/SPEC.md` (scaffold copy) or this promoted bundle as the
canonical plan reference.
