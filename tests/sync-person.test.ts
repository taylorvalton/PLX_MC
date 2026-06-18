// Person-column resolution invariants (Item 1): the pure plan
// (planTaskPersons) and the engine's resolution (resolveTaskPersons) that turns
// MC actors into site-user lookup ids — clear / resolve / skip / unresolved —
// proven hermetically with an INJECTED resolver (no Graph, no network).

import { describe, expect, it } from "vitest";
import type { SiteContext } from "@/lib/sync/graph";
import { planTaskPersons } from "@/lib/sync/mapping";
import { resolveTaskPersons } from "@/lib/sync/engine";

const ctx: SiteContext = { siteId: "site-123", listIds: {} };

// Minimal person-field shape (resolveTaskPersons + planTaskPersons only read the
// three actor fields).
const persons = (assignee: string | null, accountableOwner: string | null, reporter: string) => ({
  assignee,
  accountableOwner,
  reporter,
});

describe("planTaskPersons (pure classification)", () => {
  it("classifies humans-with-email as resolve, null as clear, agents as skip", () => {
    const plan = planTaskPersons(persons("ricardo", "vince", "vince"));
    expect(plan.resolve.map((r) => r.mc).sort()).toEqual(["accountableOwner", "assignee", "reporter"]);
    expect(plan.resolve.find((r) => r.mc === "assignee")?.email).toBe("ricardo@petrasoap.com");
    expect(plan.clear).toEqual([]);
    expect(plan.skip).toEqual([]);
  });

  it("routes a null actor to clear and an agent to skip (no fabricated person)", () => {
    const plan = planTaskPersons(persons(null, "vince", "scribe"));
    expect(plan.clear).toEqual(["assignee"]); // unassigned → clear the column
    expect(plan.resolve.map((r) => r.mc)).toEqual(["accountableOwner"]); // human owner
    expect(plan.skip).toEqual([{ mc: "reporter", actorId: "scribe" }]); // agent → no SP person
  });
});

describe("resolveTaskPersons (engine resolution, injected resolver)", () => {
  // Fake UIL: ricardo + vince are in the site directory; greg is not.
  const fakeResolver = async (_ctx: SiteContext, email: string): Promise<number | null> => {
    const uil: Record<string, number> = {
      "ricardo@petrasoap.com": 11,
      "vince@petrasoap.com": 7,
    };
    return uil[email.toLowerCase()] ?? null;
  };

  it("maps resolvable humans to lookup ids and clears a null actor", async () => {
    const { persons: out, unresolved } = await resolveTaskPersons(
      ctx,
      persons("ricardo", "vince", "vince"),
      fakeResolver
    );
    expect(out.assignee).toBe(11);
    expect(out.accountableOwner).toBe(7);
    expect(out.reporter).toBe(7);
    expect(unresolved).toEqual([]);
  });

  it("clears an unassigned column with null and never touches an agent column", async () => {
    const { persons: out, unresolved } = await resolveTaskPersons(
      ctx,
      persons(null, "vince", "scribe"),
      fakeResolver
    );
    expect(out.assignee).toBeNull(); // cleared
    expect(out.accountableOwner).toBe(7);
    expect("reporter" in out).toBe(false); // agent → omitted, not faked
    expect(unresolved).toEqual([]);
  });

  it("records a human not in the directory as unresolved (skip + audit), never fabricates an id", async () => {
    const { persons: out, unresolved } = await resolveTaskPersons(
      ctx,
      persons("greg", "vince", "vince"),
      fakeResolver
    );
    expect("assignee" in out).toBe(false); // greg not in the UIL → omitted
    expect(out.accountableOwner).toBe(7);
    expect(unresolved).toEqual([{ mc: "assignee", actorId: "greg" }]);
  });

  it("degrades a resolver failure to unresolved (fail visible) rather than throwing", async () => {
    const throwing = async () => {
      throw new Error("graph 503");
    };
    const { persons: out, unresolved } = await resolveTaskPersons(
      ctx,
      persons("ricardo", null, "vince"),
      throwing
    );
    expect("assignee" in out).toBe(false);
    expect(out.accountableOwner).toBeNull(); // null actor still clears
    expect(unresolved.map((u) => u.mc).sort()).toEqual(["assignee", "reporter"]);
  });
});
