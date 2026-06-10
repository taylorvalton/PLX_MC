/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — chrome: topbar, sidebar, command palette (⌘K)
   ══════════════════════════════════════════════════════════════════════════ */

const { useState: useStateC, useEffect: useEffectC, useRef: useRefC, useMemo: useMemoC } = React;

// ── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ nav, route, onCmdK, dark, setDark }) {
  return (
    <header className="mc-top">
      <div className="l">
        <div className="brand" onClick={() => nav("home")}>
          <span className="mark">Petra Lab-X</span>
          <span className="sub">Mission Control</span>
        </div>
        <div className="ws">
          <PMark acc />
          <span>PLX Engineering</span>
          <span className="chev">▾</span>
        </div>
      </div>
      <div className="r">
        <div className="search" onClick={onCmdK}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em" }}>Search · jump · create…</span>
          <span className="key">⌘K</span>
        </div>
        {(() => {
          const c = window.MC_syncCounts ? window.MC_syncCounts() : { pending: 0, conflict: 0, error: 0 };
          const need = c.conflict + c.error;
          const cls = need > 0 ? "warn" : c.pending > 0 ? "pending" : "ok";
          const label = need > 0 ? need + " to resolve" : c.pending > 0 ? c.pending + " pending" : "Synced";
          return (
            <span className={"topsync " + cls} onClick={() => nav("sync")} title="SharePoint sync">
              <span className="d"></span><span className="lb">{label}</span>
            </span>
          );
        })()}
        <button className="iconbtn" title={dark ? "Light mode" : "Dark mode"} onClick={() => setDark(!dark)}>
          {dark ? "☀" : "☾"}
        </button>
        <Avatar id="maya" size="lg" title="Maya Aldosari · Admin" />
      </div>
    </header>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ nav, route }) {
  const unread = window.MC_INBOX.filter((n) => n.unread).length;
  const liveAgents = Object.values(window.MC_AGENTS).filter((a) => a.online).length;
  const sc = window.MC_syncCounts ? window.MC_syncCounts() : { conflict: 0, error: 0 };
  const conflicts = sc.conflict + sc.error;

  const item = (screen, ic, label, params, badge) => {
    const active = route.screen === screen && (!params || params.bucketId === route.bucketId);
    return (
      <div className={"item" + (active ? " active" : "")} onClick={() => nav(screen, params)}>
        <span className="ic">{ic}</span>
        <span className="nm">{label}</span>
        {badge}
      </div>
    );
  };

  return (
    <nav className="mc-side">
      <div className="grp">
        {item("home", "⌂", "Inbox", null, unread ? <span className="badge acc">{unread}</span> : null)}
      </div>
      <div className="grp">
        <div className="h">Views</div>
        {item("board", "▦", "Board")}
        {item("list", "≣", "List")}
        {item("timeline", "▭", "Timeline")}
        {item("matrix", "⊞", "Traceability")}
        {item("feed", "◉", "Agent activity", null, <span className="badge acc">{liveAgents} live</span>)}
      </div>
      <div className="grp">
        <div className="h">Buckets</div>
        {window.MC_BUCKETS.map((b) => {
          const active = route.screen === "bucket" && route.bucketId === b.id;
          return (
            <div key={b.id} className={"item" + (active ? " active" : "")} onClick={() => nav("bucket", { bucketId: b.id })}>
              <span className={"hl " + b.health}></span>
              <span className="nm">{b.name}</span>
            </div>
          );
        })}
      </div>
      <div className="grp">
        <div className="h">System of record</div>
        {item("repos", "❮❯", "Repos")}
        {item("files", "❒", "Files")}
        {item("sync", "⇄", "Sync", null, conflicts ? <span className="badge hot">{conflicts}</span> : null)}
      </div>
    </nav>
  );
}

