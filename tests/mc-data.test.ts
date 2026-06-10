// Invariant tests for the Mission Control data layer. These protect behavior
// (sync-count aggregation, confidence derivation, the Petra-domain rule, bucket
// partitioning), not the shape of the mock fixtures.
import { describe, expect, it } from "vitest";

import {
  BUCKETS,
  STAGES,
  TASKS,
  bandOf,
  confidenceOf,
  domainOf,
  evidenceComplete,
  isPetraEmail,
  syncCounts,
  tasksForUser,
} from "@/lib/mc-data";
import type { Evidence } from "@/lib/mc-data";

describe("bandOf", () => {
  it("maps every stage to its declared band", () => {
    for (const s of STAGES) {
      expect(bandOf(s.key)).toBe(s.band);
    }
  });

  it("places key lifecycle stages in the right band", () => {
    expect(bandOf("backlog")).toBe("todo");
    expect(bandOf("qa")).toBe("doing");
    expect(bandOf("verified")).toBe("done");
  });
});

describe("bucket partitioning", () => {
  it("assigns every task to a known bucket (no orphans)", () => {
    const known = new Set(BUCKETS.map((b) => b.id));
    for (const t of TASKS) expect(known.has(t.bucket)).toBe(true);
  });
});

describe("evidenceComplete", () => {
  it("is true only when every item is done", () => {
    const all: Evidence = {
      summary: "x",
      items: [
        { key: "a", label: "a", done: true },
        { key: "b", label: "b", done: true },
      ],
    };
    const partial: Evidence = {
      summary: "x",
      items: [
        { key: "a", label: "a", done: true },
        { key: "b", label: "b", done: false },
      ],
    };
    expect(evidenceComplete(all)).toBe(true);
    expect(evidenceComplete(partial)).toBe(false);
    expect(evidenceComplete(undefined)).toBe(false);
  });
});

describe("syncCounts", () => {
  it("aggregates to the expected unresolved totals", () => {
    expect(syncCounts()).toEqual({ pending: 2, conflict: 2, error: 1 });
  });

  it("treats conflicts + errors as the 'to resolve' count", () => {
    const c = syncCounts();
    expect(c.conflict + c.error).toBe(3);
  });
});

describe("tasksForUser", () => {
  it("returns only tasks the user owns, co-owns, or reports", () => {
    const mine = tasksForUser("maya");
    for (const t of mine) {
      const involved =
        t.assignee === "maya" || t.coassignees.includes("maya") || t.reporter === "maya";
      expect(involved).toBe(true);
    }
    const ids = mine.map((t) => t.id);
    expect(ids).toContain("TASK-214"); // reporter
    expect(ids).toContain("TASK-176"); // co-assignee
    expect(ids).not.toContain("TASK-160"); // tariq only
  });
});

describe("confidenceOf", () => {
  const byId = (id: string) => TASKS.find((t) => t.id === id)!;

  it("flags blocked tasks", () => {
    expect(confidenceOf(byId("TASK-176")).state).toBe("blocked");
  });

  it("treats verified/merged as ready at 100%", () => {
    const c = confidenceOf(byId("TASK-201"));
    expect(c.state).toBe("ready");
    expect(c.pct).toBe(100);
  });

  it("shows an evidence gap in QA/review with the right ratio", () => {
    const c = confidenceOf(byId("TASK-214")); // qa, 5/6 done
    expect(c.state).toBe("gap");
    expect(c.label).toBe("5/6 evidence");
    expect(c.pct).toBe(83);
  });

  it("reads as building while in progress", () => {
    expect(confidenceOf(byId("TASK-219")).state).toBe("building"); // progress, 2/6
    expect(confidenceOf(byId("TASK-133")).label).toBe("Planned"); // backlog, no evidence
  });
});

describe("Petra domain rule", () => {
  it("accepts both Petra domains, case-insensitively", () => {
    expect(isPetraEmail("maya.aldosari@petralabx.com")).toBe(true);
    expect(isPetraEmail("Dana.Okafor@PETRASOAP.COM")).toBe(true);
  });

  it("rejects external domains and malformed input", () => {
    expect(isPetraEmail("someone@gmail.com")).toBe(false);
    expect(isPetraEmail("a@petralabx.org")).toBe(false);
    expect(isPetraEmail("petralabx.com")).toBe(false);
    expect(isPetraEmail("")).toBe(false);
  });

  it("extracts a lowercased domain", () => {
    expect(domainOf("Sam.Whitfield@PetraSoap.com")).toBe("petrasoap.com");
  });
});
