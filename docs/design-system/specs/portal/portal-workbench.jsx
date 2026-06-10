/* =========================================================================
   PETRA LAB-X CLIENT PORTAL — WORKBENCH DASHBOARD
   =========================================================================
   The room behind the door. What a customer sees on first sign-in.
   Hierarchy: top bar (brand · workspace · floor signal · user) →
   page header (welcome + summary stats) → project grid (3 active) →
   activity feed + approvals queue (right rail).

   Vocabulary is doing real work here:
   - The PRODUCT they're in        = "Workbench"
   - The LIVE OPS strip (telemetry) = "Floor"
   - PHASE PILLS on each project    = "AT THE BENCH" / "ON THE FLOOR" / "DOCK-OUT"
   - The BRAND/INSTITUTION          = "the Lab"
   ========================================================================= */

function PortalWorkbench({ scheme = 'light' }) {
  const tokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;

  /* ---------- Mock data ---------- */
  const projects = [
    {
      code:'PLX-2614', name:'Niacinamide 5% Serum', sym:'Ni', num:'14',
      phase:'bench', phaseLabel:'AT THE BENCH', step:'R&D · Iteration 04',
      progress:42, target:'2026.07.18',
      lastEvent:'Pilot poured · 18 kg · vendor 12',
      lastWhen:'T-02:08',
      formulator:'Maya A.',
      pending:2,
    },
    {
      code:'PLX-2602', name:'Squalane Body Oil', sym:'Sq', num:'08',
      phase:'floor', phaseLabel:'ON THE FLOOR', step:'Production · Run 02 / 03',
      progress:71, target:'2026.06.04',
      lastEvent:'Batch sealed · QC-LAB-3 · 0 deviation',
      lastWhen:'T-00:14',
      formulator:'Rian K.',
      pending:1,
    },
    {
      code:'AURA-019', name:'Retinal Night Cream', sym:'Rt', num:'23',
      phase:'dock', phaseLabel:'DOCK-OUT', step:'Pack · Final QC',
      progress:96, target:'2026.05.09',
      lastEvent:'COA approved · QC-LAB-3',
      lastWhen:'T-01:42',
      formulator:'Maya A.',
      pending:0,
    },
  ];

  const activity = [
    ['T-00:14', 'Batch sealed',  'PLX-2602 · Squalane',           'ok'],
    ['T-01:42', 'COA approved',  'AURA-019 · QC-LAB-3',           'ok'],
    ['T-02:08', 'Pilot poured',  'PLX-2614 · 18 kg · vendor 12',  'ok'],
    ['T-03:31', 'Tech transfer', 'PLX-2614 · vendor 12 \u2192 floor', 'warn'],
    ['T-05:55', 'Brief intake',  'WILDLEAF · sketch received',     'info'],
    ['T-08:19', 'Stability OK',  'AURA-019 · 8wk @ 40\u00b0C',         'ok'],
    ['T-12:04', 'Document signed','PLX-2602 · MSA v3',             'ok'],
    ['T-18:22', 'Sample shipped','AURA-019 \u2192 brand HQ',          'info'],
  ];

  const approvals = [
    {ref:'PLX-2614', what:'Formula v04 sign-off',  due:'Today',     kind:'warn'},
    {ref:'PLX-2602', what:'COA — Run 02',           due:'Tomorrow',  kind:'warn'},
    {ref:'AURA-019', what:'Carton artwork · proof', due:'May 06',    kind:'info'},
  ];

  const phaseColor = (p) => p==='bench' ? 'var(--p-info)' : p==='floor' ? 'var(--p-warn)' : 'var(--p-ok)';

  /* ---------- Local CSS (dashboard-specific only; primitives come from PortalStyles) ---------- */
  const css = `
    .wb { width:1440px; min-height:1100px; background:var(--p-paper); position:relative; overflow:hidden; }

    /* TOP BAR */
    .wb .top { display:flex; align-items:center; justify-content:space-between; padding:18px 40px; border-bottom:1px solid var(--p-grid); background:var(--p-paper); position:sticky; top:0; z-index:5;}
    .wb .top .l, .wb .top .c, .wb .top .r { display:flex; align-items:center; gap:18px;}
    .wb .top .logo { height:22px; display:block;}
    .wb .top .div { width:1px; height:18px; background:var(--p-grid);}
    .wb .top .ws { display:flex; align-items:center; gap:10px; padding:6px 12px; border:1px solid var(--p-grid); border-radius:4px; cursor:pointer;}
    .wb .top .ws .av { width:18px; height:18px; border-radius:50%; background:var(--p-accent); color:var(--p-paper); font-size:9px; font-family:var(--mono); display:flex; align-items:center; justify-content:center; letter-spacing:0;}
    .wb .top .ws .nm { font-size:12px; color:var(--p-ink);}
    .wb .top .ws .ch { color:var(--p-muted); font-size:9px;}
    .wb .top a.nav { font-size:12px; color:var(--p-ink-2); text-decoration:none; padding:6px 0; border-bottom:1px solid transparent;}
    .wb .top a.nav:hover { border-bottom-color:var(--p-ink);}
    .wb .top a.nav.active { color:var(--p-ink); border-bottom-color:var(--p-ink);}
    .wb .top .search { display:flex; align-items:center; gap:8px; padding:6px 10px; border:1px solid var(--p-grid); border-radius:4px; min-width:200px; color:var(--p-muted); font-size:12px;}
    .wb .top .search .key { font-family:var(--mono); font-size:9px; padding:2px 5px; border:1px solid var(--p-grid); border-radius:2px; margin-left:auto;}
    .wb .top .userav { width:30px; height:30px; border-radius:50%; background:var(--p-ink); color:var(--p-paper); font-family:var(--mono); font-size:10px; display:flex; align-items:center; justify-content:center;}

    /* FLOOR STRIP — live ops ticker */
    .wb .floor-strip { display:flex; align-items:center; gap:32px; padding:10px 40px; background:var(--p-paper-2); border-bottom:1px solid var(--p-grid); font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-ink-2); overflow:hidden;}
    .wb .floor-strip .live { color:var(--p-ok); display:inline-flex; align-items:center; gap:8px;}
    .wb .floor-strip .item { display:inline-flex; align-items:center; gap:8px; color:var(--p-muted);}
    .wb .floor-strip .item b { color:var(--p-ink); font-weight:500; letter-spacing:0.1em;}
    .wb .floor-strip .sep { color:var(--p-grid);}

    /* PAGE HEADER */
    .wb .head { padding:48px 40px 32px; display:grid; grid-template-columns:1fr auto; gap:48px; align-items:end; border-bottom:1px solid var(--p-grid);}
    .wb .head h1 { font-family:var(--mazius); font-size:72px; line-height:0.96; letter-spacing:-0.025em; margin:0; font-weight:400;}
    .wb .head h1 em { font-style:italic; color:var(--p-accent);}
    .wb .head .greet { font-size:13px; color:var(--p-muted); margin-bottom:14px;}
    .wb .head .summary { display:flex; gap:36px;}
    .wb .head .summary .stat { text-align:right;}
    .wb .head .summary .stat .v { font-family:var(--mazius); font-size:42px; line-height:1; letter-spacing:-0.02em;}
    .wb .head .summary .stat .v em { font-style:italic; color:var(--p-accent);}
    .wb .head .summary .stat .l { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); margin-top:6px;}

    /* MAIN GRID */
    .wb .body { display:grid; grid-template-columns:1fr 380px; gap:0; min-height:760px;}
    .wb .main { padding:40px; border-right:1px solid var(--p-grid);}
    .wb .rail { padding:40px 32px;}

    /* SECTION HEADERS */
    .wb .sec-head { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:18px;}
    .wb .sec-head .l { display:flex; align-items:baseline; gap:14px;}
    .wb .sec-head .kk { font-family:var(--mono); font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted);}
    .wb .sec-head h2 { font-family:var(--mazius); font-size:30px; line-height:1; letter-spacing:-0.018em; margin:0; font-weight:400;}
    .wb .sec-head .more { font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-ink-2); text-decoration:none; border-bottom:1px solid var(--p-grid); padding-bottom:2px;}

    /* PROJECT CARD */
    .wb .pcard { display:grid; grid-template-columns:80px 1fr 220px auto; gap:24px; padding:24px 24px; border:1px solid var(--p-grid); background:var(--p-card); margin-bottom:14px; align-items:center; transition:border-color .15s;}
    .wb .pcard:hover { border-color:var(--p-ink);}
    .wb .pcard .pmark2 { display:flex; flex-direction:column; align-items:flex-start; padding:8px 10px; border:1px solid var(--p-ink); line-height:1; min-width:60px; height:60px; justify-content:space-between;}
    .wb .pcard .pmark2 .num { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.06em;}
    .wb .pcard .pmark2 .sym { font-family:var(--mazius); font-size:28px; line-height:0.9; letter-spacing:-0.01em;}
    .wb .pcard .info .ref { font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); margin-bottom:4px;}
    .wb .pcard .info .nm { font-family:var(--mazius); font-size:24px; line-height:1; letter-spacing:-0.015em; margin-bottom:6px;}
    .wb .pcard .info .meta { display:flex; gap:14px; font-size:11px; color:var(--p-ink-2);}
    .wb .pcard .info .meta .ev { color:var(--p-muted);}
    .wb .pcard .info .meta .ev b { color:var(--p-ink); font-weight:500;}
    .wb .pcard .progress { display:flex; flex-direction:column; gap:8px;}
    .wb .pcard .progress .top { display:flex; justify-content:space-between; align-items:baseline;}
    .wb .pcard .progress .pct { font-family:var(--mazius); font-size:24px; line-height:1; letter-spacing:-0.01em;}
    .wb .pcard .progress .target { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted);}
    .wb .pcard .progress .bar { height:3px; background:var(--p-grid); position:relative; border-radius:0;}
    .wb .pcard .progress .bar .fill { position:absolute; left:0; top:0; bottom:0; background:var(--p-ink);}
    .wb .pcard .progress .step { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-ink-2);}
    .wb .pcard .right { display:flex; flex-direction:column; align-items:flex-end; gap:10px;}
    .wb .pcard .phase-pill { display:inline-flex; align-items:center; gap:8px; padding:6px 12px; border:1px solid currentColor; border-radius:0; font-family:var(--mono); font-size:9px; letter-spacing:0.2em; font-weight:500;}
    .wb .pcard .phase-pill .dot { width:6px; height:6px; border-radius:50%; background:currentColor;}
    .wb .pcard .pend { font-family:var(--mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-accent); display:flex; align-items:center; gap:6px;}
    .wb .pcard .pend .num { background:var(--p-accent); color:var(--p-paper); border-radius:50%; width:18px; height:18px; display:flex; align-items:center; justify-content:center; font-size:10px; letter-spacing:0;}

    /* PHASE TIMELINE — horizontal mini-arc on each card */
    .wb .pcard .phases { display:grid; grid-template-columns:repeat(4, 1fr); gap:0; margin-top:6px;}
    .wb .pcard .phases .ph { padding-top:10px; border-top:2px solid var(--p-grid); font-family:var(--mono); font-size:8px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted);}
    .wb .pcard .phases .ph.done { border-top-color:var(--p-ink); color:var(--p-ink-2);}
    .wb .pcard .phases .ph.now  { border-top-color:var(--p-accent); color:var(--p-accent);}

    /* RIGHT RAIL */
    .wb .rail h3 { font-family:var(--mazius); font-size:24px; line-height:1; letter-spacing:-0.015em; margin:0 0 14px; font-weight:400;}
    .wb .rail .feed { border-top:1px solid var(--p-grid);}
    .wb .rail .feed .row { display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:baseline; padding:12px 0; border-bottom:1px solid var(--p-grid);}
    .wb .rail .feed .row .t { font-family:var(--mono); font-size:10px; color:var(--p-muted); letter-spacing:0.06em;}
    .wb .rail .feed .row .ev { font-size:13px; color:var(--p-ink); line-height:1.3;}
    .wb .rail .feed .row .ref { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.06em; margin-top:2px;}
    .wb .rail .feed .row .pip { width:6px; height:6px; border-radius:50%;}
    .wb .rail .feed .row .pip.ok   { background:var(--p-ok);}
    .wb .rail .feed .row .pip.warn { background:var(--p-warn);}
    .wb .rail .feed .row .pip.info { background:var(--p-info);}

    .wb .rail .approvals { margin-top:36px; padding-top:24px; border-top:1px solid var(--p-grid);}
    .wb .rail .approvals .a { display:flex; flex-direction:column; gap:6px; padding:14px; border:1px solid var(--p-grid); background:var(--p-card); margin-bottom:10px;}
    .wb .rail .approvals .a .top { display:flex; justify-content:space-between; align-items:baseline;}
    .wb .rail .approvals .a .ref { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; color:var(--p-muted); text-transform:uppercase;}
    .wb .rail .approvals .a .due { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-warn);}
    .wb .rail .approvals .a .due.info { color:var(--p-info);}
    .wb .rail .approvals .a .what { font-size:14px; color:var(--p-ink); line-height:1.3;}
    .wb .rail .approvals .a .actions { display:flex; gap:8px; margin-top:8px;}
    .wb .rail .approvals .a .btn-mini { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; padding:6px 10px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); cursor:pointer;}
    .wb .rail .approvals .a .btn-mini.ghost { background:transparent; color:var(--p-ink);}

    /* MESSAGES BAR (sticky bottom) */
    .wb .msg-bar { display:flex; align-items:center; justify-content:space-between; padding:14px 40px; border-top:1px solid var(--p-grid); background:var(--p-paper-2);}
    .wb .msg-bar .l { display:flex; align-items:center; gap:14px;}
    .wb .msg-bar .av-stack { display:flex;}
    .wb .msg-bar .av-stack .av { width:24px; height:24px; border-radius:50%; background:var(--p-ink); color:var(--p-paper); font-family:var(--mono); font-size:9px; display:flex; align-items:center; justify-content:center; border:2px solid var(--p-paper-2); margin-left:-6px;}
    .wb .msg-bar .av-stack .av:first-child { margin-left:0;}
    .wb .msg-bar .preview { font-size:13px; color:var(--p-ink); }
    .wb .msg-bar .preview b { font-weight:500;}
    .wb .msg-bar .preview .from { color:var(--p-muted); font-family:var(--mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; margin-right:10px;}
    .wb .msg-bar .open { font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-ink); border:1px solid var(--p-ink); padding:8px 14px; background:transparent; cursor:pointer;}

    /* FOOTER META */
    .wb .foot { padding:14px 40px; display:flex; justify-content:space-between; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); border-top:1px solid var(--p-grid);}
  `;

  return (
    <div className="pf wb" style={{...tokens}} data-screen-label="Petra Lab-X · Workbench Dashboard">
      <PortalStyles />
      <style>{css}</style>

      {/* ============== TOP BAR ============== */}
      <div className="top">
        <div className="l">
          <img className="logo" src="assets/logo-horizontal-ink.png" alt="PLX" style={scheme==='dark' ? {filter:'invert(0.92)'} : {}}/>
          <span className="div"/>
          <div className="ws">
            <span className="av">A</span>
            <span className="nm">Aldosari Studio</span>
            <span className="ch">▾</span>
          </div>
        </div>
        <div className="c">
          <a className="nav active">Workbench</a>
          <a className="nav">Projects</a>
          <a className="nav">Documents</a>
          <a className="nav">Messages</a>
          <a className="nav">Billing</a>
        </div>
        <div className="r">
          <div className="search">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="5" cy="5" r="3.5"/><path d="m8 8 2.5 2.5"/></svg>
            Search projects, docs…
            <span className="key">⌘ K</span>
          </div>
          <span className="userav">MA</span>
        </div>
      </div>

      {/* ============== FLOOR STRIP ============== */}
      <div className="floor-strip">
        <span className="live"><span className="pulse"/>Floor · Live · Toronto</span>
        <span className="sep">·</span>
        <span className="item">T-04:21:13</span>
        <span className="sep">·</span>
        <span className="item">Kettles <b>9 / 12</b> running</span>
        <span className="sep">·</span>
        <span className="item">Lines <b>7 / 10</b> active</span>
        <span className="sep">·</span>
        <span className="item">Last seal <b>14 min ago</b></span>
        <span className="sep">·</span>
        <span className="item">Today <b>14</b> batches · <b>23</b> COAs</span>
        <span className="sep" style={{marginLeft:'auto'}}>·</span>
        <span className="item">GMP · ISO 22716 · MOCRA · SOC 2</span>
      </div>

      {/* ============== PAGE HEADER ============== */}
      <div className="head">
        <div>
          <div className="greet">Tuesday, May 5 · 10:42 a.m.</div>
          <h1>Welcome back,<br/>Maya. Your <em>workbench.</em></h1>
        </div>
        <div className="summary">
          <div className="stat">
            <div className="v">3</div>
            <div className="l">Active projects</div>
          </div>
          <div className="stat">
            <div className="v"><em>3</em></div>
            <div className="l">Awaiting you</div>
          </div>
          <div className="stat">
            <div className="v">14<span style={{fontFamily:'var(--mono)', fontSize:14, marginLeft:6, letterSpacing:0, color:'var(--p-muted)'}}>D</span></div>
            <div className="l">Next dock-out</div>
          </div>
        </div>
      </div>

      {/* ============== MAIN GRID ============== */}
      <div className="body">
        {/* ===== MAIN COLUMN ===== */}
        <div className="main">
          {/* PROJECTS SECTION */}
          <div className="sec-head">
            <div className="l">
              <span className="kk">/ 001 — Active projects</span>
              <h2>At the bench, on the floor.</h2>
            </div>
            <a className="more">All projects →</a>
          </div>

          {projects.map((p, i) => (
            <div key={p.code} className="pcard">
              <div className="pmark2">
                <span className="num">{p.num}</span>
                <span className="sym">{p.sym}</span>
              </div>
              <div className="info">
                <div className="ref">{p.code}</div>
                <div className="nm">{p.name}</div>
                <div className="meta">
                  <span>Formulator · <b style={{color:'var(--p-ink)'}}>{p.formulator}</b></span>
                  <span className="ev">{p.lastWhen} · <b>{p.lastEvent}</b></span>
                </div>
              </div>
              <div className="progress">
                <div className="top">
                  <span className="pct">{p.progress}%</span>
                  <span className="target">→ {p.target}</span>
                </div>
                <div className="bar"><div className="fill" style={{width:`${p.progress}%`, background: phaseColor(p.phase)}}/></div>
                <div className="step">{p.step}</div>
                <div className="phases">
                  <div className={`ph ${p.phase==='brief'?'now':'done'}`}>Brief</div>
                  <div className={`ph ${p.phase==='bench'?'now': (p.phase==='floor'||p.phase==='dock')?'done':''}`}>Bench</div>
                  <div className={`ph ${p.phase==='floor'?'now': (p.phase==='dock')?'done':''}`}>Floor</div>
                  <div className={`ph ${p.phase==='dock'?'now':''}`}>Dock</div>
                </div>
              </div>
              <div className="right">
                <span className="phase-pill" style={{color: phaseColor(p.phase)}}>
                  <span className="dot"/>
                  {p.phaseLabel}
                </span>
                {p.pending > 0 && (
                  <span className="pend">
                    <span className="num">{p.pending}</span>
                    {p.pending===1 ? 'awaits you' : 'await you'}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* QUICK ACTIONS */}
          <div className="sec-head" style={{marginTop:48}}>
            <div className="l">
              <span className="kk">/ 002 — Bring something new to the Lab</span>
              <h2>Start a brief.</h2>
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
            {[
              ['Skin', 'Serum · cream · cleanser · mask'],
              ['Hair', 'Shampoo · conditioner · styling'],
              ['Body', 'Wash · lotion · oil · scrub'],
            ].map(([cat, sub], i) => (
              <div key={i} style={{padding:'24px 22px', border:'1px solid var(--p-grid)', background:'var(--p-card)', cursor:'pointer'}}>
                <div className="kicker" style={{marginBottom:14}}>+ New brief</div>
                <div className="serif" style={{fontSize:32, lineHeight:1, letterSpacing:'-0.018em', marginBottom:6}}>{cat}</div>
                <div style={{fontSize:11, color:'var(--p-muted)', fontFamily:'var(--mono)', letterSpacing:'0.06em'}}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== RIGHT RAIL ===== */}
        <div className="rail">
          {/* APPROVALS */}
          <div className="sec-head" style={{marginBottom:14}}>
            <div className="l">
              <span className="kk">/ Approvals · 3</span>
            </div>
          </div>
          <h3>Awaiting <em style={{fontStyle:'italic', color:'var(--p-accent)'}}>your sign-off.</em></h3>
          <div className="approvals" style={{marginTop:14, paddingTop:0, borderTop:0}}>
            {approvals.map((a, i) => (
              <div key={i} className="a">
                <div className="top">
                  <span className="ref">{a.ref}</span>
                  <span className={`due ${a.kind==='info'?'info':''}`}>Due · {a.due}</span>
                </div>
                <div className="what">{a.what}</div>
                <div className="actions">
                  <button className="btn-mini">Review</button>
                  <button className="btn-mini ghost">Defer</button>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIVITY FEED */}
          <div className="sec-head" style={{marginTop:36, marginBottom:14}}>
            <div className="l">
              <span className="kk">/ Floor · last 24 hr</span>
            </div>
            <a className="more">Full log →</a>
          </div>
          <h3>What happened on the floor.</h3>
          <div className="feed" style={{marginTop:14}}>
            {activity.map((row, i) => {
              const [t, ev, ref, kind] = row;
              return (
                <div key={i} className="row">
                  <span className="t">{t}</span>
                  <div>
                    <div className="ev">{ev}</div>
                    <div className="ref">{ref}</div>
                  </div>
                  <span className={`pip ${kind}`}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============== MESSAGES BAR ============== */}
      <div className="msg-bar">
        <div className="l">
          <div className="av-stack">
            <span className="av">MA</span>
            <span className="av" style={{background:'var(--p-accent)'}}>RK</span>
          </div>
          <div className="preview">
            <span className="from">Rian K. · 14m ago</span>
            <b>Squalane Run 02 sealed clean.</b> COA attached, ready for your sign-off when you have a moment…
          </div>
        </div>
        <button className="open">Open thread →</button>
      </div>

      {/* ============== FOOTER ============== */}
      <div className="foot">
        <span>FIG. 02 · WORKBENCH / DASHBOARD</span>
        <span>Aldosari Studio · 47 active brands</span>
        <span>v.26.05 · 2026.05.05</span>
      </div>
    </div>
  );
}

window.PortalWorkbench = PortalWorkbench;
