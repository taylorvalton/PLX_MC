/* Petra Lab-X — Apothecary Homepage Sections (continued) */

/* ===========================================================
   PERIODIC TABLE — 12 hero ingredients
   =========================================================== */
const APOTHECARY_INGREDIENTS = [
  ["01","Nc","Niacinamide", "Vit. B3", "BARRIER · TONE", "active"],
  ["02","Hy","Hyaluronic Acid", "Polysaccharide", "HUMECTANT", "active"],
  ["03","Sq","Squalane", "C₃₀ Olive-derived", "EMOLLIENT", "lipid"],
  ["04","Sa","Salicylic", "BHA", "EXFOLIANT · ACID", "acid"],
  ["05","Bk","Bakuchiol", "Psoralea corylifolia", "RETINOL ALT.", "active"],
  ["06","Cf","Caffeine", "Trimethylxanthine", "VASOACTIVE", "active"],
  ["07","Cr","Ceramide NP", "Sphingolipid", "BARRIER LIPID", "lipid"],
  ["08","Pe","Pentavitin", "Saccharide isomerate", "DEEP HYDR.", "active"],
  ["09","Mg","Magnesium PCA", "Mineral salt", "MINERAL · SCALP", "mineral"],
  ["10","Pa","Panthenol", "Pro-Vit. B5", "SOOTHING", "active"],
  ["11","Ka","Kaolin", "Hydrated silicate", "CLAY · ABSORB", "clay"],
  ["12","Co","Coco-Glucoside", "C₈–C₁₆ surfactant", "WASH BASE", "surfactant"],
];

