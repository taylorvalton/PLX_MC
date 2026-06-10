/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — app shell: routing, toolbars, tweaks
   Screens: home · board · list · timeline · matrix · feed · sync · repos ·
   bucket · task. Golden path starts at the Inbox (Vibes submitted TASK-214).
   ══════════════════════════════════════════════════════════════════════════ */

const { useState, useEffect, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "grouping": "band",
  "swimlanes": "none",
  "listGroup": "bucket"
}/*EDITMODE-END*/;

// ── shared work-views toolbar (board / list / timeline) ──────────────────────
function WorkViews({ route, nav, t, setTweak, onOpen, onNew }) {
  const screen = route.screen;
  const bucket = route.bucketId ? window.MC_BUCKET_IDX[route.bucketId] : null;
  const tasks = route.bucketId ? window.MC_TASKS.filter((x) => x.bucket === route.bucketId) : window.MC_TASKS;

  const goView = (v) => nav(v, route.bucketId ? { bucketId: route.bucketId } : null);

  return (
    <div className="mc-main">
      <div className="ph" style={{ paddingBottom: 14 }}>
        <div>
          <span className="kk">Workspace{bucket ? " · " + bucket.id : ""}</span>
          <h1>{bucket ? <React.Fragment>{bucket.name.split(" ").slice(0, -1).join(" ")} <em>{bucket.name.split(" ").slice(-1)}</em></React.Fragment> : <React.Fragment>All <em>work</em></React.Fragment>}</h1>
        </div>
        <div className="r">
          {bucket && <span className="pill muted" style={{ cursor: "pointer" }} onClick={() => goView(screen)}>{/* keep */}<span className="dot"></span>{bucket.id} ✕ </span>}
        </div>
      </div>

      <div className="tb">
        <div className="l">
          <div className="vsw">
            {["board", "list", "timeline"].map((v) => (
              <button key={v} className={screen === v ? "on" : ""} onClick={() => goView(v)}>{v}</button>
            ))}
          </div>
          {route.bucketId && (
            <span className="pill acc" style={{ cursor: "pointer" }} onClick={() => nav(screen)} title="Clear bucket filter">
              <span className="dot"></span>{window.MC_BUCKET_IDX[route.bucketId].name} ✕
            </span>
          )}
        </div>
        <div className="r">
          {screen === "board" && (
            <React.Fragment>
              <span className="lbl">Stages</span>
              <div className="seg">
                <button className={t.grouping === "band" ? "on" : ""} onClick={() => setTweak("grouping", "band")}>3-band</button>
                <button className={t.grouping === "full" ? "on" : ""} onClick={() => setTweak("grouping", "full")}>Full lifecycle</button>
              </div>
              <span className="lbl">Swimlanes</span>
              <div className="seg">
                <button className={t.swimlanes === "none" ? "on" : ""} onClick={() => setTweak("swimlanes", "none")}>Off</button>
                <button className={t.swimlanes === "agents" ? "on" : ""} onClick={() => setTweak("swimlanes", "agents")}>Human · Agent</button>
              </div>
            </React.Fragment>
          )}
          {screen === "list" && (
            <React.Fragment>
              <span className="lbl">Group</span>
              <div className="seg">
                {["bucket", "status", "assignee"].map((g) => (
                  <button key={g} className={t.listGroup === g ? "on" : ""} onClick={() => setTweak("listGroup", g)}>{g}</button>
                ))}
              </div>
            </React.Fragment>
          )}
          <span className="count"><b>{tasks.length}</b> tasks</span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty">
          <span className="glyph"><PMark /></span>
          <h3>A calm, empty board</h3>
          <p>No tasks here yet. Create the first one, or let an agent draft a PRD so the work can be planned.</p>
          <div className="acts"><button className="btn acc" onClick={() => onNew(route.bucketId)}>Create first task +</button></div>
        </div>
      ) : (
        <React.Fragment>
          {screen === "board" && <BoardView tasks={tasks} grouping={t.grouping} swimlanes={t.swimlanes} onOpen={onOpen} />}
          {screen === "list" && <ListView tasks={tasks} groupBy={route.bucketId ? "status" : t.listGroup} onOpen={onOpen} />}
          {screen === "timeline" && <TimelineView tasks={tasks} onOpen={onOpen} />}
        </React.Fragment>
      )}
    </div>
  );
}

