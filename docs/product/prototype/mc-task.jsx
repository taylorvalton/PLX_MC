/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — Task Detail (the spine of the system)
   Left: description, sub-tasks, evidence artifacts, comments/activity.
   Right rail: lifecycle spine, assignee (human/agent), repos, PRD reqs,
   the Evidence Bundle checklist + gated Submit, quiet sync tick.
   Interactions: toggle evidence → gate unlocks + confidence flips · reassign
   human↔agent · human override of an agent gate (logged with a reason).
   ══════════════════════════════════════════════════════════════════════════ */

const { useState: useStateT } = React;

// Owner reassignment uses the shared PeoplePicker (Petra directory + agents + invite).

function EvidencePanels({ ev }) {
  return (
    <div className="evpanels">
      <div className="evp">
        <div className="eph"><span className="k">Summary — what the agent did</span></div>
        <div className="epb"><div className="txt">{ev.summary}</div></div>
      </div>
      <div className="evp">
        <div className="eph"><span className="k">Before / after</span><span className="k">{ev.shots.length ? "captured during work" : "not captured"}</span></div>
        <div className="epb">
          {ev.shots.length ? (
            <div className="shots">{ev.shots.map((s, i) => <Slate key={i} label={i === 0 ? "Before" : "After"} cap={s.cap} />)}</div>
          ) : <div className="txt" style={{ color: "var(--p-muted)" }}>No screenshots captured yet.</div>}
        </div>
      </div>
      <div className="evp">
        <div className="eph"><span className="k">E2E QA · {ev.qa.suite}</span><span className="k">{ev.qa.ran}</span></div>
        <div className="epb qa">
          <div className="qhd">
            <span className="pass">{ev.qa.pass} passed</span>
            {ev.qa.fail > 0 && <span className="fail">{ev.qa.fail} failed</span>}
            <span className="meta">{ev.qa.pass}/{ev.qa.total} total</span>
          </div>
          {ev.qa.tests.map((t, i) => (
            <div className={"qrow " + t.status} key={i}><span className="d"></span><span>{t.name}</span><span className="res">{t.status}</span></div>
          ))}
        </div>
      </div>
      <div className="evp">
        <div className="eph"><span className="k">Rollback plan</span></div>
        <div className="epb"><div className="txt">{ev.rollback || <span style={{ color: "var(--p-warn)" }}>Not yet written — required before the evidence gate opens.</span>}</div></div>
      </div>
    </div>
  );
}

const nowStampT = () => { const d = new Date(); const p = (n) => String(n).padStart(2, "0"); return d.getFullYear() + "." + p(d.getMonth() + 1) + "." + p(d.getDate()) + " · " + p(d.getHours()) + ":" + p(d.getMinutes()); };

// ── System of record — the task's two-way SharePoint mirror ──────────────────
function TaskRecord({ task, nav }) {
  const list = window.MC_SP_LIST.todos;
  const [sync, setSync] = useStateT(task.sync);
  const [syncing, setSyncing] = useStateT(false);
  const [conflict, setConflict] = useStateT(window.MC_SP_CONFLICTS.find((c) => c.entityId === task.id) || null);
  const [resolved, setResolved] = useStateT(null);

  const mirrored = [
    { f: "Status", v: window.MC_STAGES[window.MC_STAGE_IDX[task.stage]].name },
    { f: "Assigned To", v: task.assignee ? window.MC_ACTORS[task.assignee].name : "Unassigned" },
    { f: "Due Date", v: task.due },
    { f: "Priority", v: window.MC_PRIORITY[task.priority].label },
  ];

  const syncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      task.sync = { ...task.sync, state: "synced", ts: nowStampT() };
      setSync(task.sync); setSyncing(false);
      window.MC_persistUserTasks && window.MC_persistUserTasks();
      window.dispatchEvent(new Event("mc-sync"));
    }, 850);
  };
  const resolve = (how) => {
    setResolved(how);
    const i = window.MC_SP_CONFLICTS.findIndex((c) => c.id === conflict.id);
    if (i > -1) window.MC_SP_CONFLICTS.splice(i, 1);
    if (list.counts.conflict > 0) { list.counts.conflict--; list.counts.synced++; }
    task.sync = { ...task.sync, state: "synced", ts: nowStampT() };
    setSync(task.sync);
    window.dispatchEvent(new Event("mc-sync"));
  };

  return (
    <div className="blk" style={{ marginBottom: 0 }}>
      <div className="bh">
        <span className="kk">/ System of record</span>
        <span className="kk" style={{ cursor: "pointer", color: "var(--p-accent)" }} onClick={() => nav && nav("sync")}>Sync health →</span>
      </div>
      <div className="sor">
        <div className="sor-top">
          <span className="sor-list"><span className="ic">▦</span>{list.title} · <b>{task.sync.sp.split("· ")[1] || task.sync.sp}</b></span>
          <SyncTick sync={sync} />
        </div>
        <div className="sor-fields">
          {mirrored.map((m) => (
            <div className="sorf" key={m.f}>
              <span className="f">{m.f}</span>
              <span className="dir" title="Two-way">↔</span>
              <span className="v">{m.v}</span>
            </div>
          ))}
        </div>
        <div className="sor-foot">
          <span className="note">Two-way · maps to {list.title} columns</span>
          <span style={{ display: "flex", gap: 8 }}>
            <a className="splink" href="#" onClick={(e) => e.preventDefault()}>Open in SharePoint ↗</a>
            <button className="btn ghost sm" disabled={syncing || sync.state === "synced"} onClick={syncNow}>
              {syncing ? "Syncing…" : sync.state === "synced" ? "Synced ✓" : "Sync now ↻"}
            </button>
          </span>
        </div>
      </div>

      {conflict && !resolved && (
        <div className="sor-conflict">
          <div className="sch"><span className="dot"></span>Conflict · {conflict.field} edited on both sides</div>
          <div className="scb">
            <div className="side"><div className="k">Mission Control</div><div className="v">{conflict.mcVal}</div></div>
            <div className="side"><div className="k">SharePoint</div><div className="v">{conflict.spVal}</div></div>
          </div>
          <div className="scf">
            <button className="btn ghost sm" onClick={() => resolve("mc")}>Keep Mission Control</button>
            <button className="btn ghost sm" onClick={() => resolve("sp")}>Keep SharePoint</button>
          </div>
        </div>
      )}
      {resolved && (
        <div className="sor-resolved"><span className="d"></span>Resolved · kept {resolved === "mc" ? "Mission Control" : "SharePoint"} value · logged to audit</div>
      )}
    </div>
  );
}

