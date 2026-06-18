// PATCH /api/buckets/{id}/comments — persist a bucket's discussion thread
// (EN-001 / Item 4). The store mirrors the whole comment array (the same shape
// task comments round-trip through PATCH /api/tasks/{id}); the server replaces
// the thread atomically and returns the stored comments. App-only — bucket
// comments are never pushed to SharePoint.

import { z } from "zod";
import { parseBody, route } from "@/lib/api/route";
import { setBucketComments } from "@/lib/sync";

// Mirrors the task discussion comment shape (api/tasks/[id]/route.ts) — a
// free-form note with a capped body and resolved @mentions.
const commentSchema = z.object({
  id: z.string(),
  author: z.string(),
  body: z.string().min(1).max(5000),
  ts: z.string(),
  mentions: z.array(z.string()).max(50),
  editedTs: z.string().optional(),
});

const patchBucketCommentsSchema = z.object({
  actor: z.string().min(1),
  comments: z.array(commentSchema).max(500),
});

export const PATCH = route(async (req, ctx) => {
  const { id } = await ctx.params;
  const { comments } = await parseBody(req, patchBucketCommentsSchema);
  return setBucketComments(id, comments);
});
