/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — People picker (task a colleague)
   Typeahead over the Petra directory (@petralabx.com + @petrasoap.com), plus
   agents. Type any Petra email to INVITE someone not yet in the directory;
   non-Petra domains are blocked with a clear message. On pick, the consumer
   mirrors the assignee to SharePoint's "Assigned To" column and dispatches a
   Teams/email notification.
   ══════════════════════════════════════════════════════════════════════════ */

const { useState: useStateP, useRef: useRefP, useEffect: useEffectP, useMemo: useMemoP } = React;

function PersonRow({ id, onPick, active }) {
  const p = window.MC_ACTORS[id];
  if (!p) return null;
  const domain = window.MC_domainOf(p.email);
  return (
    <div className={"pi" + (active ? " on" : "")} onClick={() => onPick(id)}>
      <Avatar id={id} size="sm" />
      <span className="pp-name">{p.name}{p.invited && <span className="pp-inv">invited</span>}</span>
      <span className="pp-meta">{p.kind === "agent" ? (p.model + " · " + p.team) : (domain || p.role)}</span>
    </div>
  );
}

function PeoplePicker({ current, onPick, onClose, allowAgents = true, style }) {
  const [q, setQ] = useStateP("");
  const inputRef = useRefP(null);
  useEffectP(() => { setTimeout(() => inputRef.current && inputRef.current.focus(), 30); }, []);
  useEffectP(() => {
    const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const ql = q.trim().toLowerCase();
  const people = useMemoP(() => window.MC_directory().filter((p) =>
    !ql || p.name.toLowerCase().includes(ql) || (p.email || "").toLowerCase().includes(ql)
  ), [ql]);
  const agents = useMemoP(() => Object.values(window.MC_AGENTS).filter((a) =>
    !ql || a.name.toLowerCase().includes(ql) || (a.team || "").toLowerCase().includes(ql)
  ), [ql]);

  const looksEmail = /@/.test(ql);
  const validInvite = window.MC_isPetraEmail(ql) && !window.MC_personByEmail(ql);
  const badDomain = looksEmail && !window.MC_isPetraEmail(ql);

  const pick = (id) => { onPick(id); onClose(); };
  const invite = () => { const id = window.MC_invitePerson(ql); if (id) pick(id); };

  return (
    <div className="picker ppick" style={style} onClick={(e) => e.stopPropagation()}>
      <div className="ppick-search">
        <span className="mag">⌕</span>
        <input ref={inputRef} value={q} placeholder="Name or @petra email…"
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && validInvite) invite(); }} />
      </div>
      <div className="ppick-list">
        {badDomain && (
          <div className="ppick-block">
            <b>{ql.split("@")[1]}</b> can’t be tasked — only <b>@petralabx.com</b> and <b>@petrasoap.com</b> colleagues.
          </div>
        )}
        {validInvite && (
          <div className="pi invite" onClick={invite}>
            <span className="pp-plus">+</span>
            <span className="pp-name">Invite {ql}</span>
            <span className="pp-meta">{window.MC_domainOf(ql)}</span>
          </div>
        )}
        {current && !ql && (
          <div className="pi clear" onClick={() => pick(null)}>
            <span className="pp-plus">×</span><span className="pp-name" style={{ color: "var(--p-muted)" }}>Unassign</span>
          </div>
        )}
        {people.length > 0 && <div className="pg">People · Petra Lab-X &amp; Petra Soap</div>}
        {people.map((p) => <PersonRow key={p.id} id={p.id} onPick={pick} active={current === p.id} />)}
        {allowAgents && agents.length > 0 && <div className="pg">Agents</div>}
        {allowAgents && agents.map((a) => <PersonRow key={a.id} id={a.id} onPick={pick} active={current === a.id} />)}
        {people.length === 0 && agents.length === 0 && !validInvite && !badDomain && (
          <div className="ppick-empty">No matches</div>
        )}
      </div>
    </div>
  );
}

// Small reusable badge shown after assigning: the SharePoint mirror + notify trail.
function NotifyTrail({ id }) {
  const p = id ? window.MC_ACTORS[id] : null;
  if (!p || p.kind !== "human") return null;
  return (
    <span className="notify-trail" title={"Assigned To mirrored to SharePoint · notified " + p.name}>
      <span className="d"></span>Mirrored to SharePoint · notified via Teams + email
    </span>
  );
}

Object.assign(window, { PeoplePicker, PersonRow, NotifyTrail });