// ── Command palette ──────────────────────────────────────────────────────────
function CommandPalette({ open, onClose, nav, onAction, rev }) {
  const [q, setQ] = useStateC("");
  const [sel, setSel] = useStateC(0);
  const inputRef = useRefC(null);

  useEffectC(() => {
    if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); }
  }, [open]);

  const commands = useMemoC(() => {
    const create = [
      { ic: "+", label: "New task", hint: "create", act: () => onAction("new-task") },
      { ic: "+", label: "New bucket / initiative", hint: "create", act: () => onAction("new-bucket") },
      { ic: "✎", label: "Draft PRD with Scribe", hint: "agent", act: () => onAction("draft-prd") },
    ];
    const navg = [
      { ic: "⌂", label: "Go to Inbox", act: () => nav("home") },
      { ic: "▦", label: "Go to Board", act: () => nav("board") },
      { ic: "≣", label: "Go to List", act: () => nav("list") },
      { ic: "▭", label: "Go to Timeline", act: () => nav("timeline") },
      { ic: "⊞", label: "Go to Traceability matrix", act: () => nav("matrix") },
      { ic: "◉", label: "Go to Agent activity", act: () => nav("feed") },
      { ic: "⇄", label: "Go to Sync health", act: () => nav("sync") },
      { ic: "❒", label: "Go to Files", act: () => nav("files") },
      { ic: "❮❯", label: "Go to Repos", act: () => nav("repos") },
    ];
    const buckets = window.MC_BUCKETS.map((b) => ({ ic: "●", label: "Bucket · " + b.name, hint: b.id, act: () => nav("bucket", { bucketId: b.id }) }));
    const tasks = window.MC_TASKS.map((t) => ({ ic: "▸", label: t.id + " · " + t.title, hint: "task", act: () => nav("task", { taskId: t.id }) }));
    const assignAgents = Object.values(window.MC_AGENTS).map((a) => ({ ic: "◧", label: "Assign open task to " + a.name, hint: a.model, act: () => onAction("assign", a.id) }));
    return [
      { g: "Create", items: create },
      { g: "Navigate", items: navg },
      { g: "Buckets", items: buckets },
      { g: "Tasks", items: tasks },
      { g: "Assign", items: assignAgents },
    ];
  }, [nav, onAction, rev]);

  const flat = useMemoC(() => {
    const ql = q.trim().toLowerCase();
    const out = [];
    commands.forEach((grp) => {
      const matched = grp.items.filter((it) => !ql || it.label.toLowerCase().includes(ql) || (it.hint || "").toLowerCase().includes(ql));
      if (matched.length) out.push({ ...grp, items: matched });
    });
    return out;
  }, [q, commands]);

  const flatList = useMemoC(() => flat.flatMap((g) => g.items), [flat]);

  useEffectC(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(flatList.length - 1, s + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
      else if (e.key === "Enter") { e.preventDefault(); const c = flatList[sel]; if (c) { c.act(); onClose(); } }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flatList, sel, onClose]);

  if (!open) return null;
  let runningIdx = -1;
  return (
    <div className="mc-cmdk-overlay" onClick={onClose}>
      <div className="mc-cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cin">
          <span className="pre">⌘</span>
          <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }}
            placeholder="Create a task, jump to a bucket, assign an agent…" />
          <span className="esc">ESC</span>
        </div>
        <div style={{ maxHeight: "52vh", overflowY: "auto" }}>
          {flatList.length === 0 && <div className="cgrp"><div className="cres" style={{ color: "var(--p-muted)" }}>No matches</div></div>}
          {flat.map((grp) => (
            <div className="cgrp" key={grp.g}>
              <div className="gh">{grp.g}</div>
              {grp.items.map((it) => {
                runningIdx += 1;
                const mine = runningIdx;
                return (
                  <div key={it.label} className={"cres" + (sel === mine ? " on" : "")}
                    onMouseEnter={() => setSel(mine)}
                    onClick={() => { it.act(); onClose(); }}>
                    <span className="ic">{it.ic}</span>
                    <span>{it.label}</span>
                    {it.hint && <span className="hint">{it.hint}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Topbar, Sidebar, CommandPalette });
