// Regression (hardener / Item 1 auditor finding): manual conflict resolution
// "keep Mission Control" for a PERSON column must resolve the site-user LookupId
// before claiming a sync. Before the fix it pushed `outboundFields(..., { only:
// [mcField] })` with no `persons`, so an assignee write was an empty no-op that
// still marked the row synced — a fabricated person sync. The graph + db repo
// are mocked; the mapping layer is real.

import { beforeEach, describe, expect, it, vi } from "vitest";

const g = vi.hoisted(() => ({
  patchCalls: [] as { listKey: string; itemId: string; fields: Record<string, unknown> }[],
  lookup: new Map<string, number>(),
}));

const r = vi.hoisted(() => ({
  conflict: null as Record<string, unknown> | null,
  row: null as Record<string, unknown> | null,
  bucketRow: null as Record<string, unknown> | null,
  projectRow: null as Record<string, unknown> | null,
  updates: [] as { id: string; opts: Record<string, unknown> }[],
  bucketUpdates: [] as { id: string; opts: Record<string, unknown> }[],
  projectUpdates: [] as { id: string; opts: Record<string, unknown> }[],
  resolved: [] as { id: string; winner: string }[],
  audits: [] as { body: string; state: string }[],
}));

vi.mock("@/lib/sync/graph", () => ({
  siteContext: async () => ({
    siteId: "s",
    listIds: {
      todos: "L-todos",
      risks: "L-risks",
      roadmap: "L-roadmap",
      projects: "L-projects",
      reporegistry: "L-rr",
    },
  }),
  patchListItemFields: async (_ctx: unknown, listKey: string, itemId: string, fields: Record<string, unknown>) => {
    g.patchCalls.push({ listKey, itemId, fields });
  },
  createListItem: async () => "new-item",
  findItemByField: async () => null,
  resolveSiteUserLookupId: async (_ctx: unknown, email: string) => g.lookup.get(email.toLowerCase()) ?? null,
  resolveEmailByLookupId: async () => null,
  listDelta: async () => ({ items: [], deltaLink: "d" }),
  REPO_REGISTRY_KEY: "reporegistry",
  ROADMAP_KEY: "roadmap",
  PROJECTS_KEY: "projects",
  GraphError: class GraphError extends Error {
    constructor(
      public status: number,
      public body: string
    ) {
      super(body);
    }
  },
}));

vi.mock("@/lib/sync/repo", () => ({
  getConflict: async () => r.conflict,
  getEntity: async () => r.row,
  getBucketRows: async () => (r.bucketRow ? [r.bucketRow] : []),
  getProjectRows: async () => (r.projectRow ? [r.projectRow] : []),
  updateEntity: async (_type: string, id: string, opts: Record<string, unknown>) => {
    r.updates.push({ id, opts });
  },
  updateBucket: async (id: string, opts: Record<string, unknown>) => {
    r.bucketUpdates.push({ id, opts });
  },
  updateProject: async (id: string, opts: Record<string, unknown>) => {
    r.projectUpdates.push({ id, opts });
  },
  resolveConflictRow: async (id: string, winner: string) => {
    r.resolved.push({ id, winner });
  },
  appendAudit: async (_actor: string, body: string, state: string) => {
    r.audits.push({ body, state });
  },
}));

import { resolveConflict } from "@/lib/sync/engine";

function seedAssigneeConflict() {
  // A real human (ricardo has an @petrasoap.com email) assigned in MC; SharePoint
  // changed the same person — a two-sided conflict on Assigned To.
  r.row = {
    entity_type: "task",
    id: "TASK-1",
    data: { id: "TASK-1", assignee: "ricardo" },
    sync_state: "conflict",
    sp_item_id: "42",
    dirty_fields: ["assignee"],
  };
  r.conflict = {
    id: "cf-1",
    entityType: "task",
    entityId: "TASK-1",
    field: "Assigned To",
    mcVal: "ricardo",
    spVal: "greg",
  };
  g.patchCalls.length = 0;
  r.updates.length = 0;
  r.bucketUpdates.length = 0;
  r.projectUpdates.length = 0;
  r.resolved.length = 0;
  r.audits.length = 0;
}

beforeEach(() => {
  g.lookup.clear();
  r.bucketRow = null;
  r.projectRow = null;
});

