-- Repo registry + self-service request queue (EN-002 / Item 2). The registry
-- (the allow-list) and the request queue were in-memory only and reset on every
-- reload; this persists them so approvals survive. The canonical 3 repos are
-- seeded idempotently by the engine from the REPOS fixture (src/lib/mc-data/
-- data.ts) — kept here as the single source of truth, not duplicated in SQL.
--
-- `repos` carries sync bookkeeping (sync_state / sp_item_id) for the push-only
-- "Repo Registry" SharePoint mirror — Mission Control is authoritative for the
-- allow-list, so the list is a mirror (push), never read back.

CREATE TABLE IF NOT EXISTS repos (
    id           text PRIMARY KEY,
    name         text NOT NULL,
    lang         text NOT NULL DEFAULT '',
    def_branch   text NOT NULL DEFAULT 'main',
    owner        text NOT NULL,
    visibility   text NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private')),
    scope        text NOT NULL DEFAULT '',
    sync_state   text NOT NULL DEFAULT 'pending'
                 CHECK (sync_state IN ('synced', 'pending', 'conflict', 'error')),
    sp_item_id   text,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS repo_requests (
    id           text PRIMARY KEY,
    name         text NOT NULL,
    owner        text NOT NULL,
    lang         text,
    visibility   text CHECK (visibility IS NULL OR visibility IN ('public', 'private')),
    scope        text,
    def_branch   text,
    requested_by text NOT NULL,
    requested_ts text NOT NULL,
    status       text NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'approved', 'rejected')),
    verified     boolean NOT NULL DEFAULT false,
    note         text,
    decided_by   text,
    decided_ts   text,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS repos_sync_state_idx ON repos (sync_state);
CREATE INDEX IF NOT EXISTS repo_requests_status_idx ON repo_requests (status);
