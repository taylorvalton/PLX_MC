// Initiative lookup resolution (leftovers Track A1) — pure planning against
// injectable bucket rows; no Graph.

import { describe, expect, it } from "vitest";
import { resolveInitiativeLookupId } from "@/lib/sync/engine";
import type { BucketWithSync } from "@/lib/sync/repo";

const row = (id: string, spItemId: string | null): BucketWithSync => ({
  bucket: {
    id,
    name: id,
    owner: "vince",
    health: "track",
    target: "—",
    started: "2026.06.11",
    desc: "",
    repos: [],
    sync: { state: spItemId ? "synced" : "pending", ts: "—", sp: "—" },
    prd: null,
  },
  syncState: spItemId ? "synced" : "pending",
  spItemId,
  dirtyFields: [],
});

describe("resolveInitiativeLookupId", () => {
  it("clears when the task has no bucket", async () => {
    expect(await resolveInitiativeLookupId({ bucket: "" }, async () => [])).toEqual({
      initiativeLookupId: null,
    });
  });

  it("returns the Roadmap item id when the bucket is mirrored", async () => {
    expect(
      await resolveInitiativeLookupId({ bucket: "BKT-INFRA" }, async () => [row("BKT-INFRA", "57")])
    ).toEqual({ initiativeLookupId: 57 });
  });

  it("marks unresolved when the bucket has no sp_item_id yet", async () => {
    expect(
      await resolveInitiativeLookupId({ bucket: "BKT-INFRA" }, async () => [row("BKT-INFRA", null)])
    ).toEqual({ unresolvedBucket: "BKT-INFRA" });
  });
});
