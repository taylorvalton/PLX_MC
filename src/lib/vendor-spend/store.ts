// Vendor spend persistence — budgets, cost snapshots, refresh log.
// Uses Postgres when configured; otherwise a process-local fallback keeps
// tests/local dev from needing PLX_MC_DATABASE_URL (same contract as the
// skills-directory submissions store).

import { randomUUID } from "node:crypto";

import { query } from "@/lib/db";

import { DEFAULT_CRITICAL_PCT, DEFAULT_WARN_PCT } from "./alerts";
import type {
  CostSnapshot,
  RefreshLogEntry,
  RefreshStatus,
  SnapshotSource,
  VendorBudget,
} from "./types";

// ─── Inputs ───────────────────────────────────────────────────────────────────

export interface UpsertBudgetInput {
  vendorId: string;
  monthlyBudgetCents: number;
  warnPct?: number;
  criticalPct?: number;
  updatedBy: string;
}

export interface CreateSnapshotInput {
  vendorId: string;
  periodStart: string;
  periodEnd: string;
  amountCents: number;
  currency?: string;
  source: SnapshotSource;
  estimated?: boolean;
  enteredBy?: string;
  note?: string;
}

export interface LogRefreshInput {
  vendorId: string;
  status: RefreshStatus;
  message?: string;
  snapshotCount: number;
}

// ─── Memory fallback ──────────────────────────────────────────────────────────

interface MemoryState {
  budgets: Map<string, VendorBudget>;
  snapshots: Map<string, CostSnapshot>;
  refreshLog: RefreshLogEntry[];
}

const globalForVendorSpend = globalThis as unknown as {
  __plxVendorSpend?: MemoryState;
};

function memory(): MemoryState {
  if (!globalForVendorSpend.__plxVendorSpend) {
    globalForVendorSpend.__plxVendorSpend = {
      budgets: new Map(),
      snapshots: new Map(),
      refreshLog: [],
    };
  }
  return globalForVendorSpend.__plxVendorSpend;
}

function hasDb(): boolean {
  return !!process.env.PLX_MC_DATABASE_URL;
}

function nowIso(): string {
  return new Date().toISOString();
}

function dateIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

/** pg returns `date` columns as Date objects at local midnight; keep yyyy-mm-dd. */
function dayIso(value: Date | string): string {
  if (value instanceof Date) {
    // Migration columns are `date` — pg parses them as local-midnight Dates;
    // format the calendar day, not the UTC instant.
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return value.slice(0, 10);
}

// ─── Row mappers ──────────────────────────────────────────────────────────────

interface BudgetRow {
  vendor_id: string;
  monthly_budget_cents: string | number;
  warn_pct: string | number;
  critical_pct: string | number;
  updated_by: string;
  updated_at: Date | string;
}

function toBudget(row: BudgetRow): VendorBudget {
  return {
    vendorId: row.vendor_id,
    monthlyBudgetCents: Number(row.monthly_budget_cents),
    warnPct: Number(row.warn_pct),
    criticalPct: Number(row.critical_pct),
    updatedBy: row.updated_by,
    updatedAt: dateIso(row.updated_at),
  };
}

interface SnapshotRow {
  id: string;
  vendor_id: string;
  period_start: Date | string;
  period_end: Date | string;
  amount_cents: string | number;
  currency: string;
  source: SnapshotSource;
  estimated: boolean;
  entered_by: string | null;
  note: string | null;
  created_at: Date | string;
}

function toSnapshot(row: SnapshotRow): CostSnapshot {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    periodStart: dayIso(row.period_start),
    periodEnd: dayIso(row.period_end),
    amountCents: Number(row.amount_cents),
    currency: row.currency,
    source: row.source,
    estimated: row.estimated,
    enteredBy: row.entered_by ?? undefined,
    note: row.note ?? undefined,
    createdAt: dateIso(row.created_at),
  };
}

interface RefreshRow {
  id: string;
  vendor_id: string;
  status: RefreshStatus;
  message: string | null;
  snapshot_count: string | number;
  created_at: Date | string;
}

function toRefresh(row: RefreshRow): RefreshLogEntry {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    status: row.status,
    message: row.message ?? undefined,
    snapshotCount: Number(row.snapshot_count),
    createdAt: dateIso(row.created_at),
  };
}

// ─── Budgets ──────────────────────────────────────────────────────────────────

