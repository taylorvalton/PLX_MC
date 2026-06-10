/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — workspace data (mock, illustrative)
   A multi-repo, multi-actor (human + agent) project workspace. Everything
   resolves to the Task: PRD requirements, evidence, PRs, and SharePoint sync.
   The golden thread: bucket "Customer Portal v2" → PRD REQ-1..4 → TASK-214
   (agent "Vibes", 2 repos) → In QA evidence fills → review → merge → REQ-2
   satisfied, REQ-4 a GAP → synced to SharePoint ToDos.
   ══════════════════════════════════════════════════════════════════════════ */

/* ─── Lifecycle: full spine (the rigor) + 3-band grouping (the calm default) ── */
window.MC_STAGES = [
  { n: "01", key: "backlog",  name: "Backlog",     band: "todo" },
  { n: "02", key: "specced",  name: "Specced",     band: "todo", gate: "PRD" },
  { n: "03", key: "approved", name: "Approved",    band: "todo" },
  { n: "04", key: "planned",  name: "Planned",     band: "todo" },
  { n: "05", key: "progress", name: "In Progress", band: "doing" },
  { n: "06", key: "qa",       name: "In QA",       band: "doing", gate: "Evidence" },
  { n: "07", key: "review",   name: "In Review",   band: "doing" },
  { n: "08", key: "merged",   name: "Merged",      band: "done" },
  { n: "09", key: "verified", name: "Verified",    band: "done" },
];
window.MC_STAGE_IDX = Object.fromEntries(window.MC_STAGES.map((s, i) => [s.key, i]));
window.MC_BANDS = [
  { key: "todo",  name: "To do" },
  { key: "doing", name: "In progress" },
  { key: "done",  name: "Done" },
];

/* ─── Priority + status semantics ─────────────────────────────────────────── */
window.MC_PRIORITY = {
  urgent: { label: "Urgent", cls: "hot",  tick: "▰▰▰▰" },
  high:   { label: "High",   cls: "warn", tick: "▰▰▰▱" },
  medium: { label: "Medium", cls: "info", tick: "▰▰▱▱" },
  low:    { label: "Low",    cls: "muted", tick: "▰▱▱▱" },
};

/* ─── Actors ──────────────────────────────────────────────────────────────── */
// Humans — round avatar, name, role.
window.MC_HUMANS = {
  maya:  { id: "maya",  kind: "human", name: "Maya Aldosari",  init: "MA", role: "Admin",       online: true  },
  tariq: { id: "tariq", kind: "human", name: "Tariq Del Mar",  init: "TD", role: "Lead",        online: true  },
  lena:  { id: "lena",  kind: "human", name: "Lena Pulcini",   init: "LP", role: "Contributor", online: false },
  evan:  { id: "evan",  kind: "human", name: "Evan Brodsky",   init: "EB", role: "Contributor", online: true  },
  noor:  { id: "noor",  kind: "human", name: "Noor Haddad",    init: "NH", role: "Contributor", online: false },
};
// Agents — squared avatar, model badge, team, supervision mode.
window.MC_AGENTS = {
  vibes:  { id: "vibes",  kind: "agent", name: "Vibes",  init: "VB", model: "Sonnet", team: "Dev",      mode: "auto",    online: true },
  atlas:  { id: "atlas",  kind: "agent", name: "Atlas",  init: "AT", model: "Opus",   team: "Research", mode: "approve", online: true },
  sentry: { id: "sentry", kind: "agent", name: "Sentry", init: "SY", model: "Sonnet", team: "QA",       mode: "auto",    online: true },
  scribe: { id: "scribe", kind: "agent", name: "Scribe", init: "SC", model: "Opus",   team: "Ops",      mode: "approve", online: true },
};
window.MC_ACTORS = { ...window.MC_HUMANS, ...window.MC_AGENTS };
window.MC_MODE = {
  auto:    { label: "Autonomous",    short: "AUTO" },
  approve: { label: "Needs-approval", short: "APPROVE" },
};

/* ─── Repos (multi-repo) ──────────────────────────────────────────────────── */
window.MC_REPOS = {
  "portal-web": { id: "portal-web", name: "plx-customer-portal", lang: "TypeScript · Next.js", openPRs: 4, openTasks: 9, def: "main" },
  "portal-api": { id: "portal-api", name: "plx-portal-api",      lang: "TypeScript · Node",    openPRs: 2, openTasks: 6, def: "main" },
  "mrp-core":   { id: "mrp-core",   name: "plx-mrp-core",        lang: "Go",                   openPRs: 1, openTasks: 5, def: "main" },
  "design-sys": { id: "design-sys", name: "plx-design-system",   lang: "CSS · TS",             openPRs: 2, openTasks: 3, def: "main" },
  "infra":      { id: "infra",      name: "plx-infra",           lang: "Terraform",            openPRs: 0, openTasks: 2, def: "main" },
};

/* ─── Sync states (SharePoint mirror) ─────────────────────────────────────── */
// state: synced | pending | conflict | error
window.MC_SYNC_REGISTERS = [
  { key: "roadmap",   sp: "Roadmap",            maps: "Buckets / Initiatives", synced: 5, pending: 0, conflict: 0, error: 0 },
  { key: "todos",     sp: "ToDos",              maps: "Tasks",                 synced: 14, pending: 1, conflict: 1, error: 0 },
  { key: "milestones",sp: "Milestone Register", maps: "Milestones",            synced: 8, pending: 0, conflict: 0, error: 0 },
  { key: "risks",     sp: "Risk Register",      maps: "Risks",                 synced: 4, pending: 0, conflict: 0, error: 1 },
];

/* ─── Buckets (Projects / Initiatives) ────────────────────────────────────── */
// health: track | risk | off
window.MC_BUCKETS = [
  {
    id: "BKT-CPV2", name: "Customer Portal v2", owner: "maya",
    health: "risk", target: "Jul 18", started: "2026.04.02",
    desc: "Rebuild the brand-owner portal on the new design system — faster approvals, signable deeds from the page, and a live project workbench.",
    repos: ["portal-web", "portal-api", "design-sys"],
    sync: { state: "synced", ts: "2026.06.09 · 08:14", sp: "Roadmap · row 12" },
    prd: "PRD-CPV2",
  },
  {
    id: "BKT-MRP", name: "MRP Floor Sync", owner: "tariq",
    health: "track", target: "Aug 04", started: "2026.03.10",
    desc: "Real-time sync between the formulation floor and the MRP system of record — batches, BOM locks, and assembly state.",
    repos: ["mrp-core", "portal-api"],
    sync: { state: "synced", ts: "2026.06.09 · 07:50", sp: "Roadmap · row 13" },
    prd: "PRD-MRP",
  },
  {
    id: "BKT-DS", name: "Design System 2.0", owner: "lena",
    health: "track", target: "Jun 30", started: "2026.02.18",
    desc: "Token layer, components, and the PMark glyph system shared across portal, MRP, and marketing.",
    repos: ["design-sys"],
    sync: { state: "pending", ts: "2026.06.09 · 09:02", sp: "Roadmap · row 14" },
    prd: "PRD-DS",
  },
  {
    id: "BKT-AUTH", name: "Auth & SSO Hardening", owner: "evan",
    health: "off", target: "Jun 20", started: "2026.05.01",
    desc: "SAML/SSO, session hardening, and audit logging across all surfaces ahead of the security review.",
    repos: ["portal-api", "infra"],
    sync: { state: "conflict", ts: "2026.06.09 · 06:31", sp: "Roadmap · row 15" },
    prd: "PRD-AUTH",
  },
  {
    id: "BKT-MOB", name: "Mobile Companion", owner: "maya",
    health: "track", target: "—", started: "2026.06.08",
    desc: "A read-mostly mobile companion for approvals and status — net-new initiative, awaiting a PRD.",
    repos: [],
    sync: { state: "pending", ts: "—", sp: "Roadmap · row 16" },
    prd: null, empty: true,
  },
];
window.MC_BUCKET_IDX = Object.fromEntries(window.MC_BUCKETS.map((b) => [b.id, b]));

