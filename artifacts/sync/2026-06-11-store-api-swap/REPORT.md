# Store → API swap — live verification

- **Date:** 2026-06-11 (ET)
- **Scope:** `src/lib/mc-data/store.ts` internals swapped to the sync API
  behind the frozen getter/action surface; network-hang hardening for the DB
  pool and Graph fetches.

## What changed

- `hydrate()` (called from the shell's mount effect) loads invited people
  from localStorage, then adopts the engine's snapshot from `GET /api/state`.
- Mutations stay optimistic-local-first and mirror through the shared fetch
  wrapper: `addTask` → `POST /api/tasks` (adopts the server's task on id
  race), `reassignTask` → `PATCH /api/tasks/{id}`, `markAllSynced` →
  `POST /api/sync/sweep` + snapshot refresh, `resolveConflict`/`retryError` →
  their §6 endpoints + refresh. `applyInbound` stays local by design
  (spec §6: "no endpoint — this is what the real inbound delta does").
- Server calls are no-ops on SSR/tests (`typeof window` gate) and swallowed
  with a console warning when the API is unreachable — the UI degrades to
  the last-synced view (TOOLS.md fallback). localStorage no longer carries
  user tasks (the server does); invited people stay local until the
  directory increment.

## Browser verification (IDE browser via Tailscale URL)

- SSR renders fixture state ("3 to resolve"); after hydration the live
  snapshot applies: topbar pill → "2 to resolve", sidebar Sync badge → 2,
  live-only TASK-220 "Sync engine evidence task" renders, TASK-219 shows the
  conflict-resolved due "Jun 28", and the Sync console audit log shows the
  real engine rows ("Sweep completed — 14 outbound pushes…", "Retried push
  for RISK-4 · Likelihood…").
- An initial browser pass reported a hydration text mismatch in the Topbar;
  after the pool fix below it did not reproduce across three fresh loads
  (no dev overlay, no issue badge, shadow-DOM search for hydration errors
  empty). Watched: if it recurs, defer the snapshot emit until after
  hydration completes.

## Incident found while verifying: hung `/api/state`

After ~80 idle minutes the dev server's pooled RDS connections were dead and
`/api/state` hung indefinitely (fresh connections worked instantly). Fixed by
configuring the pool (`keepAlive`, `idleTimeoutMillis: 30s`,
`connectionTimeoutMillis: 10s`, `query_timeout: 20s`) and adding
`AbortSignal.timeout` to Graph token/API fetches. Documented in `LESSONS.md`
(2026-06-11). Post-fix probe: `/api/state` 200 in 147 ms.

Residue cleaned: two mirror rows (TASK-160, TASK-201) carried unpadded due
strings written by the pre-padding-fix inbound pull; corrected in place
(`Jun 9` → `Jun 09`, `Jun 6` → `Jun 06`).

## Gates

- `npm run typecheck`, `npm run lint`, `npm run test` (74 passed) — exit 0
  with the surface unchanged; full pre-push preflight run before the PR.