// ── app ──────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState({ screen: "home" });
  const [cmdk, setCmdk] = useState(false);
  const [newTask, setNewTask] = useState(null); // null = closed; { bucketId } when open
  const [taskRev, setTaskRev] = useState(0);     // bump to re-read window.MC_TASKS after a create
  const [, setSyncRev] = useState(0);            // bump on any sync mutation (keeps topbar pill live)

  useEffect(() => {
    const h = () => setSyncRev((v) => v + 1);
    window.addEventListener("mc-sync", h);
    return () => window.removeEventListener("mc-sync", h);
  }, []);

  useEffect(() => { document.documentElement.classList.toggle("dark", !!t.dark); }, [t.dark]);

  const nav = useCallback((screen, params) => {
    setRoute({ screen, ...(params || {}) });
    window.scrollTo(0, 0);
  }, []);
  const openTask = useCallback((taskId) => nav("task", { taskId }), [nav]);
  const openNewTask = useCallback((bucketId) => setNewTask({ bucketId: bucketId || null }), []);
  const handleCreated = useCallback((task) => {
    setNewTask(null);
    setTaskRev((v) => v + 1);
    nav("board", task.bucket ? { bucketId: task.bucket } : null);
  }, [nav]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdk((o) => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onAction = useCallback((kind, arg) => {
    if (kind === "new-task") openNewTask(route.bucketId);
    else if (kind === "draft-prd") nav("feed");
    else if (kind === "assign") nav("feed");
    else if (kind === "new-bucket") nav("home");
    else nav("board");
  }, [nav, openNewTask, route.bucketId]);

  let screen;
  const s = route.screen;
  if (s === "home") screen = <InboxView onOpen={openTask} nav={nav} onCmdK={() => setCmdk(true)} />;
  else if (s === "board" || s === "list" || s === "timeline") screen = <WorkViews key={"work-" + taskRev} route={route} nav={nav} t={t} setTweak={setTweak} onOpen={openTask} onNew={openNewTask} />;
  else if (s === "matrix") screen = <TraceMatrix nav={nav} onOpen={openTask} />;
  else if (s === "feed") screen = <AgentFeed onOpen={openTask} />;
  else if (s === "sync") screen = <SyncHealth onOpen={openTask} nav={nav} />;
  else if (s === "repos") screen = <ReposView onOpen={openTask} />;
  else if (s === "files") screen = <FilesView nav={nav} />;
  else if (s === "bucket") screen = <BucketDetail key={"bucket-" + route.bucketId + "-" + taskRev} bucket={window.MC_BUCKET_IDX[route.bucketId]} nav={nav} onOpen={openTask} onNew={openNewTask} />;
  else if (s === "task") screen = <TaskDetail key={route.taskId} task={window.MC_TASK_IDX[route.taskId]} onBack={() => nav("home")} nav={nav} />;
  else screen = <InboxView onOpen={openTask} nav={nav} onCmdK={() => setCmdk(true)} />;

  return (
    <div className={"mc" + (t.dark ? " dark" : "")}>
      <Topbar nav={nav} route={route} onCmdK={() => setCmdk(true)} dark={t.dark} setDark={(v) => setTweak("dark", v)} />
      <div className="mc-shell">
        <Sidebar nav={nav} route={route} />
        {screen}
      </div>

      <CommandPalette open={cmdk} onClose={() => setCmdk(false)} nav={nav} onAction={onAction} rev={taskRev} />

      <NewTaskModal open={!!newTask} ctx={newTask} onClose={() => setNewTask(null)} onCreate={handleCreated} />

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakSection label="Board" />
        <TweakRadio label="Stages" value={t.grouping}
          options={[{ value: "band", label: "3-band" }, { value: "full", label: "Full" }]}
          onChange={(v) => setTweak("grouping", v)} />
        <TweakRadio label="Swimlanes" value={t.swimlanes}
          options={[{ value: "none", label: "Off" }, { value: "agents", label: "H · A" }]}
          onChange={(v) => setTweak("swimlanes", v)} />
        <TweakSection label="List" />
        <TweakSelect label="Group by" value={t.listGroup}
          options={[{ value: "bucket", label: "Bucket" }, { value: "status", label: "Status" }, { value: "assignee", label: "Assignee" }]}
          onChange={(v) => setTweak("listGroup", v)} />
        <TweakSection label="Workspace" />
        <TweakButton label="+ New task" onClick={() => openNewTask(route.bucketId)} />
        <TweakButton label="Reset created tasks" secondary onClick={() => {
          window.MC_clearUserTasks();
          setTaskRev((v) => v + 1);
          nav("board");
        }} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
