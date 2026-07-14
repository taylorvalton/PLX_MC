-- Sync authority + bounded freshness (P4). Additive / idempotent only.
-- Per-register complete successful inbound timestamps (not delta_links.updated_at),
-- per-field dirty source attribution for human-over-service precedence, and
-- dirty_fields on projects so inbound Project adoption can conflict like buckets.

CREATE TABLE IF NOT EXISTS sync_register_freshness (
    list_key                 text PRIMARY KEY,
    last_complete_inbound_at timestamptz NOT NULL,
    updated_at               timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE entities
    ADD COLUMN IF NOT EXISTS field_attribution jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE buckets
    ADD COLUMN IF NOT EXISTS field_attribution jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS dirty_fields jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS field_attribution jsonb NOT NULL DEFAULT '{}'::jsonb;
