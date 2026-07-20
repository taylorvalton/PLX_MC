// Mirror-is-boring consecutive green cron-tick streak (TASK-495 / AGENTS.md).
// Green tick = dataSource would be live AND freshness.ok after a successful sweep.
// Conflict volume does not reset the streak (warning-only until volume exists).

import {
  ROUTING_REQUIRED_REGISTERS,
  evaluateSyncFreshness,
  type RegisterTimestampLoader,
} from "./freshness";
import {
  getBoringGateRow,
  getRegisterInboundCompletions,
  upsertBoringGateRow,
  type BoringGateRow,
} from "./repo";

export const BORING_GATE_DEFAULT_N = 7;

export type BoringTickOutcome = "green" | "reset";

export interface BoringGateFields {
  boringTickStreak: number;
  boringGateN: number;
  boringGateMet: boolean;
  lastBoringEvalAt: string | null;
  lastBoringOutcome: BoringTickOutcome | null;
  lastBoringResetReason: string | null;
}

export interface BoringTickTransition {
  previousStreak: number;
  streak: number;
  gateMet: boolean;
  outcome: BoringTickOutcome;
  resetReason: string | null;
}

/** Pure streak transition — increment on green, reset to 0 otherwise. */
export function nextBoringStreak(opts: {
  previousStreak: number;
  green: boolean;
  requiredN?: number;
  resetReason?: string | null;
}): BoringTickTransition {
  const requiredN = opts.requiredN ?? BORING_GATE_DEFAULT_N;
  const previousStreak = Math.max(0, opts.previousStreak);
  if (opts.green) {
    const streak = previousStreak + 1;
    return {
      previousStreak,
      streak,
      gateMet: streak >= requiredN,
      outcome: "green",
      resetReason: null,
    };
  }
  return {
    previousStreak,
    streak: 0,
    gateMet: false,
    outcome: "reset",
    resetReason: opts.resetReason ?? "not_live_or_fresh",
  };
}

export function boringGateFieldsFromRow(row: BoringGateRow | null): BoringGateFields {
  if (!row) {
    return {
      boringTickStreak: 0,
      boringGateN: BORING_GATE_DEFAULT_N,
      boringGateMet: false,
      lastBoringEvalAt: null,
      lastBoringOutcome: null,
      lastBoringResetReason: null,
    };
  }
  return {
    boringTickStreak: row.tickStreak,
    boringGateN: row.requiredN,
    boringGateMet: row.gateMet,
    lastBoringEvalAt: row.lastEvalAt,
    lastBoringOutcome: row.lastOutcome,
    lastBoringResetReason: row.lastResetReason,
  };
}

function classifyTick(opts: {
  dataSourceLive: boolean;
  freshnessOk: boolean;
}): { green: boolean; resetReason: string | null } {
  if (!opts.dataSourceLive) {
    return { green: false, resetReason: "data_source_seed" };
  }
  if (!opts.freshnessOk) {
    return { green: false, resetReason: "freshness_stale" };
  }
  return { green: true, resetReason: null };
}

/**
 * Evaluate one cron/sweep tick and persist the streak.
 * Call only after a successful sweep (Graph already proved usable → graphOk=true).
 */
export async function recordBoringTickAfterSweep(opts?: {
  now?: Date;
  graphOk?: boolean;
  requiredN?: number;
  loadRegisterTimestamps?: RegisterTimestampLoader;
  loadRow?: () => Promise<BoringGateRow | null>;
  persistRow?: (row: Omit<BoringGateRow, "updatedAt">) => Promise<BoringGateRow>;
}): Promise<BoringGateFields> {
  const now = opts?.now ?? new Date();
  const graphOk = opts?.graphOk ?? true;
  const loadRow = opts?.loadRow ?? getBoringGateRow;
  const persist = opts?.persistRow ?? upsertBoringGateRow;
  const loadRegisterTimestamps =
    opts?.loadRegisterTimestamps ?? (() => getRegisterInboundCompletions());

  const previous = await loadRow();
  const requiredN = opts?.requiredN ?? previous?.requiredN ?? BORING_GATE_DEFAULT_N;

  const freshness = await evaluateSyncFreshness({
    now,
    requiredRegisters: ROUTING_REQUIRED_REGISTERS,
    loadRegisterTimestamps,
  });
  const anyCompleted = freshness.registers.some((r) => r.lastCompleteInboundAt != null);
  const dataSourceLive = anyCompleted && graphOk;
  const { green, resetReason } = classifyTick({
    dataSourceLive,
    freshnessOk: freshness.ok,
  });
  const next = nextBoringStreak({
    previousStreak: previous?.tickStreak ?? 0,
    green,
    requiredN,
    resetReason,
  });

  const saved = await persist({
    tickStreak: next.streak,
    requiredN,
    gateMet: next.gateMet,
    lastEvalAt: now.toISOString(),
    lastOutcome: next.outcome,
    lastResetReason: next.resetReason,
  });
  return boringGateFieldsFromRow(saved);
}

/** Fail-soft read for self-check (never throws). */
export async function loadBoringGateFieldsSafe(): Promise<BoringGateFields> {
  try {
    return boringGateFieldsFromRow(await getBoringGateRow());
  } catch {
    return boringGateFieldsFromRow(null);
  }
}
