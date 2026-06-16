# PLX Mission Control — PM Suite Research Dossier (Cycle 1)

**Date:** 2026-06-15 · **Scope:** MS Planner feature parity + Linear UX polish on PLX Mission Control
**Method:** internal code read (verified file:line), external Planner/Linear spec (knowledge-based, not live-fetched), adversarial verification pass.
**Stance:** simplest correct, reuse-first. PLX_MC already has a board/list/timeline ledger over a real Postgres mirror; the gap is *interaction depth* (drag, filter, group-by, charts, My Tasks), not foundations.

> **Sourcing caveat (carried from external research).** The Planner and Linear specs below are reconstructed from model knowledge (cutoff Jan 2026); no live MS/Linear docs were fetched (outbound network is allowlisted away from those hosts). Treat exact label/enum/limit values (label counts, checklist caps, `percentComplete` 0/50/100, priority 0–10) as *verify-before-hardcoding*. PLX_MC current-state claims below ARE code-verified.

---

## 1. PLX_MC Current-State Map (code-verified)

### 1.1 Data layer
- **Canonical entity shapes:** `src/lib/mc-data/types.ts`.
  - `Task` — `types.ts:139-163`. Fields: `id, title, description?, bucket (FK), stage (9-enum), priority (4-enum), assignee (string|null), coassignees: string[] (:147), reporter, reqs[], repos[], estimate (S|M|L), labels[], prs[], due (display string e.g. "Jun 15"), sync (SyncRef), subtasks[], activity[], evidence?, blocked?, blockedReason?, merge?, userCreated?`.
  - `Bucket` — `types.ts:85-97` (id, name, owner FK, health track|risk|off, target, started, desc, repos[], sync, prd FK, empty?).
  - `StageKey` 9-stage enum — `types.ts:9-18` (backlog→specced→approved→planned→progress→qa→review→merged→verified). `Band` (todo|doing|done) — `types.ts:7`.
  - `PriorityKey` — `types.ts:28` (urgent|high|medium|low). `SyncRef` — `types.ts:76-83`. `Subtask` — `types.ts:106-111`. `Evidence` — `types.ts:131-137`. `Risk` — `types.ts:238-248`. SharePoint schema types — `types.ts:312-376`.
- **Fixtures + helpers:** `src/lib/mc-data/data.ts` (TASKS/BUCKETS/ACTORS/SP_LISTS seed). `src/lib/mc-data/helpers.ts` (`bandOf`, `tasksForUser`, `confidenceOf:67-86`, `evidenceComplete`, `isPetraEmail`).

### 1.2 Views / screens
- **Registry:** `src/components/mc/screens.tsx` — 11 screen keys (home, board, list, timeline, matrix, feed, bucket, repos, files, sync, task).
- **Routing:** `src/components/mc/route.ts` — `Route { screen, bucketId?, taskId? }` + `nav()` callback held in `shell.tsx` `useState`. No URL router; in-memory route object.
- **Work-views (board/list/timeline):** `src/components/mc/work-views.tsx`.
  - View switcher tabs — `work-views.tsx:369-386`. Board renders at `:457-459`, List `:460`, Timeline `:461` — **all open tasks via click only (`onOpen`), no drag**.
  - Board controls: Stages segment (3-band / Full lifecycle) `:389-407`; Swimlanes segment (Off / Human·Agent) `:408-424`.
  - List control: Group segment (bucket / status / assignee) `:427-443`.
  - Grouping logic: `src/components/mc/work-views.helpers.ts` — `BoardGrouping = "band"|"full"` (:4), `BoardSwimlanes = "off"|"agents"` (:5), `ListGroupBy = "bucket"|"status"|"assignee"` (:6); `partitionTasksByColumn` (:26), `partitionSwimlanes` (:43), `groupTasksForList` (:66), timeline math `dueDay/spanOf/timelineRangeForTask` (:110-156). Timeline is a **fixed June grid** (`MONTH_GRID_OFFSET` :106-108, `TIMELINE_DEFAULT_END_DAY=24` :11).
- **Task detail:** `src/components/mc/task-detail.tsx` (meta, evidence bundle, subtasks read-only, activity, PeoplePicker reassign). **New Task modal:** `src/components/mc/new-task-modal.tsx` (single owner picker; no coassignee/label editor).
- **Command palette (⌘K):** `src/components/mc/command-palette.tsx` — groups Create/Navigate/Buckets/Tasks/Assign-agents (:59-135). Working: nav + task/bucket jump + New task. **Stub no-ops:** New bucket (:64), Draft PRD (:70), Assign agents (:125).
- **Reactivity:** single `useMcVersion()` hook (`src/lib/mc-data/hooks.ts`) over `useSyncExternalStore`; components call store getters directly.

