// Canonical per-register sync freshness for routing (SPEC P4).
// Fail-closed: routing mutations must see a complete successful inbound delta
// for every required register within SYNC_FRESHNESS_MAX_AGE_MS — never infer
// freshness from max(delta_links.updated_at) alone (that only proves a sweep
// touched the cursor, not that required registers completed inbound).

export const SYNC_FRESHNESS_MAX_AGE_MS = 360_000;

/** Registers routing requires before suggest/confirm/create. */
export const ROUTING_REQUIRED_REGISTERS = ["projects", "roadmap", "todos"] as const;

export type RoutingRequiredRegister = (typeof ROUTING_REQUIRED_REGISTERS)[number];

export type RegisterFreshnessReason =
  | "fresh"
  | "missing_register"
  | "stale_register";

export interface RegisterFreshness {
  listKey: string;
  lastCompleteInboundAt: string | null;
  ageMs: number | null;
  ok: boolean;
  reason: RegisterFreshnessReason;
}

export interface SyncFreshnessResult {
  ok: boolean;
  code: "ok" | "sync_stale";
  maxAgeMs: number;
  checkedAt: string;
  registers: RegisterFreshness[];
  reasons: string[];
}

export type RegisterTimestampLoader = () => Promise<
  Partial<Record<string, Date | string | null | undefined>>
>;

function toDate(value: Date | string | null | undefined): Date | null {
  if (value == null) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Evaluate freshness for the required registers. Pure over an injectable
 * timestamp loader so unit tests need no DB / Graph.
 */
export async function evaluateSyncFreshness(opts: {
  now?: Date;
  requiredRegisters?: readonly string[];
  maxAgeMs?: number;
  loadRegisterTimestamps: RegisterTimestampLoader;
}): Promise<SyncFreshnessResult> {
  const now = opts.now ?? new Date();
  const maxAgeMs = opts.maxAgeMs ?? SYNC_FRESHNESS_MAX_AGE_MS;
  const required = opts.requiredRegisters ?? ROUTING_REQUIRED_REGISTERS;
  const stamps = await opts.loadRegisterTimestamps();
  const registers: RegisterFreshness[] = [];
  const reasons: string[] = [];

  for (const listKey of required) {
    const completed = toDate(stamps[listKey]);
    if (!completed) {
      registers.push({
        listKey,
        lastCompleteInboundAt: null,
        ageMs: null,
        ok: false,
        reason: "missing_register",
      });
      reasons.push(`missing_register:${listKey}`);
      continue;
    }
    const ageMs = Math.max(0, now.getTime() - completed.getTime());
    if (ageMs > maxAgeMs) {
      registers.push({
        listKey,
        lastCompleteInboundAt: completed.toISOString(),
        ageMs,
        ok: false,
        reason: "stale_register",
      });
      reasons.push(`stale_register:${listKey}`);
      continue;
    }
    registers.push({
      listKey,
      lastCompleteInboundAt: completed.toISOString(),
      ageMs,
      ok: true,
      reason: "fresh",
    });
  }

  const ok = registers.every((r) => r.ok);
  return {
    ok,
    code: ok ? "ok" : "sync_stale",
    maxAgeMs,
    checkedAt: now.toISOString(),
    registers,
    reasons,
  };
}

/** Convenience: throw-shaped check used by routing callers (P3/P8). */
export function assertFreshOrThrow(result: SyncFreshnessResult): void {
  if (result.ok) return;
  const detail = result.reasons.join("; ") || "one or more required registers are stale or missing";
  const err = new Error(`sync_stale: ${detail}`);
  (err as Error & { code: string }).code = "sync_stale";
  throw err;
}
