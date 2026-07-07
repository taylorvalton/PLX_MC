// Registry loader/validator for plx-vendor-costs-registry/v1 config objects.
// Pure — accepts a config object or JSON string; no filesystem access here.
// Consumers must import through the barrel (src/lib/vendor-spend/index.ts).

import { z } from "zod";
import type { VendorCostsRegistry } from "./types";

const vendorEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  name: z.string().min(1),
  category: z.string().min(1),
  adapter: z.enum(["aws", "anthropic", "cursor", "manual"]),
  billing: z.enum(["usage", "subscription", "mixed"]),
  console_url: z.string().url().optional(),
  notes: z.string().optional(),
});

const registrySchema = z.object({
  schema_version: z.literal("plx-vendor-costs-registry/v1"),
  vendors: z.array(vendorEntrySchema).min(1),
});

export type VendorRegistryParseResult =
  | { ok: true; registry: VendorCostsRegistry }
  | { ok: false; error: string };

/** Parse and validate a vendor registry object. Never throws. */
export function parseVendorRegistry(raw: unknown): VendorRegistryParseResult {
  const result = registrySchema.safeParse(raw);
  if (!result.success) {
    const msg = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    return { ok: false, error: msg };
  }
  const ids = new Set<string>();
  for (const v of result.data.vendors) {
    if (ids.has(v.id)) {
      return { ok: false, error: `duplicate vendor id "${v.id}"` };
    }
    ids.add(v.id);
  }
  return { ok: true, registry: result.data as VendorCostsRegistry };
}

/** Parse and validate a vendor registry from a JSON string. Never throws. */
export function parseVendorRegistryJson(json: string): VendorRegistryParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "vendor registry JSON is not parseable" };
  }
  return parseVendorRegistry(parsed);
}
