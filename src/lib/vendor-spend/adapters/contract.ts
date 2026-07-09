// Adapter contract + shared degraded-result helper. Separate from the
// adapters/ barrel so individual adapters can import it without a cycle.

import type { AdapterDegradedReason, AdapterPullResult, PeriodRange } from "../types";

export interface VendorAdapter {
  vendorId: string;
  /** Presence check only — never reads secret values into results. */
  configured(): boolean;
  /** Pull cost observations covering `range`. Never throws. */
  pull(range: PeriodRange): Promise<AdapterPullResult>;
}

export function degraded(
  vendorId: string,
  reason: AdapterDegradedReason,
  note: string
): AdapterPullResult {
  return { ok: false, vendorId, reason, note };
}