### 1.3 API / persistence (REAL, Postgres-backed)
- **Client store:** `src/lib/mc-data/store.ts` — frozen getter/action surface; optimistic-local-first, mirrors mutations to API and hydrates from `GET /api/state` (`hydrate` :228-247, `applyServerState` :188-204). Degrades to last-synced local state if server unreachable (`serverCall` :167-172).
- **Server state surface:** `src/lib/sync/state.ts` — `snapshot()` reads all entities from Postgres (:23-46); `createTask()` writes via `repo.insertEntity(... "pending" ...)` (:92); `patchTask()` writes via `repo.updateEntity` (:119-125).
- **Routes (envelope-wrapped):** `POST /api/tasks` (`src/app/api/tasks/route.ts`, Zod `createTaskSchema`), `PATCH /api/tasks/[id]`, `GET /api/state`, `POST /api/sync/sweep`, `POST /api/sync/conflicts/[id]/resolve`, `POST /api/sync/errors/[id]/retry`.
- **Route wrapper:** `src/lib/api/route.ts:23-42` — enforces `{ data }` / `{ error: { code, message } }`; `parseBody` (:44-59) requires Zod on bodies. Client unwrap: `src/lib/api/index.ts`.
- **DB:** `src/lib/db/index.ts` (single pooled `pg` client, parameterized `query()`, explicit timeouts per LESSONS 2026-06-11). Migrations 001–004 present: `delta_links`, `sync_conflicts`+`sync_push_errors`, `sync_audit_log`, `entities` (jsonb payload + sync columns). Runner `scripts/migrate.mjs`.

### 1.4 Sync engine
- `src/lib/sync/engine.ts` — `runSweep()` (inbound-delta-first, then outbound push of pending, then audit append); `ensureSeeded()` bootstraps fixtures into Postgres as `pending`. Conflicts are **manual-resolution only**.
- **Scheduler:** `src/lib/sync/scheduler.ts` — 5-min cadence, **kill-switched OFF by default** (`PLX_MC_SYNC_ENABLED==="1"` required, :12-14). Mapping `src/lib/sync/mapping.ts`, Graph client `src/lib/sync/graph.ts`.
- **State today:** seeded tasks are `pending`/"unprovisioned" until a live SharePoint site is wired — no fabricated sync evidence.

### 1.5 Styling / gates
- **Tokens:** `src/styles/brand-tokens.css` (`--p-*` PLX mirror at `:root[data-brand="plx"]`/`.brand-plx`) + surface extensions `src/styles/mc-surface.css` (`--p-rail`, `--p-canvas`, scoped `.mc`, per ADR-004). Per-screen CSS: `mc-app/views/task/record/overview/authoring.css`.
- **Confidence "ring" is CSS, not a chart:** `atoms.tsx:48-51` sets `--pct` for a conic-gradient ring. **No SVG/chart/d3/recharts anywhere** (grep-confirmed zero matches in `components/mc`).
- **Gate:** `scripts/preflight.sh` (pre-commit / pre-push / ci modes) → governance + `check-repo-hygiene.py` + `check-migrations.py`; quick = typecheck/ruff/canary; full (pre-push) = `vitest run` + `next build`. **Note:** the VMC `check-vmc-theme-tokens.py` soft-gate lives in the parent swarm repo, not in PLX_MC.

---

## 2. GAP MATRIX — MS Planner feature × Linear polish vs PLX_MC today

