# Module: permissions

## What

Typed, deny-by-default authorization kernel for Mission Control. Owns stable
capability unions, `owner|admin|member` grant bundles, durable service-principal
grants, contextual predicates, and identity record helpers for Entra users,
verified GitHub links, and service principals.

This is **not** a generic IAM framework, database-authored policy language, or
policy DSL. Domain lifecycle rules stay in `mc-data/policy`; authentication
admission (email allowlist / MCP API key) stays in `auth` / `mcp`.

## Why

Routing, task mutation, repo approval, and sync writers need one centralized
`authorize(...)` boundary so capability checks are not reimplemented in routes,
MCP actions, and UI affordances. Without it, service principals and humans blur,
and unknown capabilities fail open by accident.

## How

```ts
import { authorize } from "@/lib/permissions";

const decision = authorize({
  actor: { kind: "human", id: entraOid, role: "admin", status: "active" },
  capability: "repo.approve",
  resource: { type: "repo", id: "plx-mc" },
});
// { allowed, reasonCode, policyVersion: "permissions.v1" }
```

| Layer | Responsibility |
|-------|----------------|
| `auth` | Authenticate Entra sessions / credentials; admit via allowlist; propagate `oid` |
| `permissions` | Decide whether an authenticated actor may perform a capability |
| `mc-data/policy` | Domain invariants after authorization (accountable owner, lifecycle, evidence) |

**Default state / kill switch:** `PLX_MC_PERMISSIONS_ENFORCEMENT_ENABLED` (default
`0`). When unset/disabled, callers must not require DB identity hydration —
local dev and builds stay admission-only. The kernel itself is pure and always
callable for tests and gradual rollout.

**MCP:** the shared API key authenticates durable service principal
`sp_mcp_cursor`. `X-MC-Operator-Email` is allowlisted audit/context only and
never grants human capabilities. With enforcement enabled, MCP authentication
loads that principal from `service_principals` and rejects missing or revoked
records. Service capabilities always come from the reviewed versioned registry;
callers cannot inject a capability list.

**Audit data:** every enforcement call should record `allowed`, `reasonCode`,
and `policyVersion` on the mutation audit event (wired by later routing/task
phases).

**Future extension:** add typed capabilities + grant-bundle / predicate updates
with contract tests. Do not introduce a policy expression language until a
concrete rule cannot be expressed that way.

### Key Files

- `src/lib/permissions/authorize.ts` — deny-by-default kernel
- `src/lib/permissions/grants.ts` — role + service-principal bundles
- `src/lib/permissions/predicates.ts` — contextual denials
- `src/lib/permissions/identities.ts` — record builders / active checks
- `src/lib/permissions/repository.ts` — lazy, parameterized identity lookups
- `db/migrations/016_permissions_identities.sql` — durable identity tables
- `src/lib/auth/identity.ts` — Entra `oid` session helpers + enforcement flag

## Dependencies

- Depends on: none at runtime for `authorize` (pure). Identity hydration uses
  the shared `db` query seam only when enforcement is enabled.
- Depended on by: `mc-data/repos` (`isApprover` shim), MCP auth (service
  principal actor), future routing / task / sync mutation paths.

## Owner

Vince

## Criticality

High
