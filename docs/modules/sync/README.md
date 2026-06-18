# Module: sync

## What

The system-of-record side of Mission Control: SharePoint provisioning today,
the two-way sync engine next. Owns the canonical tenant schema
(`config/sharepoint-schema.json`), the idempotent provisioner
(`scripts/provision-sharepoint.py`), and — as it lands — the Graph sync
service (outbound push, inbound delta, webhooks, conflict queue, audit log).
It is NOT the UI (web) and NOT the prototype store (which it will replace
behind the same action surface).

## Why

SharePoint is the canonical system of record (SOUL.md non-negotiable); the
tenant shape must be reproducible from the repo, never hand-built. The
provisioning script gives the same evidence discipline as the governance
gates: dry-run by default, `--apply` to mutate, `--verify` to diff the live
tenant against the committed schema with exit codes.

## How

- Schema source: `docs/product/SHAREPOINT_INTEGRATION.md` §2–4 (spec wins) →
  `config/sharepoint-schema.json` (keep aligned with `SP_LISTS` in
  `src/lib/mc-data/data.ts`).
- Auth: Graph client credentials from `MICROSOFT_GRAPH_*` env (AWS Secrets
  Manager via the loader). Site creation uses the Graph beta create-site API
  (`Sites.Create.All`); lists/columns/folders are Graph v1.0.
- Environments: `--env staging` (default, `/sites/plx-mission-control-dev`)
  and `--env production` (`/sites/plx-mission-control`, not yet provisioned).
- Known constraints (verified 2026-06-11): Graph cannot create
  hyperlinkOrPicture columns app-only → `PRD Link` is a text column; Risk
  `Likelihood` choices are `High/Med/Low` BY DESIGN (spec §5.2) — the engine's
  mapping layer normalizes MC's `Medium` → `Med`.
- Persistence (landed 2026-06-11): dedicated `plx_mc` database on the staging
  RDS instance (`plx-postgres-staging`, us-east-1), owned by the app-only
  `plx_mc_app` role — never the trading database or its credentials. Runtime
  URL: `PLX_MC_DATABASE_URL` (AWS Secrets Manager via the loader). Schema via
  numbered migrations in `db/migrations/` (`npm run migrate`,
  `scripts/migrate.mjs`); numbering serialization enforced by
  `scripts/check-migrations.py` in every preflight mode. Tables: `delta_links`,
  `sync_conflicts`, `sync_push_errors`, `sync_audit_log`, `entities`.
- Engine v1 (landed 2026-06-11, `src/lib/sync/`): outbound push + inbound
  Graph delta poll for ToDos and Risk Register against the staging site.
  Inbound runs BEFORE outbound in every sweep so dirty-field edits raise
  conflicts (§5.1) instead of last-write-wins. Mapping layer (`mapping.ts`)
  enforces §3 directions and the §5.2 `Medium` → `Med` Likelihood
  normalization. Runs inside the Next.js process: `src/instrumentation.ts`
  starts the 5-min scheduler when `PLX_MC_SYNC_ENABLED=1` (default OFF);
  `POST /api/sync/sweep` runs one on demand. API surface per spec §6 under
  `src/app/api/` (shared wrapper + zod). Evidence:
  `artifacts/sync/2026-06-11-sync-engine/`.
- Bucket comments (landed 2026-06-18, Item 4): bucket discussion threads now
  persist in a dedicated `bucket_comments` table (migration `006`) via
  `PATCH /api/buckets/{id}/comments` (atomic replace-thread on `db.withTransaction`)
  and hydrate from the snapshot, so they survive a reload. The store mirrors each
  add/edit/delete optimistically (reconcile-on-success / rollback+notice-on-failure,
  the same spine as `patchTaskFields`). App-only — bucket comments are NEVER
  pushed to SharePoint (the EN-001 decision).
- Deferred to the public-deploy increment: Graph change webhooks, the
  directory module (person columns: Assigned To / Reporter / Owner),
  notifications, lookup columns (Initiative), and Project Documents
  (driveItem) sync — file entities are display fixtures until then.

## Dependencies

Python 3.12 + `requests` (`requirements.txt`). Microsoft Graph. Depended on
by: web (its store becomes a client of this module's API).

### Key Files

- `config/sharepoint-schema.json` — canonical tenant schema
- `scripts/provision-sharepoint.py` — idempotent provisioner + verifier
- `docs/product/SHAREPOINT_INTEGRATION.md` — the governing spec

## Owner

Vince

## Criticality

Critical
