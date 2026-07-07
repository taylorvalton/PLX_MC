# Alert Delivery Channels — v2 Scope

## What v1 already provides (trigger source)

The vendor-spend loader computes an `AlertLevel` per vendor per period
(`ok | warn | critical | over`, thresholds per-vendor: warn default 80%,
critical default 95% of the prorated monthly budget). The scheduled refresh
(`/api/cron/vendor-spend-refresh`) re-evaluates this every run. v2 only needs
a delivery edge, not new detection logic.

## Candidate channels

| Channel | Mechanism | Notes |
|---|---|---|
| Microsoft Teams | Graph app-only post to a designated channel | Reuses existing `MICROSOFT_GRAPH_*` credentials (graphCredentials()); in-tenant, preferred first channel |
| Email (Resend) | Resend API send | New external send capability — requires full integration declaration; Resend is itself a tracked vendor |
| MC Inbox | In-app notification row | Cheapest; still in-app, does not solve the "not looking at MC" gap |

## Trigger model (proposed)

- Fire on **level transitions** (ok→warn, warn→critical, →over), not on every
  cron run — dedupe by (vendor, level, period) with a sent-log table.
- Digest option: one daily summary when anything is ≥ warn.

## Governance requirements before build

Per the External Integrations contract, an autonomous **send** capability
requires, before merge:

- explicit enablement flag (default OFF) + kill switch
- integration declaration in `config/integrations.yaml`
- auditable sent-log (who/what/when, per delivery)
- named accountable human owner (Vince)
- no secrets outside `src/lib/secrets.ts`

## Out of scope for v2

- Per-initiative/project cost allocation alerts
- Autonomous remediation (throttling, config changes, task creation)
