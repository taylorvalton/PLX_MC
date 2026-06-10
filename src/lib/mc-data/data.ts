// PROTOTYPE FIXTURE — illustrative mock data, faithful to docs/product/prototype/mc-data.js.
// Replaced at the sync-engine milestone by the API + SharePoint mirror
// (docs/product/SHAREPOINT_INTEGRATION.md). Entities are added per-screen as
// each screen is built; this file currently carries what the shell + Inbox use.

import type {
  Agent,
  Bucket,
  Human,
  InboxNotification,
  PriorityConfig,
  PriorityKey,
  Stage,
  SyncRegister,
  Task,
} from "./types";

// The signed-in human whose cockpit this is (the prototype's fixed viewer).
export const CURRENT_USER = "maya";

export const STAGES: Stage[] = [
  { n: "01", key: "backlog", name: "Backlog", band: "todo" },
  { n: "02", key: "specced", name: "Specced", band: "todo", gate: "PRD" },
  { n: "03", key: "approved", name: "Approved", band: "todo" },
  { n: "04", key: "planned", name: "Planned", band: "todo" },
  { n: "05", key: "progress", name: "In Progress", band: "doing" },
  { n: "06", key: "qa", name: "In QA", band: "doing", gate: "Evidence" },
  { n: "07", key: "review", name: "In Review", band: "doing" },
  { n: "08", key: "merged", name: "Merged", band: "done" },
  { n: "09", key: "verified", name: "Verified", band: "done" },
];

export const STAGE_IDX: Record<string, number> = Object.fromEntries(
  STAGES.map((s, i) => [s.key, i])
);

export const BANDS: { key: "todo" | "doing" | "done"; name: string }[] = [
  { key: "todo", name: "To do" },
  { key: "doing", name: "In progress" },
  { key: "done", name: "Done" },
];

export const PRIORITY: Record<PriorityKey, PriorityConfig> = {
  urgent: { label: "Urgent", cls: "hot", tick: "▰▰▰▰" },
  high: { label: "High", cls: "warn", tick: "▰▰▰▱" },
  medium: { label: "Medium", cls: "info", tick: "▰▰▱▱" },
  low: { label: "Low", cls: "muted", tick: "▰▱▱▱" },
};

export const HUMANS: Record<string, Human> = {
  maya: { id: "maya", kind: "human", name: "Maya Aldosari", init: "MA", role: "Admin", online: true, email: "maya.aldosari@petralabx.com", dept: "Engineering" },
  tariq: { id: "tariq", kind: "human", name: "Tariq Del Mar", init: "TD", role: "Lead", online: true, email: "tariq.delmar@petralabx.com", dept: "Engineering" },
  lena: { id: "lena", kind: "human", name: "Lena Pulcini", init: "LP", role: "Contributor", online: false, email: "lena.pulcini@petralabx.com", dept: "Design Systems" },
  evan: { id: "evan", kind: "human", name: "Evan Brodsky", init: "EB", role: "Contributor", online: true, email: "evan.brodsky@petralabx.com", dept: "Platform" },
  noor: { id: "noor", kind: "human", name: "Noor Haddad", init: "NH", role: "Contributor", online: false, email: "noor.haddad@petralabx.com", dept: "Engineering" },
};

export const AGENTS: Record<string, Agent> = {
  vibes: { id: "vibes", kind: "agent", name: "Vibes", init: "VB", model: "Sonnet", team: "Dev", mode: "auto", online: true },
  atlas: { id: "atlas", kind: "agent", name: "Atlas", init: "AT", model: "Opus", team: "Research", mode: "approve", online: true },
  sentry: { id: "sentry", kind: "agent", name: "Sentry", init: "SY", model: "Sonnet", team: "QA", mode: "auto", online: true },
  scribe: { id: "scribe", kind: "agent", name: "Scribe", init: "SC", model: "Opus", team: "Ops", mode: "approve", online: true },
};

export const ACTORS: Record<string, Human | Agent> = { ...HUMANS, ...AGENTS };