export async function listBudgets(): Promise<VendorBudget[]> {
  if (!hasDb()) {
    return [...memory().budgets.values()].sort((a, b) =>
      a.vendorId.localeCompare(b.vendorId)
    );
  }
  const rows = await query<BudgetRow>(
    `SELECT vendor_id, monthly_budget_cents, warn_pct, critical_pct, updated_by, updated_at
       FROM vendor_cost_budgets ORDER BY vendor_id`
  );
  return rows.map(toBudget);
}

export async function upsertBudget(input: UpsertBudgetInput): Promise<VendorBudget> {
  const warnPct = input.warnPct ?? DEFAULT_WARN_PCT;
  const criticalPct = input.criticalPct ?? DEFAULT_CRITICAL_PCT;
  if (!hasDb()) {
    const budget: VendorBudget = {
      vendorId: input.vendorId,
      monthlyBudgetCents: input.monthlyBudgetCents,
      warnPct,
      criticalPct,
      updatedBy: input.updatedBy,
      updatedAt: nowIso(),
    };
    memory().budgets.set(input.vendorId, budget);
    return budget;
  }
  const rows = await query<BudgetRow>(
    `INSERT INTO vendor_cost_budgets (vendor_id, monthly_budget_cents, warn_pct, critical_pct, updated_by)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (vendor_id) DO UPDATE SET
       monthly_budget_cents = EXCLUDED.monthly_budget_cents,
       warn_pct = EXCLUDED.warn_pct,
       critical_pct = EXCLUDED.critical_pct,
       updated_by = EXCLUDED.updated_by,
       updated_at = now()
     RETURNING vendor_id, monthly_budget_cents, warn_pct, critical_pct, updated_by, updated_at`,
    [input.vendorId, input.monthlyBudgetCents, warnPct, criticalPct, input.updatedBy]
  );
  return toBudget(rows[0]);
}

// ─── Snapshots ────────────────────────────────────────────────────────────────

export async function createSnapshot(input: CreateSnapshotInput): Promise<CostSnapshot> {
  const id = `vcs-${randomUUID()}`;
  if (!hasDb()) {
    const snapshot: CostSnapshot = {
      id,
      vendorId: input.vendorId,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      amountCents: input.amountCents,
      currency: input.currency ?? "USD",
      source: input.source,
      estimated: input.estimated ?? false,
      enteredBy: input.enteredBy,
      note: input.note,
      createdAt: nowIso(),
    };
    memory().snapshots.set(id, snapshot);
    return snapshot;
  }
  const rows = await query<SnapshotRow>(
    `INSERT INTO vendor_cost_snapshots
       (id, vendor_id, period_start, period_end, amount_cents, currency, source, estimated, entered_by, note)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id, vendor_id, period_start, period_end, amount_cents, currency,
               source, estimated, entered_by, note, created_at`,
    [
      id,
      input.vendorId,
      input.periodStart,
      input.periodEnd,
      input.amountCents,
      input.currency ?? "USD",
      input.source,
      input.estimated ?? false,
      input.enteredBy ?? null,
      input.note ?? null,
    ]
  );
  return toSnapshot(rows[0]);
}

/**
 * Idempotent upsert for adapter pulls: one api-sourced row per vendor per
 * period_start, refreshed in place so re-pulls never double-count. Daily
 * observations key on their day; a billing-cycle observation (Cursor) keys on
 * the cycle start and its amount/end grow with each refresh.
 */
export async function upsertApiSnapshot(input: {
  vendorId: string;
  periodStart: string;
  periodEnd: string;
  amountCents: number;
  estimated: boolean;
}): Promise<CostSnapshot> {
  if (!hasDb()) {
    const mem = memory();
    const existing = [...mem.snapshots.values()].find(
      (s) =>
        s.vendorId === input.vendorId &&
        s.source === "api" &&
        s.periodStart === input.periodStart
    );
    if (existing) {
      const updated: CostSnapshot = {
        ...existing,
        periodEnd: input.periodEnd,
        amountCents: input.amountCents,
        estimated: input.estimated,
      };
      mem.snapshots.set(existing.id, updated);
      return updated;
    }
    return createSnapshot({
      vendorId: input.vendorId,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      amountCents: input.amountCents,
      source: "api",
      estimated: input.estimated,
    });
  }
  const rows = await query<SnapshotRow>(
    `INSERT INTO vendor_cost_snapshots
       (id, vendor_id, period_start, period_end, amount_cents, currency, source, estimated)
     VALUES ($1,$2,$3,$4,$5,'USD','api',$6)
     ON CONFLICT (vendor_id, period_start) WHERE source = 'api'
     DO UPDATE SET period_end = EXCLUDED.period_end,
                   amount_cents = EXCLUDED.amount_cents,
                   estimated = EXCLUDED.estimated,
                   created_at = now()
     RETURNING id, vendor_id, period_start, period_end, amount_cents, currency,
               source, estimated, entered_by, note, created_at`,
    [
      `vcs-${randomUUID()}`,
      input.vendorId,
      input.periodStart,
      input.periodEnd,
      input.amountCents,
      input.estimated,
    ]
  );
  return toSnapshot(rows[0]);
}

