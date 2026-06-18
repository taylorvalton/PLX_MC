// POST /api/repos/requests — persist a self-service repo request (EN-002 /
// Item 2). The client mirrors the full request through here on create, after
// GitHub-org validation reconciles `verified`, and on approve/reject — an
// idempotent upsert so the request queue survives a reload.

import { z } from "zod";
import { parseBody, route } from "@/lib/api/route";
import { upsertRepoRequest } from "@/lib/sync/repo";

const repoRequestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  owner: z.string().min(1),
  lang: z.string().optional(),
  visibility: z.enum(["public", "private"]).optional(),
  scope: z.string().optional(),
  def: z.string().optional(),
  requestedBy: z.string().min(1),
  requestedTs: z.string().min(1),
  status: z.enum(["pending", "approved", "rejected"]),
  verified: z.boolean(),
  note: z.string().optional(),
  decidedBy: z.string().optional(),
  decidedTs: z.string().optional(),
});

export const POST = route(async (req) => {
  const request = await parseBody(req, repoRequestSchema);
  await upsertRepoRequest(request);
  return request;
});
