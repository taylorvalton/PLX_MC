// Canonical entity shapes for Mission Control.
// Mirrors docs/product/DATA_MODEL.md and the prototype's mc-data.js. This is the
// PROTOTYPE data contract; at the sync-engine milestone these types stay, but
// the in-memory fixtures (data.ts) are replaced by the API + SharePoint mirror
// (docs/product/SHAREPOINT_INTEGRATION.md).

export type Band = "todo" | "doing" | "done";

export type StageKey =
  | "backlog"
  | "specced"
  | "approved"
  | "planned"
  | "progress"
  | "qa"
  | "review"
  | "merged"
  | "verified";

export interface Stage {
  n: string;
  key: StageKey;
  name: string;
  band: Band;
  gate?: string;
}

export type PriorityKey = "urgent" | "high" | "medium" | "low";
export type Tone = "ok" | "warn" | "info" | "hot" | "muted" | "acc";

export interface PriorityConfig {
  label: string;
  cls: Extract<Tone, "hot" | "warn" | "info" | "muted">;
  tick: string;
}

export interface Human {
  id: string;
  kind: "human";
  name: string;
  init: string;
  role: string;
  online: boolean;
  email?: string;
  dept?: string;
  invited?: boolean;
}

export type AgentMode = "auto" | "approve";

export interface Agent {
  id: string;
  kind: "agent";
  name: string;
  init: string;
  model: string;
  team: string;
  mode: AgentMode;
  online: boolean;
}

export type Actor = Human | Agent;

export interface Repo {
  id: string;
  name: string;
  lang: string;
  openPRs: number;
  openTasks: number;
  def: string;
}

export type Health = "track" | "risk" | "off";
export type SyncState = "synced" | "pending" | "conflict" | "error";

export interface SyncRef {
  state: SyncState;
  ts: string;
  sp: string;
  wsVal?: string;
  spVal?: string;
  reason?: string;
}

export interface Bucket {
  id: string;
  name: string;
  owner: string;
  health: Health;
  target: string;
  started: string;
  desc: string;
  repos: string[];
  sync: SyncRef;
  prd: string | null;
  empty?: boolean;
}

export interface PullRequest {
  repo: string;
  num: number;
  status: "open" | "merged" | "closed";
  title: string;
}

export interface Subtask {
  id: string;
  t: string;
  done: boolean;
  who: string;
}

export interface ActivityEntry {
  age: string;
  who: string;
  what: string;
  kind: string;
}

export interface EvidenceItem {
  key: string;
  label: string;
  done: boolean;
}

export interface QaTest {
  name: string;
  status: "pass" | "fail";
}

export interface Evidence {
  summary: string;
  items: EvidenceItem[];
  shots?: { label: string; cap: string }[];
  qa?: { pass: number; fail: number; total: number; suite: string; ran: string; tests: QaTest[] };
  rollback?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  bucket: string;
  stage: StageKey;
  priority: PriorityKey;
  assignee: string | null;
  coassignees: string[];
  reporter: string;
  reqs: string[];
  repos: string[];
  estimate: "S" | "M" | "L";
  labels: string[];
  prs: PullRequest[];
  due: string;
  sync: SyncRef;
  subtasks: Subtask[];
  activity: ActivityEntry[];
  evidence?: Evidence;
  blocked?: boolean;
  blockedReason?: string;
  merge?: { sha: string; on: string };
  userCreated?: boolean;
}

export type InboxKind = "approval" | "review" | "conflict" | "mention" | "assigned";

export interface InboxNotification {
  id: string;
  kind: InboxKind;
  task: string;
  actor: string;
  text: string;
  age: string;
  unread: boolean;
}

export interface SyncRegister {
  key: string;
  title: string;
  kind: "list" | "library";
  maps: string;
  counts: { synced: number; pending: number; conflict: number; error: number };
}

export type ConfidenceState = "ready" | "building" | "gap" | "blocked";

export interface Confidence {
  state: ConfidenceState;
  label: string;
  pct: number;
}
