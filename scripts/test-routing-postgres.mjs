#!/usr/bin/env node
// Disposable Docker Postgres harness for routing migrations 017/018 (+ later).
// Starts its own container on a collision-safe port/name, applies numbered
// migrations through --through NNN, runs optional schema/idempotency/sequence
// assertions, and ALWAYS removes the container in finally.
//
// Refuses configured staging/production URLs. Never uses PLX_MC_DATABASE_URL
// for the test database (unless ROUTING_TEST_FORCE_ENV_URL=1, which is only
// used by contract tests to prove refusal).
//
// Usage:
//   node scripts/test-routing-postgres.mjs --through 018
//   node scripts/test-routing-postgres.mjs --through 018 --schema --idempotency --sequence
//   node scripts/test-routing-postgres.mjs --through 018 --concurrency
//
// Exit 0 on success; non-zero on failure. Dependencies unchanged (uses `pg`).

import { randomBytes } from "node:crypto";
import { createServer } from "node:net";
import { readdir, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { Client } from "pg";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS_DIR = path.join(ROOT, "db", "migrations");
const NAME_RE = /^(\d{3})_[a-z0-9_]+\.sql$/;
const WAIT_TIMEOUT_MS = 60_000;
const WAIT_POLL_MS = 500;

const FORBIDDEN_URL_PATTERNS = [
  /plx-postgres-staging/i,
  /plx-postgres-uat/i,
  /plx-postgres-prod/i,
  /staging/i,
  /production/i,
  /\.rds\.amazonaws\.com/i,
  /missioncontrol/i,
];

function parseArgs(argv) {
  const out = {
    through: null,
    schema: false,
    idempotency: false,
    sequence: false,
    concurrency: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--through") {
      out.through = String(argv[++i] ?? "").padStart(3, "0");
    } else if (arg === "--schema") out.schema = true;
    else if (arg === "--idempotency") out.idempotency = true;
    else if (arg === "--sequence") out.sequence = true;
    else if (arg === "--concurrency") out.concurrency = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: node scripts/test-routing-postgres.mjs --through NNN [--schema] [--idempotency] [--sequence] [--concurrency]`);
      process.exit(0);
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (!out.through || !/^\d{3}$/.test(out.through)) {
    throw new Error("--through NNN is required (e.g. --through 018)");
  }
  // Default: run all core assertion groups when none specified.
  if (!out.schema && !out.idempotency && !out.sequence && !out.concurrency) {
    out.schema = true;
    out.idempotency = true;
    out.sequence = true;
  }
  return out;
}

function refuseConfiguredUrls() {
  const url = process.env.PLX_MC_DATABASE_URL ?? "";
  const force = process.env.ROUTING_TEST_FORCE_ENV_URL === "1";
  if (!force) {
    // Normal path: ignore env URL entirely; we only talk to the container.
    return;
  }
  if (!url) {
    console.error("ROUTING_TEST_FORCE_ENV_URL set but PLX_MC_DATABASE_URL empty — refusing.");
    process.exit(2);
  }
  for (const re of FORBIDDEN_URL_PATTERNS) {
    if (re.test(url)) {
      console.error(`Refusing forbidden staging/production database URL (matched ${re}).`);
      process.exit(2);
    }
  }
  console.error("Refusing to use configured PLX_MC_DATABASE_URL in routing harness.");
  process.exit(2);
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      server.close((err) => (err ? reject(err) : resolve(port)));
    });
    server.on("error", reject);
  });
}

function docker(args, opts = {}) {
  return spawnSync("docker", args, {
    encoding: "utf8",
    ...opts,
  });
}

async function waitForPostgres(url, timeoutMs) {
  const started = Date.now();
  let lastErr = null;
  while (Date.now() - started < timeoutMs) {
    const client = new Client({ connectionString: url });
    try {
      await client.connect();
      await client.query("SELECT 1");
      await client.end();
      return;
    } catch (err) {
      lastErr = err;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
      await delay(WAIT_POLL_MS);
    }
  }
  throw new Error(`Postgres not ready within ${timeoutMs}ms: ${lastErr?.message ?? lastErr}`);
}

async function listMigrationsThrough(through) {
  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith(".sql")).sort();
  const selected = [];
  const seen = new Map();
  for (const f of files) {
    const m = f.match(NAME_RE);
    if (!m) throw new Error(`migration name violates NNN_snake_case.sql: ${f}`);
    if (seen.has(m[1])) {
      throw new Error(`duplicate migration prefix ${m[1]}: ${seen.get(m[1])} and ${f}`);
    }
    seen.set(m[1], f);
    if (m[1] <= through) selected.push(f);
  }
  return selected;
}

async function applyMigrations(client, files) {
  await client.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (filename text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())"
  );
  const applied = new Set(
    (await client.query("SELECT filename FROM schema_migrations")).rows.map((r) => r.filename)
  );
  let ran = 0;
  for (const f of files) {
    if (applied.has(f)) {
      console.log(`skip   ${f} (already applied)`);
      continue;
    }
    const sql = await readFile(path.join(MIGRATIONS_DIR, f), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [f]);
      await client.query("COMMIT");
      console.log(`apply  ${f}`);
      ran += 1;
    } catch (err) {
      await client.query("ROLLBACK");
      throw new Error(`FAILED ${f}: ${err.message}`);
    }
  }
  console.log(`migrations complete — ${ran} applied, ${files.length - ran} already in place.`);
  console.log(`applied through ${files.at(-1)?.slice(0, 3) ?? "???"}`);
}

async function assertSchema(client) {
  const required = [
    "routing_sessions",
    "routing_proposals",
    "routing_proposal_revisions",
    "routing_revision_candidates",
    "routing_decisions",
    "routing_work_links",
    "routing_creation_intents",
  ];
  for (const table of required) {
    const { rows } = await client.query(
      `SELECT 1 FROM information_schema.tables WHERE table_name = $1`,
      [table]
    );
    if (!rows.length) throw new Error(`missing table ${table}`);
  }

  const { rows: uniq } = await client.query(
    `SELECT 1
       FROM pg_constraint
      WHERE conname = 'routing_proposals_repo_id_change_id_key'
         OR contype = 'u' AND conrelid = 'routing_proposals'::regclass`
  );
  if (!uniq.length) {
    // Fallback: inspect indexes/constraints for (repo_id, change_id)
    const { rows: cols } = await client.query(
      `SELECT pg_get_constraintdef(c.oid) AS def
         FROM pg_constraint c
         JOIN pg_class t ON t.oid = c.conrelid
        WHERE t.relname = 'routing_proposals' AND c.contype = 'u'`
    );
    const ok = cols.some((r) => /repo_id/i.test(r.def) && /change_id/i.test(r.def));
    if (!ok) throw new Error("routing_proposals missing UNIQUE (repo_id, change_id)");
  }

  const { rows: seq } = await client.query(
    `SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'mc_task_id_seq'`
  );
  if (!seq.length) throw new Error("missing sequence mc_task_id_seq");
  console.log("schema assertions passed");
}

async function assertIdempotency(client, files) {
  // Re-apply every migration SQL in a transaction that we roll back after
  // checking it does not error — and also re-run applyMigrations which skips.
  await applyMigrations(client, files);
  for (const f of files.filter((name) => name.startsWith("017") || name.startsWith("018"))) {
    const sql = await readFile(path.join(MIGRATIONS_DIR, f), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("ROLLBACK");
    } catch (err) {
      await client.query("ROLLBACK");
      throw new Error(`idempotent re-apply failed for ${f}: ${err.message}`);
    }
  }

  // Proposal identity unique + revision SHA unique
  await client.query(
    `INSERT INTO routing_sessions (
        id, repo_id, actor_id, actor_kind, base_branch, source_branch,
        status, absolute_expires_at, idle_expires_at
      ) VALUES (
        'rtx_idempotency1', '1', 'actor', 'human', 'main', 'feat',
        'active', now() + interval '7 days', now() + interval '1 day'
      ) ON CONFLICT (id) DO NOTHING`
  );
  await client.query(
    `INSERT INTO routing_proposals (id, repo_id, change_id, state, body_content_hash)
     VALUES ('rp_idem_1', '1', '42', 'action_required', 'hash')
     ON CONFLICT (repo_id, change_id) DO NOTHING`
  );
  let duplicateOk = false;
  try {
    await client.query(
      `INSERT INTO routing_proposals (id, repo_id, change_id, state)
       VALUES ('rp_idem_2', '1', '42', 'action_required')`
    );
  } catch (err) {
    duplicateOk = /unique|duplicate/i.test(String(err.message));
  }
  if (!duplicateOk) throw new Error("expected unique violation on (repo_id, change_id)");

  await client.query(
    `INSERT INTO routing_proposal_revisions (id, proposal_id, head_sha, policy_version)
     VALUES ('rr_idem_1', 'rp_idem_1', 'abc123', 'routing.v1')
     ON CONFLICT (proposal_id, head_sha) DO NOTHING`
  );
  duplicateOk = false;
  try {
    await client.query(
      `INSERT INTO routing_proposal_revisions (id, proposal_id, head_sha, policy_version)
       VALUES ('rr_idem_2', 'rp_idem_1', 'abc123', 'routing.v1')`
    );
  } catch (err) {
    duplicateOk = /unique|duplicate/i.test(String(err.message));
  }
  if (!duplicateOk) throw new Error("expected unique violation on (proposal_id, head_sha)");

  await client.query(
    `INSERT INTO routing_creation_intents (id, proposal_id, creation_intent_hash, task_id)
     VALUES ('rci_1', 'rp_idem_1', 'intent-a', 'TASK-1')
     ON CONFLICT (proposal_id, creation_intent_hash) DO NOTHING`
  );
  const { rows } = await client.query(
    `INSERT INTO routing_creation_intents (id, proposal_id, creation_intent_hash, task_id)
     VALUES ('rci_2', 'rp_idem_1', 'intent-a', 'TASK-999')
     ON CONFLICT (proposal_id, creation_intent_hash) DO UPDATE
       SET proposal_id = EXCLUDED.proposal_id
     RETURNING task_id`
  );
  if (rows[0]?.task_id !== "TASK-1") {
    throw new Error(`creation intent replay returned ${rows[0]?.task_id}, expected TASK-1`);
  }

  await client.query(
    `INSERT INTO routing_work_links (
       id, proposal_id, task_id, link_type, repo_id, change_id,
       head_sha, merge_sha, created_by
     ) VALUES (
       'rwl_idem_1', 'rp_idem_1', 'TASK-1', 'related', '1', '42',
       NULL, NULL, 'actor'
     )`
  );
  await client.query(
    `INSERT INTO routing_work_links (
       id, proposal_id, task_id, link_type, repo_id, change_id,
       head_sha, merge_sha, created_by
     ) VALUES (
       'rwl_idem_2', 'rp_idem_1', 'TASK-1', 'related', '1', '42',
       NULL, NULL, 'actor'
     )
     ON CONFLICT ON CONSTRAINT routing_work_links_replay_key DO NOTHING`
  );
  const workLinkCount = await client.query(
    `SELECT count(*)::integer AS count
       FROM routing_work_links
      WHERE task_id = 'TASK-1'
        AND link_type = 'related'
        AND repo_id = '1'
        AND change_id = '42'`
  );
  if (workLinkCount.rows[0]?.count !== 1) {
    throw new Error(`work-link replay produced ${workLinkCount.rows[0]?.count} rows`);
  }
  console.log("idempotency assertions passed");
}

async function assertSequence(client) {
  const emptyNext = await client.query(`SELECT nextval('mc_task_id_seq') AS n`);
  if (Number(emptyNext.rows[0].n) !== 1) {
    throw new Error(`empty database allocated TASK-${emptyNext.rows[0].n}, expected TASK-1`);
  }
  console.log("empty database allocated TASK-1");

  await client.query(
    `INSERT INTO entities (entity_type, id, data, sync_state)
     VALUES ('task', 'TASK-250', '{}'::jsonb, 'synced')
     ON CONFLICT (entity_type, id) DO NOTHING`
  );
  // Re-run the 018 reconciliation block by reading and executing the DO $$ … $$
  const sql = await readFile(path.join(MIGRATIONS_DIR, "018_routing_links_and_task_sequence.sql"), "utf8");
  await client.query(sql);

  const before = await client.query(`SELECT last_value, is_called FROM mc_task_id_seq`);
  const lastBefore = Number(before.rows[0].last_value);

  // Force a lower candidate and re-reconcile — must not move backwards.
  await client.query(`SELECT setval('mc_task_id_seq', 10, true)`);
  await client.query(sql);
  const afterLow = await client.query(`SELECT last_value FROM mc_task_id_seq`);
  const lastAfterLow = Number(afterLow.rows[0].last_value);
  if (lastAfterLow < 250) {
    throw new Error(`sequence moved below existing TASK max: ${lastAfterLow}`);
  }

  const next1 = await client.query(`SELECT nextval('mc_task_id_seq') AS n`);
  const next2 = await client.query(`SELECT nextval('mc_task_id_seq') AS n`);
  const n1 = Number(next1.rows[0].n);
  const n2 = Number(next2.rows[0].n);
  if (!(n2 === n1 + 1)) throw new Error(`sequence not monotonic: ${n1} then ${n2}`);
  if (n1 <= 250) throw new Error(`nextval ${n1} not above TASK-250`);

  // Simulate higher watermark then ensure re-reconcile does not go back.
  await client.query(`SELECT setval('mc_task_id_seq', 500, true)`);
  await client.query(sql);
  const afterHigh = await client.query(`SELECT last_value FROM mc_task_id_seq`);
  if (Number(afterHigh.rows[0].last_value) < 500) {
    throw new Error("sequence moved backwards from 500");
  }
  console.log(`sequence assertions passed (pre=${lastBefore})`);
}

async function assertConcurrency(url) {
  const first = new Client({ connectionString: url });
  const second = new Client({ connectionString: url });
  await Promise.all([first.connect(), second.connect()]);
  try {
    // Both independent connections hold open transactions before either
    // allocation. Sequence nextval is non-transactional and must remain unique.
    await Promise.all([first.query("BEGIN"), second.query("BEGIN")]);
    const [firstResult, secondResult] = await Promise.all([
      first.query(`SELECT nextval('mc_task_id_seq') AS n`),
      second.query(`SELECT nextval('mc_task_id_seq') AS n`),
    ]);
    const n1 = Number(firstResult.rows[0].n);
    const n2 = Number(secondResult.rows[0].n);
    if (n1 === n2) throw new Error("concurrent nextval collision");
    await Promise.all([first.query("COMMIT"), second.query("COMMIT")]);
    console.log(
      `overlapping transaction concurrency assertions passed (${n1}, ${n2})`
    );
  } catch (err) {
    await Promise.allSettled([first.query("ROLLBACK"), second.query("ROLLBACK")]);
    throw err;
  } finally {
    await Promise.allSettled([first.end(), second.end()]);
  }
}

async function main() {
  refuseConfiguredUrls();
  const args = parseArgs(process.argv.slice(2));
  const suffix = randomBytes(4).toString("hex");
  const containerName = `plx-mc-routing-pg-${suffix}`;
  const port = await freePort();
  const password = `r${randomBytes(8).toString("hex")}`;
  const url = `postgres://postgres:${password}@127.0.0.1:${port}/postgres`;

  let client;
  let containerStarted = false;
  try {
    console.log(`starting container ${containerName} on port ${port}`);
    const run = docker([
      "run",
      "-d",
      "--name",
      containerName,
      "-e",
      `POSTGRES_PASSWORD=${password}`,
      "-p",
      `127.0.0.1:${port}:5432`,
      "postgres:16-alpine",
    ]);
    if (run.status !== 0) {
      console.error(run.stderr || run.stdout);
      throw new Error("docker run failed");
    }
    containerStarted = true;

    await waitForPostgres(url, WAIT_TIMEOUT_MS);
    client = new Client({ connectionString: url });
    await client.connect();

    // entities table is required by 018 sequence reconciliation; ensure prior
    // migrations create it (004). Apply through requested prefix.
    const files = await listMigrationsThrough(args.through);
    await applyMigrations(client, files);

    if (args.schema) await assertSchema(client);
    if (args.idempotency) await assertIdempotency(client, files);
    if (args.sequence) await assertSequence(client);
    if (args.concurrency) await assertConcurrency(url);

    console.log("routing postgres harness OK");
    return 0;
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
    if (containerStarted) {
      const rm = docker(["rm", "-f", containerName]);
      if (rm.status === 0) {
        console.log(`cleanup: removed container ${containerName}`);
      } else {
        throw new Error(
          `cleanup FAILED for ${containerName}: ${rm.stderr || rm.stdout}`
        );
      }
    }
  }
}

main().then(
  (code) => process.exit(code ?? 0),
  (err) => {
    console.error(`test-routing-postgres failed: ${err.message}`);
    process.exit(1);
  }
);
