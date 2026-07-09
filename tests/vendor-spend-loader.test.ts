// Loader + refresh integration over the memory store and the committed
// registry: degraded adapter rows stay visible, budgets drive alerts, the
// index totals reconcile, and refresh writes idempotent api snapshots.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  pull: vi.fn(),
}));

// Stub the adapter registry: "aws" is a controllable fake; anthropic/cursor
// stay unconfigured so their rows exercise the key_missing degrade path.
vi.mock("@/lib/vendor-spend/adapters", () => {
  const fakeAws = {
    vendorId: "aws",
    configured: () => !!process.env.AWS_ACCESS_KEY_ID,
    pull: m.pull,
  };
  const missing = (vendorId: string, envName: string) => ({
    vendorId,
    configured: () => false,
    pull: async () => ({
      ok: false as const,
      vendorId,
      reason: "key_missing" as const,
      note: `${envName} is not configured.`,
    }),
  });
  const vendorAdapters = [fakeAws, missing("anthropic", "ANTHROPIC_ADMIN_API_KEY"), missing("cursor", "CURSOR_ADMIN_API_KEY")];
  return {
    vendorAdapters,
    adapterFor: (id: string) => vendorAdapters.find((a) => a.vendorId === id) ?? null,
  };
});

import {
  buildVendorSpendDetail,
  buildVendorSpendIndex,
  createSnapshot,
  refreshAutomatedVendors,
  refreshVendor,
  upsertBudget,
} from "@/lib/vendor-spend";
import { __resetVendorSpendMemory } from "@/lib/vendor-spend/store";

const NOW = new Date("2026-07-15T12:00:00Z");

beforeEach(() => {
  delete process.env.PLX_MC_DATABASE_URL;
  delete process.env.AWS_ACCESS_KEY_ID;
  delete process.env.AWS_SECRET_ACCESS_KEY;
  __resetVendorSpendMemory();
  m.pull.mockReset();
});

afterEach(() => {
  __resetVendorSpendMemory();
});

describe("buildVendorSpendIndex", () => {
  it("lists every registry vendor with honest source status", async () => {
    const index = await buildVendorSpendIndex("mtd", NOW);
    expect(index.rows).toHaveLength(10);
    const byId = new Map(index.rows.map((r) => [r.vendor.id, r]));
    // Unconfigured automated vendors are degraded — never silently manual.
    expect(byId.get("anthropic")?.sourceStatus).toBe("degraded");
    expect(byId.get("anthropic")?.degradedReason).toBe("key_missing");
    expect(byId.get("cursor")?.sourceStatus).toBe("degraded");
    expect(byId.get("adobe")?.sourceStatus).toBe("manual");
  });

  it("computes spend, utilization, and alert from snapshots + budget", async () => {
    await createSnapshot({
      vendorId: "aws",
      periodStart: "2026-07-03",
      periodEnd: "2026-07-04",
      amountCents: 90_000,
      source: "api",
    });
    await upsertBudget({ vendorId: "aws", monthlyBudgetCents: 100_000, updatedBy: "vince" });

    const index = await buildVendorSpendIndex("mtd", NOW);
    const aws = index.rows.find((r) => r.vendor.id === "aws");
    expect(aws?.spendCents).toBe(90_000);
    expect(aws?.periodBudgetCents).toBe(100_000);
    expect(aws?.utilization).toBeCloseTo(0.9);
    expect(aws?.alert).toBe("warn");
    expect(index.totals.warn).toBe(1);
    expect(index.totals.spendCents).toBe(90_000);
  });

  it("sorts scariest-first: over-budget rows precede ok rows", async () => {
    await upsertBudget({ vendorId: "adobe", monthlyBudgetCents: 1_000, updatedBy: "vince" });
    await createSnapshot({
      vendorId: "adobe",
      periodStart: "2026-07-01",
      periodEnd: "2026-07-02",
      amountCents: 5_000,
      source: "manual",
      enteredBy: "vince",
    });
    await upsertBudget({ vendorId: "google", monthlyBudgetCents: 1_000_000, updatedBy: "vince" });

    const index = await buildVendorSpendIndex("mtd", NOW);
    expect(index.rows[0].vendor.id).toBe("adobe");
    expect(index.rows[0].alert).toBe("over");
    expect(index.totals.over).toBe(1);
  });

  it("no budget → alert none and null utilization (honest absence)", async () => {
    const index = await buildVendorSpendIndex("mtd", NOW);
    const vercel = index.rows.find((r) => r.vendor.id === "vercel");
    expect(vercel?.alert).toBe("none");
    expect(vercel?.utilization).toBeNull();
    expect(vercel?.periodBudgetCents).toBeNull();
  });
});

