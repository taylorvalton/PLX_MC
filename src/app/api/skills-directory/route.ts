// GET /api/skills-directory — company skills catalog from plx-cursor-skills.
// Auth-gated by middleware. Read-only: GET only, no writes.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ApiError, route } from "@/lib/api/route";
import {
  createSkillsSource,
  listSkillCatalog,
  parseAllowlistJson,
} from "@/lib/skills-directory";

export const GET = route(async () => {
  const raw = readFileSync(
    join(process.cwd(), "config/company-skills-allowlist.json"),
    "utf8"
  );
  const parsed = parseAllowlistJson(raw);
  if (!parsed.ok) {
    throw new ApiError(
      "invalid_allowlist",
      `Company skills allowlist is invalid: ${parsed.error}`,
      500
    );
  }
  return listSkillCatalog(parsed.config, createSkillsSource());
});
