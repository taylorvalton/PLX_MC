/* =========================================================================
   PORTAL · PROJECT DETAIL — PLX-2614 · Niacinamide 5% Serum
   =========================================================================
   The page a customer lands on when they click a project from the Workbench.
   Same left rail as the SingleRail workbench (continuous chrome) — main column
   pivots to the project's detail view.

   This page forces a few components into existence that the workbench only
   gestured at:
     · PhaseIndicator (bar) — the Brief/Bench/Floor/Dock arc, displayed full
     · FormulaTable        — line-by-line ingredients with %, supplier, status
     · MessageThread       — the back-and-forth with the formulator
     · DocStrip            — the file row (brief, COA, MSDS, artwork)
     · BatchTrack          — pilot/production run history
   ========================================================================= */

function PortalProjectDetail({ scheme = 'light', tokenOverrides = {} }) {
  const baseTokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;
  const tokens = { ...baseTokens, ...tokenOverrides };

  /* The project --------------------------------------------------------- */
  const project = {
    code: 'PLX-2614',
    name: 'Niacinamide 5% Serum',
    sym: 'Ni', num: '14',
    brand: 'Aldosari Studio',
    formulator: 'Maya A.',
    formulatorFull: 'Maya Akhtar · Senior formulator',
    targetDock: '2026.07.18',
    batchSize: '6,000 units · 30 mL',
    fillFormat: 'Glass dropper · amber',
    started: '2026.02.14',
    phase: 'bench',
    iteration: 'v04',
    progress: 42,
  };

  const phaseDates = {
    brief: '02.14',
    bench: '03.02',
    floor: '— est 06.10',
    dock:  '— est 07.18',
  };

  /* The formula --------------------------------------------------------- */
  /* `delta` describes change from v03 — that's the question a customer is
     actually answering at v04 sign-off. Per-row "approved" was placeholder
     thinking; formulas are approved as a whole via the header CTA. */
  const formula = [
    { phase:'A', ing:'Aqua / Distilled water',                pct:'84.00',  fn:'Solvent',         supplier:'Internal',           inci:'Water',                                  delta:'−0.75',        deltaKind:'down' },
    { phase:'A', ing:'Niacinamide',                            pct:'5.00',   fn:'Active',          supplier:'Lonza · CH',         inci:'Niacinamide',                            delta:'—',            deltaKind:'same', hero:true },
    { phase:'A', ing:'Pentylene Glycol',                       pct:'4.00',   fn:'Humectant',       supplier:'Symrise · DE',       inci:'Pentylene Glycol',                       delta:'+1.00',        deltaKind:'up',   note:'v04 — increased for glide on application' },
    { phase:'A', ing:'Glycerin · vegetable',                   pct:'3.50',   fn:'Humectant',       supplier:'Croda · UK',         inci:'Glycerin',                               delta:'—',            deltaKind:'same' },
    { phase:'A', ing:'Sodium Hyaluronate · LMW',               pct:'0.60',   fn:'Active',          supplier:'Bloomage · CN',      inci:'Sodium Hyaluronate',                     delta:'NEW',          deltaKind:'new',  note:'v04 — added for surface hydration' },
    { phase:'B', ing:'Hydroxyethylcellulose',                  pct:'0.45',   fn:'Thickener',       supplier:'Ashland · US',       inci:'Hydroxyethylcellulose',                  delta:'+0.15',        deltaKind:'up',   note:'compensate for new HA lot viscosity' },
    { phase:'B', ing:'Tetrasodium EDTA',                       pct:'0.10',   fn:'Chelant',         supplier:'BASF · DE',          inci:'Tetrasodium EDTA',                       delta:'—',            deltaKind:'same' },
    { phase:'C', ing:'Panthenol',                              pct:'1.00',   fn:'Conditioner',     supplier:'DSM · NL',           inci:'Panthenol',                              delta:'—',            deltaKind:'same' },
    { phase:'C', ing:'Allantoin',                              pct:'0.20',   fn:'Soothing',        supplier:'Ashland · US',       inci:'Allantoin',                              delta:'—',            deltaKind:'same' },
    { phase:'D', ing:'Phenoxyethanol + Ethylhexylglycerin',    pct:'0.95',   fn:'Preservative',    supplier:'Schülke · DE',       inci:'Phenoxyethanol, Ethylhexylglycerin',     delta:'—',            deltaKind:'same' },
    { phase:'D', ing:'Citric Acid (pH adjust)',                pct:'q.s.',   fn:'pH',              supplier:'—',                  inci:'Citric Acid',                            delta:'—',            deltaKind:'same' },
    { phase:'D', ing:'Fragrance · cucumber-water · LX-08',     pct:'0.20',   fn:'Fragrance',       supplier:'Givaudan · CH',      inci:'Parfum',                                 delta:'NEW SUPPLIER', deltaKind:'flag', note:'awaiting allergen disclosure from Givaudan' },
  ];

  /* Messages ------------------------------------------------------------ */
  const messages = [
    { who:'Maya A.', role:'Formulator', when:'T-01:14', body:'Pilot 04 poured at 18 kg this morning. pH landed at 5.62 — within window. Viscosity reads 4,200 cP at 25 °C, slightly above the v03 target. Rolled HEC up 0.15 to compensate for the new HA lot.', mine:false },
    { who:'You',     role:'',           when:'T-00:48', body:'How does it feel on skin vs v03? My main note from last sample was the slight drag on application.', mine:true },
    { who:'Maya A.', role:'Formulator', when:'T-00:31', body:'Glide is markedly improved — pentylene glycol bump did the work. Sending two 30 mL pulls by courier; one for you, one for the panel. ETA Thursday.', mine:false },
  ];

  /* Activity (project-scoped) ------------------------------------------- */
  const activity = [
    ['T-02:08', 'Pilot 04 poured',           '18 kg · Kettle 02 · 0 deviation',         'ok'],
    ['T-03:31', 'Tech transfer prepped',     'Vendor 12 · ready for pilot',              'warn'],
    ['T-08:40', 'Stability check · 4 wk',    'Sample v03 · pass · no separation',        'ok'],
    ['T-12:55', 'Formula v04 drafted',       'HEC ↑ 0.15 · Pentylene Glycol ↑ 1.0',     'info'],
    ['T-26:18', 'Brief revised',             'Fragrance LX-08 selected from 4-way',      'info'],
    ['T-44:02', 'Stability check · 2 wk',    'Sample v03 · pass',                        'ok'],
  ];

  /* Documents ----------------------------------------------------------- */
  const docs = [
    { name:'Brief — concept v2',         kind:'PDF',  size:'1.2 MB', when:'02.14', sig:'signed' },
    { name:'Formula v03 — sign-off',     kind:'PDF',  size:'344 KB', when:'04.21', sig:'signed' },
    { name:'Formula v04 — for review',   kind:'PDF',  size:'358 KB', when:'05.04', sig:'pending', hot:true },
    { name:'COA — Pilot 03',             kind:'PDF',  size:'212 KB', when:'04.28', sig:'signed' },
    { name:'MSDS pack',                  kind:'ZIP',  size:'4.8 MB', when:'04.30', sig:'—' },
    { name:'Carton — concept sketches',  kind:'PDF',  size:'2.1 MB', when:'05.01', sig:'draft' },
  ];

  /* Batches / runs ------------------------------------------------------ */
  const batches = [
    { id:'P-01', kind:'Pilot',      size:'2 kg',  on:'03.18', dev:'—',    res:'baseline' },
    { id:'P-02', kind:'Pilot',      size:'4 kg',  on:'04.04', dev:'0.4%', res:'pass' },
    { id:'P-03', kind:'Pilot',      size:'6 kg',  on:'04.21', dev:'0.2%', res:'pass · v03 sealed' },
    { id:'P-04', kind:'Pilot',      size:'18 kg', on:'05.04', dev:'0.1%', res:'in panel · v04', current:true },
  ];

  /* Sidebar projects (same as workbench, for continuity) ---------------- */
  const projects = [
    { code:'PLX-2614', name:'Niacinamide 5% Serum', phase:'bench', current:true },
    { code:'PLX-2602', name:'Squalane Body Oil',     phase:'floor' },
    { code:'AURA-019', name:'Retinal Night Cream',   phase:'dock'  },
  ];

  const phaseColor = (p) => p==='bench' ? 'var(--p-info)' : p==='floor' ? 'var(--p-warn)' : p==='dock' ? 'var(--p-ok)' : 'var(--p-muted)';

  /* Δ rendering ---------------------------------------------------------- */
  const renderDelta = (row) => {
    const k = row.deltaKind;
    if (k === 'up')   return <span className="d-up"><span className="arrow">↑</span>{row.delta}</span>;
    if (k === 'down') return <span className="d-down"><span className="arrow">↓</span>{row.delta}</span>;
    if (k === 'new')  return <span className="d-new">{row.delta}</span>;
    if (k === 'flag') return <span className="d-flag">{row.delta}</span>;
    return <span className="d-same">{row.delta}</span>;
  };

  const css = `
    .pjd { width:1440px; min-height:1700px; background:var(--p-paper); display:grid; grid-template-columns:260px 1fr;}

    /* ===== LEFT RAIL ===== (matches SingleRail workbench) */
    .pjd .lrail { background:var(--p-paper-2); border-right:1px solid var(--p-grid); display:flex; flex-direction:column; min-height:1700px;}
    .pjd .lrail .top { padding:24px 22px 18px; border-bottom:1px solid var(--p-grid);}
    .pjd .lrail .top img { height:22px; display:block; margin-bottom:18px;}
    .pjd .lrail .ws { display:flex; align-items:center; gap:10px; padding:10px 12px; border:1px solid var(--p-grid); border-radius:4px; background:var(--p-card); cursor:pointer;}
    .pjd .lrail .ws .av { width:22px; height:22px; border-radius:50%; background:var(--p-accent); color:var(--p-paper); font-size:10px; font-family:var(--mono); display:flex; align-items:center; justify-content:center;}
    .pjd .lrail .ws .nm { flex:1; font-size:12px; line-height:1.2;}
    .pjd .lrail .ws .nm .b { color:var(--p-ink); font-weight:500;}
    .pjd .lrail .ws .nm .s { color:var(--p-muted); font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; margin-top:1px;}
    .pjd .lrail .ws .ch { color:var(--p-muted); font-size:9px;}

    .pjd .lrail .nav { padding:18px 14px 14px;}
    .pjd .lrail .nav .label { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); padding:0 8px 8px;}
    .pjd .lrail .nav .item { display:flex; align-items:center; gap:12px; padding:9px 8px; font-size:13px; color:var(--p-ink-2); border-radius:4px; cursor:pointer; position:relative;}
    .pjd .lrail .nav .item:hover { background:var(--p-card);}
    .pjd .lrail .nav .item.active { color:var(--p-ink); background:var(--p-card); font-weight:500;}
    .pjd .lrail .nav .item.active::before { content:""; position:absolute; left:-14px; top:6px; bottom:6px; width:2px; background:var(--p-accent);}
    .pjd .lrail .nav .item .ic { width:14px; height:14px; color:var(--p-muted);}
    .pjd .lrail .nav .item.active .ic { color:var(--p-ink);}
    .pjd .lrail .nav .item .badge { margin-left:auto; font-family:var(--mono); font-size:9px; padding:2px 7px; background:var(--p-accent); color:var(--p-paper); border-radius:999px;}

    .pjd .lrail .sub { margin-top:6px; border-top:1px dashed var(--p-grid); padding:14px 14px 8px;}
    .pjd .lrail .sub .label { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); padding:0 8px 8px; display:flex; justify-content:space-between;}
    .pjd .lrail .sub .label a { color:var(--p-ink-2); text-decoration:none; border-bottom:1px solid var(--p-grid); padding-bottom:1px;}
    .pjd .lrail .sub .pj { display:flex; align-items:center; gap:10px; padding:8px; border-radius:4px; cursor:pointer;}
    .pjd .lrail .sub .pj:hover { background:var(--p-card);}
    .pjd .lrail .sub .pj.active { background:var(--p-card); position:relative;}
    .pjd .lrail .sub .pj.active::before { content:""; position:absolute; left:-14px; top:6px; bottom:6px; width:2px; background:var(--p-accent);}
    .pjd .lrail .sub .pj .pip { width:8px; height:8px; border-radius:50%; flex-shrink:0;}
    .pjd .lrail .sub .pj .nm { font-size:12px; color:var(--p-ink); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
    .pjd .lrail .sub .pj.active .nm { font-weight:500;}

    .pjd .lrail .user { margin-top:auto; padding:18px 22px; border-top:1px solid var(--p-grid); display:flex; align-items:center; gap:12px;}
    .pjd .lrail .user .av { width:32px; height:32px; border-radius:50%; background:var(--p-ink); color:var(--p-paper); font-family:var(--mono); font-size:11px; display:flex; align-items:center; justify-content:center;}
    .pjd .lrail .user .nm { flex:1;}
    .pjd .lrail .user .nm .n { font-size:12px; color:var(--p-ink);}
    .pjd .lrail .user .nm .r { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted); margin-top:1px;}

    /* ===== MAIN ===== */
    .pjd .main { padding:28px 56px 64px; min-width:0;}
    .pjd .breadcrumbs { font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted); margin-bottom:18px;}
    .pjd .breadcrumbs a { color:var(--p-ink-2); text-decoration:none;}
    .pjd .breadcrumbs b { color:var(--p-ink); font-weight:500;}
    .pjd .breadcrumbs .sep { padding:0 10px; color:var(--p-grid);}

    /* ===== HEADER ===== (interior page — tightened. The breadcrumb already
       says where you are; the H1 anchors scanning but isn't the hero of the page.) */
    .pjd .phead { display:grid; grid-template-columns:auto 1fr auto; gap:20px; align-items:center; padding-bottom:18px; border-bottom:1px solid var(--p-grid);}
    .pjd .phead .pmark3 { display:flex; flex-direction:column; padding:6px 9px; border:1px solid var(--p-ink); line-height:1; height:48px; justify-content:space-between; min-width:48px;}
    .pjd .phead .pmark3 .num { font-family:var(--mono); font-size:9px; color:var(--p-muted);}
    .pjd .phead .pmark3 .sym { font-family:var(--mazius); font-size:22px; line-height:0.9;}
    .pjd .phead .ttl .ref { font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); margin-bottom:3px;}
    .pjd .phead .ttl h1 { font-family:var(--mazius); font-size:30px; line-height:1.05; letter-spacing:-0.02em; margin:0 0 4px; font-weight:400; display:inline-flex; align-items:baseline; gap:8px;}
    .pjd .phead .ttl h1 em { font-style:italic; color:var(--p-accent);}
    .pjd .phead .ttl .meta { display:flex; gap:16px; font-size:11px; color:var(--p-muted); flex-wrap:wrap; align-items:baseline;}
    .pjd .phead .ttl .meta span b { color:var(--p-ink-2); font-weight:500;}
    .pjd .phead .ttl .meta .sep { color:var(--p-grid);}
    .pjd .phead .actions { display:flex; gap:8px; align-items:center;}
    .pjd .phead .actions .it { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-info); display:inline-flex; align-items:center; gap:6px; border:1px solid var(--p-info); padding:6px 10px;}
    .pjd .phead .actions .it .dot { width:5px; height:5px; border-radius:50%; background:var(--p-info);}
    .pjd .phead .actions button { font-family:var(--mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; padding:8px 14px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); cursor:pointer;}
    .pjd .phead .actions button.ghost { background:transparent; color:var(--p-ink);}

    /* ===== PHASE INDICATOR (bar) ===== */
    .pjd .phase-bar { margin:18px 0 0; display:grid; grid-template-columns:repeat(4, 1fr); gap:0;}
    .pjd .phase-bar .ph { padding:14px 0 12px; border-top:3px solid var(--p-grid); font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); position:relative;}
    .pjd .phase-bar .ph.done { border-top-color:var(--p-ink); color:var(--p-ink-2);}
    .pjd .phase-bar .ph.now  { border-top-color:var(--p-accent); color:var(--p-accent);}
    .pjd .phase-bar .ph.now::after { content:""; position:absolute; left:0; top:-7px; width:11px; height:11px; border-radius:50%; background:var(--p-accent); box-shadow:0 0 0 4px color-mix(in oklab, var(--p-accent) 22%, transparent);}
    .pjd .phase-bar .ph .when { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.06em; margin-top:5px; text-transform:none;}
    .pjd .phase-bar .ph.now .when { color:var(--p-accent);}

    /* ===== AWAITING-YOU CALLOUT ===== */
    .pjd .alert { margin:20px 0 0; display:grid; grid-template-columns:auto 1fr auto; gap:20px; padding:14px 18px; border:1px solid var(--p-accent); background:color-mix(in oklab, var(--p-accent) 6%, var(--p-card)); align-items:center;}
    .pjd .alert .badge { font-family:var(--mono); font-size:9px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-accent); border:1px solid var(--p-accent); padding:5px 9px;}
    .pjd .alert .copy .what { font-family:var(--mazius); font-size:18px; line-height:1.1; letter-spacing:-0.005em; color:var(--p-ink); margin:0 0 2px; font-weight:400;}
    .pjd .alert .copy .sub { font-size:11px; color:var(--p-ink-2);}
    .pjd .alert .copy .sub b { color:var(--p-ink);}
    .pjd .alert .actions { display:flex; gap:6px;}
    .pjd .alert .actions button { font-family:var(--mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; padding:9px 14px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); cursor:pointer;}
    .pjd .alert .actions button.ghost { background:transparent; color:var(--p-ink);}

    /* ===== TWO COLUMN BODY ===== */
    .pjd .layout { display:grid; grid-template-columns:1fr 360px; gap:48px; margin-top:48px;}

    /* section header */
    .pjd .sec-head { display:flex; align-items:baseline; justify-content:space-between; margin:0 0 14px; padding-bottom:10px; border-bottom:1px solid var(--p-grid);}
    .pjd .sec-head .l { display:flex; align-items:baseline; gap:14px;}
    .pjd .sec-head .kk { font-family:var(--mono); font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted);}
    .pjd .sec-head h2 { font-family:var(--mono); font-size:11px; line-height:1; letter-spacing:0.18em; text-transform:uppercase; margin:0; font-weight:500; color:var(--p-ink);}
    .pjd .sec-head .all { font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-ink-2); border-bottom:1px solid var(--p-grid); padding-bottom:1px; cursor:pointer;}
    .pjd .sec-head .small { font-family:var(--mono); font-size:10px; color:var(--p-muted); letter-spacing:0.06em;}
    .pjd .sec-head .small b { color:var(--p-ink); font-weight:500;}

    .pjd .col + .col { /* nothing */ }
    .pjd .col + .sec { margin-top:48px;}

    /* ===== FORMULA TABLE ===== */
    .pjd .ftable { width:100%; border-collapse:collapse; font-size:12px; background:var(--p-card); border:1px solid var(--p-grid);}
    .pjd .ftable thead th { text-align:left; padding:11px 14px; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); font-weight:500; background:var(--p-paper-2); border-bottom:1px solid var(--p-grid);}
    .pjd .ftable thead th.r { text-align:right; font-variant-numeric:tabular-nums;}
    .pjd .ftable tbody td { padding:11px 14px; border-bottom:1px solid var(--p-grid-2); vertical-align:top;}
    .pjd .ftable tbody tr:last-child td { border-bottom:none;}
    .pjd .ftable tbody tr.phase-row td { background:var(--p-paper-2); padding:8px 14px; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted);}
    .pjd .ftable tbody tr.phase-row td b { color:var(--p-ink); font-weight:500; margin-right:10px;}
    .pjd .ftable tbody tr.hero td { background:color-mix(in oklab, var(--p-accent) 6%, var(--p-card));}
    .pjd .ftable tbody tr.hero .ing-name { color:var(--p-accent); font-weight:500;}
    .pjd .ftable .ing-name { color:var(--p-ink); font-size:13px; line-height:1.3;}
    .pjd .ftable .ing-inci { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em; margin-top:2px;}
    .pjd .ftable .pct { font-family:var(--mono); font-variant-numeric:tabular-nums; font-size:13px; color:var(--p-ink); text-align:right; font-weight:500; letter-spacing:0.02em;}
    .pjd .ftable .fn { font-size:11px; color:var(--p-ink-2);}
    .pjd .ftable .sup { font-family:var(--mono); font-size:10px; color:var(--p-ink-2); letter-spacing:0.02em;}
    .pjd .ftable .ing-note { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em; margin-top:4px; padding-left:8px; border-left:2px solid var(--p-grid);}
    .pjd .ftable tbody tr.hero .ing-note { color:var(--p-accent); border-left-color:var(--p-accent);}
    .pjd .ftable .stat-cell { display:flex; align-items:center; gap:8px;}
    .pjd .ftable .stat-cell .dot { width:6px; height:6px; border-radius:50%; flex-shrink:0;}
    .pjd .ftable .stat-cell .lbl { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase;}

    /* Δ column — what changed from v03 → v04 */
    .pjd .ftable .delta-cell { font-family:var(--mono); font-size:11px; letter-spacing:0.04em; font-variant-numeric:tabular-nums;}
    .pjd .ftable .d-same { color:var(--p-muted);}
    .pjd .ftable .d-up   { color:var(--p-warn); font-weight:500;}
    .pjd .ftable .d-down { color:var(--p-info); font-weight:500;}
    .pjd .ftable .d-up .arrow,
    .pjd .ftable .d-down .arrow { margin-right:3px; font-weight:600;}
    .pjd .ftable .d-new  { display:inline-block; font-size:9px; letter-spacing:0.18em; padding:3px 7px; background:var(--p-accent); color:var(--p-paper); font-weight:600;}
    .pjd .ftable .d-flag { display:inline-block; font-size:9px; letter-spacing:0.16em; padding:3px 7px; border:1px solid var(--p-warn); color:var(--p-warn); font-weight:500;}

    .pjd .ftable tfoot td { padding:12px 14px; font-family:var(--mono); font-size:10px; color:var(--p-ink); letter-spacing:0.04em; background:var(--p-paper-2); border-top:2px solid var(--p-ink);}
    .pjd .ftable tfoot td.r { text-align:right; font-weight:600;}

    /* SPECS · preview — own section, clickable, opens full spec sheet */
    .pjd .specs { border:1px solid var(--p-grid); background:var(--p-card); cursor:pointer; transition:border-color .15s, background .15s; position:relative;}
    .pjd .specs:hover { border-color:var(--p-ink);}
    .pjd .specs:hover .specs-foot .open { color:var(--p-accent);}
    .pjd .specs .specs-grid { display:grid; grid-template-columns:repeat(5, 1fr); gap:0;}
    .pjd .specs .it { padding:18px 20px 16px; border-right:1px solid var(--p-grid-2); position:relative; transition:background .15s;}
    .pjd .specs .it:last-child { border-right:none;}
    .pjd .specs .it:hover { background:var(--p-paper-2);}
    .pjd .specs .it .l { font-family:var(--mono); font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:var(--p-muted); margin-bottom:8px;}
    .pjd .specs .it .v { font-family:var(--mono); font-size:18px; color:var(--p-ink); font-weight:500; letter-spacing:0.01em; line-height:1.1;}
    .pjd .specs .it .v small { font-family:var(--mono); font-size:10px; color:var(--p-muted); display:block; margin-top:4px; letter-spacing:0.04em;}
    .pjd .specs .it .pass { display:inline-flex; align-items:center; gap:5px; font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-ok); margin-top:6px;}
    .pjd .specs .it .pass .dot { width:5px; height:5px; border-radius:50%; background:var(--p-ok);}
    .pjd .specs .specs-foot { display:flex; justify-content:space-between; align-items:center; padding:11px 20px; border-top:1px dashed var(--p-grid); background:var(--p-paper-2); font-family:var(--mono); font-size:10px; letter-spacing:0.06em; color:var(--p-muted);}
    .pjd .specs .specs-foot b { color:var(--p-ink); font-weight:500;}
    .pjd .specs .specs-foot .open { color:var(--p-ink-2); letter-spacing:0.16em; text-transform:uppercase; transition:color .15s;}

    /* ===== BATCH TRACK ===== */
    .pjd .btrack { border:1px solid var(--p-grid); background:var(--p-card);}
    .pjd .btrack .hd { display:grid; grid-template-columns:60px 80px 1fr 90px 90px 1fr; gap:14px; padding:11px 16px; background:var(--p-paper-2); border-bottom:1px solid var(--p-grid); font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted);}
    .pjd .btrack .row { display:grid; grid-template-columns:60px 80px 1fr 90px 90px 1fr; gap:14px; padding:14px 16px; border-bottom:1px solid var(--p-grid-2); align-items:baseline;}
    .pjd .btrack .row:last-child { border-bottom:none;}
    .pjd .btrack .row.curr { background:color-mix(in oklab, var(--p-accent) 5%, transparent);}
    .pjd .btrack .row .id { font-family:var(--mono); font-size:11px; color:var(--p-ink); letter-spacing:0.04em; font-weight:500;}
    .pjd .btrack .row .kind { font-family:var(--mono); font-size:10px; color:var(--p-ink-2); letter-spacing:0.04em;}
    .pjd .btrack .row .size { font-family:var(--mono); font-size:11px; color:var(--p-ink); letter-spacing:0.02em;}
    .pjd .btrack .row .on { font-family:var(--mono); font-size:11px; color:var(--p-ink-2); letter-spacing:0.02em;}
    .pjd .btrack .row .dev { font-family:var(--mono); font-size:11px; color:var(--p-ink); letter-spacing:0.02em;}
    .pjd .btrack .row .res { font-size:12px; color:var(--p-ink-2);}
    .pjd .btrack .row.curr .res { color:var(--p-accent);}
    .pjd .btrack .row.curr .res::before { content:"▸ "; color:var(--p-accent);}

    /* ===== ACTIVITY ===== */
    .pjd .feed { border:1px solid var(--p-grid); background:var(--p-card);}
    .pjd .feed .row { display:grid; grid-template-columns:90px 1fr auto 16px; gap:14px; padding:13px 18px; border-bottom:1px solid var(--p-grid-2); align-items:baseline;}
    .pjd .feed .row:last-child { border-bottom:none;}
    .pjd .feed .row .t { font-family:var(--mono); font-size:10px; color:var(--p-muted); letter-spacing:0.06em;}
    .pjd .feed .row .ev { font-size:13px; color:var(--p-ink);}
    .pjd .feed .row .ref { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em;}
    .pjd .feed .row .pip { width:6px; height:6px; border-radius:50%;}
    .pjd .feed .row .pip.ok { background:var(--p-ok);}
    .pjd .feed .row .pip.warn { background:var(--p-warn);}
    .pjd .feed .row .pip.info { background:var(--p-info);}

    /* ===== RIGHT COLUMN ===== */
    .pjd .rcol { display:flex; flex-direction:column; gap:36px;}

    /* facts card */
    .pjd .facts { border:1px solid var(--p-grid); background:var(--p-card);}
    .pjd .facts .it { padding:13px 18px; border-bottom:1px solid var(--p-grid-2); display:flex; justify-content:space-between; align-items:baseline; gap:14px;}
    .pjd .facts .it:last-child { border-bottom:none;}
    .pjd .facts .it .l { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); flex-shrink:0;}
    .pjd .facts .it .v { font-size:12px; color:var(--p-ink); text-align:right; line-height:1.35;}
    .pjd .facts .it .v small { font-family:var(--mono); color:var(--p-muted); display:block; font-size:10px; margin-top:2px;}

    /* messages */
    .pjd .thread { border:1px solid var(--p-grid); background:var(--p-card);}
    .pjd .thread .who { display:flex; align-items:center; justify-content:space-between; padding:14px 18px 12px; border-bottom:1px solid var(--p-grid-2);}
    .pjd .thread .who .l { display:flex; align-items:center; gap:10px;}
    .pjd .thread .who .av { width:28px; height:28px; border-radius:50%; background:var(--p-info); color:var(--p-paper); font-family:var(--mono); font-size:10px; display:flex; align-items:center; justify-content:center;}
    .pjd .thread .who .nm { font-size:13px; color:var(--p-ink); line-height:1.2;}
    .pjd .thread .who .nm small { display:block; font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted); margin-top:2px;}
    .pjd .thread .who .stat { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-ok); display:inline-flex; align-items:center; gap:6px;}

    .pjd .thread .msgs { padding:18px;}
    .pjd .thread .m { padding:12px 14px; margin-bottom:10px; border:1px solid var(--p-grid); background:var(--p-paper);}
    .pjd .thread .m.mine { background:var(--p-paper-2); margin-left:24px; border-color:var(--p-grid);}
    .pjd .thread .m .h { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px;}
    .pjd .thread .m .h .n { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-ink); font-weight:500;}
    .pjd .thread .m .h .w { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em;}
    .pjd .thread .m .b { font-size:12px; line-height:1.5; color:var(--p-ink-2);}

    .pjd .thread .composer { display:flex; gap:0; padding:14px 18px; border-top:1px solid var(--p-grid-2); background:var(--p-paper-2); align-items:center;}
    .pjd .thread .composer input { flex:1; height:36px; padding:0 12px; border:1px solid var(--p-grid); background:var(--p-paper); color:var(--p-ink); font-family:var(--sans); font-size:12px; border-radius:0;}
    .pjd .thread .composer button { height:36px; padding:0 16px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; cursor:pointer; border-left:none;}

    /* ===== DOCS ===== */
    .pjd .docstrip { display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;}
    .pjd .doc { padding:16px 18px; border:1px solid var(--p-grid); background:var(--p-card); display:flex; flex-direction:column; gap:10px; cursor:pointer; transition:border-color .15s;}
    .pjd .doc:hover { border-color:var(--p-ink);}
    .pjd .doc.hot { border-color:var(--p-accent);}
    .pjd .doc .top { display:flex; justify-content:space-between; align-items:center;}
    .pjd .doc .kind { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; color:var(--p-muted); padding:3px 7px; border:1px solid var(--p-grid);}
    .pjd .doc .when { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.06em;}
    .pjd .doc .nm { font-size:13px; line-height:1.3; color:var(--p-ink); flex:1;}
    .pjd .doc .ft { display:flex; justify-content:space-between; align-items:baseline; font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase;}
    .pjd .doc .ft .sz { color:var(--p-muted);}
    .pjd .doc .ft .sig { color:var(--p-ok);}
    .pjd .doc .ft .sig.pending { color:var(--p-accent);}
    .pjd .doc .ft .sig.draft { color:var(--p-info);}
    .pjd .doc .ft .sig.dash { color:var(--p-muted);}
  `;

  return (
    <div className="pf pjd" style={{...tokens}} data-screen-label="Project · PLX-2614 · Niacinamide 5%">
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
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="2" width="4" height="4"/><rect x="8" y="2" width="4" height="4"/><rect x="2" y="8" width="4" height="4"/><rect x="8" y="8" width="4" height="4"/></svg>Workbench</div>
          <div className="item active"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="3" width="10" height="8"/><line x1="2" y1="6" x2="12" y2="6"/></svg>Projects<span className="badge">3</span></div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 8l3 3 7-7"/></svg>Approvals<span className="badge">3</span></div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 2h6l3 3v7H3z"/><path d="M9 2v3h3"/></svg>Documents</div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 4h10v6H4l-2 2z"/></svg>Messages<span className="badge">2</span></div>
          <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="4" width="10" height="7"/><line x1="2" y1="6" x2="12" y2="6"/></svg>Billing</div>
        </nav>

        <div className="sub">
          <div className="label"><span>Active projects</span><a>All →</a></div>
          {projects.map((p) => (
            <div key={p.code} className={`pj ${p.current?'active':''}`}>
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
        <div className="breadcrumbs">
          <a>Lab</a><span className="sep">/</span>
          <a>Workbench</a><span className="sep">/</span>
          <a>Projects</a><span className="sep">/</span>
          <b>{project.code}</b>
        </div>

        {/* ===== HEADER ===== (interior — tightened) */}
        <div className="phead">
          <div className="pmark3"><span className="num">{project.num}</span><span className="sym">{project.sym}</span></div>
          <div className="ttl">
            <div className="ref">{project.code} · {project.brand}</div>
            <h1>Niacinamide 5% <em>Serum.</em></h1>
            <div className="meta">
              <span>Formulator · <b>{project.formulator}</b></span>
              <span className="sep">·</span>
              <span>Iteration · <b>{project.iteration}</b></span>
              <span className="sep">·</span>
              <span>Started · <b>{project.started}</b></span>
            </div>
          </div>
          <div className="actions">
            <span className="it"><span className="dot"/>AT THE BENCH</span>
            <button>Sign v04</button>
            <button className="ghost">Message</button>
          </div>
        </div>

        {/* ===== PHASE BAR ===== */}
        <div className="phase-bar">
          {[
            {id:'brief', label:'Brief'},
            {id:'bench', label:'Bench'},
            {id:'floor', label:'Floor'},
            {id:'dock',  label:'Dock'},
          ].map((p, i, all) => {
            const idx = all.findIndex(x => x.id === project.phase);
            const state = i < idx ? 'done' : i === idx ? 'now' : 'todo';
            return (
              <div key={p.id} className={`ph ${state}`}>
                {p.label}
                <div className="when">{phaseDates[p.id]}</div>
              </div>
            );
          })}
        </div>

        {/* ===== AWAITING-YOU CALLOUT ===== */}
        <div className="alert">
          <span className="badge">Awaiting you · today</span>
          <div className="copy">
            <h3 className="what">Formula v04 — sign-off</h3>
            <div className="sub">Maya posted Pilot 04 results <b>2 hours ago</b>. Glide improved, viscosity nominal. Sign to release the panel pulls and unblock tech transfer.</div>
          </div>
          <div className="actions">
            <button>Review &amp; sign</button>
            <button className="ghost">Defer</button>
          </div>
        </div>

        {/* ===== BODY: TWO COLUMN ===== */}
        <div className="layout">
          {/* LEFT COLUMN */}
          <div className="col">
            {/* SPECS · preview — lifted out of formula; own section, clickable. */}
            <div className="sec-head">
              <div className="l">
                <span className="kk">/ 001</span>
                <h2>Specs · preview</h2>
              </div>
              <span className="all">Full spec sheet →</span>
            </div>

            <div className="specs" role="button" tabIndex="0">
              <div className="specs-grid">
                <div className="it">
                  <div className="l">pH</div>
                  <div className="v">5.62<small>target 5.4–5.8</small></div>
                  <span className="pass"><span className="dot"/>In window</span>
                </div>
                <div className="it">
                  <div className="l">Viscosity</div>
                  <div className="v">4,200<small>cP @ 25°C</small></div>
                  <span className="pass"><span className="dot"/>Nominal</span>
                </div>
                <div className="it">
                  <div className="l">Density</div>
                  <div className="v">1.018<small>g/mL</small></div>
                  <span className="pass"><span className="dot"/>Pass</span>
                </div>
                <div className="it">
                  <div className="l">Stability</div>
                  <div className="v">4 wk<small>40°C accelerated</small></div>
                  <span className="pass"><span className="dot"/>Pass</span>
                </div>
                <div className="it">
                  <div className="l">PIF status</div>
                  <div className="v">Draft<small>EU + UK · due 06.18</small></div>
                  <span className="pass" style={{color:'var(--p-info)'}}><span className="dot" style={{background:'var(--p-info)'}}/>In progress</span>
                </div>
              </div>
              <div className="specs-foot">
                <span><b>5</b> highlights · <b>14</b> more parameters in the spec sheet · organoleptic, microbial, heavy metals, packaging compat …</span>
                <span className="open">Open spec sheet →</span>
              </div>
            </div>

            {/* FORMULA */}
            <div className="sec-head" style={{marginTop:48}}>
              <div className="l">
                <span className="kk">/ 002</span>
                <h2>Formula · v04 · for review</h2>
              </div>
              <span className="small">Last edit · <b>T-12:55</b> · Maya A.</span>
            </div>

            <table className="ftable">
              <thead>
                <tr>
                  <th style={{width:'34%'}}>Ingredient</th>
                  <th className="r" style={{width:'80px'}}>w/w %</th>
                  <th style={{width:'18%'}}>Function</th>
                  <th style={{width:'22%'}}>Supplier</th>
                  <th style={{width:'18%'}}>Δ v03 → v04</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let lastPhase = null;
                  const rows = [];
                  formula.forEach((row, i) => {
                    if (row.phase !== lastPhase) {
                      rows.push(
                        <tr key={`p-${row.phase}`} className="phase-row">
                          <td colSpan="5"><b>Phase {row.phase}</b> · {row.phase==='A'?'water':row.phase==='B'?'thickener':row.phase==='C'?'actives':'preservatives + adjust'}</td>
                        </tr>
                      );
                      lastPhase = row.phase;
                    }
                    rows.push(
                      <tr key={i} className={row.hero ? 'hero' : ''}>
                        <td>
                          <div className="ing-name">{row.ing}</div>
                          <div className="ing-inci">INCI · {row.inci}</div>
                          {row.note && <div className="ing-note">{row.note}</div>}
                        </td>
                        <td className="pct">{row.pct}</td>
                        <td className="fn">{row.fn}</td>
                        <td className="sup">{row.supplier}</td>
                        <td className="delta-cell">{renderDelta(row)}</td>
                      </tr>
                    );
                  });
                  return rows;
                })()}
              </tbody>
              <tfoot>
                <tr>
                  <td>12 ingredients · 4 phases</td>
                  <td className="r">100.00</td>
                  <td colSpan="3" style={{textAlign:'right', color:'var(--p-muted)', fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.04em'}}><span style={{color:'var(--p-warn)'}}>2 ↑</span> · <span style={{color:'var(--p-info)'}}>1 ↓</span> · <span style={{color:'var(--p-accent)'}}>1 new</span> · <span style={{color:'var(--p-warn)'}}>1 supplier flag</span> · 8 unchanged</td>
                </tr>
              </tfoot>
            </table>

            {/* BATCH HISTORY */}
            <div className="sec-head" style={{marginTop:48}}>
              <div className="l">
                <span className="kk">/ 003</span>
                <h2>Batch history · 4 runs</h2>
              </div>
              <span className="small">Tech transfer · <b>queued vendor 12</b></span>
            </div>
            <div className="btrack">
              <div className="hd">
                <span>ID</span>
                <span>Kind</span>
                <span>Size</span>
                <span>On</span>
                <span>Dev.</span>
                <span>Result</span>
              </div>
              {batches.map(b => (
                <div key={b.id} className={`row ${b.current?'curr':''}`}>
                  <span className="id">{b.id}</span>
                  <span className="kind">{b.kind}</span>
                  <span className="size">{b.size}</span>
                  <span className="on">{b.on}</span>
                  <span className="dev">{b.dev}</span>
                  <span className="res">{b.res}</span>
                </div>
              ))}
            </div>

            {/* DOCUMENTS */}
            <div className="sec-head" style={{marginTop:48}}>
              <div className="l">
                <span className="kk">/ 004</span>
                <h2>Documents · 6</h2>
              </div>
              <span className="all">All files →</span>
            </div>
            <div className="docstrip">
              {docs.map((d, i) => (
                <div key={i} className={`doc ${d.hot?'hot':''}`}>
                  <div className="top">
                    <span className="kind">{d.kind}</span>
                    <span className="when">{d.when}</span>
                  </div>
                  <div className="nm">{d.name}</div>
                  <div className="ft">
                    <span className="sz">{d.size}</span>
                    <span className={`sig ${d.sig==='pending'?'pending':d.sig==='draft'?'draft':d.sig==='—'?'dash':''}`}>
                      {d.sig==='signed'?'✓ Signed':d.sig==='pending'?'● Pending':d.sig==='draft'?'Draft':d.sig}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ACTIVITY */}
            <div className="sec-head" style={{marginTop:48}}>
              <div className="l">
                <span className="kk">/ 005</span>
                <h2>Activity · this project</h2>
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
          </div>

          {/* RIGHT COLUMN */}
          <aside className="rcol">
            {/* FACTS */}
            <div>
              <div className="sec-head">
                <div className="l">
                  <span className="kk">/ A</span>
                  <h2>Project facts</h2>
                </div>
              </div>
              <div className="facts">
                <div className="it"><span className="l">Brand</span><span className="v">{project.brand}</span></div>
                <div className="it"><span className="l">Started</span><span className="v">{project.started}</span></div>
                <div className="it"><span className="l">Target dock</span><span className="v">{project.targetDock}<small>14 weeks out</small></span></div>
                <div className="it"><span className="l">Batch · run 1</span><span className="v">{project.batchSize}</span></div>
                <div className="it"><span className="l">Fill</span><span className="v">{project.fillFormat}</span></div>
                <div className="it"><span className="l">Markets</span><span className="v">EU · UK · CA<small>+ US (Q3)</small></span></div>
                <div className="it"><span className="l">Reg path</span><span className="v">PIF + CPNP<small>RP · PLX Toronto</small></span></div>
                <div className="it"><span className="l">Pricing model</span><span className="v">Co-development<small>15% royalty · 5 yr</small></span></div>
              </div>
            </div>

            {/* MESSAGES */}
            <div>
              <div className="sec-head">
                <div className="l">
                  <span className="kk">/ B</span>
                  <h2>Bench thread</h2>
                </div>
                <span className="small"><b>3</b> today</span>
              </div>
              <div className="thread">
                <div className="who">
                  <div className="l">
                    <span className="av">MA</span>
                    <span className="nm">Maya A.<small>{project.formulatorFull.split(' · ')[1]}</small></span>
                  </div>
                  <span className="stat"><span className="pulse" style={{background:'var(--p-ok)'}}/>Online</span>
                </div>
                <div className="msgs">
                  {messages.map((m, i) => (
                    <div key={i} className={`m ${m.mine?'mine':''}`}>
                      <div className="h"><span className="n">{m.who}</span><span className="w">{m.when}</span></div>
                      <div className="b">{m.body}</div>
                    </div>
                  ))}
                </div>
                <div className="composer">
                  <input placeholder="Reply to the bench…"/>
                  <button>Send</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

window.PortalProjectDetail = PortalProjectDetail;
