// Anthropic adapter — org-level daily cost via the Admin API cost report
// (GET /v1/organizations/cost_report). Requires an ADMIN key
// (ANTHROPIC_ADMIN_API_KEY, sk-ant-admin01-…); a standard API key cannot read
// costs, so absence degrades visibly instead of guessing.

import { anthropicAdminApiKey, anthropicAdminConfigured } from "@/lib/secrets";

import type { AdapterObservation, AdapterPullResult, PeriodRange } from "../types";

import { degraded, type VendorAdapter } from "./contract";

const VENDOR_ID = "anthropic";
const API_BASE = "https://api.anthropic.com";
const ANTHROPIC_VERSION = "2023-06-01";

interface CostReportItem {
  currency?: string;
  amount?: string | number;
}

interface CostReportBucket {
  starting_at?: string;
  ending_at?: string;
  results?: CostReportItem[];
}

interface CostReportPage {
  data?: CostReportBucket[];
  has_more?: boolean;
  next_page?: string | null;
}

async function pull(range: PeriodRange): Promise<AdapterPullResult> {
  if (!anthropicAdminConfigured()) {
    return degraded(
      VENDOR_ID,
      "key_missing",
      "ANTHROPIC_ADMIN_API_KEY is not configured — the cost report needs an Admin key (sk-ant-admin01-…), not a standard API key."
    );
  }

  const observations: AdapterObservation[] = [];
  let page: string | null = null;

  try {
    for (let guard = 0; guard < 24; guard++) {
      const url = new URL(`${API_BASE}/v1/organizations/cost_report`);
      url.searchParams.set("starting_at", `${range.start}T00:00:00Z`);
      url.searchParams.set("ending_at", `${range.end}T00:00:00Z`);
      url.searchParams.set("limit", "31");
      if (page) url.searchParams.set("page", page);

      const resp = await fetch(url, {
        headers: {
          "anthropic-version": ANTHROPIC_VERSION,
          "x-api-key": anthropicAdminApiKey(),
        },
      });
      if (resp.status === 401 || resp.status === 403) {
        return degraded(
          VENDOR_ID,
          "unauthorized",
          `Anthropic Admin API rejected the key (HTTP ${resp.status}) — verify ANTHROPIC_ADMIN_API_KEY is an admin-scoped key.`
        );
      }
      if (!resp.ok) {
        return degraded(VENDOR_ID, "http_error", `Anthropic cost report failed: HTTP ${resp.status}.`);
      }

      const body = (await resp.json()) as CostReportPage;
      if (!Array.isArray(body.data)) {
        return degraded(VENDOR_ID, "bad_payload", "Anthropic cost report returned an unexpected shape (no data array).");
      }
      for (const bucket of body.data) {
        if (!bucket.starting_at || !bucket.ending_at) continue;
        // Amounts are decimal strings in cents USD; sum the bucket's line items.
        const cents = (bucket.results ?? []).reduce(
          (sum, item) => sum + Number(item.amount ?? 0),
          0
        );
        observations.push({
          periodStart: bucket.starting_at.slice(0, 10),
          periodEnd: bucket.ending_at.slice(0, 10),
          amountCents: Math.round(cents),
          estimated: false,
        });
      }
      if (!body.has_more || !body.next_page) break;
      page = body.next_page;
    }
    return { ok: true, vendorId: VENDOR_ID, observations };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return degraded(VENDOR_ID, "network_error", `Anthropic Admin API unreachable: ${message}`);
  }
}

export const anthropicAdapter: VendorAdapter = {
  vendorId: VENDOR_ID,
  configured: anthropicAdminConfigured,
  pull,
};
