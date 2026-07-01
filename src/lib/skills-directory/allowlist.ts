// Parse config/company-skills-allowlist.json into a catalog pointer.

import { z } from "zod";

import type { AllowlistConfig, CatalogPointer } from "./types";

const AllowlistSchema = z.object({
  schemaVersion: z.string(),
  sourceRepo: z.string().min(1),
  sourceBranch: z.string().default("main"),
  manifestPath: z.string().default("manifest.json"),
  packageId: z.string().default(""),
  pinTag: z.string().default(""),
  pinSha: z.string().default(""),
  skills: z.array(z.string()).default([]),
});

export function parseAllowlistJson(raw: string):
  | { ok: true; config: AllowlistConfig }
  | { ok: false; error: string } {
  try {
    const parsed = AllowlistSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return { ok: false, error: parsed.error.message };
    }
    return { ok: true, config: parsed.data as AllowlistConfig };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "invalid JSON",
    };
  }
}

export function pointerFromAllowlist(config: AllowlistConfig): CatalogPointer {
  return {
    sourceRepo: config.sourceRepo,
    sourceBranch: config.sourceBranch,
    manifestPath: config.manifestPath,
    pinTag: config.pinTag,
    pinSha: config.pinSha,
    packageId: config.packageId,
  };
}
