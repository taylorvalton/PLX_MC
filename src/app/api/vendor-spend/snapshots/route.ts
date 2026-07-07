// POST /api/vendor-spend/snapshots — manual cost snapshot entry (the required
// path for vendors without spend APIs). Zod-validated; the entry records who
// entered it. Auth: middleware gate.

import { z } from "zod";

import { ApiError, parseBody, route } from "@/lib/api/route";
import { createSnapshot, loadVendorRegistry } from "@/lib/vendor-spend";

export const dynamic = "force-dynamic";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const snapshotSchema = z
  .object({
    vendorId: z.string().min(1),
    periodStart: z.string().regex(ISO_DATE),
    periodEnd: z.string().regex(ISO_DATE),
    amountCents: z.number().int().min(0),
    enteredBy: z.string().min(1),
    note: z.string().optional(),
  })
  .refine((s) => s.periodEnd > s.periodStart, {
    message: "periodEnd must be after periodStart (end is exclusive)",
  });

export const POST = route(async (req) => {
  const body = await parseBody(req, snapshotSchema);
  const loaded = loadVendorRegistry();
  if (!loaded.ok) {
    throw new ApiError("invalid_registry", loaded.error, 500);
  }
  if (!loaded.registry.vendors.some((v) => v.id === body.vendorId)) {
    throw new ApiError("unknown_vendor", `Vendor "${body.vendorId}" is not in the registry.`, 404);
  }
  return createSnapshot({ ...body, source: "manual" });
});
