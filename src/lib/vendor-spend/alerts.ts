// Budget alert evaluator. Pure: spend + prorated budget + thresholds → level.
// "none" (no budget) is honest absence, never a fabricated "ok".

import type { AlertLevel } from "./types";

export const DEFAULT_WARN_PCT = 0.8;
export const DEFAULT_CRITICAL_PCT = 0.95;

export function evaluateAlert(
  spendCents: number,
  periodBudgetCents: number | null,
  warnPct: number = DEFAULT_WARN_PCT,
  criticalPct: number = DEFAULT_CRITICAL_PCT
): AlertLevel {
  if (periodBudgetCents === null || periodBudgetCents <= 0) return "none";
  const utilization = spendCents / periodBudgetCents;
  if (utilization > 1) return "over";
  if (utilization >= criticalPct) return "critical";
  if (utilization >= warnPct) return "warn";
  return "ok";
}

/** Utilization fraction (spend / budget), or null without a budget. */
export function utilizationOf(
  spendCents: number,
  periodBudgetCents: number | null
): number | null {
  if (periodBudgetCents === null || periodBudgetCents <= 0) return null;
  return spendCents / periodBudgetCents;
}
