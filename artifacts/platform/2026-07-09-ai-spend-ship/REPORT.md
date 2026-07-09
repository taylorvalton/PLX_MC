# AI Spend (vendor-spend) — Ship Evidence

Last-mile ship of vendor-spend v1 on 2026-07-09 from worktree
`/home/vinnysachet/PLX_MC-ai-spend`, branch `feat/ai-spend-observatory`.

## MC task

- Auto-created + checked out: **TASK-290**
- Stamp: `MC-Checkout: dsp_mrdbqq5lqxdyp7`
- Bucket: `BKT-MISSION-CONTROL-OPS`
- Accountable human: Vince (`vince@petrasoap.com`)

## Rebase fallout (fixed this session)

`origin/main` landed `014_bucket_dirty_fields.sql` (#108) after the earlier
rebase onto `a1317bf`. That collided with this branch's
`014_vendor_spend.sql`. Fix:

1. Rebased onto latest `origin/main` (`5957396`)
2. Renumbered vendor-spend → `015_vendor_spend.sql` (+ rollback)
3. Updated `docs/modules/vendor-spend/README.md`
4. On staging: applied `015` (idempotent `CREATE IF NOT EXISTS`), then
   deleted the orphan `schema_migrations` row for the old
   `014_vendor_spend.sql` filename (tables retained)

## Local gates

| Gate | Result |
|---|---|
| `npx vitest run tests/vendor-spend-*.test.ts` | 8 files, **91 passed** |
| `npm run typecheck` | exit 0 |
| `./scripts/preflight.sh --mode pre-commit` | exit 0 (2 pre-existing warnings, 0 errors) |
| Migration numbering | clean after renumber to **015** |

## Staging migration

```
assert: PLX_MC_DATABASE_URL host = plx-postgres-staging.c2b8m8isksqt.us-east-1.rds.amazonaws.com
assert: db_name = plx_mc
npm run migrate → apply 015_vendor_spend.sql
schema_migrations: 014_bucket_dirty_fields.sql + 015_vendor_spend.sql
tables present: vendor_cost_budgets, vendor_cost_snapshots, vendor_cost_refresh_log
```

See `staging-migrate.txt`.

## Secrets inventory (booleans only)

| Secret / capability | Present? |
|---|---|
| Staging `PLX_MC_DATABASE_URL` (plx-postgres-staging) | yes |
| `CRON_SECRET` | yes |
| AWS STS / Cost Explorer IAM (ambient instance role) | yes (live CE call succeeded) |
| `AWS_COST_EXPLORER_USE_AMBIENT` in Secrets Manager | no — set `=1` in local smoke env |
| `ANTHROPIC_ADMIN_KEY` in staging+prod/ec2-secrets | **yes** (alias; app also accepts `ANTHROPIC_ADMIN_API_KEY`) |
| `CURSOR_ADMIN_KEY` in staging+prod/ec2-secrets | **yes** (alias; app also accepts `CURSOR_ADMIN_API_KEY`) |
| Standard `ANTHROPIC_API_KEY` | yes (cannot read cost report alone) |

## Live adapter smoke (local Next → staging DB)

Env: Basic gate (OIDC unset for local), `AWS_COST_EXPLORER_USE_AMBIENT=1`,
admin keys loaded via SM aliases `ANTHROPIC_ADMIN_KEY` / `CURSOR_ADMIN_KEY`.

| Vendor | Outcome | Evidence |
|---|---|---|
| **AWS** | **LIVE** — `status: ok`, 9 daily snapshots, MTD spend **49946¢ ($499.46)** | `api/post-refresh-mtd.json`, `api/post-refresh-with-aliases.json` |
| **Anthropic** | **LIVE** — `status: ok`, 8 daily snapshots (via `ANTHROPIC_ADMIN_KEY` alias) | `api/post-refresh-with-aliases.json`, `api/get-index-with-aliases.json` |
| **Cursor** | **DEGRADED** `unauthorized` HTTP 401 — key present (`CURSOR_ADMIN_KEY`) but Admin API rejected it (not Enterprise admin / wrong key type) | same |

Mutations:

- `PATCH /api/vendor-spend/budgets` (aws) → 200; temporary $400 budget produced
  `alert: over` / utilization ≈ 1.25; reset to $2,000/mo after smoke
- `POST /api/vendor-spend/snapshots` (adobe manual $55) → 200
- UI shell `GET /` → 200, contains **AI Spend** nav (`data-testid` screen wired
  via `screens.tsx` → `AiSpendView`)

No fabricated $0 for automated vendors: degraded rows carry `sourceStatus:
degraded` + reason, and refresh log messages name the failure mode.

## Operator follow-ups (out of this PR)

1. Fix `CURSOR_ADMIN_KEY` — current value is rejected with HTTP 401 by
   `POST https://api.cursor.com/teams/spend`. Needs a Cursor **Enterprise
   team admin** API key (Basic auth username). Until then Cursor stays
   DEGRADED (manual snapshots still work).
2. Set `AWS_COST_EXPLORER_USE_AMBIENT=1` (or explicit AWS keys) on the
   deployed Vercel/runtime env so production refresh uses the ambient role
   path without requiring static keys.
3. Optional hygiene: rename SM keys to the canonical
   `ANTHROPIC_ADMIN_API_KEY` / `CURSOR_ADMIN_API_KEY` names (aliases already
   accepted by `src/lib/secrets.ts`).
4. Email / Teams alert delivery remains v2 —
   `artifacts/platform/2026-06-30-vendor-spend-alerts-followup/`.

## Rollback

- Revert the PR on `main`.
- Migration `015` is additive. Emergency only:
  `db/rollback/015_vendor_spend_rollback.sql`.
- Unset `CRON_SECRET` or remove the vercel.json cron entry to stop scheduled
  refresh.
