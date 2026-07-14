// GET /api/cron/sync-subscriptions — renew Graph subscriptions nearing expiry.
// Outer admission: CRON_SECRET bearer. Writes: durable sp_sync_inbound +
// sync.service.write. Never creates a live Graph subscription during acceptance
// (allowLiveGraph defaults false). Five-minute delta sweep remains recovery.

import { ApiError, route } from "@/lib/api/route";
import {
  cronConfigured,
  cronSecret,
  graphWebhookConfigured,
  graphWebhookEnabled,
} from "@/lib/secrets";
import { requireSyncServiceWrite } from "@/lib/sync/engine";
import { renewExpiringSubscriptions } from "@/lib/sync/subscriptions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const GET = route(async (req) => {
  if (!cronConfigured()) {
    throw new ApiError("cron_disabled", "Scheduled subscription renewal is not configured (CRON_SECRET unset).", 503);
  }
  if (req.headers.get("authorization") !== `Bearer ${cronSecret()}`) {
    throw new ApiError("unauthorized", "Invalid or missing cron authorization.", 401);
  }
  const service = await requireSyncServiceWrite();
  if (!graphWebhookEnabled() || !graphWebhookConfigured()) {
    return {
      actorId: service.id,
      enabled: false,
      renewed: 0,
      skipped: 0,
    };
  }
  const result = await renewExpiringSubscriptions({ allowLiveGraph: false });
  console.log(
    `[sync] subscription renewal ok — actor=${service.id} renewed=${result.renewed}`
  );
  return {
    actorId: service.id,
    enabled: true,
    renewed: result.renewed,
    skipped: result.skipped,
  };
});