describe("resolveConflict keep-MC for a person column (Item 1 hardening)", () => {
  it("writes the resolved AssignedToLookupId and only THEN marks synced", async () => {
    seedAssigneeConflict();
    g.lookup.set("ricardo@petrasoap.com", 11);

    await resolveConflict("cf-1", "mc", "vince");

    expect(g.patchCalls).toHaveLength(1);
    expect(g.patchCalls[0].fields.AssignedToLookupId).toBe(11); // a REAL person write, not an empty no-op
    expect(r.updates.some((u) => u.opts.syncState === "synced")).toBe(true);
  });

  it("re-queues instead of fabricating a synced state when the assignee can't be resolved", async () => {
    seedAssigneeConflict(); // ricardo NOT in the UIL (g.lookup empty)

    await resolveConflict("cf-1", "mc", "vince");

    expect(g.patchCalls).toHaveLength(0); // no empty person write
    expect(r.updates.some((u) => u.opts.syncState === "synced")).toBe(false); // never fabricated
    expect(r.updates.some((u) => u.opts.syncState === "pending")).toBe(true); // re-queued for the sweep
    expect(r.audits.some((a) => /re-queued for the next sweep/.test(a.body))).toBe(true);
  });
});

describe("resolveConflict planning subjects (P4 correction)", () => {
  function seedPlanningConflict(subject: "bucket" | "project") {
    r.row = null;
    r.conflict = {
      id: `cf-${subject}`,
      entityType: subject,
      entityId: subject === "bucket" ? "BKT-OPS" : "PRJ-OPS",
      field: "Health",
      mcVal: "track",
      spVal: "risk",
    };
    const common = {
      syncState: "conflict",
      spItemId: subject === "bucket" ? "71" : "81",
      dirtyFields: ["health"],
      fieldAttribution: {
        health: { source: "human", at: "2026-07-14T18:00:00.000Z" },
      },
    };
    if (subject === "bucket") {
      r.bucketRow = {
        ...common,
        bucket: {
          id: "BKT-OPS",
          name: "Ops",
          health: "track",
          owner: "",
          started: "Jul 01",
          target: "Jul 31",
          desc: "",
          repos: [],
          sync: { state: "conflict", ts: "—", sp: "Roadmap" },
          prd: null,
        },
      };
    } else {
      r.projectRow = {
        ...common,
        project: {
          id: "PRJ-OPS",
          name: "Ops",
          health: "track",
          owner: "",
          started: "Jul 01",
          target: "Jul 31",
          desc: "",
          repos: [],
          sync: { state: "conflict", ts: "—", sp: "Projects" },
          prd: null,
        },
      };
    }
    g.patchCalls.length = 0;
    r.updates.length = 0;
    r.bucketUpdates.length = 0;
    r.projectUpdates.length = 0;
    r.resolved.length = 0;
    r.audits.length = 0;
  }

  it.each(["bucket", "project"] as const)(
    "keep-SP applies %s value and clears only the resolved dirty attribution",
    async (subject) => {
      seedPlanningConflict(subject);
      expect(await resolveConflict(`cf-${subject}`, "sp", "entra-owner")).toBe(true);

      const updates = subject === "bucket" ? r.bucketUpdates : r.projectUpdates;
      expect(updates).toHaveLength(1);
      expect(updates[0].opts).toMatchObject({
        patch: { health: "risk" },
        syncState: "synced",
        dirtyFields: [],
        fieldAttribution: {},
      });
      expect(r.resolved).toEqual([{ id: `cf-${subject}`, winner: "sp" }]);
    }
  );

  it.each([
    ["bucket", "roadmap", "71"],
    ["project", "projects", "81"],
  ] as const)("keep-MC pushes %s to its own list before resolving", async (subject, listKey, itemId) => {
    seedPlanningConflict(subject);
    expect(await resolveConflict(`cf-${subject}`, "mc", "entra-owner")).toBe(true);

    expect(g.patchCalls).toContainEqual({
      listKey,
      itemId,
      fields: { Health: "On track" },
    });
    const updates = subject === "bucket" ? r.bucketUpdates : r.projectUpdates;
    expect(updates[0].opts).toMatchObject({
      syncState: "synced",
      dirtyFields: [],
      fieldAttribution: {},
    });
    expect(r.resolved).toEqual([{ id: `cf-${subject}`, winner: "mc" }]);
  });

  it.each(["bucket", "project"] as const)(
    "does not resolve a %s conflict when its persisted subject is missing",
    async (subject) => {
      seedPlanningConflict(subject);
      r.bucketRow = null;
      r.projectRow = null;

      expect(await resolveConflict(`cf-${subject}`, "sp", "entra-owner")).toBe(false);
      expect(r.resolved).toEqual([]);
      expect(r.audits.some((a) => /Resolved conflict/.test(a.body))).toBe(false);
    }
  );
});
