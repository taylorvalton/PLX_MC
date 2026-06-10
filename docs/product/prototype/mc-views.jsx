/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — core views: Board, List, Timeline, Repos, Inbox
   ══════════════════════════════════════════════════════════════════════════ */

const { useState: useStateV } = React;

// ── Task card (board) ─────────────────────────────────────────────────────────
function TaskCard({ task, onOpen }) {
  const b = window.MC_BUCKET_IDX[task.bucket];
  return (
    <a className={"tcard" + (task.blocked ? " blocked" : "")} onClick={() => onOpen(task.id)}>
      <div className="ct-top">
        <span className="ct-id">{task.id}</span>
        <Confidence task={task} showLabel={false} />
      </div>
      <div className="ct-title">{task.title}</div>
      <div className="ct-meta">
        <Priority p={task.priority} />
        {task.reqs.map((r) => <ReqChip key={r} id={r} />)}
        {task.labels.slice(0, 1).map((l) => <Label key={l} text={l} />)}
      </div>
      {task.repos.length > 0 && (
        <div className="ct-repos">
          {task.repos.map((r) => <RepoChip key={r} id={r} />)}
        </div>
      )}
      <Spine task={task} />
      <div className="ct-foot">
        {task.assignee ? <Assignee id={task.assignee} /> : <span className="unassigned">+ Assign</span>}
        <SyncTick sync={task.sync} showTs={false} />
      </div>
    </a>
  );
}

