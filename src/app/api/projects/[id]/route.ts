// PATCH /api/projects/{id} — edit a project (P2): owner, health, target,
// started, description, attached repos (allow-list-clamped), PRD link.
// Persisted in the plx_mc DB; the Projects SharePoint mirror is a later increment.

import { z } from "zod";
import { ApiError, parseBody, route } from "@/lib/api/route";
import { patchProject } from "@/lib/sync";

const patchProjectSchema = z.object({
  actor: z.string().min(1),
  name: z.string().min(1).optional(),
  owner: z.string().min(1).optional(),
  health: z.enum(["track", "risk", "off"]).optional(),
  target: z.string().optional(),
  started: z.string().optional(),
  desc: z.string().optional(),
  repos: z.array(z.string()).optional(),
  prd: z.string().nullable().optional(),
});

export const PATCH = route(async (req, ctx) => {
  const { id } = await ctx.params;
  const { actor, ...patch } = await parseBody(req, patchProjectSchema);
  const project = await patchProject(id, patch, actor);
  if (!project) throw new ApiError("not_found", `unknown project ${id}`, 404);
  return project;
});
