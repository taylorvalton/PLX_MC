// P4: canonical per-register freshness — fail-closed sync_stale.
// Required routing registers: projects, roadmap, todos. Max age 360_000ms.
// Must NOT treat max(delta_links.updated_at) as sufficient by itself.

import { describe, expect, it } from "vitest";
import {
  ROUTING_REQUIRED_REGISTERS,
  SYNC_FRESHNESS_MAX_AGE_MS,
  assertFreshOrThrow,
  evaluateSyncFreshness,
} from "@/lib/sync/freshness";

const NOW = new Date("2026-07-14T18:00:00.000Z");

function stamps( partial: Record<string, Date | null> ) {
  return async () => partial;
}

describe("SYNC_FRESHNESS_MAX_AGE_MS + required registers", () => {
  it("pins six-minute max age and Projects/Roadmap/ToDos", () => {
    expect(SYNC_FRESHNESS_MAX_AGE_MS).toBe(360_000);
    expect([...ROUTING_REQUIRED_REGISTERS]).toEqual(["projects", "roadmap", "todos"]);
  });
});

describe("evaluateSyncFreshness — all combinations", () => {
  it("ok when every required register completed inbound within max age", async () => {
    const fresh = new Date(NOW.getTime() - 60_000);
    const result = await evaluateSyncFreshness({
      now: NOW,
      loadRegisterTimestamps: stamps({
        projects: fresh,
        roadmap: fresh,
        todos: fresh,
      }),
    });
    expect(result.ok).toBe(true);
    expect(result.code).toBe("ok");
    expect(result.reasons).toEqual([]);
    expect(result.registers.every((r) => r.reason === "fresh")).toBe(true);
  });

  it("sync_stale + missing_register when a required register has never completed", async () => {
    const fresh = new Date(NOW.getTime() - 60_000);
    const result = await evaluateSyncFreshness({
      now: NOW,
      loadRegisterTimestamps: stamps({
        projects: fresh,
        roadmap: fresh,
        todos: null,
      }),
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe("sync_stale");
    expect(result.reasons).toContain("missing_register:todos");
    expect(result.registers.find((r) => r.listKey === "todos")?.reason).toBe("missing_register");
  });

  it("sync_stale + stale_register when one register exceeds max age", async () => {
    const fresh = new Date(NOW.getTime() - 60_000);
    const stale = new Date(NOW.getTime() - SYNC_FRESHNESS_MAX_AGE_MS - 1);
    const result = await evaluateSyncFreshness({
      now: NOW,
      loadRegisterTimestamps: stamps({
        projects: fresh,
        roadmap: stale,
        todos: fresh,
      }),
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe("sync_stale");
    expect(result.reasons).toContain("stale_register:roadmap");
  });

  it("sync_stale when ALL required registers are missing", async () => {
    const result = await evaluateSyncFreshness({
      now: NOW,
      loadRegisterTimestamps: stamps({}),
    });
    expect(result.code).toBe("sync_stale");
    expect(result.reasons).toEqual([
      "missing_register:projects",
      "missing_register:roadmap",
      "missing_register:todos",
    ]);
  });

  it("boundary: exactly maxAgeMs is still fresh; maxAgeMs+1 is stale", async () => {
    const atMax = new Date(NOW.getTime() - SYNC_FRESHNESS_MAX_AGE_MS);
    const over = new Date(NOW.getTime() - SYNC_FRESHNESS_MAX_AGE_MS - 1);
    const ok = await evaluateSyncFreshness({
      now: NOW,
      loadRegisterTimestamps: stamps({
        projects: atMax,
        roadmap: atMax,
        todos: atMax,
      }),
    });
    expect(ok.ok).toBe(true);

    const bad = await evaluateSyncFreshness({
      now: NOW,
      loadRegisterTimestamps: stamps({
        projects: atMax,
        roadmap: atMax,
        todos: over,
      }),
    });
    expect(bad.ok).toBe(false);
    expect(bad.reasons).toContain("stale_register:todos");
  });

  it("does not accept an unrelated listKey as a substitute for required registers", async () => {
    // Simulates the anti-pattern of using max(delta_links) which might only
    // reflect risks/documents while projects/roadmap/todos are missing.
    const fresh = new Date(NOW.getTime() - 30_000);
    const result = await evaluateSyncFreshness({
      now: NOW,
      loadRegisterTimestamps: stamps({
        risks: fresh,
        documents: fresh,
      }),
    });
    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("missing_register:projects");
    expect(result.reasons).toContain("missing_register:roadmap");
    expect(result.reasons).toContain("missing_register:todos");
  });
});

describe("assertFreshOrThrow", () => {
  it("throws with code sync_stale when not ok", async () => {
    const result = await evaluateSyncFreshness({
      now: NOW,
      loadRegisterTimestamps: stamps({ projects: null }),
    });
    expect(() => assertFreshOrThrow(result)).toThrow(/sync_stale/);
    try {
      assertFreshOrThrow(result);
    } catch (err) {
      expect((err as { code?: string }).code).toBe("sync_stale");
    }
  });

  it("does not throw when ok", async () => {
    const fresh = new Date(NOW.getTime() - 1_000);
    const result = await evaluateSyncFreshness({
      now: NOW,
      loadRegisterTimestamps: stamps({
        projects: fresh,
        roadmap: fresh,
        todos: fresh,
      }),
    });
    expect(() => assertFreshOrThrow(result)).not.toThrow();
  });
});