| # | Capability (Planner / Linear) | PLX_MC today | Status | Evidence / note |
|---|---|---|---|---|
| **Buckets / columns** |||||
| 1 | Buckets as board columns | Buckets exist as data + sidebar nav; board columns are *stages/bands*, not buckets | **Partial** | `types.ts:85`; board groups by stage only (`work-views.helpers.ts:18-24`) |
| 2 | Inline add bucket / rename / reorder / delete | None; "New bucket" is a palette no-op | **Missing** | `command-palette.tsx:64` |
| **Board interactions** |||||
| 3 | Kanban board view | Present (3-band & full-lifecycle) | **Present** | `work-views.tsx:457-459` |
| 4 | Drag card between columns → mutate property | None — click-to-open only | **Missing** | grep: zero `onDrag/onDrop/draggable/dnd` in `src/` |
| 5 | Inline "+ Add task" per column | None — only global New Task modal | **Missing** | `new-task-modal.tsx` |
| 6 | Quick complete / hover quick-actions on card | None | **Missing** | card = `atoms.tsx` chips, no actions |
| 7 | Slide-out task detail panel | Full-screen task *route* (not slide-out) | **Partial** | `task-detail.tsx` via `nav("task")` |
| **Group-by / re-pivot** |||||
| 8 | Group by Bucket / Assignee / Progress / Priority / Due / Label | List: bucket/status/assignee only; Board: stage/band + agent swimlane | **Partial** | `work-views.helpers.ts:6`; no priority/due/label/bucket-as-column pivot |
| 9 | Multi-membership cards (assignee/label appear in N columns) | Not modeled in any view | **Missing** | partition fns assign one column (`:26-35`) |
| **Charts / insights** |||||
| 10 | Status doughnut / bucket bar / member bar / priority chart | None (confidence ring is per-task CSS) | **Missing** | no chart lib; `atoms.tsx:48` |
| 11 | Burndown / burn-up (Linear; not native Planner) | None | **Missing** | enhancement, not parity baseline |
| 12 | Interactive drill-down (click slice → filter) | None | **Missing** | — |
| **Schedule / calendar** |||||
| 13 | Timeline / Gantt | Present (fixed June grid) | **Partial** | `work-views.tsx:461`; no month/zoom picker |
| 14 | Calendar month/week grid + unscheduled panel | None (Gantt only) | **Missing** | — |
| 15 | Drag-to-schedule on calendar | None | **Missing** | depends on #4 |
| **Task fields** |||||
| 16 | Multiple assignees (coassignees) editable | Field + API exist; **UI edits primary `assignee` only** | **Partial** | `types.ts:147`, schema `tasks/route.ts:17`; modal/detail set single assignee (`store.ts:364`) |
| 17 | Progress / priority / dates / notes / estimate | Present (priority, due, estimate, description) | **Present** | `new-task-modal.tsx`, `types.ts:144-154` |
| 18 | Checklist (subtasks) with show-on-card | Subtask data present; **read-only, no mutation UI** | **Partial** | `types.ts:106-111`; no add/toggle action in store |
| 19 | Labels: plan-scoped palette, multi-select, filter | `labels[]` rendered as chips; no picker, no label filter | **Partial** | `atoms.tsx:130`; no editor |
| 20 | Attachments / cover image / comments thread | Evidence bundle + PRs present; no generic attachment/comment thread | **Partial** | `types.ts:131-137` |
| **My Tasks** |||||
| 21 | Cross-plan "Assigned to me" view | Inbox shows top-5 assigned; no switchable view | **Partial** | `inbox.tsx` (`tasksForUser`) |
| **Filtering** |||||
| 22 | Filter bar (due/priority/progress/label/assignee) + search | None in-view; bucket-scope only | **Missing** | `work-views.tsx` has no filter control |
| 23 | Saved / shared custom views | None | **Missing** | route has no saved-view concept |
| **Linear UX polish** |||||
| 24 | ⌘K command menu | Present (nav + create + jump) | **Present** | `command-palette.tsx:59-135` |
| 25 | Keyboard-first (single-key actions, G/O chords, multi-select) | ⌘K + Esc only; no single-key/chords/X-select | **Partial** | `shell.tsx` palette toggle; no view hotkeys |
| 26 | Display-properties (show/hide card fields) | Fixed card layout | **Missing** | — |
| 27 | List↔board parity over one model | Board/list/timeline share `allTasks()` + filter; toggle via tabs | **Partial** | `work-views.tsx:320-328` (shared source, separate renderers) |
| 28 | Optimistic updates / undo | Optimistic store writes present; **no undo** | **Partial** | `store.ts:167-172, 311-321`; no `Cmd+Z` |
| 29 | Calm/low-chrome visual language + tokens | `--p-*` token system + calm empty state already in place | **Present** | `brand-tokens.css`, `work-views.tsx:450-454` |
| 30 | Bulk select + bulk actions | None | **Missing** | — |

**Headline:** foundations (board/list/timeline, ⌘K, real persistence, tokens, manual-conflict sync) are **Present**; the high-value Planner/Linear gaps cluster in **drag-to-mutate, group-by/filter, charts, My Tasks, and inline editing (labels/subtasks/multi-assign)**.

---

## 3. Wired-vs-Fixture Reality (persistence)

**Persistence is genuinely wired to Postgres — not fixture-only.** Corrected from an earlier "fixture-only" framing.

