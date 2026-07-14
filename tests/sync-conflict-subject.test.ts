// Regression: inbound Roadmap/Projects conflicts must persist the matching
// SyncConflictSubject. A prior correction swapped bucket↔project at insert,
// so resolveConflict loaded the wrong table for real inbound conflicts.
// Tests exercise runSweep insertConflict call sites (not hand-seeded rows).

import { beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  conflicts: [] as { entityType: string; entityId: string; field: string }[],
  deltas: {
    roadmap: {
      items: [
        {
          id: "71",
          fields: { InitiativeID: "BKT-OPS", Title: "Ops", Health: "At risk" },
          lastModifiedBy: { user: { email: "human@petrasoap.com" } },
          lastModifiedDateTime: "2026-07-14T19:00:00.000Z",
        },
      ],
      deltaLink: "dl-roadmap",
    },
    projects: {
      items: [
        {
          id: "81",
          fields: { ProjectID: "PRJ-OPS", Title: "Ops", Health: "At risk" },
          lastModifiedBy: { user: { email: "human@petrasoap.com" } },
          lastModifiedDateTime: "2026-07-14T19:00:00.000Z",
        },
      ],
      deltaLink: "dl-projects",
    },
  } as Record<string, { items: unknown[]; deltaLink: string }>,
}));

vi.mock("@/lib/sync/graph", () => {
  class GraphError extends Error {}
  return {
    GraphError,
    siteContext: async () => ({
      siteId: "s",
      listIds: {
        todos: "t",
        risks: "r",
        roadmap: "roadmap",
        projects: "projects",
        reporegistry: "rr",
      },
    }),
    listDelta: async (_ctx: unknown, listKey: string) =>
      h.deltas[listKey] ?? { items: [], deltaLink: `dl-${listKey}` },
    patchListItemFields: async () => {},
    createListItem: async () => "new-item",
    findItemByField: async () => null,
    REPO_REGISTRY_KEY: "reporegistry",
    PROJECTS_KEY: "projects",
    ROADMAP_KEY: "roadmap",
    resolveSiteUserLookupId: async () => null,
    resolveEmailByLookupId: async () => null,
    normalizeLastModified: () => ({
      source: "human",
      at: "2026-07-14T19:00:00.000Z",
    }),
  };
});

vi.mock("@/lib/sync/mapping", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/sync/mapping")>();
  return {
    ...real,
    reconcileInbound: () => ({
      apply: {},
      conflicts: [{ field: "health", mcVal: "track", spVal: "risk" }],
      clearedDirty: [],
      attributionEvents: [],
    }),
    inboundBucketPatches: () => ({ health: "risk" }),
    inboundProjectPatches: () => ({ health: "risk" }),
    inboundPatches: () => ({}),
    planTaskPersons: () => ({ clear: [], resolve: [] }),
    outboundFields: () => ({}),
    repoOutboundFields: () => ({}),
    projectOutboundFields: () => ({}),
    bucketOutboundFields: () => ({}),
  };
});

vi.mock("@/lib/sync/repo", () => ({
  stamp: () => "2026.07.14 · 00:00",
  entityCount: async () => 1,
  getEntity: async () => ({ id: "seed" }),
  insertEntity: async () => {},
  insertConflict: async (row: { entityType: string; entityId: string; field: string }) => {
    h.conflicts.push({
      entityType: row.entityType,
      entityId: row.entityId,
      field: row.field,
    });
  },
  insertPushError: async () => {},
  appendAudit: async () => {},
  getEntities: async () => [],
  getDeltaLink: async () => null,
  saveDeltaLink: async () => {},
  markRegisterInboundComplete: async () => {},
  updateEntity: async () => {},
  countsByList: async () => ({}),
  seedRepos: async () => {},
  getRepos: async () => [],
  getProjectRows: async () => [
    {
      project: {
        id: "PRJ-OPS",
        name: "Ops",
        health: "track",
        owner: "",
        started: "Jul 01",
        target: "Jul 31",
        desc: "",
        repos: [],
        sync: { state: "synced", ts: "—", sp: "Projects" },
        prd: null,
      },
      syncState: "synced",
      spItemId: "81",
      dirtyFields: ["health"],
      fieldAttribution: {
        health: { source: "human", at: "2026-07-14T18:00:00.000Z" },
      },
    },
  ],
  getBucketRows: async () => [
    {
      bucket: {
        id: "BKT-OPS",
        name: "Ops",
        health: "track",
        owner: "",
        started: "Jul 01",
        target: "Jul 31",
        desc: "",
        repos: [],
        sync: { state: "synced", ts: "—", sp: "Roadmap" },
        prd: null,
      },
      syncState: "synced",
      spItemId: "71",
      dirtyFields: ["health"],
      fieldAttribution: {
        health: { source: "human", at: "2026-07-14T18:00:00.000Z" },
      },
    },
  ],
  getBucketBySpItemId: async () => null,
  seedBuckets: async () => {},
  seedProjects: async () => {},
  updateBucket: async () => {},
  updateProject: async () => {},
  setProjectSync: async () => {},
  setBucketSync: async () => {},
}));

import { runSweep } from "@/lib/sync/engine";

beforeEach(() => {
  h.conflicts.length = 0;
});

describe("inbound planning conflict subjects (P4 attempt 3)", () => {
  it("persists Roadmap conflicts as entityType bucket and Projects as project", async () => {
    const result = await runSweep("scribe");
    expect(result.conflicts).toBeGreaterThanOrEqual(2);
    expect(h.conflicts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ entityType: "bucket", entityId: "BKT-OPS" }),
        expect.objectContaining({ entityType: "project", entityId: "PRJ-OPS" }),
      ])
    );
    expect(h.conflicts.some((c) => c.entityId === "BKT-OPS" && c.entityType === "project")).toBe(
      false
    );
    expect(h.conflicts.some((c) => c.entityId === "PRJ-OPS" && c.entityType === "bucket")).toBe(
      false
    );
  });
});
