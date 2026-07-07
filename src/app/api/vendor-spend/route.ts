// GET /api/vendor-spend?period=mtd|weekly|quarterly|ytd — the vendor spend
// overview: every registry vendor with period spend, budget utilization,
// alert level, and honest adapter health. Auth: middleware gate.

import { route } from "@/lib/api/route";
import { buildVendorSpendIndex } from "@/lib/vendor-spend";

import { parsePeriodParam } from "./params";

export const dynamic = "force-dynamic";

export const GET = route(async (req) => {
  return buildVendorSpendIndex(parsePeriodParam(req.url));
});
