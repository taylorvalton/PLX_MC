// POST /api/sync/errors/{id}/retry — retry a rejected outbound write; the
// mapping layer's normalization (§5.2) makes the retry succeed.
// Actor = Entra oid from session; body.actor is ignored (P4).

import { z } from "zod";
import { ApiError, parseBody, route } from "@/lib/api/route";
import { requireSyncMutateActor, retryError } from "@/lib/sync/engine";

const retrySchema = z.object({
  // Deprecated / ignored — authority is session oid only.
  actor: z.string().min(1).optional(),
});

export const POST = route(async (req, ctx) => {
  const { id } = await ctx.params;
  await parseBody(req, retrySchema);
  const { oid } = await requireSyncMutateActor();
  const retried = await retryError(id, oid);
  if (!retried) throw new ApiError("not_found", `unknown error ${id} or retry rejected`, 404);
  return { retried: true };
});
