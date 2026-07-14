# Module: routing

## What

Deterministic Mission Control **control-plane** for associating commits and pull
requests with existing Tasks/Buckets (and creating a Task only after explicit
authorized confirmation). Owns typed evidence/trust/candidate/session/proposal/
revision/decision/link contracts, PR-body marker parsing, and Postgres
persistence for proposals and Task-ID allocation seams.

This module does **not** authorize mutations, call LLMs for control decisions,
or write SharePoint business entities. Authorization stays in `permissions`;
confirmed Task mutation lands in later phases (`routing/service`, MCP, APIs).

## Why

Operator PRs without a checkout currently create sparse Tasks. Agents need
pre-checkout suggestions without inventing work. A shared typed persistence and
marker layer lets MCP, metadata workflows, webhooks, and the Routing Inbox share
one replay-safe proposal identity (`{repoId, changeId}`) and `rtx_*` sessions
without persisting raw PR bodies.

## How

- **Markers** (`markers.ts`): parse `MC-Task: TASK-*`, `MC-Routing: rtx_*`, and
  migration-era `MC-Checkout: dsp_*` in memory. Deduplicate order-preserving.
  Reject oversized bodies. Classify authority: task = declaration, routing =
  correlation, checkout = credential *reference* (parser does not validate).
  Persist only `bodyContentHash` + extracted markers — never the raw body.
- **Types** (`types.ts`): `matchScore` is separate from `authorizationTrust`.
  Project is nullable and derived from Bucket. Explicit failure/degraded states.
- **Persistence** (`repo.ts` + migrations `017`/`018`): sessions, proposals,
  head-SHA revisions, candidates, decisions, append-only `related|delivery`
  work links, creation-intent idempotency `(proposal_id, creation_intent_hash)`,
  and global `mc_task_id_seq` reconciled above existing `TASK-*` IDs (never
  moved backwards). Write APIs accept `TxQuery` so P8 can atomically
  `FOR UPDATE` lock, allocate, insert Task/link/decision, and resolve.
- **Harness** (`scripts/test-routing-postgres.mjs`): disposable Docker Postgres
  only; refuses staging/production URLs; always removes the container.

```ts
import { parseRoutingMarkers, upsertRoutingProposal } from "@/lib/routing";
import { withTransaction } from "@/lib/db";

const parsed = parseRoutingMarkers(prBody); // in-memory only
await withTransaction(async (q) => {
  await upsertRoutingProposal(input, q);
  // P8: lockProposalForUpdate → allocateNextTaskId → insertCreationIntent …
});
```

### Key Files

- `src/lib/routing/types.ts` — contracts
- `src/lib/routing/markers.ts` — marker parser + body hash
- `src/lib/routing/repo.ts` — transaction-aware repository
- `src/lib/routing/persistence/` — SQL helpers / constants
- `db/migrations/017_routing_proposals.sql`
- `db/migrations/018_routing_links_and_task_sequence.sql`
- `scripts/test-routing-postgres.mjs`

## Dependencies

- Depends on: `src/lib/db` (`query`, `TxQuery`, `withTransaction`); Postgres
  via numbered migrations.
- Depended on by: future routing engine (P3), sync freshness consumers (P4),
  MCP suggest (P5), proposal lifecycle (P6), confirmed mutations (P8), inbox (P9).

## Owner

Vince

## Criticality

High
