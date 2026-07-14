// POST /api/sync/conflicts/{id}/resolve — a human picks the winner (§5.1;
// manual resolution only, the choice is audited).
// Actor = Entra oid from session; body.actor is ignored (P4).

import { z } from "zod";
import { ApiError, parseBody, route } from "@/lib/api/route";
import { requireSyncMutateActor, resolveConflict } from "@/lib/sync/engine";

const resolveSchema = z.object({
  winner: z.enum(["mc", "sp"]),
  // Deprecated / ignored — authority is session oid only.
  actor: z.string().min(1).optional(),
});

export const POST = route(async (req, ctx) => {
  const { id } = await ctx.params;
  const { winner } = await parseBody(req, resolveSchema);
  const { oid } = await requireSyncMutateActor();
  const resolved = await resolveConflict(id, winner, oid);
  if (!resolved) throw new ApiError("not_found", `unknown or already-resolved conflict ${id}`, 404);
  return { resolved: true };
});