/** Snapshots overlapping [start, end) — optionally for one vendor. */
export async function listSnapshots(
  start: string,
  end: string,
  vendorId?: string
): Promise<CostSnapshot[]> {
  if (!hasDb()) {
    return [...memory().snapshots.values()]
      .filter(
        (s) =>
          s.periodEnd > start &&
          s.periodStart < end &&
          (!vendorId || s.vendorId === vendorId)
      )
      .sort(
        (a, b) =>
          a.vendorId.localeCompare(b.vendorId) || a.periodStart.localeCompare(b.periodStart)
      );
  }
  const params: unknown[] = [start, end];
  let where = "period_end > $1 AND period_start < $2";
  if (vendorId) {
    params.push(vendorId);
    where += " AND vendor_id = $3";
  }
  const rows = await query<SnapshotRow>(
    `SELECT id, vendor_id, period_start, period_end, amount_cents, currency,
            source, estimated, entered_by, note, created_at
       FROM vendor_cost_snapshots
      WHERE ${where}
      ORDER BY vendor_id, period_start`,
    params
  );
  return rows.map(toSnapshot);
}

// ─── Refresh log ──────────────────────────────────────────────────────────────

export async function logRefresh(input: LogRefreshInput): Promise<RefreshLogEntry> {
  const id = `vcr-${randomUUID()}`;
  if (!hasDb()) {
    const entry: RefreshLogEntry = {
      id,
      vendorId: input.vendorId,
      status: input.status,
      message: input.message,
      snapshotCount: input.snapshotCount,
      createdAt: nowIso(),
    };
    memory().refreshLog.push(entry);
    return entry;
  }
  const rows = await query<RefreshRow>(
    `INSERT INTO vendor_cost_refresh_log (id, vendor_id, status, message, snapshot_count)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, vendor_id, status, message, snapshot_count, created_at`,
    [id, input.vendorId, input.status, input.message ?? null, input.snapshotCount]
  );
  return toRefresh(rows[0]);
}

/** Most recent refresh entry per vendor (all vendors, one row each). */
export async function latestRefreshByVendor(): Promise<Map<string, RefreshLogEntry>> {
  if (!hasDb()) {
    const map = new Map<string, RefreshLogEntry>();
    for (const entry of memory().refreshLog) {
      const prev = map.get(entry.vendorId);
      if (!prev || entry.createdAt >= prev.createdAt) map.set(entry.vendorId, entry);
    }
    return map;
  }
  const rows = await query<RefreshRow>(
    `SELECT DISTINCT ON (vendor_id)
            id, vendor_id, status, message, snapshot_count, created_at
       FROM vendor_cost_refresh_log
      ORDER BY vendor_id, created_at DESC`
  );
  return new Map(rows.map((r) => [r.vendor_id, toRefresh(r)]));
}

/** Recent refresh log entries for one vendor, newest first. */
export async function listRefreshLog(
  vendorId: string,
  limit = 20
): Promise<RefreshLogEntry[]> {
  if (!hasDb()) {
    // Push order is chronological; reverse for newest-first (createdAt alone
    // can tie within one millisecond).
    return memory()
      .refreshLog.filter((e) => e.vendorId === vendorId)
      .reverse()
      .slice(0, limit);
  }
  const rows = await query<RefreshRow>(
    `SELECT id, vendor_id, status, message, snapshot_count, created_at
       FROM vendor_cost_refresh_log
      WHERE vendor_id = $1
      ORDER BY created_at DESC
      LIMIT $2`,
    [vendorId, limit]
  );
  return rows.map(toRefresh);
}

/** Test-only: clear the in-memory fallback (no-op when Postgres is configured). */
export function __resetVendorSpendMemory(): void {
  globalForVendorSpend.__plxVendorSpend = undefined;
}
