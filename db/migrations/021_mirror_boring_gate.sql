-- Mirror-is-boring N-tick streak (TASK-495). Singleton row tracks consecutive
-- green cron/sweep ticks where self-check would report dataSource=live AND
-- freshness.ok. Additive / idempotent only.

CREATE TABLE IF NOT EXISTS sync_boring_gate (
    id                 smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    tick_streak        integer NOT NULL DEFAULT 0 CHECK (tick_streak >= 0),
    required_n         integer NOT NULL DEFAULT 7 CHECK (required_n >= 1),
    gate_met           boolean NOT NULL DEFAULT false,
    last_eval_at       timestamptz,
    last_outcome       text CHECK (last_outcome IS NULL OR last_outcome IN ('green', 'reset')),
    last_reset_reason  text,
    updated_at         timestamptz NOT NULL DEFAULT now()
);

INSERT INTO sync_boring_gate (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