/* ─── PRDs (Problem · Requirements · Acceptance · Non-goals · Rollback) ────── */
window.MC_PRDS = {
  "PRD-CPV2": {
    id: "PRD-CPV2", bucket: "BKT-CPV2", title: "Customer Portal v2",
    status: "approved", approvedBy: "maya", drafted: "scribe",
    problem: "Brand owners wait days to approve formulas and sign deeds because the portal round-trips through email and PDF. v2 makes every decision happen on the page, with a live project workbench.",
    reqs: [
      { id: "REQ-1", text: "Brand owners can approve a formula version from the workbench without leaving the page.", crit: "Approval writes a signed, timestamped record; the formula card flips to APPROVED within 1s." },
      { id: "REQ-2", text: "Deeds of formulation are signable inline, producing an auditable sealed record.", crit: "Signature captures initials + UTC timestamp; a sealed PDF is generated and mirrored to SharePoint." },
      { id: "REQ-3", text: "The workbench shows live project phase and next milestone for every active project.", crit: "Phase reflects MRP state within 5s; milestone due-date matches the Milestone Register." },
      { id: "REQ-4", text: "Customers receive a single daily digest instead of per-event email.", crit: "Digest batches all events in a 24h window; opt-out honored; zero per-event email sent." },
    ],
    nonGoals: ["No net-new payment flows in v2.", "No public (logged-out) project pages.", "Mobile is deferred to the Mobile Companion initiative."],
    rollback: "Feature-flag portal_v2 off restores v1 routes; data writes are additive (no destructive migrations), so revert is a flag flip plus cache purge.",
  },
};

