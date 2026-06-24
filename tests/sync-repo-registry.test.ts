// Repo Registry mirror + persistence invariants (Item 2): the pure push-only
// serializer (repoOutboundFields) and the DB accessors' safety contract
// (parameterized SQL, idempotent upsert/seed, faithful row mapping). The db
// `query` is mocked so the accessor tests are hermetic.

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Repo, RepoRequest } from "@/lib/mc-data";

const db = vi.hoisted(() => ({ calls: [] as { text: string; params: unknown[] }[], rows: [] as unknown[] }));

vi.mock("@/lib/db", () => ({
  async query(text: string, params: unknown[] = []) {
    db.calls.push({ text, params });
    return db.rows;
  },
}));

import { repoOutboundFields } from "@/lib/sync/mapping";
import { getRepos, seedRepos, upsertRepo, upsertRepoRequest } from "@/lib/sync/repo";

const repo: Repo = {
  id: "portal-web",
  name: "plx-customer-portal",
  lang: "TypeScript · Next.js",
  def: "master",
  owner: "taylorvalton",
  visibility: "private",
  scope: "Customer portal web application — the go-live codebase.",
};

describe("repoOutboundFields (Repo Registry push-only mirror)", () => {
  it("writes the RepoID unique key only on create", () => {
    expect(repoOutboundFields(repo, { creating: true }).RepoID).toBe("portal-web");
    expect(repoOutboundFields(repo).RepoID).toBeUndefined();
  });

  it("serializes the registry metadata to the list columns", () => {
    const f = repoOutboundFields(repo);
    expect(f.Title).toBe("plx-customer-portal");
    expect(f.Owner).toBe("taylorvalton");
    expect(f.Visibility).toBe("Private");
    expect(f.DefaultBranch).toBe("master");
    expect(f.Language).toBe("TypeScript · Next.js");
    expect(f.Scope).toBe(repo.scope);
  });

  it("maps public visibility to the SharePoint choice value", () => {
    expect(repoOutboundFields({ ...repo, visibility: "public" }).Visibility).toBe("Public");
  });
});

describe("repo registry accessors — DB safety contract", () => {
  beforeEach(() => {
    db.calls.length = 0;
    db.rows = [];
  });

  it("seedRepos is idempotent (ON CONFLICT DO NOTHING) and parameterized", async () => {
    await seedRepos([repo]);
    const call = db.calls[0];
    expect(call.text).toContain("INSERT INTO repos");
    expect(call.text).toContain("ON CONFLICT (id) DO NOTHING");
    // values are bound, never interpolated
    expect(call.text).not.toContain(repo.name);
    expect(call.params).toEqual([
      repo.id,
      repo.name,
      repo.lang,
      repo.def,
      repo.owner,
      repo.visibility,
      repo.scope,
    ]);
  });

  it("upsertRepo re-queues the push (sync_state -> pending) on conflict", async () => {
    await upsertRepo(repo);
    const call = db.calls[0];
    expect(call.text).toContain("ON CONFLICT (id) DO UPDATE");
    expect(call.text).toContain("sync_state = 'pending'");
    expect(call.params[0]).toBe(repo.id);
  });

  it("upsertRepoRequest binds every field as a placeholder ($1..$14), never interpolated", async () => {
    const req: RepoRequest = {
      id: "RR-1",
      name: "new-svc",
      owner: "taylorvalton",
      requestedBy: "vince",
      requestedTs: "2026.06.18 · 10:00",
      status: "approved",
      verified: true,
      decidedBy: "vince",
      decidedTs: "2026.06.18 · 10:05",
    };
    await upsertRepoRequest(req);
    const call = db.calls[0];
    expect(call.text).toContain("INSERT INTO repo_requests");
    expect(call.text).toContain("ON CONFLICT (id) DO UPDATE");
    expect(call.text).toContain("$14");
    expect(call.text).not.toContain("new-svc");
    expect(call.params[0]).toBe("RR-1");
    expect(call.params[9]).toBe("approved"); // status bound positionally
    expect(call.params[10]).toBe(true); // verified
  });

  it("getRepos maps def_branch -> def and carries the sync columns", async () => {
    db.rows = [
      {
        id: "portal-web",
        name: "plx-customer-portal",
        lang: "TypeScript",
        def_branch: "master",
        owner: "taylorvalton",
        visibility: "private",
        scope: "x",
        sync_state: "pending",
        sp_item_id: null,
      },
    ];
    const repos = await getRepos();
    expect(repos[0].def).toBe("master"); // def_branch column mapped to the Repo.def field
    expect(repos[0].syncState).toBe("pending");
    expect(repos[0].spItemId).toBeNull();
  });
});
