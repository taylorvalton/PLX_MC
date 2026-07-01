// GET /api/skills-directory/[id] — one skill rendered from SKILL.md, or a loud
// degraded result. Auth-gated by middleware. Read-only: GET only, no writes.
// Degraded detail is returned in { data: { ok: false, ... } } at 200.
// An unknown allowlist id is a 404.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ApiError, route } from "@/lib/api/route";
import {
  createSkillsSource,
  getSkillDetail,
  parseAllowlistJson,
} from "@/lib/skills-directory";

export const GET = route(async (_req, ctx) => {
  const { id } = await ctx.params;

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

  if (!parsed.config.skills.includes(id)) {
    throw new ApiError("not_found", `No company skill registered with id '${id}'.`, 404);
  }

  return getSkillDetail(parsed.config, createSkillsSource(), id);
});
