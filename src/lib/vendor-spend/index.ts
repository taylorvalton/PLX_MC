// Vendor Spend (AI Spend) barrel — the module boundary. Import through here,
// not the internal files (module contract: docs/modules/vendor-spend/README.md).

export type {
  AdapterDegradedReason,
  AdapterObservation,
  AdapterPullResult,
  AlertLevel,
  CostSnapshot,
  PeriodRange,
  RefreshLogEntry,
  RefreshStatus,
  SnapshotSource,
  SpendPeriod,
  VendorAdapterKind,
  VendorBilling,
  VendorBudget,
  VendorCostsRegistry,
  VendorEntry,
  VendorSourceStatus,
  VendorSpendDetail,
  VendorSpendIndex,
  VendorSpendRow,
} from "./types";
export { SPEND_PERIODS } from "./types";

export { parseVendorRegistry, parseVendorRegistryJson } from "./registry";
export type { VendorRegistryParseResult } from "./registry";

export {
  apportionedAmountCents,
  daysInRange,
  overlapDays,
  prorateMonthlyBudget,
  resolvePeriod,
} from "./period";

export {
  DEFAULT_CRITICAL_PCT,
  DEFAULT_WARN_PCT,
  evaluateAlert,
  utilizationOf,
} from "./alerts";

export {
  createSnapshot,
  latestRefreshByVendor,
  listBudgets,
  listRefreshLog,
  listSnapshots,
  logRefresh,
  upsertApiSnapshot,
  upsertBudget,
} from "./store";
export type {
  CreateSnapshotInput,
  LogRefreshInput,
  UpsertBudgetInput,
} from "./store";

export { loadVendorRegistry } from "./loader";
export { buildVendorSpendDetail, buildVendorSpendIndex } from "./loader";
export { refreshAutomatedVendors, refreshVendor } from "./refresh";
export { adapterFor, vendorAdapters } from "./adapters";
export type { VendorAdapter } from "./adapters";
