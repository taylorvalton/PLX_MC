/* =========================================================================
   PORTAL WORKBENCH — VARIANT B · "SIDE RAIL"
   =========================================================================
   Conventional SaaS chrome reframed in the PLX voice. Left rail holds
   workspace switcher + primary nav + a project sub-list. Main column is
   a calmer reading surface. Right rail keeps approvals + floor feed but
   compressed.
   ========================================================================= */

function PortalWorkbench_SideRail({ scheme = 'light', tokenOverrides = {} }) {
  const baseTokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;
  const tokens = { ...baseTokens, ...tokenOverrides };

  const projects = [
    { code:'PLX-2614', name:'Niacinamide 5% Serum', sym:'Ni', num:'14', phase:'bench', phaseLabel:'AT THE BENCH', step:'R&D · Iteration 04', progress:42, target:'2026.07.18', formulator:'Maya A.', pending:2, lastEvent:'Pilot poured · 18 kg', lastWhen:'T-02:08' },
    { code:'PLX-2602', name:'Squalane Body Oil',     sym:'Sq', num:'08', phase:'floor', phaseLabel:'ON THE FLOOR', step:'Production · Run 02 / 03', progress:71, target:'2026.06.04', formulator:'Rian K.', pending:1, lastEvent:'Batch sealed · 0 deviation', lastWhen:'T-00:14' },
    { code:'AURA-019', name:'Retinal Night Cream',   sym:'Rt', num:'23', phase:'dock',  phaseLabel:'DOCK-OUT',     step:'Pack · Final QC',         progress:96, target:'2026.05.09', formulator:'Maya A.', pending:0, lastEvent:'COA approved',           lastWhen:'T-01:42' },
  ];

  const approvals = [
    { ref:'PLX-2614', what:'Formula v04 sign-off', due:'Today',    kind:'warn' },
    { ref:'PLX-2602', what:'COA — Run 02',        due:'Tomorrow', kind:'warn' },
    { ref:'AURA-019', what:'Carton artwork proof', due:'May 06',   kind:'info' },
  ];

  const activity = [
    ['T-00:14','Batch sealed',  'PLX-2602 · Squalane',     'ok'],
    ['T-01:42','COA approved',  'AURA-019 · QC-LAB-3',     'ok'],
    ['T-02:08','Pilot poured',  'PLX-2614 · 18 kg',        'ok'],
    ['T-03:31','Tech transfer', 'PLX-2614 · vendor 12',    'warn'],
    ['T-05:55','Brief intake',  'WILDLEAF · sketch',       'info'],
  ];

  const phaseColor = (p) => p==='bench' ? 'var(--p-info)' : p==='floor' ? 'var(--p-warn)' : 'var(--p-ok)';

  const css = `
    .wbB { width:1440px; min-height:1100px; background:var(--p-paper); display:grid; grid-template-columns:260px 1fr 320px; }

    /* ===== LEFT RAIL ===== */
    .wbB .lrail { background:var(--p-paper-2); border-right:1px solid var(--p-grid); display:flex; flex-direction:column; min-height:1100px;}
    .wbB .lrail .top { padding:24px 22px 18px; border-bottom:1px solid var(--p-grid);}
    .wbB .lrail .top img { height:22px; display:block; margin-bottom:18px;}
    .wbB .lrail .ws { display:flex; align-items:center; gap:10px; padding:10px 12px; border:1px solid var(--p-grid); border-radius:4px; background:var(--p-card); cursor:pointer;}
    .wbB .lrail .ws .av { width:22px; height:22px; border-radius:50%; background:var(--p-accent); color:var(--p-paper); font-size:10px; font-family:var(--mono); display:flex; align-items:center; justify-content:center;}
    .wbB .lrail .ws .nm { flex:1; font-size:12px; line-height:1.2;}
    .wbB .lrail .ws .nm .b { color:var(--p-ink); font-weight:500;}
    .wbB .lrail .ws .nm .s { color:var(--p-muted); font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; margin-top:1px;}
    .wbB .lrail .ws .ch { color:var(--p-muted); font-size:9px;}

    .wbB .lrail .nav { padding:18px 14px 14px;}
    .wbB .lrail .nav .label { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); padding:0 8px 8px;}
    .wbB .lrail .nav .item { display:flex; align-items:center; gap:12px; padding:9px 8px; font-size:13px; color:var(--p-ink-2); border-radius:4px; cursor:pointer; position:relative;}
    .wbB .lrail .nav .item:hover { background:var(--p-card);}
    .wbB .lrail .nav .item.active { color:var(--p-ink); background:var(--p-card); font-weight:500;}
    .wbB .lrail .nav .item.active::before { content:""; position:absolute; left:-14px; top:6px; bottom:6px; width:2px; background:var(--p-accent);}
    .wbB .lrail .nav .item .ic { width:14px; height:14px; color:var(--p-muted);}
    .wbB .lrail .nav .item.active .ic { color:var(--p-ink);}
    .wbB .lrail .nav .item .badge { margin-left:auto; font-family:var(--mono); font-size:9px; padding:2px 7px; background:var(--p-accent); color:var(--p-paper); border-radius:999px; letter-spacing:0;}

    /* sub-list of projects under Workbench */
    .wbB .lrail .sub { margin-top:6px; border-top:1px dashed var(--p-grid); padding:14px 14px 8px;}
    .wbB .lrail .sub .label { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); padding:0 8px 8px; display:flex; justify-content:space-between;}
    .wbB .lrail .sub .label a { color:var(--p-ink-2); text-decoration:none; border-bottom:1px solid var(--p-grid); padding-bottom:1px;}
    .wbB .lrail .sub .pj { display:flex; align-items:center; gap:10px; padding:8px; border-radius:4px; cursor:pointer;}
    .wbB .lrail .sub .pj:hover { background:var(--p-card);}
    .wbB .lrail .sub .pj.active { background:var(--p-card);}
    .wbB .lrail .sub .pj .pip { width:8px; height:8px; border-radius:50%; flex-shrink:0;}
    .wbB .lrail .sub .pj .nm { font-size:12px; color:var(--p-ink); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
    .wbB .lrail .sub .pj .ref { font-family:var(--mono); font-size:8px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted);}

    /* bottom user block */
    .wbB .lrail .user { margin-top:auto; padding:18px 22px; border-top:1px solid var(--p-grid); display:flex; align-items:center; gap:12px;}
    .wbB .lrail .user .av { width:32px; height:32px; border-radius:50%; background:var(--p-ink); color:var(--p-paper); font-family:var(--mono); font-size:11px; display:flex; align-items:center; justify-content:center;}
    .wbB .lrail .user .nm { flex:1;}
    .wbB .lrail .user .nm .n { font-size:12px; color:var(--p-ink);}
    .wbB .lrail .user .nm .r { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted); margin-top:1px;}

    /* ===== MAIN ===== */
    .wbB .main { padding:36px 44px 60px; min-width:0;}
    .wbB .main .breadcrumbs { font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted); margin-bottom:18px;}
    .wbB .main .breadcrumbs b { color:var(--p-ink); font-weight:500;}
    .wbB .main .greet { display:flex; justify-content:space-between; align-items:end; padding-bottom:24px; border-bottom:1px solid var(--p-grid);}
    .wbB .main h1 { font-family:var(--mazius); font-size:62px; line-height:0.96; letter-spacing:-0.025em; margin:0; font-weight:400;}
    .wbB .main h1 em { font-style:italic; color:var(--p-accent);}
    .wbB .main .stats { display:flex; gap:30px;}
    .wbB .main .stats .s .v { font-family:var(--mazius); font-size:32px; line-height:1; letter-spacing:-0.02em;}
    .wbB .main .stats .s .v em { font-style:italic; color:var(--p-accent);}
    .wbB .main .stats .s .l { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); margin-top:6px; text-align:right;}

    /* floor strip */
    .wbB .main .fstrip { display:flex; align-items:center; gap:24px; padding:14px 18px; margin-top:24px; border:1px solid var(--p-grid); background:var(--p-card); font-family:var(--mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-ink-2);}
    .wbB .main .fstrip .live { color:var(--p-ok); display:inline-flex; align-items:center; gap:8px;}
    .wbB .main .fstrip .item { color:var(--p-muted);}
    .wbB .main .fstrip .item b { color:var(--p-ink); font-weight:500;}

    /* projects list */
    .wbB .sec-head { display:flex; align-items:baseline; justify-content:space-between; margin:36px 0 16px;}
    .wbB .sec-head .l { display:flex; align-items:baseline; gap:14px;}
    .wbB .sec-head .kk { font-family:var(--mono); font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted);}
    .wbB .sec-head h2 { font-family:var(--mazius); font-size:28px; line-height:1; letter-spacing:-0.018em; margin:0; font-weight:400;}
    .wbB .sec-head h2 em { font-style:italic; color:var(--p-accent);}

    .wbB .pcard { display:grid; grid-template-columns:60px 1fr 200px auto; gap:22px; padding:20px; border:1px solid var(--p-grid); background:var(--p-card); margin-bottom:12px; align-items:center; cursor:pointer;}
    .wbB .pcard:hover { border-color:var(--p-ink);}
    .wbB .pcard .pmark2 { display:flex; flex-direction:column; padding:7px 9px; border:1px solid var(--p-ink); line-height:1; height:54px; justify-content:space-between;}
    .wbB .pcard .pmark2 .num { font-family:var(--mono); font-size:9px; color:var(--p-muted);}
    .wbB .pcard .pmark2 .sym { font-family:var(--mazius); font-size:24px; line-height:0.9;}
    .wbB .pcard .info .ref { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); margin-bottom:4px;}
    .wbB .pcard .info .nm { font-family:var(--mazius); font-size:22px; line-height:1; letter-spacing:-0.015em; margin-bottom:6px;}
    .wbB .pcard .info .meta { font-size:11px; color:var(--p-muted);}
    .wbB .pcard .info .meta b { color:var(--p-ink); font-weight:500;}
    .wbB .pcard .progress .top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px;}
    .wbB .pcard .progress .pct { font-family:var(--mazius); font-size:20px; line-height:1;}
    .wbB .pcard .progress .target { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.14em; text-transform:uppercase;}
    .wbB .pcard .progress .bar { height:2px; background:var(--p-grid); position:relative;}
    .wbB .pcard .progress .bar .fill { position:absolute; left:0; top:0; bottom:0;}
    .wbB .pcard .progress .step { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-ink-2); margin-top:8px;}
    .wbB .pcard .right { display:flex; flex-direction:column; align-items:flex-end; gap:8px;}
    .wbB .pcard .phase-pill { display:inline-flex; align-items:center; gap:6px; padding:5px 10px; border:1px solid currentColor; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; font-weight:500;}
    .wbB .pcard .phase-pill .dot { width:5px; height:5px; border-radius:50%; background:currentColor;}
    .wbB .pcard .pend { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-accent); display:flex; align-items:center; gap:6px;}
    .wbB .pcard .pend .num { background:var(--p-accent); color:var(--p-paper); border-radius:50%; width:16px; height:16px; display:flex; align-items:center; justify-content:center; font-size:9px;}

    /* ===== RIGHT RAIL ===== */
    .wbB .rrail { background:var(--p-paper-2); border-left:1px solid var(--p-grid); padding:36px 26px; min-height:1100px;}
    .wbB .rrail h3 { font-family:var(--mazius); font-size:22px; line-height:1.05; letter-spacing:-0.015em; margin:0 0 14px; font-weight:400;}
    .wbB .rrail h3 em { font-style:italic; color:var(--p-accent);}
    .wbB .rrail .kk { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); margin-bottom:8px; display:block;}

    .wbB .rrail .a { padding:14px; border:1px solid var(--p-grid); background:var(--p-card); margin-bottom:10px;}
    .wbB .rrail .a .top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px;}
    .wbB .rrail .a .ref { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; color:var(--p-muted); text-transform:uppercase;}
    .wbB .rrail .a .due { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-warn);}
    .wbB .rrail .a .due.info { color:var(--p-info);}
    .wbB .rrail .a .what { font-size:13px; color:var(--p-ink); line-height:1.3; margin-bottom:10px;}
    .wbB .rrail .a button { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; padding:6px 10px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); cursor:pointer; margin-right:6px;}
    .wbB .rrail .a button.ghost { background:transparent; color:var(--p-ink);}

    .wbB .rrail .feed { margin-top:32px; padding-top:20px; border-top:1px solid var(--p-grid);}
    .wbB .rrail .feed .row { display:grid; grid-template-columns:auto 1fr auto; gap:10px; padding:10px 0; border-bottom:1px solid var(--p-grid); align-items:baseline;}
    .wbB .rrail .feed .row .t { font-family:var(--mono); font-size:9px; color:var(--p-muted);}
    .wbB .rrail .feed .row .ev { font-size:12px; color:var(--p-ink);}
    .wbB .rrail .feed .row .ref { font-family:var(--mono); font-size:9px; color:var(--p-muted); margin-top:1px;}
    .wbB .rrail .feed .row .pip { width:5px; height:5px; border-radius:50%;}
    .wbB .rrail .feed .row .pip.ok { background:var(--p-ok);} .wbB .rrail .feed .row .pip.warn { background:var(--p-warn);} .wbB .rrail .feed .row .pip.info { background:var(--p-info);}
  `;

  return (
    <div className="pf wbB" style={{...tokens}} data-screen-label="Workbench · Variant B · Side rail">
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
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 2h6l3 3v7H3z"/><path d="M9 2v3h3"/></svg>Documents</div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 4h10v6H4l-2 2z"/></svg>Messages<span className="badge">2</span></div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="4" width="10" height="7"/><line x1="2" y1="6" x2="12" y2="6"/></svg>Billing</div>
        </nav>

        <div className="sub">
          <div className="label"><span>Active projects</span><a>All →</a></div>
          {projects.map((p, i) => (
            <div key={p.code} className={`pj ${i===1?'active':''}`}>
              <span className="pip" style={{background:phaseColor(p.phase)}}/>
              <div style={{flex:1, minWidth:0}}>
                <div className="nm">{p.name}</div>
                <div className="ref">{p.code} · {p.phaseLabel}</div>
              </div>
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
          <div className="stats">
            <div className="s"><div className="v">3</div><div className="l">Active</div></div>
            <div className="s"><div className="v"><em>3</em></div><div className="l">Awaiting you</div></div>
            <div className="s"><div className="v">14<span style={{fontFamily:'var(--mono)', fontSize:12, marginLeft:4, letterSpacing:0, color:'var(--p-muted)'}}>D</span></div><div className="l">Next dock</div></div>
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

        <div className="sec-head">
          <div className="l">
            <span className="kk">/ 001 — Active projects</span>
            <h2>At the bench, <em>on the floor.</em></h2>
          </div>
        </div>

        {projects.map(p => (
          <div key={p.code} className="pcard">
            <div className="pmark2"><span className="num">{p.num}</span><span className="sym">{p.sym}</span></div>
            <div className="info">
              <div className="ref">{p.code}</div>
              <div className="nm">{p.name}</div>
              <div className="meta">Formulator · <b>{p.formulator}</b>  ·  {p.lastWhen} · <b>{p.lastEvent}</b></div>
            </div>
            <div className="progress">
              <div className="top"><span className="pct">{p.progress}%</span><span className="target">→ {p.target}</span></div>
              <div className="bar"><div className="fill" style={{width:`${p.progress}%`, background:phaseColor(p.phase)}}/></div>
              <div className="step">{p.step}</div>
            </div>
            <div className="right">
              <span className="phase-pill" style={{color:phaseColor(p.phase)}}><span className="dot"/>{p.phaseLabel}</span>
              {p.pending>0 && <span className="pend"><span className="num">{p.pending}</span>{p.pending===1?'awaits you':'await you'}</span>}
            </div>
          </div>
        ))}
      </main>

      {/* ===== RIGHT RAIL ===== */}
      <aside className="rrail">
        <span className="kk">/ Approvals · 3</span>
        <h3>Awaiting <em>your sign-off.</em></h3>
        {approvals.map((a, i) => (
          <div key={i} className="a">
            <div className="top"><span className="ref">{a.ref}</span><span className={`due ${a.kind==='info'?'info':''}`}>Due · {a.due}</span></div>
            <div className="what">{a.what}</div>
            <button>Review</button><button className="ghost">Defer</button>
          </div>
        ))}

        <div className="feed">
          <span className="kk">/ Floor · 24 hr</span>
          <h3>What happened on the <em>floor.</em></h3>
          {activity.map((row, i) => (
            <div key={i} className="row">
              <span className="t">{row[0]}</span>
              <div><div className="ev">{row[1]}</div><div className="ref">{row[2]}</div></div>
              <span className={`pip ${row[3]}`}/>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

/* =========================================================================
   PORTAL WORKBENCH — VARIANT C · "BENCH ITSELF"
   =========================================================================
   The unconventional cut. Projects ARE the navigation. Left column is a
   stack of project tiles, full-height, with progress + phase visible at
   rest. Click a tile and the main column fills with that project's view
   (here the middle one is selected). No "Workbench / Projects / Documents"
   menu; the project is the unit of work, and inside each project the
   sub-nav (overview / formula / batches / docs / messages) lives in the
   detail pane. Approvals + floor compress into a slim rightmost dock.
   ========================================================================= */

function PortalWorkbench_BenchItself({ scheme = 'light' }) {
  const tokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;

  const projects = [
    { code:'PLX-2614', name:'Niacinamide 5% Serum', sym:'Ni', num:'14', phase:'bench', phaseLabel:'AT THE BENCH', step:'R&D · It. 04', progress:42, target:'2026.07.18', formulator:'Maya A.', pending:2, lastEvent:'Pilot poured', lastWhen:'T-02:08' },
    { code:'PLX-2602', name:'Squalane Body Oil',     sym:'Sq', num:'08', phase:'floor', phaseLabel:'ON THE FLOOR', step:'Run 02 / 03',     progress:71, target:'2026.06.04', formulator:'Rian K.', pending:1, lastEvent:'Batch sealed', lastWhen:'T-00:14' },
    { code:'AURA-019', name:'Retinal Night Cream',   sym:'Rt', num:'23', phase:'dock',  phaseLabel:'DOCK-OUT',     step:'Pack · QC',      progress:96, target:'2026.05.09', formulator:'Maya A.', pending:0, lastEvent:'COA approved', lastWhen:'T-01:42' },
  ];
  const selected = 1; // Squalane

  const phaseColor = (p) => p==='bench' ? 'var(--p-info)' : p==='floor' ? 'var(--p-warn)' : 'var(--p-ok)';

  const css = `
    .wbC { width:1440px; min-height:1100px; background:var(--p-paper); display:grid; grid-template-columns:300px 1fr 88px;}

    /* ===== TOP STRIP (slim) ===== */
    .wbC .topstrip { grid-column:1 / -1; display:flex; align-items:center; justify-content:space-between; padding:12px 28px; border-bottom:1px solid var(--p-grid); background:var(--p-paper-2); font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase;}
    .wbC .topstrip .l { display:flex; align-items:center; gap:18px;}
    .wbC .topstrip .l img { height:18px;}
    .wbC .topstrip .l .div { width:1px; height:14px; background:var(--p-grid);}
    .wbC .topstrip .l .ws { color:var(--p-ink); display:flex; align-items:center; gap:8px; cursor:pointer;}
    .wbC .topstrip .l .ws .av { width:18px; height:18px; border-radius:50%; background:var(--p-accent); color:var(--p-paper); font-size:9px; display:flex; align-items:center; justify-content:center; font-family:var(--mono); letter-spacing:0;}
    .wbC .topstrip .c { display:flex; align-items:center; gap:18px; color:var(--p-muted);}
    .wbC .topstrip .c .live { color:var(--p-ok); display:inline-flex; align-items:center; gap:6px;}
    .wbC .topstrip .c b { color:var(--p-ink); font-weight:500;}
    .wbC .topstrip .r { display:flex; align-items:center; gap:14px; color:var(--p-muted);}
    .wbC .topstrip .r .av { width:24px; height:24px; border-radius:50%; background:var(--p-ink); color:var(--p-paper); font-size:9px; display:flex; align-items:center; justify-content:center; font-family:var(--mono); letter-spacing:0;}

    /* ===== LEFT COLUMN — project stack ===== */
    .wbC .stack { border-right:1px solid var(--p-grid); padding:24px 18px; background:var(--p-paper);}
    .wbC .stack .header { display:flex; justify-content:space-between; align-items:baseline; padding:0 8px 14px; margin-bottom:8px; border-bottom:1px solid var(--p-grid);}
    .wbC .stack .header .kk { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted);}
    .wbC .stack .header .new { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-ink); border:1px solid var(--p-ink); padding:4px 8px; cursor:pointer;}

    .wbC .tile { padding:16px 14px; margin-bottom:8px; border:1px solid var(--p-grid); background:var(--p-card); cursor:pointer; transition:border-color .15s; position:relative;}
    .wbC .tile:hover { border-color:var(--p-ink);}
    .wbC .tile.active { border-color:var(--p-ink); box-shadow:inset 3px 0 0 var(--p-accent);}
    .wbC .tile .top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px;}
    .wbC .tile .pmark2 { display:flex; flex-direction:column; padding:5px 7px; border:1px solid var(--p-ink); height:42px; justify-content:space-between; line-height:1; flex-shrink:0;}
    .wbC .tile .pmark2 .num { font-family:var(--mono); font-size:8px; color:var(--p-muted);}
    .wbC .tile .pmark2 .sym { font-family:var(--mazius); font-size:18px; line-height:0.9;}
    .wbC .tile .info { flex:1; min-width:0;}
    .wbC .tile .info .ref { font-family:var(--mono); font-size:8px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted);}
    .wbC .tile .info .nm { font-family:var(--mazius); font-size:18px; line-height:1.05; letter-spacing:-0.015em; margin:3px 0 6px;}
    .wbC .tile .info .step { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-ink-2);}
    .wbC .tile .bar { height:2px; background:var(--p-grid); position:relative; margin-top:10px;}
    .wbC .tile .bar .fill { position:absolute; left:0; top:0; bottom:0;}
    .wbC .tile .footer { display:flex; justify-content:space-between; align-items:center; margin-top:10px;}
    .wbC .tile .phase-pill { display:inline-flex; align-items:center; gap:5px; padding:3px 7px; border:1px solid currentColor; font-family:var(--mono); font-size:8px; letter-spacing:0.18em;}
    .wbC .tile .phase-pill .dot { width:5px; height:5px; border-radius:50%; background:currentColor;}
    .wbC .tile .pend { font-family:var(--mono); font-size:9px; color:var(--p-accent); display:flex; align-items:center; gap:5px;}
    .wbC .tile .pend .num { background:var(--p-accent); color:var(--p-paper); border-radius:50%; width:14px; height:14px; display:flex; align-items:center; justify-content:center; font-size:9px;}

    /* ===== MAIN (project detail) ===== */
    .wbC .detail { padding:32px 44px 60px; min-width:0;}
    .wbC .detail .hcrumbs { display:flex; align-items:center; gap:10px; font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted); margin-bottom:14px;}
    .wbC .detail .hcrumbs b { color:var(--p-ink); font-weight:500;}
    .wbC .detail .header { display:flex; justify-content:space-between; align-items:flex-end; padding-bottom:24px; border-bottom:1px solid var(--p-grid);}
    .wbC .detail h1 { font-family:var(--mazius); font-size:62px; line-height:0.96; letter-spacing:-0.025em; margin:0 0 6px; font-weight:400;}
    .wbC .detail h1 em { font-style:italic; color:var(--p-accent);}
    .wbC .detail .sub { font-size:14px; color:var(--p-ink-2);}
    .wbC .detail .sub b { color:var(--p-ink); font-weight:500;}
    .wbC .detail .header .right { display:flex; flex-direction:column; align-items:flex-end; gap:10px;}
    .wbC .detail .header .pp { display:inline-flex; align-items:center; gap:8px; padding:7px 14px; border:1px solid currentColor; font-family:var(--mono); font-size:10px; letter-spacing:0.2em;}
    .wbC .detail .header .pp .dot { width:6px; height:6px; border-radius:50%; background:currentColor;}
    .wbC .detail .header .target { font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted);}

    /* in-project sub-nav */
    .wbC .detail .subnav { display:flex; gap:0; margin:24px 0 32px; border-bottom:1px solid var(--p-grid);}
    .wbC .detail .subnav .t { padding:12px 20px; font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px;}
    .wbC .detail .subnav .t.active { color:var(--p-ink); border-bottom-color:var(--p-accent);}

    /* phase arc */
    .wbC .detail .phases { display:grid; grid-template-columns:repeat(4, 1fr); gap:0; margin-bottom:32px;}
    .wbC .detail .phases .ph { padding:14px 0 12px; border-top:3px solid var(--p-grid); font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted);}
    .wbC .detail .phases .ph.done { border-top-color:var(--p-ink); color:var(--p-ink-2);}
    .wbC .detail .phases .ph.now  { border-top-color:var(--p-accent); color:var(--p-accent);}
    .wbC .detail .phases .ph .when { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.1em; margin-top:3px;}

    /* spec grid */
    .wbC .detail .spec { display:grid; grid-template-columns:repeat(4, 1fr); border:1px solid var(--p-grid); margin-bottom:32px;}
    .wbC .detail .spec .cell { padding:18px 18px 16px; border-right:1px solid var(--p-grid); background:var(--p-card);}
    .wbC .detail .spec .cell:last-child { border-right:none;}
    .wbC .detail .spec .cell .l { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted);}
    .wbC .detail .spec .cell .v { font-family:var(--mazius); font-size:28px; line-height:1; letter-spacing:-0.015em; margin-top:6px;}
    .wbC .detail .spec .cell .v em { font-style:italic; color:var(--p-accent);}
    .wbC .detail .spec .cell .s { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.06em; margin-top:4px;}

    /* approvals + activity within detail */
    .wbC .detail .colrow { display:grid; grid-template-columns:1fr 1fr; gap:32px;}
    .wbC .detail .panel h3 { font-family:var(--mazius); font-size:24px; line-height:1; letter-spacing:-0.015em; margin:0 0 12px; font-weight:400;}
    .wbC .detail .panel h3 em { font-style:italic; color:var(--p-accent);}
    .wbC .detail .kk { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); display:block; margin-bottom:6px;}
    .wbC .detail .panel .a { padding:14px; border:1px solid var(--p-grid); background:var(--p-card); margin-bottom:10px;}
    .wbC .detail .panel .a .top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px;}
    .wbC .detail .panel .a .ref { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; color:var(--p-muted); text-transform:uppercase;}
    .wbC .detail .panel .a .due { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-warn);}
    .wbC .detail .panel .a .what { font-size:13px; color:var(--p-ink); line-height:1.3; margin-bottom:8px;}
    .wbC .detail .panel .a button { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; padding:6px 10px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); cursor:pointer; margin-right:6px;}
    .wbC .detail .panel .a button.ghost { background:transparent; color:var(--p-ink);}

    .wbC .detail .panel .row { display:grid; grid-template-columns:auto 1fr auto; gap:10px; padding:10px 0; border-bottom:1px solid var(--p-grid); align-items:baseline;}
    .wbC .detail .panel .row .t { font-family:var(--mono); font-size:9px; color:var(--p-muted);}
    .wbC .detail .panel .row .ev { font-size:12px; color:var(--p-ink);}
    .wbC .detail .panel .row .ref { font-family:var(--mono); font-size:9px; color:var(--p-muted); margin-top:1px;}
    .wbC .detail .panel .row .pip { width:5px; height:5px; border-radius:50%;}
    .wbC .detail .panel .row .pip.ok { background:var(--p-ok);}
    .wbC .detail .panel .row .pip.warn { background:var(--p-warn);}
    .wbC .detail .panel .row .pip.info { background:var(--p-info);}

    /* ===== UTILITY DOCK (right) ===== */
    .wbC .dock { border-left:1px solid var(--p-grid); padding:24px 0; display:flex; flex-direction:column; align-items:center; gap:8px; background:var(--p-paper-2);}
    .wbC .dock .ic { width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:6px; cursor:pointer; color:var(--p-ink-2); position:relative;}
    .wbC .dock .ic:hover { background:var(--p-card); color:var(--p-ink);}
    .wbC .dock .ic.active { background:var(--p-card); color:var(--p-ink);}
    .wbC .dock .ic .badge { position:absolute; top:6px; right:6px; width:14px; height:14px; border-radius:50%; background:var(--p-accent); color:var(--p-paper); font-family:var(--mono); font-size:9px; display:flex; align-items:center; justify-content:center; letter-spacing:0;}
    .wbC .dock .ic svg { width:16px; height:16px;}
    .wbC .dock .lbl { font-family:var(--mono); font-size:8px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); margin-top:2px; text-align:center; line-height:1.2;}
    .wbC .dock hr { width:60%; border:none; border-top:1px solid var(--p-grid); margin:8px 0;}
  `;

  const p = projects[selected];

  return (
    <div className="pf wbC" style={{...tokens}} data-screen-label="Workbench · Variant C · Bench itself">
      <PortalStyles />
      <style>{css}</style>

      {/* TOP STRIP */}
      <div className="topstrip" style={{gridColumn:'1 / -1'}}>
        <div className="l">
          <img src="assets/logo-horizontal-ink.png" alt="PLX" style={scheme==='dark' ? {filter:'invert(0.92)'} : {}}/>
          <span className="div"/>
          <span className="ws"><span className="av">A</span>Aldosari Studio <span style={{color:'var(--p-muted)'}}>▾</span></span>
        </div>
        <div className="c">
          <span className="live"><span className="pulse"/>Floor · Live</span>
          <span>Kettles <b>9 / 12</b></span>
          <span>Lines <b>7 / 10</b></span>
          <span>Last seal <b>14 min</b></span>
        </div>
        <div className="r">
          <span>EN</span>
          <span className="av">MA</span>
        </div>
      </div>

      {/* LEFT — PROJECT STACK */}
      <aside className="stack">
        <div className="header">
          <span className="kk">/ Your bench · 3</span>
          <button className="new">+ New</button>
        </div>
        {projects.map((pj, i) => (
          <div key={pj.code} className={`tile ${i===selected?'active':''}`}>
            <div className="top">
              <div className="pmark2"><span className="num">{pj.num}</span><span className="sym">{pj.sym}</span></div>
              <div className="info">
                <div className="ref">{pj.code}</div>
                <div className="nm">{pj.name}</div>
                <div className="step">{pj.step} · {pj.progress}%</div>
              </div>
            </div>
            <div className="bar"><div className="fill" style={{width:`${pj.progress}%`, background:phaseColor(pj.phase)}}/></div>
            <div className="footer">
              <span className="phase-pill" style={{color:phaseColor(pj.phase)}}><span className="dot"/>{pj.phaseLabel}</span>
              {pj.pending>0 && <span className="pend"><span className="num">{pj.pending}</span></span>}
            </div>
          </div>
        ))}
      </aside>

      {/* MAIN — PROJECT DETAIL */}
      <main className="detail">
        <div className="hcrumbs">
          <span>Bench</span><span>›</span><b>{p.name}</b>
        </div>

        <div className="header">
          <div>
            <h1>Squalane <em>Body Oil.</em></h1>
            <div className="sub">Aldosari Studio · Formulator <b>Rian K.</b> · brief signed <b>2026.02.14</b></div>
          </div>
          <div className="right">
            <span className="pp" style={{color:phaseColor(p.phase)}}><span className="dot"/>{p.phaseLabel}</span>
            <span className="target">→ Dock {p.target} · {p.progress}%</span>
          </div>
        </div>

        <div className="subnav">
          <span className="t active">Overview</span>
          <span className="t">Formula</span>
          <span className="t">Batches</span>
          <span className="t">Documents</span>
          <span className="t">Messages</span>
        </div>

        {/* PHASE ARC */}
        <div className="phases">
          <div className="ph done">Brief<div className="when">2026.02.14</div></div>
          <div className="ph done">Bench<div className="when">2026.03.02 — 04.18</div></div>
          <div className="ph now">Floor<div className="when">2026.04.21 — now</div></div>
          <div className="ph">Dock<div className="when">2026.06.04</div></div>
        </div>

        {/* SPEC GRID */}
        <div className="spec">
          <div className="cell"><div className="l">Run</div><div className="v">02 / <em>03</em></div><div className="s">Last 6 days</div></div>
          <div className="cell"><div className="l">Volume</div><div className="v">2,400<span style={{fontFamily:'var(--mono)', fontSize:14, letterSpacing:0, color:'var(--p-muted)', marginLeft:4}}>L</span></div><div className="s">Kettle 04 · jacketed</div></div>
          <div className="cell"><div className="l">QC</div><div className="v"><em>0</em></div><div className="s">Deviations · Run 01–02</div></div>
          <div className="cell"><div className="l">Days to dock</div><div className="v">14</div><div className="s">On schedule</div></div>
        </div>

        <div className="colrow">
          <div className="panel">
            <span className="kk">/ Approvals</span>
            <h3>Awaiting <em>your sign-off.</em></h3>
            <div className="a">
              <div className="top"><span className="ref">{p.code}</span><span className="due">Due · Tomorrow</span></div>
              <div className="what">COA — Run 02 · ready for client review</div>
              <button>Review</button><button className="ghost">Defer</button>
            </div>
          </div>

          <div className="panel">
            <span className="kk">/ Floor activity · this project</span>
            <h3>What's <em>happening.</em></h3>
            <div className="row"><span className="t">T-00:14</span><div><div className="ev">Batch sealed</div><div className="ref">Run 02 · 0 deviation</div></div><span className="pip ok"/></div>
            <div className="row"><span className="t">T-04:31</span><div><div className="ev">QC sample pulled</div><div className="ref">Run 02 · lab 3</div></div><span className="pip ok"/></div>
            <div className="row"><span className="t">T-22:08</span><div><div className="ev">Run 02 started</div><div className="ref">Kettle 04 · 2,400 L</div></div><span className="pip info"/></div>
            <div className="row"><span className="t">T-2d</span><div><div className="ev">Tech transfer signed</div><div className="ref">Bench → floor</div></div><span className="pip ok"/></div>
          </div>
        </div>
      </main>

      {/* RIGHT DOCK */}
      <aside className="dock">
        <div className="ic active" title="Workbench"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/></svg></div>
        <div className="lbl">Bench</div>
        <div className="ic" title="Documents"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 2h7l3 3v9H3z"/><path d="M10 2v3h3"/></svg></div>
        <div className="lbl">Docs</div>
        <div className="ic" title="Messages"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 4h12v8H5l-3 3z"/></svg><span className="badge">2</span></div>
        <div className="lbl">Msgs</div>
        <div className="ic" title="Approvals"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 8l3 3 7-7"/></svg><span className="badge">3</span></div>
        <div className="lbl">Sign</div>
        <hr/>
        <div className="ic" title="Billing"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="4" width="12" height="9"/><line x1="2" y1="7" x2="14" y2="7"/></svg></div>
        <div className="lbl">Billing</div>
        <div className="ic" title="Settings"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3"/></svg></div>
        <div className="lbl">Set</div>
      </aside>
    </div>
  );
}

window.PortalWorkbench_SideRail = PortalWorkbench_SideRail;
window.PortalWorkbench_BenchItself = PortalWorkbench_BenchItself;
