// Bucket-comment persistence invariants (Item 4): the DB accessors' safety
// contract — the replace-thread upsert deletes by bucket (always a WHERE) and
// re-inserts parameterized in array order, and the grouped read maps rows back
// to the Comment shape. The db layer is mocked so the test is hermetic.

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Comment } from "@/lib/mc-data";

const db = vi.hoisted(() => ({ calls: [] as { text: string; params: unknown[] }[], rows: [] as unknown[] }));

vi.mock("@/lib/db", () => ({
  async query(text: string, params: unknown[] = []) {
    db.calls.push({ text, params });
    return db.rows;
  },
  // Run the transaction body with a capturing query, like the real client.
  async withTransaction(fn: (q: (t: string, p?: unknown[]) => Promise<unknown[]>) => Promise<unknown>) {
    const q = async (text: string, params: unknown[] = []) => {
      db.calls.push({ text, params });
      return db.rows;
    };
    return fn(q);
  },
}));

import { bucketCommentsByBucket, replaceBucketComments } from "@/lib/sync/repo";

beforeEach(() => {
  db.calls.length = 0;
  db.rows = [];
});

describe("replaceBucketComments — atomic replace-thread, parameterized", () => {
  it("deletes by bucket (always a WHERE) then re-inserts in array order with position", async () => {
    const comments: Comment[] = [
      { id: "CMT-1", author: "vince", body: "first @greg", ts: "2026.06.18 · 10:00", mentions: ["greg"] },
      { id: "CMT-2", author: "vince", body: "second", ts: "2026.06.18 · 10:01", mentions: [], editedTs: "2026.06.18 · 10:02" },
    ];
    const out = await replaceBucketComments("BKT-WMS", comments);
    expect(out).toEqual(comments);

    expect(db.calls[0].text).toBe("DELETE FROM bucket_comments WHERE bucket_id = $1");
    expect(db.calls[0].params).toEqual(["BKT-WMS"]);

    expect(db.calls[1].text).toContain("INSERT INTO bucket_comments");
    expect(db.calls[1].text).not.toContain("first @greg"); // bound, never interpolated
    expect(db.calls[1].params[0]).toBe("BKT-WMS");
    expect(db.calls[1].params[2]).toBe(0); // position
    expect(db.calls[2].params[2]).toBe(1);
    expect(db.calls[2].params[7]).toBe("2026.06.18 · 10:02"); // edited_ts bound positionally
  });

  it("clearing a thread issues exactly the delete (no inserts)", async () => {
    await replaceBucketComments("BKT-WMS", []);
    expect(db.calls).toHaveLength(1);
    expect(db.calls[0].text).toBe("DELETE FROM bucket_comments WHERE bucket_id = $1");
  });
});

describe("bucketCommentsByBucket — grouped read + row mapping", () => {
  it("groups rows by bucket id and maps mentions/editedTs", async () => {
    db.rows = [
      { bucket_id: "BKT-WMS", id: "CMT-1", author: "vince", body: "a", mentions: ["greg"], ts: "t1", edited_ts: null },
      { bucket_id: "BKT-WMS", id: "CMT-2", author: "vince", body: "b", mentions: [], ts: "t2", edited_ts: "t3" },
      { bucket_id: "BKT-FIN", id: "CMT-9", author: "ross", body: "c", mentions: [], ts: "t4", edited_ts: null },
    ];
    const grouped = await bucketCommentsByBucket();
    expect(grouped["BKT-WMS"]).toHaveLength(2);
    expect(grouped["BKT-WMS"][0].mentions).toEqual(["greg"]);
    expect(grouped["BKT-WMS"][0].editedTs).toBeUndefined();
    expect(grouped["BKT-WMS"][1].editedTs).toBe("t3");
    expect(grouped["BKT-FIN"]).toHaveLength(1);
    expect(grouped["BKT-FIN"][0].author).toBe("ross");
  });
});
