import { z } from "zod";
import { cursorRoute, parseCursorBody } from "@/lib/mcp/route";
import { actionConfirmExisting } from "@/lib/mcp/routing-mutation-actions";
import { taskLink } from "@/lib/mcp/envelope";

const confirmSchema = z.object({
  proposalId: z.string().min(1),
  taskId: z.string().min(1),
  revisionId: z.string().optional(),
  linkType: z.enum(["related", "delivery"]).optional(),
  headSha: z.string().optional(),
  mergeSha: z.string().optional(),
  authorizationTrust: z
    .enum([
      "credentialed_checkout",
      "persisted_decision",
      "author_declaration",
      "routing_correlation",
      "fuzzy",
      "none",
    ])
    .optional(),
  overrideReason: z.string().optional(),
});

export const POST = cursorRoute("mc_confirm_existing", async (req, _ctx, identity, meta) => {
  const body = await parseCursorBody(req, confirmSchema);
  const data = await actionConfirmExisting(identity, body);
  return {
    data,
    meta: {
      links: { ...meta.links, task: taskLink(body.taskId) },
      sync: data.sync,
    },
  };
});