describe("buildVendorSpendDetail", () => {
  it("returns snapshots + refresh log for a known vendor, null for unknown", async () => {
    await createSnapshot({
      vendorId: "godaddy",
      periodStart: "2026-07-01",
      periodEnd: "2026-08-01",
      amountCents: 2_599,
      source: "manual",
      enteredBy: "vince",
      note: "Annual domain bundle / 12",
    });
    const detail = await buildVendorSpendDetail("godaddy", "mtd", NOW);
    expect(detail?.row.vendor.id).toBe("godaddy");
    expect(detail?.snapshots).toHaveLength(1);
    expect(await buildVendorSpendDetail("not-a-vendor", "mtd", NOW)).toBeNull();
  });
});

describe("refresh", () => {
  it("persists adapter observations as idempotent api snapshots + ok log", async () => {
    process.env.AWS_ACCESS_KEY_ID = "AKIATEST";
    process.env.AWS_SECRET_ACCESS_KEY = "secret";
    m.pull.mockResolvedValue({
      ok: true,
      vendorId: "aws",
      observations: [
        { periodStart: "2026-07-01", periodEnd: "2026-07-02", amountCents: 6149, estimated: false },
        { periodStart: "2026-07-02", periodEnd: "2026-07-03", amountCents: 5801, estimated: true },
      ],
    });

    const outcome = await refreshVendor("aws", "mtd", NOW);
    expect(outcome.status).toBe("ok");
    expect(outcome.snapshotCount).toBe(2);

    // Second refresh with revised figures must not double-count.
    m.pull.mockResolvedValue({
      ok: true,
      vendorId: "aws",
      observations: [
        { periodStart: "2026-07-01", periodEnd: "2026-07-02", amountCents: 6200, estimated: false },
      ],
    });
    await refreshVendor("aws", "mtd", NOW);

    const index = await buildVendorSpendIndex("mtd", NOW);
    const aws = index.rows.find((r) => r.vendor.id === "aws");
    expect(aws?.spendCents).toBe(6200 + 5801);
    expect(aws?.sourceStatus).toBe("live");
  });

  it("logs a degraded outcome and keeps the row visible when the pull fails", async () => {
    m.pull.mockResolvedValue({
      ok: false,
      vendorId: "aws",
      reason: "key_missing",
      note: "AWS credentials are not configured.",
    });
    const outcome = await refreshVendor("aws", "mtd", NOW);
    expect(outcome.status).toBe("degraded");
    expect(outcome.message).toContain("key_missing");

    const index = await buildVendorSpendIndex("mtd", NOW);
    const aws = index.rows.find((r) => r.vendor.id === "aws");
    expect(aws?.sourceStatus).toBe("degraded");
  });

  it("refreshAutomatedVendors covers exactly the automated registry vendors and never throws", async () => {
    m.pull.mockResolvedValue({ ok: true, vendorId: "aws", observations: [] });
    const outcomes = await refreshAutomatedVendors("mtd", NOW);
    expect(outcomes.map((o) => o.vendorId).sort()).toEqual(["anthropic", "aws", "cursor"]);
    const anthropic = outcomes.find((o) => o.vendorId === "anthropic");
    expect(anthropic?.status).toBe("degraded");
  });

  it("unknown vendor id → error outcome, not a throw", async () => {
    const outcome = await refreshVendor("adobe", "mtd", NOW);
    expect(outcome.status).toBe("error");
  });
});
