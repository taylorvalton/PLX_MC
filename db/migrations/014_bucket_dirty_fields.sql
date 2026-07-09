-- Bucket dirty_fields for Roadmap inbound conflict detection (leftovers Track A3).
-- Mirrors entities.dirty_fields: MC-edited Gantt fields not yet pushed / held for
-- two-sided conflict when SharePoint also changed them.

ALTER TABLE buckets
  ADD COLUMN IF NOT EXISTS dirty_fields jsonb NOT NULL DEFAULT '[]'::jsonb;