/* ─── Tasks (the unit of work, and the spine of the system) ───────────────── */
// stage = key into MC_STAGES. assignee = actor id. coassignees optional.
// reqs = PRD requirement ids implemented. repos = repo ids. prs = [{repo,num,status}]
// evidence = bundle (see below) when relevant. sync = SharePoint ToDos mirror.
// blocked / rolledback = off-track overlays.
window.MC_TASKS = [
  {
    id: "TASK-214", title: "Inline deed signing on the workbench",
    bucket: "BKT-CPV2", stage: "qa", priority: "high",
    assignee: "vibes", coassignees: ["tariq"], reporter: "maya",
    reqs: ["REQ-2"], repos: ["portal-web", "portal-api"], estimate: "L",
    labels: ["frontend", "deeds", "agent-built"],
    prs: [
      { repo: "portal-web", num: 88, status: "open",   title: "feat: inline deed signature pad + sealed-record flip" },
      { repo: "portal-api", num: 42, status: "open",   title: "feat: /deeds/sign endpoint + sealed PDF render" },
    ],
    due: "Jun 16",
    sync: { state: "synced", ts: "2026.06.09 · 09:12", sp: "ToDos · item 214" },
    subtasks: [
      { id: "214.1", t: "Signature pad component", done: true,  who: "vibes" },
      { id: "214.2", t: "Seal + timestamp record", done: true,  who: "vibes" },
      { id: "214.3", t: "Sealed-PDF render service", done: true, who: "vibes" },
      { id: "214.4", t: "Mirror sealed deed to SharePoint", done: false, who: "scribe" },
    ],
    // Evidence Bundle — the hero gate. This one is COMPLETE-able (one item left).
    evidence: {
      summary: "Implemented an inline signature pad on the deed card. Signing seals the record with the signer's initials and a UTC timestamp, renders a sealed PDF, and flips the card to SEALED. Two repos: the portal-web UI and a portal-api /deeds/sign endpoint.",
      items: [
        { key: "summary",   label: "Summary — what I did",   done: true },
        { key: "reqs",      label: "PRD requirement satisfied — REQ-2", done: true },
        { key: "shots",     label: "Before / after screenshots", done: true },
        { key: "qa",        label: "E2E QA results", done: true },
        { key: "prs",       label: "PR / diff links (2 repos)", done: true },
        { key: "rollback",  label: "Rollback plan", done: false },
      ],
      shots: [
        { label: "Before · unsigned deed card", cap: "portal-web · /workbench/deed" },
        { label: "After · sealed record", cap: "portal-web · sealed state" },
      ],
      qa: { pass: 11, fail: 0, total: 11, suite: "e2e/deeds.spec.ts", ran: "2026.06.09 · 09:08",
        tests: [
          { name: "renders signature pad on unsigned deed", status: "pass" },
          { name: "captures initials + UTC timestamp on sign", status: "pass" },
          { name: "flips card to SEALED within 1s", status: "pass" },
          { name: "generates sealed PDF artifact", status: "pass" },
          { name: "mirrors sealed deed to SharePoint", status: "pass" },
        ] },
      rollback: "Feature-flag deed_inline_sign off reverts the card to the v1 'request signature by email' button. The /deeds/sign endpoint is additive; no schema migration to undo.",
    },
    activity: [
      { age: "now", who: "vibes",  what: "E2E suite passed — 11/11 on e2e/deeds.spec.ts", kind: "qa" },
      { age: "4m",  who: "vibes",  what: "captured after-state screenshot · sealed record", kind: "shot" },
      { age: "26m", who: "vibes",  what: "opened PR #42 on plx-portal-api", kind: "pr" },
      { age: "31m", who: "vibes",  what: "opened PR #88 on plx-customer-portal", kind: "pr" },
      { age: "1h",  who: "tariq",  what: "left a note: confirm sealed PDF embeds the UTC offset", kind: "comment" },
      { age: "3h",  who: "vibes",  what: "moved task to In QA", kind: "move" },
    ],
  },
  {
    id: "TASK-219", title: "Daily digest batching + opt-out",
    bucket: "BKT-CPV2", stage: "progress", priority: "medium",
    assignee: "vibes", coassignees: [], reporter: "maya",
    reqs: ["REQ-4"], repos: ["portal-api"], estimate: "M",
    labels: ["backend", "email", "agent-built"],
    prs: [],
    due: "Jun 24",
    sync: { state: "pending", ts: "2026.06.09 · 09:01", sp: "ToDos · item 219" },
    subtasks: [
      { id: "219.1", t: "Event-collection window (24h)", done: true,  who: "vibes" },
      { id: "219.2", t: "Digest template", done: false, who: "vibes" },
      { id: "219.3", t: "Opt-out honoring", done: false, who: "vibes" },
      { id: "219.4", t: "Kill per-event sends", done: false, who: "vibes" },
    ],
    // INCOMPLETE evidence — demonstrates the disabled gate.
    evidence: {
      summary: "Started the 24h event-collection window. Digest template and opt-out path are still in progress; per-event email not yet disabled.",
      items: [
        { key: "summary",  label: "Summary — what I did", done: true },
        { key: "reqs",     label: "PRD requirement satisfied — REQ-4", done: true },
        { key: "shots",    label: "Before / after screenshots", done: false },
        { key: "qa",       label: "E2E QA results", done: false },
        { key: "prs",      label: "PR / diff links", done: false },
        { key: "rollback", label: "Rollback plan", done: false },
      ],
      shots: [],
      qa: { pass: 3, fail: 2, total: 5, suite: "e2e/digest.spec.ts", ran: "2026.06.09 · 08:40",
        tests: [
          { name: "collects events into 24h window", status: "pass" },
          { name: "renders digest template", status: "fail" },
          { name: "honors opt-out", status: "fail" },
        ] },
      rollback: null,
    },
    activity: [
      { age: "20m", who: "vibes", what: "digest template render failing — 2 E2E red", kind: "qa" },
      { age: "2h",  who: "vibes", what: "started 24h collection window", kind: "move" },
    ],
  },
  {
    id: "TASK-201", title: "Approve formula version from workbench",
    bucket: "BKT-CPV2", stage: "verified", priority: "high",
    assignee: "lena", coassignees: ["vibes"], reporter: "maya",
    reqs: ["REQ-1"], repos: ["portal-web", "portal-api"], estimate: "L",
    labels: ["frontend", "approvals"],
    prs: [
      { repo: "portal-web", num: 71, status: "merged", title: "feat: approve formula from workbench" },
      { repo: "portal-api", num: 35, status: "merged", title: "feat: signed approval record" },
    ],
    due: "Jun 06",
    sync: { state: "synced", ts: "2026.06.07 · 17:20", sp: "ToDos · item 201" },
    subtasks: [],
    evidence: {
      summary: "Formula approval writes a signed, timestamped record and flips the card to APPROVED within 1s. Verified in production behind the flag.",
      items: [
        { key: "summary",  label: "Summary — what I did", done: true },
        { key: "reqs",     label: "PRD requirement satisfied — REQ-1", done: true },
        { key: "shots",    label: "Before / after screenshots", done: true },
        { key: "qa",       label: "E2E QA results", done: true },
        { key: "prs",      label: "PR / diff links (2 repos)", done: true },
        { key: "rollback", label: "Rollback plan", done: true },
      ],
      shots: [{ label: "Approved formula card", cap: "portal-web · approved" }],
      qa: { pass: 8, fail: 0, total: 8, suite: "e2e/approve.spec.ts", ran: "2026.06.06 · 14:02", tests: [] },
      rollback: "Flag approve_inline off; approval records are append-only.",
    },
    merge: { sha: "a91f3c2", on: "2026.06.06" },
    activity: [{ age: "3d", who: "tariq", what: "verified in production — REQ-1 satisfied", kind: "move" }],
  },
  {
    id: "TASK-188", title: "Live phase + next-milestone on workbench cards",
    bucket: "BKT-CPV2", stage: "review", priority: "medium",
    assignee: "evan", coassignees: ["sentry"], reporter: "tariq",
    reqs: ["REQ-3"], repos: ["portal-web", "mrp-core"], estimate: "M",
    labels: ["frontend", "realtime"],
    prs: [{ repo: "portal-web", num: 84, status: "open", title: "feat: live phase pill + milestone" }],
    due: "Jun 14",
    sync: { state: "synced", ts: "2026.06.09 · 08:55", sp: "ToDos · item 188" },
    subtasks: [],
    activity: [{ age: "5h", who: "evan", what: "requested review from Tariq", kind: "move" }],
  },
  {
    id: "TASK-176", title: "Surfactant supplier lead-time risk spike",
    bucket: "BKT-MRP", stage: "progress", priority: "urgent",
    assignee: "atlas", coassignees: ["maya"], reporter: "maya",
    reqs: [], repos: ["mrp-core"], estimate: "S",
    labels: ["research", "risk"], blocked: true, blockedReason: "Awaiting supplier confirmation — 11wk lead time",
    prs: [],
    due: "Jun 12",
    sync: { state: "synced", ts: "2026.06.09 · 07:40", sp: "ToDos · item 176" },
    subtasks: [],
    activity: [{ age: "6h", who: "atlas", what: "compiled lead-time comparison across 3 suppliers", kind: "qa" }],
  },
  {
    id: "TASK-160", title: "BOM-lock event → MRP core",
    bucket: "BKT-MRP", stage: "merged", priority: "high",
    assignee: "tariq", coassignees: [], reporter: "tariq",
    reqs: [], repos: ["mrp-core", "portal-api"], estimate: "M",
    labels: ["backend"],
    prs: [{ repo: "mrp-core", num: 19, status: "merged", title: "feat: bom-lock event bus" }],
    due: "Jun 09",
    sync: { state: "synced", ts: "2026.06.08 · 18:10", sp: "ToDos · item 160" },
    subtasks: [],
    activity: [{ age: "1d", who: "tariq", what: "merged PR #19", kind: "pr" }],
  },
  {
    id: "TASK-152", title: "PMark glyph component + favicon set",
    bucket: "BKT-DS", stage: "verified", priority: "low",
    assignee: "lena", coassignees: [], reporter: "lena",
    reqs: [], repos: ["design-sys"], estimate: "S",
    labels: ["design-system"],
    prs: [{ repo: "design-sys", num: 12, status: "merged", title: "feat: PMark + favicons" }],
    due: "May 30",
    sync: { state: "synced", ts: "2026.06.01 · 11:00", sp: "ToDos · item 152" },
    subtasks: [],
    activity: [{ age: "1w", who: "lena", what: "verified", kind: "move" }],
  },
  {
    id: "TASK-149", title: "Tokenize spacing + radius scale",
    bucket: "BKT-DS", stage: "planned", priority: "medium",
    assignee: "scribe", coassignees: ["lena"], reporter: "lena",
    reqs: [], repos: ["design-sys"], estimate: "M",
    labels: ["design-system"],
    prs: [],
    due: "Jun 26",
    sync: { state: "pending", ts: "2026.06.09 · 09:02", sp: "ToDos · item 149" },
    subtasks: [],
    activity: [{ age: "1d", who: "scribe", what: "drafted token map from existing CSS", kind: "comment" }],
  },
  {
    id: "TASK-140", title: "SAML assertion validation",
    bucket: "BKT-AUTH", stage: "progress", priority: "urgent",
    assignee: "evan", coassignees: ["atlas"], reporter: "evan",
    reqs: [], repos: ["portal-api", "infra"], estimate: "L",
    labels: ["backend", "security"],
    prs: [{ repo: "portal-api", num: 40, status: "open", title: "feat: SAML assertion validation" }],
    due: "Jun 18",
    sync: { state: "conflict", ts: "2026.06.09 · 06:31", sp: "ToDos · item 140",
      wsVal: "In Progress · due Jun 18", spVal: "Blocked · due Jun 20" },
    subtasks: [],
    activity: [{ age: "3h", who: "evan", what: "SharePoint shows a conflicting status", kind: "sync" }],
  },
  {
    id: "TASK-138", title: "Session rotation + audit log",
    bucket: "BKT-AUTH", stage: "specced", priority: "high",
    assignee: "scribe", coassignees: ["evan"], reporter: "evan",
    reqs: [], repos: ["portal-api"], estimate: "M",
    labels: ["security"],
    prs: [],
    due: "Jun 22",
    sync: { state: "synced", ts: "2026.06.09 · 08:00", sp: "ToDos · item 138" },
    subtasks: [],
    activity: [{ age: "1d", who: "scribe", what: "drafted PRD section · acceptance criteria", kind: "comment" }],
  },
  {
    id: "TASK-133", title: "Workbench empty + first-run states",
    bucket: "BKT-CPV2", stage: "backlog", priority: "low",
    assignee: null, coassignees: [], reporter: "maya",
    reqs: [], repos: ["portal-web"], estimate: "S",
    labels: ["frontend"],
    prs: [],
    due: "—",
    sync: { state: "pending", ts: "—", sp: "ToDos · item 133" },
    subtasks: [],
    activity: [],
  },
  {
    id: "TASK-129", title: "Rate-limit /deeds/sign",
    bucket: "BKT-CPV2", stage: "approved", priority: "medium",
    assignee: "atlas", coassignees: [], reporter: "tariq",
    reqs: ["REQ-2"], repos: ["portal-api"], estimate: "S",
    labels: ["backend", "security"],
    prs: [],
    due: "Jun 20",
    sync: { state: "synced", ts: "2026.06.09 · 08:20", sp: "ToDos · item 129" },
    subtasks: [],
    activity: [{ age: "2h", who: "atlas", what: "researched rate-limit thresholds", kind: "comment" }],
  },
  {
    id: "TASK-204", title: "Sealed-deed PDF mirror to SharePoint",
    bucket: "BKT-CPV2", stage: "planned", priority: "high",
    assignee: "scribe", coassignees: ["vibes"], reporter: "maya",
    reqs: ["REQ-2"], repos: ["portal-api"], estimate: "M",
    labels: ["ops", "sync"],
    prs: [],
    due: "Jun 17",
    sync: { state: "synced", ts: "2026.06.09 · 08:48", sp: "ToDos · item 204" },
    subtasks: [],
    activity: [{ age: "1h", who: "scribe", what: "mapped deed → SharePoint document library", kind: "sync" }],
  },
];
window.MC_TASK_IDX = Object.fromEntries(window.MC_TASKS.map((t) => [t.id, t]));

