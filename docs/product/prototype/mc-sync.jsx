/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — Sync console (two-way SharePoint mirror)
   One SharePoint site backs the workspace. Each MC entity ↔ a list/library
   with typed columns and a per-field sync direction. Conflicts go to a manual
   review queue — a human picks the winning value, logged to the audit trail.
   "Sync now" runs a sweep: pushes pending items, then pulls one inbound edit.
   ══════════════════════════════════════════════════════════════════════════ */

const { useState: useStateS } = React;

const nowStampS = () => { const d = new Date(); const p = (n) => String(n).padStart(2, "0"); return d.getFullYear() + "." + p(d.getMonth() + 1) + "." + p(d.getDate()) + " · " + p(d.getHours()) + ":" + p(d.getMinutes()); };
const hhmm = (stamp) => (stamp.split("· ")[1] || stamp);
const dirArrow = (dir) => dir === "push" ? "→" : dir === "pull" ? "←" : "↔";
const dirWord = (dir) => dir === "push" ? "Push to SP" : dir === "pull" ? "Pull from SP" : "Two-way";

const BASE_AUDIT = [
  { ts: "09:12", actor: "scribe", body: "TASK-214 status → In QA · mirrored to ToDos · item 214", state: "synced" },
  { ts: "09:10", actor: "scribe", body: "RISK-2 mitigation updated · mirrored to Risk Register · 2", state: "synced" },
  { ts: "09:02", actor: "scribe", body: "TASK-219 created · mirror pending to ToDos · item 219", state: "pending" },
  { ts: "08:14", actor: "scribe", body: "Customer Portal v2 health → At risk · Roadmap · row 12", state: "synced" },
  { ts: "06:31", actor: "dana", body: "TASK-140 status conflict — workspace vs SharePoint", state: "conflict" },
  { ts: "06:31", actor: "scribe", body: "RISK-4 push rejected · column ‘Likelihood’ value invalid", state: "error" },
];

