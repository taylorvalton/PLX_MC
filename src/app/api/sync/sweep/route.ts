// POST /api/sync/sweep — run an outbound+inbound sweep now (the Sync
// console's "Sync now"); returns new counts (spec §6).
// Actor authority comes from the authenticated Entra session (sync.mutate);
// caller-supplied actor fields are ignored.

import { route } from "@/lib/api/route";
import { requireSyncMutateActor, runSweep } from "@/lib/sync/engine";

export const POST = route(async () => {
  const { oid } = await requireSyncMutateActor();
  return runSweep(oid);
});
