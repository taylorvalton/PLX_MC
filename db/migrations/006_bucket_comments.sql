-- Bucket discussion-thread durability (EN-001 / Item 4). Bucket comments were
-- store-authoritative only (a reactive map in src/lib/mc-data/store.ts) and were
-- lost on reload, unlike task comments which persist in the task jsonb blob.
-- Buckets have no entity row, so their threads get a dedicated table.
--
-- App-only: bucket comments are NEVER pushed to SharePoint (the EN-001 decision —
-- comments stay app-only). `position` preserves thread order across the
-- replace-thread upsert (all rows in one transaction share now(), so created_at
-- cannot order them).

CREATE TABLE IF NOT EXISTS bucket_comments (
    bucket_id  text NOT NULL,
    id         text NOT NULL,
    position   integer NOT NULL,
    author     text NOT NULL,
    body       text NOT NULL,
    mentions   jsonb NOT NULL DEFAULT '[]'::jsonb,
    ts         text NOT NULL,
    edited_ts  text,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (bucket_id, id)
);

CREATE INDEX IF NOT EXISTS bucket_comments_bucket_idx ON bucket_comments (bucket_id, position);