function SpRegister({ list, counts, expanded, onToggle }) {
  const total = counts.synced + counts.pending + counts.conflict + counts.error;
  return (
    <div className="spreg">
      <div className="spreg-head" onClick={onToggle}>
        <span className="ic">{list.icon}</span>
        <div className="t">
          <div className="nm">{list.title} <span className="kind">{list.kind}</span></div>
          <div className="map">{dirArrow(list.direction)} {list.maps}</div>
        </div>
        <div className="cts">
          <span className="ct ok"><b>{counts.synced}</b> synced</span>
          {counts.pending > 0 && <span className="ct pending"><b>{counts.pending}</b> pending</span>}
          {counts.conflict > 0 && <span className="ct conflict"><b>{counts.conflict}</b> conflict</span>}
          {counts.error > 0 && <span className="ct error"><b>{counts.error}</b> error</span>}
        </div>
        <span className="chev">{expanded ? "▾" : "▸"}</span>
      </div>
      {expanded && (
        <div className="spreg-body">
          <div className="spmeta">
            <span><b>{total}</b> items · {dirWord(list.direction)}</span>
            <span>Last sync {list.lastSync}</span>
            {list.folders && <span>Folders {list.folders}</span>}
            <a className="splink" href="#" onClick={(e) => e.preventDefault()}>Open in SharePoint ↗</a>
          </div>
          <table className="spmap">
            <thead>
              <tr><th>Mission Control field</th><th className="d"></th><th>SharePoint column</th><th>Type</th></tr>
            </thead>
            <tbody>
              {list.columns.map((c) => (
                <tr key={c.name}>
                  <td className="mcf">{c.mc}</td>
                  <td className="d" title={dirWord(c.dir)}>{dirArrow(c.dir)}</td>
                  <td className="spc">{c.name}{c.required && <span className="req">required</span>}</td>
                  <td className="ty">{c.type}{c.note && <span className="note"> · {c.note}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SyncHealth({ onOpen, nav }) {
  const site = window.MC_SP.site;
  const [counts, setCounts] = useStateS(() => window.MC_SP.lists.map((l) => ({ ...l.counts })));
  const [conflicts, setConflicts] = useStateS(() => window.MC_SP_CONFLICTS.slice());
  const [errors] = useStateS(() => window.MC_SP_ERRORS.slice());
  const [audit, setAudit] = useStateS(BASE_AUDIT);
  const [expanded, setExpanded] = useStateS({ todos: true });
  const [sweeping, setSweeping] = useStateS(false);
  const [lastSweep, setLastSweep] = useStateS(window.MC_SP.lastSweep);
  const [inbound, setInbound] = useStateS(null);

  const totals = counts.reduce((a, c) => ({ pending: a.pending + c.pending, conflict: a.conflict + c.conflict, error: a.error + c.error }), { pending: 0, conflict: 0, error: 0 });

  const syncNow = () => {
    if (sweeping) return;
    setSweeping(true);
    setTimeout(() => {
      const stamp = nowStampS();
      window.MC_markAllSynced(stamp);
      setCounts(window.MC_SP.lists.map((l) => ({ ...l.counts })));
      setLastSweep(stamp);
      const rows = [{ ts: hhmm(stamp), actor: "scribe", body: "Outbound sweep complete — all pending items mirrored to SharePoint", state: "synced" }];
      const inb = window.MC_applyInbound(stamp);
      if (inb) { rows.unshift({ ts: hhmm(stamp), actor: inb.by, body: "↓ Inbound — " + inb.taskId + " " + inb.field + " " + inb.from + " → " + inb.to + " (edited in SharePoint)", state: "synced" }); setInbound(inb); }
      setAudit((a) => [...rows, ...a]);
      setSweeping(false);
      window.dispatchEvent(new Event("mc-sync"));
    }, 1500);
  };

  const resolveConflict = (cf, how) => {
    setConflicts((cs) => cs.filter((c) => c.id !== cf.id));
    const i = window.MC_SP_CONFLICTS.findIndex((c) => c.id === cf.id);
    if (i > -1) window.MC_SP_CONFLICTS.splice(i, 1);
    const l = window.MC_SP_LIST[cf.list];
    if (l && l.counts.conflict > 0) { l.counts.conflict--; l.counts.synced++; }
    setCounts(window.MC_SP.lists.map((x) => ({ ...x.counts })));
    if (cf.entity === "Task") { const t = window.MC_TASK_IDX[cf.entityId]; if (t) t.sync.state = "synced"; }
    setAudit((a) => [{ ts: hhmm(nowStampS()), actor: "scribe", body: cf.entityId + " " + cf.field + " conflict resolved — kept " + (how === "mc" ? "Mission Control" : "SharePoint") + " · mirrored", state: "synced" }, ...a]);
    window.dispatchEvent(new Event("mc-sync"));
  };

  const overall = totals.conflict > 0 || totals.error > 0 ? "warn" : totals.pending > 0 ? "pending" : "ok";

  return (
    <div className="mc-main">
      <div className="ph">
        <div>
          <span className="kk">System of record · SharePoint mirror</span>
          <h1>Sync <em>console</em></h1>
          <p className="sub">Every register stays aligned both ways with the canonical SharePoint site. Edits flow in both directions; anything contested lands in the review queue for a human to settle.</p>
        </div>
        <div className="r">
          <span className={"sync " + (overall === "ok" ? "" : overall)}><span className="d"></span>{overall === "ok" ? "All aligned" : totals.conflict + totals.error + totals.pending + (overall === "warn" ? " need attention" : " pending")}</span>
          <button className="btn acc" disabled={sweeping} onClick={syncNow}>{sweeping ? "Syncing…" : "Sync now ↻"}</button>
        </div>
      </div>

      <div className="sync-page">
        {/* site bar */}
        <div className="spsite">
          <div className="l">
            <span className={"dotc " + (site.connected ? "ok" : "off")}></span>
            <div>
              <div className="nm">{site.name}</div>
              <div className="url">{site.host}{site.path}</div>
            </div>
          </div>
          <div className="r">
            <div className="f"><span className="k">Connection</span><span className="v">{site.connected ? "Connected · Microsoft 365" : "Disconnected"}</span></div>
            <div className="f"><span className="k">Cadence</span><span className="v">{window.MC_SP.cadence}</span></div>
            <div className="f"><span className="k">Last sweep</span><span className="v">{lastSweep}</span></div>
            <div className="f"><span className="k">Timezone</span><span className="v">{site.tz}</span></div>
          </div>
        </div>

        {/* registers with field mapping */}
        <div className="bh sec"><span className="kk">/ Registers · {window.MC_SP.lists.length} mapped</span><span className="kk">Mission Control ↔ SharePoint</span></div>
        <div className="spregs">
          {window.MC_SP.lists.map((l, i) => (
            <SpRegister key={l.key} list={l} counts={counts[i]} expanded={!!expanded[l.key]} onToggle={() => setExpanded((e) => ({ ...e, [l.key]: !e[l.key] }))} />
          ))}
        </div>

        {/* conflict review queue */}
        <div className="bh sec"><span className="kk">/ Review queue · {conflicts.length + errors.length}</span><span className="kk">a human picks the winner</span></div>
        {conflicts.length === 0 && errors.length === 0 && (
          <div className="colempty" style={{ marginBottom: 13 }}>Nothing to resolve — every record is aligned.</div>
        )}
        {conflicts.map((cf) => (
          <div className="conflict-row" key={cf.id}>
            <div className="ch">
              <span className="t">Conflict · {cf.entityId} {cf.field}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {cf.entity === "Task" && <span className="x" style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--p-muted)", cursor: "pointer" }} onClick={() => onOpen(cf.entityId)}>Open task →</span>}
                <span className="x" style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--p-muted)" }}>{window.MC_SP_LIST[cf.list].title}</span>
              </span>
            </div>
            <div className="cb">
              <div className="side"><div className="k">Mission Control</div><div className="v">{cf.mcVal}</div></div>
              <div className="side"><div className="k">SharePoint</div><div className="v">{cf.spVal}</div></div>
            </div>
            <div className="cf">
              <span className="cfnote">Edited in SharePoint by {window.MC_ACTORS[cf.by] ? window.MC_ACTORS[cf.by].name : cf.by} · {cf.detected}</span>
              <span style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                <button className="btn ghost sm" onClick={() => resolveConflict(cf, "mc")}>Keep Mission Control</button>
                <button className="btn ghost sm" onClick={() => resolveConflict(cf, "sp")}>Keep SharePoint</button>
              </span>
            </div>
          </div>
        ))}
        {errors.map((er) => (
          <div className="conflict-row" style={{ borderColor: "var(--p-hot)" }} key={er.id}>
            <div className="ch" style={{ background: "rgba(82,96,110,0.08)" }}>
              <span className="t" style={{ color: "var(--p-hot)" }}>Push error · {er.entityId} {er.field}</span>
              <span className="x" style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--p-muted)" }}>{window.MC_SP_LIST[er.list].title}</span>
            </div>
            <div className="side" style={{ padding: "13px 15px" }}>
              <div className="k">Reason</div>
              <div className="v" style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: "var(--p-ink-2)" }}>{er.reason}</div>
            </div>
            <div className="cf">
              <button className="btn ghost sm">Edit value</button>
              <button className="btn ghost sm">Retry push</button>
            </div>
          </div>
        ))}

        {/* audit log */}
        <div className="bh sec" style={{ margin: "24px 0 12px" }}><span className="kk">/ Sync audit log</span><span className="kk">2026.06.09</span></div>
        <div className="auditlog">
          {audit.map((a, i) => (
            <div className="arow" key={i}>
              <span className="ts">{a.ts}</span>
              <span><Avatar id={a.actor} size="sm" /></span>
              <span className="body"><b>{window.MC_ACTORS[a.actor] ? window.MC_ACTORS[a.actor].name : a.actor}</b> · {a.body}</span>
              <span className={"sync " + (a.state === "synced" ? "" : a.state)}><span className="d"></span>{a.state}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SyncHealth });
