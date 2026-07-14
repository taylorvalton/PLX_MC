import { z } from "zod";
import { cursorRoute, parseCursorBody } from "@/lib/mcp/route";
import { actionAttachCheckout } from "@/lib/mcp/routing-mutation-actions";
import { taskLink } from "@/lib/mcp/envelope";

const attachSchema = z.object({
  proposalId: z.string().min(1),
  taskId: z.string().min(1),
  checkoutId: z.string().min(1),
  revisionId: z.string().optional(),
  headSha: z.string().optional(),
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
});

export const POST = cursorRoute("mc_attach_checkout", async (req, _ctx, identity, meta) => {
  const body = await parseCursorBody(req, attachSchema);
  const data = await actionAttachCheckout(identity, body);
  return {
    data,
    meta: {
      links: { ...meta.links, task: taskLink(body.taskId) },
      sync: data.sync,
    },
  };
});
