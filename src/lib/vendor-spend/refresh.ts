// Refresh orchestration — pull each automated vendor's adapter, persist
// idempotent api-sourced snapshots, and record the outcome in the refresh
// audit log. One vendor failing never kills the batch; degraded results are
// logged loudly and left visible in the UI.

import { loadVendorRegistry } from "./loader";
import { resolvePeriod } from "./period";
import { logRefresh, upsertApiSnapshot } from "./store";
import type { RefreshLogEntry, SpendPeriod } from "./types";
import { adapterFor } from "./adapters";

export interface RefreshOutcome {
  vendorId: string;
  status: RefreshLogEntry["status"];
  message?: string;
  snapshotCount: number;
}

/**
 * Refresh one automated vendor over `period` (default YTD so backfills catch
 * the full year on first run; the daily upsert makes re-pulls idempotent).
 */
export async function refreshVendor(
  vendorId: string,
  period: SpendPeriod = "ytd",
  now: Date = new Date()
): Promise<RefreshOutcome> {
  const adapter = adapterFor(vendorId);
  if (!adapter) {
    const outcome: RefreshOutcome = {
      vendorId,
      status: "error",
      message: `No automated adapter for vendor "${vendorId}".`,
      snapshotCount: 0,
    };
    await logRefresh(outcome);
    return outcome;
  }

  const range = resolvePeriod(period, now);
  const result = await adapter.pull(range);

  if (!result.ok) {
    const outcome: RefreshOutcome = {
      vendorId,
      status: "degraded",
      message: `[${result.reason}] ${result.note}`,
      snapshotCount: 0,
    };
    await logRefresh(outcome);
    return outcome;
  }

  let written = 0;
  for (const obs of result.observations) {
    await upsertApiSnapshot({
      vendorId,
      periodStart: obs.periodStart,
      periodEnd: obs.periodEnd,
      amountCents: obs.amountCents,
      estimated: obs.estimated,
    });
    written++;
  }
  const outcome: RefreshOutcome = { vendorId, status: "ok", snapshotCount: written };
  await logRefresh(outcome);
  return outcome;
}

/** Refresh every registry vendor with an automated adapter. Never throws. */
export async function refreshAutomatedVendors(
  period: SpendPeriod = "ytd",
  now: Date = new Date()
): Promise<RefreshOutcome[]> {
  const loaded = loadVendorRegistry();
  if (!loaded.ok) {
    return [
      { vendorId: "registry", status: "error", message: loaded.error, snapshotCount: 0 },
    ];
  }
  const automated = loaded.registry.vendors.filter((v) => v.adapter !== "manual");
  const outcomes: RefreshOutcome[] = [];
  for (const vendor of automated) {
    outcomes.push(await refreshVendor(vendor.id, period, now));
  }
  return outcomes;
}
