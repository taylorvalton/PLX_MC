// Persistence constants and SQL fragments for the routing control plane.
// Schema ownership: db/migrations/017_*.sql and 018_*.sql.

export const ROUTING_POLICY_VERSION = "routing.v1";

export const ROUTING_TABLES = [
  "routing_sessions",
  "routing_proposals",
  "routing_proposal_revisions",
  "routing_revision_candidates",
  "routing_decisions",
  "routing_work_links",
  "routing_creation_intents",
] as const;

export const MC_TASK_ID_SEQUENCE = "mc_task_id_seq";

export function formatTaskId(n: number | string): string {
  return `TASK-${n}`;
}
