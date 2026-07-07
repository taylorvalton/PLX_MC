// Adapter registry for automated vendor pulls. Each adapter reports its own
// configured() state and NEVER throws from pull() — a missing key, auth
// failure, or bad payload becomes a visible degraded result.

import { anthropicAdapter } from "./anthropic";
import { awsAdapter } from "./aws";
import type { VendorAdapter } from "./contract";
import { cursorAdapter } from "./cursor";

export type { VendorAdapter } from "./contract";

export const vendorAdapters: VendorAdapter[] = [awsAdapter, anthropicAdapter, cursorAdapter];

export function adapterFor(vendorId: string): VendorAdapter | null {
  return vendorAdapters.find((a) => a.vendorId === vendorId) ?? null;
}
