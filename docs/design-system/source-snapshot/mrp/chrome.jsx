/* PLX MRP — shared chrome
   --------------------------------------------------------------
   GlobalSidebar  · left rail with grouped nav, portal link, user
   Topbar         · slim workspace switcher · search · notif
   NotifDrawer    · right-side "For you · today" drawer
   PhaseRail      · 14-stop Develop ↔ Manufacture rail (optional)
   MrpShell       · React wrapper for React-mounted pages
   installMrpChrome · DOM restructurer for vanilla-HTML pages

   Loaded once and exposed via window so every MRP screen can wear
   the same outer chrome and the user has a single mental model of
   "where am I in the suite".
   -------------------------------------------------------------- */

/* ─── Map screens → sidebar nav keys and href targets ─── */
const MRP_ROUTES = {
  'mrp-dashboard':   'MRP Workbench.html',
  'projects':        'MRP Workbench.html',
  'intake':          'MRP Product Development.html#module=intake',
  'go-no-go':        'MRP Pre-Quote.html',
  'sample-pours':    'MRP Sample Pour v5.html',
  'standard-costs':  'MRP Standard Costs.html',
  'quote':           'MRP Quote.html',
  'formulas':        'MRP Product Development.html#module=formulation',
  'bulk-products':   'MRP BOM Dossier.html',
  'final-products':  'MRP Assembly Dossier.html',
  'calc-map':        'MRP Design Process Flow.html',
};

const MRP_NAV_GROUPS = [
  {h:'', pinned:true, items:[
    ['mrp-dashboard', 'MRP Dashboard'],
  ]},
  {h:'Customers', items:[
    ['customers', 'Customers'],
    ['sage-customers', 'Sage Active Customers'],
  ]},
  {h:'Product Development', items:[
    ['intake', 'Intake / Tech-Transfer'],
    ['go-no-go', 'Go / No-Go (Pre-Quote)'],
    ['sample-pours', 'Sample Pours'],
    ['pilot-batches', 'Pilot Batches'],
    ['trials', 'Trials & Testing'],
    ['standard-costs', 'Standard Costs'],
    ['quote', 'Quote'],
    ['customer-review', 'Customer Review'],
  ]},
  {h:'R&D', items:[
    ['formulas', 'Formulas'],
    ['bulk-products', 'Bulk Products'],
    ['final-products', 'Final Products'],
    ['projects', 'Projects'],
  ]},
  {h:'Parts', items:[
    ['raw-materials', 'Raw Materials'],
    ['packaging', 'Packaging'],
  ]},
  {h:'Procurement', items:[
    ['purchase-orders', 'Purchase Orders'],
    ['generate-po', 'Generate PO'],
    ['suppliers', 'Suppliers'],
    ['sourcing', 'Sourcing'],
  ]},
  {h:'Production', items:[
    ['receiving', 'Receiving'],
    ['batching', 'Batching'],
    ['assembly-orders', 'Assembly Orders'],
    ['employee-rates', 'Employee Rates'],
  ]},
  {h:'Inventories', items:[
    ['inventory-overview', 'Inventory Overview'],
  ]},
  {h:'Warehouse', items:[
    ['wms-dashboard', 'WMS Dashboard'],
    ['pick-lists', 'Pick Lists'],
    ['transactions', 'Transactions'],
  ]},
  {h:'System', items:[
    ['control-tower', 'Control Tower'],
    ['uat-feedback', 'UAT Feedback'],
    ['data-schema', 'Data Schema'],
    ['data-audit', 'Data Audit'],
    ['calc-map', 'Calculation Map'],
  ]},
];

