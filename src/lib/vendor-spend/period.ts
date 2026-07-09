// Period math for vendor spend. Pure UTC date arithmetic — no Date-mutation
// surprises, no timezones beyond UTC. All ranges are [start, end) with end
// exclusive, matching the snapshot table's period_start/period_end contract.

import type { PeriodRange, SpendPeriod } from "./types";

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function utc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

/**
 * Resolve a period keyword to a concrete UTC date range containing `now`.
 * - mtd: 1st of the current month → tomorrow
 * - weekly: Monday of the current ISO week → tomorrow
 * - quarterly: 1st of the current quarter → tomorrow
 * - ytd: Jan 1 → tomorrow
 * `end` is exclusive and always tomorrow (UTC) so today's partial data counts.
 */
export function resolvePeriod(period: SpendPeriod, now: Date = new Date()): PeriodRange {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const end = utc(y, m, now.getUTCDate() + 1);

  let start: Date;
  switch (period) {
    case "mtd":
      start = utc(y, m, 1);
      break;
    case "weekly": {
      // getUTCDay(): 0 = Sunday … 6 = Saturday; ISO weeks start Monday.
      const dow = now.getUTCDay();
      const sinceMonday = (dow + 6) % 7;
      start = utc(y, m, now.getUTCDate() - sinceMonday);
      break;
    }
    case "quarterly":
      start = utc(y, Math.floor(m / 3) * 3, 1);
      break;
    case "ytd":
      start = utc(y, 0, 1);
      break;
  }
  return { period, start: isoDate(start), end: isoDate(end) };
}

/** Days in the UTC month containing `date` (an ISO yyyy-mm-dd string). */
function daysInMonthOf(date: string): number {
  const [y, m] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Whole days in [start, end) — both ISO yyyy-mm-dd strings. */
export function daysInRange(start: string, end: string): number {
  const ms = Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`);
  return Math.max(0, Math.round(ms / 86_400_000));
}

/**
 * Prorate a MONTHLY budget onto an arbitrary period range (documented formula,
 * SPEC risk "Period filter vs monthly budget mismatch"): walk each month the
 * range touches and add monthlyBudget × (days of that month inside the range /
 * days in that month). MTD therefore yields exactly the monthly budget, a week
 * spanning a month boundary is split proportionally, and YTD sums full months
 * plus the current month's full budget.
 */
export function prorateMonthlyBudget(monthlyBudgetCents: number, range: PeriodRange): number {
  if (monthlyBudgetCents <= 0) return 0;
  // For calendar-anchored periods the budget covers the WHOLE containing
  // month(s), not just elapsed days — a monthly budget is a monthly cap.
  let cursor = `${range.start.slice(0, 7)}-01`;
  const endMonth = range.end.slice(0, 7);
  let total = 0;
  // Walk months from the start month through the month containing end-1.
  for (let guard = 0; guard < 240; guard++) {
    const month = cursor.slice(0, 7);
    const lastExclusive = nextMonthFirst(cursor);
    const overlapStart = range.start > cursor ? range.start : cursor;
    const overlapEnd = range.end < lastExclusive ? range.end : lastExclusive;
    const overlapDays = daysInRange(overlapStart, overlapEnd);
    if (overlapDays > 0) {
      // mtd/quarterly/ytd start on month firsts, so a partially-elapsed
      // current month still counts as a FULL month of budget (cap semantics);
      // only ranges that genuinely start mid-month (weekly) prorate by days.
      const startsMidMonth = range.start > cursor;
      const endsBeforeMonthEnd = range.end < lastExclusive;
      if (startsMidMonth || (endsBeforeMonthEnd && range.period === "weekly")) {
        total += (monthlyBudgetCents * overlapDays) / daysInMonthOf(cursor);
      } else {
        total += monthlyBudgetCents;
      }
    }
    if (month >= endMonth || lastExclusive >= range.end) break;
    cursor = lastExclusive;
  }
  return Math.round(total);
}

function nextMonthFirst(isoFirst: string): string {
  const [y, m] = isoFirst.split("-").map(Number);
  return new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10);
}

/**
 * Overlap in days between a snapshot's [periodStart, periodEnd) and a period
 * range — used to apportion multi-day (e.g. monthly invoice) snapshots onto
 * the requested view window.
 */
export function overlapDays(
  snapStart: string,
  snapEnd: string,
  range: PeriodRange
): number {
  const start = snapStart > range.start ? snapStart : range.start;
  const end = snapEnd < range.end ? snapEnd : range.end;
  return end > start ? daysInRange(start, end) : 0;
}

/**
 * The portion of a snapshot's amount that falls inside `range`, apportioned
 * linearly by day. Daily API snapshots are either fully in or fully out;
 * manual invoice snapshots spanning a boundary contribute proportionally.
 */
export function apportionedAmountCents(
  snap: { periodStart: string; periodEnd: string; amountCents: number },
  range: PeriodRange
): number {
  const total = daysInRange(snap.periodStart, snap.periodEnd);
  if (total <= 0) return 0;
  const overlap = overlapDays(snap.periodStart, snap.periodEnd, range);
  if (overlap <= 0) return 0;
  if (overlap >= total) return snap.amountCents;
  return Math.round((snap.amountCents * overlap) / total);
}