function ApothecaryPeriodic({tweaks}) {
  const {accent, hot, headlineFont} = tweaks;
  const headline = HEADLINE_FONTS[headlineFont];
  const css = `
    .ap-pd { padding: 144px 88px; border-bottom: 1px solid var(--grid); position:relative;}
    .ap-pd .head { display:flex; flex-direction:column; gap: 28px; margin-bottom: 56px;}
    .ap-pd .head .top-row { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom: 20px; border-bottom: 1px solid var(--grid);}
    .ap-pd .head h2 { font-family:${headline}; font-size: 132px; line-height: 0.95; letter-spacing:-0.025em; font-weight:400; margin: 0; max-width: 1500px;}
    .ap-pd .head h2 em { font-style:italic; color:var(--accent);}
    .ap-pd .head .meta { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted); display:flex; gap:32px; align-items:flex-start;}
    .ap-pd .head .meta .row { display:flex; gap:10px; align-items:baseline;}
    .ap-pd .head .meta .v { font-family:${headline}; font-size:14px; letter-spacing:-0.01em; text-transform:none; color:var(--ink);}
    .ap-pd .legend { display:flex; gap: 16px; align-items:center; margin-bottom: 22px; font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted);}
    .ap-pd .legend .sw { display:inline-flex; align-items:center; gap:8px;}
    .ap-pd .legend .sw .b { width:14px; height:14px; border:1px solid var(--ink);}

    .ap-pd .grid { display:grid; grid-template-columns: repeat(6, 1fr); gap: 0; border-top: 1px solid var(--ink); border-left: 1px solid var(--ink); }
    .ap-pd .pcell { aspect-ratio: 1/1; border-right: 1px solid var(--ink); border-bottom: 1px solid var(--ink); padding: 18px 18px 16px; display:flex; flex-direction:column; justify-content:space-between; background: var(--paper); transition: all .18s; cursor:pointer; position:relative; overflow:hidden;}
    .ap-pd .pcell:hover { background: var(--ink); color: var(--paper);}
    .ap-pd .pcell:hover .top { color: var(--paper); opacity:.8;}
    .ap-pd .pcell:hover .name { color: var(--paper);}
    .ap-pd .pcell:hover .label { color: rgba(243,237,225,0.7);}
    .ap-pd .pcell:hover .pcl { color: ${accent};}
    .ap-pd .pcell.feat { background: var(--accent); color: var(--paper); border-color: var(--accent);}
    .ap-pd .pcell.feat .top { color: rgba(243,237,225,0.7);}
    .ap-pd .pcell.feat .label { color: rgba(243,237,225,0.7);}
    .ap-pd .pcell.feat .pcl { color: var(--paper); opacity:.7;}
    .ap-pd .pcell.feat:hover { background: var(--ink); color: var(--paper);}

    .ap-pd .pcell .top { display:flex; justify-content:space-between; align-items:baseline; font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.18em; color: var(--muted);}
    .ap-pd .pcell .pcl { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.18em; color: var(--accent);}
    .ap-pd .pcell .symbol { font-family:${headline}; font-size: 76px; line-height:1; letter-spacing:-0.04em; margin-top: -4px;}
    .ap-pd .pcell .name { font-family:"Inter Tight",sans-serif; font-size: 16px; font-weight:500; line-height:1.15; letter-spacing:-0.01em;}
    .ap-pd .pcell .label { font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color: var(--muted); margin-top: 4px;}
  `;
  const tagOf = {
    active:'AC', lipid:'LP', acid:'AC', mineral:'MN', clay:'CL', surfactant:'SF'
  };
  return (
    <section className="ap-pd">
      <style>{css}</style>
      <div className="head">
        <div className="top-row">
          <span className="mono" style={{color:'var(--muted)'}}>/ 002 — Capabilities</span>
          <div className="meta">
            <div className="row">REGISTRY <span className="v">PLX‑INX‑12</span></div>
            <div className="row">REVIEW <span className="v">2026 Q2</span></div>
            <div className="row">ENTRIES <span className="v">12 of 412</span></div>
          </div>
        </div>
        <h2>An <em>elemental</em> catalog of the chemistries we know cold.</h2>
      </div>
      <div className="legend">
        <span className="sw"><span className="b" style={{background:accent}}></span>FEATURED</span>
        <span className="sw"><span className="b" style={{background:'var(--paper)'}}></span>STANDARD</span>
        <span className="sw"><span className="b" style={{background:hot, border:'1px solid '+hot}}></span>HOT-LIST 26</span>
        <span style={{marginLeft:'auto'}}>HOVER ANY CELL FOR FULL SPEC →</span>
      </div>
      <div className="grid">
        {APOTHECARY_INGREDIENTS.map(([n,sym,name,sub,role,cls],i)=>(
          <div className={`pcell ${i===0?'feat':''}`} key={n}>
            <div className="top">
              <span>{n}</span>
              <span className="pcl">{tagOf[cls]||'··'}</span>
            </div>
            <div>
              <div className="symbol">{sym}</div>
              <div className="name">{name}</div>
              <div className="label">{role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===========================================================
   PROCESS — the lab pipeline (A-style technical diagram)
   =========================================================== */
function ApothecaryProcess({tweaks}) {
  const {accent, hot, headlineFont, showFigCallouts, showCrosshairs} = tweaks;
  const headline = HEADLINE_FONTS[headlineFont];
  const css = `
    .ap-pr { padding: 144px 88px; background: var(--ink); color: var(--paper); border-bottom: 1px solid var(--ink);}
    .ap-pr .head { display:grid; grid-template-columns: 320px 1fr; gap: 64px; margin-bottom: 120px;}
    .ap-pr .head h2 { font-family:${headline}; font-size: 112px; line-height: 0.96; letter-spacing:-0.024em; font-weight:400; margin: 0; max-width: 1100px;}
    .ap-pr .head h2 em { font-style:italic; color: ${accent === '#0a3a2a' ? '#7ab394' : 'var(--accent)'};}
    .ap-pr .head h2 .hot-em { font-style:italic; color: var(--hot); font-family:${headline};}
    .ap-pr .head .pretitle { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color: rgba(243,237,225,0.55);}
    .ap-pr .head .blurb { display:none; }

    .ap-pr .lane { position:relative;}
    .ap-pr .axis { position:absolute; left:0; right:0; top: 96px; height:1px; background: rgba(243,237,225,0.18);}
    .ap-pr .axis-bar { position:absolute; left:0; top:96px; height:1px; background: var(--hot); width: 0; animation: laneFill 6s ease-out forwards;}
    @keyframes laneFill { from{width:0;} to{width:74%;}}
    .ap-pr .stages { display:grid; grid-template-columns: repeat(7, 1fr); gap:0; position:relative;}
    .ap-pr .stage { padding: 0 20px 0 0; position:relative;}
    .ap-pr .stage .week { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; color: rgba(243,237,225,0.55); padding-bottom: 24px;}
    .ap-pr .stage .node { width:14px; height:14px; border-radius:50%; background: var(--paper); border:1px solid var(--paper); position:relative; z-index:2; margin-bottom: 24px;}
    .ap-pr .stage.active .node { background: var(--hot); border-color: var(--hot); box-shadow: 0 0 0 6px rgba(168,58,38,0.18);}
    .ap-pr .stage.done .node { background: var(--paper);}
    .ap-pr .stage.todo .node { background: transparent;}
    .ap-pr .stage .num { font-family:"JetBrains Mono",monospace; font-size: 10px; letter-spacing:0.22em; color: rgba(243,237,225,0.55);}
    .ap-pr .stage .ttl { font-family:${headline}; font-size: 32px; line-height:1.0; letter-spacing:-0.015em; margin-top: 10px;}
    .ap-pr .stage.active .ttl em { font-style:italic; color: var(--hot);}
    .ap-pr .stage .desc { font-family:"Inter Tight",sans-serif; font-size: 13px; line-height: 1.45; color: rgba(243,237,225,0.7); margin-top: 14px; max-width: 170px;}
    .ap-pr .stage .delv { display:none; }

    .ap-pr .footer-row { display:flex; justify-content:space-between; align-items:center; margin-top: 96px; padding-top: 32px; border-top: 1px solid rgba(243,237,225,0.18);}
  `;
  const stages = [
    ["W 0",  "01", "Intake",     "Brief, brand and target market captured.",       [], "done"],
    ["W 2",  "02", "R&D Brief",  "Multiple chemistries explored in parallel.",     [], "done"],
    ["W 4",  "03", "Prototype",  "Small-batch sensory and stability rounds.",      [], "done"],
    ["W 6",  "04", "Stabilize",  "Accelerated &amp; ambient. Claims drafted.",     [], "active"],
    ["W 9",  "05", "Pilot",      "Up-scaled on the kettle that runs production.",  [], "todo"],
    ["W 12", "06", "Produce",    "Full run with in-line QC across 12 kettles.",    [], "todo"],
    ["W 14", "07", "Ship",       "Retailer-ready pallets to fulfilment.",          [], "todo"],
  ];
  return (
    <section className="ap-pr">
      <style>{css}</style>
      <div className="head">
        <div className="pretitle">/ 003 — The Petra Method</div>
        <div>
          <h2>Concept to <em>shelf</em> in <span className="hot-em">fourteen weeks.</span></h2>
          <div className="blurb" style={{display:'block', fontFamily:'"Inter Tight",sans-serif', fontSize:18, lineHeight:1.5, color:'rgba(243,237,225,0.78)', maxWidth:680, marginTop:28}}>One floor. One QMS. One chain of custody &mdash; from first sketch to final dock-out.</div>
        </div>
      </div>

      <div className="lane">
        <div className="stages">
          {stages.map(([wk,n,t,d,delv,state],i)=>(
            <div className={`stage ${state}`} key={n}>
              <div className="week">{wk}</div>
              <div className="node"/>
              <div className="num">PHASE / {n}</div>
              <div className="ttl">{state==='active' ? <><em>{t}</em></> : t}</div>
              <div className="desc" dangerouslySetInnerHTML={{__html:d}}/>
              <div className="delv">
                {delv.map(x => <span key={x}>· {x}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-row">
        <span className="mono" style={{color:'rgba(243,237,225,0.55)', letterSpacing:'0.22em', textTransform:'uppercase', fontSize:11}}>One floor · one QMS · one chain of custody</span>
        <span className="mono" style={{color:'var(--paper)', borderBottom:`1px solid var(--hot)`, paddingBottom:4, letterSpacing:'0.22em', textTransform:'uppercase', fontSize:11}}>See the full method →</span>
      </div>
    </section>
  );
}

window.ApothecaryPeriodic = ApothecaryPeriodic;
window.ApothecaryProcess = ApothecaryProcess;
window.APOTHECARY_INGREDIENTS = APOTHECARY_INGREDIENTS;
