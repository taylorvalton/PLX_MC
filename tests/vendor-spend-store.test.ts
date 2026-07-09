// Store invariants on the memory fallback (no PLX_MC_DATABASE_URL in tests):
// budget upsert semantics, snapshot range listing, api-snapshot idempotency,
// and latest-refresh selection.
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  createSnapshot,
  latestRefreshByVendor,
  listBudgets,
  listRefreshLog,
  listSnapshots,
  logRefresh,
  upsertApiSnapshot,
  upsertBudget,
} from "@/lib/vendor-spend";
import { __resetVendorSpendMemory } from "@/lib/vendor-spend/store";

beforeEach(() => {
  delete process.env.PLX_MC_DATABASE_URL;
  __resetVendorSpendMemory();
});

afterEach(() => {
  __resetVendorSpendMemory();
});

describe("budgets", () => {
  it("upsert creates then replaces a vendor's budget", async () => {
    await upsertBudget({ vendorId: "aws", monthlyBudgetCents: 100_000, updatedBy: "vince" });
    await upsertBudget({
      vendorId: "aws",
      monthlyBudgetCents: 250_000,
      warnPct: 0.7,
      criticalPct: 0.9,
      updatedBy: "vince",
    });
    const budgets = await listBudgets();
    expect(budgets).toHaveLength(1);
    expect(budgets[0].monthlyBudgetCents).toBe(250_000);
    expect(budgets[0].warnPct).toBe(0.7);
  });

  it("defaults thresholds to 0.80 / 0.95", async () => {
    const budget = await upsertBudget({
      vendorId: "cursor",
      monthlyBudgetCents: 50_000,
      updatedBy: "vince",
    });
    expect(budget.warnPct).toBe(0.8);
    expect(budget.criticalPct).toBe(0.95);
  });
});

describe("snapshots", () => {
  it("listSnapshots returns only rows overlapping the range", async () => {
    await createSnapshot({
      vendorId: "aws",
      periodStart: "2026-06-01",
      periodEnd: "2026-06-02",
      amountCents: 100,
      source: "api",
    });
    await createSnapshot({
      vendorId: "aws",
      periodStart: "2026-07-02",
      periodEnd: "2026-07-03",
      amountCents: 200,
      source: "api",
    });
    const july = await listSnapshots("2026-07-01", "2026-08-01");
    expect(july).toHaveLength(1);
    expect(july[0].amountCents).toBe(200);
  });

  it("a spanning manual snapshot overlaps both months", async () => {
    await createSnapshot({
      vendorId: "adobe",
      periodStart: "2026-06-15",
      periodEnd: "2026-07-15",
      amountCents: 3000,
      source: "manual",
      enteredBy: "vince",
    });
    expect(await listSnapshots("2026-06-01", "2026-07-01")).toHaveLength(1);
    expect(await listSnapshots("2026-07-01", "2026-08-01")).toHaveLength(1);
    expect(await listSnapshots("2026-08-01", "2026-09-01")).toHaveLength(0);
  });

  it("upsertApiSnapshot is idempotent per vendor + period_start", async () => {
    await upsertApiSnapshot({
      vendorId: "aws",
      periodStart: "2026-07-01",
      periodEnd: "2026-07-02",
      amountCents: 100,
      estimated: true,
    });
    await upsertApiSnapshot({
      vendorId: "aws",
      periodStart: "2026-07-01",
      periodEnd: "2026-07-02",
      amountCents: 150,
      estimated: false,
    });
    const rows = await listSnapshots("2026-07-01", "2026-08-01", "aws");
    expect(rows).toHaveLength(1);
    expect(rows[0].amountCents).toBe(150);
    expect(rows[0].estimated).toBe(false);
  });
});

describe("refresh log", () => {
  it("latestRefreshByVendor keeps the newest entry per vendor", async () => {
    await logRefresh({ vendorId: "aws", status: "degraded", message: "no key", snapshotCount: 0 });
    await logRefresh({ vendorId: "aws", status: "ok", snapshotCount: 15 });
    const latest = await latestRefreshByVendor();
    expect(latest.get("aws")?.status).toBe("ok");
    expect(latest.get("aws")?.snapshotCount).toBe(15);
  });

  it("listRefreshLog returns newest first for one vendor", async () => {
    await logRefresh({ vendorId: "cursor", status: "degraded", message: "no key", snapshotCount: 0 });
    await logRefresh({ vendorId: "cursor", status: "ok", snapshotCount: 1 });
    await logRefresh({ vendorId: "aws", status: "ok", snapshotCount: 3 });
    const log = await listRefreshLog("cursor");
    expect(log).toHaveLength(2);
    expect(log[0].status).toBe("ok");
  });
});