function TaskDetail({ task, onBack, nav }) {
  const seedEv = task.evidence ? task.evidence.items.map((i) => ({ ...i })) : null;
  const [evItems, setEvItems] = useStateT(seedEv);
  const [assignee, setAssignee] = useStateT(task.assignee);
  const [stage, setStage] = useStateT(task.stage);
  const [pickerOpen, setPickerOpen] = useStateT(false);
  const [overrideOpen, setOverrideOpen] = useStateT(false);
  const [overrideReason, setOverrideReason] = useStateT("");
  const [log, setLog] = useStateT(task.activity || []);

  const a = assignee ? window.MC_ACTORS[assignee] : null;
  const isAgent = a && a.kind === "agent";
  const liveTask = { ...task, assignee, stage, evidence: evItems ? { ...task.evidence, items: evItems } : task.evidence };
  const evComplete = evItems ? evItems.every((i) => i.done) : true;
  const evDone = evItems ? evItems.filter((i) => i.done).length : 0;
  const atGate = stage === "qa";
  const conf = confidenceOf(liveTask);

  const pushLog = (who, what, kind) => setLog((l) => [{ age: "now", who, what, kind }, ...l]);

  const toggleEv = (key) => {
    setEvItems((items) => items.map((i) => i.key === key ? { ...i, done: !i.done } : i));
    const item = evItems.find((i) => i.key === key);
    pushLog(assignee, (item.done ? "unchecked" : "completed") + " evidence · " + item.label, "qa");
  };
  const submit = () => { setStage("review"); pushLog("tariq", "evidence complete — submitted TASK for review", "move"); };
  const approve = () => { setStage("merged"); pushLog("tariq", "approved + merged PRs #88 / #42 · REQ-2 satisfied", "pr"); };
  const verify = () => { setStage("verified"); pushLog("maya", "verified in production — closing task", "move"); };
  const doOverride = () => {
    if (!overrideReason.trim()) return;
    setStage("review");
    pushLog("tariq", "OVERRIDE · advanced past the evidence gate — reason: " + overrideReason.trim(), "move");
    setOverrideOpen(false); setOverrideReason("");
  };

  const stageIdx = window.MC_STAGE_IDX[stage];
  const b = window.MC_BUCKET_IDX[task.bucket];

  return (
    <div className="mc-main">
      <div className="ph" style={{ paddingBottom: 14 }}>
        <div>
          <button className="back" onClick={onBack}>← Back</button>
          <span className="kk" style={{ display: "flex", marginTop: 12 }}>
            <span style={{ cursor: "pointer" }} onClick={() => nav("bucket", { bucketId: b.id })}>{b.name}</span>
            <span style={{ color: "var(--p-grid)" }}>/</span>
            <span>{task.id}</span>
          </span>
        </div>
        <div className="r">
          <Confidence task={liveTask} />
          {stage === "review" && <button className="btn acc" onClick={approve}>Approve &amp; merge →</button>}
          {stage === "merged" && <button className="btn" onClick={verify}>Mark verified →</button>}
        </div>
      </div>

      <div className="td">
        {/* ─── main column ─── */}
        <div className="main">
          <div className="thead">
            <h1 style={{ margin: "0 0 12px" }}>{task.title}</h1>
            <div className="meta">
              <Priority p={task.priority} />
              {task.reqs.map((r) => <span key={r} style={{ cursor: "pointer" }} onClick={() => nav("matrix")}><ReqChip id={r} /></span>)}
              {task.labels.map((l) => <Label key={l} text={l} />)}
              {task.blocked && <span className="pill hot"><span className="dot"></span>Blocked</span>}
            </div>
          </div>

          {task.blocked && (
            <div className="blk" style={{ marginTop: 18 }}>
              <div className="pill hot" style={{ marginBottom: 8 }}><span className="dot"></span>Blocked</div>
              <div className="prose" style={{ color: "var(--p-hot)" }}>{task.blockedReason}</div>
            </div>
          )}

          <div className="blk" style={{ marginTop: 22 }}>
            <div className="bh"><span className="kk">/ Description</span></div>
            <div className="prose">
              {task.description ? task.description : (task.evidence ? task.evidence.summary : "Work item in " + b.name + ". Links to " + (task.reqs.length ? "PRD requirement " + task.reqs.join(", ") : "no PRD requirement yet") + " across " + (task.repos.length || "no") + " repo(s).")}
            </div>
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="blk">
              <div className="bh"><span className="kk">/ Sub-tasks · <b>{task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}</b></span></div>
              <div className="subs">
                {task.subtasks.map((s) => (
                  <div className={"sub" + (s.done ? " done" : "")} key={s.id}>
                    <span className="box">{s.done ? "✓" : ""}</span>
                    <span className="id">{s.id}</span>
                    <span className="t">{s.t}</span>
                    <span className="who"><Avatar id={s.who} size="sm" /></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {evItems && (
            <div className="blk">
              <div className="bh"><span className="kk">/ Evidence — assembled by <b>{a ? a.name : "agent"}</b></span><span className="kk">{evDone}/{evItems.length} complete</span></div>
              <EvidencePanels ev={liveTask.evidence} />
            </div>
          )}

          <div className="blk">
            <div className="bh"><span className="kk">/ Activity</span></div>
            <div className="log">
              {log.map((f, i) => {
                const who = window.MC_ACTORS[f.who];
                return (
                  <div className="logrow" key={i}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {who && <Avatar id={f.who} size="sm" />}
                    </span>
                    <span className="body"><b>{who ? who.name : f.who}</b> {f.what}</span>
                    <span className="age">{f.age}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── right rail ─── */}
        <div className="rail">
          {/* lifecycle spine */}
          <div className="blk">
            <div className="bh"><span className="kk">/ Lifecycle</span><span className="kk"><b>{window.MC_STAGES[stageIdx].n}</b> / 09</span></div>
            <div className="vstep">
              {window.MC_STAGES.map((s, i) => {
                const cls = stage === "verified" ? (i <= stageIdx ? "done" : "") : (i < stageIdx ? "done" : i === stageIdx ? "now" : "");
                return (
                  <div className={"s " + cls} key={s.key}>
                    <div className="gut"><span className="mk"></span><span className="line"></span></div>
                    <div className="lab"><div className="n">{s.n}</div><div className="nm">{s.name}{s.gate && <span className="gate">{s.gate}</span>}</div></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* assignee */}
          <div className="blk">
            <div className="bh"><span className="kk">/ Assignee</span></div>
            <div style={{ position: "relative" }}>
              <div className="rfact" style={{ borderBottom: 0, paddingTop: 0 }}>
                <span className="k">Owner</span>
                <span className="v">
                  <span className="who" style={{ cursor: "pointer" }} onClick={() => setPickerOpen((o) => !o)}>
                    <Avatar id={assignee} size="sm" /><span className="nm">{a ? a.name : "Unassigned"}</span>
                    {isAgent && <span className="tag model">{a.model}</span>}
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--p-muted)" }}>▾</span>
                  </span>
                </span>
              </div>
              {isAgent && (
                <div className="rfact"><span className="k">Mode</span><span className="v"><span className="pill muted"><span className="dot"></span>{window.MC_MODE[a.mode].label}</span></span></div>
              )}
              {a && a.kind === "human" && (
                <div className="rfact"><span className="k">Notified</span><span className="v"><NotifyTrail id={assignee} /></span></div>
              )}
              {task.coassignees && task.coassignees.length > 0 && (
                <div className="rfact"><span className="k">Co-assignees</span><span className="v"><AvatarStack ids={task.coassignees} /></span></div>
              )}
              {pickerOpen && <PeoplePicker current={assignee} style={{ top: "100%", right: 0, marginTop: 6, minWidth: 260 }} onPick={(id) => {
                setAssignee(id);
                const who = id ? window.MC_ACTORS[id] : null;
                if (!who) pushLog("tariq", "unassigned the task", "move");
                else if (who.kind === "agent") pushLog(id, "reassigned — now agent " + who.name, "move");
                else pushLog(id, "reassigned to " + who.name + " — mirrored to SharePoint · notified via Teams + email", "sync");
              }} onClose={() => setPickerOpen(false)} />}
            </div>
          </div>

          {/* repos + PRs */}
          <div className="blk">
            <div className="bh"><span className="kk">/ Repos · {task.repos.length}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {task.repos.map((r) => <span key={r} style={{ cursor: "pointer" }} onClick={() => nav("repos")}><RepoChip id={r} /></span>)}
              {(task.prs || []).map((p) => (
                <div key={p.repo + p.num} className="pr" style={{ borderBottom: 0, padding: "4px 0" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--p-accent)" }}>#{p.num}</span>
                  <div><div className="sub">{window.MC_REPOS[p.repo].name}</div></div>
                  <span className="pill muted" style={{ fontSize: 7.5 }}><span className="dot"></span>{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PRD reqs */}
          {task.reqs.length > 0 && (
            <div className="blk">
              <div className="bh"><span className="kk">/ PRD requirements</span></div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {task.reqs.map((r) => <span key={r} style={{ cursor: "pointer" }} onClick={() => nav("matrix")}><ReqChip id={r} /></span>)}
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--p-muted)", letterSpacing: "0.06em", marginTop: 4 }}>via {b.prd}</span>
              </div>
            </div>
          )}

          {/* Evidence Bundle gate */}
          {evItems && (
            <div className="blk">
              <div className="bh"><span className="kk">/ Evidence bundle</span></div>
              <div className="ev">
                <div className="evhd">
                  <span className="t"><Confidence task={liveTask} showLabel={false} />Bundle</span>
                  <span className="prog"><b>{evDone}</b>/{evItems.length}</span>
                </div>
                <div className="evlist">
                  {evItems.map((i) => (
                    <div className={"evitem" + (i.done ? " done" : "")} key={i.key} onClick={() => toggleEv(i.key)}>
                      <span className="box">{i.done ? "✓" : ""}</span>
                      <span className="lab">{i.label}</span>
                      <span className="st">{i.done ? "Done" : "Open"}</span>
                    </div>
                  ))}
                </div>
                <div className="evfoot">
                  {stage === "review" || stage === "merged" || stage === "verified" ? (
                    <span className="reason ok">Submitted — {conf.label}.</span>
                  ) : evComplete ? (
                    <span className="reason ok">All evidence complete. Ready to submit.</span>
                  ) : (
                    <span className="reason">{evItems.length - evDone} item{evItems.length - evDone > 1 ? "s" : ""} remaining · gate closed for agents</span>
                  )}
                  {(stage === "qa" || stage === "progress") && (
                    <button className="btn acc sm" disabled={!evComplete} onClick={submit}>Submit for review</button>
                  )}
                  {stage === "review" && <span className="pill info"><span className="dot"></span>In review</span>}
                </div>
              </div>
              {/* Human override — gates bind agents, not people */}
              {atGate && !evComplete && (
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--p-muted)" }}>Human can override</span>
                  <button className="btn ghost sm" onClick={() => setOverrideOpen(true)}>Override gate →</button>
                </div>
              )}
            </div>
          )}

          {/* sync — two-way SharePoint record */}
          <TaskRecord task={liveTask} nav={nav} />
        </div>
      </div>

      {/* override modal */}
      {overrideOpen && (
        <div className="override">
          <div className="oh">Override evidence gate · TASK {task.id}</div>
          <div className="ob">
            <p>The Evidence Bundle is incomplete ({evDone}/{evItems.length}). Agents are hard-gated here — but you can advance this task. Your reason is logged to the audit trail.</p>
            <input autoFocus value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="One-line reason for the override…" onKeyDown={(e) => e.key === "Enter" && doOverride()} />
            <div className="oa">
              <button className="btn ghost sm" onClick={() => { setOverrideOpen(false); setOverrideReason(""); }}>Cancel</button>
              <button className="btn sm" disabled={!overrideReason.trim()} onClick={doOverride}>Advance &amp; log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TaskDetail });
