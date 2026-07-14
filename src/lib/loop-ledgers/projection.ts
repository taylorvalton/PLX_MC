// Projection of quality-ledger artifacts onto MC initiative-board shapes
// (Milestone / Trace) plus the bucket→ledger binding config
// (plx-bucket-ledger-map/v1). Pure — no filesystem or network access here.
// Consumers must import through the barrel (src/lib/loop-ledgers/index.ts).

import { z } from "zod";
import type { Milestone, Trace, TraceRow, TraceStatus } from "@/lib/mc-data";
import type {
  Artifact,
  ArtifactStatus,
  LedgerValidationResult,
  QualityLedger,
} from "./types";
import { sortByScariest } from "./validator";

// ─── Bucket→ledger map config (plx-bucket-ledger-map/v1) ─────────────────────

export interface BucketLedgerBinding {
  bucket: string;
  repo: string;
  module: string;
}

export interface BucketLedgerMapConfig {
  schema_version: "plx-bucket-ledger-map/v1";
  bindings: BucketLedgerBinding[];
}

const bucketLedgerBindingSchema = z.object({
  bucket: z.string().min(1),
  repo: z.string().min(1),
  module: z.string().min(1),
});

const bucketLedgerMapSchema = z.object({
  schema_version: z.literal("plx-bucket-ledger-map/v1"),
  bindings: z.array(bucketLedgerBindingSchema),
});

export type BucketLedgerMapParseResult =
  | { ok: true; config: BucketLedgerMapConfig }
  | { ok: false; error: string };

/**
 * Parse and validate a bucket→ledger map from a JSON string.
 * Returns a typed result — never throws.
 */
export function parseBucketLedgerMapJson(raw: string): BucketLedgerMapParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "bucket-ledger map JSON is not parseable" };
  }
  const result = bucketLedgerMapSchema.safeParse(parsed);
  if (!result.success) {
    const msg = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    return { ok: false, error: msg };
  }
  return { ok: true, config: result.data as BucketLedgerMapConfig };
}

/** All bindings declared for a bucket (pure filter — no dedupe). */
export function bindingsForBucket(
  config: BucketLedgerMapConfig,
  bucketId: string
): BucketLedgerBinding[] {
  return config.bindings.filter((b) => b.bucket === bucketId);
}

// ─── Milestone projection ─────────────────────────────────────────────────────

/** Terminal statuses carry no remaining work — never projected as milestones. */
const TERMINAL_STATUS: ReadonlySet<ArtifactStatus> = new Set([
  "verified",
  "covered",
  "waived",
]);

/** Statuses that (with red safety_class) put a projected milestone at risk. */
const RISK_STATUS: ReadonlySet<ArtifactStatus> = new Set([
  "broken",
  "partially_broken",
  "blocked",
]);

/**
 * Wrap one artifact in a synthetic single-artifact valid result so the
 * canonical riskRank/sortByScariest ranking applies per-artifact without
 * duplicating its logic. Freshness is pinned so only safety/severity and the
 * confidence tiebreak influence order (all artifacts share one generated_at).
 */
function singleArtifactResult(
  ledger: QualityLedger,
  artifact: Artifact
): LedgerValidationResult {
  return {
    valid: true,
    healthCode: "valid",
    ledger: {
      ...ledger,
      summary: {
        total_artifacts: 1,
        by_type: { [artifact.artifact_type]: 1 },
        by_status: { [artifact.status]: 1 },
        by_severity: { [artifact.severity]: 1 },
        by_safety_class: { [artifact.safety_class]: 1 },
      },
      artifacts: [artifact],
    },
    errors: [],
    freshnessInfo: { level: "fresh", ageDays: 0, reason: "projection rank" },
  };
}

/**
 * Project a ledger's open work onto Milestone rows for a bucket: one entry per
 * artifact with a non-empty next_action whose status is not terminal
 * (verified/covered/waived). Sorted scariest-first via the validator ranking.
 */
export function projectMilestones(
  ledger: QualityLedger,
  bucketId: string
): Milestone[] {
  const candidates = ledger.artifacts.filter(
    (a) => Boolean(a.next_action?.trim()) && !TERMINAL_STATUS.has(a.status)
  );
  const sorted = sortByScariest(candidates.map((a) => singleArtifactResult(ledger, a)));
  return sorted.map((result) => {
    // Each synthetic result holds exactly one artifact (see singleArtifactResult).
    const a = (result.ledger as QualityLedger).artifacts[0];
    return {
      id: `LM-${ledger.module}-${a.artifact_id}`,
      bucket: bucketId,
      name: `${a.artifact_id} — ${a.next_action}`,
      // Ledger milestones are list-only, not timeline-positioned.
      col: 0,
      state: a.safety_class === "red" || RISK_STATUS.has(a.status) ? "risk" : "now",
      sp: `Quality Ledger · ${ledger.module}`,
    };
  });
}

// ─── Trace projection ─────────────────────────────────────────────────────────

const STATUS_TO_TRACE: Record<ArtifactStatus, TraceStatus> = {
  verified: "satisfied",
  covered: "satisfied",
  waived: "satisfied",
  fixed_pending_regression: "in-review",
  works_observed: "in-review",
  missing_test: "in-progress",
  deferred: "in-progress",
  broken: "gap",
  partially_broken: "gap",
  blocked: "gap",
  unknown: "gap",
};

/**
 * Project a ledger onto a traceability matrix for a bucket: one TraceRow per
 * artifact. tasks/prs/merge stay empty — the ledger carries no MC linkage.
 */
export function projectTrace(ledger: QualityLedger, bucketId: string): Trace {
  const rows: TraceRow[] = ledger.artifacts.map((a) => ({
    req: a.artifact_id,
    tasks: [],
    prs: [],
    evidence: a.evidence?.length ? "complete" : "incomplete",
    test: a.tests_existing?.[0] ?? "—",
    merge: "—",
    status: STATUS_TO_TRACE[a.status],
  }));
  return { bucket: bucketId, rows };
}