// ── Board ──────────────────────────────────────────────────────────────────
function BoardView({ tasks, grouping, swimlanes, onOpen }) {
  const cols = grouping === "full" ? window.MC_STAGES : window.MC_BANDS;
  const colTasks = (col) => grouping === "full"
    ? tasks.filter((t) => t.stage === col.key)
    : tasks.filter((t) => window.MC_bandOf(t.stage) === col.key);

  const renderCards = (list) => {
    if (swimlanes === "agents") {
      const humans = list.filter((t) => t.assignee && window.MC_HUMANS[t.assignee]);
      const agents = list.filter((t) => t.assignee && window.MC_AGENTS[t.assignee]);
      const none = list.filter((t) => !t.assignee);
      return (
        <React.Fragment>
          {agents.length > 0 && <React.Fragment><div className="swlabel">Agents</div>{agents.map((t) => <TaskCard key={t.id} task={t} onOpen={onOpen} />)}</React.Fragment>}
          {humans.length > 0 && <React.Fragment><div className="swlabel">Humans</div>{humans.map((t) => <TaskCard key={t.id} task={t} onOpen={onOpen} />)}</React.Fragment>}
          {none.length > 0 && <React.Fragment><div className="swlabel">Unassigned</div>{none.map((t) => <TaskCard key={t.id} task={t} onOpen={onOpen} />)}</React.Fragment>}
          {list.length === 0 && <div className="colempty">Empty</div>}
        </React.Fragment>
      );
    }
    return list.length ? list.map((t) => <TaskCard key={t.id} task={t} onOpen={onOpen} />) : <div className="colempty">Empty</div>;
  };

  return (
    <div className={"board" + (grouping === "full" ? " full" : "")}>
      {cols.map((col) => {
        const list = colTasks(col);
        return (
          <div className="bcol" key={col.key}>
            <div className="bhead">
              <span className="nm">
                {col.n && <span className="n">{col.n}</span>}{col.name}
                {col.gate && <span className="gate">{col.gate} gate</span>}
              </span>
              <span className="ct">{list.length}</span>
            </div>
            <div className="bbody">{renderCards(list)}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── List ─────────────────────────────────────────────────────────────────────
function ListView({ tasks, groupBy, onOpen }) {
  let groups;
  if (groupBy === "assignee") {
    const by = {};
    tasks.forEach((t) => { const k = t.assignee || "unassigned"; (by[k] = by[k] || []).push(t); });
    groups = Object.entries(by).map(([k, list]) => ({ name: k === "unassigned" ? "Unassigned" : window.MC_ACTORS[k].name, list }));
  } else if (groupBy === "status") {
    groups = window.MC_BANDS.map((band) => ({ name: band.name, list: tasks.filter((t) => window.MC_bandOf(t.stage) === band.key) }));
  } else {
    groups = window.MC_BUCKETS.map((b) => ({ name: b.name, list: tasks.filter((t) => t.bucket === b.id) }));
  }
  groups = groups.filter((g) => g.list.length);

  return (
    <div className="list">
      {groups.map((g) => (
        <React.Fragment key={g.name}>
          <div className="grouphd"><span className="nm">{g.name}</span><span className="ct">{g.list.length}</span></div>
          <div className="lrow head">
            <span className="h">ID</span><span className="h">Title</span><span className="h">Assignee</span>
            <span className="h head-stage">Stage</span><span className="h">Confidence</span>
            <span className="h head-due">Due</span><span className="h head-sync">Sync</span>
          </div>
          {g.list.map((t) => {
            const st = window.MC_STAGES[window.MC_STAGE_IDX[t.stage]];
            return (
              <a className="lrow" key={t.id} onClick={() => onOpen(t.id)}>
                <span className="id">{t.id}</span>
                <span className="title">{t.title}</span>
                <span>{t.assignee ? <Assignee id={t.assignee} /> : <span className="unassigned">+ Assign</span>}</span>
                <span className="stagecell">{st.n} · {st.name}<Spine task={t} /></span>
                <span><Confidence task={t} /></span>
                <span className="duecell" style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--p-muted)" }}>{t.due}</span>
                <span className="synccell"><SyncTick sync={t.sync} showTs={false} /></span>
              </a>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────
const dueDay = (due) => { const m = (due || "").match(/(\d+)/); return m ? parseInt(m[1], 10) : null; };
const spanOf = (est) => ({ S: 4, M: 7, L: 11 }[est] || 6);
const MONTH = 30; // June window, day 1..30

function TimelineView({ tasks, onOpen }) {
  const pct = (day) => Math.max(0, Math.min(100, (day / MONTH) * 100));
  const buckets = window.MC_BUCKETS.filter((b) => tasks.some((t) => t.bucket === b.id));

  return (
    <div className="tl">
      <div className="grid">
        {/* cycle band header */}
        <div className="cyc">
          <div className="corner">Bucket / task</div>
          <div className="bands">
            {window.MC_CYCLES.map((c) => <div className="b" key={c.id}>{c.name} · Jun {String(c.from).padStart(2, "0")}–{c.to}</div>)}
          </div>
        </div>
        {buckets.map((b) => {
          const bt = tasks.filter((t) => t.bucket === b.id);
          const miles = window.MC_MILESTONES.filter((m) => m.bucket === b.id);
          return (
            <React.Fragment key={b.id}>
              <div className="grp">
                <div className="nm"><span className={"hl-x"} style={{ width: 6, height: 6, borderRadius: "50%", background: `var(--p-${b.health === "track" ? "ok" : b.health === "risk" ? "warn" : "hot"})`, display: "inline-block" }}></span>{b.name}</div>
                <div className="track" style={{ position: "relative", height: 26 }}>
                  {/* cycle bands — first cycle tinted to read as two zones */}
                  {window.MC_CYCLES.map((c, i) => <div key={c.id} className={"cycband" + (i % 2 === 0 ? " tint" : "")} style={{ left: pct(c.from - 1) + "%", width: pct(c.to - c.from + 1) + "%" }}></div>)}
                  {miles.map((m) => (
                    <div key={m.id} className={"mile " + (m.state === "now" ? "now" : m.state === "risk" ? "risk" : "")}
                      style={{ left: pct(m.col) + "%", top: "50%" }} title={m.name + " · " + m.sp}></div>
                  ))}
                </div>
              </div>
              {bt.map((t) => {
                const dd = dueDay(t.due);
                const sp = spanOf(t.estimate);
                const end = dd || 24;
                const start = Math.max(1, end - sp);
                const segCls = t.blocked ? "seg-blocked" : t.stage === "verified" || t.stage === "merged" ? "seg-done"
                  : window.MC_BUCKET_IDX[t.bucket].health === "risk" || t.priority === "urgent" ? "seg-risk" : "seg-track";
                const crit = t.priority === "urgent";
                return (
                  <a className="row" key={t.id} onClick={() => onOpen(t.id)}>
                    <div className="lab">
                      <div className="t">{t.title}</div>
                      <div className="s">{t.id} · {window.MC_STAGES[window.MC_STAGE_IDX[t.stage]].name}</div>
                    </div>
                    <div className="track">
                      {window.MC_CYCLES.map((c, i) => <div key={c.id} className={"cycband" + (i % 2 === 0 ? " tint" : "")} style={{ left: pct(c.from - 1) + "%", width: pct(c.to - c.from + 1) + "%" }}></div>)}
                      <div className={"bar " + segCls + (crit ? " crit" : "")} style={{ left: pct(start) + "%", width: (pct(end) - pct(start)) + "%" }}></div>
                    </div>
                  </a>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ── Repos ──────────────────────────────────────────────────────────────────
function ReposView({ onOpen }) {
  const [open, setOpen] = useStateV(null);
  return (
    <div className="mc-main">
    <div className="ph">
      <div>
        <span className="kk">System of record · code</span>
        <h1>Repos</h1>
        <p className="sub">The codebases the workspace tracks. A single task can span multiple repos — its PRs land where the work actually lives.</p>
      </div>
      <div className="r"><span className="count"><b>{Object.keys(window.MC_REPOS).length}</b> repos</span></div>
    </div>
    <div className="repos">
      {Object.values(window.MC_REPOS).map((r) => {
        const rtasks = window.MC_TASKS.filter((t) => t.repos.includes(r.id));
        const prs = [];
        window.MC_TASKS.forEach((t) => (t.prs || []).forEach((p) => { if (p.repo === r.id) prs.push({ ...p, task: t.id }); }));
        const isOpen = open === r.id;
        return (
          <div className="repo-row" key={r.id}>
            <div className="rh" onClick={() => setOpen(isOpen ? null : r.id)}>
              <span className="glyph">❮❯</span>
              <div>
                <div className="nm">{r.name}</div>
                <div className="lang">{r.lang} · default {r.def}</div>
              </div>
              <div className="ct"><b>{prs.length}</b> open PRs</div>
              <div className="ct"><b>{rtasks.length}</b> tasks · {isOpen ? "▾" : "▸"}</div>
            </div>
            {isOpen && (
              <div className="rbody">
                {prs.map((p) => (
                  <div className="ritem" key={p.repo + p.num} onClick={() => onOpen(p.task)}>
                    <span className="id">#{p.num}</span>
                    <span>{p.title}</span>
                    <span className="pill muted" style={{ marginLeft: "auto" }}><span className="dot"></span>{p.status}</span>
                    <span className="id">{p.task}</span>
                  </div>
                ))}
                {rtasks.map((t) => (
                  <div className="ritem" key={t.id} onClick={() => onOpen(t.id)}>
                    <span className="id">{t.id}</span>
                    <span>{t.title}</span>
                    {t.repos.length > 1 && <span className="reqchip" style={{ marginLeft: "auto" }} title="Spans multiple repos">×{t.repos.length} repos</span>}
                    <span style={{ marginLeft: t.repos.length > 1 ? 0 : "auto" }}>{t.assignee && <Avatar id={t.assignee} size="sm" />}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
    </div>
  );
}

// ── Inbox / Home ──────────────────────────────────────────────────────────────
function InboxView({ onOpen, nav, onCmdK }) {
  const mine = window.MC_TASKS.filter((t) => t.assignee === "maya" || (t.coassignees || []).includes("maya") || t.reporter === "maya").slice(0, 5);
  return (
    <div className="mc-main">
    <div className="ph">
      <div>
        <span className="kk">Good morning, Maya</span>
        <h1>Mission <em>control</em></h1>
        <p className="sub">Your inbox and what's assigned to you. Agents work in the background — you review and approve. Everything resolves to a task, and every change mirrors to the record.</p>
      </div>
      <div className="r">
        <button className="btn ghost" onClick={() => nav && nav("feed")}>Agent activity ◉</button>
        <button className="btn" onClick={onCmdK}>New ⌘K</button>
      </div>
    </div>
    <div className="inbox">
      <div className="grouphd"><span className="nm">Needs your attention</span><span className="ct">{window.MC_INBOX.filter((n) => n.unread).length} unread</span></div>
      {window.MC_INBOX.map((n) => (
        <a className={"nrow" + (n.unread ? " unread" : "")} key={n.id} onClick={() => onOpen(n.task)}>
          <span className="dot"></span>
          <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span className={"tag " + n.kind}>{n.kind}</span>
            <span className="body">{n.text}</span>
          </span>
          <span className="age">{n.age}</span>
        </a>
      ))}
      <div className="grouphd"><span className="nm">Assigned to me</span><span className="ct">{mine.length} reporting</span></div>
      {mine.map((t) => (
        <a className="nrow" key={t.id} onClick={() => onOpen(t.id)}>
          <span className="dot"></span>
          <span style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
            <span className="id" style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--p-muted)" }}>{t.id}</span>
            <span className="body">{t.title}</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Confidence task={t} showLabel={false} /><span className="age">{t.due}</span></span>
        </a>
      ))}
    </div>
    </div>
  );
}

Object.assign(window, { TaskCard, BoardView, ListView, TimelineView, ReposView, InboxView });