export const BUCKETS: Bucket[] = [
  { id: "BKT-CPV2", name: "Customer Portal v2", owner: "maya", health: "risk", target: "Jul 18", started: "2026.04.02", desc: "Rebuild the brand-owner portal on the new design system.", repos: ["portal-web", "portal-api", "design-sys"], sync: { state: "synced", ts: "2026.06.09 · 08:14", sp: "Roadmap · row 12" }, prd: "PRD-CPV2" },
  { id: "BKT-MRP", name: "MRP Floor Sync", owner: "tariq", health: "track", target: "Aug 04", started: "2026.03.10", desc: "Real-time sync between the formulation floor and the MRP system of record.", repos: ["mrp-core", "portal-api"], sync: { state: "synced", ts: "2026.06.09 · 07:50", sp: "Roadmap · row 13" }, prd: "PRD-MRP" },
  { id: "BKT-DS", name: "Design System 2.0", owner: "lena", health: "track", target: "Jun 30", started: "2026.02.18", desc: "Token layer, components, and the PMark glyph system shared across surfaces.", repos: ["design-sys"], sync: { state: "pending", ts: "2026.06.09 · 09:02", sp: "Roadmap · row 14" }, prd: "PRD-DS" },
  { id: "BKT-AUTH", name: "Auth & SSO Hardening", owner: "evan", health: "off", target: "Jun 20", started: "2026.05.01", desc: "SAML/SSO, session hardening, and audit logging ahead of the security review.", repos: ["portal-api", "infra"], sync: { state: "conflict", ts: "2026.06.09 · 06:31", sp: "Roadmap · row 15" }, prd: "PRD-AUTH" },
  { id: "BKT-MOB", name: "Mobile Companion", owner: "maya", health: "track", target: "—", started: "2026.06.08", desc: "A read-mostly mobile companion for approvals and status — awaiting a PRD.", repos: [], sync: { state: "pending", ts: "—", sp: "Roadmap · row 16" }, prd: null, empty: true },
];

export const BUCKET_IDX: Record<string, Bucket> = Object.fromEntries(
  BUCKETS.map((b) => [b.id, b])
);

