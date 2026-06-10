/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — Bucket (Project) detail + Traceability Matrix
   ══════════════════════════════════════════════════════════════════════════ */

function BucketDetail({ bucket, nav, onOpen, onNew }) {
  const tasks = window.MC_tasksInBucket(bucket.id);
  const risks = window.MC_RISKS.filter((r) => r.bucket === bucket.id);
  const miles = window.MC_MILESTONES.filter((m) => m.bucket === bucket.id);
  const prd = bucket.prd ? window.MC_PRDS[bucket.prd] : null;
  const trace = window.MC_TRACE.bucket === bucket.id ? window.MC_TRACE : null;
  const satisfied = trace ? trace.rows.filter((r) => r.status === "satisfied").length : 0;
  const gaps = trace ? trace.rows.filter((r) => r.status === "gap").length : 0;

  // empty / first-run
  if (bucket.empty) {
    return (
      <div className="mc-main">
        <div className="ph">
          <div>
            <button className="back" onClick={() => nav("home")}>← Back</button>
            <span className="kk" style={{ display: "block", marginTop: 12 }}>Initiative · {bucket.id}</span>
            <h1 style={{ marginTop: 8 }}>{bucket.name}</h1>
            <p className="sub">{bucket.desc}</p>
          </div>
          <div className="r"><HealthPill h={bucket.health} /></div>
        </div>
        <div className="empty">
          <span className="glyph"><PMark /></span>
          <h3>This initiative needs a <em style={{ fontStyle: "italic", color: "var(--p-accent)" }}>PRD</em></h3>
          <p>Every bucket carries a PRD — problem, numbered testable requirements, acceptance criteria, non-goals, and a rollback plan. An agent can draft it from a template; you edit and approve.</p>
          <div className="acts">
            <button className="btn acc" onClick={() => nav("feed")}>Draft PRD with Scribe ✎</button>
            <button className="btn ghost" onClick={() => onNew && onNew(bucket.id)}>Start blank</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mc-main">
      <div className="ph">
        <div>
          <button className="back" onClick={() => nav("home")}>← Back</button>
          <span className="kk" style={{ display: "block", marginTop: 12 }}>Initiative · {bucket.id}</span>
          <h1 style={{ marginTop: 8 }}>{bucket.name.split(" ").slice(0, -1).join(" ")} <em>{bucket.name.split(" ").slice(-1)}</em></h1>
          <p className="sub">{bucket.desc}</p>
        </div>
        <div className="r">
          <HealthPill h={bucket.health} />
          <div className="vsw">
            <button onClick={() => nav("board", { bucketId: bucket.id })}>board</button>
            <button onClick={() => nav("list", { bucketId: bucket.id })}>list</button>
            <button onClick={() => nav("timeline", { bucketId: bucket.id })}>timeline</button>
          </div>
        </div>
      </div>

      <div className="bk">
        <div className="bkfacts">
          <div className="f"><span className="k">Owner</span><span className="v sm" style={{ display: "flex", alignItems: "center", gap: 7 }}><Avatar id={bucket.owner} size="sm" />{window.MC_ACTORS[bucket.owner].name}</span></div>
          <div className="f"><span className="k">Tasks</span><span className="v">{tasks.length}</span></div>
          <div className="f"><span className="k">Requirements met</span><span className="v">{trace ? satisfied + "/" + trace.rows.length : "—"}</span></div>
          <div className="f"><span className="k">Target</span><span className="v sm">{bucket.target}</span></div>
          <div className="f"><span className="k">SharePoint</span><span className="v sm"><SyncTick sync={bucket.sync} showTs={false} /></span></div>
        </div>

        <div className="bkbody">
          {/* left: PRD + tasks */}
          <div className="c">
            {prd && (
              <div className="blk">
                <div className="bh"><span className="kk">/ PRD · <b>{prd.id}</b></span><span className="kk">drafted by {window.MC_ACTORS[prd.drafted].name} · approved by {window.MC_ACTORS[prd.approvedBy].name}</span></div>
                <div className="prd">
                  <div className="ph2"><span className="t">{prd.title}</span><span className="pill acc"><span className="dot"></span>{prd.status}</span></div>
                  <div className="sec"><div className="k">Problem</div><div className="txt">{prd.problem}</div></div>
                  <div className="sec">
                    <div className="k">Requirements</div>
                    {prd.reqs.map((r) => {
                      const row = trace && trace.rows.find((x) => x.req === r.id);
                      return (
                        <div className="req" key={r.id}>
                          <span style={{ cursor: "pointer" }} onClick={() => nav("matrix")}><ReqChip id={r.id} gap={row && row.status === "gap"} /></span>
                          <div>
                            <div className="rt">{r.text}</div>
                            <div className="crit">Acceptance · {r.crit}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="sec"><div className="k">Non-goals</div><ul className="nongoals">{prd.nonGoals.map((g, i) => <li key={i}>{g}</li>)}</ul></div>
                  <div className="sec"><div className="k">Rollback plan</div><div className="txt">{prd.rollback}</div></div>
                </div>
              </div>
            )}

            <div className="blk">
              <div className="bh"><span className="kk">/ ToDos · SharePoint mirror · <b>{tasks.length}</b></span><span className="kk" style={{ cursor: "pointer", color: "var(--p-accent)" }} onClick={() => nav("board", { bucketId: bucket.id })}>Open board →</span></div>
              <div className="splist">
                <div className="splist-head">
                  <span className="src"><span className="ic">▦</span>ToDos (MS List) · {bucket.name}</span>
                  <a className="splink" href="#" onClick={(e) => e.preventDefault()}>Open in SharePoint ↗</a>
                </div>
                <div className="splist-table">
                  <div className="sprow head"><span>Task ID</span><span>Title</span><span>Status</span><span>Assigned To</span><span>Sync</span></div>
                  {tasks.map((t) => (
                    <div className="sprow" key={t.id} onClick={() => onOpen(t.id)}>
                      <span className="id">{t.id}</span>
                      <span className="ti">{t.title}</span>
                      <span className="st">{window.MC_STAGES[window.MC_STAGE_IDX[t.stage]].name}</span>
                      <span className="asg">{t.assignee ? <span className="who"><Avatar id={t.assignee} size="sm" /><span className="nm">{window.MC_ACTORS[t.assignee].name}</span></span> : <span className="none">—</span>}</span>
                      <span className="sycell"><SyncTick sync={t.sync} showTs={false} /></span>
                    </div>
                  ))}
                </div>
                <div className="splist-foot"><span>Mirrors two-way to ToDos columns</span><span>Last sync {bucket.sync.ts}</span></div>
              </div>
            </div>
          </div>

          {/* right: documents, milestones, risks, traceability summary */}
          <div className="c">
            <div className="blk">
              <div className="bh"><span className="kk">/ Documents &amp; Links</span><span className="kk"><span className="sync"><span className="d"></span>SharePoint</span></span></div>
              <div className="doclinks">
                <a className="dl" href="#" onClick={(e) => e.preventDefault()}><span className="ic">▦</span><span className="t">Project Plan</span><span className="ms">MS List</span><span className="ext">↗</span></a>
                <a className="dl" href="#" onClick={(e) => e.preventDefault()}><span className="ic">▷</span><span className="t">Roadmap</span><span className="ms">MS List</span><span className="ext">↗</span></a>
                <a className="dl" href="#" onClick={(e) => e.preventDefault()}><span className="ic">◆</span><span className="t">Milestone Register</span><span className="ms">MS List</span><span className="ext">↗</span></a>
                <a className="dl" href="#" onClick={(e) => e.preventDefault()}><span className="ic">△</span><span className="t">Risk Register</span><span className="ms">MS List</span><span className="ext">↗</span></a>
                <a className="dl" onClick={() => nav("files")}><span className="ic">❒</span><span className="t">Project Documents</span><span className="ms">Library</span><span className="ext">↗</span></a>
                {bucket.repos.map((r) => (
                  <a className="dl" key={r} onClick={() => nav("repos")}><span className="ic">❮❯</span><span className="t">{window.MC_REPOS[r].name}</span><span className="ms">GitHub</span><span className="ext">↗</span></a>
                ))}
              </div>
            </div>
            <div className="blk">
              <div className="bh"><span className="kk">/ Milestones</span></div>
              <div className="mlist">
                {miles.length ? miles.map((m) => (
                  <div className="risk" key={m.id} style={{ gridTemplateColumns: "1fr auto" }}>
                    <div><div className="t">{m.name}</div><div className="mit">{m.sp}</div></div>
                    <span className={"pill " + (m.state === "now" ? "acc" : m.state === "risk" ? "warn" : "muted")}><span className="dot"></span>{m.state === "now" ? "Active" : m.state === "risk" ? "At risk" : "Upcoming"}</span>
                  </div>
                )) : <div className="colempty">No milestones</div>}
              </div>
            </div>

            <div className="blk">
              <div className="bh"><span className="kk">/ Risks · <b>{risks.length}</b></span><span className="kk">→ Risk Register</span></div>
              <div className="risks">
                {risks.length ? risks.map((r) => (
                  <div className="risk" key={r.id}>
                    <div>
                      <div className="t">{r.title}</div>
                      <div className="mit">{r.mit}</div>
                      <div className="li">
                        <span className="x">Likelihood {r.like}</span><span className="x">Impact {r.impact}</span>
                        <span className="x" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Avatar id={r.owner} size="sm" />{window.MC_ACTORS[r.owner].name.split(" ")[0]}</span>
                      </div>
                    </div>
                    <SyncTick sync={r.sync} showTs={false} />
                  </div>
                )) : <div className="colempty">No open risks</div>}
              </div>
            </div>

            {trace && (
              <div className="blk" style={{ marginBottom: 0 }}>
                <div className="bh"><span className="kk">/ Traceability</span><span className="kk" style={{ cursor: "pointer", color: "var(--p-accent)" }} onClick={() => nav("matrix")}>Full matrix →</span></div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span className="okflag">{satisfied} satisfied</span>
                  <span className="pill info"><span className="dot"></span>{trace.rows.length - satisfied - gaps} in flight</span>
                  {gaps > 0 && <span className="gapflag">{gaps} gap</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Traceability Matrix ──────────────────────────────────────────────────────
function TraceMatrix({ nav, onOpen }) {
  const trace = window.MC_TRACE;
  const bucket = window.MC_BUCKET_IDX[trace.bucket];
  const prd = window.MC_PRDS[bucket.prd];
  const reqText = Object.fromEntries(prd.reqs.map((r) => [r.id, r.text]));

  return (
    <div className="mc-main">
      <div className="ph">
        <div>
          <span className="kk">Audit · {bucket.prd}</span>
          <h1>Traceability <em>matrix</em></h1>
          <p className="sub">Requirement → task(s) → PR(s) → evidence → test status → merge commit. The authoritative, exportable view — any unmet requirement is flagged a GAP.</p>
        </div>
        <div className="r">
          <span className="who" style={{ gap: 7 }}><span className="hl track" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--p-ok)", display: "inline-block" }}></span><span style={{ fontSize: 12, color: "var(--p-ink-2)" }}>{bucket.name}</span></span>
          <button className="btn ghost">Export ↗</button>
        </div>
      </div>

      <div className="matrix">
        <div className="mgrid">
          <div className="mrow head">
            <span className="h">Req</span><span className="h">Requirement</span><span className="h">Task(s)</span>
            <span className="h">PR(s)</span><span className="h">Evidence · test</span><span className="h">Merge</span><span className="h">Status</span>
          </div>
          {trace.rows.map((r) => (
            <div className={"mrow" + (r.status === "gap" ? " gap" : "")} key={r.req}>
              <span className="req">{r.req}</span>
              <span className="rtxt">{reqText[r.req]}</span>
              <span className="cell">
                {r.tasks.map((t) => <span key={t} className="x" style={{ cursor: "pointer", color: "var(--p-accent)" }} onClick={() => onOpen(t)}>{t}</span>)}
                {!r.tasks.length && <span className="x muted">— none —</span>}
              </span>
              <span className="cell">
                {r.prs.map((p) => <span key={p} className="x">{p}</span>)}
                {!r.prs.length && <span className="x muted">— none —</span>}
              </span>
              <span className="cell">
                <span className={"x" + (r.evidence === "incomplete" ? " muted" : "")}>{r.evidence}</span>
                <span className={"x" + (r.test.includes("/") && r.test !== "11/11" && r.test !== "8/8" ? " muted" : "")}>{r.test}</span>
              </span>
              <span className="merge">{r.merge}</span>
              <span>
                {r.status === "satisfied" && <span className="okflag">Satisfied</span>}
                {r.status === "gap" && <span className="gapflag">GAP</span>}
                {r.status === "in-review" && <span className="pill info" style={{ fontSize: 8 }}><span className="dot"></span>In review</span>}
                {r.status === "in-progress" && <span className="pill muted" style={{ fontSize: 8 }}><span className="dot"></span>In progress</span>}
              </span>
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 26px", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.06em", color: "var(--p-muted)" }}>
          REQ-2 satisfied via TASK-214 (11/11 E2E, evidence complete) · REQ-4 a GAP — TASK-219 evidence incomplete, no PR merged.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BucketDetail, TraceMatrix });
