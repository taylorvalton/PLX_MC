// Pure-helper unit tests for the AI Spend screen (no DOM environment).
import { describe, expect, it } from "vitest";

import type { VendorSpendIndex } from "@/lib/vendor-spend";

import {
  alertLabel,
  alertTone,
  deriveAttention,
  fmtMoney,
  fmtPct,
  fmtStamp,
  parseDollarsToCents,
  PERIOD_LABELS,
  sourceLabel,
  sourceTone,
} from "@/components/mc/vendor-spend/helpers";

describe("fmtMoney", () => {
  it("formats cents as dollars with separators and two decimals", () => {
    expect(fmtMoney(0)).toBe("$0.00");
    expect(fmtMoney(5)).toBe("$0.05");
    expect(fmtMoney(123456)).toBe("$1,234.56");
    expect(fmtMoney(181900)).toBe("$1,819.00");
  });

  it("handles negatives (credits)", () => {
    expect(fmtMoney(-250)).toBe("-$2.50");
  });
});

describe("fmtPct / fmtStamp", () => {
  it("renders utilization or an em dash", () => {
    expect(fmtPct(0.87)).toBe("87%");
    expect(fmtPct(1.2)).toBe("120%");
    expect(fmtPct(null)).toBe("—");
  });

  it("renders a UTC stamp and passes garbage through", () => {
    expect(fmtStamp("2026-07-15T08:20:00Z")).toBe("Jul 15, 08:20 UTC");
    expect(fmtStamp("not-a-date")).toBe("not-a-date");
  });
});

describe("parseDollarsToCents", () => {
  it("accepts plain and formatted dollar strings", () => {
    expect(parseDollarsToCents("1500")).toBe(150_000);
    expect(parseDollarsToCents("1500.5")).toBe(150_050);
    expect(parseDollarsToCents("$1,500.00")).toBe(150_000);
  });

  it("rejects garbage and negative-looking input", () => {
    expect(parseDollarsToCents("about 5")).toBeNull();
    expect(parseDollarsToCents("-20")).toBeNull();
    expect(parseDollarsToCents("1.999")).toBeNull();
    expect(parseDollarsToCents("")).toBeNull();
  });
});

describe("labels and tones", () => {
  it("covers every alert level", () => {
    expect(alertLabel("over")).toBe("OVER BUDGET");
    expect(alertLabel("none")).toBe("NO BUDGET");
    expect(alertTone("over")).toBe("hot");
    expect(alertTone("critical")).toBe("hot");
    expect(alertTone("warn")).toBe("warn");
    expect(alertTone("ok")).toBe("ok");
    expect(alertTone("none")).toBe("muted");
  });

  it("covers every source status", () => {
    expect(sourceLabel("live")).toBe("API · LIVE");
    expect(sourceTone("live")).toBe("ok");
    expect(sourceLabel("degraded")).toBe("API · DEGRADED");
    expect(sourceTone("degraded")).toBe("hot");
    expect(sourceLabel("manual")).toBe("MANUAL");
    expect(sourceTone("manual")).toBe("muted");
  });

  it("labels every period", () => {
    expect(Object.keys(PERIOD_LABELS).sort()).toEqual(["mtd", "quarterly", "weekly", "ytd"]);
  });
});

describe("deriveAttention", () => {
  function makeIndex(overrides: Partial<VendorSpendIndex["totals"]>, degraded = 0): VendorSpendIndex {
    const rows = Array.from({ length: degraded }, (_, i) => ({
      vendor: { id: `v${i}`, name: `V${i}`, category: "ai", adapter: "manual" as const, billing: "usage" as const },
      sourceStatus: "degraded" as const,
      spendCents: 0,
      estimated: false,
      snapshotCount: 0,
      budget: null,
      periodBudgetCents: null,
      utilization: null,
      alert: "none" as const,
      lastRefresh: null,
    }));
    return {
      period: { period: "mtd", start: "2026-07-01", end: "2026-07-16" },
      rows,
      totals: {
        spendCents: 0,
        budgetedSpendCents: 0,
        periodBudgetCents: 0,
        warn: 0,
        critical: 0,
        over: 0,
        ...overrides,
      },
    };
  }

  it("sums warn + critical + over into the badge count", () => {
    expect(deriveAttention(makeIndex({ warn: 2, critical: 1, over: 1 })).alerting).toBe(4);
    expect(deriveAttention(makeIndex({})).alerting).toBe(0);
  });

  it("counts degraded rows", () => {
    expect(deriveAttention(makeIndex({}, 3)).degraded).toBe(3);
  });
});