/* ─── Cycles + Milestones (timeline overlays) ─────────────────────────────── */
window.MC_CYCLES = [
  { id: "C-23", name: "Cycle 23", from: 1, to: 14 },   // day cols in a 28-col month grid
  { id: "C-24", name: "Cycle 24", from: 15, to: 28 },
];
window.MC_MILESTONES = [
  { id: "M-1", bucket: "BKT-CPV2", name: "Deeds signable inline", col: 8,  state: "now",  sp: "Milestone Register · 1" },
  { id: "M-2", bucket: "BKT-CPV2", name: "v2 beta to 5 customers", col: 22, state: "upcoming", sp: "Milestone Register · 2" },
  { id: "M-3", bucket: "BKT-MRP",  name: "Floor sync live",       col: 18, state: "upcoming", sp: "Milestone Register · 3" },
  { id: "M-4", bucket: "BKT-DS",   name: "DS 2.0 cut",            col: 12, state: "now",  sp: "Milestone Register · 4" },
  { id: "M-5", bucket: "BKT-AUTH", name: "Security review",       col: 10, state: "risk", sp: "Milestone Register · 5" },
];

/* ─── Risks (roll up to buckets, mirror to Risk Register) ─────────────────── */
window.MC_RISKS = [
  { id: "RISK-7", bucket: "BKT-MRP",  title: "Surfactant supplier 11-week lead time", like: "High", impact: "High", owner: "maya",  status: "open",     mit: "Qualify a second supplier; hold safety stock.", sync: { state: "synced", ts: "2026.06.09 · 07:42", sp: "Risk Register · 7" } },
  { id: "RISK-4", bucket: "BKT-AUTH", title: "SSO provider IdP metadata drift",       like: "Medium", impact: "High", owner: "evan",  status: "open",     mit: "Pin IdP metadata; alert on cert rotation.", sync: { state: "error", ts: "2026.06.09 · 06:31", sp: "Risk Register · 4", reason: "SharePoint column 'Likelihood' rejected value" } },
  { id: "RISK-2", bucket: "BKT-CPV2", title: "Sealed PDF UTC offset ambiguity",       like: "Low",    impact: "Medium", owner: "tariq", status: "mitigating", mit: "Embed explicit UTC offset; add E2E assertion.", sync: { state: "synced", ts: "2026.06.09 · 09:10", sp: "Risk Register · 2" } },
  { id: "RISK-1", bucket: "BKT-CPV2", title: "Digest opt-out not honored on legacy accounts", like: "Medium", impact: "Medium", owner: "maya", status: "open", mit: "Backfill opt-out flags before kill-switch.", sync: { state: "synced", ts: "2026.06.09 · 09:01", sp: "Risk Register · 1" } },
];

