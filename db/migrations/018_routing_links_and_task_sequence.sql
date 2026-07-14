-- Routing work links, creation-intent idempotency, and global Task ID sequence.
-- Additive / idempotent only. Sequence reconciliation never moves backwards.

CREATE TABLE IF NOT EXISTS routing_work_links (
    id           text PRIMARY KEY,
    proposal_id  text REFERENCES routing_proposals (id),
    task_id      text NOT NULL,
    link_type    text NOT NULL
                 CHECK (link_type IN ('related', 'delivery')),
    repo_id      text NOT NULL,
    change_id    text NOT NULL,
    head_sha     text,
    merge_sha    text,
    evidence     jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_by   text NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT routing_work_links_replay_key
      UNIQUE NULLS NOT DISTINCT (
        task_id,
        link_type,
        repo_id,
        change_id,
        head_sha,
        merge_sha
      )
);

CREATE INDEX IF NOT EXISTS routing_work_links_task_idx
    ON routing_work_links (task_id, created_at DESC);

CREATE INDEX IF NOT EXISTS routing_work_links_change_idx
    ON routing_work_links (repo_id, change_id);

CREATE TABLE IF NOT EXISTS routing_creation_intents (
    id                     text PRIMARY KEY,
    proposal_id            text NOT NULL REFERENCES routing_proposals (id),
    creation_intent_hash   text NOT NULL,
    task_id                text NOT NULL,
    created_at             timestamptz NOT NULL DEFAULT now(),
    UNIQUE (proposal_id, creation_intent_hash)
);

CREATE INDEX IF NOT EXISTS routing_creation_intents_proposal_idx
    ON routing_creation_intents (proposal_id);

-- Global Task ID allocator for confirmed creation (P8). Initialize / reconcile
-- above existing numeric TASK-* rows in entities without ever decreasing.
CREATE SEQUENCE IF NOT EXISTS mc_task_id_seq;

DO $$
DECLARE
  max_task bigint := 0;
  cur_last bigint := 0;
  cur_called boolean := false;
  cur_position bigint := 0;
  target bigint;
BEGIN
  SELECT COALESCE(
    MAX(CAST(substring(id FROM 'TASK-([0-9]+)') AS bigint)),
    0
  )
    INTO max_task
    FROM entities
   WHERE entity_type = 'task'
     AND id ~ '^TASK-[0-9]+$';

  SELECT COALESCE(last_value, 0), is_called
    INTO cur_last, cur_called
    FROM mc_task_id_seq;

  -- A newly-created sequence reports last_value=1, is_called=false. Its
  -- effective allocated position is zero, so an empty database must receive
  -- TASK-1 rather than skipping directly to TASK-2.
  cur_position := CASE WHEN cur_called THEN cur_last ELSE cur_last - 1 END;
  target := GREATEST(max_task, cur_position, 0);

  IF target = 0 THEN
    PERFORM setval('mc_task_id_seq', 1, false);
  ELSE
    -- is_called=true ⇒ next nextval() returns target + 1. GREATEST above
    -- ensures reconciliation never moves behind Tasks or prior allocations.
    PERFORM setval('mc_task_id_seq', target, true);
  END IF;
END
$$;
