# PLX Mission Control — CYCLE-1 Implementation Spec (WINNING / Synthesized)

**Status:** Approved architecture for build. **Author:** Lead architect (synthesis of 3 proposals + 3 judge scorecards).
**Lens:** Correctness-first execution (Approach 3 base) · unified `GroupBy` query model (Approach 2 graft) · reuse-max discipline + bucket-deferral rationale + clean PR sequencing (Approach 1 graft).
**Verified against the working tree at `C:/Users/vince/PLX_MC` on 2026-06-16.** Line numbers are load-bearing; re-confirm after any refactor.
**Zero new runtime dependencies. Native HTML5 DnD. No DB migration.**

---

## 0. Overview & Goals

Cycle 1 turns the Mission Control board from a read-mostly surface into an **interactive, pivotable, editable** task workspace at Linear fidelity — without inventing new persistence machinery, new dependencies, or fabricated sync claims.

**Goals (in priority order):**
1. **No half-wired field.** Every field that becomes editable in the UI has its full persistence chain in place *in the same PR* — store action → `PatchTaskInput` allow-list → Zod schema → `repo.updateEntity` → and is either pushed to SharePoint (with an `outboundFields` mapping) or explicitly classified **DB-only** with the UI telling that truth. The failure mode we are eliminating: optimistic-only edits silently dropped on the next `GET /api/state` hydrate (`store.ts:188-208`).
2. **One re-pivotable board.** Generalize the board's single column axis into a configurable `GroupBy` (stage / band / bucket / priority / assignee), surfaced as a toolbar segment. The 9-stage lifecycle stays the default.
3. **Drag-to-mutate.** Dragging a card to a column sets the field the board is grouped by, optimistically and persistently.
4. **Inline editing.** Labels, subtasks, and co-assignees become editable on the task detail (and labels render on cards), all DB-persisted.
5. **My Tasks.** A first-class `mine` view that reuses the board/list pre-filtered to the current user.
6. **Honest sync copy.** Reconcile the client's assignee-mirror copy to match the server's already-honest audit voice — do not fabricate a SharePoint person-column push.

**Non-goals for Cycle 1 (explicitly deferred to Cycle 2):** charts/insights (native-SVG-first when scoped); calendar / month-picker (timeline stays the fixed June grid, `work-views.helpers.ts:106-108`); true multi-membership group-by (a card in N columns); within-column reordering, touch-drag, keyboard-drag (escalate to `@dnd-kit/core` only then); saved/shared views; bulk-select; undo; URL router; real SharePoint person-column / lookup writes (`Assigned To`, `Initiative`); the no-op palette commands (New bucket, Draft PRD, Assign agents).

**Architecture in one paragraph.** A single generic persisted-mutation primitive — `patchTaskFields` in the store, modeled on the existing `reassignTask` (`store.ts:364-404`) — is the spine. `reassignTask` becomes a thin wrapper over it (and its lying copy is fixed). All Cycle-1 mutations (drag, inline edits) route through this one tested call, so persistence is never reinvented per feature. A unified `GroupBy` union in `work-views.helpers.ts` replaces the two ad-hoc grouping types (`BoardGrouping`, `ListGroupBy`) and drives board + list from one column model. A per-field **persistence tier table** (locked in `state.ts` and asserted by tests) classifies every field as `SP` (DB + SharePoint push) or `DB` (Postgres-only, honestly un-pushed). No field is `OPT` (optimistic-only) — that is the eliminated failure mode.

---

## 1. Resolved Open Questions

### (i) Board primary grouping — buckets-as-columns vs the 9-stage lifecycle → **configurable `GroupBy`, stage stays default.**

Neither is "primary"; group-by is a user choice. Generalize the board's column axis to a single union and let the user pick from the toolbar.

```ts
export type GroupBy = "band" | "stage" | "bucket" | "priority" | "assignee";
```

