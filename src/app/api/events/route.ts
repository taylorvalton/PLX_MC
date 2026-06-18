// GET /api/events?after=<seq>&limit=<n> — the append-only event log export
// (EN-007 decision 13, the Second-Brain feed). Keyset pagination on the
// monotonic `seq`; the canonical record substrate, retrieval/embedding-ready.

import { route } from "@/lib/api/route";
import { listEvents } from "@/lib/compliance/service";

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const after = Number(url.searchParams.get("after") ?? "0");
  const limit = Number(url.searchParams.get("limit") ?? "100");
  const events = await listEvents(
    Number.isFinite(after) ? after : 0,
    Math.min(Number.isFinite(limit) ? limit : 100, 500)
  );
  return { events };
});
