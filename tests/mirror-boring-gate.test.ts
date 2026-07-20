// TASK-495 — mirror-is-boring N=7 consecutive green cron-tick streak.
import { describe, expect, it } from "vitest";
import {
  BORING_GATE_DEFAULT_N,
  boringGateFieldsFromRow,
  nextBoringStreak,
  recordBoringTickAfterSweep,
  type BoringGateFields,
} from "@/lib/sync/boring-gate";
import type { BoringGateRow } from "@/lib/sync/repo";

function freshStamps(now: Date) {
  return {
    projects: now,
    roadmap: now,
    todos: now,
  };
}

describe("nextBoringStreak", () => {
  it("increments on green and meets gate at N=7", () => {
    let streak = 0;
    let gateMet = false;
    for (let i = 1; i <= 7; i++) {
      const next = nextBoringStreak({ previousStreak: streak, green: true });
      streak = next.streak;
      gateMet = next.gateMet;
      expect(next.outcome).toBe("green");
      expect(next.streak).toBe(i);
      expect(next.gateMet).toBe(i >= BORING_GATE_DEFAULT_N);
    }
    expect(gateMet).toBe(true);
    expect(streak).toBe(7);
  });

  it("resets to 0 on non-green (stale or seed)", () => {
    const next = nextBoringStreak({
      previousStreak: 5,
      green: false,
      resetReason: "freshness_stale",
    });
    expect(next).toEqual({
      previousStreak: 5,
      streak: 0,
      gateMet: false,
      outcome: "reset",
      resetReason: "freshness_stale",
    });
  });
});

describe("recordBoringTickAfterSweep", () => {
  it("increments streak when live + fresh", async () => {
    const now = new Date("2026-07-20T12:00:00.000Z");
    let stored: BoringGateRow | null = null;
    const fields = await recordBoringTickAfterSweep({
      now,
      graphOk: true,
      loadRegisterTimestamps: async () => freshStamps(now),
      loadRow: async () => stored,
      persistRow: async (row) => {
        stored = { ...row, updatedAt: now.toISOString() };
        return stored;
      },
    });
    expect(fields.boringTickStreak).toBe(1);
    expect(fields.boringGateMet).toBe(false);
    expect(fields.lastBoringOutcome).toBe("green");
    expect(fields.lastBoringEvalAt).toBe(now.toISOString());
  });

  it("resets streak when dataSource would be seed (no graph)", async () => {
    const now = new Date("2026-07-20T12:00:00.000Z");
    let stored: BoringGateRow | null = {
      tickStreak: 4,
      requiredN: 7,
      gateMet: false,
      lastEvalAt: "2026-07-20T11:55:00.000Z",
      lastOutcome: "green",
      lastResetReason: null,
      updatedAt: "2026-07-20T11:55:00.000Z",
    };
    const fields = await recordBoringTickAfterSweep({
      now,
      graphOk: false,
      loadRegisterTimestamps: async () => freshStamps(now),
      loadRow: async () => stored,
      persistRow: async (row) => {
        stored = { ...row, updatedAt: now.toISOString() };
        return stored;
      },
    });
    expect(fields.boringTickStreak).toBe(0);
    expect(fields.boringGateMet).toBe(false);
    expect(fields.lastBoringOutcome).toBe("reset");
    expect(fields.lastBoringResetReason).toBe("data_source_seed");
  });

  it("resets streak when freshness is stale", async () => {
    const now = new Date("2026-07-20T12:00:00.000Z");
    const stale = new Date(now.getTime() - 400_000);
    let stored: BoringGateRow | null = {
      tickStreak: 6,
      requiredN: 7,
      gateMet: false,
      lastEvalAt: null,
      lastOutcome: null,
      lastResetReason: null,
      updatedAt: null,
    };
    const fields = await recordBoringTickAfterSweep({
      now,
      graphOk: true,
      loadRegisterTimestamps: async () => ({
        projects: stale,
        roadmap: stale,
        todos: stale,
      }),
      loadRow: async () => stored,
      persistRow: async (row) => {
        stored = { ...row, updatedAt: now.toISOString() };
        return stored;
      },
    });
    expect(fields.boringTickStreak).toBe(0);
    expect(fields.lastBoringOutcome).toBe("reset");
    expect(fields.lastBoringResetReason).toBe("freshness_stale");
  });

  it("sets boringGateMet after 7 consecutive green ticks", async () => {
    const now = new Date("2026-07-20T12:00:00.000Z");
    let stored: BoringGateRow | null = null;
    let last: BoringGateFields = boringGateFieldsFromRow(null);
    for (let i = 0; i < 7; i++) {
      const tickNow = new Date(now.getTime() + i * 60_000);
      last = await recordBoringTickAfterSweep({
        now: tickNow,
        graphOk: true,
        loadRegisterTimestamps: async () => freshStamps(tickNow),
        loadRow: async () => stored,
        persistRow: async (row) => {
          stored = { ...row, updatedAt: tickNow.toISOString() };
          return stored;
        },
      });
    }
    expect(last.boringTickStreak).toBe(7);
    expect(last.boringGateMet).toBe(true);
    expect(last.boringGateN).toBe(7);
  });
});
