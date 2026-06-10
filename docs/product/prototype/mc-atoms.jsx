/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — shared atoms
   Avatars (human/agent), confidence signal, sync tick, chips, lifecycle spine,
   PMark glyph, slate placeholder. Exported to window for cross-file use.
   ══════════════════════════════════════════════════════════════════════════ */

const STAGES   = window.MC_STAGES;
const STAGE_IDX = window.MC_STAGE_IDX;
const ACTORS   = window.MC_ACTORS;
const REPOS    = window.MC_REPOS;
const PRIORITY = window.MC_PRIORITY;
const MODE     = window.MC_MODE;

// ── PMark glyph ──────────────────────────────────────────────────────────────
function PMark({ size, acc }) {
  return (
    <span className={"pm" + (size === "lg" ? " lg" : "") + (acc ? " acc" : "")} aria-label="PLX">
      <span className="num">14</span>
      <span className="sym">Px</span>
    </span>
  );
}

// ── Avatar — human (circle) vs agent (sharp square + notch) ──────────────────
function Avatar({ id, size, lead, title }) {
  const a = ACTORS[id];
  if (!a) return null;
  const cls = "av " + a.kind + (size ? " " + size : "") + (lead ? " lead" : "");
  return <span className={cls} title={title || a.name + (a.kind === "agent" ? " · " + a.model + " agent" : "")}>{a.init}</span>;
}

function AvatarStack({ ids, lead }) {
  return (
    <span className="avstack">
      {ids.map((id) => <Avatar key={id} id={id} size="sm" lead={id === lead} />)}
    </span>
  );
}

// ── Assignee — name + kind cue (agents show model badge) ─────────────────────
function Assignee({ id, size, onClick }) {
  if (!id) {
    return <span className="unassigned" onClick={onClick}>+ Assign</span>;
  }
  const a = ACTORS[id];
  return (
    <span className="who" onClick={onClick} style={onClick ? { cursor: "pointer" } : null}>
      <Avatar id={id} size={size || "sm"} />
      <span className="nm">{a.name}</span>
      {a.kind === "agent" && <span className="tag model">{a.model}</span>}
    </span>
  );
}

// ── Confidence signal — ONE quiet read: ready / building / gap / blocked ─────
// Derived from lifecycle stage + evidence completeness + block flag.
function confidenceOf(task) {
  if (task.blocked) return { state: "blocked", label: "Blocked", pct: 0 };
  const idx = STAGE_IDX[task.stage];
  if (task.stage === "verified" || task.stage === "merged")
    return { state: "ready", label: task.stage === "verified" ? "Verified" : "Merged", pct: 100 };
  const ev = task.evidence;
  if (ev) {
    const done = ev.items.filter((i) => i.done).length;
    const pct = Math.round((done / ev.items.length) * 100);
    if (task.stage === "qa" || task.stage === "review") {
      if (done === ev.items.length) return { state: "ready", label: "Ready", pct: 100 };
      return { state: "gap", label: done + "/" + ev.items.length + " evidence", pct };
    }
    return { state: "building", label: "Building", pct };
  }
  if (idx >= STAGE_IDX.progress) return { state: "building", label: "Building", pct: 40 };
  return { state: "building", label: "Planned", pct: 15 };
}

function Confidence({ task, showLabel = true }) {
  const c = confidenceOf(task);
  return (
    <span className={"conf " + c.state} title={"Confidence · " + c.label}>
      <span className="ring" style={{ "--pct": c.pct + "%" }}></span>
      {showLabel && <span>{c.label}</span>}
    </span>
  );
}

// ── Sync tick — silent when synced, loud on conflict/error ───────────────────
function SyncTick({ sync, showTs = true }) {
  if (!sync) return null;
  const map = { synced: "Synced", pending: "Pending", conflict: "Conflict", error: "Error" };
  return (
    <span className={"sync " + sync.state} title={(sync.sp || "") + (sync.ts ? " · " + sync.ts : "")}>
      <span className="d"></span>
      <span>{map[sync.state]}</span>
      {showTs && sync.state === "synced" && sync.ts !== "—" && <span className="ts">· {sync.ts.split(" · ")[1] || sync.ts}</span>}
    </span>
  );
}

// ── Chips ────────────────────────────────────────────────────────────────────
function ReqChip({ id, gap }) { return <span className={"reqchip" + (gap ? " gap" : "")}>{id}</span>; }
function RepoChip({ id }) { const r = REPOS[id]; return <span className="repochip">{r ? r.name : id}</span>; }
function Label({ text }) { return <span className="label">{text}</span>; }
function Estimate({ v }) { return v ? <span className="est">{v}</span> : null; }

function Priority({ p }) {
  const cfg = PRIORITY[p];
  if (!cfg) return null;
  return <span className={"prio " + cfg.cls} title={"Priority · " + cfg.label}><span className="bars">{cfg.tick}</span></span>;
}

// ── Lifecycle mini-spine (9 segments) ────────────────────────────────────────
function Spine({ task }) {
  const idx = STAGE_IDX[task.stage];
  const cls = (i) => {
    if (task.stage === "verified") return i <= idx ? "done" : "";
    if (i < idx) return "done";
    if (i === idx) return "now" + (task.blocked ? " blocked" : "");
    return "";
  };
  return <div className="spine" title={STAGES[idx].n + " · " + STAGES[idx].name}>
    {STAGES.map((s, i) => <span key={i} className={cls(i)}></span>)}
  </div>;
}

// ── Slate placeholder (film-slate, never a stock/AI image) ───────────────────
function Slate({ label, cap }) {
  return (
    <div className="slate">
      <span className="cross"></span>
      {label && <span className="lb">{label}</span>}
      {cap && <span className="cap">{cap}</span>}
    </div>
  );
}

// ── Health pill for buckets ───────────────────────────────────────────────────
const BUCKET_HEALTH = {
  track: { cls: "ok", label: "On track" },
  risk:  { cls: "warn", label: "At risk" },
  off:   { cls: "hot", label: "Off track" },
};
function HealthPill({ h }) {
  const cfg = BUCKET_HEALTH[h] || BUCKET_HEALTH.track;
  return <span className={"pill " + cfg.cls}><span className="dot"></span>{cfg.label}</span>;
}

Object.assign(window, {
  PMark, Avatar, AvatarStack, Assignee, Confidence, confidenceOf, SyncTick,
  ReqChip, RepoChip, Label, Estimate, Priority, Spine, Slate, HealthPill, BUCKET_HEALTH,
});
