import pg from "pg";

const url = process.env.PLX_MC_DATABASE_URL;
if (!url) {
  console.error("PLX_MC_DATABASE_URL not set");
  process.exit(1);
}

const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await c.connect();
const ids = ["TASK-475", "TASK-501", "TASK-237"];
const r = await c.query(
  `SELECT id, entity_id, field, mc_val, sp_val, detected_at, note
     FROM sync_conflicts
    WHERE resolved_at IS NULL AND entity_id = ANY($1)
    ORDER BY entity_id, field`,
  [ids]
);
console.log("CONFLICTS", JSON.stringify(r.rows, null, 2));
const t = await c.query(
  `SELECT id, data->>'title' AS title, data->>'stage' AS stage, sync_state, dirty_fields, sp_item_id,
          data->'evidence' AS evidence
     FROM entities WHERE entity_type='task' AND id = ANY($1)`,
  [ids]
);
console.log("TASKS", JSON.stringify(t.rows, null, 2));
await c.end();
