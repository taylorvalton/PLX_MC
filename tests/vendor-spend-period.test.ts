// Period math invariants for vendor spend: range resolution, budget
// proration (monthly caps), and snapshot apportionment onto view windows.
import { describe, expect, it } from "vitest";

import {
  apportionedAmountCents,
  daysInRange,
  overlapDays,
  prorateMonthlyBudget,
  resolvePeriod,
} from "@/lib/vendor-spend";
import type { PeriodRange } from "@/lib/vendor-spend";

// A fixed "now": Wednesday 2026-07-15 12:00 UTC.
const NOW = new Date("2026-07-15T12:00:00Z");

describe("resolvePeriod", () => {
  it("mtd starts on the 1st and ends tomorrow (exclusive)", () => {
    expect(resolvePeriod("mtd", NOW)).toEqual({
      period: "mtd",
      start: "2026-07-01",
      end: "2026-07-16",
    });
  });

  it("weekly starts on Monday of the ISO week", () => {
    // 2026-07-15 is a Wednesday → Monday is 2026-07-13.
    expect(resolvePeriod("weekly", NOW)).toEqual({
      period: "weekly",
      start: "2026-07-13",
      end: "2026-07-16",
    });
  });

  it("weekly handles a Sunday (end of ISO week, not start)", () => {
    const sunday = new Date("2026-07-19T08:00:00Z");
    expect(resolvePeriod("weekly", sunday).start).toBe("2026-07-13");
  });

  it("quarterly starts on the quarter's first month", () => {
    expect(resolvePeriod("quarterly", NOW).start).toBe("2026-07-01");
    expect(resolvePeriod("quarterly", new Date("2026-05-02T00:00:00Z")).start).toBe(
      "2026-04-01"
    );
  });

  it("ytd starts Jan 1", () => {
    expect(resolvePeriod("ytd", NOW)).toEqual({
      period: "ytd",
      start: "2026-01-01",
      end: "2026-07-16",
    });
  });

  it("weekly range spanning a month boundary stays contiguous", () => {
    // 2026-08-02 is a Sunday; Monday is 2026-07-27 (previous month).
    const range = resolvePeriod("weekly", new Date("2026-08-02T12:00:00Z"));
    expect(range.start).toBe("2026-07-27");
    expect(range.end).toBe("2026-08-03");
  });
});

describe("prorateMonthlyBudget", () => {
  const budget = 100_000; // $1,000.00/month

  it("mtd compares against the FULL monthly budget (cap semantics)", () => {
    const range = resolvePeriod("mtd", NOW);
    expect(prorateMonthlyBudget(budget, range)).toBe(budget);
  });

  it("weekly inside one month prorates by days-in-month", () => {
    const range = resolvePeriod("weekly", NOW); // 07-13 → 07-16, 3 days of July (31d)
    expect(prorateMonthlyBudget(budget, range)).toBe(Math.round((budget * 3) / 31));
  });

  it("weekly spanning a month boundary splits across both months", () => {
    const range: PeriodRange = { period: "weekly", start: "2026-07-27", end: "2026-08-03" };
    // 5 days of July (31d) + 2 days of August (31d).
    const expected = Math.round((budget * 5) / 31 + (budget * 2) / 31);
    expect(prorateMonthlyBudget(budget, range)).toBe(expected);
  });

  it("quarterly counts each touched month as a full month", () => {
    const range = resolvePeriod("quarterly", NOW); // Jul 1 → Jul 16 window in Q3
    expect(prorateMonthlyBudget(budget, range)).toBe(budget);
    const q2 = resolvePeriod("quarterly", new Date("2026-06-20T00:00:00Z"));
    expect(prorateMonthlyBudget(budget, q2)).toBe(3 * budget);
  });

  it("ytd sums one full monthly budget per elapsed month", () => {
    const range = resolvePeriod("ytd", NOW); // Jan..Jul → 7 months
    expect(prorateMonthlyBudget(budget, range)).toBe(7 * budget);
  });

  it("zero or negative budget yields 0", () => {
    expect(prorateMonthlyBudget(0, resolvePeriod("mtd", NOW))).toBe(0);
  });
});

describe("apportionment", () => {
  const range: PeriodRange = { period: "mtd", start: "2026-07-01", end: "2026-07-16" };

  it("daily snapshot inside the range contributes fully", () => {
    expect(
      apportionedAmountCents(
        { periodStart: "2026-07-03", periodEnd: "2026-07-04", amountCents: 1234 },
        range
      )
    ).toBe(1234);
  });

  it("snapshot outside the range contributes nothing", () => {
    expect(
      apportionedAmountCents(
        { periodStart: "2026-06-01", periodEnd: "2026-06-02", amountCents: 999 },
        range
      )
    ).toBe(0);
  });

  it("a monthly invoice snapshot is prorated by overlap days", () => {
    // Invoice covering all of July (31d); 15 days overlap the MTD window.
    expect(
      apportionedAmountCents(
        { periodStart: "2026-07-01", periodEnd: "2026-08-01", amountCents: 3100 },
        range
      )
    ).toBe(1500);
  });

  it("daysInRange / overlapDays agree on boundaries", () => {
    expect(daysInRange("2026-07-01", "2026-07-16")).toBe(15);
    expect(overlapDays("2026-06-20", "2026-07-05", range)).toBe(4);
    expect(overlapDays("2026-07-16", "2026-07-20", range)).toBe(0);
  });
});
