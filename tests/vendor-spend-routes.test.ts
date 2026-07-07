// Route tests for the vendor-spend API surface. The domain module is mocked —
// these tests lock the envelope contract ({ data } / { error: { code,
// message } }), Zod validation on mutations, registry gating, and the
// CRON_SECRET gate on the scheduled refresh.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ─── Hoisted mocks (must precede all imports) ─────────────────────────────────

const m = vi.hoisted(() => ({
  buildVendorSpendIndex: vi.fn(),
  buildVendorSpendDetail: vi.fn(),
  listBudgets: vi.fn(),
  upsertBudget: vi.fn(),
  createSnapshot: vi.fn(),
  refreshAutomatedVendors: vi.fn(),
  loadVendorRegistry: vi.fn(),
}));

vi.mock("@/lib/vendor-spend", () => ({
  SPEND_PERIODS: ["mtd", "weekly", "quarterly", "ytd"],
  buildVendorSpendIndex: m.buildVendorSpendIndex,
  buildVendorSpendDetail: m.buildVendorSpendDetail,
  listBudgets: m.listBudgets,
  upsertBudget: m.upsertBudget,
  createSnapshot: m.createSnapshot,
  refreshAutomatedVendors: m.refreshAutomatedVendors,
  loadVendorRegistry: m.loadVendorRegistry,
}));

import * as budgetsRoute from "@/app/api/vendor-spend/budgets/route";
import * as cronRoute from "@/app/api/cron/vendor-spend-refresh/route";
import * as detailRoute from "@/app/api/vendor-spend/[vendorId]/route";
import * as indexRoute from "@/app/api/vendor-spend/route";
import * as refreshRoute from "@/app/api/vendor-spend/refresh/route";
import * as snapshotsRoute from "@/app/api/vendor-spend/snapshots/route";

// ─── Fixtures / helpers ───────────────────────────────────────────────────────

const emptyCtx = { params: Promise.resolve({} as Record<string, string>) };

