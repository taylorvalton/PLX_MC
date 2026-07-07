// POST /api/vendor-spend/refresh — pull the automated adapters (AWS /
// Anthropic / Cursor) now and persist idempotent api snapshots. Degraded
// vendors come back in the outcomes, never as a thrown error, so the operator
// sees exactly which keys are missing. Auth: middleware gate.

import { z } from "zod";

import { parseBody, route } from "@/lib/api/route";
import { refreshAutomatedVendors } from "@/lib/vendor-spend";

export const dynamic = "force-dynamic";
// Three upstream APIs with pagination can exceed the default serverless budget.
export const maxDuration = 60;

const refreshSchema = z.object({
  period: z.enum(["mtd", "weekly", "quarterly", "ytd"]).optional(),
});

export const POST = route(async (req) => {
  const body = await parseBody(req, refreshSchema);
  const outcomes = await refreshAutomatedVendors(body.period ?? "ytd");
  return { outcomes };
});
