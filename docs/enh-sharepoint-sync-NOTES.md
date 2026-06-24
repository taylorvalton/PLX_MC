# PR-A — SharePoint sync increment (`feat/enh-sharepoint-sync`)

Resolves the deferred SharePoint-sync follow-on work from EN-001…EN-003:
**Item 1** person columns, **Item 2** repo registry list + persistence,
**Item 3** sub-task mirror. (Item 4, bucket-comment durability, is a separate
theme in PR-B `feat/bucket-comment-durability`.)

Built off `origin/main` (tip of PRs #35–#38). Orchestration evidence:
`.orchestrator/enh-sharepoint-sync/` (RESEARCH.md, SPEC.md, per-phase NOTES).

## Item 1 — Person-column two-way sync

SharePoint Person columns are written as `<InternalName>LookupId` (the numeric
id in the site **User Information List**), not an email. The pure mapping layer
(`mapping.ts`) emits a **pre-resolved** id from `outboundFields(..., { persons })`
(number = set, `null` = clear, absent = untouched); the engine (`graph.ts`)
does the cached email→lookupId resolution (both directions).

- **`assignee` ↔** (push + inbound pull), **`accountableOwner` →**,
  **`reporter` →** — directions follow `SP_LISTS`/schema (the runtime authority).
- **App-only limitation (researched):** our client-secret token **cannot**
  `_api/web/ensureUser`, so a user not yet in the UIL — or an agent with no
  email — resolves to `null`: the column is **skipped + audited** (fail visible),
  never fabricated. Live mirror coverage is bounded by UIL membership.
- `PUSHED_FIELDS` += assignee/accountableOwner/reporter, so a person-only patch
  re-queues for the sweep. The stale "deferred to the directory increment"
  audit/activity/`NotifyTrail` narrative is replaced with the real mirror
  narrative; **Teams/email notification delivery stays deferred** (kept honest).

Files: `src/lib/sync/{mapping,graph,engine,state}.ts`,
`src/lib/mc-data/store.ts`, `src/components/mc/people-picker.tsx`,
`tests/{sync-mapping,mc-store,mc-patch,sync-person}.test.ts`.

## Item 2 — Repo Registry list + request persistence

- **DB persistence** (migration `005_repo_registry.sql`): `repos` +
  `repo_requests` tables; accessors in `repo.ts`. `snapshot()` seeds the
  canonical repos idempotently from the `REPOS` fixture (single source of truth)
  and returns `repos` + `repoRequests`; the store hydrates both so approvals +
  requests survive a reload. `requestRepo`/`approveRepo`/`rejectRepo` mirror
  optimistically through `POST /api/repos` (approver-gated server-side) +
  `POST /api/repos/requests`. The existing client validation flow is untouched.
- **SharePoint "Repo Registry" list** (schema + `SP_LISTS` +
  `config/integrations.yaml`): **push-only** mirror — MC is authoritative for the
  allow-list. `repoOutboundFields` serializes a repo; `engine.pushRepoRegistry`
  upserts each pending repo. The list is resolved **optionally** — a missing /
  unprovisioned list is skipped with an audit and never blocks the core sweep.
- The existing ToDos `Repos` multiline column is untouched.

Files: `db/migrations/005_repo_registry.sql`, `src/lib/sync/{repo,state,engine,graph,mapping}.ts`,
`src/lib/mc-data/data.ts`, `src/lib/mc-data/store.ts`,
`src/app/api/repos/{route.ts,requests/route.ts}`, `config/sharepoint-schema.json`,
`config/integrations.yaml`, `tests/{sync-repo-registry,mc-data}.test.ts`.

## Item 3 — Sub-task → SharePoint mirror

Push-only `Subtasks` ToDos column. `serializeSubtasks` renders one stable
human-readable line per sub-task (`[x] SUB-1 · title · @Executor · due … ·
status`). Push-only **by design** — MC owns the structured `Subtask[]`, so
`inboundPatches` never reads it back (parsing arbitrary SharePoint text into a
typed array is fragile). `PUSHED_FIELDS` += subtasks.

Files: `src/lib/sync/{mapping,state}.ts`, `config/sharepoint-schema.json`,
`src/lib/mc-data/data.ts`, `tests/sync-mapping.test.ts`.

## What stayed deferred (honest)

- **Teams + email notification delivery** on assignment/mention — no public
  webhook/send path; in-app inbox + audit only, labelled as such.
- **Live person mirror coverage** is limited to users present in the dev-site
  UIL (app-only cannot provision UIL entries); misses are audited, not faked.
- **Initiative lookup column** and **Project Documents (driveItem) sync** — later
  increments (unchanged).
- **SOPs:** this repo has no `docs/*SOP*.md` (the `update-sops` rule targets the
  separate `plx-customer-portal` repo); nothing to bump here.

## Verification (PR-A integration)

```
npm run typecheck                      → exit 0
npm run test                           → 24 files, 339 passed (320 baseline + 19)
npm run build                          → exit 0 (/api/repos, /api/repos/requests registered)
./scripts/preflight.sh --mode pre-push → all checks passed
    · migrations clean (5 files, serialized prefixes)
    · Playwright E2E → 34 passed, 1 skipped (the live-Postgres reload persistence
      case is intentionally skipped; /api/state 500s are the documented DB-less
      E2E fixture fallback)
```

Per-phase scope-locks all passed (`scope-check.sh`): P1 (10 files), P2 (14),
P3 (7). Migration prefix `005` (PR-B uses `006`) — globally unique, no collision.

## Live external verification (staging)

The hermetic gate is green. Live SharePoint provisioning of the new columns/list
on `/sites/plx-mission-control-dev` and a live sweep are run as evidence in the
integration step when staging Graph credentials are available; if a live system
is unavailable the seam fails visibly (skip + audit) and the result is recorded —
sync evidence is never fabricated.
