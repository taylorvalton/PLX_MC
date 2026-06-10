/* =========================================================================
   PORTAL · SIGN-OFF · STYLES
   The notarial register: paper, hairlines, generous gutters, justified
   register where it works, mono kickers, Mazius display only at section
   openings. The deed feels like a thing you'd archive in a folder.
   ========================================================================= */

function SignoffStyles() {
  const css = `
    .psd { width:1440px; min-height:1700px; background:var(--p-paper); display:grid; grid-template-columns:260px 1fr;}

    /* ===== LEFT RAIL ===== (matches project detail / single-rail wb) */
    .psd .lrail { background:var(--p-paper-2); border-right:1px solid var(--p-grid); display:flex; flex-direction:column; min-height:1700px;}
    .psd .lrail .top { padding:24px 22px 18px; border-bottom:1px solid var(--p-grid);}
    .psd .lrail .top img { height:22px; display:block; margin-bottom:18px;}
    .psd .lrail .ws { display:flex; align-items:center; gap:10px; padding:10px 12px; border:1px solid var(--p-grid); border-radius:4px; background:var(--p-card); cursor:pointer;}
    .psd .lrail .ws .av { width:22px; height:22px; border-radius:50%; background:var(--p-accent); color:var(--p-paper); font-size:10px; font-family:var(--mono); display:flex; align-items:center; justify-content:center;}
    .psd .lrail .ws .nm { flex:1; font-size:12px; line-height:1.2;}
    .psd .lrail .ws .nm .b { color:var(--p-ink); font-weight:500;}
    .psd .lrail .ws .nm .s { color:var(--p-muted); font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; margin-top:1px;}
    .psd .lrail .ws .ch { color:var(--p-muted); font-size:9px;}

    .psd .lrail .nav { padding:18px 14px 14px;}
    .psd .lrail .nav .label { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); padding:0 8px 8px;}
    .psd .lrail .nav .item { display:flex; align-items:center; gap:12px; padding:9px 8px; font-size:13px; color:var(--p-ink-2); border-radius:4px; cursor:pointer; position:relative;}
    .psd .lrail .nav .item:hover { background:var(--p-card);}
    .psd .lrail .nav .item.active { color:var(--p-ink); background:var(--p-card); font-weight:500;}
    .psd .lrail .nav .item.active::before { content:""; position:absolute; left:-14px; top:6px; bottom:6px; width:2px; background:var(--p-accent);}
    .psd .lrail .nav .item .ic { width:14px; height:14px; color:var(--p-muted);}
    .psd .lrail .nav .item.active .ic { color:var(--p-ink);}
    .psd .lrail .nav .item .badge { margin-left:auto; font-family:var(--mono); font-size:9px; padding:2px 7px; background:var(--p-accent); color:var(--p-paper); border-radius:999px;}

    .psd .lrail .sub { margin-top:6px; border-top:1px dashed var(--p-grid); padding:14px 14px 8px;}
    .psd .lrail .sub .label { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); padding:0 8px 8px; display:flex; justify-content:space-between;}
    .psd .lrail .sub .label a { color:var(--p-ink-2); text-decoration:none; border-bottom:1px solid var(--p-grid); padding-bottom:1px;}
    .psd .lrail .sub .pj { display:flex; align-items:center; gap:10px; padding:8px; border-radius:4px; cursor:pointer;}
    .psd .lrail .sub .pj:hover { background:var(--p-card);}
    .psd .lrail .sub .pj.active { background:var(--p-card); position:relative;}
    .psd .lrail .sub .pj.active::before { content:""; position:absolute; left:-14px; top:6px; bottom:6px; width:2px; background:var(--p-accent);}
    .psd .lrail .sub .pj .pip { width:8px; height:8px; border-radius:50%; flex-shrink:0;}
    .psd .lrail .sub .pj .nm { font-size:12px; color:var(--p-ink); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
    .psd .lrail .sub .pj.active .nm { font-weight:500;}

    .psd .lrail .user { margin-top:auto; padding:18px 22px; border-top:1px solid var(--p-grid); display:flex; align-items:center; gap:12px;}
    .psd .lrail .user .av { width:32px; height:32px; border-radius:50%; background:var(--p-ink); color:var(--p-paper); font-family:var(--mono); font-size:11px; display:flex; align-items:center; justify-content:center;}
    .psd .lrail .user .nm { flex:1;}
    .psd .lrail .user .nm .n { font-size:12px; color:var(--p-ink);}
    .psd .lrail .user .nm .r { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted); margin-top:1px;}

    /* ===== MAIN ===== */
    .psd .main { padding:28px 0 0; min-width:0; display:flex; flex-direction:column; align-items:stretch;}
    .psd .breadcrumbs { font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted); margin:0 56px 18px;}
    .psd .breadcrumbs a { color:var(--p-ink-2); text-decoration:none;}
    .psd .breadcrumbs b { color:var(--p-ink); font-weight:500;}
    .psd .breadcrumbs .sep { padding:0 10px; color:var(--p-grid);}

    /* ===== DEED · the document chassis ===== */
    /* The deed itself sits in a measured column inside the main pane,
       evoking a folio. We hold the column tight so the eye reads it as
       a document, not a dashboard. */
    .psd .deed { width:1100px; box-sizing:border-box; margin:0 auto 0; padding:48px 64px 64px; background:var(--p-card); border:1px solid var(--p-grid); border-bottom:none; position:relative;}
    .psd .deed::before, .psd .deed::after { content:""; position:absolute; left:0; right:0; height:1px; background:var(--p-grid);}
    .psd .deed::before { top:8px;}
    .psd .deed::after  { top:0;}

    /* corner ticks for the chassis */
    .psd .deed .chassis-tick { position:absolute; width:14px; height:14px; border:1px solid var(--p-grid);}
    .psd .deed .chassis-tick.tl { top:-1px; left:-1px; border-right:0; border-bottom:0;}
    .psd .deed .chassis-tick.tr { top:-1px; right:-1px; border-left:0; border-bottom:0;}

    /* ===== HEADER · the writ ===== */
    .psd .writ { display:grid; grid-template-columns:auto 1fr auto; gap:32px; padding-bottom:28px; border-bottom:1px solid var(--p-ink); align-items:start;}
    .psd .writ .pmark3 { display:flex; flex-direction:column; padding:8px 10px; border:1px solid var(--p-ink); line-height:1; height:64px; width:64px; justify-content:space-between; background:transparent;}
    .psd .writ .pmark3 .num { font-family:var(--mono); font-size:9px; letter-spacing:0.08em; color:var(--p-muted);}
    .psd .writ .pmark3 .sym { font-family:var(--mazius); font-size:32px; line-height:0.9; align-self:flex-end;}
    .psd .writ .body .kicker { font-family:var(--mono); font-size:10px; letter-spacing:0.24em; text-transform:uppercase; color:var(--p-accent); margin-bottom:10px;}
    .psd .writ h1 { font-family:var(--mazius); font-size:54px; line-height:0.98; letter-spacing:-0.025em; margin:0 0 6px; font-weight:400;}
    .psd .writ h1 em { font-style:italic; color:var(--p-accent);}
    .psd .writ .sub { font-family:var(--mazius); font-style:italic; font-size:18px; color:var(--p-ink-2); line-height:1.4;}
    .psd .writ .sub b { font-style:normal; color:var(--p-ink); font-weight:400;}

    /* deed metadata block — feels like a stamp */
    .psd .writ .stamp { display:flex; flex-direction:column; gap:6px; min-width:240px; padding:14px 16px; border:1px solid var(--p-grid); background:var(--p-paper-2); font-family:var(--mono); font-size:10px; line-height:1.55; letter-spacing:0.04em;}
    .psd .writ .stamp .row { display:grid; grid-template-columns:80px 1fr; gap:10px; align-items:baseline;}
    .psd .writ .stamp .row .l { color:var(--p-muted); letter-spacing:0.16em; text-transform:uppercase; font-size:9px;}
    .psd .writ .stamp .row .v { color:var(--p-ink);}
    .psd .writ .stamp .row .v b { color:var(--p-ink); font-weight:500;}

    /* ===== DOSSIER · ledger of artefacts ===== */
    .psd .dossier { margin:36px 0 0; padding:24px 28px; border:1px solid var(--p-grid); background:var(--p-paper-2);}
    .psd .dossier .head { display:flex; justify-content:space-between; align-items:baseline; padding-bottom:16px; border-bottom:1px dashed var(--p-grid);}
    .psd .dossier .head .l { display:flex; align-items:baseline; gap:14px;}
    .psd .dossier .head h2 { font-family:var(--mono); font-size:11px; line-height:1; letter-spacing:0.20em; text-transform:uppercase; margin:0; font-weight:500; color:var(--p-ink);}
    .psd .dossier .head .small { font-family:var(--mono); font-size:10px; color:var(--p-muted); letter-spacing:0.06em;}
    .psd .dossier .head .small b { color:var(--p-ink); font-weight:500;}
    .psd .dossier ol { list-style:none; margin:0; padding:0; display:grid; grid-template-columns:1fr 1fr; column-gap:36px;}
    .psd .dossier ol li { display:grid; grid-template-columns:32px 40px 1fr auto; column-gap:12px; padding:11px 0; border-bottom:1px dotted var(--p-grid); align-items:baseline;}
    .psd .dossier ol li:last-child, .psd .dossier ol li:nth-last-child(2) { border-bottom:none;}
    .psd .dossier ol li .ix { font-family:var(--mazius); font-style:italic; font-size:14px; color:var(--p-muted);}
    .psd .dossier ol li .ref { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.14em; text-transform:uppercase;}
    .psd .dossier ol li .nm { font-size:13px; color:var(--p-ink);}
    .psd .dossier ol li.heart .nm { font-weight:500;}
    .psd .dossier ol li .nm small { display:block; font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em; margin-top:2px;}
    .psd .dossier ol li .stat { display:inline-flex; align-items:center; justify-content:center; min-width:96px; height:24px; box-sizing:border-box; font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; padding:0 10px; border:1px solid var(--p-grid); white-space:nowrap;}
    .psd .dossier ol li .stat.reviewed { color:var(--p-ok); border-color:var(--p-ok);}
    .psd .dossier ol li .stat.pending  { color:var(--p-warn); border-color:var(--p-warn);}
    .psd .dossier ol li .stat.flag     { color:var(--p-accent); border-color:var(--p-accent);}
    .psd .dossier ol li .stat.na       { color:var(--p-muted); border-color:var(--p-grid);}

    /* ===== SECTIONS · article-like rhythm ===== */
    .psd .article { margin-top:56px;}
    .psd .article .ahd { display:flex; align-items:baseline; justify-content:space-between; padding-bottom:14px; border-bottom:1px solid var(--p-ink); margin-bottom:24px;}
    .psd .article .ahd .l { display:flex; align-items:baseline; gap:18px;}
    .psd .article .ahd .ix { font-family:var(--mazius); font-style:italic; font-size:32px; line-height:1; color:var(--p-accent); font-weight:400;}
    .psd .article .ahd h2 { font-family:var(--mazius); font-size:28px; line-height:1; letter-spacing:-0.015em; margin:0; font-weight:400;}
    .psd .article .ahd h2 em { font-style:italic; color:var(--p-accent);}
    .psd .article .ahd .actions { display:flex; gap:10px; align-items:center;}
    .psd .article .ahd .actions .review-btn { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; padding:6px 10px; border:1px solid var(--p-ok); color:var(--p-ok); background:transparent; cursor:pointer; display:inline-flex; align-items:center; gap:6px;}
    .psd .article .ahd .actions .review-btn .check { width:9px; height:9px;}
    .psd .article .ahd .actions .skip { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted); cursor:pointer; border-bottom:1px solid var(--p-grid);}

    .psd .article .lede { font-family:var(--mazius); font-style:italic; font-size:18px; line-height:1.45; color:var(--p-ink-2); max-width:680px; margin:0 0 24px; letter-spacing:-0.005em;}
    .psd .article .lede em { color:var(--p-accent);}

    /* ===== BRIEF DIFF table ===== */
    .psd .brief-diff { display:grid; grid-template-columns:1fr 1fr; gap:0; border:1px solid var(--p-grid); background:var(--p-paper);}
    .psd .brief-diff .row { display:contents;}
    .psd .brief-diff .cell { padding:18px 22px; border-bottom:1px solid var(--p-grid-2); border-right:1px solid var(--p-grid-2);}
    .psd .brief-diff .cell:nth-child(2n) { border-right:none;}
    .psd .brief-diff .row:last-child .cell { border-bottom:none;}
    .psd .brief-diff .cell.head { padding:10px 22px; background:var(--p-paper-2); font-family:var(--mono); font-size:9px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-muted); font-weight:500;}
    .psd .brief-diff .cell .ask-l { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted); margin-bottom:6px;}
    .psd .brief-diff .cell.asked .body { font-size:13.5px; line-height:1.5; color:var(--p-ink-2);}
    .psd .brief-diff .cell.delivered .body { font-size:13.5px; line-height:1.5; color:var(--p-ink); display:flex; gap:10px; align-items:flex-start;}
    .psd .brief-diff .cell.delivered .body .check { width:14px; height:14px; flex-shrink:0; margin-top:3px;}
    .psd .brief-diff .cell.delivered .body .check.ok    { color:var(--p-ok);}
    .psd .brief-diff .cell.delivered .body .check.fail  { color:var(--p-hot);}
    .psd .brief-diff .cell.delivered .body .flag-tag { width:auto; height:auto; margin:4px 0 0; padding:2px 6px; font-family:var(--mono); font-size:8.5px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-accent); border:1px solid var(--p-accent); background:transparent; align-self:flex-start; line-height:1.2;}
    .psd .brief-diff .cell.delivered .note { font-family:var(--mono); font-size:9px; color:var(--p-accent); letter-spacing:0.06em; margin-top:8px; padding-left:24px; text-transform:lowercase;}

    /* ===== FORMULA · same vocabulary as project detail ===== */
    .psd .ftable { width:100%; border-collapse:collapse; font-size:12px; background:var(--p-paper); border:1px solid var(--p-grid);}
    .psd .ftable thead th { text-align:left; padding:11px 14px; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); font-weight:500; background:var(--p-paper-2); border-bottom:1px solid var(--p-grid);}
    .psd .ftable thead th.r { text-align:right; font-variant-numeric:tabular-nums;}
    .psd .ftable tbody td { padding:11px 14px; border-bottom:1px solid var(--p-grid-2); vertical-align:top;}
    .psd .ftable tbody tr:last-child td { border-bottom:none;}
    .psd .ftable tbody tr.phase-row td { background:var(--p-paper-2); padding:8px 14px; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted);}
    .psd .ftable tbody tr.phase-row td b { color:var(--p-ink); font-weight:500; margin-right:10px;}
    .psd .ftable tbody tr.hero td { background:color-mix(in oklab, var(--p-accent) 6%, var(--p-paper));}
    .psd .ftable tbody tr.hero .ing-name { color:var(--p-accent); font-weight:500;}
    .psd .ftable .ing-name { color:var(--p-ink); font-size:13px; line-height:1.3;}
    .psd .ftable .ing-inci { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em; margin-top:2px;}
    .psd .ftable .pct { font-family:var(--mono); font-variant-numeric:tabular-nums; font-size:13px; color:var(--p-ink); text-align:right; font-weight:500; letter-spacing:0.02em;}
    .psd .ftable .fn { font-size:11px; color:var(--p-ink-2);}
    .psd .ftable .sup { font-family:var(--mono); font-size:10px; color:var(--p-ink-2); letter-spacing:0.02em;}
    .psd .ftable .ing-note { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em; margin-top:4px; padding-left:8px; border-left:2px solid var(--p-grid);}
    .psd .ftable tbody tr.hero .ing-note { color:var(--p-accent); border-left-color:var(--p-accent);}

    .psd .ftable .delta-cell { font-family:var(--mono); font-size:11px; letter-spacing:0.04em; font-variant-numeric:tabular-nums;}
    .psd .ftable .d-same { color:var(--p-muted);}
    .psd .ftable .d-up   { color:var(--p-warn); font-weight:500;}
    .psd .ftable .d-down { color:var(--p-info); font-weight:500;}
    .psd .ftable .d-up .arrow,
    .psd .ftable .d-down .arrow { margin-right:3px; font-weight:600;}
    .psd .ftable .d-new  { display:inline-block; font-size:9px; letter-spacing:0.18em; padding:3px 7px; background:var(--p-accent); color:var(--p-paper); font-weight:600;}
    .psd .ftable .d-flag { display:inline-block; font-size:9px; letter-spacing:0.16em; padding:3px 7px; border:1px solid var(--p-warn); color:var(--p-warn); font-weight:500;}

    .psd .ftable tfoot td { padding:12px 14px; font-family:var(--mono); font-size:10px; color:var(--p-ink); letter-spacing:0.04em; background:var(--p-paper-2); border-top:2px solid var(--p-ink);}
    .psd .ftable tfoot td.r { text-align:right; font-weight:600;}

    /* per-row comment chip — sets up the "request changes" pathway */
    .psd .ftable .row-actions { display:flex; flex-direction:column; gap:4px; align-items:flex-end;}
    .psd .ftable .cmt-chip { display:inline-flex; align-items:center; gap:5px; font-family:var(--mono); font-size:9px; letter-spacing:0.06em; padding:3px 7px; border:1px solid var(--p-grid); color:var(--p-ink-2); cursor:pointer; white-space:nowrap;}
    .psd .ftable .cmt-chip.has { color:var(--p-accent); border-color:var(--p-accent);}
    .psd .ftable .cmt-chip .ic { width:9px; height:9px;}
    .psd .ftable .cmt-add { font-family:var(--mono); font-size:9px; letter-spacing:0.06em; color:var(--p-muted); cursor:pointer; white-space:nowrap;}

    /* ===== SPECS strip ===== */
    .psd .specs { display:grid; grid-template-columns:repeat(5, 1fr); gap:0; border:1px solid var(--p-grid); background:var(--p-paper);}
    .psd .specs .it { padding:18px 20px 16px; border-right:1px solid var(--p-grid-2);}
    .psd .specs .it:last-child { border-right:none;}
    .psd .specs .it .l { font-family:var(--mono); font-size:9px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-muted); margin-bottom:8px;}
    .psd .specs .it .v { font-family:var(--mono); font-size:18px; color:var(--p-ink); font-weight:500; letter-spacing:0.01em; line-height:1.1;}
    .psd .specs .it .v small { font-family:var(--mono); font-size:10px; color:var(--p-muted); display:block; margin-top:4px; letter-spacing:0.04em;}
    .psd .specs .it .pass { display:inline-flex; align-items:center; gap:5px; font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-ok); margin-top:6px;}
    .psd .specs .it .pass .dot { width:5px; height:5px; border-radius:50%; background:var(--p-ok);}

    /* ===== STABILITY · time-series ===== */
    .psd .stab { display:grid; grid-template-columns:repeat(5, 1fr); gap:0; border:1px solid var(--p-grid); background:var(--p-paper); position:relative;}
    .psd .stab .col { padding:16px 14px; border-right:1px solid var(--p-grid-2); position:relative;}
    .psd .stab .col:last-child { border-right:none;}
    .psd .stab .col.now { background:color-mix(in oklab, var(--p-ok) 6%, var(--p-paper));}
    .psd .stab .col .wk { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); margin-bottom:10px;}
    .psd .stab .col.now .wk { color:var(--p-ok);}
    .psd .stab .col .v { font-family:var(--mono); font-size:11px; color:var(--p-ink); margin-bottom:4px; display:flex; justify-content:space-between;}
    .psd .stab .col .v .l { color:var(--p-muted); letter-spacing:0.06em; font-size:9px; text-transform:uppercase;}
    .psd .stab .col .note { font-family:var(--mono); font-size:9px; color:var(--p-ink-2); letter-spacing:0.04em; margin-top:10px; padding-top:8px; border-top:1px dashed var(--p-grid);}
    .psd .stab .col.now .note { color:var(--p-ok);}

    /* ===== PILOT 04 panel ===== */
    .psd .pilot { display:grid; grid-template-columns:1fr 1fr; gap:24px;}
    .psd .pilot .card { padding:22px 24px; border:1px solid var(--p-grid); background:var(--p-paper);}
    .psd .pilot .card h4 { font-family:var(--mono); font-size:9px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-muted); margin:0 0 12px; font-weight:500;}
    .psd .pilot .facts { display:flex; flex-direction:column; gap:10px;}
    .psd .pilot .facts .it { display:grid; grid-template-columns:110px 1fr; gap:12px; padding:8px 0; border-bottom:1px dotted var(--p-grid);}
    .psd .pilot .facts .it:last-child { border-bottom:none;}
    .psd .pilot .facts .it .l { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted);}
    .psd .pilot .facts .it .v { font-family:var(--mono); font-size:12px; color:var(--p-ink); letter-spacing:0.04em;}
    .psd .pilot .panel ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px;}
    .psd .pilot .panel ul li { display:flex; gap:8px; font-size:13px; line-height:1.5; color:var(--p-ink-2); padding-left:0;}
    .psd .pilot .panel ul li .q { font-family:var(--mazius); font-style:italic; color:var(--p-accent); font-size:20px; line-height:1; flex:0 0 auto; margin-top:2px;}
    .psd .pilot .panel ul li > span:last-child { flex:1 1 auto; min-width:0;}

    /* ===== INCI ===== */
    .psd .inci { padding:32px 36px; border:1px solid var(--p-grid); background:var(--p-paper);}
    .psd .inci .l { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); margin-bottom:14px;}
    .psd .inci .body { font-family:var(--mazius); font-style:italic; font-size:22px; line-height:1.5; color:var(--p-ink); letter-spacing:-0.005em;}
    .psd .inci .body em { color:var(--p-accent); font-style:italic;}
    .psd .inci .meta { display:flex; gap:24px; margin-top:18px; padding-top:14px; border-top:1px dashed var(--p-grid); font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted);}
    .psd .inci .meta b { color:var(--p-ink); font-weight:500;}

    /* ===== FLAGS ===== */
    .psd .flags { display:flex; flex-direction:column; gap:0; border-top:1px solid var(--p-grid);}
    .psd .flags > .flag { display:grid; grid-template-columns:1fr auto; gap:32px; padding:20px 0; border-bottom:1px solid var(--p-grid); background:transparent; border-left:none; border-right:none; border-top:none;}
    .psd .flags > .flag .mark { display:none;}
    .psd .flags > .flag .body { padding-left:18px; border-left:2px solid var(--p-accent);}
    .psd .flags > .flag .body .tag { display:inline-block; font-family:var(--mono); font-size:8.5px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-accent); padding:2px 6px; border:1px solid var(--p-accent); margin-bottom:8px; line-height:1.2;}
    .psd .flags > .flag .body h4 { font-family:var(--mazius); font-size:18px; line-height:1.25; margin:0 0 6px; font-weight:400; color:var(--p-ink);}
    .psd .flags > .flag .body .b { font-size:13px; line-height:1.55; color:var(--p-ink-2); max-width:680px;}
    .psd .flags > .flag .body .meta { display:flex; flex-wrap:wrap; gap:16px; margin-top:12px; font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted);}
    .psd .flags > .flag .body .meta b { color:var(--p-ink-2); font-weight:500; letter-spacing:0.02em; text-transform:none; font-size:10.5px;}
    .psd .flags > .flag .acks { display:flex; flex-direction:column; gap:8px; align-items:flex-end; min-width:200px;}
    .psd .flags > .flag .acks .ack { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-ink-2); display:flex; align-items:center; gap:8px; cursor:pointer;}
    .psd .flags > .flag .acks .ack input { width:13px; height:13px; accent-color:var(--p-accent); margin:0;}

    /* ===== POUR · pilot pour visual placeholder ===== */
    .psd .pour { position:relative; border:1px solid var(--p-grid); background:var(--p-paper-2); aspect-ratio:24/9; overflow:hidden;}
    .psd .pour::before { content:""; position:absolute; left:50%; top:50%; width:48px; height:1px; background:var(--p-grid); transform:translate(-50%,-50%);}
    .psd .pour::after { content:""; position:absolute; left:50%; top:50%; width:1px; height:48px; background:var(--p-grid); transform:translate(-50%,-50%);}
    .psd .pour .label { position:absolute; bottom:0; left:0; right:0; height:36px; padding:0 18px; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-ink-2); display:flex; gap:14px; align-items:center; border-top:1px solid var(--p-grid); background:var(--p-paper);}
    .psd .pour .label b { color:var(--p-ink); font-weight:500;}
    .psd .pour .label .sep { color:var(--p-grid);}
    .psd .pour .placeholder-tag { position:absolute; top:18px; left:18px; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); padding:4px 8px; border:1px solid var(--p-grid); background:var(--p-paper);}
    .psd .pour .ts { position:absolute; bottom:0; right:18px; height:36px; font-family:var(--mono); font-size:9px; letter-spacing:0.04em; color:var(--p-muted); display:flex; align-items:center; z-index:1;}
    .psd .pour .frame-num { display:none;}

    /* ===== SIGN BLOCK · the moment ===== */
    .psd .signblock { margin-top:80px; border-top:2px solid var(--p-ink); padding-top:32px;}
    .psd .signblock .preamble { display:grid; grid-template-columns:auto 1fr; gap:18px; margin-bottom:36px; padding:22px 26px; background:var(--p-paper-2); border:1px solid var(--p-grid);}
    .psd .signblock .preamble .ix { font-family:var(--mazius); font-style:italic; font-size:32px; line-height:1; color:var(--p-accent);}
    .psd .signblock .preamble h2 { font-family:var(--mazius); font-size:30px; line-height:1.05; letter-spacing:-0.018em; margin:0 0 10px; font-weight:400;}
    .psd .signblock .preamble h2 em { font-style:italic; color:var(--p-accent);}
    .psd .signblock .preamble p { font-family:var(--mazius); font-style:italic; font-size:16px; line-height:1.5; color:var(--p-ink-2); margin:0; max-width:640px; letter-spacing:-0.005em;}
    .psd .signblock .preamble p b { font-style:normal; color:var(--p-ink); font-weight:400;}

    /* method cards */
    .psd .methods { display:grid; grid-template-columns:repeat(3, 1fr); gap:14px; margin-bottom:24px;}
    .psd .method { padding:24px 26px 20px; border:1px solid var(--p-grid); background:var(--p-paper); position:relative; min-height:240px; display:flex; flex-direction:column;}
    .psd .method.selected { border-color:var(--p-ink); background:var(--p-paper-2);}
    .psd .method .pick { position:absolute; top:14px; right:14px; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); cursor:pointer; padding:3px 7px; border:1px solid var(--p-grid);}
    .psd .method.selected .pick { color:var(--p-paper); background:var(--p-ink); border-color:var(--p-ink);}
    .psd .method .l { font-family:var(--mono); font-size:9px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-muted); margin-bottom:6px;}
    .psd .method h4 { font-family:var(--mazius); font-size:22px; line-height:1.1; margin:0 0 8px; font-weight:400;}
    .psd .method h4 em { font-style:italic; color:var(--p-accent);}
    .psd .method .why { font-family:var(--mazius); font-style:italic; font-size:13px; line-height:1.45; color:var(--p-ink-2); margin:0 0 16px;}

    .psd .method .demo { margin-top:auto; padding-top:14px; border-top:1px dashed var(--p-grid);}
    .psd .method .demo .lbl { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); margin-bottom:8px;}
    .psd .method .demo input.tin { width:100%; height:42px; padding:0 12px; border:1px solid var(--p-grid); background:var(--p-card); color:var(--p-ink); font-family:var(--mazius); font-style:italic; font-size:18px;}
    .psd .method.selected .demo input.tin { border-color:var(--p-ink);}
    .psd .method .demo .conf-line { font-family:var(--mono); font-size:11px; color:var(--p-ink-2); padding:10px 12px; background:var(--p-card); border:1px solid var(--p-grid); letter-spacing:0.04em;}
    .psd .method .demo .conf-line b { color:var(--p-accent);}

    /* drawn pad */
    .psd .padbox { position:relative; height:90px; border:1px solid var(--p-grid); background:var(--p-card); overflow:hidden;}
    .psd .padbox .baseline { position:absolute; left:14px; right:14px; bottom:24px; height:1px; background:var(--p-grid);}
    .psd .padbox svg { position:absolute; inset:0; width:100%; height:100%;}
    .psd .padbox .clear { position:absolute; bottom:6px; right:8px; font-family:var(--mono); font-size:8px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); cursor:pointer;}

    /* legal preamble + commit row */
    .psd .commit { margin-top:8px; padding:24px 26px; border:1px solid var(--p-ink); background:var(--p-paper-2); display:grid; grid-template-columns:1fr auto; gap:32px; align-items:center;}
    .psd .commit .terms { font-family:var(--mazius); font-style:italic; font-size:14px; line-height:1.55; color:var(--p-ink-2); max-width:700px;}
    .psd .commit .terms b { font-style:normal; color:var(--p-ink); font-weight:400;}
    .psd .commit .terms .small { display:block; font-family:var(--mono); font-style:normal; font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:var(--p-muted); margin-top:8px;}
    .psd .commit .actions { display:flex; flex-direction:column; gap:10px; min-width:240px;}
    .psd .commit .actions .primary { font-family:var(--mono); font-size:11px; letter-spacing:0.18em; text-transform:uppercase; padding:14px 20px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;}
    .psd .commit .actions .primary .seal { width:14px; height:14px;}
    .psd .commit .actions .secondary { font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; padding:11px 16px; border:1px solid var(--p-accent); background:transparent; color:var(--p-accent); cursor:pointer;}
    .psd .commit .actions .reroute { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted); text-align:center; padding-top:6px; border-top:1px dashed var(--p-grid); cursor:pointer;}
    .psd .commit .actions .reroute b { color:var(--p-ink-2); font-weight:500;}

    /* ===== DocuSign trust strip in preamble ===== */
    .psd .signblock .preamble .ds-trust { display:flex; align-items:center; gap:10px; margin-top:14px; padding-top:14px; border-top:1px dashed var(--p-grid); font-family:var(--mono); font-size:10px; letter-spacing:0.04em; color:var(--p-muted); font-style:normal;}
    .psd .signblock .preamble .ds-trust .ds-mark { width:18px; height:18px; flex:0 0 auto;}
    .psd .signblock .preamble .ds-trust b { font-weight:500; color:var(--p-ink-2); font-style:normal;}

    /* ===== DocuSign-aware methods ===== */
    .psd .ds-methods { display:grid; grid-template-columns:1.4fr 1fr; gap:18px; margin-bottom:24px;}
    .psd .ds-method { padding:24px 26px 22px; border:1px solid var(--p-grid); background:var(--p-paper); display:flex; flex-direction:column;}
    .psd .ds-method.selected { border-color:var(--p-ink); background:var(--p-paper-2);}
    .psd .ds-method .ds-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;}
    .psd .ds-method .ds-pick { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); padding:3px 7px; border:1px solid var(--p-grid);}
    .psd .ds-method.selected .ds-pick { color:var(--p-paper); background:var(--p-ink); border-color:var(--p-ink);}
    .psd .ds-method .ds-tag { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted);}
    .psd .ds-method h4 { font-family:var(--mazius); font-size:22px; line-height:1.1; margin:0 0 8px; font-weight:400;}
    .psd .ds-method h4 em { font-style:italic; color:var(--p-accent);}
    .psd .ds-method .ds-why { font-family:var(--mazius); font-style:italic; font-size:13px; line-height:1.5; color:var(--p-ink-2); margin:0 0 16px;}
    .psd .ds-method .ds-why b { font-style:normal; color:var(--p-ink); font-weight:400;}

    /* embedded DocuSign frame mock */
    .psd .ds-frame { border:1px solid var(--p-grid); background:var(--p-card); margin-bottom:14px;}
    .psd .ds-frame-chrome { display:flex; align-items:center; gap:6px; padding:8px 10px; background:var(--p-paper-2); border-bottom:1px solid var(--p-grid); font-family:var(--mono); font-size:9px; color:var(--p-muted);}
    .psd .ds-frame-chrome .dot { width:6px; height:6px; border-radius:50%; background:transparent; border:1px solid var(--p-grid);}
    .psd .ds-frame-chrome .ds-url { flex:1; padding:0 10px; letter-spacing:0.04em;}
    .psd .ds-frame-chrome .ds-secure { color:var(--p-ok);}
    .psd .ds-frame-body { padding:18px 22px 4px; min-height:200px; position:relative;}
    .psd .ds-doc { display:flex; flex-direction:column; gap:8px; position:relative;}
    .psd .ds-doc-line { height:6px; background:var(--p-grid); opacity:0.55; border-radius:1px;}
    .psd .ds-doc-line.w50 { width:50%;} .psd .ds-doc-line.w65 { width:65%;}
    .psd .ds-doc-line.w70 { width:70%;} .psd .ds-doc-line.w80 { width:80%;} .psd .ds-doc-line.w90 { width:90%;}
    .psd .ds-sig-tag { position:absolute; left:-1px; top:78px; display:flex; align-items:center; gap:6px; background:var(--p-paper); color:var(--p-accent); padding:3px 7px; font-family:var(--mono); font-size:8.5px; letter-spacing:0.18em; text-transform:uppercase; border:1px solid var(--p-accent); line-height:1.2;}
    .psd .ds-sig-tag .tag-arrow { font-size:8px; color:var(--p-accent);}
    .psd .ds-sig-line { margin-top:18px; padding:8px 0 4px; border-bottom:1.5px solid var(--p-ink);}
    .psd .ds-sig-mark { font-family:var(--mazius); font-style:italic; font-size:26px; color:var(--p-accent);}
    .psd .ds-sig-meta { display:flex; gap:18px; margin-top:6px; font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em;}
    .psd .ds-frame-foot { display:flex; justify-content:space-between; padding:10px 14px; border-top:1px solid var(--p-grid); background:var(--p-paper-2);}
    .psd .ds-btn-finish { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; padding:7px 14px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); cursor:pointer;}
    .psd .ds-btn-other { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; padding:7px 12px; border:1px solid var(--p-grid); background:transparent; color:var(--p-ink-2); cursor:pointer;}

    .psd .ds-bullets { display:flex; flex-direction:column; gap:6px; margin-top:auto; padding-top:14px; border-top:1px dashed var(--p-grid); font-family:var(--mono); font-size:10px; line-height:1.4; color:var(--p-ink-2); letter-spacing:0.02em;}
    .psd .ds-bullets b { color:var(--p-ink); font-weight:500;}
    .psd .ds-bullets.quiet { font-size:9.5px; color:var(--p-muted);}

    /* click-to-agree card */
    .psd .ds-click { display:flex; flex-direction:column; gap:12px; margin-bottom:14px;}
    .psd .ds-click-row { display:flex; align-items:center; gap:10px;}
    .psd .ds-click-l { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); flex:0 0 70px;}
    .psd .ds-click-in { flex:1; height:38px; padding:0 12px; border:1px solid var(--p-ink); background:var(--p-card); color:var(--p-ink); font-family:var(--mazius); font-style:italic; font-size:16px;}
    .psd .ds-click-agree { display:flex; align-items:flex-start; gap:8px; font-family:var(--mazius); font-style:italic; font-size:13px; line-height:1.45; color:var(--p-ink-2);}
    .psd .ds-click-agree .cb { width:16px; height:16px; flex:0 0 auto; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); display:inline-flex; align-items:center; justify-content:center; font-size:10px; font-style:normal;}
    .psd .ds-click-agree b { font-style:normal; color:var(--p-ink); font-weight:400;}
    .psd .ds-click-foot { display:flex; gap:8px; font-family:var(--mono); font-size:9px; letter-spacing:0.04em; color:var(--p-muted);}

    /* per-article attestation summary (regulated) */
    .psd .ds-att-summary { margin:0 0 22px; padding:18px 22px; border:1px dashed var(--p-accent); background:var(--p-paper);}
    .psd .ds-att-summary .att-l { font-family:var(--mono); font-size:9px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-accent); margin-bottom:12px;}
    .psd .ds-att-summary .att-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;}
    .psd .ds-att-summary .att-chip { display:flex; align-items:center; gap:7px; padding:7px 10px; background:var(--p-paper-2); border:1px solid var(--p-grid); font-family:var(--mono); font-size:10px; color:var(--p-ink-2); letter-spacing:0.02em;}
    .psd .ds-att-summary .att-chip svg { width:11px; height:11px; color:var(--p-ok); flex:0 0 auto;}
    .psd .ds-att-summary .att-meta { margin-top:10px; font-family:var(--mazius); font-style:italic; font-size:12px; color:var(--p-muted);}

    /* per-article inline attestation (regulated) */
    .psd .attestation { margin:14px 0 0; padding:10px 14px; background:var(--p-paper); border-left:2px solid var(--p-accent); font-family:var(--mazius); font-style:italic; font-size:12.5px; line-height:1.5; color:var(--p-ink-2);}
    .psd .attestation b { font-style:normal; color:var(--p-ink); font-weight:400;}
    .psd .attestation em { font-style:italic; color:var(--p-accent); font-family:var(--mazius);}
    .psd .attestation .att-mark { font-family:var(--mazius); color:var(--p-accent); margin-right:6px; font-size:14px;}
    .psd .attestation .att-meta { display:block; margin-top:4px; font-family:var(--mono); font-style:normal; font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted);}

    /* ===== LEGAL BANNER (above the dossier) ===== */
    .psd .legal-banner-deed { padding-top:0 !important; padding-bottom:0 !important;}
    .psd .legal-banner { margin:0 0 28px; padding:18px 0 22px; border-top:1px solid var(--p-grid); background:transparent; display:grid; grid-template-columns:auto 1fr auto auto; gap:22px; align-items:center;}
    .psd .legal-banner.regulated { border-top-color:var(--p-accent);}
    .psd .legal-banner .lb-mark { width:32px; height:32px; color:var(--p-ink); flex:0 0 auto;}
    .psd .legal-banner.regulated .lb-mark { color:var(--p-accent);}
    .psd .legal-banner .lb-mark svg { width:100%; height:100%;}
    .psd .legal-banner .lb-kicker { font-family:var(--mono); font-size:9px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-muted); margin-bottom:6px;}
    .psd .legal-banner.regulated .lb-kicker { color:var(--p-accent);}
    .psd .legal-banner .lb-text { font-family:var(--mazius); font-style:italic; font-size:13.5px; line-height:1.5; color:var(--p-ink-2); margin:0; max-width:680px;}
    .psd .legal-banner .lb-text b { font-style:normal; color:var(--p-ink); font-weight:400;}
    .psd .legal-banner .lb-text em { font-style:italic; color:var(--p-accent);}
    .psd .legal-banner .lb-meta { display:flex; flex-direction:column; gap:6px; font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.06em; text-align:right;}
    .psd .legal-banner .lb-meta div { display:flex; gap:8px; justify-content:flex-end;}
    .psd .legal-banner .lb-meta span { text-transform:uppercase; letter-spacing:0.16em;}
    .psd .legal-banner .lb-meta b { color:var(--p-ink-2); font-weight:500; letter-spacing:0.02em; text-transform:none; font-size:10px;}
    .psd .legal-banner .lb-meta .reg b { color:var(--p-accent);}
    .psd .legal-banner .lb-open { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; padding:9px 14px; border:1px solid var(--p-ink); background:transparent; color:var(--p-ink); cursor:pointer; white-space:nowrap;}
    .psd .legal-banner .lb-open .ar { margin-left:4px;}

    /* ===== COLOPHON · FULL (standard / regulated) ===== */
    .psd .colophon-full { margin-top:48px; padding:32px 0 64px; border-top:1px solid var(--p-grid);}
    .psd .colophon-full .cf-head { margin-bottom:32px; max-width:680px;}
    .psd .colophon-full .cf-kicker { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); margin-bottom:10px;}
    .psd .colophon-full .cf-head h3 { font-family:var(--mazius); font-size:30px; line-height:1.05; margin:0 0 12px; font-weight:400; letter-spacing:-0.018em;}
    .psd .colophon-full .cf-head h3 em { font-style:italic; color:var(--p-accent);}
    .psd .colophon-full .cf-lede { font-family:var(--mazius); font-style:italic; font-size:15px; line-height:1.5; color:var(--p-ink-2); margin:0;}
    .psd .colophon-full .cf-lede b { font-style:normal; color:var(--p-ink); font-weight:400;}

    .psd .colophon-full .cf-clauses { display:grid; grid-template-columns:1fr 1fr; gap:0; border-top:1px solid var(--p-grid); border-left:1px solid var(--p-grid);}
    .psd .colophon-full .cf-clauses article { display:grid; grid-template-columns:60px 1fr; gap:16px; padding:22px 24px; border-right:1px solid var(--p-grid); border-bottom:1px solid var(--p-grid);}
    .psd .colophon-full .cf-clauses article.reg-art { background:color-mix(in oklab, var(--p-accent) 5%, transparent);}
    .psd .colophon-full .cf-num { font-family:var(--mazius); font-style:italic; font-size:32px; color:var(--p-accent); line-height:1;}
    .psd .colophon-full .cf-clauses h6 { font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-ink); margin:4px 0 8px; font-weight:500;}
    .psd .colophon-full .cf-clauses p { font-family:var(--mono); font-size:11px; line-height:1.65; color:var(--p-ink-2); margin:0; letter-spacing:0.01em;}
    .psd .colophon-full .cf-clauses p b { color:var(--p-ink); font-weight:500;}
    .psd .colophon-full .cf-clauses p em { font-family:var(--mazius); font-style:italic; color:var(--p-accent); font-size:13px;}

    .psd .colophon-full .cf-foot { margin-top:32px; display:grid; grid-template-columns:1fr auto; gap:48px; padding-top:24px; border-top:1px solid var(--p-grid);}
    .psd .colophon-full .cf-cp h6 { font-family:var(--mono); font-size:9px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-muted); margin:0 0 14px; font-weight:500;}
    .psd .colophon-full .cf-cp-row { display:grid; grid-template-columns:1fr 1fr; gap:36px;}
    .psd .colophon-full .cf-cp-row span { display:block; font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted); margin-bottom:4px;}
    .psd .colophon-full .cf-cp-row b { display:block; font-family:var(--mazius); font-size:18px; color:var(--p-ink); font-weight:400; margin-bottom:2px;}
    .psd .colophon-full .cf-cp-row em { display:block; font-family:var(--mono); font-style:normal; font-size:10px; color:var(--p-ink-2); letter-spacing:0.02em;}
    .psd .colophon-full .cf-down { display:flex; flex-direction:column; gap:8px; align-items:flex-end;}
    .psd .colophon-full .cf-pdf { font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; padding:11px 18px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); cursor:pointer;}
    .psd .colophon-full .cf-down small { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em;}
    .psd .colophon-full .cf-down small b { color:var(--p-ink-2);}

    /* ===== FOOTER · the colophon (legacy / minimal) ===== */
    .psd .colophon { margin-top:48px; padding:24px 0 56px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:48px; border-top:1px solid var(--p-grid);}
    .psd .colophon h5 { font-family:var(--mono); font-size:9px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-muted); margin:18px 0 10px; font-weight:500;}
    .psd .colophon .body { font-family:var(--mono); font-size:10px; line-height:1.7; color:var(--p-ink-2); letter-spacing:0.02em;}
    .psd .colophon .body b { color:var(--p-ink); font-weight:500;}

    /* ===== RECEIPT (after-sign state) ===== */
    .psd .receipt { width:1100px; box-sizing:border-box; margin:24px auto 0; padding:64px 72px 56px; background:var(--p-card); border:1px solid var(--p-grid); position:relative; overflow:hidden;}
    .psd .receipt .seal-bg { position:absolute; right:-40px; top:50%; transform:translateY(-50%); width:560px; height:560px; opacity:0.07; pointer-events:none;}
    .psd .receipt .stamp-mark { position:absolute; top:48px; right:72px; width:140px; height:140px; transform:rotate(-8deg);}
    .psd .receipt .head .kicker { font-family:var(--mono); font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:var(--p-ok); margin-bottom:14px;}
    .psd .receipt .head h1 { font-family:var(--mazius); font-size:64px; line-height:0.96; letter-spacing:-0.025em; margin:0 0 12px; font-weight:400; max-width:760px;}
    .psd .receipt .head h1 em { font-style:italic; color:var(--p-accent);}
    .psd .receipt .head .sub { font-family:var(--mazius); font-style:italic; font-size:20px; line-height:1.5; color:var(--p-ink-2); max-width:680px;}
    .psd .receipt .head .sub b { font-style:normal; color:var(--p-ink); font-weight:400;}

    .psd .receipt .ledger { margin-top:48px; border:1px solid var(--p-grid); background:var(--p-paper-2);}
    .psd .receipt .ledger .row { display:grid; grid-template-columns:200px 1fr; gap:24px; padding:14px 22px; border-bottom:1px solid var(--p-grid-2); align-items:baseline;}
    .psd .receipt .ledger .row:last-child { border-bottom:none;}
    .psd .receipt .ledger .row .l { font-family:var(--mono); font-size:9px; letter-spacing:0.20em; text-transform:uppercase; color:var(--p-muted);}
    .psd .receipt .ledger .row .v { font-family:var(--mono); font-size:13px; color:var(--p-ink); letter-spacing:0.04em;}
    .psd .receipt .ledger .row .v b { font-weight:500;}

    .psd .receipt .unblocks { margin-top:36px;}
    .psd .receipt .unblocks h3 { font-family:var(--mono); font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); margin:0 0 14px; font-weight:500;}
    .psd .receipt .unblocks .grid { display:grid; grid-template-columns:1fr 1fr; gap:14px;}
    .psd .receipt .unblocks .item { padding:18px 22px; border:1px solid var(--p-grid); background:var(--p-paper); display:grid; grid-template-columns:auto 1fr; gap:14px; align-items:center;}
    .psd .receipt .unblocks .item .ix { font-family:var(--mazius); font-style:italic; font-size:24px; line-height:1; color:var(--p-accent);}
    .psd .receipt .unblocks .item .nm { font-size:14px; color:var(--p-ink);}
    .psd .receipt .unblocks .item .nm small { display:block; font-family:var(--mono); font-size:10px; color:var(--p-muted); letter-spacing:0.04em; margin-top:3px;}

    .psd .receipt .actions { margin-top:48px; display:flex; gap:12px;}
    .psd .receipt .actions .primary { font-family:var(--mono); font-size:11px; letter-spacing:0.18em; text-transform:uppercase; padding:14px 20px; border:1px solid var(--p-ink); background:var(--p-ink); color:var(--p-paper); cursor:pointer;}
    .psd .receipt .actions .ghost { font-family:var(--mono); font-size:11px; letter-spacing:0.16em; text-transform:uppercase; padding:14px 18px; border:1px solid var(--p-grid); background:transparent; color:var(--p-ink); cursor:pointer;}
  `;
  return <style>{css}</style>;
}

window.SignoffStyles = SignoffStyles;
