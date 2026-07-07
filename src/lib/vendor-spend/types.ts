// Types for the Vendor Spend (AI Spend) domain module.
// Consumers must import through the barrel (src/lib/vendor-spend/index.ts).

// ─── Registry (plx-vendor-costs-registry/v1) ─────────────────────────────────

export type VendorAdapterKind = "aws" | "anthropic" | "cursor" | "manual";

export type VendorBilling = "usage" | "subscription" | "mixed";

export interface VendorEntry {
  id: string;
  name: string;
  category: string;
  adapter: VendorAdapterKind;
  billing: VendorBilling;
  console_url?: string;
  notes?: string;
}

export interface VendorCostsRegistry {
  schema_version: "plx-vendor-costs-registry/v1";
  vendors: VendorEntry[];
}

// ─── Periods ──────────────────────────────────────────────────────────────────

export type SpendPeriod = "mtd" | "weekly" | "quarterly" | "ytd";

export const SPEND_PERIODS: SpendPeriod[] = ["mtd", "weekly", "quarterly", "ytd"];

/** Resolved UTC date range for a period. `start` inclusive, `end` exclusive. */
export interface PeriodRange {
  period: SpendPeriod;
  start: string; // ISO date (yyyy-mm-dd), inclusive
  end: string; // ISO date (yyyy-mm-dd), exclusive
}

// ─── Persistence rows ─────────────────────────────────────────────────────────

export type SnapshotSource = "api" | "manual";

/**
 * One cost observation for a vendor over [periodStart, periodEnd).
 * API adapters write daily rows; manual entries may span any range
 * (e.g. a monthly invoice).
 */
export interface CostSnapshot {
  id: string;
  vendorId: string;
  periodStart: string; // ISO date, inclusive
  periodEnd: string; // ISO date, exclusive
  amountCents: number;
  currency: string;
  source: SnapshotSource;
  /** True when the upstream marks the figure as an estimate (e.g. AWS open days). */
  estimated: boolean;
  enteredBy?: string;
  note?: string;
  createdAt: string;
}

export interface VendorBudget {
  vendorId: string;
  monthlyBudgetCents: number;
  /** Fraction of the period budget that triggers the warn state (default 0.8). */
  warnPct: number;
  /** Fraction of the period budget that triggers the critical state (default 0.95). */
  criticalPct: number;
  updatedBy: string;
  updatedAt: string;
}

export type RefreshStatus = "ok" | "degraded" | "error";

export interface RefreshLogEntry {
  id: string;
  vendorId: string;
  status: RefreshStatus;
  message?: string;
  snapshotCount: number;
  createdAt: string;
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

/**
 * Budget alert level for one vendor in one period.
 * "none" — no budget configured (never an alarm, never fabricated).
 */
export type AlertLevel = "none" | "ok" | "warn" | "critical" | "over";

// ─── Adapter results ──────────────────────────────────────────────────────────

export type AdapterDegradedReason =
  | "key_missing"
  | "unauthorized"
  | "http_error"
  | "network_error"
  | "bad_payload";

/**
 * One cost observation produced by an automated adapter pull, covering
 * [periodStart, periodEnd). AWS/Anthropic emit daily observations; Cursor
 * emits one observation for the current billing cycle.
 */
export interface AdapterObservation {
  periodStart: string; // ISO date, inclusive
  periodEnd: string; // ISO date, exclusive
  amountCents: number;
  estimated: boolean;
}

/**
 * Discriminated adapter pull result — adapters never throw.
 * Degraded results are visible rows, not hidden failures.
 */
export type AdapterPullResult =
  | { ok: true; vendorId: string; observations: AdapterObservation[] }
  | { ok: false; vendorId: string; reason: AdapterDegradedReason; note: string };

// ─── API view models ──────────────────────────────────────────────────────────

export type VendorSourceStatus = "live" | "degraded" | "manual";

/** One row of the vendor spend overview (what GET /api/vendor-spend returns). */
export interface VendorSpendRow {
  vendor: VendorEntry;
  /** live = automated adapter healthy; degraded = automated adapter down; manual = manual-entry vendor. */
  sourceStatus: VendorSourceStatus;
  degradedReason?: AdapterDegradedReason;
  degradedNote?: string;
  spendCents: number;
  /** True when any contributing snapshot is an estimate. */
  estimated: boolean;
  snapshotCount: number;
  budget: VendorBudget | null;
  /** Monthly budget prorated to the requested period (null without a budget). */
  periodBudgetCents: number | null;
  /** spend / periodBudget (null without a budget). */
  utilization: number | null;
  alert: AlertLevel;
  lastRefresh: RefreshLogEntry | null;
}

export interface VendorSpendIndex {
  period: PeriodRange;
  rows: VendorSpendRow[];
  totals: {
    spendCents: number;
    budgetedSpendCents: number;
    periodBudgetCents: number;
    /** Vendors currently at warn / critical / over budget. */
    warn: number;
    critical: number;
    over: number;
  };
}

export interface VendorSpendDetail {
  row: VendorSpendRow;
  snapshots: CostSnapshot[];
  refreshLog: RefreshLogEntry[];
}