- **Writes hit the DB.** `createTask` → `repo.insertEntity("task", …, "pending", [])` (`state.ts:92`); `patchTask` → `repo.updateEntity` (`state.ts:119`). The `entities` table (migration 004) is the canonical mirror.
- **Reads hydrate from the DB.** `GET /api/state` → `snapshot()` reads `repo.getEntities(...)` (`state.ts:23-46`); the client store adopts it via `applyServerState` (`store.ts:188-204`).
- **Fixtures are the *seed*, not the runtime store.** `data.ts` fixtures are inserted into Postgres once by `ensureSeeded()` (engine) on first snapshot; thereafter the DB is source of truth. The in-memory `initialState()` (`store.ts:61-76`) is only the optimistic/SSR/offline fallback.
- **Two important caveats for Cycle-1 planning:**
  1. **`patchTask` supports a narrow field set only** — `assignee, title, stage, priority, due, description` (`state.ts:97-104`); and **only `title/stage/priority/due/description` are "pushed" fields** (`PUSHED_FIELDS` :106). New mutable fields (labels, subtasks, coassignees, bucket-move) need both a store action AND a `patchTask`/schema extension to persist.
  2. **Assignee is NOT mirrored to SharePoint yet** — `patchTask` explicitly skips re-queueing on assignee-only patches ("deferred to the directory increment", `state.ts:121-123`). ⚠️ The client `store.reassignTask` audit text claims "mirrored to SharePoint" (`store.ts:392, 396`) which is optimistic-UI copy only; the server does not push it. Flag for reconciliation.
- **SharePoint round-trip is real code but dormant.** Engine + scheduler exist; scheduler is OFF by default (`scheduler.ts:12`) and all seeds are `pending` until a live site is provisioned. No fabricated sync evidence.

**Implication:** any Cycle-1 module that adds an editable field must ship the store action + API/Zod + (if pushable) `patchTask`/mapping change **together**, or the edit is optimistic-only and lost on next hydrate.

---

## 4. Recommended Cycle-1 Module Set (3–4 modules, reuse-first)

**Theme:** "Make the board *interactive* and *pivotable* without adding heavy deps." Sequenced so each builds on the last; all reuse the existing store/types/helpers and CSS tokens.

