/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — New-task modal
   The human authoring surface: title + description, then the structured spine
   every task carries — initiative, owner (human or agent), priority, stage,
   due, estimate — plus optional PRD requirements, repos, and labels scoped to
   the chosen initiative. Submits through window.MC_addTask (persists to
   localStorage); the card lands on the board and mirrors PENDING to the record.
   ══════════════════════════════════════════════════════════════════════════ */

const { useState: useStateNT, useEffect: useEffectNT, useRef: useRefNT, useMemo: useMemoNT } = React;

const NT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function ntFmtDue(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return "—";
  return NT_MONTHS[d.getMonth()] + " " + d.getDate();
}

// ── Owner picker (Petra directory + agents), reuses the shared PeoplePicker ──
function NTAssignee({ current, onPick }) {
  const [open, setOpen] = useStateNT(false);
  const a = current ? window.MC_ACTORS[current] : null;
  const isAgent = a && a.kind === "agent";
  return (
    <div style={{ position: "relative" }}>
      <button type="button" className="ntm-field-btn" onClick={() => setOpen((o) => !o)}>
        {a ? (
          <span className="who" style={{ gap: 7 }}>
            <Avatar id={current} size="sm" />
            <span className="nm">{a.name}</span>
            {isAgent && <span className="tag model">{a.model}</span>}
          </span>
        ) : (
          <span className="unassigned">+ Assign owner</span>
        )}
        <span className="caret">▾</span>
      </button>
      {open && (
        <PeoplePicker
          current={current}
          style={{ top: "100%", left: 0, marginTop: 5, minWidth: "100%" }}
          onPick={onPick}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function NTSeg({ value, options, onChange }) {
  return (
    <div className="seg ntm-seg">
      {options.map((o) => (
        <button type="button" key={o.value} className={value === o.value ? "on" : ""} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

function NewTaskModal({ open, ctx, onClose, onCreate }) {
  const firstBucket = (ctx && ctx.bucketId) || (window.MC_BUCKETS[0] && window.MC_BUCKETS[0].id);
  const [title, setTitle] = useStateNT("");
  const [desc, setDesc] = useStateNT("");
  const [bucket, setBucket] = useStateNT(firstBucket);
  const [assignee, setAssignee] = useStateNT(null);
  const [priority, setPriority] = useStateNT("medium");
  const [stage, setStage] = useStateNT("backlog");
  const [estimate, setEstimate] = useStateNT("M");
  const [dueISO, setDueISO] = useStateNT("");
  const [reqs, setReqs] = useStateNT([]);
  const [repos, setRepos] = useStateNT([]);
  const [labels, setLabels] = useStateNT([]);
  const [labelDraft, setLabelDraft] = useStateNT("");
  const titleRef = useRefNT(null);

  // Reset every time the modal opens (and seed bucket from context).
  useEffectNT(() => {
    if (!open) return;
    setTitle(""); setDesc("");
    setBucket((ctx && ctx.bucketId) || (window.MC_BUCKETS[0] && window.MC_BUCKETS[0].id));
    setAssignee(null); setPriority("medium"); setStage("backlog");
    setEstimate("M"); setDueISO(""); setReqs([]); setRepos([]); setLabels([]); setLabelDraft("");
    setTimeout(() => titleRef.current && titleRef.current.focus(), 40);
  }, [open, ctx]);

  // Esc to close.
  useEffectNT(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const b = bucket ? window.MC_BUCKET_IDX[bucket] : null;
  const prd = b && b.prd ? window.MC_PRDS[b.prd] : null;
  // Repos to offer: the initiative's repos, else the full set.
  const repoOptions = useMemoNT(() => (b && b.repos && b.repos.length ? b.repos : Object.keys(window.MC_REPOS)), [bucket]);

  // Clear req/repo selections that don't belong to the chosen initiative.
  useEffectNT(() => {
    setReqs((rs) => rs.filter((r) => prd && prd.reqs.some((x) => x.id === r)));
    setRepos((rp) => rp.filter((r) => repoOptions.includes(r)));
  }, [bucket]);

  const canCreate = title.trim().length > 0 && !!bucket;

  const toggle = (arr, setArr, v) => setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const addLabel = () => {
    const v = labelDraft.trim().toLowerCase();
    if (v && !labels.includes(v)) setLabels([...labels, v]);
    setLabelDraft("");
  };

  const submit = () => {
    if (!canCreate) return;
    const task = window.MC_addTask({
      title, description: desc, bucket, assignee, priority, stage,
      estimate, due: ntFmtDue(dueISO), reqs, repos, labels, reporter: "maya",
    });
    onCreate(task);
  };

  if (!open) return null;

  const STAGE_OPTS = window.MC_STAGES.map((s) => ({ value: s.key, label: s.n + " · " + s.name }));

  return (
    <div className="ntm-overlay" onClick={onClose}>
      <div className="ntm" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Create a new task">
        <div className="ntm-head">
          <div>
            <span className="kk">New task · {window.MC_nextTaskId()}</span>
            <h2>Create a <em>task</em></h2>
          </div>
          <button type="button" className="ntm-x" onClick={onClose} title="Close (Esc)">✕</button>
        </div>

        <div className="ntm-body">
          {/* ── title + description ── */}
          <input
            ref={titleRef}
            className="ntm-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
            placeholder="What needs to be done?"
          />
          <textarea
            className="ntm-desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add a description, acceptance notes, or context… (optional)"
            rows={3}
          />

          {/* ── structured facts ── */}
          <div className="ntm-grid">
            <label className="ntm-fact">
              <span className="k">Initiative</span>
              <div className="ntm-select-wrap">
                <select value={bucket || ""} onChange={(e) => setBucket(e.target.value)}>
                  {window.MC_BUCKETS.map((bk) => <option key={bk.id} value={bk.id}>{bk.name}</option>)}
                </select>
                <span className="caret">▾</span>
              </div>
            </label>

            <div className="ntm-fact">
              <span className="k">Owner</span>
              <NTAssignee current={assignee} onPick={setAssignee} />
              <NotifyTrail id={assignee} />
            </div>

            <div className="ntm-fact">
              <span className="k">Priority</span>
              <NTSeg value={priority} onChange={setPriority} options={[
                { value: "urgent", label: "Urgent" }, { value: "high", label: "High" },
                { value: "medium", label: "Medium" }, { value: "low", label: "Low" },
              ]} />
            </div>

            <label className="ntm-fact">
              <span className="k">Stage</span>
              <div className="ntm-select-wrap">
                <select value={stage} onChange={(e) => setStage(e.target.value)}>
                  {STAGE_OPTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <span className="caret">▾</span>
              </div>
            </label>

            <label className="ntm-fact">
              <span className="k">Due</span>
              <div className="ntm-select-wrap">
                <input type="date" value={dueISO} onChange={(e) => setDueISO(e.target.value)} />
              </div>
            </label>

            <div className="ntm-fact">
              <span className="k">Estimate</span>
              <NTSeg value={estimate} onChange={setEstimate} options={[
                { value: "S", label: "S" }, { value: "M", label: "M" }, { value: "L", label: "L" },
              ]} />
            </div>
          </div>

          {/* ── PRD requirements (scoped to initiative) ── */}
          {prd && prd.reqs.length > 0 && (
            <div className="ntm-chips">
              <span className="k">PRD requirements <span className="via">via {prd.id}</span></span>
              <div className="row">
                {prd.reqs.map((r) => (
                  <button type="button" key={r.id} title={r.text}
                    className={"ntm-chip req" + (reqs.includes(r.id) ? " on" : "")}
                    onClick={() => toggle(reqs, setReqs, r.id)}>{r.id}</button>
                ))}
              </div>
            </div>
          )}

          {/* ── repos ── */}
          <div className="ntm-chips">
            <span className="k">Repos</span>
            <div className="row">
              {repoOptions.map((rid) => (
                <button type="button" key={rid}
                  className={"ntm-chip repo" + (repos.includes(rid) ? " on" : "")}
                  onClick={() => toggle(repos, setRepos, rid)}>{window.MC_REPOS[rid].name}</button>
              ))}
            </div>
          </div>

          {/* ── labels ── */}
          <div className="ntm-chips">
            <span className="k">Labels</span>
            <div className="row">
              {labels.map((l) => (
                <button type="button" key={l} className="ntm-chip label on" onClick={() => toggle(labels, setLabels, l)}>
                  {l} <span className="rm">✕</span>
                </button>
              ))}
              <input
                className="ntm-label-input"
                value={labelDraft}
                onChange={(e) => setLabelDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLabel(); } }}
                onBlur={addLabel}
                placeholder="+ label"
              />
            </div>
          </div>
        </div>

        <div className="ntm-foot">
          <span className="ntm-hint">
            Lands in <b>{window.MC_STAGES[window.MC_STAGE_IDX[stage]].name}</b> · mirrors <span className="sync pending"><span className="d"></span>Pending</span> to the record
          </span>
          <div className="ntm-acts">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="btn acc" disabled={!canCreate} onClick={submit}>Create task →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NewTaskModal });
