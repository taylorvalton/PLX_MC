// Loop Ledgers domain module barrel.
// All consumers must import through this file — not internal module files.

export type {
  Artifact,
  ArtifactStatus,
  ArtifactType,
  FreshnessConfig,
  FreshnessInfo,
  Freshness,
  HealthCode,
  LedgerRef,
  LedgerSummary,
  LedgerValidationResult,
  QualityLedger,
  RegistryConfig,
  RepoEntry,
  SafetyClass,
  Severity,
  ValidationError,
  ValidatorReasonCode,
} from "./types";

export {
  DEFAULT_FRESHNESS,
  computeFreshness,
  riskRank,
  scariestFirst,
  sortByScariest,
  validateLedgerJson,
  validateLedgerRaw,
} from "./validator";

export type { RegistryParseResult } from "./registry";
export { parseRegistryConfig, parseRegistryJson } from "./registry";
