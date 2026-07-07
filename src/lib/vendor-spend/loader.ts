// Loader — merges the vendor registry, DB snapshots/budgets, adapter health,
// and refresh audit into the API view models. Reads only; refresh.ts is the
// only writer of api-sourced snapshots.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateAlert, utilizationOf } from "./alerts";
import { adapterFor } from "./adapters";
import { apportionedAmountCents, prorateMonthlyBudget, resolvePeriod } from "./period";
import { parseVendorRegistryJson } from "./registry";
import {
  latestRefreshByVendor,
  listBudgets,
  listRefreshLog,
  listSnapshots,
} from "./store";
import type {
  CostSnapshot,
  PeriodRange,
  RefreshLogEntry,
  SpendPeriod,
  VendorBudget,
  VendorCostsRegistry,
  VendorEntry,
  VendorSpendDetail,
  VendorSpendIndex,
  VendorSpendRow,
} from "./types";

export type VendorRegistryLoadResult =
  | { ok: true; registry: VendorCostsRegistry }
  | { ok: false; error: string };

/** Read + validate config/vendor-costs-registry.json. Never throws. */
export function loadVendorRegistry(): VendorRegistryLoadResult {
  let raw: string;
  try {
    raw = readFileSync(join(process.cwd(), "config/vendor-costs-registry.json"), "utf8");
  } catch (err) {
    return { ok: false, error: `vendor registry unreadable: ${(err as Error).message}` };
  }
  const parsed = parseVendorRegistryJson(raw);
  if (!parsed.ok) return { ok: false, error: parsed.error };
  return { ok: true, registry: parsed.registry };
}

function buildRow(
  vendor: VendorEntry,
  range: PeriodRange,
  snapshots: CostSnapshot[],
  budget: VendorBudget | null,
  lastRefresh: RefreshLogEntry | null
): VendorSpendRow {
  const mine = snapshots.filter((s) => s.vendorId === vendor.id);
  const spendCents = mine.reduce((sum, s) => sum + apportionedAmountCents(s, range), 0);
  const estimated = mine.some(
    (s) => s.estimated && apportionedAmountCents(s, range) > 0
  );

  let sourceStatus: VendorSpendRow["sourceStatus"];
  let degradedReason: VendorSpendRow["degradedReason"];
  let degradedNote: string | undefined;
  if (vendor.adapter === "manual") {
    sourceStatus = "manual";
  } else {
    const adapter = adapterFor(vendor.adapter);
    if (adapter?.configured() && lastRefresh?.status !== "degraded" && lastRefresh?.status !== "error") {
      sourceStatus = "live";
    } else {
      sourceStatus = "degraded";
      if (!adapter?.configured()) {
        degradedReason = "key_missing";
        degradedNote = `${vendor.name} adapter credentials are not configured — spend shown from manual entries only.`;
      } else {
        degradedReason = "http_error";
        degradedNote = lastRefresh?.message ?? "Last automated refresh failed.";
      }
    }
  }

  const periodBudgetCents = budget
    ? prorateMonthlyBudget(budget.monthlyBudgetCents, range)
    : null;

  return {
    vendor,
    sourceStatus,
    degradedReason,
    degradedNote,
    spendCents,
    estimated,
    snapshotCount: mine.length,
    budget,
    periodBudgetCents,
    utilization: utilizationOf(spendCents, periodBudgetCents),
    alert: evaluateAlert(
      spendCents,
      periodBudgetCents,
      budget?.warnPct,
      budget?.criticalPct
    ),
    lastRefresh,
  };
}

/** Assemble the overview for one period. Sorted scariest-first. */
export async function buildVendorSpendIndex(
  period: SpendPeriod,
  now: Date = new Date()
): Promise<VendorSpendIndex> {
  const loaded = loadVendorRegistry();
  if (!loaded.ok) throw new Error(loaded.error);
  const range = resolvePeriod(period, now);

  const [snapshots, budgets, refreshMap] = await Promise.all([
    listSnapshots(range.start, range.end),
    listBudgets(),
    latestRefreshByVendor(),
  ]);
  const budgetMap = new Map(budgets.map((b) => [b.vendorId, b]));

  const rows = loaded.registry.vendors.map((vendor) =>
    buildRow(
      vendor,
      range,
      snapshots,
      budgetMap.get(vendor.id) ?? null,
      refreshMap.get(vendor.id) ?? null
    )
  );

  // Scariest-first: over > critical > warn, then degraded sources, then spend.
  const alertRank = { over: 0, critical: 1, warn: 2, ok: 4, none: 5 } as const;
  rows.sort((a, b) => {
    const ar = alertRank[a.alert] - (a.sourceStatus === "degraded" ? 0.5 : 0);
    const br = alertRank[b.alert] - (b.sourceStatus === "degraded" ? 0.5 : 0);
    return ar - br || b.spendCents - a.spendCents || a.vendor.name.localeCompare(b.vendor.name);
  });

  const budgeted = rows.filter((r) => r.periodBudgetCents !== null);
  return {
    period: range,
    rows,
    totals: {
      spendCents: rows.reduce((sum, r) => sum + r.spendCents, 0),
      budgetedSpendCents: budgeted.reduce((sum, r) => sum + r.spendCents, 0),
      periodBudgetCents: budgeted.reduce((sum, r) => sum + (r.periodBudgetCents ?? 0), 0),
      warn: rows.filter((r) => r.alert === "warn").length,
      critical: rows.filter((r) => r.alert === "critical").length,
      over: rows.filter((r) => r.alert === "over").length,
    },
  };
}

/** Assemble the detail view for one vendor. Returns null for unknown ids. */
export async function buildVendorSpendDetail(
  vendorId: string,
  period: SpendPeriod,
  now: Date = new Date()
): Promise<VendorSpendDetail | null> {
  const index = await buildVendorSpendIndex(period, now);
  const row = index.rows.find((r) => r.vendor.id === vendorId);
  if (!row) return null;
  const [snapshots, refreshLog] = await Promise.all([
    listSnapshots(index.period.start, index.period.end, vendorId),
    listRefreshLog(vendorId),
  ]);
  return { row, snapshots: snapshots.slice().reverse(), refreshLog };
}
