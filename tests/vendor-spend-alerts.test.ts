// Alert threshold invariants: none (no budget) is honest absence; warn /
// critical / over map to the documented utilization bands.
import { describe, expect, it } from "vitest";

import {
  DEFAULT_CRITICAL_PCT,
  DEFAULT_WARN_PCT,
  evaluateAlert,
  utilizationOf,
} from "@/lib/vendor-spend";

describe("evaluateAlert", () => {
  it("no budget → none (never a fabricated ok)", () => {
    expect(evaluateAlert(5000, null)).toBe("none");
    expect(evaluateAlert(5000, 0)).toBe("none");
  });

  it("below warn threshold → ok", () => {
    expect(evaluateAlert(7999, 10_000)).toBe("ok");
  });

  it("at/above warn (default 80%) → warn", () => {
    expect(evaluateAlert(8000, 10_000)).toBe("warn");
    expect(evaluateAlert(9499, 10_000)).toBe("warn");
  });

  it("at/above critical (default 95%) → critical", () => {
    expect(evaluateAlert(9500, 10_000)).toBe("critical");
    expect(evaluateAlert(10_000, 10_000)).toBe("critical");
  });

  it("above 100% → over", () => {
    expect(evaluateAlert(10_001, 10_000)).toBe("over");
  });

  it("honors custom thresholds", () => {
    expect(evaluateAlert(5000, 10_000, 0.5, 0.9)).toBe("warn");
    expect(evaluateAlert(9000, 10_000, 0.5, 0.9)).toBe("critical");
  });

  it("defaults are 0.80 / 0.95", () => {
    expect(DEFAULT_WARN_PCT).toBe(0.8);
    expect(DEFAULT_CRITICAL_PCT).toBe(0.95);
  });
});

describe("utilizationOf", () => {
  it("returns spend/budget with a budget, null without", () => {
    expect(utilizationOf(2500, 10_000)).toBe(0.25);
    expect(utilizationOf(2500, null)).toBeNull();
    expect(utilizationOf(2500, 0)).toBeNull();
  });
});
