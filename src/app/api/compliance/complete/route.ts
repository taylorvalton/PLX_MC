// POST /api/compliance/complete — done marker.
// Actor = Entra oid from session; never from request body (P8).

import { z } from "zod";
import { parseBody, route } from "@/lib/api/route";
import { complete } from "@/lib/compliance/service";
import { requireSessionActor } from "@/lib/routing/mutations/actors";

const completeSchema = z.object({
  checkoutId: z.string().min(1),
  summary: z.string().min(1),
  commitSha: z.string().optional(),
  prUrl: z.string().url().optional(),
});

export const POST = route(async (req) => {
  const body = await parseBody(req, completeSchema);
  const authorized = await requireSessionActor("task.complete");
  return complete({
    ...body,
    actor: authorized.actor,
  });
});
