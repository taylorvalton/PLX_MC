/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — Agent Activity Feed (live "mission control" stream)
   What agents are doing now, with status chips, streaming screenshots, and
   one-tap approve / intervene. Humans appear inline reviewing agent work.
   ══════════════════════════════════════════════════════════════════════════ */

function AgentFeed({ onOpen }) {
  const liveAgents = Object.values(window.MC_AGENTS);
  return (
    <div className="mc-main">
      <div className="ph">
        <div>
          <span className="kk">Mission control · live</span>
          <h1>Agent <em>activity</em></h1>
          <p className="sub">What the agents are doing right now — assembling evidence, running QA, drafting PRDs, keeping the record in sync. Humans review and approve inline; nothing here is a chatbot.</p>
        </div>
        <div className="r">
          <div style={{ display: "flex", gap: 6 }}>
            {liveAgents.map((a) => (
              <span key={a.id} className="who" title={a.name + " · " + a.team + " · " + a.model} style={{ gap: 6 }}>
                <Avatar id={a.id} size="sm" />
                <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--p-muted)" }}>{a.team}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="feed">
        {window.MC_AGENT_FEED.map((f, idx) => {
          const actor = window.MC_ACTORS[f.actor];
          const task = window.MC_TASK_IDX[f.task];
          const chipCls = f.live ? "live" : f.warn ? "warn" : f.kind === "approve" || f.kind === "sync" ? "acc" : "";
          return (
            <div className={"frow" + (f.live ? " live" : "")} key={idx}>
              <span className="ftime">{f.age}</span>
              <div className="fbody">
                <div className="fline">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, verticalAlign: "middle", marginRight: 4 }}>
                    <Avatar id={f.actor} size="sm" />
                  </span>
                  <b>{actor.name}</b>
                  {actor.kind === "agent" && <span className="tag model" style={{ margin: "0 5px" }}>{actor.model}</span>}
                  {f.human && <span className="tag" style={{ margin: "0 5px" }}>{actor.role}</span>}
                  {" "}{f.text}{" "}
                  <a onClick={() => onOpen(f.task)}>{f.task}</a>
                  {task && <span style={{ color: "var(--p-muted)" }}> · {task.title}</span>}
                </div>
                <div className="fmeta">
                  <span className={"fchip " + chipCls}>
                    {f.live && <span className="livedot"></span>}
                    {f.chip}
                  </span>
                  {actor.kind === "agent" && <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--p-muted)" }}>{window.MC_MODE[actor.mode].short}</span>}
                </div>
                {f.shots && (
                  <div className="fshots">{f.shots.map((s, i) => <Slate key={i} label={i === 0 ? "Before" : "After"} cap={s} />)}</div>
                )}
              </div>
              <div className="factions">
                {f.live && f.kind === "run" && (
                  <React.Fragment>
                    <button className="btn acc sm" onClick={() => onOpen(f.task)}>Approve →</button>
                    <button className="btn ghost sm" onClick={() => onOpen(f.task)}>Intervene</button>
                  </React.Fragment>
                )}
                {!f.live && <button className="btn ghost sm" onClick={() => onOpen(f.task)}>Open</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { AgentFeed });
