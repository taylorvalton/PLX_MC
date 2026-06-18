# Module: compliance

## What

The enforcement brain for EN-007 — PLX MC as the system of record. It decides
whether a pull request against a tracked repo is compliant: what **risk tier** a
change is, what **bundle** that tier requires (rollback plan, PRD, evidence), and
the final **pass/block verdict** for an agent vs operator PR. It is pure logic —
no I/O, no GitHub, no DB. The GitHub status check, checkout/dispatch ledger,
`mc_events` log, and git→MC ingestion wrap this core in later phases.

## Why

Every change to a tracked repo must resolve to governed MC work; agents are gated
on a complete bundle, operators are recorded but ungated (EN-007 decisions 2, 5,
9, 12). Keeping the verdict logic pure makes the gate deterministic, fast on the
PR hot path, and unit-testable without a live Postgres or GitHub App — so the
truth table is proven before any plumbing exists.

## How

- `classifyRiskTier(changedPaths, labels)` — `low | standard | high`. Explicit
  labels (`risk:high`/`risk:low`) win, then high-risk paths (migrations, auth/
  permissions, infra, `.github/workflows`, deploy), then docs/test-only = low,
  else standard. Mirrors the governance contract's Database Safety / External
  Integrations risk surface.
- `bundleRequirementsFor(tier)` — the floor per tier: high = full evidence +
  rollback + bucket PRD; standard = complete checklist + rollback note; low =
  minimal summary.
- `evidenceCompleteForTier(evidence, tier)` — reuses EN-003 `evidenceComplete`;
  adds the rollback-note and (for high) change-appropriate-proof checks
  (screenshots **or** a test run).
- `verifyCompliance({ task, actor, tier, bucketHasPrd })` — the verdict. Operator
  PRs pass (recorded, ungated); an agent PR with no checked-out task is blocked;
  agent PRs must carry a human accountable owner (EN-003) + the tier bundle. The
  soft-vs-hard (warn vs block) decision belongs to the caller.

Deferred to later phases (see `docs/product/SYSTEM_OF_RECORD.md`): the checkout +
dispatch ledger and `/api/compliance/*` routes (P1b), the GitHub App + branch
protection + git→MC ingestion + reconciliation queue (P3), and the first-class
`mc_events` event log / Second-Brain substrate (P5).

## Dependencies

`@/lib/mc-data` (the `Task`/`Evidence` types, `evidenceComplete`,
`hasHumanAccountableOwner` from EN-003 `policy.ts`). No external services, no DB
in the pure core. Depended on by: the (planned) `/api/compliance/*` routes and the
GitHub status-check workflow.

### Key Files

- `src/lib/compliance/risk.ts` — risk-tier classifier + per-tier bundle floor
- `src/lib/compliance/verify.ts` — `evidenceCompleteForTier` + `verifyCompliance`
- `src/lib/compliance/types.ts` — `RiskTier`, `ActorKind`, `VerifyInput/Result`
- `src/lib/compliance/index.ts` — barrel (import through here)
- `tests/compliance.test.ts` — risk truth table + verifier verdicts
- `docs/product/SYSTEM_OF_RECORD.md` — the governing spec (EN-007)

## Owner

Vince

## Criticality

Critical
