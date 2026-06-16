// Invariant tests for the runtime store (the client cache over the sync
// engine): task creation, the sweep, safe no-op reconciliation, invites,
// reassignment. Conflict/error resolution semantics live in the engine
// (tests/sync-mapping.test.ts + the live evidence bundles); the store-side
// invariants here are the optimistic-local behaviors.
import { beforeEach, describe, expect, it } from "vitest";

import {
  addSubtask,
  addTask,
  allTasks,
  auditLog,
  inboxNotifications,
  invitePerson,
  markAllSynced,
  markRead,
  nextTaskId,
  openConflicts,
  openErrors,
  patchTaskFields,
  reassignTask,
  resetStore,
  resolveConflict,
  retryError,
  setCoassignees,
  setTaskBucket,
  setTaskLabels,
  setTaskPriority,
  setTaskStage,
  storeSyncCounts,
  taskById,
  toggleSubtask,
  unreadCount,
} from "@/lib/mc-data/store";

beforeEach(() => resetStore());

describe("addTask", () => {
  it("creates a pending, user-created task with the next id and bumps the ToDos pending count", () => {
    const before = storeSyncCounts();
    const id = nextTaskId();
    const t = addTask({ title: "  New thing  ", bucket: "BKT-WMS" });
    expect(t.id).toBe(id);
    expect(t.title).toBe("New thing");
    expect(t.stage).toBe("backlog");
    expect(t.sync.state).toBe("pending");
    expect(t.userCreated).toBe(true);
    expect(allTasks().some((x) => x.id === t.id)).toBe(true);
    expect(storeSyncCounts().pending).toBe(before.pending + 1);
  });
});

describe("markAllSynced (the sweep)", () => {
  it("flips every pending item to synced and zeroes pending counts", () => {
    addTask({ title: "x", bucket: "BKT-WMS" });
    markAllSynced();
    const counts = storeSyncCounts();
    expect(counts.pending).toBe(0);
    expect(allTasks().every((t) => t.sync.state !== "pending")).toBe(true);
  });
});

describe("conflict / error reconciliation", () => {
  it("starts with empty queues (demo seeds purged; the engine raises real ones)", () => {
    expect(openConflicts()).toHaveLength(0);
    expect(openErrors()).toHaveLength(0);
  });

  it("treats resolving or retrying an unknown id as a safe no-op", () => {
    const before = storeSyncCounts();
    expect(() => resolveConflict("cf-nope", "mc")).not.toThrow();
    expect(() => retryError("er-nope")).not.toThrow();
    expect(storeSyncCounts()).toEqual(before);
  });
});

describe("markRead", () => {
  it("clears a notification's unread state and the unread count", () => {
    const before = unreadCount();
    expect(before).toBeGreaterThan(0);
    const firstUnread = inboxNotifications().find((n) => n.unread)!;
    markRead(firstUnread.id);
    expect(unreadCount()).toBe(before - 1);
    expect(inboxNotifications().find((n) => n.id === firstUnread.id)?.unread).toBe(false);
  });
});

describe("invitePerson", () => {
  it("registers a Petra-domain colleague and is idempotent per email", () => {
    const id = invitePerson("noa.levi@petrasoap.com");
    expect(id).toBe("inv-noalevi");
    expect(invitePerson("noa.levi@petrasoap.com")).toBe(id);
  });

  it("rejects non-Petra domains", () => {
    expect(invitePerson("someone@gmail.com")).toBeNull();
  });
});

describe("reassignTask", () => {
  it("sets the assignee and logs the honest deferred-mirror trail (not a fabricated push)", () => {
    reassignTask("TASK-221", "priya");
    const t = taskById("TASK-221");
    expect(t?.assignee).toBe("priya");
    // The mirror is deferred to the directory increment — the trail must say so
    // and must NOT claim a SharePoint mirror / Teams notify that did not happen.
    expect(t?.activity[0]?.what).not.toContain("mirrored to SharePoint");
    expect(t?.activity[0]?.what).not.toContain("notified via Teams");
    expect(t?.activity[0]?.what).toContain("deferred to the directory increment");
  });

  it("supports unassigning with the honest deferred-mirror trail", () => {
    reassignTask("TASK-222", "felix");
    reassignTask("TASK-222", null);
    const t = taskById("TASK-222");
    expect(t?.assignee).toBeNull();
    expect(t?.activity[0]?.what).toContain("unassigned");
    expect(t?.activity[0]?.what).toContain("deferred to the directory increment");
  });
});

