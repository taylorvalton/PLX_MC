// P4: inbound adoption validation + builders + sequence helpers.
import { describe, expect, it } from "vitest";
import {
  buildAdoptedBucket,
  buildAdoptedProject,
  buildAdoptedTask,
} from "@/lib/sync/engine";
import {
  numericTaskId,
  validateInboundAdoptionRow,
} from "@/lib/sync/mapping";

describe("validateInboundAdoptionRow", () => {
  it("accepts a valid unknown SharePoint Task", () => {
    const v = validateInboundAdoptionRow("task", {
      TaskID: "TASK-9001",
      Title: "Human-created work",
      Status: "Backlog",
      Priority: "High",
    });
    expect(v).toEqual({ ok: true, id: "TASK-9001", errors: [] });
  });

  it("rejects invalid Task IDs and enums (audit path)", () => {
    expect(validateInboundAdoptionRow("task", { Title: "x" }).errors).toContain(
      "invalid_or_missing_task_id"
    );
    expect(
      validateInboundAdoptionRow("task", {
        TaskID: "TASK-1",
        Title: "x",
        Status: "NotARealStage",
      }).errors
    ).toContain("invalid_status");
    expect(
      validateInboundAdoptionRow("task", {
        TaskID: "not-a-task",
        Title: "x",
      }).ok
    ).toBe(false);
  });

  it("accepts valid Project and Bucket IDs; rejects garbage", () => {
    expect(
      validateInboundAdoptionRow("project", {
        ProjectID: "PRJ-HUMAN-OPS",
        Title: "Ops",
        Health: "On track",
      }).ok
    ).toBe(true);
    expect(
      validateInboundAdoptionRow("bucket", {
        InitiativeID: "BKT-HUMAN-OPS",
        Title: "Ops bucket",
        Health: "At risk",
      }).ok
    ).toBe(true);
    expect(validateInboundAdoptionRow("project", { Title: "x" }).ok).toBe(false);
    expect(
      validateInboundAdoptionRow("bucket", {
        InitiativeID: "BKT-X",
        Title: "x",
        Health: "Nope",
      }).errors
    ).toContain("invalid_health");
  });
});

describe("adoption builders never fabricate ownership", () => {
  it("builds task/bucket/project with empty owner/accountable fields", () => {
    const t = buildAdoptedTask("TASK-42", { Title: "T", Status: "Backlog" });
    expect(t.accountableOwner).toBeNull();
    expect(t.reporter).toBe("");
    expect(t.title).toBe("T");

    const b = buildAdoptedBucket("BKT-X", { Title: "Bucket", Health: "On track" });
    expect(b.owner).toBe("");
    expect(b.name).toBe("Bucket");

    const p = buildAdoptedProject("PRJ-X", { Title: "Project", Health: "At risk" });
    expect(p.owner).toBe("");
    expect(p.health).toBe("risk");
  });
});

describe("numericTaskId sequence input", () => {
  it("parses TASK-* numerics and rejects non-numeric", () => {
    expect(numericTaskId("TASK-9001")).toBe(9001);
    expect(numericTaskId("TASK-1")).toBe(1);
    expect(numericTaskId("BKT-X")).toBeNull();
  });
});