/* ─── Agent activity feed (mission control stream) ────────────────────────── */
// kind: run | review | pr | shot | sync | approve | block | comment
window.MC_AGENT_FEED = [
  { age: "now", actor: "vibes",  task: "TASK-214", kind: "run",     text: "running E2E QA on", chip: "11/11 passed", live: true,
    shots: ["before · unsigned deed", "after · sealed record"] },
  { age: "2m",  actor: "sentry", task: "TASK-188", kind: "run",     text: "executing regression suite on", chip: "running · 6/9", live: true },
  { age: "8m",  actor: "tariq",  task: "TASK-214", kind: "comment", text: "left a note on", chip: "confirm UTC offset", human: true },
  { age: "14m", actor: "vibes",  task: "TASK-214", kind: "pr",      text: "opened PR #42 + #88 across 2 repos for", chip: "2 PRs open" },
  { age: "26m", actor: "atlas",  task: "TASK-176", kind: "block",   text: "flagged a blocker on", chip: "supplier lead time" },
  { age: "40m", actor: "scribe", task: "TASK-138", kind: "comment", text: "drafted PRD acceptance criteria for", chip: "PRD draft" },
  { age: "1h",  actor: "tariq",  task: "TASK-188", kind: "review",  text: "requested changes on PR #84 for", chip: "changes requested", human: true },
  { age: "2h",  actor: "vibes",  task: "TASK-219", kind: "run",     text: "QA red — digest template failing on", chip: "2 failed", warn: true },
  { age: "3h",  actor: "scribe", task: "TASK-204", kind: "sync",    text: "mapped deed → SharePoint library for", chip: "sync mapped" },
  { age: "4h",  actor: "maya",   task: "TASK-201", kind: "approve", text: "approved + verified", chip: "REQ-1 satisfied", human: true },
];

/* ─── Inbox / Home notifications ──────────────────────────────────────────── */
// kind: approval | review | conflict | mention | assigned
window.MC_INBOX = [
  { id: "n1", kind: "approval", task: "TASK-214", actor: "vibes",  text: "Vibes submitted TASK-214 for review — evidence complete", age: "now", unread: true },
  { id: "n2", kind: "conflict", task: "TASK-140", actor: "scribe", text: "SharePoint sync conflict on TASK-140 status", age: "3h", unread: true },
  { id: "n3", kind: "review",   task: "TASK-188", actor: "evan",   text: "Evan requested your review on PR #84", age: "5h", unread: true },
  { id: "n4", kind: "mention",  task: "TASK-214", actor: "tariq",  text: "Tariq mentioned you: confirm sealed PDF embeds UTC offset", age: "1h", unread: false },
  { id: "n5", kind: "assigned", task: "TASK-129", actor: "tariq",  text: "Tariq assigned you TASK-129 — Rate-limit /deeds/sign", age: "2h", unread: false },
];