const getReq = (url: string) => new Request(url, { method: "GET" });
const jsonReq = (url: string, method: string, body: unknown) =>
  new Request(url, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const MOCK_INDEX = {
  period: { period: "mtd", start: "2026-07-01", end: "2026-07-16" },
  rows: [],
  totals: { spendCents: 0, budgetedSpendCents: 0, periodBudgetCents: 0, warn: 0, critical: 0, over: 0 },
};

const REGISTRY = {
  ok: true as const,
  registry: {
    schema_version: "plx-vendor-costs-registry/v1" as const,
    vendors: [
      { id: "aws", name: "AWS", category: "cloud", adapter: "aws" as const, billing: "usage" as const },
      { id: "adobe", name: "Adobe", category: "creative", adapter: "manual" as const, billing: "subscription" as const },
    ],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  m.buildVendorSpendIndex.mockResolvedValue(MOCK_INDEX);
  m.buildVendorSpendDetail.mockResolvedValue({ row: { vendor: { id: "aws" } }, snapshots: [], refreshLog: [] });
  m.listBudgets.mockResolvedValue([]);
  m.upsertBudget.mockImplementation(async (input: object) => ({ ...input, updatedAt: "2026-07-15T00:00:00Z" }));
  m.createSnapshot.mockImplementation(async (input: object) => ({ id: "vcs-1", ...input }));
  m.refreshAutomatedVendors.mockResolvedValue([
    { vendorId: "aws", status: "ok", snapshotCount: 3 },
    { vendorId: "anthropic", status: "degraded", message: "[key_missing] no admin key", snapshotCount: 0 },
  ]);
  m.loadVendorRegistry.mockReturnValue(REGISTRY);
  delete process.env.CRON_SECRET;
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.CRON_SECRET;
});

// ═════════════════════════════════════════════════════════════════════════════
// GET /api/vendor-spend
// ═════════════════════════════════════════════════════════════════════════════

describe("GET /api/vendor-spend", () => {
  it("returns { data } with the index and defaults to mtd", async () => {
    const resp = await indexRoute.GET(getReq("http://test/api/vendor-spend"), emptyCtx);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.data.period.period).toBe("mtd");
    expect(m.buildVendorSpendIndex).toHaveBeenCalledWith("mtd");
  });

  it("passes a valid period through", async () => {
    await indexRoute.GET(getReq("http://test/api/vendor-spend?period=ytd"), emptyCtx);
    expect(m.buildVendorSpendIndex).toHaveBeenCalledWith("ytd");
  });

  it("rejects an invalid period with a 400 error envelope", async () => {
    const resp = await indexRoute.GET(getReq("http://test/api/vendor-spend?period=daily"), emptyCtx);
    expect(resp.status).toBe(400);
    const body = await resp.json();
    expect(body.error.code).toBe("invalid_period");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// GET /api/vendor-spend/[vendorId]
// ═════════════════════════════════════════════════════════════════════════════

describe("GET /api/vendor-spend/[vendorId]", () => {
  it("returns { data } for a known vendor", async () => {
    const resp = await detailRoute.GET(getReq("http://test/api/vendor-spend/aws"), {
      params: Promise.resolve({ vendorId: "aws" }),
    });
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.data.row.vendor.id).toBe("aws");
  });

  it("404s with unknown_vendor for an off-registry id", async () => {
    m.buildVendorSpendDetail.mockResolvedValue(null);
    const resp = await detailRoute.GET(getReq("http://test/api/vendor-spend/nope"), {
      params: Promise.resolve({ vendorId: "nope" }),
    });
    expect(resp.status).toBe(404);
    const body = await resp.json();
    expect(body.error.code).toBe("unknown_vendor");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// GET|PATCH /api/vendor-spend/budgets
// ═════════════════════════════════════════════════════════════════════════════

describe("budgets route", () => {
  it("GET returns { data } with the budget list", async () => {
    m.listBudgets.mockResolvedValue([{ vendorId: "aws", monthlyBudgetCents: 100_000 }]);
    const resp = await budgetsRoute.GET(getReq("http://test/api/vendor-spend/budgets"), emptyCtx);
    const body = await resp.json();
    expect(body.data).toHaveLength(1);
  });

  it("PATCH upserts a valid budget", async () => {
    const resp = await budgetsRoute.PATCH(
      jsonReq("http://test/api/vendor-spend/budgets", "PATCH", {
        vendorId: "aws",
        monthlyBudgetCents: 250_000,
        updatedBy: "vince",
      }),
      emptyCtx
    );
    expect(resp.status).toBe(200);
    expect(m.upsertBudget).toHaveBeenCalled();
  });

  it("PATCH rejects a negative budget (Zod, 400 invalid_request)", async () => {
    const resp = await budgetsRoute.PATCH(
      jsonReq("http://test/api/vendor-spend/budgets", "PATCH", {
        vendorId: "aws",
        monthlyBudgetCents: -5,
        updatedBy: "vince",
      }),
      emptyCtx
    );
    expect(resp.status).toBe(400);
    const body = await resp.json();
    expect(body.error.code).toBe("invalid_request");
    expect(m.upsertBudget).not.toHaveBeenCalled();
  });

  it("PATCH rejects criticalPct < warnPct", async () => {
    const resp = await budgetsRoute.PATCH(
      jsonReq("http://test/api/vendor-spend/budgets", "PATCH", {
        vendorId: "aws",
        monthlyBudgetCents: 1000,
        warnPct: 0.9,
        criticalPct: 0.5,
        updatedBy: "vince",
      }),
      emptyCtx
    );
    expect(resp.status).toBe(400);
  });

  it("PATCH 404s for a vendor not in the registry", async () => {
    const resp = await budgetsRoute.PATCH(
      jsonReq("http://test/api/vendor-spend/budgets", "PATCH", {
        vendorId: "stripe",
        monthlyBudgetCents: 1000,
        updatedBy: "vince",
      }),
      emptyCtx
    );
    expect(resp.status).toBe(404);
    const body = await resp.json();
    expect(body.error.code).toBe("unknown_vendor");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// POST /api/vendor-spend/snapshots
// ═════════════════════════════════════════════════════════════════════════════

describe("POST /api/vendor-spend/snapshots", () => {
  const valid = {
    vendorId: "adobe",
    periodStart: "2026-07-01",
    periodEnd: "2026-08-01",
    amountCents: 5999,
    enteredBy: "vince",
    note: "CC invoice",
  };

  it("creates a manual snapshot (source forced to manual)", async () => {
    const resp = await snapshotsRoute.POST(
      jsonReq("http://test/api/vendor-spend/snapshots", "POST", valid),
      emptyCtx
    );
    expect(resp.status).toBe(200);
    expect(m.createSnapshot).toHaveBeenCalledWith(expect.objectContaining({ source: "manual" }));
  });

  it("rejects periodEnd <= periodStart", async () => {
    const resp = await snapshotsRoute.POST(
      jsonReq("http://test/api/vendor-spend/snapshots", "POST", {
        ...valid,
        periodEnd: "2026-07-01",
      }),
      emptyCtx
    );
    expect(resp.status).toBe(400);
    expect(m.createSnapshot).not.toHaveBeenCalled();
  });

  it("rejects a malformed date", async () => {
    const resp = await snapshotsRoute.POST(
      jsonReq("http://test/api/vendor-spend/snapshots", "POST", { ...valid, periodStart: "July 1" }),
      emptyCtx
    );
    expect(resp.status).toBe(400);
  });

  it("404s for an off-registry vendor", async () => {
    const resp = await snapshotsRoute.POST(
      jsonReq("http://test/api/vendor-spend/snapshots", "POST", { ...valid, vendorId: "stripe" }),
      emptyCtx
    );
    expect(resp.status).toBe(404);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// POST /api/vendor-spend/refresh
// ═════════════════════════════════════════════════════════════════════════════

describe("POST /api/vendor-spend/refresh", () => {
  it("runs the automated refresh and returns per-vendor outcomes (degraded visible)", async () => {
    const resp = await refreshRoute.POST(
      jsonReq("http://test/api/vendor-spend/refresh", "POST", { period: "mtd" }),
      emptyCtx
    );
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.data.outcomes).toHaveLength(2);
    expect(body.data.outcomes[1].status).toBe("degraded");
    expect(m.refreshAutomatedVendors).toHaveBeenCalledWith("mtd");
  });

  it("defaults to a ytd backfill", async () => {
    await refreshRoute.POST(jsonReq("http://test/api/vendor-spend/refresh", "POST", {}), emptyCtx);
    expect(m.refreshAutomatedVendors).toHaveBeenCalledWith("ytd");
  });

  it("rejects an invalid period", async () => {
    const resp = await refreshRoute.POST(
      jsonReq("http://test/api/vendor-spend/refresh", "POST", { period: "hourly" }),
      emptyCtx
    );
    expect(resp.status).toBe(400);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// GET /api/cron/vendor-spend-refresh — CRON_SECRET gate
// ═════════════════════════════════════════════════════════════════════════════

describe("GET /api/cron/vendor-spend-refresh", () => {
  it("503s when CRON_SECRET is unset (default-off)", async () => {
    const resp = await cronRoute.GET(getReq("http://test/api/cron/vendor-spend-refresh"), emptyCtx);
    expect(resp.status).toBe(503);
    const body = await resp.json();
    expect(body.error.code).toBe("cron_disabled");
  });

  it("401s on a wrong bearer token", async () => {
    process.env.CRON_SECRET = "s3cret";
    const resp = await cronRoute.GET(
      new Request("http://test/api/cron/vendor-spend-refresh", {
        headers: { authorization: "Bearer wrong" },
      }),
      emptyCtx
    );
    expect(resp.status).toBe(401);
  });

  it("runs the refresh with the correct bearer token", async () => {
    process.env.CRON_SECRET = "s3cret";
    const resp = await cronRoute.GET(
      new Request("http://test/api/cron/vendor-spend-refresh", {
        headers: { authorization: "Bearer s3cret" },
      }),
      emptyCtx
    );
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.data.outcomes).toHaveLength(2);
    expect(m.refreshAutomatedVendors).toHaveBeenCalledWith("mtd");
  });
});