### Module A — Re-pivotable Board: group-by + filter bar (reuse-first, NO new deps)
- **What:** Extend board/list grouping to the Planner axes (priority, due-bucket, label, and bucket-as-columns) and add a top filter bar (priority / assignee / label / due / stage + text search) shared across board/list/timeline.
- **Reuse:** generalize `work-views.helpers.ts` partition/group functions (already typed and unit-tested via `mc-views.test.ts`); reuse `confidenceOf`, `bandOf`, `tasksForUser`. Filter is a pure client predicate over `allTasks()` — **no persistence needed**, so no API/migration risk.
- **Why first:** highest Planner-parity value (gaps #8, #22), zero dependency/persistence cost, and it establishes the shared "query model" Linear-parity (#27) depends on.
- **Native vs add-dep:** **Native.** Pure TS/React over existing data. No library.

### Module B — Drag-to-mutate board (the signature Planner/Linear interaction)
- **What:** Drag a card between columns to set the grouped property (stage when grouped by stage; priority/assignee/bucket when grouped by those, per Module A); optimistic update + persist.
- **Reuse:** `store.reassignTask` already does the optimistic+PATCH pattern — clone it for a generic `setTaskField` (stage/priority/bucket). **Requires** extending `patchTask` + `createTaskSchema`/patch schema to accept `bucket` (and confirm stage/priority already in `PatchTaskInput` :97-104 — they are).
- **Why second:** depends on Module A's column model; it's the top "feel" gap (#4, #15).
- **Native vs add-dep — DECISION POINT:**
  - **Recommended: native HTML5 drag-and-drop** (`draggable` + `onDragStart/onDragOver/onDrop`). Card→column reordering is coarse-grained (drop into a column, not pixel-precise sorting), which HTML5 DnD handles fine, keeps bundle at zero new deps, and honors "Simplify Relentlessly."
  - **Escalate to `@dnd-kit/core` only if** Cycle-2 needs fine-grained within-column ordering, keyboard-accessible drag, or touch — `@dnd-kit` is the modern, accessible, tree-shakeable choice (avoid `react-beautiful-dnd`, effectively unmaintained). Defer this dep until that requirement is real.

### Module C — Inline task editing: labels, subtasks, multi-assign (close the field gaps)
- **What:** Inline label picker + subtask add/toggle + coassignee multi-select on the task detail panel and (labels) on cards.
- **Reuse:** fields already exist in `types.ts` (`labels[]` :152, `subtasks[]` :156, `coassignees[]` :147); `people-picker.tsx` already does directory typeahead + Petra-domain invite — reuse for coassignees. New Task modal already has the form scaffolding.
- **Why third:** closes gaps #16/#18/#19; depends on the persistence extension pattern proven in Module B.
- **Native vs add-dep:** **Native.** Reuses `people-picker.tsx`. **Persistence prerequisite:** extend `patchTask` + Zod schema for `labels`, `coassignees`, and a subtask-mutation path — otherwise edits are optimistic-only (see §3). Decide whether labels/subtasks are SharePoint-pushed now or deferred like assignee.

### Module D (stretch / pick 3 of 4) — "My Tasks" view + charts deferred decision
- **Option D1 (lighter, recommended for Cycle 1):** dedicated **My Tasks** screen — new `route.screen="mine"`, reuse `tasksForUser(CURRENT_USER, allTasks())` (already used by inbox) rendered through the Module A board/list with auto-filter. Closes gap #21, ~no new primitives.
- **Option D2 (heavier, recommend deferring to Cycle 2):** **Charts/insights** (status doughnut + bucket/member bars).
  - **Native vs add-dep — DECISION POINT:** a status doughnut + stacked bars are *simple* enough to render as **native SVG/CSS** (matches the existing CSS-ring precedent, zero deps, full token control). Reach for a library only if interactive drill-down + multiple chart types land in one cycle; if so, **Recharts** (declarative, React-native, good tree-shaking) over heavier D3-direct. **Recommendation:** if charts make Cycle 1, do the doughnut + one bar chart in native SVG; defer any chart library to Cycle 2 when drill-down (#12) is scoped.

**Suggested Cycle-1 commit:** **A → B → C → D1** (defer charts). This is one coherent theme ("interactive, pivotable board + complete task fields + my-tasks"), reuse-maximal, and adds **zero runtime dependencies**.

### Dependency / sequencing
```
A (group-by + filter, pure client) ──┬─> B (drag-to-mutate, needs A's columns + patch ext)
                                      └─> D1 (My Tasks, renders through A)
B (proves field-persist pattern) ─────> C (inline label/subtask/multi-assign edits)
D2 charts ── DEFER to Cycle 2 (native SVG first; library only with drill-down)
```

---

## 5. Open Questions / Risks

1. **Assignee-mirror inconsistency (data-integrity).** `store.reassignTask` audits "mirrored to SharePoint" but `patchTask` does not push assignee (`state.ts:121-123`). Resolve the truth before Module C ships multi-assign, or the UI will keep over-claiming. **Owner needed.**
2. **Persistence scope per field.** For each new editable field (label, subtask, coassignee, bucket), decide now: optimistic-only, DB-persisted (`entities`), or SharePoint-pushed? Each tier adds work (store → Zod/`patchTask` → mapping). Don't ship half (per §3 caveat + CLAUDE.md "fail visibly").
3. **Buckets-as-columns vs stage lifecycle.** Planner's primary axis is buckets; PLX_MC's is the 9-stage gated lifecycle. Confirm product intent: do we add bucket-as-column grouping (Module A) *alongside* the stage board, or reframe? Affects whether "drag = change bucket" or "drag = change stage."
4. **Timeline scope.** Current timeline is a hardcoded June grid (`work-views.helpers.ts:106-108`). A true calendar/month-picker (gap #13/#14) is a Cycle-2 size; Cycle 1 should not silently expand it.
5. **Multi-membership rendering.** Group-by-assignee/label where a card appears in N columns (Planner semantics, gap #9) changes the partition contract (one task → many cells). Decide if Cycle-1 group-by supports it or treats labels/coassignees as single-cell for now.
6. **Drag persistence race.** Optimistic drag + the 5-min sweep + manual conflict queue could surface conflicts on rapid edits. Reuse the existing conflict path; add a test (`mc-views`/`mc-store`) for drag→PATCH→hydrate.
7. **External spec freshness.** Planner enum/limit values (label count 6 vs 25, checklist cap, `percentComplete`/priority integer scales) are unverified knowledge. Verify against live MS docs or Graph schema before encoding any of them as constraints.
8. **Keyboard-parity creep.** Linear's full keyboard grammar (single-key + chords + multi-select) is large; scope Cycle 1 to ⌘K + a couple of view hotkeys, not the whole grammar (gap #25), to avoid over-build.

---

*Anchors verified against working tree at `C:/Users/vince/PLX_MC` on 2026-06-15. Line numbers are load-bearing; re-confirm after any refactor.*
