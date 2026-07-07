// Cursor adapter — team spend for the CURRENT billing cycle via the Admin API
// (POST /teams/spend, Basic auth with the admin key as username). Enterprise
// only. The API reports usage for the running cycle, so the observation is
// always flagged estimated ("usage-reported", not invoice-final) and keys on
// the cycle start so refreshes upsert in place.

import { cursorAdminApiKey, cursorAdminConfigured } from "@/lib/secrets";

import type { AdapterPullResult, PeriodRange } from "../types";

import { degraded, type VendorAdapter } from "./contract";

const VENDOR_ID = "cursor";
const API_BASE = "https://api.cursor.com";
const PAGE_SIZE = 100;

interface TeamMemberSpend {
  spendCents?: number;
  includedSpendCents?: number;
  overallSpendCents?: number;
}

interface SpendPage {
  teamMemberSpend?: TeamMemberSpend[];
  subscriptionCycleStart?: number;
  totalMembers?: number;
  totalPages?: number;
}

function memberCents(m: TeamMemberSpend): number {
  // Prefer the documented total; fall back to on-demand + included pools
  // (the response schema varies by team billing configuration).
  if (typeof m.overallSpendCents === "number") return m.overallSpendCents;
  return (m.spendCents ?? 0) + (m.includedSpendCents ?? 0);
}

async function pull(_range: PeriodRange): Promise<AdapterPullResult> {
  if (!cursorAdminConfigured()) {
    return degraded(
      VENDOR_ID,
      "key_missing",
      "CURSOR_ADMIN_API_KEY is not configured — team spend needs an Enterprise Admin API key."
    );
  }

  const auth = `Basic ${Buffer.from(`${cursorAdminApiKey()}:`).toString("base64")}`;
  let totalCents = 0;
  let cycleStartMs: number | undefined;

  try {
    for (let pageNo = 1; pageNo <= 50; pageNo++) {
      const resp = await fetch(`${API_BASE}/teams/spend`, {
        method: "POST",
        headers: { authorization: auth, "content-type": "application/json" },
        body: JSON.stringify({ page: pageNo, pageSize: PAGE_SIZE }),
      });
      if (resp.status === 401 || resp.status === 403) {
        return degraded(
          VENDOR_ID,
          "unauthorized",
          `Cursor Admin API rejected the key (HTTP ${resp.status}) — verify CURSOR_ADMIN_API_KEY is a team admin key on an Enterprise plan.`
        );
      }
      if (!resp.ok) {
        return degraded(VENDOR_ID, "http_error", `Cursor /teams/spend failed: HTTP ${resp.status}.`);
      }

      const body = (await resp.json()) as SpendPage;
      const members = body.teamMemberSpend;
      if (!Array.isArray(members)) {
        return degraded(VENDOR_ID, "bad_payload", "Cursor /teams/spend returned an unexpected shape (no teamMemberSpend array).");
      }
      cycleStartMs = cycleStartMs ?? body.subscriptionCycleStart;
      totalCents += members.reduce((sum, m) => sum + memberCents(m), 0);

      const totalPages = body.totalPages ?? (members.length < PAGE_SIZE ? pageNo : pageNo + 1);
      if (pageNo >= totalPages || members.length === 0) break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return degraded(VENDOR_ID, "network_error", `Cursor Admin API unreachable: ${message}`);
  }

  // The cycle window: [subscription cycle start, tomorrow). Without a cycle
  // start in the payload, fall back to the current month.
  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1))
    .toISOString()
    .slice(0, 10);
  const start = cycleStartMs
    ? new Date(cycleStartMs).toISOString().slice(0, 10)
    : `${end.slice(0, 7)}-01`;

  return {
    ok: true,
    vendorId: VENDOR_ID,
    observations: [
      { periodStart: start, periodEnd: end, amountCents: Math.round(totalCents), estimated: true },
    ],
  };
}

export const cursorAdapter: VendorAdapter = {
  vendorId: VENDOR_ID,
  configured: cursorAdminConfigured,
  pull,
};
