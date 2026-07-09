-- Rollback for db/migrations/015_vendor_spend.sql. NOT a numbered migration —
-- kept out of db/migrations/ so the migration gate's "one row per numeric
-- prefix" rule is not tripped. Run manually ONLY to undo the vendor-spend
-- tables after 014 was applied. Safe: all three tables were introduced by 014
-- and nothing else references them.

DROP TABLE IF EXISTS vendor_cost_refresh_log;
DROP TABLE IF EXISTS vendor_cost_snapshots;
DROP TABLE IF EXISTS vendor_cost_budgets;