function GlobalSidebar({ active = 'mrp-dashboard', setActive, routes = MRP_ROUTES }) {
  const onClick = (e, k) => {
    // On mobile/tablet, close the drawer after navigating
    if (typeof document !== 'undefined' && document.body.classList.contains('mrp-sb-open')) {
      document.body.classList.remove('mrp-sb-open');
    }
    if (!routes[k]) { e.preventDefault(); return; }
    if (setActive) {
      setActive(k);
    } else if (routes[k]) {
      e.preventDefault();
      window.location.href = routes[k];
    }
  };
  const closeDrawer = () => {
    if (typeof document !== 'undefined') document.body.classList.remove('mrp-sb-open');
  };
  return (
    <>
      <div className="gsb-backdrop" onClick={closeDrawer}></div>
    <aside className="gsb">
      <div className="gsb-top">
        <div className="gsb-brand">
          <span className="mark">MRP Suite</span>
          <span className="sub">Manufacturing Resource Planning</span>
        </div>
        <button className="gsb-close" onClick={closeDrawer} aria-label="Close menu">✕</button>
      </div>
      <nav className="gsb-nav">
        {MRP_NAV_GROUPS.map(g => (
          <div key={g.h || '_pinned'} className={`gsb-grp ${g.pinned ? 'pinned' : ''}`}>
            {g.h && <div className="gsb-h">{g.h}</div>}
            {g.items.map(([k,n]) => {
              const wired = !!routes[k];
              return (
                <a
                  key={k}
                  href={routes[k] || '#'}
                  className={`gsb-item ${active===k?'on':''} ${wired ? '' : 'tbd'}`}
                  onClick={(e)=>onClick(e,k)}
                  title={wired ? n : `${n} — not yet built`}
                >
                  {n}
                  {!wired && <span className="gsb-tbd-tag">soon</span>}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="gsb-foot">
        <a className="gsb-portal" href="Customer Flow Prototype.html" title="Open customer portal prototype">
          <span>↗</span> Customer Portal
        </a>
        <div className="gsb-user">
          <span className="av">VA</span>
          <div><div className="n">Vince Alton</div><div className="r">Admin</div></div>
        </div>
      </div>
      <style>{`
        .gsb { width:240px; background:var(--p-rail); border-right:1px solid var(--p-grid); display:flex; flex-direction:column; min-height:100vh; flex:0 0 240px; font-family:var(--sans);}
        .gsb-top { padding:18px 18px 14px; border-bottom:1px solid var(--p-grid);}
        .gsb-brand { display:flex; flex-direction:column; gap:2px;}
        .gsb-brand .mark { font-family:var(--mazius); font-size:18px; letter-spacing:-0.012em; color:var(--p-ink);}
        .gsb-brand .sub { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted);}
        .gsb-nav { flex:1; overflow-y:auto; padding:14px 0 6px;}
        .gsb-grp { padding:0 14px 14px;}
        .gsb-grp.pinned { padding-top:6px; padding-bottom:14px; margin-bottom:6px; border-bottom:1px solid var(--p-grid);}
        .gsb-grp.pinned .gsb-item { font-size:14px; padding:8px 8px; font-weight:500; color:var(--p-ink);}
        .gsb-h { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); padding:4px 6px 6px;}
        .gsb-item { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 8px; font-size:13px; color:var(--p-ink-2); cursor:pointer; border-radius:3px; line-height:1.3; text-decoration:none;}
        .gsb-item:hover { background:var(--p-paper-2); color:var(--p-ink);}
        .gsb-item.on { background:var(--p-accent-soft); color:var(--p-accent); font-weight:500; box-shadow:inset 2px 0 0 var(--p-accent);}
        .gsb-item.tbd { color:var(--p-muted); cursor:default; }
        .gsb-item.tbd:hover { background:transparent; color:var(--p-muted); }
        .gsb-item.tbd .gsb-tbd-tag {
          font-family:var(--mono); font-size:8px; letter-spacing:0.16em; text-transform:uppercase;
          color:var(--p-muted); border:1px dashed var(--p-grid); padding:1px 5px; line-height:1;
          opacity:0.7;
        }
        .gsb-grp.pinned .gsb-item.tbd { color:var(--p-muted); }
        .gsb-foot { border-top:1px solid var(--p-grid); padding:12px 14px;}
        .gsb-portal { display:flex; align-items:center; gap:8px; padding:8px 10px; font-family:var(--mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-ink); background:var(--p-paper-2); border:1px solid var(--p-grid); text-decoration:none; cursor:pointer; margin-bottom:12px;}
        .gsb-portal:hover { border-color:var(--p-ink);}
        .gsb-user { display:flex; align-items:center; gap:10px; padding:4px 6px;}
        .gsb-user .av { width:28px; height:28px; border-radius:50%; background:var(--p-ink); color:var(--p-paper); font-family:var(--mono); font-size:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
        .gsb-user .n { font-size:12px; color:var(--p-ink);}
        .gsb-user .r { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted);}

        /* chrome wrapper — both #root (React) and body (vanilla) use this */
        .mrp-chrome-root { display:flex; min-height:100vh; align-items:stretch; margin:0;}
        .mrp-chrome-root > .app { flex:1; min-width:0; display:flex; flex-direction:column; min-height:0;}
        #root.mrp-chrome-root { /* react pages */ }
        body.mrp-chrome-root { display:flex; }
        /* legacy alias from the workbench */
        #root { display:flex; min-height:100vh; align-items:stretch;}
        #root > .app { flex:1; min-width:0; display:flex; flex-direction:column;}

        /* close button + backdrop — hidden on desktop, used on tablet/mobile */
        .gsb-close { display:none; background:transparent; border:1px solid var(--p-grid); color:var(--p-muted); font-size:14px; line-height:1; padding:6px 10px; cursor:pointer; align-self:flex-start; margin-left:auto; }
        .gsb-close:hover { color:var(--p-ink); border-color:var(--p-ink); }
        .gsb-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
        .gsb-backdrop { display:none; }

        /* ─── Tablet ≤ 1024px: sidebar becomes a slide-out drawer ─── */
        @media (max-width: 1024px) {
          .gsb {
            position:fixed; top:0; left:0; bottom:0; z-index:60;
            width:280px; max-width:85vw; flex:0 0 auto;
            transform:translateX(-102%); transition:transform .22s ease;
            box-shadow:6px 0 24px rgba(27,26,23,0);
          }
          body.mrp-sb-open .gsb,
          .mrp-chrome-root.mrp-sb-open .gsb {
            transform:translateX(0);
            box-shadow:6px 0 24px rgba(27,26,23,0.18);
          }
          .gsb-backdrop {
            display:block; position:fixed; inset:0; background:rgba(27,26,23,0); z-index:59;
            pointer-events:none; transition:background .22s ease;
          }
          body.mrp-sb-open .gsb-backdrop,
          .mrp-chrome-root.mrp-sb-open .gsb-backdrop {
            background:rgba(27,26,23,0.4); pointer-events:auto;
          }
          .gsb-close { display:inline-flex; }
          /* Body grid no longer reserves space for the sidebar */
          .mrp-chrome-root { display:block; }
          .mrp-chrome-root > .app { display:flex; flex-direction:column; min-height:100vh; }
          #root { display:block; }
          #root > .app { display:flex; flex-direction:column; min-height:100vh; }
        }
      `}</style>
    </aside>
    </>
  );
}

function NotifDrawer({ open, onClose }) {
  const awaiting = [
    { glyph:'R', due:'Today',  title:'Review Iter 03 sample feedback', sub:'before Iter 05 pour', sev:'now' },
    { glyph:'S', due:'May 08', title:'Counter-sign MSA v3',            sub:'before quote release', sev:'soon' },
    { glyph:'D', due:'May 10', title:'Choose NatraGem supplier',       sub:'cheaper +14d vs faster +0d', sev:'soon' },
  ];
  const lab = [
    { t:'T-00:42', who:'Maya A.',     body:'Iter 04 poured · 0.5 kg pilot',            kind:'ok' },
    { t:'T-04:14', who:'Maya A.',     body:'SymRepair 100 substituted for CeraSooth',  kind:'info' },
    { t:'T-08:02', who:'Sam V.',      body:'Pre-quote returned · $6.40/kg held',       kind:'ok' },
    { t:'T-12:18', who:'Anya P.',     body:'QC released bulk B-2614-04 · 0% deviation', kind:'ok' },
    { t:'T-1d',    who:'Procurement', body:'NatraGem EW · 2 quotes received',          kind:'warn' },
  ];
  const flags = [
    { sev:'hot',  code:'F-001', t:'NatraGem supplier slip threatens ship date', proj:'PLX-2614' },
    { sev:'warn', code:'F-002', t:'Stability T+4wk · viscosity drift +6%',      proj:'PLX-2614' },
    { sev:'warn', code:'F-003', t:'BOM cost over target by 4%',                  proj:'PLX-2602' },
    { sev:'info', code:'F-004', t:'Artwork approval pending customer reply',    proj:'AURA-019' },
  ];

  React.useEffect(()=>{
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="notif-backdrop" onClick={onClose}/>
      <aside className="notif-drawer">
        <header>
          <span className="kicker">/ For you · today</span>
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <section>
          <div className="sec-h">
            <span>Awaiting your sign-off</span>
            <span className="count">{awaiting.length}</span>
          </div>
          {awaiting.map((a,i) => (
            <div key={i} className="aw">
              <span className="aw-glyph">{a.glyph}</span>
              <div>
                <div className="aw-meta">
                  <span className={`aw-due ${a.sev}`}><span className="dot"/>{a.due}</span>
                </div>
                <div className="aw-title">{a.title}</div>
                <div className="aw-sub">{a.sub}</div>
              </div>
              <span className="aw-arrow">→</span>
            </div>
          ))}
        </section>
        <section>
          <div className="sec-h">
            <span>Latest from the lab</span>
            <span className="count">{lab.length}</span>
          </div>
          {lab.map((r,i) => (
            <div key={i} className="lab-r">
              <span className={`lab-p ${r.kind}`}/>
              <div>
                <div className="lab-meta"><span>{r.t}</span><span className="sep">·</span><span>{r.who}</span></div>
                <div className="lab-t">{r.body}</div>
              </div>
            </div>
          ))}
        </section>
        <section>
          <div className="sec-h">
            <span>Open flags</span>
            <span className="count">{flags.length}</span>
          </div>
          {flags.map((f,i) => (
            <div key={i} className="flag-r">
              <span className={`flag-sev sev-${f.sev}`}/>
              <div>
                <div className="flag-meta"><span className="code">{f.code}</span><span className="sep">·</span><span>{f.proj}</span></div>
                <div className="flag-t">{f.t}</div>
              </div>
            </div>
          ))}
        </section>
        <footer>
          <a className="open-dash" onClick={onClose}>Open dashboard →</a>
        </footer>
      </aside>
      <style>{`
        .notif-backdrop { position:fixed; inset:0; background:rgba(27,26,23,0.35); z-index:50; animation:nfd-fade .15s ease;}
        @keyframes nfd-fade { from { opacity:0; } to { opacity:1; }}
        .notif-drawer { position:fixed; top:0; right:0; bottom:0; width:420px; background:var(--p-paper); border-left:1px solid var(--p-grid); z-index:51; box-shadow:-12px 0 24px rgba(27,26,23,0.08); display:flex; flex-direction:column; font-family:var(--sans); animation:nfd-slide .2s ease;}
        @keyframes nfd-slide { from { transform:translateX(24px); opacity:0;} to { transform:translateX(0); opacity:1;}}
        @media (max-width: 640px) { .notif-drawer { width:100vw; max-width:100vw; } }
        .notif-drawer header { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; border-bottom:1px solid var(--p-grid);}
        .notif-drawer header .kicker { font-family:var(--mono); font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted);}
        .notif-drawer header .close { background:transparent; border:0; font-size:14px; color:var(--p-muted); cursor:pointer; padding:6px 10px;}
        .notif-drawer header .close:hover { color:var(--p-ink);}
        .notif-drawer section { padding:14px 22px; border-bottom:1px solid var(--p-grid-2); flex:0 0 auto; overflow-y:auto;}
        .notif-drawer .sec-h { display:flex; justify-content:space-between; font-family:var(--mono); font-size:9.5px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); margin-bottom:10px;}
        .notif-drawer .sec-h .count { color:var(--p-accent);}
        .notif-drawer .aw { display:grid; grid-template-columns:34px 1fr auto; gap:12px; padding:10px 0; border-bottom:1px dotted var(--p-grid-2); cursor:pointer;}
        .notif-drawer .aw:last-child { border-bottom:none;}
        .notif-drawer .aw:hover { background:var(--p-paper-2); margin:0 -8px; padding:10px 8px;}
        .notif-drawer .aw-glyph { width:34px; height:34px; border:1px solid var(--p-ink); font-family:var(--mazius); font-size:16px; display:flex; align-items:center; justify-content:center; color:var(--p-ink); background:var(--p-card);}
        .notif-drawer .aw-meta { margin-bottom:3px;}
        .notif-drawer .aw-due { display:inline-flex; align-items:center; gap:5px; font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; padding:2px 6px; border:1px solid var(--p-warn); color:var(--p-warn); font-weight:500;}
        .notif-drawer .aw-due.now { color:var(--p-hot); border-color:var(--p-hot);}
        .notif-drawer .aw-due .dot { width:5px; height:5px; border-radius:50%; background:currentColor;}
        .notif-drawer .aw-title { font-family:var(--mazius); font-size:15px; line-height:1.2; color:var(--p-ink);}
        .notif-drawer .aw-sub { font-size:11.5px; color:var(--p-muted); margin-top:2px;}
        .notif-drawer .aw-arrow { font-family:var(--mono); color:var(--p-muted); align-self:center;}
        .notif-drawer .lab-r { display:grid; grid-template-columns:10px 1fr; gap:10px; padding:8px 0; border-bottom:1px dotted var(--p-grid-2); align-items:start;}
        .notif-drawer .lab-r:last-child { border-bottom:none;}
        .notif-drawer .lab-p { width:6px; height:6px; border-radius:50%; margin-top:6px;}
        .notif-drawer .lab-p.ok { background:var(--p-ok);}
        .notif-drawer .lab-p.info { background:var(--p-info);}
        .notif-drawer .lab-p.warn { background:var(--p-warn);}
        .notif-drawer .lab-meta { display:flex; gap:5px; font-family:var(--mono); font-size:8.5px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted); margin-bottom:2px;}
        .notif-drawer .lab-meta .sep { color:var(--p-grid);}
        .notif-drawer .lab-t { font-size:12px; color:var(--p-ink-2); line-height:1.4;}
        .notif-drawer .flag-r { display:grid; grid-template-columns:6px 1fr; gap:12px; padding:8px 0; border-bottom:1px dotted var(--p-grid-2); align-items:start;}
        .notif-drawer .flag-r:last-child { border-bottom:none;}
        .notif-drawer .flag-sev { width:3px; align-self:stretch; min-height:32px;}
        .notif-drawer .flag-sev.sev-hot { background:var(--p-hot);}
        .notif-drawer .flag-sev.sev-warn { background:var(--p-warn);}
        .notif-drawer .flag-sev.sev-info { background:var(--p-info);}
        .notif-drawer .flag-meta { display:flex; gap:5px; font-family:var(--mono); font-size:8.5px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted); margin-bottom:2px;}
        .notif-drawer .flag-meta .code { color:var(--p-ink-2);}
        .notif-drawer .flag-meta .sep { color:var(--p-grid);}
        .notif-drawer .flag-t { font-size:12px; color:var(--p-ink-2); line-height:1.4;}
        .notif-drawer footer { margin-top:auto; padding:14px 22px; border-top:1px solid var(--p-grid); background:var(--p-paper-2);}
        .notif-drawer .open-dash { font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-accent); cursor:pointer; display:block; text-align:center; padding:6px;}
        .notif-drawer .open-dash:hover { background:var(--p-accent-soft); color:var(--p-ink);}
      `}</style>
    </>
  );
}

function Topbar({ workspace = 'Aldosari Studio', onOpenNotif, hideNotif = false, urgentCount = 0 }) {
  const openSidebar = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('mrp-sb-open');
      // Some pages mount chrome inside #root, so toggle there too
      const root = document.getElementById('root');
      if (root) root.classList.add('mrp-sb-open');
    }
  };
  return (
    <div className="topbar">
      <div className="l">
        <button className="hamburger" onClick={openSidebar} aria-label="Open menu" title="Menu">
          <span></span><span></span><span></span>
        </button>
        <div className="ws">
          <span className="av">A</span>
          <span className="ws-name">{workspace}</span>
          <span style={{color:'var(--p-muted)', fontSize:9, marginLeft:4}}>▾</span>
        </div>
      </div>
      <div className="c">
        <div className="search">
          <span>⌕</span> Projects, parts, people…
          <span className="key">⌘ K</span>
        </div>
      </div>
      <div className="r">
        {!hideNotif && (
          <button className="notif" onClick={onOpenNotif} title="Awaiting you, lab activity, flags">
            <span>For you</span>
            {urgentCount > 0 && <span className={`count ${urgentCount > 2 ? 'urgent' : ''}`}>{urgentCount}</span>}
          </button>
        )}
        <span className="userav" title="Vince Alton · Admin">
          VA
          {!hideNotif && urgentCount > 0 && <span className="dot"/>}
        </span>
      </div>
      <style>{`
        .topbar .l, .topbar .c, .topbar .r { display:flex; align-items:center;}
        .topbar { display:grid !important; grid-template-columns:auto 1fr auto; gap:18px; align-items:center; padding:10px 24px;}
        .topbar .c { justify-content:center;}
        .topbar .c .search { min-width:420px; max-width:520px;}
        .topbar .r { gap:14px;}
        .topbar .r .notif { position:relative; cursor:pointer; padding:6px 10px; font-family:var(--mono); font-size:9.5px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-ink-2); border:1px solid var(--p-grid); background:transparent; display:inline-flex; align-items:center; gap:8px;}
        .topbar .r .notif:hover { border-color:var(--p-ink);}
        .topbar .r .notif .count { display:inline-flex; align-items:center; justify-content:center; min-width:18px; height:18px; padding:0 5px; background:var(--p-accent); color:var(--p-paper); font-size:9.5px; letter-spacing:0.06em;}
        .topbar .r .notif .count.urgent { background:var(--p-hot);}
        .topbar .r .userav { position:relative;}
        .topbar .r .userav .dot { position:absolute; top:-2px; right:-2px; width:8px; height:8px; border-radius:50%; background:var(--p-hot); border:2px solid var(--p-paper);}

        /* Hamburger — desktop hides, tablet/mobile shows */
        .topbar .hamburger { display:none; flex-direction:column; justify-content:center; gap:4px; width:34px; height:32px; padding:7px 8px; background:transparent; border:1px solid var(--p-grid); cursor:pointer; }
        .topbar .hamburger:hover { border-color:var(--p-ink); }
        .topbar .hamburger span { display:block; height:1.5px; background:var(--p-ink); }
        .topbar .l { gap:12px; }

        @media (max-width: 1024px) {
          .topbar .hamburger { display:inline-flex; }
          .topbar { padding:8px 14px; gap:10px; grid-template-columns:auto 1fr auto; }
          .topbar .c { display:none; }
          .topbar .ws-name { display:none; }
          .topbar .ws { padding:5px 8px; }
          .topbar .r { gap:8px; }
          .topbar .r .notif span:not(.count) { display:none; }
          .topbar .r .notif { padding:6px 9px; }
        }
        @media (max-width: 480px) {
          .topbar { padding:8px 10px; gap:8px; }
          .topbar .ws { display:none; }
        }
      `}</style>
    </div>
  );
}

/* ─── Phase rail (shared by Workbench, Pre-Quote, Product Development) ─── */
const PHASE_RAIL_DEFAULTS = {
  develop: [
    {k:'intake',     n:'01', name:'Brief intake'},
    {k:'prequote',   n:'02', name:'Pre-quote'},
    {k:'formulation',n:'03', name:'Formulation'},
    {k:'sample',     n:'04', name:'Sample · feedback'},
    {k:'approval',   n:'05', name:'Formula approval'},
    {k:'stability',  n:'06', name:'Stability'},
    {k:'quote',      n:'07', name:'Quote · PO'},
  ],
  mfg: [
    {k:'fpapprove',  n:'08', name:'FP approval · Art'},
    {k:'co',         n:'09', name:'CO entry'},
    {k:'schedule',   n:'10', name:'Scheduling BC/AO'},
    {k:'parts',      n:'11', name:'Parts · QC'},
    {k:'bulk',       n:'12', name:'Bulk produced'},
    {k:'ao',         n:'13', name:'AO produced'},
    {k:'ship',       n:'14', name:'Ship'},
  ],
};

function PhaseRail({ phase, project, cog, iter = '04', shipIn = '74D', awaiting = '3 awaiting', develop = PHASE_RAIL_DEFAULTS.develop, mfg = PHASE_RAIL_DEFAULTS.mfg }) {
  const allKeys = [...develop.map(p=>p.k), ...mfg.map(p=>p.k)];
  const ci = allKeys.indexOf(phase);
  const statusFor = (k) => {
    const ki = allKeys.indexOf(k);
    if (ki < ci) return 'done';
    if (ki === ci) return 'now';
    return '';
  };
  return (
    <div className="phaserail">
      <div className="top">
        <div className="ttl">
          {project && <span className="code">{project.code} · BULK {project.bulkId} · FP {project.fpId}</span>}
          {project && <span className="name">{project.name}</span>}
        </div>
        <div className="right">
          <span className="mini">Iter <b>{iter}</b></span>
          {cog && <span className="mini">Theo <b>${cog}/kg</b></span>}
          <span className="mini acc"><b>{awaiting}</b></span>
          <span className="mini"><b>{shipIn}</b> to ship</span>
        </div>
      </div>
      <div className="tracks">
        <div className="track">
          <div className="lbl"><span className="tag act">▸ Develop</span></div>
          <div className="steps">
            {develop.map(p => (
              <div key={p.k} className={`step ${statusFor(p.k)}`}><div className="name">{p.name}</div></div>
            ))}
          </div>
        </div>
        <div className="div"/>
        <div className="track">
          <div className="lbl"><span className="tag">▸ Manufacture</span></div>
          <div className="steps">
            {mfg.map(p => (
              <div key={p.k} className={`step ${statusFor(p.k)}`}><div className="name">{p.name}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MrpShell — React wrapper for whole-React pages ─── */
function MrpShell({ active = 'mrp-dashboard', setActive, urgentCount = 3, hideNotif = false, workspace = 'Aldosari Studio', children }) {
  const [notifOpen, setNotifOpen] = React.useState(false);
  return (
    <>
      <GlobalSidebar active={active} setActive={setActive}/>
      <div className="app">
        <Topbar onOpenNotif={() => setNotifOpen(true)} hideNotif={hideNotif} urgentCount={urgentCount} workspace={workspace}/>
        <NotifDrawer open={notifOpen} onClose={() => setNotifOpen(false)}/>
        {children}
      </div>
    </>
  );
}

/* ─── installMrpChrome — for vanilla-HTML pages.
   Restructures the body into [sidebar][.app(topbar + original content)],
   then mounts React for the chrome only. ─── */
function installMrpChrome({ active = 'mrp-dashboard', urgentCount = 3, hideNotif = false, workspace = 'Aldosari Studio' } = {}) {
  const body = document.body;
  if (body.dataset.mrpChromeMounted === '1') return;
  body.dataset.mrpChromeMounted = '1';

  // Collect existing top-level children we want to wrap into .app
  // (skip <script>, <template>, anything we're inserting)
  const passthrough = new Set(['SCRIPT', 'TEMPLATE', 'STYLE']);
  const movable = [];
  Array.from(body.children).forEach(node => {
    if (passthrough.has(node.tagName)) return;
    if (node.id === 'mrp-globalsb' || node.id === 'mrp-app' || node.id === 'mrp-topbar') return;
    movable.push(node);
  });

  // Build mount points
  const sbMount = document.createElement('div');
  sbMount.id = 'mrp-globalsb';

  const appWrap = document.createElement('div');
  appWrap.id = 'mrp-app';
  appWrap.className = 'app';

  const tbMount = document.createElement('div');
  tbMount.id = 'mrp-topbar';

  // Place sbMount + appWrap at the front of body, then move originals into appWrap
  body.insertBefore(sbMount, body.firstChild);
  body.insertBefore(appWrap, sbMount.nextSibling);
  appWrap.appendChild(tbMount);
  movable.forEach(node => appWrap.appendChild(node));

  // Make body a flex row
  body.classList.add('mrp-chrome-root');

  // Render
  ReactDOM.createRoot(sbMount).render(<GlobalSidebar active={active}/>);
  const TopWithDrawer = () => {
    const [notifOpen, setNotifOpen] = React.useState(false);
    return (
      <>
        <Topbar onOpenNotif={() => setNotifOpen(true)} hideNotif={hideNotif} urgentCount={urgentCount} workspace={workspace}/>
        <NotifDrawer open={notifOpen} onClose={() => setNotifOpen(false)}/>
      </>
    );
  };
  ReactDOM.createRoot(tbMount).render(<TopWithDrawer/>);
}

Object.assign(window, {
  GlobalSidebar, Topbar, NotifDrawer, PhaseRail, MrpShell,
  installMrpChrome, MRP_ROUTES, PHASE_RAIL_DEFAULTS,
});
