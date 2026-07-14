-- Graph change-notification subscriptions + durable scoped-delta work queue (P11).
-- Additive / idempotent only. No live Graph subscription is required to apply.

CREATE TABLE IF NOT EXISTS graph_subscriptions (
    id                      text PRIMARY KEY,
    list_key                text NOT NULL,
    resource                text NOT NULL,
    notification_url        text NOT NULL,
    expiration_datetime     timestamptz NOT NULL,
    status                  text NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'disabled', 'expired')),
    created_at              timestamptz NOT NULL DEFAULT now(),
    updated_at              timestamptz NOT NULL DEFAULT now(),
    last_renewed_at         timestamptz,
    disabled_at             timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS graph_subscriptions_active_list_key_uidx
    ON graph_subscriptions (list_key)
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS graph_subscriptions_expiration_idx
    ON graph_subscriptions (expiration_datetime)
    WHERE status = 'active';

-- Replay / deduplication keys for Graph notification deliveries.
CREATE TABLE IF NOT EXISTS graph_notification_dedup (
    replay_key       text PRIMARY KEY,
    subscription_id  text NOT NULL,
    list_key         text NOT NULL,
    received_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS graph_notification_dedup_received_idx
    ON graph_notification_dedup (received_at);

-- Durable scoped-delta work queue. Webhook enqueues then returns immediately;
-- /api/cron/sync-notifications drains under the durable sync service principal.
CREATE TABLE IF NOT EXISTS graph_notification_queue (
    id               bigserial PRIMARY KEY,
    replay_key       text NOT NULL UNIQUE,
    subscription_id  text NOT NULL,
    list_key         text NOT NULL,
    resource         text NOT NULL,
    change_type      text,
    status           text NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'processing', 'done', 'failed')),
    attempts         int NOT NULL DEFAULT 0,
    last_error       text,
    enqueued_at      timestamptz NOT NULL DEFAULT now(),
    claimed_at       timestamptz,
    processed_at     timestamptz
);

CREATE INDEX IF NOT EXISTS graph_notification_queue_pending_idx
    ON graph_notification_queue (enqueued_at)
    WHERE status = 'pending';
