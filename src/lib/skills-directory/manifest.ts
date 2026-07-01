// Validate plx-cursor-skills manifest.json payloads.

import { z } from "zod";

import type { SkillsManifest } from "./types";

const SkillEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  status: z.string(),
  contentPath: z.string().min(1),
  tags: z.array(z.string()).optional(),
  owner: z.string().optional(),
});

const ManifestSchema = z.object({
  schemaVersion: z.string(),
  version: z.string(),
  publishedAt: z.string(),
  gitRef: z.string(),
  repo: z.string(),
  defaultBranch: z.string().default("main"),
  packages: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        skillIds: z.array(z.string()),
      })
    )
    .default([]),
  skills: z.array(SkillEntrySchema).min(1),
});

export function parseManifestJson(raw: string):
  | { ok: true; manifest: SkillsManifest }
  | { ok: false; error: string } {
  try {
    const parsed = ManifestSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return { ok: false, error: parsed.error.message };
    }
    return { ok: true, manifest: parsed.data as SkillsManifest };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "invalid JSON",
    };
  }
}

export function publishedSkills(
  manifest: SkillsManifest,
  packageId: string,
  allowIds: Set<string>
): SkillsManifest["skills"] {
  let ids: string[] | null = null;
  if (packageId) {
    const pkg = manifest.packages.find((p) => p.id === packageId);
    if (pkg) ids = pkg.skillIds.filter((id) => allowIds.has(id));
  }
  const pool = manifest.skills.filter(
    (s) => s.status === "published" && allowIds.has(s.id)
  );
  if (!ids) return pool;
  const byId = new Map(pool.map((s) => [s.id, s]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as SkillsManifest["skills"];
}
