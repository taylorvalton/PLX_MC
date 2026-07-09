-- Vendor Spend (AI Spend) — budgets, cost snapshots, refresh audit log.
-- Registry (vendor list) stays in config/vendor-costs-registry.json; these
-- tables hold only observed costs, operator budgets, and refresh outcomes.

CREATE TABLE IF NOT EXISTS vendor_cost_budgets (
    vendor_id            text PRIMARY KEY,
    monthly_budget_cents bigint NOT NULL CHECK (monthly_budget_cents >= 0),
    warn_pct             numeric(4,3) NOT NULL DEFAULT 0.800
                         CHECK (warn_pct > 0 AND warn_pct <= 1),
    critical_pct         numeric(4,3) NOT NULL DEFAULT 0.950
                         CHECK (critical_pct > 0 AND critical_pct <= 1),
    updated_by           text NOT NULL,
    updated_at           timestamptz NOT NULL DEFAULT now(),
    CHECK (critical_pct >= warn_pct)
);

CREATE TABLE IF NOT EXISTS vendor_cost_snapshots (
    id            text PRIMARY KEY,
    vendor_id     text NOT NULL,
    -- Cost window [period_start, period_end), end exclusive. API adapters
    -- write daily rows; manual entries may span any range (e.g. an invoice).
    period_start  date NOT NULL,
    period_end    date NOT NULL,
    amount_cents  bigint NOT NULL CHECK (amount_cents >= 0),
    currency      text NOT NULL DEFAULT 'USD',
    source        text NOT NULL CHECK (source IN ('api', 'manual')),
    estimated     boolean NOT NULL DEFAULT false,
    entered_by    text,
    note          text,
    created_at    timestamptz NOT NULL DEFAULT now(),
    CHECK (period_end > period_start)
);

-- One api-sourced row per vendor per day so re-pulls upsert instead of
-- double-counting (store.upsertDailySnapshot's ON CONFLICT target).
CREATE UNIQUE INDEX IF NOT EXISTS vendor_cost_snapshots_api_daily_idx
    ON vendor_cost_snapshots (vendor_id, period_start)
    WHERE source = 'api';

CREATE INDEX IF NOT EXISTS vendor_cost_snapshots_vendor_range_idx
    ON vendor_cost_snapshots (vendor_id, period_start, period_end);

CREATE TABLE IF NOT EXISTS vendor_cost_refresh_log (
    id             text PRIMARY KEY,
    vendor_id      text NOT NULL,
    status         text NOT NULL CHECK (status IN ('ok', 'degraded', 'error')),
    message        text,
    snapshot_count integer NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vendor_cost_refresh_log_vendor_idx
    ON vendor_cost_refresh_log (vendor_id, created_at DESC);
