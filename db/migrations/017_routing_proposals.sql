-- Routing proposals control plane — sessions, proposals, revisions, candidates,
-- and decisions. Additive / idempotent only (IF NOT EXISTS / ON CONFLICT;
-- no destructive table operations). Raw PR bodies are never stored.

CREATE TABLE IF NOT EXISTS routing_sessions (
    id                   text PRIMARY KEY
                         CHECK (id LIKE 'rtx_%'),
    repo_id              text NOT NULL,
    actor_id             text NOT NULL,
    actor_kind           text NOT NULL
                         CHECK (actor_kind IN ('human', 'service')),
    base_branch          text NOT NULL,
    source_branch        text NOT NULL,
    head_sha             text,
    status               text NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'consumed', 'expired', 'transferred')),
    created_at           timestamptz NOT NULL DEFAULT now(),
    last_activity_at     timestamptz NOT NULL DEFAULT now(),
    absolute_expires_at  timestamptz NOT NULL,
    idle_expires_at      timestamptz NOT NULL,
    consumed_at          timestamptz,
    consumed_proposal_id text,
    transfer_of          text
);

CREATE INDEX IF NOT EXISTS routing_sessions_repo_actor_idx
    ON routing_sessions (repo_id, actor_id)
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS routing_sessions_expiry_idx
    ON routing_sessions (idle_expires_at, absolute_expires_at)
    WHERE status = 'active';

CREATE TABLE IF NOT EXISTS routing_proposals (
    id                  text PRIMARY KEY,
    repo_id             text NOT NULL,
    change_id           text NOT NULL,
    session_id          text REFERENCES routing_sessions (id),
    state               text NOT NULL DEFAULT 'action_required'
                        CHECK (state IN (
                          'provisional',
                          'action_required',
                          'resolved',
                          'rejected',
                          'expired',
                          'degraded'
                        )),
    failure_reason      text,
    title               text,
    body_content_hash   text,
    markers             jsonb NOT NULL DEFAULT '[]'::jsonb,
    selected_task_id    text,
    selected_bucket_id  text,
    derived_project_id  text,
    resolved_at         timestamptz,
    detail_expires_at   timestamptz,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    UNIQUE (repo_id, change_id)
);

CREATE INDEX IF NOT EXISTS routing_proposals_state_idx
    ON routing_proposals (state, updated_at DESC);

CREATE INDEX IF NOT EXISTS routing_proposals_session_idx
    ON routing_proposals (session_id)
    WHERE session_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS routing_proposal_revisions (
    id              text PRIMARY KEY,
    proposal_id     text NOT NULL REFERENCES routing_proposals (id),
    head_sha        text NOT NULL,
    policy_version  text NOT NULL,
    evidence_meta   jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (proposal_id, head_sha)
);

CREATE INDEX IF NOT EXISTS routing_proposal_revisions_proposal_idx
    ON routing_proposal_revisions (proposal_id, created_at DESC);

CREATE TABLE IF NOT EXISTS routing_revision_candidates (
    id                    text PRIMARY KEY,
    revision_id           text NOT NULL REFERENCES routing_proposal_revisions (id),
    rank                  integer NOT NULL CHECK (rank >= 1),
    task_id               text NOT NULL,
    bucket_id             text NOT NULL,
    project_id            text,
    match_score           numeric NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    authorization_trust   text NOT NULL
                          CHECK (authorization_trust IN (
                            'credentialed_checkout',
                            'persisted_decision',
                            'author_declaration',
                            'routing_correlation',
                            'fuzzy',
                            'none'
                          )),
    reasons               jsonb NOT NULL DEFAULT '[]'::jsonb,
    UNIQUE (revision_id, rank)
);

CREATE INDEX IF NOT EXISTS routing_revision_candidates_revision_idx
    ON routing_revision_candidates (revision_id, rank);

CREATE TABLE IF NOT EXISTS routing_decisions (
    id                 text PRIMARY KEY,
    proposal_id        text NOT NULL REFERENCES routing_proposals (id),
    revision_id        text REFERENCES routing_proposal_revisions (id),
    decision_kind      text NOT NULL
                       CHECK (decision_kind IN (
                         'accept_existing',
                         'reject',
                         'override',
                         'create_task',
                         'transfer'
                       )),
    task_id            text,
    bucket_id          text,
    project_id         text,
    actor_id           text NOT NULL,
    actor_kind         text NOT NULL
                       CHECK (actor_kind IN ('human', 'service')),
    override_reason    text,
    rejection_reason   text,
    policy_version     text NOT NULL,
    created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS routing_decisions_proposal_idx
    ON routing_decisions (proposal_id, created_at DESC);