/* ─── Traceability matrix (REQ → Task → PR → Evidence → Test → Merge) ─────── */
// Built for the golden-path bucket; REQ-2 satisfied, REQ-4 a GAP.
window.MC_TRACE = {
  bucket: "BKT-CPV2",
  rows: [
    { req: "REQ-1", tasks: ["TASK-201"], prs: ["portal-web #71", "portal-api #35"], evidence: "complete", test: "8/8", merge: "a91f3c2", status: "satisfied" },
    { req: "REQ-2", tasks: ["TASK-214", "TASK-129", "TASK-204"], prs: ["portal-web #88", "portal-api #42"], evidence: "complete", test: "11/11", merge: "—", status: "in-review" },
    { req: "REQ-3", tasks: ["TASK-188"], prs: ["portal-web #84"], evidence: "partial", test: "in review", merge: "—", status: "in-progress" },
    { req: "REQ-4", tasks: ["TASK-219"], prs: [], evidence: "incomplete", test: "3/5", merge: "—", status: "gap" },
  ],
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
window.MC_bandOf = (stageKey) => window.MC_STAGES[window.MC_STAGE_IDX[stageKey]].band;
window.MC_tasksInBucket = (bid) => window.MC_TASKS.filter((t) => t.bucket === bid);
window.MC_evidenceComplete = (ev) => !!ev && ev.items.every((i) => i.done);

/* ══════════════════════════════════════════════════════════════════════════
   USER-CREATED TASKS — persistence layer (localStorage)
   Seed tasks above are the immutable demo fixture. Tasks a human creates
   through the New-task modal carry `userCreated: true`, are appended to
   MC_TASKS at runtime, and are mirrored to localStorage so they survive a
   refresh. Dev note for handoff: replace persistUserTasks / loadUserTasks
   with real API writes (POST /tasks) + the SharePoint ToDos mirror.
   ══════════════════════════════════════════════════════════════════════════ */
window.MC_USER_TASKS_KEY = "plx_mc_user_tasks_v1";

window.MC_persistUserTasks = function () {
  try {
    const mine = window.MC_TASKS.filter((t) => t.userCreated);
    localStorage.setItem(window.MC_USER_TASKS_KEY, JSON.stringify(mine));
  } catch (e) { /* storage unavailable — stays in-memory for the session */ }
};

window.MC_nextTaskId = function () {
  const nums = window.MC_TASKS.map((t) => parseInt((String(t.id).match(/(\d+)/) || [])[1] || "0", 10));
  return "TASK-" + (Math.max(0, ...nums) + 1);
};

// Build a fully-formed task from the modal's form values, append + persist.
window.MC_addTask = function (input) {
  const id = window.MC_nextTaskId();
  const num = id.match(/(\d+)/)[1];
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = now.getFullYear() + "." + pad(now.getMonth() + 1) + "." + pad(now.getDate())
    + " · " + pad(now.getHours()) + ":" + pad(now.getMinutes());
  const reporter = input.reporter || "maya";
  const who = window.MC_ACTORS[input.assignee];

  const task = {
    id,
    title: (input.title || "").trim(),
    description: (input.description || "").trim(),
    bucket: input.bucket,
    stage: input.stage || "backlog",
    priority: input.priority || "medium",
    assignee: input.assignee || null,
    coassignees: input.coassignees || [],
    reporter,
    reqs: input.reqs || [],
    repos: input.repos || [],
    estimate: input.estimate || "M",
    labels: input.labels || [],
    prs: [],
    due: input.due || "—",
    // New tasks land PENDING in the SharePoint ToDos register until the next sync tick.
    sync: { state: "pending", ts: stamp, sp: "ToDos · item " + num },
    subtasks: [],
    activity: [{
      age: "now", who: reporter, kind: "move",
      what: "created the task" + (who ? " — assigned to " + who.name : " — unassigned"),
    }],
    userCreated: true,
  };

  window.MC_TASKS.push(task);
  window.MC_TASK_IDX[task.id] = task;
  window.MC_persistUserTasks();
  return task;
};

window.MC_clearUserTasks = function () {
  window.MC_TASKS = window.MC_TASKS.filter((t) => !t.userCreated);
  window.MC_TASK_IDX = Object.fromEntries(window.MC_TASKS.map((t) => [t.id, t]));
  try { localStorage.removeItem(window.MC_USER_TASKS_KEY); } catch (e) {}
};

// Rehydrate any previously-created tasks on load.
(function loadUserTasks() {
  try {
    const raw = localStorage.getItem(window.MC_USER_TASKS_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;
    arr.forEach((t) => {
      if (t && t.id && !window.MC_TASK_IDX[t.id]) {
        window.MC_TASKS.push(t);
        window.MC_TASK_IDX[t.id] = t;
      }
    });
  } catch (e) { /* corrupt payload — ignore, fall back to seed data */ }
})();

/* ══════════════════════════════════════════════════════════════════════════
   PEOPLE DIRECTORY — taskable colleagues across the two Petra domains
   @petralabx.com = the lab / engineering arm · @petrasoap.com = the soap business.
   Anyone at either domain can be tasked; the assignee mirrors to the SharePoint
   "Assigned To" person column and a Teams/email notification is dispatched.
   PLACEHOLDER NAMES — swap for the real Entra ID / Microsoft 365 directory at
   handoff (Graph: GET /users?$filter=endsWith(mail,'@petralabx.com')).
   ══════════════════════════════════════════════════════════════════════════ */
// Email the five core team members already in MC_HUMANS.
Object.assign(window.MC_HUMANS.maya,  { email: "maya.aldosari@petralabx.com",  dept: "Engineering" });
Object.assign(window.MC_HUMANS.tariq, { email: "tariq.delmar@petralabx.com",   dept: "Engineering" });
Object.assign(window.MC_HUMANS.lena,  { email: "lena.pulcini@petralabx.com",   dept: "Design Systems" });
Object.assign(window.MC_HUMANS.evan,  { email: "evan.brodsky@petralabx.com",   dept: "Platform" });
Object.assign(window.MC_HUMANS.noor,  { email: "noor.haddad@petralabx.com",    dept: "Engineering" });

// Wider taskable directory (placeholder colleagues).
window.MC_DIRECTORY_EXTRA = {
  priya:  { id: "priya",  kind: "human", name: "Priya Raman",     init: "PR", role: "Data Scientist",    dept: "Data",        email: "priya.raman@petralabx.com",     online: true },
  felix:  { id: "felix",  kind: "human", name: "Felix Gunnarsson", init: "FG", role: "Platform Engineer", dept: "Platform",   email: "felix.gunnarsson@petralabx.com", online: false },
  dana:   { id: "dana",   kind: "human", name: "Dana Okafor",     init: "DO", role: "Head of Operations", dept: "Operations", email: "dana.okafor@petrasoap.com",      online: true },
  sam:    { id: "sam",    kind: "human", name: "Sam Whitfield",   init: "SW", role: "Lead Formulator",    dept: "Formulation",email: "sam.whitfield@petrasoap.com",    online: true },
  ines:   { id: "ines",   kind: "human", name: "Inès Marchetti",  init: "IM", role: "Supply Chain Mgr",   dept: "Supply",     email: "ines.marchetti@petrasoap.com",   online: false },
  omar:   { id: "omar",   kind: "human", name: "Omar Haddad",     init: "OH", role: "Brand & Marketing",  dept: "Marketing",  email: "omar.haddad@petrasoap.com",      online: true },
  grace:  { id: "grace",  kind: "human", name: "Grace Liu",       init: "GL", role: "Finance",            dept: "Finance",    email: "grace.liu@petrasoap.com",        online: false },
  ruben:  { id: "ruben",  kind: "human", name: "Rubén Álvarez",   init: "RA", role: "QA & Compliance",    dept: "Compliance", email: "ruben.alvarez@petrasoap.com",    online: true },
};
Object.assign(window.MC_HUMANS, window.MC_DIRECTORY_EXTRA);
Object.assign(window.MC_ACTORS, window.MC_DIRECTORY_EXTRA); // mutate (atoms captured the ref)

window.MC_PETRA_DOMAINS = ["petralabx.com", "petrasoap.com"];
window.MC_isPetraEmail = (email) =>
  /^[^@\s]+@(petralabx|petrasoap)\.com$/i.test(String(email || "").trim());
window.MC_domainOf = (email) => (String(email || "").split("@")[1] || "").toLowerCase();
window.MC_personByEmail = (email) =>
  Object.values(window.MC_HUMANS).find((p) => (p.email || "").toLowerCase() === String(email).toLowerCase());

// Ordered directory for pickers: core team first, then the rest, alpha.
window.MC_directory = () => {
  const core = ["maya", "tariq", "lena", "evan", "noor"];
  const all = Object.values(window.MC_HUMANS);
  const rank = (p) => { const i = core.indexOf(p.id); return i === -1 ? 99 : i; };
  return all.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
};

// Invite a new person by email (must be a Petra domain). Registers them so
// avatars resolve and persists across refresh. Returns the new person id.
window.MC_INVITED_KEY = "plx_mc_invited_people_v1";
window.MC_persistInvited = function () {
  try {
    const inv = Object.values(window.MC_HUMANS).filter((p) => p.invited);
    localStorage.setItem(window.MC_INVITED_KEY, JSON.stringify(inv));
  } catch (e) {}
};
window.MC_invitePerson = function (email) {
  email = String(email || "").trim();
  if (!window.MC_isPetraEmail(email)) return null;
  const existing = window.MC_personByEmail(email);
  if (existing) return existing.id;
  const local = email.split("@")[0];
  const parts = local.split(/[._-]+/).filter(Boolean);
  const name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ") || local;
  const init = (parts[0] ? parts[0][0] : local[0]) + (parts[1] ? parts[1][0] : (local[1] || ""));
  const id = "inv-" + local.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const person = {
    id, kind: "human", name, init: init.toUpperCase(), role: "Invited",
    dept: window.MC_domainOf(email) === "petrasoap.com" ? "Petra Soap" : "Petra Lab-X",
    email, online: false, invited: true,
  };
  window.MC_HUMANS[id] = person;
  window.MC_ACTORS[id] = person;
  window.MC_persistInvited();
  return id;
};
(function loadInvited() {
  try {
    const raw = localStorage.getItem(window.MC_INVITED_KEY);
    if (!raw) return;
    JSON.parse(raw).forEach((p) => {
      if (p && p.id && !window.MC_HUMANS[p.id]) { window.MC_HUMANS[p.id] = p; window.MC_ACTORS[p.id] = p; }
    });
  } catch (e) {}
})();

/* ══════════════════════════════════════════════════════════════════════════
   CANONICAL SHAREPOINT SCHEMA — the system of record
   A single SharePoint Online site backs Mission Control. Each MC entity maps
   to one list (or document library) with explicit, typed columns and a sync
   direction per field. This is the spec your dev team provisions:
     two-way  ↔  edits flow both directions (conflicts go to the review queue)
     push     →  MC is authoritative, writes to SharePoint
     pull     ←  SharePoint is authoritative, reads into MC
   Provision with PnP/Graph: site → lists → columns (types below) → views.
   ══════════════════════════════════════════════════════════════════════════ */
window.MC_SP = {
  site: { name: "PLX Mission Control", host: "petrasoap.sharepoint.com", path: "/sites/plx-mission-control", tz: "UTC", connected: true },
  lastSweep: "2026.06.09 · 09:12",
  cadence: "every 5 min + on change (webhook)",
  lists: [
    {
      key: "todos", title: "ToDos", kind: "list", entity: "Task", icon: "▦",
      maps: "Tasks", itemCount: 14, direction: "two-way",
      lastSync: "2026.06.09 · 09:12", counts: { synced: 12, pending: 1, conflict: 1, error: 0 },
      columns: [
        { name: "Title", type: "Single line of text", mc: "title", dir: "two-way", required: true },
        { name: "Task ID", type: "Single line of text", mc: "id", dir: "pull", required: true, note: "indexed · unique key" },
        { name: "Status", type: "Choice", mc: "stage", dir: "two-way", note: "Backlog→Verified (9)" },
        { name: "Assigned To", type: "Person", mc: "assignee", dir: "two-way" },
        { name: "Reporter", type: "Person", mc: "reporter", dir: "push" },
        { name: "Priority", type: "Choice", mc: "priority", dir: "two-way", note: "Urgent/High/Medium/Low" },
        { name: "Due Date", type: "Date and time", mc: "due", dir: "two-way" },
        { name: "Initiative", type: "Lookup → Roadmap", mc: "bucket", dir: "two-way" },
        { name: "PRD Requirements", type: "Multi line of text", mc: "reqs", dir: "push" },
        { name: "Estimate", type: "Choice", mc: "estimate", dir: "push", note: "S/M/L" },
        { name: "Repos", type: "Multi line of text", mc: "repos", dir: "push" },
        { name: "Evidence Complete", type: "Yes/No", mc: "evidence", dir: "push" },
        { name: "Description", type: "Multi line of text", mc: "description", dir: "two-way" },
      ],
    },
    {
      key: "roadmap", title: "Roadmap", kind: "list", entity: "Initiative", icon: "◷",
      maps: "Buckets / Initiatives + Gantt", itemCount: 5, direction: "two-way",
      lastSync: "2026.06.09 · 08:14", counts: { synced: 5, pending: 0, conflict: 0, error: 0 },
      columns: [
        { name: "Title", type: "Single line of text", mc: "name", dir: "two-way", required: true },
        { name: "Initiative ID", type: "Single line of text", mc: "id", dir: "pull", required: true },
        { name: "Owner", type: "Person", mc: "owner", dir: "two-way" },
        { name: "Health", type: "Choice", mc: "health", dir: "two-way", note: "On track/At risk/Off track" },
        { name: "Start Date", type: "Date and time", mc: "started", dir: "two-way", note: "Gantt bar start" },
        { name: "Target Date", type: "Date and time", mc: "target", dir: "two-way", note: "Gantt bar end" },
        { name: "% Complete", type: "Number", mc: "progress", dir: "push" },
        { name: "PRD Link", type: "Hyperlink", mc: "prd", dir: "push" },
      ],
    },
    {
      key: "milestones", title: "Milestone Register", kind: "list", entity: "Milestone", icon: "◆",
      maps: "Milestones", itemCount: 5, direction: "two-way",
      lastSync: "2026.06.09 · 08:55", counts: { synced: 5, pending: 0, conflict: 0, error: 0 },
      columns: [
        { name: "Title", type: "Single line of text", mc: "name", dir: "two-way", required: true },
        { name: "Initiative", type: "Lookup → Roadmap", mc: "bucket", dir: "two-way" },
        { name: "State", type: "Choice", mc: "state", dir: "two-way", note: "Upcoming/Active/At risk/Met" },
        { name: "Due Date", type: "Date and time", mc: "col", dir: "two-way" },
        { name: "Register Ref", type: "Single line of text", mc: "sp", dir: "pull" },
      ],
    },
    {
      key: "risks", title: "Risk Register", kind: "list", entity: "Risk", icon: "△",
      maps: "Risks", itemCount: 4, direction: "two-way",
      lastSync: "2026.06.09 · 09:10", counts: { synced: 3, pending: 0, conflict: 1, error: 1 },
      columns: [
        { name: "Title", type: "Single line of text", mc: "title", dir: "two-way", required: true },
        { name: "Initiative", type: "Lookup → Roadmap", mc: "bucket", dir: "two-way" },
        { name: "Likelihood", type: "Choice", mc: "like", dir: "two-way", note: "High/Medium/Low" },
        { name: "Impact", type: "Choice", mc: "impact", dir: "two-way", note: "High/Medium/Low" },
        { name: "Owner", type: "Person", mc: "owner", dir: "two-way" },
        { name: "Status", type: "Choice", mc: "status", dir: "two-way", note: "Open/Mitigating/Closed" },
        { name: "Mitigation", type: "Multi line of text", mc: "mit", dir: "two-way" },
      ],
    },
    {
      key: "documents", title: "Project Documents", kind: "library", entity: "File", icon: "❒",
      maps: "Files / folders", itemCount: 12, direction: "two-way",
      lastSync: "2026.06.09 · 08:48", counts: { synced: 11, pending: 1, conflict: 0, error: 0 },
      folders: "/{Initiative}/PRD · /Evidence · /Deeds · /Reports  +  /Shared",
      columns: [
        { name: "Name", type: "File", mc: "name", dir: "two-way", required: true },
        { name: "Initiative", type: "Lookup → Roadmap", mc: "bucket", dir: "push", note: "folder metadata" },
        { name: "Document Type", type: "Choice", mc: "docType", dir: "two-way", note: "PRD/Evidence/Deed/Report/Spec/Export" },
        { name: "Modified", type: "Date and time", mc: "modified", dir: "two-way" },
        { name: "Modified By", type: "Person", mc: "modifiedBy", dir: "pull" },
      ],
    },
  ],
};
window.MC_SP_LIST = Object.fromEntries(window.MC_SP.lists.map((l) => [l.key, l]));

/* ─── Conflict review queue (manual resolution — a human picks the winner) ─── */
window.MC_SP_CONFLICTS = [
  {
    id: "cf-140", list: "todos", entity: "Task", entityId: "TASK-140", field: "Status",
    mcVal: "In Progress · due Jun 18", spVal: "Blocked · due Jun 20",
    detected: "06:31", by: "dana", note: "Edited in SharePoint while MC also changed it.",
  },
  {
    id: "cf-risk1", list: "risks", entity: "Risk", entityId: "RISK-1", field: "Likelihood",
    mcVal: "Medium", spVal: "High",
    detected: "08:40", by: "ruben", note: "Compliance raised likelihood in the Risk Register.",
  },
];
// A push error that needs a value fix (not a two-sided conflict).
window.MC_SP_ERRORS = [
  {
    id: "er-risk4", list: "risks", entity: "Risk", entityId: "RISK-4", field: "Likelihood",
    value: "Medium", reason: "SharePoint Choice column rejects “Medium” — expects High / Med / Low.",
  },
];

/* ─── Project Documents library content (mirrors a SharePoint doc library) ─── */
// Flat list with parent pointers → easy folder drill-down + breadcrumb.
window.MC_FILES = [
  // Customer Portal v2
  { id: "fo-cpv2", name: "Customer Portal v2", kind: "folder", parent: null, bucket: "BKT-CPV2" },
  { id: "fo-cpv2-prd", name: "PRD", kind: "folder", parent: "fo-cpv2", bucket: "BKT-CPV2" },
  { id: "fo-cpv2-ev", name: "Evidence", kind: "folder", parent: "fo-cpv2", bucket: "BKT-CPV2" },
  { id: "fo-cpv2-deeds", name: "Deeds", kind: "folder", parent: "fo-cpv2", bucket: "BKT-CPV2" },
  { id: "fo-cpv2-rep", name: "Reports", kind: "folder", parent: "fo-cpv2", bucket: "BKT-CPV2" },
  { id: "fi-prd-cpv2", name: "PRD-CPV2 — Customer Portal v2.docx", kind: "doc", parent: "fo-cpv2-prd", bucket: "BKT-CPV2", docType: "PRD", modified: "2026.06.08 · 14:20", modifiedBy: "scribe", size: "48 KB", sync: { state: "synced", ts: "2026.06.08 · 14:21" } },
  { id: "fi-deed-214", name: "Sealed deed — TASK-214.pdf", kind: "pdf", parent: "fo-cpv2-deeds", bucket: "BKT-CPV2", docType: "Deed", modified: "2026.06.09 · 09:08", modifiedBy: "vibes", size: "212 KB", sync: { state: "pending", ts: "2026.06.09 · 09:09" } },
  { id: "fi-ev-214", name: "TASK-214 — E2E evidence bundle.zip", kind: "zip", parent: "fo-cpv2-ev", bucket: "BKT-CPV2", docType: "Evidence", modified: "2026.06.09 · 09:08", modifiedBy: "vibes", size: "1.4 MB", sync: { state: "synced", ts: "2026.06.09 · 09:09" } },
  { id: "fi-shots-214", name: "Before-after — sealed record.png", kind: "img", parent: "fo-cpv2-ev", bucket: "BKT-CPV2", docType: "Evidence", modified: "2026.06.09 · 09:04", modifiedBy: "vibes", size: "640 KB", sync: { state: "synced", ts: "2026.06.09 · 09:05" } },
  { id: "fi-rep-cpv2", name: "Portal v2 — weekly status.xlsx", kind: "sheet", parent: "fo-cpv2-rep", bucket: "BKT-CPV2", docType: "Report", modified: "2026.06.09 · 08:00", modifiedBy: "maya", size: "33 KB", sync: { state: "synced", ts: "2026.06.09 · 08:01" } },
  // MRP Floor Sync
  { id: "fo-mrp", name: "MRP Floor Sync", kind: "folder", parent: null, bucket: "BKT-MRP" },
  { id: "fo-mrp-prd", name: "PRD", kind: "folder", parent: "fo-mrp", bucket: "BKT-MRP" },
  { id: "fo-mrp-rep", name: "Reports", kind: "folder", parent: "fo-mrp", bucket: "BKT-MRP" },
  { id: "fi-prd-mrp", name: "PRD-MRP — Floor Sync.docx", kind: "doc", parent: "fo-mrp-prd", bucket: "BKT-MRP", docType: "PRD", modified: "2026.06.05 · 11:10", modifiedBy: "scribe", size: "41 KB", sync: { state: "synced", ts: "2026.06.05 · 11:11" } },
  { id: "fi-rep-mrp", name: "Supplier lead-time comparison.xlsx", kind: "sheet", parent: "fo-mrp-rep", bucket: "BKT-MRP", docType: "Report", modified: "2026.06.09 · 07:40", modifiedBy: "atlas", size: "28 KB", sync: { state: "synced", ts: "2026.06.09 · 07:41" } },
  // Auth & SSO
  { id: "fo-auth", name: "Auth & SSO Hardening", kind: "folder", parent: null, bucket: "BKT-AUTH" },
  { id: "fo-auth-rep", name: "Reports", kind: "folder", parent: "fo-auth", bucket: "BKT-AUTH" },
  { id: "fi-runbook-auth", name: "Shadow cutover runbook.pdf", kind: "pdf", parent: "fo-auth-rep", bucket: "BKT-AUTH", docType: "Report", modified: "2026.06.08 · 16:30", modifiedBy: "evan", size: "180 KB", sync: { state: "synced", ts: "2026.06.08 · 16:31" } },
  // Shared (cross-initiative)
  { id: "fo-shared", name: "Shared", kind: "folder", parent: null },
  { id: "fi-brand", name: "PLX brand & glyph kit.pdf", kind: "pdf", parent: "fo-shared", docType: "Spec", modified: "2026.06.01 · 11:00", modifiedBy: "lena", size: "2.1 MB", sync: { state: "synced", ts: "2026.06.01 · 11:01" } },
  { id: "fi-trace", name: "Traceability export — PRD-CPV2.xlsx", kind: "sheet", parent: "fo-shared", docType: "Export", modified: "2026.06.09 · 09:14", modifiedBy: "maya", size: "52 KB", sync: { state: "synced", ts: "2026.06.09 · 09:15" } },
];
window.MC_filesIn = (parentId) => window.MC_FILES.filter((f) => (f.parent || null) === (parentId || null));
window.MC_fileById = (id) => window.MC_FILES.find((f) => f.id === id);

/* ─── Sync engine (prototype) ──────────────────────────────────────────────
   Drives the "Sync now" demo: flips pending tasks/files to synced and applies
   one simulated INBOUND change so two-way sync is visible. At handoff this is
   replaced by the Graph delta-query + change webhook pipeline.
   ─────────────────────────────────────────────────────────────────────────── */
window.MC_pendingTasks = () => window.MC_TASKS.filter((t) => t.sync && t.sync.state === "pending");
window.MC_syncCounts = function () {
  let pending = 0, conflict = 0, error = 0;
  window.MC_SP.lists.forEach((l) => { pending += l.counts.pending; conflict += l.counts.conflict; error += l.counts.error; });
  return { pending, conflict, error };
};

// Mark everything pending as synced (outbound push complete).
window.MC_markAllSynced = function (stamp) {
  window.MC_pendingTasks().forEach((t) => { t.sync.state = "synced"; t.sync.ts = stamp; });
  window.MC_FILES.forEach((f) => { if (f.sync && f.sync.state === "pending") { f.sync.state = "synced"; f.sync.ts = stamp; } });
  window.MC_SP.lists.forEach((l) => { l.counts.synced += l.counts.pending; l.counts.pending = 0; l.lastSync = stamp; });
  window.MC_SP.lastSweep = stamp;
  window.MC_persistUserTasks();
};

// Apply a single simulated inbound SharePoint edit (idempotent-ish for demo).
window.MC_INBOUND_DONE = false;
window.MC_applyInbound = function (stamp) {
  if (window.MC_INBOUND_DONE) return null;
  const t = window.MC_TASK_IDX["TASK-188"]; // "Live phase + next-milestone…"
  if (!t) return null;
  window.MC_INBOUND_DONE = true;
  const oldDue = t.due;
  t.due = "Jun 13";
  t.activity = [{ age: "now", who: "dana", what: "↓ inbound from SharePoint — Due Date " + oldDue + " → Jun 13", kind: "sync" }, ...(t.activity || [])];
  return { taskId: "TASK-188", field: "Due Date", from: oldDue, to: "Jun 13", by: "dana", stamp };
};
