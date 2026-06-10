/* =========================================================================
   PORTAL WORKBENCH — VARIANT D · "SINGLE RAIL"
   =========================================================================
   One left rail, full reading column on the right. Approvals and floor
   activity live INSIDE the main column as sections (not in a right rail).
   Wider canvas = bigger type, more breathing room.
   ========================================================================= */

function PortalWorkbench_SingleRail({ scheme = 'light', tokenOverrides = {} }) {
  const baseTokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;
  const tokens = { ...baseTokens, ...tokenOverrides };

  const projects = [
    { code:'PLX-2614', name:'Niacinamide 5% Serum', sym:'Ni', num:'14', phase:'bench', phaseLabel:'AT THE BENCH', step:'R&D · Iteration 04', progress:42, target:'2026.07.18', formulator:'Maya A.', pending:2, lastEvent:'Pilot poured · 18 kg', lastWhen:'T-02:08' },
    { code:'PLX-2602', name:'Squalane Body Oil',     sym:'Sq', num:'08', phase:'floor', phaseLabel:'ON THE FLOOR', step:'Production · Run 02 / 03', progress:71, target:'2026.06.04', formulator:'Rian K.', pending:1, lastEvent:'Batch sealed · 0 deviation', lastWhen:'T-00:14' },
    { code:'AURA-019', name:'Retinal Night Cream',   sym:'Rt', num:'23', phase:'dock',  phaseLabel:'DOCK-OUT',     step:'Pack · Final QC',         progress:96, target:'2026.05.09', formulator:'Maya A.', pending:0, lastEvent:'COA approved',           lastWhen:'T-01:42' },
  ];

  const approvals = [
    { ref:'PLX-2614', what:'Formula v04 sign-off',  due:'Today',    kind:'warn', sub:'Niacinamide 5% Serum' },
    { ref:'PLX-2602', what:'COA — Run 02',           due:'Tomorrow', kind:'warn', sub:'Squalane Body Oil' },
    { ref:'AURA-019', what:'Carton artwork proof',  due:'May 06',   kind:'info', sub:'Retinal Night Cream' },
  ];

  const activity = [
    ['T-00:14','Batch sealed',     'PLX-2602 · Squalane · Run 02 · 0 deviation', 'ok'],
    ['T-01:42','COA approved',     'AURA-019 · QC-LAB-3 · Retinal Night Cream',  'ok'],
    ['T-02:08','Pilot poured',     'PLX-2614 · Niacinamide · 18 kg',             'ok'],
    ['T-03:31','Tech transfer',    'PLX-2614 · vendor 12 · ready for pilot',     'warn'],
    ['T-05:55','Brief intake',     'WILDLEAF · sketch received',                 'info'],
    ['T-08:12','Run 02 started',   'PLX-2602 · Kettle 04 · 2,400 L',             'info'],
  ];

  const phaseColor = (p) => p==='bench' ? 'var(--p-info)' : p==='floor' ? 'var(--p-warn)' : 'var(--p-ok)';

  const css = `
    .wbD { width:1440px; min-height:1100px; background:var(--p-paper); display:grid; grid-template-columns:260px 1fr;}

    /* ===== LEFT RAIL ===== */
    .wbD .lrail { background:var(--p-paper-2); border-right:1px solid var(--p-grid); display:flex; flex-direction:column; min-height:1100px;}
    .wbD .lrail .top { padding:24px 22px 18px; border-bottom:1px solid var(--p-grid);}
    .wbD .lrail .top img { height:22px; display:block; margin-bottom:18px;}
    .wbD .lrail .ws { display:flex; align-items:center; gap:10px; padding:10px 12px; border:1px solid var(--p-grid); border-radius:4px; background:var(--p-card); cursor:pointer;}
    .wbD .lrail .ws .av { width:22px; height:22px; border-radius:50%; background:var(--p-accent); color:var(--p-paper); font-size:10px; font-family:var(--mono); display:flex; align-items:center; justify-content:center;}
    .wbD .lrail .ws .nm { flex:1; font-size:12px; line-height:1.2;}
    .wbD .lrail .ws .nm .b { color:var(--p-ink); font-weight:500;}
    .wbD .lrail .ws .nm .s { color:var(--p-muted); font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; margin-top:1px;}
    .wbD .lrail .ws .ch { color:var(--p-muted); font-size:9px;}

    .wbD .lrail .nav { padding:18px 14px 14px;}
    .wbD .lrail .nav .label { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); padding:0 8px 8px;}
    .wbD .lrail .nav .item { display:flex; align-items:center; gap:12px; padding:9px 8px; font-size:13px; color:var(--p-ink-2); border-radius:4px; cursor:pointer; position:relative;}
    .wbD .lrail .nav .item:hover { background:var(--p-card);}
    .wbD .lrail .nav .item.active { color:var(--p-ink); background:var(--p-card); font-weight:500;}
    .wbD .lrail .nav .item.active::before { content:""; position:absolute; left:-14px; top:6px; bottom:6px; width:2px; background:var(--p-accent);}
    .wbD .lrail .nav .item .ic { width:14px; height:14px; color:var(--p-muted);}
    .wbD .lrail .nav .item.active .ic { color:var(--p-ink);}
    .wbD .lrail .nav .item .badge { margin-left:auto; font-family:var(--mono); font-size:9px; padding:2px 7px; background:var(--p-accent); color:var(--p-paper); border-radius:999px; letter-spacing:0;}

    .wbD .lrail .sub { margin-top:6px; border-top:1px dashed var(--p-grid); padding:14px 14px 8px;}
    .wbD .lrail .sub .label { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); padding:0 8px 8px; display:flex; justify-content:space-between;}
    .wbD .lrail .sub .label a { color:var(--p-ink-2); text-decoration:none; border-bottom:1px solid var(--p-grid); padding-bottom:1px;}
    .wbD .lrail .sub .pj { display:flex; align-items:center; gap:10px; padding:8px; border-radius:4px; cursor:pointer;}
    .wbD .lrail .sub .pj:hover { background:var(--p-card);}
    .wbD .lrail .sub .pj.active { background:var(--p-card);}
    .wbD .lrail .sub .pj .pip { width:8px; height:8px; border-radius:50%; flex-shrink:0;}
    .wbD .lrail .sub .pj .nm { font-size:12px; color:var(--p-ink); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}

    .wbD .lrail .user { margin-top:auto; padding:18px 22px; border-top:1px solid var(--p-grid); display:flex; align-items:center; gap:12px;}
    .wbD .lrail .user .av { width:32px; height:32px; border-radius:50%; background:var(--p-ink); color:var(--p-paper); font-family:var(--mono); font-size:11px; display:flex; align-items:center; justify-content:center;}
    .wbD .lrail .user .nm { flex:1;}
    .wbD .lrail .user .nm .n { font-size:12px; color:var(--p-ink);}
    .wbD .lrail .user .nm .r { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted); margin-top:1px;}

    /* ===== MAIN ===== */
    .wbD .main { padding:36px 64px 60px; min-width:0; max-width:1180px;}
    .wbD .main .breadcrumbs { font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted); margin-bottom:18px;}
    .wbD .main .breadcrumbs b { color:var(--p-ink); font-weight:500;}
    /* greet — utility KPI strip, not display brag-numbers */
    .wbD .greet { display:flex; justify-content:space-between; align-items:flex-end; padding-bottom:28px; border-bottom:1px solid var(--p-grid);}
    .wbD .greet h1 { font-family:var(--mazius); font-size:72px; line-height:0.96; letter-spacing:-0.025em; margin:0; font-weight:400;}
    .wbD .greet h1 em { font-style:italic; color:var(--p-accent);}

    /* KPI strip — quiet, mono, divided. NOT buttons. */
    .wbD .kpis { display:flex; align-items:stretch; border:1px solid var(--p-grid); background:var(--p-card); align-self:flex-end;}
    .wbD .kpis .k { padding:12px 22px; border-right:1px solid var(--p-grid); display:flex; flex-direction:column; gap:4px; min-width:96px;}
    .wbD .kpis .k:last-child { border-right:none;}
    .wbD .kpis .k .l { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted);}
    .wbD .kpis .k .v { font-family:var(--mono); font-size:18px; line-height:1; letter-spacing:0.02em; color:var(--p-ink); font-weight:500;}
    .wbD .kpis .k .v small { font-size:10px; color:var(--p-muted); font-weight:400; margin-left:2px;}

    /* floor strip */
    .wbD .main .fstrip { display:flex; align-items:center; gap:24px; padding:14px 18px; margin-top:24px; border:1px solid var(--p-grid); background:var(--p-card); font-family:var(--mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-ink-2);}
    .wbD .main .fstrip .live { color:var(--p-ok); display:inline-flex; align-items:center; gap:8px;}
    .wbD .main .fstrip .item { color:var(--p-muted);}
    .wbD .main .fstrip .item b { color:var(--p-ink); font-weight:500;}

    /* section header — quiet, utility (not editorial) */
    .wbD .sec-head { display:flex; align-items:baseline; justify-content:space-between; margin:48px 0 14px; padding-bottom:10px; border-bottom:1px solid var(--p-grid);}
    .wbD .sec-head .l { display:flex; align-items:baseline; gap:14px;}
    .wbD .sec-head .kk { font-family:var(--mono); font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted);}
    .wbD .sec-head h2 { font-family:var(--mono); font-size:11px; line-height:1; letter-spacing:0.18em; text-transform:uppercase; margin:0; font-weight:500; color:var(--p-ink);}
    .wbD .sec-head h2 em { font-style:normal; color:var(--p-ink);}
    .wbD .sec-head .all { font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-ink-2); border-bottom:1px solid var(--p-grid); padding-bottom:1px; cursor:pointer;}

    /* approvals row */
    .wbD .arow { display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;}
    .wbD .arow .a { padding:18px 18px 16px; border:1px solid var(--p-grid); background:var(--p-card); display:flex; flex-direction:column; gap:10px;}
    .wbD .arow .a .top { display:flex; justify-content:space-between; align-items:baseline;}
    .wbD .arow .a .ref { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; color:var(--p-muted); text-transform:uppercase;}
    .wbD .arow .a .due { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-warn);}
    .wbD .arow .a .due.info { color:var(--p-info);}
    .wbD .arow .a .what { font-family:var(--mazius); font-size:22px; line-height:1.05; letter-spacing:-0.01em; color:var(--p-ink); margin:0;}
    .wbD .arow .a .sub { font-size:11px; color:var(--p-muted); margin-top:-4px;}
    .wbD .arow .a .actions { margin-top:auto; display:flex; gap:6px;}
    .wbD .arow .a button { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; padding:7px 12px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); cursor:pointer;}
    .wbD .arow .a button.ghost { background:transparent; color:var(--p-ink);}

    /* project cards — tightened: logomark · info · status cluster */
    .wbD .pcard { display:grid; grid-template-columns:60px 1fr 280px; gap:28px; padding:22px 24px; border:1px solid var(--p-grid); background:var(--p-card); margin-bottom:10px; align-items:center; cursor:pointer; transition:border-color .15s; position:relative;}
    .wbD .pcard:hover { border-color:var(--p-ink);}
    .wbD .pcard .pmark2 { display:flex; flex-direction:column; padding:7px 9px; border:1px solid var(--p-ink); line-height:1; height:54px; justify-content:space-between;}
    .wbD .pcard .pmark2 .num { font-family:var(--mono); font-size:9px; color:var(--p-muted);}
    .wbD .pcard .pmark2 .sym { font-family:var(--mazius); font-size:24px; line-height:0.9;}
    .wbD .pcard .info .ref { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); margin-bottom:4px;}
    .wbD .pcard .info .nm { font-family:var(--mazius); font-size:24px; line-height:1; letter-spacing:-0.015em; margin-bottom:6px;}
    .wbD .pcard .info .meta { font-size:11px; color:var(--p-muted);}
    .wbD .pcard .info .meta b { color:var(--p-ink); font-weight:500;}

    /* status cluster — single right-aligned stack with tabular rhythm */
    .wbD .pcard .stat { display:flex; flex-direction:column; gap:10px;}
    .wbD .pcard .stat .row1 { display:flex; align-items:center; justify-content:space-between; gap:14px;}
    .wbD .pcard .phase-pill { display:inline-flex; align-items:center; gap:6px; padding:5px 10px; border:1px solid currentColor; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; font-weight:500;}
    .wbD .pcard .phase-pill .dot { width:5px; height:5px; border-radius:50%; background:currentColor;}
    .wbD .pcard .stat .nums { font-family:var(--mono); font-size:11px; letter-spacing:0.04em; color:var(--p-ink); display:flex; align-items:baseline; gap:10px;}
    .wbD .pcard .stat .nums .pct { font-weight:600;}
    .wbD .pcard .stat .nums .div { color:var(--p-grid); font-weight:300;}
    .wbD .pcard .stat .nums .target { color:var(--p-muted);}
    .wbD .pcard .stat .bar { height:2px; background:var(--p-grid); position:relative;}
    .wbD .pcard .stat .bar .fill { position:absolute; left:0; top:0; bottom:0;}
    .wbD .pcard .stat .row3 { display:flex; align-items:center; justify-content:space-between; gap:10px;}
    .wbD .pcard .stat .step { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted);}
    .wbD .pcard .stat .pend { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-accent); display:inline-flex; align-items:center; gap:6px;}
    .wbD .pcard .stat .pend .num { background:var(--p-accent); color:var(--p-paper); border-radius:50%; width:14px; height:14px; display:flex; align-items:center; justify-content:center; font-size:8px;}

    /* activity feed */
    .wbD .feed { border:1px solid var(--p-grid); background:var(--p-card);}
    .wbD .feed .row { display:grid; grid-template-columns:90px 1fr auto 16px; gap:14px; padding:14px 22px; border-bottom:1px solid var(--p-grid); align-items:baseline;}
    .wbD .feed .row:last-child { border-bottom:none;}
    .wbD .feed .row .t { font-family:var(--mono); font-size:10px; color:var(--p-muted); letter-spacing:0.06em;}
    .wbD .feed .row .ev { font-size:13px; color:var(--p-ink);}
    .wbD .feed .row .ref { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em;}
    .wbD .feed .row .pip { width:6px; height:6px; border-radius:50%;}
    .wbD .feed .row .pip.ok { background:var(--p-ok);}
    .wbD .feed .row .pip.warn { background:var(--p-warn);}
    .wbD .feed .row .pip.info { background:var(--p-info);}
  `;

  return (
    <div className="pf wbD" style={{...tokens}} data-screen-label="Workbench · Variant D · Single rail">
      <PortalStyles />
      <style>{css}</style>

      {/* ===== LEFT RAIL ===== */}
      <aside className="lrail">
        <div className="top">
          <img src="assets/logo-horizontal-ink.png" alt="PLX" style={scheme==='dark' ? {filter:'invert(0.92)'} : {}}/>
          <div className="ws">
            <span className="av">A</span>
            <div className="nm"><div className="b">Aldosari Studio</div><div className="s">Workspace · 47 brands</div></div>
            <span className="ch">▾</span>
          </div>
        </div>

        <nav className="nav">
          <div className="label">Lab</div>
          <div className="item active"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="2" width="4" height="4"/><rect x="8" y="2" width="4" height="4"/><rect x="2" y="8" width="4" height="4"/><rect x="8" y="8" width="4" height="4"/></svg>Workbench</div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="3" width="10" height="8"/><line x1="2" y1="6" x2="12" y2="6"/></svg>Projects<span className="badge">3</span></div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 8l3 3 7-7"/></svg>Approvals<span className="badge">3</span></div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 2h6l3 3v7H3z"/><path d="M9 2v3h3"/></svg>Documents</div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 4h10v6H4l-2 2z"/></svg>Messages<span className="badge">2</span></div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="4" width="10" height="7"/><line x1="2" y1="6" x2="12" y2="6"/></svg>Billing</div>
        </nav>

        <div className="sub">
          <div className="label"><span>Active projects</span><a>All →</a></div>
          {projects.map((p, i) => (
            <div key={p.code} className={`pj ${i===1?'active':''}`}>
              <span className="pip" style={{background:phaseColor(p.phase)}}/>
              <span className="nm">{p.name}</span>
            </div>
          ))}
        </div>

        <div className="user">
          <div className="av">MA</div>
          <div className="nm"><div className="n">Maya Aldosari</div><div className="r">Founder · admin</div></div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="main">
        <div className="breadcrumbs">Lab · <b>Workbench</b></div>
        <div className="greet">
          <div>
            <div style={{fontSize:13, color:'var(--p-muted)', marginBottom:14}}>Tuesday, May 5 · 10:42 a.m.</div>
            <h1>Welcome back,<br/>Maya. Your <em>workbench.</em></h1>
          </div>
          <div className="kpis">
            <div className="k"><span className="l">Active</span><span className="v">3</span></div>
            <div className="k"><span className="l">Awaiting you</span><span className="v">3</span></div>
            <div className="k"><span className="l">Next dock</span><span className="v">14<small>D</small></span></div>
          </div>
        </div>

        <div className="fstrip">
          <span className="live"><span className="pulse"/>Floor · Live</span>
          <span className="item">T-04:21:13 · TOR</span>
          <span className="item">Kettles <b>9 / 12</b></span>
          <span className="item">Lines <b>7 / 10</b></span>
          <span className="item">Last seal <b>14 min ago</b></span>
          <span className="item" style={{marginLeft:'auto'}}>Today · <b>14</b> batches · <b>23</b> COAs</span>
        </div>

        {/* APPROVALS */}
        <div className="sec-head">
          <div className="l">
            <span className="kk">/ 001</span>
            <h2>Awaiting your sign-off · 3</h2>
          </div>
          <span className="all">All approvals →</span>
        </div>
        <div className="arow">
          {approvals.map((a, i) => (
            <div key={i} className="a">
              <div className="top"><span className="ref">{a.ref}</span><span className={`due ${a.kind==='info'?'info':''}`}>Due · {a.due}</span></div>
              <h3 className="what">{a.what}</h3>
              <div className="sub">{a.sub}</div>
              <div className="actions"><button>Review</button><button className="ghost">Defer</button></div>
            </div>
          ))}
        </div>

        {/* PROJECTS */}
        <div className="sec-head">
          <div className="l">
            <span className="kk">/ 002</span>
            <h2>Active projects · 3</h2>
          </div>
          <span className="all">All projects →</span>
        </div>
        {projects.map(p => (
          <div key={p.code} className="pcard">
            <div className="pmark2"><span className="num">{p.num}</span><span className="sym">{p.sym}</span></div>
            <div className="info">
              <div className="ref">{p.code}</div>
              <div className="nm">{p.name}</div>
              <div className="meta">Formulator · <b>{p.formulator}</b> &nbsp;·&nbsp; {p.lastWhen} · <b>{p.lastEvent}</b></div>
            </div>
            <div className="stat">
              <div className="row1">
                <span className="phase-pill" style={{color:phaseColor(p.phase)}}><span className="dot"/>{p.phaseLabel}</span>
                <span className="nums"><span className="pct">{p.progress}%</span><span className="div">/</span><span className="target">{p.target}</span></span>
              </div>
              <div className="bar"><div className="fill" style={{width:`${p.progress}%`, background:phaseColor(p.phase)}}/></div>
              <div className="row3">
                <span className="step">{p.step}</span>
                {p.pending>0 && <span className="pend"><span className="num">{p.pending}</span>{p.pending===1?'awaits you':'await you'}</span>}
              </div>
            </div>
          </div>
        ))}

        {/* ACTIVITY */}
        <div className="sec-head">
          <div className="l">
            <span className="kk">/ 003</span>
            <h2>Floor activity · last 24 hr</h2>
          </div>
          <span className="all">Full log →</span>
        </div>
        <div className="feed">
          {activity.map((row, i) => (
            <div key={i} className="row">
              <span className="t">{row[0]}</span>
              <span className="ev">{row[1]}</span>
              <span className="ref">{row[2]}</span>
              <span className={`pip ${row[3]}`}/>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

window.PortalWorkbench_SingleRail = PortalWorkbench_SingleRail;