describe("assignee-mirror audit honesty (the untested unassign/reassign lie)", () => {
  it("reassign audit reads the deferred-mirror truth and is state=pending, not synced", () => {
    reassignTask("TASK-221", "priya");
    const top = auditLog()[0];
    expect(top.body).toContain("deferred to the directory increment");
    expect(top.body).not.toContain("Assigned To mirrored");
    expect(top.body).not.toContain("cleared in SharePoint");
    expect(top.state).toBe("pending");
  });

  it("unassign audit reads the deferred-mirror truth and is state=pending, not synced", () => {
    reassignTask("TASK-222", "felix");
    reassignTask("TASK-222", null);
    const top = auditLog()[0];
    expect(top.body).toContain("deferred to the directory increment");
    expect(top.body).not.toContain("cleared in SharePoint");
    expect(top.state).toBe("pending");
  });
});

describe("patchTaskFields (the shared mutation spine)", () => {
  it("sets a field optimistically and is reflected by taskById", () => {
    patchTaskFields("TASK-221", { stage: "qa" });
    expect(taskById("TASK-221")?.stage).toBe("qa");
  });

  it("is a safe no-op on an empty patch", () => {
    const before = JSON.stringify(taskById("TASK-221"));
    patchTaskFields("TASK-221", {});
    expect(JSON.stringify(taskById("TASK-221"))).toBe(before);
  });

  it("setTaskStage / setTaskPriority / setTaskBucket apply optimistically", () => {
    setTaskStage("TASK-221", "merged");
    setTaskPriority("TASK-221", "urgent");
    setTaskBucket("TASK-221", "BKT-DAPI");
    const t = taskById("TASK-221");
    expect(t?.stage).toBe("merged");
    expect(t?.priority).toBe("urgent");
    expect(t?.bucket).toBe("BKT-DAPI");
  });
});

describe("DB-only tier guarantee (DB-only edits never fabricate a pending push)", () => {
  it("patching labels / subtasks / coassignees / bucket leaves task.sync.state unchanged", () => {
    const t0 = taskById("TASK-221")!;
    const before = t0.sync.state;
    setTaskLabels("TASK-221", ["go-live", "wms"]);
    expect(taskById("TASK-221")?.sync.state).toBe(before);
    addSubtask("TASK-221", "spike the adapter", "vince");
    expect(taskById("TASK-221")?.sync.state).toBe(before);
    setCoassignees("TASK-221", ["lena"]);
    expect(taskById("TASK-221")?.sync.state).toBe(before);
    setTaskBucket("TASK-221", "BKT-DAPI");
    expect(taskById("TASK-221")?.sync.state).toBe(before);
  });
});

describe("inline-edit field wrappers", () => {
  it("setTaskLabels replaces the label set (add/remove idempotence)", () => {
    setTaskLabels("TASK-221", ["go-live", "wms"]);
    expect(taskById("TASK-221")?.labels).toEqual(["go-live", "wms"]);
    // Re-applying the same set is idempotent.
    setTaskLabels("TASK-221", ["go-live", "wms"]);
    expect(taskById("TASK-221")?.labels).toEqual(["go-live", "wms"]);
    // Removing one yields exactly the remaining set.
    setTaskLabels("TASK-221", ["go-live"]);
    expect(taskById("TASK-221")?.labels).toEqual(["go-live"]);
  });

  it("addSubtask generates a unique id and appends; toggleSubtask flips done", () => {
    addSubtask("TASK-221", "first", "vince");
    addSubtask("TASK-221", "second", "lena");
    const subs = taskById("TASK-221")!.subtasks;
    expect(subs).toHaveLength(2);
    expect(new Set(subs.map((s) => s.id)).size).toBe(2);
    expect(subs.every((s) => !s.done)).toBe(true);

    const firstId = subs[0].id;
    toggleSubtask("TASK-221", firstId);
    expect(taskById("TASK-221")?.subtasks.find((s) => s.id === firstId)?.done).toBe(true);
    toggleSubtask("TASK-221", firstId);
    expect(taskById("TASK-221")?.subtasks.find((s) => s.id === firstId)?.done).toBe(false);
  });

  it("addSubtask ignores blank text", () => {
    addSubtask("TASK-221", "   ", "vince");
    expect(taskById("TASK-221")?.subtasks).toHaveLength(0);
  });

  it("setCoassignees dedupes and never includes the primary assignee", () => {
    reassignTask("TASK-221", "priya");
    setCoassignees("TASK-221", ["lena", "lena", "priya", "evan"]);
    const co = taskById("TASK-221")!.coassignees;
    expect(co).toEqual(["lena", "evan"]); // deduped; primary "priya" excluded
  });
});