- **Default = `band`** (the current default, `work-views.tsx:323`). The 9-stage gated lifecycle is the product's spine (gates render at `work-views.tsx:100-102`; `confidenceOf`/`Spine` derive from `stage`; the lifecycle rail is `task-detail.tsx:389-417`), and the 3-band / full-lifecycle stage views both remain.
- **Bucket-as-columns is a peer option,** not a reframe — it satisfies Planner's bucket-first muscle memory.
- **`assignee` and `label`-style axes are single-cell in Cycle 1.** A task lands in exactly one column (its primary `assignee`, or "Unassigned"). This preserves the disjoint+complete partition invariant the existing tests assert (`mc-views.test.ts:13-45`). True multi-membership (a card in N columns) is **deferred to Cycle 2**.
- **This decides drag semantics (resolves the research's drag-meaning question):** *drag = set the field the board is grouped by.* See §5 Module B for the exact axis→action map.

### (ii) Per-field persistence tier → **decided per field in §4; no field ships half-wired.**

The decisive code fact: `entities.data` is a **whole-`Task` jsonb blob** (`db/migrations/004_entity_mirror.sql:9-21`), and `repo.updateEntity` does `{...row.data, ...patch}` (`repo.ts:82`). Therefore **DB persistence of any existing `Task` field needs NO migration** — only (a) a `PatchTaskInput` allow-list entry (`state.ts:97-104`), (b) a `patchTaskSchema` Zod entry (`[id]/route.ts:9-17`), and (c) a store action. SharePoint push is a strictly heavier, separate tier (`PUSHED_FIELDS` membership + an `outboundFields` mapping, `mapping.ts:66-81`).

Three tiers, matching the codebase's real seams:
- **`SP`** (DB + SharePoint outbound): in `PUSHED_FIELDS` (`state.ts:106`) **and** has an `outboundFields` case (`mapping.ts:69-80`). Persists to Postgres *and* re-queues the entity for push (`syncState: "pending"`, `state.ts:123`).
- **`DB`** (Postgres-only, honestly un-pushed): in `PatchTaskInput` + Zod + a store action, but **omitted** from `PUSHED_FIELDS` and `outboundFields`. Survives hydrate; never flips the entity to pending-for-push; the UI never claims a sync it didn't do. This is the honest home for the person/lookup/array fields the mapping layer deliberately defers (`mapping.ts:6-8`).
- **`OPT`** (optimistic-local only, lost on hydrate): **forbidden for any editable field. Cycle 1 ships nothing in this tier.**

### (iii) Assignee-mirror inconsistency → **fix the client COPY; do NOT fake the push.**

The server is **already honest**: `patchTask` deliberately does not re-queue person columns (`state.ts:121-123`), and its audit text already reads *"Assigned To mirror deferred to the directory increment"* (`state.ts:131-133`). `mapping.ts:6-8` documents person/lookup columns as deliberately unmapped pending the M365 directory increment. The bug is purely the **client copy**, which claims a mirror that did not happen, in four sites:
- `store.ts:371` — activity: `"unassigned — mirrored to SharePoint"`
- `store.ts:392` — activity: `"reassigned to {name} — mirrored to SharePoint · notified via Teams + email"`
- `store.ts:396` — audit: `"Reassigned {id} to {name} — Assigned To mirrored."` (and the unassign audit at `store.ts:374`: `"Assigned To cleared in SharePoint."`)
- `people-picker.tsx:207-209` — `NotifyTrail` `title` + body text: `"Mirrored to SharePoint · notified via Teams + email"`. Fixing the `NotifyTrail` component copy once fans out to **both** consumers: the picker and the New Task modal (`new-task-modal.tsx:253`, `<NotifyTrail id={ownerId} />`). Confirm the deferred-truth copy reads sensibly at task-creation time (nothing is queued yet at creation) — or suppress the trail in the modal until an owner is actually assigned on an existing task.

**PR-0** rewrites these to the server's deferred-truth voice, fixes the **one** test that *asserts the lie* (`mc-store.test.ts:96`, `toContain("mirrored to SharePoint")`), and (crucially) makes "persist a task field" a single tested call so Modules B and C cannot each reinvent (and half-wire) persistence. This unblocks Module C's multi-assign without compounding the false claim.

**Test-target precision (load-bearing — do not "fix" `:104`).** Only `mc-store.test.ts:96` asserts the lie. The unassign assertion at `:104` is `toContain("unassigned")`, and the honest replacement copy (`"unassigned — Assigned To mirror deferred to the directory increment"`) **still contains `"unassigned"`** — so `:104` passes both before and after the fix and is **not** a lie-assertion. Reuse `:104` as-is (optionally strengthen it to also assert `"deferred to the directory increment"`); do not weaken or delete it. The genuine unassign lie lives in the **audit** entry (`store.ts:374`: `"Assigned To cleared in SharePoint."`, with `pushAudit` state wrongly `"synced"`) — that one has **no** test today, so the §6 regression must add fresh assertions for it (see §6).

**Client audit ≠ server audit (independent optimistic entry).** The client `pushAudit` writes a *separate optimistic local* audit row that need not be byte-identical to the server's. The server audit (`state.ts:131-132`) deliberately omits the assignee name (`Reassigned ${id} — …`), so the client string below intentionally carries the extra `to ${who.name}` for the local trail — this is a documented divergence, not "the server's voice." **The server text is frozen — do not edit `state.ts:131-132` to add the name.** If strict parity is later desired, drop the name from the *client* copy to match the server; never widen the server.

---

## 2. The Shared Mutation Spine (PR-0 — the architectural pillar)

Today there is exactly one client action that mutates a task and persists it: `reassignTask` (`store.ts:364-404`). It is assignee-special-cased and its copy lies. **Generalize it into the single persisted-mutation path** that every Cycle-1 mutation hangs off.

### 2.1 Server: extend `patchTask` + lock the tier table (`src/lib/sync/state.ts`)

- `assignee` is **already wired** end-to-end (`PatchTaskInput` `state.ts:98`, Zod `route.ts:10`, server branch `state.ts:121-135`). PR-0 does **not** touch its server/schema/allow-list — its only PR-0 work is the **client copy fix** + the `reassignTask` rewrap. The four genuinely-new DB-only fields are `bucket`/`labels`/`coassignees`/`subtasks`. Extend `PatchTaskInput` (`state.ts:97-104`) with **only those four**:
  ```ts
  export interface PatchTaskInput {
    assignee?: string | null;   // already present — copy-only fix in PR-0
    title?: string;
    stage?: Task["stage"];
    priority?: Task["priority"];
    due?: string;
    description?: string;
    bucket?: string;            // NEW — DB-only (see §4)
    labels?: string[];          // NEW — DB-only
    coassignees?: string[];     // NEW — DB-only
    subtasks?: Task["subtasks"];// NEW — DB-only (Subtask[])
  }
  ```
- **Leave `PUSHED_FIELDS` (`state.ts:106`) exactly as-is:** `["title", "stage", "priority", "due", "description"]`. None of the new fields join it in Cycle 1 (see §4 rationale). The existing `pushedDirty`/`syncState` gate (`state.ts:116-123`) then *automatically* gives the correct behavior: a `labels`-only or `bucket`-only patch persists to `data` but does **not** flip `sync_state` to pending and does **not** re-queue for push.
  > **Note:** `PUSHED_FIELDS` is *not* the only outbound surface — it gates only whether a patch flips `sync_state` to pending. What a sweep actually serializes is decided independently by `outboundFields` (`mapping.ts:66-81`), which already maps a **superset** (`reqs`/`estimate`/`repos`/`evidence` — `mapping.ts:77-80`) not present in `PUSHED_FIELDS`. A field is DB-only/SP-safe only when it is in **neither** `PUSHED_FIELDS` *nor* `outboundFields`. All four new fields satisfy that (no `outboundFields` case), which is what makes them honestly un-pushed.
- The `assignee` audit branch (`state.ts:127-135`) is already correct — **do not touch it.**
- Add a short doc comment above `PUSHED_FIELDS` naming the DB-only fields and the Cycle-2 promotion path, so the tier decision is auditable in code:
  ```ts
  // Persistence tiers (Cycle 1):
  //   SP  (pushed): title, stage, priority, due, description  ── below
  //   DB  (jsonb-only, NOT pushed):
  //       newly-added this cycle: bucket, labels, coassignees, subtasks
  //       already-wired (copy-only fix, not a new allow-list entry): assignee
  //       bucket/labels promote to SP in Cycle 2 once the Initiative lookup-id
  //       resolution and a Labels SP column exist (see mapping.ts:6-8).
  const PUSHED_FIELDS = ["title", "stage", "priority", "due", "description"];
  ```

### 2.2 Server route: extend Zod (`src/app/api/tasks/[id]/route.ts`)

Add to `patchTaskSchema` (`[id]/route.ts:9-17`), reusing the existing `STAGES` const already in the file:
```ts
const subtaskSchema = z.object({
  id: z.string(),
  t: z.string(),
  done: z.boolean(),
  who: z.string(),
});

const patchTaskSchema = z.object({
  actor: z.string().min(1),
  assignee: z.string().nullable().optional(),
  title: z.string().min(1).optional(),
  stage: z.enum(STAGES).optional(),
  priority: z.enum(["urgent", "high", "medium", "low"]).optional(),
  due: z.string().optional(),
  description: z.string().optional(),
  bucket: z.string().min(1).optional(),                 // NEW
  labels: z.array(z.string()).max(25).optional(),        // NEW — soft cap (see Risk R6)
  coassignees: z.array(z.string()).optional(),           // NEW
  subtasks: z.array(subtaskSchema).optional(),           // NEW
});
```
The `subtasks` object array is the only non-scalar patch field — validate it strictly (Risk R5) so a malformed inline edit can't corrupt `entities.data`.

### 2.3 Client store: one generic action + thin wrappers (`src/lib/mc-data/store.ts`)

Add **one** generic action, modeled exactly on `reassignTask`'s optimistic+PATCH shape, and re-express `reassignTask` as a wrapper:

```ts
export type TaskFieldPatch = Partial<
  Pick<Task, "stage" | "priority" | "bucket" | "labels" | "coassignees" | "subtasks" | "assignee">
>;

// The single persisted task mutation: optimistic local apply + honest activity,
// emit(), then mirror to PATCH /api/tasks/{id}. On success adopt the server's
// returned task so optimistic state reconciles to DB truth (closes the
// "optimistic-only, lost on hydrate" gap). A no-op when the patch is empty.
export function patchTaskFields(taskId: string, patch: TaskFieldPatch, opts?: { activity?: string }) { /* ... */ }
```

Then the additive, FROZEN-surface-respecting wrappers used by B and C (each delegates to `patchTaskFields`):
- `setTaskStage(taskId, stage)`, `setTaskPriority(taskId, priority)`, `setTaskBucket(taskId, bucket)`
- `setTaskLabels(taskId, labels)`, `addSubtask(taskId, text, who)`, `toggleSubtask(taskId, subtaskId)`, `setCoassignees(taskId, ids)`
- `reassignTask(taskId, actorId)` → wrapper over `patchTaskFields({ assignee })` with the **honest** copy.

**Honest copy (PR-0).** Replace the four lying strings with the server's deferred-truth voice, e.g.:
- reassign activity → `` `reassigned to ${who.name} — Assigned To mirror deferred to the directory increment` ``
- unassign activity → `"unassigned — Assigned To mirror deferred to the directory increment"`
- reassign audit (`store.ts:396`) → `` `Reassigned ${taskId} to ${who.name} — Assigned To mirror deferred to the directory increment.` `` — **`pushAudit` state must change from `"synced"` to `"pending"`** (the current `"synced"` is the audit-level lie). The client log intentionally keeps `to ${who.name}` even though the server audit (`state.ts:132`) omits it — independent optimistic entry, see §1(iii).
- unassign audit (`store.ts:374`, currently `"Assigned To cleared in SharePoint."` + state `"synced"`) → `` `Unassigned ${taskId} — Assigned To mirror deferred to the directory increment.` `` — **state likewise `"synced"` → `"pending"`.**

**Subtask id generation:** `SUB-${max+1}` scoped to the task (mirror `nextTaskId` style, `store.ts:249-252`).

**Wrapper bodies — illustrative (drag/inline call sites):**
```ts
export const setTaskStage = (taskId: string, stage: Task["stage"]) =>
  // Stage display name via the existing STAGES/STAGE_IDX pattern (task-detail.tsx:96,
  // work-views.tsx:183) — there is NO STAGE_IDX_NAME map; do not invent one (Pillar 3).
  patchTaskFields(taskId, { stage }, { activity: `moved to ${STAGES[STAGE_IDX[stage]].name} — pending push` });
export const setTaskLabels = (taskId: string, labels: string[]) =>
  patchTaskFields(taskId, { labels }, { activity: "updated labels" }); // DB-only — no sync claim
```

### 2.4 Why PR-0 must land first (non-negotiable ordering)

Modules B and C both write task fields. If either lands before PR-0, it will either duplicate the optimistic+PATCH boilerplate or write through a path that doesn't extend `patchTask`, producing exactly the "editable but silently dropped on hydrate" bug this spec exists to prevent. PR-0 makes "persist a task field" a single tested call and resolves OQ (ii)+(iii).

---

## 3. Module Set & Scope Boundaries

Sequence **PR-0 → A → B → C → D1.** Each PR is independently shippable and green through `scripts/preflight.sh --mode pre-push`.

| PR | Module | Scope (IN) | Scope (OUT — explicit) | Persistence |
|----|--------|------------|------------------------|-------------|
| **PR-0** | Shared mutation spine + assignee-mirror honesty | `patchTaskFields` + wrappers; extend `PatchTaskInput` + Zod for the 4 new fields; tier-table comment; fix the 4 lying copy sites + 2 tests. **No new UI.** | Any real person/lookup push; M365 identity | Foundation |
| **A** | Re-pivotable board + filter bar | Unified `GroupBy` union (stage/band/bucket/priority/assignee); shared pure `applyFilters` predicate over `allTasks()`; Linear-grade filter bar across board+list; group-by drives both board and list | Saved/shared views; display-property show/hide; URL-encoded filters; multi-membership; calendar | None (pure client) |
| **B** | Drag-to-mutate board | Native HTML5 DnD; drag card → set active-axis field via the §2 wrappers; optimistic + persist | Within-column reordering; touch/keyboard drag; calendar drag-to-schedule | Reuses spine |
| **C** | Inline editing | Label add/remove (detail + cards) via extracted `LabelEditor`; subtask add/toggle; coassignee multi-select reusing `PeoplePicker` | SharePoint push for these; comment threads; attachments/cover; checklist caps/percent enums | Extends spine (DB-only) |
| **D1** | My Tasks view | New `route.screen="mine"` rendering the PR-A board/list pre-filtered via `tasksForUser(CURRENT_USER, allTasks())`; sidebar entry + ⌘K command + view chord | Cross-plan/multi-user switching; charts; saved filters | None |

**Keyboard depth (folded into PR-A/PR-D1, scoped per research §5.8):** `/` focuses the filter input, `Esc` clears it; view chords added alongside the existing ⌘K handler in `shell.tsx`. No multi-select, no full Linear grammar.

> **Chord guard (specify concretely — the current handler has no input/focus guard).** `shell.tsx:56-66` guards only `if (newTaskOpen) return;` — no `event.target` check and no palette-open guard. Module A is *adding a persistent text input* (`filter-bar.tsx`, "Filter tasks…") to the same surface, so bare single-key chords would fire while the user types (typing "b"/"l" navigates away). **Prefer prefixed chords `g b` / `g l` / `g t` / `g m`** over bare single keys to shrink the collision surface, and gate every chord (and the `/` focus) on: `if (newTaskOpen || paletteOpen) return;` **and** `if ((e.target as HTMLElement).closest("input,textarea,[contenteditable]")) return;`. **`Esc` precedence:** the `PeoplePicker` registers a **capture-phase** `Esc` handler that `stopPropagation`s (`people-picker.tsx:76-85`), so an open picker closes first; the filter-clear `Esc` only fires when no picker/modal is open. Document this ordering so the two `Esc` handlers don't race.

---

## 4. Data / Persistence Plan — PER FIELD

Tier legend: **OPT** = optimistic-local only (forbidden); **DB** = persisted to Postgres `entities.data` jsonb, survives hydrate, not pushed; **SP** = DB + SharePoint outbound via the engine sweep.

| Field | Editable in C1? | Where edited | Tier | Store action | `PatchTaskInput` (`state.ts:97`) | Zod (`route.ts:9`) | `PUSHED_FIELDS` / `outboundFields` | Migration | UI truth shown |
|-------|-----------------|--------------|------|--------------|----------------------------------|--------------------|------------------------------------|-----------|----------------|
| `stage` | Yes (drag B) | board | **SP** | `setTaskStage` (new) | present | present | in `PUSHED_FIELDS`; `Status` map (`mapping.ts:70`) | none | `SyncTick` → Pending then Synced |
| `priority` | Yes (drag B) | board | **SP** | `setTaskPriority` (new) | present | present | in `PUSHED_FIELDS`; `Priority` map (`mapping.ts:71`) | none | `SyncTick` |
| `bucket` | Yes (drag B, group-by=bucket) | board | **DB** | `setTaskBucket` (new) | **ADD** | **ADD** | **omit** (Initiative is a lookup; lookup-id write unresolved — `mapping.ts:6-8`, no `Initiative` case at `mapping.ts:66-81`) | none | no sync claim; tooltip "Initiative mirror lands with the directory/lookup increment" |
| `assignee` | Yes (exists) | detail / card | **DB** | `reassignTask` (wrapper) | present | present | **not** in `PUSHED_FIELDS` (`state.ts:121-123`) | none | "mirror deferred to directory increment" (PR-0 copy fix) |
| `coassignees` | Yes (C) | detail | **DB** | `setCoassignees` (new) | **ADD** | **ADD** | omit (person column unmapped) | none | no sync claim |
| `labels` | Yes (C) | detail + cards | **DB** | `setTaskLabels` (new) | **ADD** | **ADD** | omit (no `Labels` SP column exists — see `data.ts` ToDos columns) | none | no sync claim |
| `subtasks` | Yes (C: add/toggle) | detail | **DB** | `addSubtask`/`toggleSubtask` (new) | **ADD** (`Subtask[]`) | **ADD** (`subtaskSchema`) | omit (no SP checklist column) | none | no sync claim |

**Bucket-as-DB-only — the rationale (grafted from Approach 1, sharpened):** `Initiative` is a SharePoint **Lookup → Roadmap**, not a plain choice column. Writing it correctly requires resolving the Roadmap item id, which does not exist yet. Shipping `bucket` as **DB-only** keeps drag-to-rebucket persistent (Postgres) and honest (not claimed as synced), and avoids half-wiring a string into a lookup column — exactly the "ship half" failure this spec forbids. **Cycle-2 promotion path:** add the `bucket → Initiative` case to `outboundFields` and `bucket` to `PUSHED_FIELDS` once lookup-id resolution lands. Same promotion path for `labels` once a `Labels` SP column is added.

**Critical correctness invariants:**
- **No field above is OPT.** Every editable field is at least DB-persisted, so it survives the next `GET /api/state` hydrate (`store.ts:206-208`). Prime directive satisfied.
- **DB-only edits must not fabricate sync.** Because `PUSHED_FIELDS` is unchanged, the existing `pushedDirty.length > 0 ? "pending" : undefined` gate (`state.ts:123`) guarantees a `labels`/`bucket`/`coassignees`/`subtasks`-only patch leaves `sync_state` untouched. Locked by a test (§6).
- **No `005+` migration in Cycle 1.** The numbered-migration runway stays *reserved, not used* — a deliberate non-action recorded here so the harden step does not "add a migration to be safe." `check-migrations.py` (run by preflight) would otherwise flag a stray prefix; it also rejects any non-`.sql` file or subdirectory under `db/migrations/` (`check-migrations.py:38-43`), so keep that directory clean of scratch files too.
- **Half-wired guard (process):** every "ADD" lands in the *same PR* as its store action and its UI control. No editable control ships before its allow-list + Zod entry exist; otherwise the field is silently dropped on the next sweep.

---

## 5. Component / UX Design (Linear standard)

All new CSS scoped under `.mc`, using only the existing `--p-*` and surface tokens (no raw hex, per `docs/VMC_UI_PLAYBOOK.md` discipline mirrored here). Mirror the existing `.seg` / `.pill` / `.picker` / `.label` / `.tcard` / `.ntm-chip` blocks.

### Module A — Re-pivotable board + filter bar

**`src/components/mc/work-views.helpers.ts`** (generalize; keep pure + unit-tested):
- Replace `BoardGrouping` (`:4`) and `ListGroupBy` (`:6`) with one union: `export type GroupBy = "band" | "stage" | "bucket" | "priority" | "assignee";`. Keep `BoardSwimlanes` (`:5`) unchanged.
- Generalize `boardColumns(groupBy)` (`:18`) and `columnKeyForTask(task, groupBy)` (`:22`) to switch on `GroupBy`, returning ordered `{key,name}[]` per axis: `band`→`BANDS`; `stage`→`STAGES`; `bucket`→`BUCKETS`; `priority`→`PRIORITY` order; `assignee`→ordered actors + an "Unassigned" key. Keep `partitionTasksByColumn` **single-cell** (one task → one column).
- Fold `groupTasksForList` (`:66`) onto the same `GroupBy` + a shared `columnsFor(groupBy)` helper so board and list read one grouping source (kills the board/list divergence, research gap #27). Preserve the existing `"band"` behavior (was the list's `"status"`).
- **Add** `export interface FilterState { text?: string; priority?: PriorityKey[]; assignee?: string[]; label?: string[]; stage?: StageKey[]; }` and a pure `export function applyFilters(tasks: Task[], f: FilterState): Task[]` — text over id/title/labels; each facet a Set; assignee includes "unassigned"; empty filter = identity; facets AND-combine. Pure + exported = unit-testable with zero persistence risk.
- Add `labelUniverse(tasks)` / `assigneeUniverse(tasks)` derivations (dedupe + sort) to populate filter options.

**`src/components/mc/work-views.tsx`:**
- Collapse `grouping` + `listGroupBy` (`:323`, `:325`) into one `groupBy` state; keep `swimlanes` (`:324`). Add `filters` state.
- Bind the version first (`work-views.tsx:321` currently calls `useMcVersion()` as a bare statement and discards the return), then memoize: `const version = useMcVersion();` … `const visible = useMemo(() => applyFilters(filterTasksByBucket(allTasks(), route.bucketId), filters), [route.bucketId, filters, version]);`. (Alternatively omit `version` from the deps and rely on the subscribe-triggered re-render, since `allTasks()` is read fresh each render — but do **not** reference a bare `version` identifier that isn't bound.)
- Replace the board "Stages" segment (`:391-407`) and the list "Group" segment (`:429-441`) with **one shared `GroupBy` segment** (reuse the `.seg` skin) bound to all five axes; render it for both board and list. Keep "Swimlanes" (`:408-424`) as a board-only sub-toggle, shown only when `groupBy === "stage" || "band"` (an assignee sub-lane is meaningless under other axes).
- **Swimlanes reset (mandatory — hiding the toggle is not enough).** `swimlanes` is independent state (`:324`) and `BoardView`'s swimlane branch (`work-views.tsx:107`) keys off the `swimlanes` prop **alone**, not the axis. So a user who enables swimlanes under `band`/`stage` and then switches `groupBy` to `bucket`/`priority`/`assignee` would still get Agents/Humans/Unassigned sub-lanes *inside* those columns — the exact "meaningless" rendering this rule exists to prevent, with only the control hidden. Therefore: when `groupBy ∉ {band, stage}`, **force `swimlanes` to `"off"`** (reset the state, e.g. in the group-by setter or a guarding effect) — or have `BoardView` ignore `swimlanes` unless the axis is band/stage. Add a unit assertion that switching to a non-band/stage axis clears the swimlane partition.
- Add a `<FilterBar>` row above the views. Lift `groupBy` + `filters` into `WorkViews` so they persist across the board/list/timeline tab switch (the `vsw` switcher at `:371-386` already keeps `WorkViews` mounted).
- Board column headers reuse the `.bhead` skin; the stage `n`/`gate` decoration is already guarded by `stage?.n &&` (`:100`), so non-stage axes render clean headers automatically.
- **Compact-column layout class (load-bearing — do not drop it in the rename).** The board layout class is emitted at `work-views.tsx:92` as ``board${grouping === "full" ? " full" : ""}``, and `.mc .board.full .bcol` (`mc-views.css:21`) is the **244px** narrow-column grid that makes a many-column board usable (vs the 300px default at `mc-views.css:13-15`). The `"full"`→`"stage"` rename must **not** silently break this: every multi-column axis (`stage`=9, `bucket`=8, `priority`=4, `assignee`=N) needs the compact grid, and only `band` (3 columns) wants the wide default. Change the className to gate on the axis, not the literal `"full"`, e.g. ``board${groupBy === "band" ? "" : " compact"}`` and rename the CSS selector `.board.full .bcol` → `.board.compact .bcol` (or keep the `.full` class name but emit it for all non-`band` axes). State this in PR-A's file manifest (it touches both `work-views.tsx:92` and `mc-views.css:21`). Without it, `bucket`/`priority`/`assignee` boards render 8+ wide columns and overflow horizontally.
- Empty-state copy (`:450-454`) gains a "Clear filters" affordance when `filters` is non-empty; distinguish "no tasks in this initiative" vs "no tasks match these filters."

**`src/components/mc/filter-bar.tsx`** (new, presentational — no store writes; grafted Linear-fidelity detail from Approach 2):
- Compact low-chrome pill row beneath the existing `.tb` toolbar. Left: persistent text input ("Filter tasks…"). Right: `+ Filter`-style `.pill` toggles opening small popovers per facet — priority chips via `Priority`; assignee via a condensed `PeoplePicker`-style list; labels via `labelUniverse`; stage via `STAGES`.
- Active filters render as **removable chips with a live count** (reuse the `ntm-chip … on` + `.rm ✕` pattern, `new-task-modal.tsx:343-352`). One click clears a facet; the global count (`work-views.tsx:444-446`) updates live. `/` focuses the input; `Esc` clears. Pure client → instant, no spinner.

**`src/styles/mc-views.css`:** add a `.mc .filterbar` block mirroring `.tb`/`.seg`/`.pill`; tokens only.

### Module B — Drag-to-mutate (native HTML5 DnD)

**`src/components/mc/work-views.tsx` — `TaskCard` (`:38-73`) + `BoardView` (`:75-153`):**
- `TaskCard` gains `draggable` + `onDragStart` (set `dataTransfer` to `task.id`) and a `.dragging` class. Keep it a `<button>` for a11y (native DnD works on buttons). Use a drag-occurred flag to suppress the `onClick` open when a drag completed (Risk R-clickdrag).
- Each `.bcol` body (`:97`/`:106`) is a drop target: `onDragOver` (preventDefault + `.drop-active` class) / `onDrop` → resolve the dropped column's value for the active `GroupBy` and call the matching wrapper:
  - `stage`/`band` → `setTaskStage` (band drop maps to the band's **entry stage** via a documented `BAND_ENTRY_STAGE` map: `todo`→`backlog`, `doing`→`progress`, `done`→`merged`).
  - `priority` → `setTaskPriority`.
  - `bucket` → `setTaskBucket` (DB-only).
  - `assignee` → `reassignTask` (already persisted).
- **No-op guards:** drop on the current column → no PATCH (avoid spurious writes + the sweep race, research §5.6). Every Cycle-1 axis is persistable, so a drop is never a silent local-only move.
- **Feedback:** card moves instantly (optimistic store emit); the card's existing `SyncTick` (`atoms.tsx`) flips to its *real* pending/synced state — no fabricated "synced" flash.
- **PATCH-failure behavior (must be explicit — touches the prime directive).** `serverCall` (`store.ts:167-172`) is **warn-only**: on a failed PATCH it logs and keeps the optimistic local state. The reconcile-to-server-truth in `patchTaskFields` (adopt the returned task) covers only the **success** path. So on failure the card stays moved as if saved, and the **next `hydrate()` (`store.ts:206-208`, `applyServerState`) silently reverts it** — the same "editable but silently dropped on the next `GET /api/state`" class this spec exists to eliminate (Goal 1). This must not be left implicit:
  - **Recommended (closes the gap):** in `patchTaskFields`, snapshot the prior values of the patched fields before the optimistic apply, and in the `serverCall` catch **restore + re-`emit()`** and surface an error signal (toast/audit row). This makes optimistic state converge to DB truth on both paths.
  - **Minimum (if reconcile-on-failure is deferred):** **explicitly classify** "edit lost on server-failure + reload" as an accepted Cycle-1 limitation — record it in the §4 "UI truth shown" column for the drag-mutated fields and add it as an E2E step (§6 #3a). Do **not** leave the prime-directive contract silently contingent on a healthy network.

  Either way, undo (user-initiated) remains out of scope; this is purely about not *silently* dropping a write the user saw succeed.

**`src/styles/mc-views.css`:** `.mc .tcard[draggable]` (`cursor: grab`), `.mc .tcard.dragging` (opacity/`transform: scale(1.02)` over `--p-dur var(--p-ease)`), `.mc .bcol.drop-active` (1px `--p-accent`/`--p-accent-soft` inset ring). Tokens only.

### Module C — Inline editing (reuse-maximal)

**`src/components/mc/label-editor.tsx`** (new): extract the label chip-group + draft-input + `addLabel` normalize logic from `new-task-modal.tsx:120-126,340-367` into a shared presentational `LabelEditor({ labels, onChange })`. Use it in **both** the modal (replace the inline block) and the task detail. (Reuse Before Create — Pillar 3.)

**`src/components/mc/task-detail.tsx`:**
- **Labels:** make the Facts "Labels" row (`:445-452`) editable via `<LabelEditor>` → `setTaskLabels`. The header `task.labels.map(Label)` (`:179-181`) stays read; cards already render the first label (`work-views.tsx:55-57`).
- **Subtasks:** the block (`:331-352`) currently renders only when `task.subtasks.length > 0` — change to always render, add a checkbox toggle on each `.sub` → `toggleSubtask(task.id, subtask.id)` and an "+ Add subtask" inline input at the block foot (mirror the label-input pattern) → `addSubtask(task.id, text, CURRENT_USER)`. The done-count header (`:335`) recomputes.
- **Coassignees:** add a coassignee row near the assignee picker (`:183-199`) — render an `AvatarStack`-style cluster (`AvatarStack` already exists in `atoms.tsx`) of `task.coassignees` with a "+" affordance opening a second `PeoplePicker` for multi-select accumulation → `setCoassignees`. Recommend `allowAgents={false}` for coassignees (humans-only) unless product says otherwise.
- **Bucket:** add a small bucket `<select>` (or a `.seg`/`.pill` chooser) on the detail, reusing `BUCKETS` (`data.ts:117`), wired to `setTaskBucket`. **Rationale:** drag is the *only* bucket mutation otherwise (Module B, board grouped-by-bucket), and native HTML5 DnD does not fire on touch and is not keyboard-operable (R7) — so without a detail control, **rebucketing is unreachable on touch/keyboard**. This gives every drag-mutated field a non-drag path. (If product prefers to scope this out, instead explicitly accept "bucket is drag-only / desktop-only in Cycle 1" in §0 non-goals and R7, and note it in §6 — do not leave a mutation with zero non-drag path undocumented.)
- All edits commit on blur/Enter/toggle, optimistic, and append an honest activity entry via `patchTaskFields`.

**`src/styles/mc-task.css`:** inline-edit affordances (hover edit, token-styled), reusing existing `.label` / `.subs` / `.sub .box` skins.

### Module D1 — My Tasks

- **`src/components/mc/route.ts`:** add `"mine"` to the `Screen` union (`:5-16`).
- **`src/components/mc/screens.tsx`:** register `mine: WorkViews` (`:15-27`) — reuse `WorkViews`, do not fork.
- **`src/components/mc/work-views.tsx`:** when `route.screen === "mine"`, seed the source with `tasksForUser(CURRENT_USER, allTasks())` (`mc-data/helpers.ts:57`, already used by `inbox.tsx`) **before** `applyFilters`/group-by, and render through the same board/list (default to list grouped by `bucket`). Header kicker → "My Tasks" / "Assigned to, co-owned by, or reported by you." Filters + group-by work there for free. Add `"mine"` to the `vsw` view switcher / `goView` peer set.
- **Composition precedence (define explicitly — avoids an always-empty / mis-scoped board).** Today `WorkViews` derives tasks via `filterTasksByBucket(allTasks(), route.bucketId)` (`work-views.tsx:328`), and `goView` propagates `route.bucketId` (`:331-333`). My Tasks is **cross-bucket by definition**, so when `screen === "mine"`: **ignore `route.bucketId` entirely** (source = `tasksForUser(CURRENT_USER, allTasks())`, **not** wrapped in `filterTasksByBucket`) and **suppress the bucket pill** (`work-views.tsx:360-365`) so it can't display a bucket scope the view isn't honoring. Precedence is therefore: `mine`-seed (replaces bucket base) → user `filters` → group-by. Do not compose the mine-seed *on top of* the bucket filter, or a `mine` route arriving with a `bucketId` would silently show "my tasks in that one bucket."
- **`src/components/mc/chrome.tsx`:** add a sidebar `item("mine", "☉", "My Tasks")` in the Views group (`:108-115`), using the existing `item()` helper.
- **`src/components/mc/command-palette.tsx`:** add `{ key: "nav:mine", icon: "☉", label: "Go to My Tasks", run: () => nav("mine") }` to the `navigate` group (`:74-102`).

---

## 6. Test Plan

The repo uses **vitest with pure-function / store / contract tests only — no jsdom, no RTL** (`vitest.config.ts:16-21` includes `tests/**/*.test.ts`; existing tests import helpers/store directly, never render React). Honor that: unit-test the pure helpers and the store/server contracts; cover browser behavior (drag, inline edit) via the E2E checklist.

### Vitest — pure helpers (PR-A; highest leverage, zero deps) — `tests/mc-views.test.ts` (extend)
- `partitionTasksByColumn` disjoint + complete for **every** new `GroupBy` axis (bucket/priority/assignee), mirroring the existing band/stage invariants (`:13-45`). Keep the `"band"` test green; rename the existing `"full"` partition test to `"stage"` — **`mc-views.test.ts:31` hard-codes `partitionTasksByColumn(TASKS, "full")` and will not typecheck once `"full"` leaves the `GroupBy` union**, so this edit ships in PR-A alongside the helper rename (see PR-A file manifest).
- Ordered columns per axis (priority follows `PRIORITY` order; assignee ends with "Unassigned").
- `applyFilters` truth table: text match; each facet; AND-combination across facets; empty filter = identity; assignee "unassigned" inclusion.
- `labelUniverse` / `assigneeUniverse` dedupe + sort.

### Vitest — store invariants (PR-0/B/C) — `tests/mc-store.test.ts` (extend + fix)
- **PR-0 mirror-truth regression (pins (iii)):** after `reassignTask`, `activity[0].what` must **NOT** contain `"mirrored to SharePoint"`/`"notified via Teams"` and **must** contain `"deferred to the directory increment"`. **Only `:96` locks the lie** — rewrite its positive assertion from `toContain("mirrored to SharePoint")` to assert *absence* of `"mirrored to SharePoint"` + *presence* of `"deferred to the directory increment"`. **Do not "fix" `:104`** (`toContain("unassigned")`): the honest unassign copy still contains `"unassigned"`, so `:104` stays green as-is — reuse it (optionally strengthen to also assert `"deferred to the directory increment"`); it is **not** a red→green line.
- **Audit-state regression (the untested unassign/reassign lie):** the genuine unassign lie is the **audit** entry (`store.ts:374`), not an activity line. Add fresh assertions on `auditLog()[0]` (the most-recent `pushAudit` row) after both reassign and unassign: its `body` reads the deferred-truth voice (`toContain("deferred to the directory increment")`, **not** `"cleared in SharePoint"`/`"Assigned To mirrored"`) **and** its `state` is `"pending"` (not `"synced"`). This is the regression that pins the §2.3 `"synced"`→`"pending"` change; without it, that change ships untested.
- `patchTaskFields` / `setTaskStage` / `setTaskPriority` / `setTaskBucket` set the field optimistically and are reflected by `taskById`; band-axis drag maps to the correct entry stage; empty patch is a safe no-op.
- **DB-only tier guarantee:** patching `labels` / `subtasks` / `coassignees` / `bucket` must **not** change `task.sync.state` (encodes "DB-only edits don't fabricate a pending push").
- `setTaskLabels` add/remove idempotence; `addSubtask` generates a unique id + appends; `toggleSubtask` flips `done`; `setCoassignees` dedupes and never includes the primary assignee twice.
- `resetStore()` in `beforeEach` already isolates (`:27`).

### Vitest — server `patchTask` + API schema (PR-0/B/C) — new `tests/mc-patch.test.ts` + extend `tests/api-route.test.ts` style
- **This is the *primary* programmatic regression for R1 (hydrate-survival), not an "also."** The store-level tier tests assert optimistic state + `sync.state`, but **cannot** assert the real `GET /api/state` hydrate round-trip — the store's `serverCall` is a no-op under test (`store.ts:167-168`, `typeof window === "undefined"`). So the only programmatic proxy for "survives the next hydrate" is this server test: `patchTask` → `repo.updateEntity` with a mocked `repo` proves the field reaches `entities.data`. Treat it as the load-bearing safety net for the prime directive; the actual browser hydrate is covered only by E2E #3/#4 (manual).
- `patchTask` (state.ts): feed each new field, assert the returned task carries it; assert SP fields set `sync_state: "pending"` + dirty, DB-only fields do **not** (the per-field-tier guarantee at the server boundary). Unknown/empty patch is a safe no-op (`state.ts:113-114`). (The `repo` seam at `repo.updateEntity` is mockable; no live DB needed.)
- `patchTaskSchema` accepts the new optional fields and rejects malformed (`subtasks` missing `done`, non-array `labels`, `labels` over the cap) — mirror the existing `parseBody` valid/invalid pattern.

### Vitest — mapping honesty (regression) — `tests/sync-mapping.test.ts` (extend)
- Assert `outboundFields("task", …)` still emits **no** `Initiative` / `Labels` / person (`AssignedTo`/coassignee) keys, so a future Cycle-2 mapping promotion is a *conscious* test edit, not silent breakage. Locks the DB-only tier boundary.

### Browser E2E checklist (harden phase — Preview/Chrome MCP; `npm run dev`)
1. Board: switch `GroupBy` across all five axes → columns relabel, counts re-pivot, every task appears exactly once, **no horizontal overflow** (compact-column layout applies to all non-`band` axes; band keeps wide columns). Enabling swimlanes then switching to `bucket`/`priority`/`assignee` → sub-lanes disappear (swimlanes reset to off, not just the toggle hidden).
2. Filter: text + a priority → board/list narrow live; `/` focuses, `Esc` clears, "Clear filters" restores; count matches. Confirm `/` and `Esc` do not collide with an open `PeoplePicker` (its capture-phase `Esc` at `people-picker.tsx:78-83` closes the picker first; the filter `Esc`-clear only fires when no picker/modal is open).
3. Drag a card stage→stage → moves instantly, `SyncTick` shows Pending; **reload (forces `GET /api/state` hydrate) → move persisted** (the anti-data-loss assertion). Drag grouped-by-priority → priority persists. Drop on current column under stage, priority, **bucket, and assignee** axes → no-op (no audit row, no `SyncTick` change — `assignee`/`bucket` resolve `columnKeyForTask` differently, so smoke each).
   - **3a. PATCH-failure (prime-directive guard):** with the network forced to fail the PATCH, drag a card → if the recommended reconcile-on-failure is implemented, the card snaps back + an error is surfaced; if the minimum classification was taken instead, confirm the documented accepted behavior (card stays, reverts on reload) matches the §4 "UI truth shown" note. Either way there must be **no fabricated "Synced"** state.
4. Inline: add a label, toggle a subtask, add a coassignee → **reload → all survive**; confirm copy shows no sync claim for these.
5. Assignee reassign → on-screen trail reads "deferred to the directory increment" — **not** "mirrored"/"notified via Teams" (PR-0). Also confirm the New Task modal's `NotifyTrail` (`new-task-modal.tsx:253`) shows no fabricated mirror/notify claim at creation time.
5a. Non-drag reachability (a11y): every drag-mutated field (stage, priority, bucket, assignee) is also mutable from the task detail via a non-drag control (pickers + the Module C bucket chooser) — verify each, since native DnD is desktop/pointer-only (R7).
6. My Tasks: sidebar + ⌘K + view chord all reach it; shows only `vince`'s tasks; filters/group-by/drag work there.
7. Gate: `scripts/preflight.sh --mode pre-push` (typecheck + `vitest run` + `next build`) green; no raw hex introduced in new CSS.

---

## 7. Dependency-Ordered, Thematic PR Breakdown

Each PR is opened as **draft** and must be **green through `scripts/preflight.sh --mode pre-push`** before review. Branch naming: `cycle1/<slug>`. Conventional commits below. Zero runtime deps; no migrations.

```
PR-0  ── (foundation; no code dep) ─────────────────────────────────────────────
PR-A  ── depends on PR-0 (clean store imports) ── pure client otherwise
PR-B  ── HARD dep: PR-A column model + PR-0 spine
PR-C  ── HARD dep: PR-0 spine + PR-0 honest copy
PR-D1 ── HARD dep: PR-A (renders through it)
        (PR-A and PR-0 can overlap; PR-D1 ∥ PR-B once PR-A lands)
```

| # | Branch | Conventional commit (title) | Files | Tests / gate |
|---|--------|-----------------------------|-------|--------------|
| **PR-0** | `cycle1/mutation-spine-mirror-honesty` | `feat(mc): generic patchTaskFields spine + honest assignee-mirror copy` | `src/lib/sync/state.ts` (tier comment, extend `PatchTaskInput`), `src/app/api/tasks/[id]/route.ts` (Zod + `subtaskSchema`), `src/lib/mc-data/store.ts` (`patchTaskFields` + wrappers; fix 4 copy sites), `src/components/mc/people-picker.tsx` (`NotifyTrail` copy) | `mc-store.test.ts` (fix `:96`/`:104` + mirror regression + tier), new `mc-patch.test.ts`, `api-route.test.ts` schema, `sync-mapping.test.ts` negative |
| **PR-A** | `cycle1/groupby-filter-bar` | `feat(mc): unified GroupBy + Linear filter bar across board/list` | `work-views.helpers.ts` (`GroupBy`, `applyFilters`, `*Universe`, `columnsFor`), `work-views.tsx` (shared segment + filter wiring + chords/`/`/`Esc`; **layout class `:92` `"full"`→axis-gated compact**; swimlanes reset), new `filter-bar.tsx`, `mc-views.css` (`.filterbar` + rename `.board.full`→`.board.compact` `:21`), **`tests/mc-views.test.ts` (the `:31` `"full"` literal must change to `"stage"` or PR-A won't typecheck)** | `mc-views.test.ts` (partitions for all axes + filter truth table + swimlanes-reset) |
| **PR-B** | `cycle1/drag-to-mutate` | `feat(mc): drag a card to set the grouped field` | `work-views.tsx` (`TaskCard` draggable, `.bcol` drop, axis→wrapper map, `BAND_ENTRY_STAGE`), `mc-views.css` (`.dragging`/`.drop-active`) | store setters (PR-0) + E2E #3 |
| **PR-C** | `cycle1/inline-editing` | `feat(mc): inline labels, subtasks, and co-assignees on task detail` | new `label-editor.tsx`, `new-task-modal.tsx` (use shared editor), `task-detail.tsx` (labels/subtasks/coassignees editable), `mc-task.css` | `mc-store.test.ts` (label/subtask/coassignee actions) + E2E #4 |
| **PR-D1** | `cycle1/my-tasks` | `feat(mc): My Tasks view reusing the board pre-filtered to the current user` | `route.ts` (`mine`), `screens.tsx` (register), `work-views.tsx` (seed `tasksForUser`), `chrome.tsx` (sidebar), `command-palette.tsx` (`nav:mine`), `shell.tsx` (view chord) | filter-seed assertion (`tasksForUser` already covered) + E2E #6 |

One coherent arc: **interactive, pivotable board + complete task fields + My Tasks** — zero new runtime dependencies, no migrations, nothing half-wired.

---

## 8. Risks & Mitigations

- **R1 — Half-wired field (the prime risk).** *Mitigation:* structural — PR-0 lands the persistence chain before any editing UI; the §4 per-field tier table is the checklist; tests assert each field round-trips and that DB-only fields don't fake sync (`mc-patch.test.ts`, `sync-mapping.test.ts`). Process gate: every "ADD" ships in the same PR as its store action + UI.
- **R2 — `bucket` lookup write.** Writing `Initiative` needs a Roadmap item id that doesn't exist yet. *Mitigation:* `bucket` is **DB-only in Cycle 1**; UI shows the deferred-mirror truth; documented Cycle-2 promotion path (§4). No half-write.
- **R3 — Drag → PATCH → hydrate race vs the 5-min sweep / conflict queue (research §5.6).** *Mitigation:* the scheduler is OFF by default (`scheduler.ts`), so the only sweep is manual ("Sync now"); DB-only fields can't conflict (not pushed), so only stage/priority drags are exposed — already covered by the existing conflict path (`engine.ts`/`mapping.ts:228-248`). No-op-on-same-column guard + E2E #3 server-adoption/reload check. Do not enable the scheduler in Cycle 1.
- **R4 — Multi-membership group-by (gap #9).** Group-by assignee/label with a card in N columns would break the disjoint-partition invariant the tests assert. *Mitigation:* Cycle 1 is **single-cell** (primary assignee / first-or-"Unassigned"); tests are extended, not weakened; true multi-membership → Cycle 2. Documented in the group-by control behavior.
- **R5 — `subtasks` object array** is the only non-scalar patch field. *Mitigation:* strict `subtaskSchema` (id/t/done/who) so a malformed inline edit can't corrupt `entities.data`; explicit reject test.
- **R6 — External Planner enum/limit freshness (research §5.7).** Label caps, checklist caps, priority scales are unverified. *Mitigation:* encode no Planner-specific caps; labels stay free-text as today (`new-task-modal.tsx:120-126`); a generous soft cap (`max(25)`) with a clear validation error, to be confirmed against live MS docs before any Cycle-2 SP promotion.
- **R7 — Native HTML5 DnD ceiling.** Coarse column-drop only; no within-column reorder / touch / keyboard. *Mitigation:* accepted Cycle-1 limitation; **every** drag-mutated field has a non-drag path on the task detail (stage/priority/assignee pickers + the new bucket chooser, Module C), so no mutation is drag-only/touch-unreachable; pre-decided escalation to `@dnd-kit/core` (the one justified future dep) only when Cycle 2 needs fine-grained/a11y drag. (If the Module C bucket control is descoped, this risk reopens for `bucket` — record the acceptance in §0 then.)
- **R8 — Drag vs click ambiguity** on the `TaskCard` button. *Mitigation:* a drag-occurred flag suppresses the click-open; keep keyboard-accessible button semantics.
- **R9 — `GroupBy` refactor touches the unit-tested partition contract.** *Mitigation:* keep single-cell semantics so disjoint/complete invariants hold; rename `"full"`→`"stage"` and migrate **all** call sites in the same PR (PR-A): the two in `work-views.tsx` (`:92` board layout className, `:402` segment), the helper definitions (`work-views.helpers.ts:4,18-23`), **and the test literal `tests/mc-views.test.ts:31`** (otherwise `tsc --noEmit` fails on the dropped `"full"` member). Also rename the coupled CSS selector `.board.full`→`.board.compact` (`mc-views.css:21`) and gate it on `groupBy !== "band"` so all multi-column axes get the 244px grid. Pure-typecheck refactor (no runtime danger); tests extended in the same PR.
- **R10 — `mc-data` barrel coupling.** Store/hooks are deliberately separate from the data barrel (`index.ts`). *Mitigation:* new store actions go in `store.ts` and are imported from `@/lib/mc-data/store` (not the barrel) — follow the existing convention; do not add a re-export that crosses the client/server seam.

---

### Critical Files for Implementation
- `C:/Users/vince/PLX_MC/src/lib/sync/state.ts` — tier table + extend `PatchTaskInput` (persistence boundary; OQ ii/iii)
- `C:/Users/vince/PLX_MC/src/lib/mc-data/store.ts` — generic `patchTaskFields` + wrappers; fix the assignee-mirror copy (OQ iii)
- `C:/Users/vince/PLX_MC/src/components/mc/work-views.helpers.ts` — unified `GroupBy` + `applyFilters` (Modules A/B/D1 core, pure + tested)
- `C:/Users/vince/PLX_MC/src/components/mc/work-views.tsx` — group-by segment, filter bar, drag-to-mutate, My-Tasks seed
- `C:/Users/vince/PLX_MC/src/components/mc/task-detail.tsx` — inline labels/subtasks/coassignees (reusing `people-picker.tsx` + extracted `label-editor.tsx`)
- Supporting: `src/app/api/tasks/[id]/route.ts` (Zod), `src/components/mc/people-picker.tsx` (`NotifyTrail` copy), `src/components/mc/{route,screens,chrome,command-palette,new-task-modal}.tsx`, `tests/{mc-store,mc-views,sync-mapping}.test.ts` (+ new `mc-patch.test.ts`, `filter-bar.tsx`, `label-editor.tsx`). **No migrations** — fields live in `entities.data` jsonb (`db/migrations/004_entity_mirror.sql:9-21`).