export const TASKS: Task[] = [
  {
    id: "TASK-214", title: "Inline deed signing on the workbench", bucket: "BKT-CPV2", stage: "qa", priority: "high",
    assignee: "vibes", coassignees: ["tariq"], reporter: "maya", reqs: ["REQ-2"], repos: ["portal-web", "portal-api"], estimate: "L",
    labels: ["frontend", "deeds", "agent-built"],
    prs: [
      { repo: "portal-web", num: 88, status: "open", title: "feat: inline deed signature pad + sealed-record flip" },
      { repo: "portal-api", num: 42, status: "open", title: "feat: /deeds/sign endpoint + sealed PDF render" },
    ],
    due: "Jun 16", sync: { state: "synced", ts: "2026.06.09 · 09:12", sp: "ToDos · item 214" }, subtasks: [],
    evidence: {
      summary: "Inline signature pad seals the deed record with initials + UTC timestamp and renders a sealed PDF.",
      items: [
        { key: "summary", label: "Summary — what I did", done: true },
        { key: "reqs", label: "PRD requirement satisfied — REQ-2", done: true },
        { key: "shots", label: "Before / after screenshots", done: true },
        { key: "qa", label: "E2E QA results", done: true },
        { key: "prs", label: "PR / diff links (2 repos)", done: true },
        { key: "rollback", label: "Rollback plan", done: false },
      ],
    },
    activity: [{ age: "now", who: "vibes", what: "E2E suite passed — 11/11 on e2e/deeds.spec.ts", kind: "qa" }],
  },
  {
    id: "TASK-219", title: "Daily digest batching + opt-out", bucket: "BKT-CPV2", stage: "progress", priority: "medium",
    assignee: "vibes", coassignees: [], reporter: "maya", reqs: ["REQ-4"], repos: ["portal-api"], estimate: "M",
    labels: ["backend", "email", "agent-built"], prs: [],
    due: "Jun 24", sync: { state: "pending", ts: "2026.06.09 · 09:01", sp: "ToDos · item 219" }, subtasks: [],
    evidence: {
      summary: "Started the 24h event-collection window. Digest template and opt-out path still in progress.",
      items: [
        { key: "summary", label: "Summary — what I did", done: true },
        { key: "reqs", label: "PRD requirement satisfied — REQ-4", done: true },
        { key: "shots", label: "Before / after screenshots", done: false },
        { key: "qa", label: "E2E QA results", done: false },
        { key: "prs", label: "PR / diff links", done: false },
        { key: "rollback", label: "Rollback plan", done: false },
      ],
    },
    activity: [{ age: "20m", who: "vibes", what: "digest template render failing — 2 E2E red", kind: "qa" }],
  },
  {
    id: "TASK-201", title: "Approve formula version from workbench", bucket: "BKT-CPV2", stage: "verified", priority: "high",
    assignee: "lena", coassignees: ["vibes"], reporter: "maya", reqs: ["REQ-1"], repos: ["portal-web", "portal-api"], estimate: "L",
    labels: ["frontend", "approvals"],
    prs: [
      { repo: "portal-web", num: 71, status: "merged", title: "feat: approve formula from workbench" },
      { repo: "portal-api", num: 35, status: "merged", title: "feat: signed approval record" },
    ],
    due: "Jun 06", sync: { state: "synced", ts: "2026.06.07 · 17:20", sp: "ToDos · item 201" }, subtasks: [],
    merge: { sha: "a91f3c2", on: "2026.06.06" },
    activity: [{ age: "3d", who: "tariq", what: "verified in production — REQ-1 satisfied", kind: "move" }],
  },
  {
    id: "TASK-188", title: "Live phase + next-milestone on workbench cards", bucket: "BKT-CPV2", stage: "review", priority: "medium",
    assignee: "evan", coassignees: ["sentry"], reporter: "tariq", reqs: ["REQ-3"], repos: ["portal-web", "mrp-core"], estimate: "M",
    labels: ["frontend", "realtime"], prs: [{ repo: "portal-web", num: 84, status: "open", title: "feat: live phase pill + milestone" }],
    due: "Jun 14", sync: { state: "synced", ts: "2026.06.09 · 08:55", sp: "ToDos · item 188" }, subtasks: [],
    activity: [{ age: "5h", who: "evan", what: "requested review from Tariq", kind: "move" }],
  },
  {
    id: "TASK-176", title: "Surfactant supplier lead-time risk spike", bucket: "BKT-MRP", stage: "progress", priority: "urgent",
    assignee: "atlas", coassignees: ["maya"], reporter: "maya", reqs: [], repos: ["mrp-core"], estimate: "S",
    labels: ["research", "risk"], blocked: true, blockedReason: "Awaiting supplier confirmation — 11wk lead time", prs: [],
    due: "Jun 12", sync: { state: "synced", ts: "2026.06.09 · 07:40", sp: "ToDos · item 176" }, subtasks: [],
    activity: [{ age: "6h", who: "atlas", what: "compiled lead-time comparison across 3 suppliers", kind: "qa" }],
  },
  {
    id: "TASK-160", title: "BOM-lock event → MRP core", bucket: "BKT-MRP", stage: "merged", priority: "high",
    assignee: "tariq", coassignees: [], reporter: "tariq", reqs: [], repos: ["mrp-core", "portal-api"], estimate: "M",
    labels: ["backend"], prs: [{ repo: "mrp-core", num: 19, status: "merged", title: "feat: bom-lock event bus" }],
    due: "Jun 09", sync: { state: "synced", ts: "2026.06.08 · 18:10", sp: "ToDos · item 160" }, subtasks: [],
    activity: [{ age: "1d", who: "tariq", what: "merged PR #19", kind: "pr" }],
  },
  {
    id: "TASK-152", title: "PMark glyph component + favicon set", bucket: "BKT-DS", stage: "verified", priority: "low",
    assignee: "lena", coassignees: [], reporter: "lena", reqs: [], repos: ["design-sys"], estimate: "S",
    labels: ["design-system"], prs: [{ repo: "design-sys", num: 12, status: "merged", title: "feat: PMark + favicons" }],
    due: "May 30", sync: { state: "synced", ts: "2026.06.01 · 11:00", sp: "ToDos · item 152" }, subtasks: [],
    activity: [{ age: "1w", who: "lena", what: "verified", kind: "move" }],
  },
  {
    id: "TASK-149", title: "Tokenize spacing + radius scale", bucket: "BKT-DS", stage: "planned", priority: "medium",
    assignee: "scribe", coassignees: ["lena"], reporter: "lena", reqs: [], repos: ["design-sys"], estimate: "M",
    labels: ["design-system"], prs: [],
    due: "Jun 26", sync: { state: "pending", ts: "2026.06.09 · 09:02", sp: "ToDos · item 149" }, subtasks: [],
    activity: [{ age: "1d", who: "scribe", what: "drafted token map from existing CSS", kind: "comment" }],
  },
  {
    id: "TASK-140", title: "SAML assertion validation", bucket: "BKT-AUTH", stage: "progress", priority: "urgent",
    assignee: "evan", coassignees: ["atlas"], reporter: "evan", reqs: [], repos: ["portal-api", "infra"], estimate: "L",
    labels: ["backend", "security"], prs: [{ repo: "portal-api", num: 40, status: "open", title: "feat: SAML assertion validation" }],
    due: "Jun 18",
    sync: { state: "conflict", ts: "2026.06.09 · 06:31", sp: "ToDos · item 140", wsVal: "In Progress · due Jun 18", spVal: "Blocked · due Jun 20" },
    subtasks: [], activity: [{ age: "3h", who: "evan", what: "SharePoint shows a conflicting status", kind: "sync" }],
  },
  {
    id: "TASK-138", title: "Session rotation + audit log", bucket: "BKT-AUTH", stage: "specced", priority: "high",
    assignee: "scribe", coassignees: ["evan"], reporter: "evan", reqs: [], repos: ["portal-api"], estimate: "M",
    labels: ["security"], prs: [],
    due: "Jun 22", sync: { state: "synced", ts: "2026.06.09 · 08:00", sp: "ToDos · item 138" }, subtasks: [],
    activity: [{ age: "1d", who: "scribe", what: "drafted PRD section · acceptance criteria", kind: "comment" }],
  },
  {
    id: "TASK-133", title: "Workbench empty + first-run states", bucket: "BKT-CPV2", stage: "backlog", priority: "low",
    assignee: null, coassignees: [], reporter: "maya", reqs: [], repos: ["portal-web"], estimate: "S",
    labels: ["frontend"], prs: [],
    due: "—", sync: { state: "pending", ts: "—", sp: "ToDos · item 133" }, subtasks: [], activity: [],
  },
  {
    id: "TASK-129", title: "Rate-limit /deeds/sign", bucket: "BKT-CPV2", stage: "approved", priority: "medium",
    assignee: "atlas", coassignees: [], reporter: "tariq", reqs: ["REQ-2"], repos: ["portal-api"], estimate: "S",
    labels: ["backend", "security"], prs: [],
    due: "Jun 20", sync: { state: "synced", ts: "2026.06.09 · 08:20", sp: "ToDos · item 129" }, subtasks: [],
    activity: [{ age: "2h", who: "atlas", what: "researched rate-limit thresholds", kind: "comment" }],
  },
  {
    id: "TASK-204", title: "Sealed-deed PDF mirror to SharePoint", bucket: "BKT-CPV2", stage: "planned", priority: "high",
    assignee: "scribe", coassignees: ["vibes"], reporter: "maya", reqs: ["REQ-2"], repos: ["portal-api"], estimate: "M",
    labels: ["ops", "sync"], prs: [],
    due: "Jun 17", sync: { state: "synced", ts: "2026.06.09 · 08:48", sp: "ToDos · item 204" }, subtasks: [],
    activity: [{ age: "1h", who: "scribe", what: "mapped deed → SharePoint document library", kind: "sync" }],
  },
];

