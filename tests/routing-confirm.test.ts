// P8 — confirm-existing / attach / fuzzy-cannot-mutate invariants.

import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/route";
import type { PermissionActor } from "@/lib/permissions";
import type { AuthorizedActor } from "@/lib/routing/mutations/actors";

const txState = vi.hoisted(() => ({
  proposals: new Map<string, Record<string, unknown>>(),
  decisions: [] as Record<string, unknown>[],
  links: [] as Record<string, unknown>[],
  events: [] as Record<string, unknown>[],
}));

vi.mock("@/lib/db", () => ({
  withTransaction: async <T>(fn: (q: unknown) => Promise<T>) => {
    const q = async (text: string, params: unknown[] = []) => {
      if (text.includes("FOR UPDATE")) {
        const row = txState.proposals.get(String(params[0]));
        return row ? [row] : [];
      }
      if (text.includes("UPDATE routing_proposals")) {
        const row = txState.proposals.get(String(params[0]));
        if (!row) return [];
        Object.assign(row, {
          state: params[1],
          selected_task_id: params[2],
          selected_bucket_id: params[3],
          derived_project_id: params[4],
          failure_reason: params[5],
        });
        return [row];
      }
      if (text.includes("UPDATE routing_sessions")) return [];
      if (text.includes("INSERT INTO routing_decisions")) {
        txState.decisions.push({ id: params[0] });
        return [];
      }
      if (text.includes("INSERT INTO routing_work_links")) {
        txState.links.push({ id: params[0], link_type: params[3] });
        return [];
      }
      if (text.includes("INSERT INTO mc_events")) {
        txState.events.push({ kind: params[0] });
        return [];
      }
      return [];
    };
    return fn(q);
  },
}));

vi.mock("@/lib/sync/engine", () => ({
  ensureSeeded: vi.fn(async () => true),
  ensureReposSeeded: vi.fn(async () => true),
  ensureBucketsSeeded: vi.fn(async () => true),
  checkRoutingFreshness: vi.fn(async () => ({
    ok: true,
    code: "ok",
    maxAgeMs: 360_000,
    checkedAt: new Date().toISOString(),
    registers: [],
    reasons: [],
  })),
}));

vi.mock("@/lib/sync/repo", () => ({
  stamp: () => "2026.07.14 · 00:00",
  openConflicts: vi.fn(async () => []),
  openErrors: vi.fn(async () => []),
  getEntity: vi.fn(async (_type: string, id: string) => {
    if (id === "TASK-10") {
      return {
        data: {
          id: "TASK-10",
          title: "Existing",
          bucket: "BKT-OPS",
          stage: "progress",
          repos: ["petralabx/PLX_MC"],
        },
      };
    }
    if (id === "TASK-99") {
      return {
        data: {
          id: "TASK-99",
          title: "Verified",
          bucket: "BKT-OPS",
          stage: "verified",
          repos: ["petralabx/PLX_MC"],
        },
      };
    }
    return null;
  }),
  getBuckets: vi.fn(async () => [{ id: "BKT-OPS", project: "PRJ-1", name: "Ops" }]),
  getRepos: vi.fn(async () => []),
}));

vi.mock("@/lib/sync", async () => {
  const engine = await import("@/lib/sync/engine");
  return {
    checkRoutingFreshness: engine.checkRoutingFreshness,
  };
});

import { assertMutableTrust } from "@/lib/routing/mutations/preconditions";
import { attachCheckoutLink, confirmExistingTask } from "@/lib/routing/service";

const human: AuthorizedActor = {
  actor: { kind: "human", id: "oid-1", role: "member", status: "active" } satisfies PermissionActor,
  actorId: "oid-1",
  actorKind: "human",
  auditLabel: "vince@example.com",
};

beforeEach(() => {
  process.env.PLX_MC_ROUTING_CONFIRM_ENABLED = "1";
  txState.proposals.clear();
  txState.decisions.length = 0;
  txState.links.length = 0;
  txState.events.length = 0;
  txState.proposals.set("prop-1", {
    id: "prop-1",
    repo_id: "petralabx/PLX_MC",
    change_id: "42",
    session_id: null,
    state: "action_required",
    title: "PR",
    body_content_hash: "abc",
    markers: [],
    derived_project_id: "PRJ-1",
    failure_reason: null,
    selected_task_id: null,
    selected_bucket_id: null,
  });
});

describe("fuzzy cannot mutate", () => {
  it("rejects fuzzy and none authorizationTrust", () => {
    expect(() => assertMutableTrust("fuzzy")).toThrow(ApiError);
    expect(() => assertMutableTrust("none")).toThrow(ApiError);
    expect(() => assertMutableTrust("persisted_decision")).not.toThrow();
  });

  it("confirmExisting rejects fuzzy trust before mutating", async () => {
    await expect(
      confirmExistingTask(human, {
        proposalId: "prop-1",
        taskId: "TASK-10",
        authorizationTrust: "fuzzy",
      })
    ).rejects.toMatchObject({ code: "fuzzy_cannot_mutate" });
    expect(txState.decisions).toHaveLength(0);
  });
});

describe("confirmExistingTask", () => {
  it("locks proposal, records decision + related link, resolves", async () => {
    const result = await confirmExistingTask(human, {
      proposalId: "prop-1",
      taskId: "TASK-10",
      authorizationTrust: "persisted_decision",
      linkType: "related",
    });
    expect(result).toMatchObject({
      taskId: "TASK-10",
      proposalId: "prop-1",
      created: false,
      replayed: false,
      linkType: "related",
    });
    expect(txState.decisions).toHaveLength(1);
    expect(txState.links).toHaveLength(1);
    expect(txState.events.some((e) => e.kind === "routing.confirm")).toBe(true);
    expect(txState.proposals.get("prop-1")!.state).toBe("resolved");
  });

  it("replays when already resolved to the same task", async () => {
    txState.proposals.get("prop-1")!.state = "resolved";
    txState.proposals.get("prop-1")!.selected_task_id = "TASK-10";
    const result = await confirmExistingTask(human, {
      proposalId: "prop-1",
      taskId: "TASK-10",
    });
    expect(result.replayed).toBe(true);
    expect(txState.decisions).toHaveLength(0);
  });

  it("refuses silent Verified reopen", async () => {
    await expect(
      confirmExistingTask(human, {
        proposalId: "prop-1",
        taskId: "TASK-99",
      })
    ).rejects.toMatchObject({ code: "verified_locked" });
  });
});

describe("attachCheckoutLink", () => {
  it("attaches dsp_* checkout as credentialed related link", async () => {
    const result = await attachCheckoutLink(human, {
      proposalId: "prop-1",
      taskId: "TASK-10",
      checkoutId: "dsp_abc123",
    });
    expect(result.linkType).toBe("related");
    expect(txState.events.some((e) => e.kind === "routing.attach")).toBe(true);
  });

  it("rejects non-dsp checkout ids", async () => {
    await expect(
      attachCheckoutLink(human, {
        proposalId: "prop-1",
        taskId: "TASK-10",
        checkoutId: "not-a-checkout",
      })
    ).rejects.toMatchObject({ code: "invalid_checkout" });
  });
});
