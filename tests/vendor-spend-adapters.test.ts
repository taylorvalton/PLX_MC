// Adapter degrade + happy paths. Network is stubbed (global fetch / AWS SDK
// mock); adapters must NEVER throw — every failure mode is a visible degraded
// result naming the missing secret or upstream failure.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  ceSend: vi.fn(),
}));

vi.mock("@aws-sdk/client-cost-explorer", () => ({
  CostExplorerClient: class {
    send = m.ceSend;
  },
  GetCostAndUsageCommand: class {
    constructor(public input: unknown) {}
  },
}));

import { anthropicAdapter } from "@/lib/vendor-spend/adapters/anthropic";
import { awsAdapter } from "@/lib/vendor-spend/adapters/aws";
import { cursorAdapter } from "@/lib/vendor-spend/adapters/cursor";
import { adapterFor, resolvePeriod } from "@/lib/vendor-spend";

const RANGE = resolvePeriod("mtd", new Date("2026-07-15T12:00:00Z"));

const ENV_KEYS = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_SESSION_TOKEN",
  "AWS_COST_EXPLORER_USE_AMBIENT",
  "ANTHROPIC_ADMIN_API_KEY",
  "CURSOR_ADMIN_API_KEY",
];
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
  m.ceSend.mockReset();
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.unstubAllGlobals();
});

describe("adapterFor", () => {
  it("resolves the three automated adapters and null otherwise", () => {
    expect(adapterFor("aws")?.vendorId).toBe("aws");
    expect(adapterFor("anthropic")?.vendorId).toBe("anthropic");
    expect(adapterFor("cursor")?.vendorId).toBe("cursor");
    expect(adapterFor("adobe")).toBeNull();
  });
});

describe("aws adapter", () => {
  it("degrades with key_missing when no credentials are configured", async () => {
    const result = await awsAdapter.pull(RANGE);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("key_missing");
  });

  it("maps Cost Explorer daily buckets to cent observations with the Estimated flag", async () => {
    process.env.AWS_ACCESS_KEY_ID = "AKIATEST";
    process.env.AWS_SECRET_ACCESS_KEY = "secret";
    m.ceSend.mockResolvedValue({
      ResultsByTime: [
        {
          TimePeriod: { Start: "2026-07-01", End: "2026-07-02" },
          Total: { UnblendedCost: { Amount: "61.4907", Unit: "USD" } },
          Estimated: false,
        },
        {
          TimePeriod: { Start: "2026-07-02", End: "2026-07-03" },
          Total: { UnblendedCost: { Amount: "58.01", Unit: "USD" } },
          Estimated: true,
        },
      ],
    });
    const result = await awsAdapter.pull(RANGE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.observations).toEqual([
        { periodStart: "2026-07-01", periodEnd: "2026-07-02", amountCents: 6149, estimated: false },
        { periodStart: "2026-07-02", periodEnd: "2026-07-03", amountCents: 5801, estimated: true },
      ]);
    }
  });

  it("degrades as unauthorized on AccessDeniedException — never throws", async () => {
    process.env.AWS_ACCESS_KEY_ID = "AKIATEST";
    process.env.AWS_SECRET_ACCESS_KEY = "secret";
    const err = new Error("not authorized to perform ce:GetCostAndUsage");
    err.name = "AccessDeniedException";
    m.ceSend.mockRejectedValue(err);
    const result = await awsAdapter.pull(RANGE);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("unauthorized");
  });
});

describe("anthropic adapter", () => {
  it("degrades with key_missing without ANTHROPIC_ADMIN_API_KEY", async () => {
    const result = await anthropicAdapter.pull(RANGE);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("key_missing");
      expect(result.note).toContain("ANTHROPIC_ADMIN_API_KEY");
    }
  });

  it("sums daily cost buckets (amounts are decimal cent strings)", async () => {
    process.env.ANTHROPIC_ADMIN_API_KEY = "sk-ant-admin01-test";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            data: [
              {
                starting_at: "2026-07-01T00:00:00Z",
                ending_at: "2026-07-02T00:00:00Z",
                results: [{ currency: "USD", amount: "123.45" }, { currency: "USD", amount: "10" }],
              },
            ],
            has_more: false,
            next_page: null,
          }),
          { status: 200 }
        )
      )
    );
    const result = await anthropicAdapter.pull(RANGE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.observations).toEqual([
        { periodStart: "2026-07-01", periodEnd: "2026-07-02", amountCents: 133, estimated: false },
      ]);
    }
  });

  it("degrades as unauthorized on 401 (standard key instead of admin key)", async () => {
    process.env.ANTHROPIC_ADMIN_API_KEY = "sk-ant-api03-standard";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 401 })));
    const result = await anthropicAdapter.pull(RANGE);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("unauthorized");
  });

  it("degrades as network_error when fetch throws — never throws itself", async () => {
    process.env.ANTHROPIC_ADMIN_API_KEY = "sk-ant-admin01-test";
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new TypeError("fetch failed");
    }));
    const result = await anthropicAdapter.pull(RANGE);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("network_error");
  });
});

describe("cursor adapter", () => {
  it("degrades with key_missing without CURSOR_ADMIN_API_KEY", async () => {
    const result = await cursorAdapter.pull(RANGE);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("key_missing");
      expect(result.note).toContain("CURSOR_ADMIN_API_KEY");
    }
  });

  it("sums team member spend into ONE estimated billing-cycle observation", async () => {
    process.env.CURSOR_ADMIN_API_KEY = "key_test";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            teamMemberSpend: [
              { spendCents: 100, includedSpendCents: 400 },
              { overallSpendCents: 2450.5 },
            ],
            subscriptionCycleStart: Date.UTC(2026, 6, 1),
            totalMembers: 2,
            totalPages: 1,
          }),
          { status: 200 }
        )
      )
    );
    const result = await cursorAdapter.pull(RANGE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.observations).toHaveLength(1);
      const obs = result.observations[0];
      expect(obs.periodStart).toBe("2026-07-01");
      expect(obs.amountCents).toBe(Math.round(100 + 400 + 2450.5));
      expect(obs.estimated).toBe(true);
    }
  });

  it("degrades as unauthorized on 403 (non-Enterprise or wrong key)", async () => {
    process.env.CURSOR_ADMIN_API_KEY = "key_test";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 403 })));
    const result = await cursorAdapter.pull(RANGE);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("unauthorized");
  });

  it("degrades as bad_payload on an unexpected response shape", async () => {
    process.env.CURSOR_ADMIN_API_KEY = "key_test";
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ nope: 1 }), { status: 200 })));
    const result = await cursorAdapter.pull(RANGE);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("bad_payload");
  });
});
