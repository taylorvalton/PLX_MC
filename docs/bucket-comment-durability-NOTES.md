# PR-B — Bucket-comment durability (`feat/bucket-comment-durability`)

Resolves **Item 4** (deferred from EN-001 / WS-3): bucket discussion comments
were store-authoritative only (a reactive map in `store.ts`) and were lost on
reload, unlike task comments which persist in the task jsonb blob. Independent
of PR-A (built off `origin/main`).

## SharePoint / DB approach

- **DB persistence:** buckets have no entity row, so their threads get a
  dedicated `bucket_comments` table (migration `006_bucket_comments.sql`,
  `position`-ordered). Accessors in `src/lib/sync/repo.ts`:
  `bucketCommentsByBucket` (grouped read) and `replaceBucketComments` (atomic
  replace-thread).
- **Atomic replace-thread:** the store mirrors the **whole** comment array (the
  same shape task comments round-trip), so the server replaces the thread in one
  transaction — `DELETE ... WHERE bucket_id = $1` (always a WHERE) + parameterized
  re-inserts in array order. The plain `query()` checks out a fresh pooled
  connection per call and cannot span a transaction, so a `withTransaction(fn)`
  helper was added to `src/lib/db/index.ts` (additive; documented scope note).
- **Route:** `PATCH /api/buckets/{id}/comments` through the shared
  `route()`/`parseBody` + zod wrapper; returns the stored `Comment[]`.
- **Hydration + optimistic mirror:** `snapshot()` returns `bucketComments`; the
  store hydrates them and mirrors each add/edit/delete through a
  `bucketCommentMirror` seam (reconcile-on-success / rollback+notice-on-failure,
  paralleling `patchTaskFields`), so a thread the user saw survives the next
  hydrate and a failed write is never silently dropped.
- **App-only:** bucket comments are **never** pushed to SharePoint (the EN-001
  decision — comments stay app-only). The @mention Teams/email *delivery* remains
  deferred (in-app inbox + audit only), unchanged.

## Migration numbering

`006_bucket_comments.sql`. PR-A uses `005_repo_registry.sql`; prefixes are
globally unique (the gate fails on duplicates, not gaps), and the runner is
order-independent for these independent tables. On this branch (off main) the
sequence is 001–004, 006 — gate-legal; contiguous on `main` once PR-A merges.

## Files changed

- `db/migrations/006_bucket_comments.sql` (new)
- `src/lib/db/index.ts` (`withTransaction` helper)
- `src/lib/sync/repo.ts` (bucket-comment accessors)
- `src/lib/sync/state.ts` (snapshot + `setBucketComments`)
- `src/lib/sync/index.ts` (barrel export)
- `src/app/api/buckets/[id]/comments/route.ts` (new)
- `src/lib/mc-data/store.ts` (mirror seam + hydration)
- `tests/bucket-comments.test.ts` (new), `tests/mc-collab-store.test.ts` (updated)
- `docs/modules/sync/README.md`

## Shared-file note (vs PR-A)

PR-A and PR-B both touch `src/lib/sync/{repo,state,index}.ts` and
`src/lib/mc-data/store.ts` (additively). The second PR to merge rebases on `main`
and re-runs the full gate before merge.

## Verification

```
npm run typecheck                      → exit 0
npm run test                           → 23 files, 325 passed (320 baseline + 5)
npm run build                          → exit 0 (/api/buckets/[id]/comments registered)
./scripts/preflight.sh --mode pre-push → all checks passed (migrations clean: 5 files; E2E green)
scope-check.sh <P4 owns> <forbidden> <9 files> → OK
```
