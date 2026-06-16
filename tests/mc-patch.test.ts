// PRIMARY hydrate-survival regression for the prime directive (Goal 1 / R1):
// the server `patchTask` must round-trip every newly-editable field through
// `entities.data` (the whole-Task jsonb blob), and must honor the per-field
// persistence tier at the server boundary — SP fields flip sync_state to
// "pending" + dirty; DB-only fields (bucket/labels/coassignees/subtasks) do
// NOT. The store's `serverCall` is a no-op under test (store.ts:167-168), so
// this server-level test is the only programmatic proxy for "survives the next
// GET /api/state hydrate" — the actual browser hydrate is E2E-only.
//
// The `repo` seam is mocked with an in-memory entity map whose `updateEntity`
// mirrors the real `{...row.data, ...patch}` jsonb merge (repo.ts:82), so the
// test proves the field reaches `data` exactly as production would persist it.

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Task } from "@/lib/mc-data";

const store = vi.hoisted(() => {
  const rows = new Map<
    string,
    { entity_type: string; id: string; data: Record<string, unknown>; sync_state: string; sp_item_id: string | null; dirty_fields: string[] }
  >();
  const audits: { actor: string; body: string; state: string }[] = [];
  return { rows, audits };
});

vi.mock("@/lib/sync/engine", () => ({
  ensureSeeded: vi.fn(async () => true),
}));

vi.mock("@/lib/sync/repo", () => ({
  stamp: () => "2026.06.16 · 00:00",
  async getEntity(type: string, id: string) {
    return store.rows.get(`${type}:${id}`) ?? null;
  },
  async updateEntity(
    type: string,
    id: string,
    opts: { patch?: Record<string, unknown>; syncState?: string; dirtyFields?: string[] }
  ) {
    const row = store.rows.get(`${type}:${id}`);
    if (!row) return;
    // Mirror the real merge: data = {...row.data, ...patch} (repo.ts:82).
    row.data = { ...row.data, ...(opts.patch ?? {}) };
    if (opts.syncState !== undefined) row.sync_state = opts.syncState;
    if (opts.dirtyFields !== undefined) row.dirty_fields = opts.dirtyFields;
  },
  async appendAudit(actor: string, body: string, state: string) {
    store.audits.push({ actor, body, state });
  },
}));

// Imported AFTER the mocks so `state.ts`'s `import * as repo from "./repo"`
// and `ensureSeeded` from "./engine" resolve to the mocked modules.
import { patchTask } from "@/lib/sync/state";

function seedTask(over: Partial<Task> = {}): Task {
  const base: Task = {
    id: "TASK-900",
    title: "seed task",
    description: "",
    bucket: "BKT-WMS",
    stage: "planned",
    priority: "medium",
    assignee: null,
    coassignees: [],
    reporter: "vince",
    reqs: [],
    repos: [],
    estimate: "M",
    labels: [],
    prs: [],
    due: "Jun 15",
    sync: { state: "synced", ts: "—", sp: "ToDos · item 900" },
    subtasks: [],
    activity: [],
    ...over,
  };
  store.rows.set("task:" + base.id, {
    entity_type: "task",
    id: base.id,
    data: base as unknown as Record<string, unknown>,
    sync_state: "synced",
    sp_item_id: "1",
    dirty_fields: [],
  });
  return base;
}

beforeEach(() => {
  store.rows.clear();
  store.audits.length = 0;
});

describe("patchTask — new DB-only fields round-trip through entities.data", () => {
  it("persists bucket / labels / coassignees / subtasks into the jsonb blob", async () => {
    seedTask();
    const updated = await patchTask(
      "TASK-900",
      {
        bucket: "BKT-DAPI",
        labels: ["go-live", "api"],
        coassignees: ["lena", "evan"],
        subtasks: [{ id: "SUB-1", t: "spike", done: false, who: "vince" }],
      },
      "vince"
    );
    expect(updated).not.toBeNull();
    expect(updated!.bucket).toBe("BKT-DAPI");
    expect(updated!.labels).toEqual(["go-live", "api"]);
    expect(updated!.coassignees).toEqual(["lena", "evan"]);
    expect(updated!.subtasks).toEqual([{ id: "SUB-1", t: "spike", done: false, who: "vince" }]);

    // And the persisted row carries them too (the hydrate source of truth).
    const row = store.rows.get("task:TASK-900")!;
    expect(row.data.bucket).toBe("BKT-DAPI");
    expect(row.data.labels).toEqual(["go-live", "api"]);
  });
});

describe("patchTask — per-field tier at the server boundary", () => {
  it("DB-only fields do NOT flip sync_state to pending or add dirty fields", async () => {
    seedTask();
    await patchTask("TASK-900", { bucket: "BKT-DAPI", labels: ["x"] }, "vince");
    const row = store.rows.get("task:TASK-900")!;
    expect(row.sync_state).toBe("synced"); // unchanged — never re-queued for push
    expect(row.dirty_fields).toEqual([]);
  });

  it("SP fields (stage/priority/title/due/description) flip sync_state to pending + dirty", async () => {
    seedTask();
    const updated = await patchTask("TASK-900", { stage: "qa", priority: "high" }, "vince");
    expect(updated!.stage).toBe("qa");
    expect(updated!.priority).toBe("high");
    const row = store.rows.get("task:TASK-900")!;
    expect(row.sync_state).toBe("pending");
    expect(row.dirty_fields).toEqual(expect.arrayContaining(["stage", "priority"]));
  });

  it("a mixed SP + DB-only patch flips pending but only dirties the SP fields", async () => {
    seedTask();
    await patchTask("TASK-900", { stage: "qa", labels: ["x"], bucket: "BKT-DAPI" }, "vince");
    const row = store.rows.get("task:TASK-900")!;
    expect(row.sync_state).toBe("pending");
    expect(row.dirty_fields).toEqual(["stage"]); // labels/bucket are DB-only, not dirtied
    // ...but the DB-only fields still persisted.
    expect(row.data.labels).toEqual(["x"]);
    expect(row.data.bucket).toBe("BKT-DAPI");
  });
});

describe("patchTask — safe no-ops", () => {
  it("returns the existing task unchanged on an empty patch", async () => {
    seedTask();
    const updated = await patchTask("TASK-900", {}, "vince");
    expect(updated!.id).toBe("TASK-900");
    const row = store.rows.get("task:TASK-900")!;
    expect(row.sync_state).toBe("synced");
    expect(store.audits).toHaveLength(0);
  });

  it("returns null for an unknown task", async () => {
    expect(await patchTask("TASK-NOPE", { labels: ["x"] }, "vince")).toBeNull();
  });
});