export const TASK_IDX: Record<string, Task> = Object.fromEntries(
  TASKS.map((t) => [t.id, t])
);

export const INBOX: InboxNotification[] = [
  { id: "n1", kind: "approval", task: "TASK-214", actor: "vibes", text: "Vibes submitted TASK-214 for review — evidence complete", age: "now", unread: true },
  { id: "n2", kind: "conflict", task: "TASK-140", actor: "scribe", text: "SharePoint sync conflict on TASK-140 status", age: "3h", unread: true },
  { id: "n3", kind: "review", task: "TASK-188", actor: "evan", text: "Evan requested your review on PR #84", age: "5h", unread: true },
  { id: "n4", kind: "mention", task: "TASK-214", actor: "tariq", text: "Tariq mentioned you: confirm sealed PDF embeds UTC offset", age: "1h", unread: false },
  { id: "n5", kind: "assigned", task: "TASK-129", actor: "tariq", text: "Tariq assigned you TASK-129 — Rate-limit /deeds/sign", age: "2h", unread: false },
];

// Per-list sync counts — authoritative source for the topbar pill, sidebar
// badge, and (later) the Sync console. Mirrors MC_SP.lists[].counts.
export const SYNC_REGISTERS: SyncRegister[] = [
  { key: "todos", title: "ToDos", kind: "list", maps: "Tasks", counts: { synced: 12, pending: 1, conflict: 1, error: 0 } },
  { key: "roadmap", title: "Roadmap", kind: "list", maps: "Initiatives", counts: { synced: 5, pending: 0, conflict: 0, error: 0 } },
  { key: "milestones", title: "Milestone Register", kind: "list", maps: "Milestones", counts: { synced: 5, pending: 0, conflict: 0, error: 0 } },
  { key: "risks", title: "Risk Register", kind: "list", maps: "Risks", counts: { synced: 3, pending: 0, conflict: 1, error: 1 } },
  { key: "documents", title: "Project Documents", kind: "library", maps: "Files / folders", counts: { synced: 11, pending: 1, conflict: 0, error: 0 } },
];
