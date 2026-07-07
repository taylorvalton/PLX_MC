// Pure helpers for the AI Spend screen — formatting, tones, and labels.
// No React, no fetching: unit-tested in tests/vendor-spend-ui.test.ts.

import type {
  AlertLevel,
  SpendPeriod,
  VendorSourceStatus,
  VendorSpendIndex,
} from "@/lib/vendor-spend";

// ─── Formatting ───────────────────────────────────────────────────────────────

/** Cents → "$1,234.56" (always two decimals, thousands separators). */
export function fmtMoney(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const rem = String(abs % 100).padStart(2, "0");
  return `${sign}$${dollars.toLocaleString("en-US")}.${rem}`;
}

/** Utilization fraction → whole percent ("87%"); null → em dash. */
export function fmtPct(fraction: number | null): string {
  if (fraction === null) return "—";
  return `${Math.round(fraction * 100)}%`;
}

/** ISO timestamp → short UTC stamp ("Jul 15, 08:20 UTC"). */
export function fmtStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${month} ${d.getUTCDate()}, ${hh}:${mm} UTC`;
}

// ─── Labels / tones ───────────────────────────────────────────────────────────

// Display order for the period filter. Typed against SpendPeriod so domain
// drift fails typecheck; defined here (not imported from the domain barrel)
// because the barrel is server-only — it pulls in node:fs via the loader.
export const PERIOD_ORDER: SpendPeriod[] = ["mtd", "weekly", "quarterly", "ytd"];

export const PERIOD_LABELS: Record<SpendPeriod, string> = {
  mtd: "Month to date",
  weekly: "This week",
  quarterly: "This quarter",
  ytd: "Year to date",
};

export function alertLabel(level: AlertLevel): string {
  switch (level) {
    case "over":
      return "OVER BUDGET";
    case "critical":
      return "CRITICAL";
    case "warn":
      return "WARN";
    case "ok":
      return "ON TRACK";
    case "none":
      return "NO BUDGET";
  }
}

/** Tone class suffix for alert pills. */
export function alertTone(level: AlertLevel): "hot" | "warn" | "ok" | "muted" {
  switch (level) {
    case "over":
    case "critical":
      return "hot";
    case "warn":
      return "warn";
    case "ok":
      return "ok";
    case "none":
      return "muted";
  }
}

export function sourceLabel(status: VendorSourceStatus): string {
  switch (status) {
    case "live":
      return "API · LIVE";
    case "degraded":
      return "API · DEGRADED";
    case "manual":
      return "MANUAL";
  }
}

export function sourceTone(status: VendorSourceStatus): "ok" | "hot" | "muted" {
  switch (status) {
    case "live":
      return "ok";
    case "degraded":
      return "hot";
    case "manual":
      return "muted";
  }
}

// ─── Derived index stats ──────────────────────────────────────────────────────

export interface AttentionSummary {
  /** warn + critical + over — drives the banner and the sidebar badge. */
  alerting: number;
  degraded: number;
}

export function deriveAttention(index: VendorSpendIndex): AttentionSummary {
  return {
    alerting: index.totals.warn + index.totals.critical + index.totals.over,
    degraded: index.rows.filter((r) => r.sourceStatus === "degraded").length,
  };
}

/** Dollar-string input ("1234.56") → cents, or null when unparseable. */
export function parseDollarsToCents(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const [whole, frac = ""] = cleaned.split(".");
  return Number(whole) * 100 + Number(frac.padEnd(2, "0") || 0);
}
