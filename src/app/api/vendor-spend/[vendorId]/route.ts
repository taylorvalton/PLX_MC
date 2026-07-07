// GET /api/vendor-spend/[vendorId]?period= — one vendor's detail: overview
// row + snapshot history + refresh audit log. Auth: middleware gate.

import { ApiError, route } from "@/lib/api/route";
import { buildVendorSpendDetail } from "@/lib/vendor-spend";

import { parsePeriodParam } from "../params";

export const dynamic = "force-dynamic";

export const GET = route(async (req, ctx) => {
  const { vendorId } = await ctx.params;
  const detail = await buildVendorSpendDetail(vendorId, parsePeriodParam(req.url));
  if (!detail) {
    throw new ApiError("unknown_vendor", `Vendor "${vendorId}" is not in the registry.`, 404);
  }
  return detail;
});
