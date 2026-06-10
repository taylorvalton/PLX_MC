/* Petra Lab-X — Apothecary Homepage (Direction B + selected A elements)
   Single desktop component, 1440px wide. */

const APOTHECARY_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#0a3a2a",
  "hot": "#d96a4a",
  "paper": "#f3ede1",
  "ink": "#0c1a14",
  "headlineFont": "Instrument Serif",
  "showTicker": true,
  "showCrosshairs": true,
  "showFigCallouts": true
}/*EDITMODE-END*/;

function useApothecaryTweaks() {
  const [t, setT] = React.useState(APOTHECARY_DEFAULTS);
  const set = (k, v) => {
    const next = typeof k === 'object' ? {...t, ...k} : {...t, [k]: v};
    setT(next);
    try { window.parent.postMessage({type:'__edit_mode_set_keys', edits: typeof k==='object'?k:{[k]:v}}, '*'); } catch(e){}
  };
  return [t, set];
}

/* ------- small bits ------- */
function ApMono({children, style, color}) {
  return <span style={{fontFamily:'"JetBrains Mono", monospace', letterSpacing:'0.18em', textTransform:'uppercase', fontSize:11, color, ...style}}>{children}</span>;
}
function ApDot({c}) {
  return <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:c,marginRight:10,verticalAlign:'middle'}}></span>;
}

/* Crosshair corners — A-direction industrial flair */
function ApCorners({color, inset=12}) {
  const s = 14;
  const st = {position:'absolute', width:s, height:s, borderColor:color};
  return (<>
    <span style={{...st, top:inset, left:inset, borderTop:'1px solid', borderLeft:'1px solid'}}/>
    <span style={{...st, top:inset, right:inset, borderTop:'1px solid', borderRight:'1px solid'}}/>
    <span style={{...st, bottom:inset, left:inset, borderBottom:'1px solid', borderLeft:'1px solid'}}/>
    <span style={{...st, bottom:inset, right:inset, borderBottom:'1px solid', borderRight:'1px solid'}}/>
  </>);
}

/* Striped placeholder image */
function ApPlaceholder({label="placeholder", height=320, ratio, accent}) {
  const style = {
    width:'100%',
    height: ratio ? 'auto' : height,
    aspectRatio: ratio,
    background: `repeating-linear-gradient(135deg, rgba(12,26,20,0.06) 0 8px, transparent 8px 16px), #ebe6d7`,
    border:'1px solid rgba(12,26,20,0.18)',
    display:'flex', alignItems:'center', justifyContent:'center',
    position:'relative'
  };
  return (
    <div style={style}>
      <ApCorners color="rgba(12,26,20,0.35)" inset={10}/>
      <span style={{fontFamily:'"JetBrains Mono", monospace', fontSize:11, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(12,26,20,0.6)'}}>
        {label}
      </span>
    </div>
  );
}

/* ===========================================================
   HEADLINE FONT MAP
   =========================================================== */
const HEADLINE_FONTS = {
  'Instrument Serif': '"Instrument Serif", "Times New Roman", serif',
  'Fraunces':         '"Fraunces", "Times New Roman", serif',
  'EB Garamond':      '"EB Garamond", "Times New Roman", serif',
  'GT Sectra':        '"Fraunces", "Times New Roman", serif', // proxy — Fraunces opt for Sectra-ish look
};

/* ===========================================================
   MAIN
   =========================================================== */
function ApothecaryHomepage({tweaks}) {
  const {accent, hot, paper, ink, headlineFont, showTicker, showCrosshairs, showFigCallouts} = tweaks;
  const headline = HEADLINE_FONTS[headlineFont] || HEADLINE_FONTS['Instrument Serif'];
  const pad = 88;
  const css = `
    .ap { --bg:${paper}; --ink:${ink}; --paper:${paper}; --paper-2:#ebe5d5; --accent:${accent}; --hot:${hot}; --muted:#5a6b5e; --grid:rgba(12,26,20,0.14); --grid-soft:rgba(12,26,20,0.08);
          background:var(--bg); color:var(--ink); font-family:"Inter Tight", system-ui, sans-serif; font-feature-settings:"ss01","cv11"; }
    .ap .serif { font-family:${headline}; }
    .ap .mono { font-family:"JetBrains Mono", monospace; letter-spacing:0.18em; text-transform:uppercase; font-size:11px; }
    .ap a { color:inherit; text-decoration:none; }
    .ap em.acc { font-family:${headline}; font-style:italic; color:var(--accent); }
    .ap em.hot { font-family:${headline}; font-style:italic; color:var(--hot); }

    /* ===== TICKER ===== */
    .ap-ticker { background:var(--ink); color:var(--paper); padding: 10px 0; overflow:hidden; white-space:nowrap; border-bottom: 1px solid var(--ink);}
    .ap-ticker-track { display:inline-block; animation: apMarq 60s linear infinite; }
    @keyframes apMarq { from { transform: translateX(0);} to { transform: translateX(-50%);}}
    .ap-ticker .it { display:inline-flex; align-items:center; gap:14px; padding: 0 24px; font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.22em; text-transform:uppercase;}
    .ap-ticker .it .b { color:var(--hot); }
    .ap-ticker .it .v { color: var(--paper); opacity:.65;}

    /* ===== NAV ===== */
    .ap-nav { position:sticky; top:0; z-index:20; padding: 22px ${pad}px; display:grid; grid-template-columns: auto 1fr auto; align-items:center; gap: 48px;
              background: rgba(243,237,225,0.94); backdrop-filter: blur(12px); border-bottom: 1px solid var(--grid);}
    .ap-nav .left { display:flex; align-items:center; gap:18px;}
    .ap-nav .lockup { display:flex; align-items:center; gap:14px;}
    .ap-nav .logo-img { height:26px; display:block;}
    .ap-nav .est { font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.22em; color:var(--muted); padding-left:14px; border-left:1px solid var(--grid); white-space:nowrap;}
    .ap-nav .center { display:flex; gap:28px; justify-content:center; font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; white-space:nowrap;}
    .ap-nav .right { display:flex; justify-content:flex-end; align-items:center; gap:18px; white-space:nowrap;}
    .ap-nav .signal { display:flex; align-items:center; gap:8px; font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted);}
    .ap-nav .signal .pulse { width:8px; height:8px; border-radius:50%; background:var(--hot); box-shadow: 0 0 0 0 ${hot}99; animation: apPulse 1.6s infinite;}
    @keyframes apPulse { 0%{box-shadow:0 0 0 0 ${hot}99;} 70%{box-shadow:0 0 0 8px ${hot}00;} 100%{box-shadow:0 0 0 0 ${hot}00;}}
    .ap-nav .portal { display:flex; align-items:center; gap:10px; font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--ink); padding: 8px 14px 8px 16px; border:1px solid var(--grid); border-radius:999px; text-decoration:none; transition: all 0.18s ease; background: transparent;}
    .ap-nav .portal:hover { border-color:var(--ink); background:var(--paper); }
    .ap-nav .portal .key { display:inline-flex; align-items:center; gap:5px; color:var(--muted);}
    .ap-nav .portal .key svg { width:10px; height:10px; display:block;}
    .ap-nav .portal .arrow { width:14px; height:1px; background:var(--ink); position:relative; margin-left:2px;}
    .ap-nav .portal .arrow::after { content:''; position:absolute; right:-1px; top:-3px; width:7px; height:7px; border-top:1px solid var(--ink); border-right:1px solid var(--ink); transform:rotate(45deg);}
    .ap-nav .cta { background:var(--ink); color:var(--paper); padding: 12px 22px; font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; border-radius: 999px; display:inline-flex; align-items:center; gap:10px;}
    .ap-nav .cta .arr { width:6px; height:6px; border-radius:50%; background:var(--hot);}

    /* ===== HERO ===== */
    .ap-hero { padding: 120px ${pad}px 0; position:relative; overflow:hidden;}
    .ap-hero .bg-grid { position:absolute; inset:0; pointer-events:none; opacity:0.5;
      background-image: linear-gradient(to right, var(--grid-soft) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-soft) 1px, transparent 1px);
      background-size: 96px 96px; }
    .ap-hero .pretitle { display:flex; align-items:center; justify-content:space-between; gap:24px; position:relative; z-index:2;}
    .ap-hero .pretitle .left { display:flex; align-items:center; gap:24px;}
    .ap-hero .pretitle .pill { padding:6px 14px; border:1px solid var(--ink); border-radius:999px; font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; display:inline-flex; align-items:center; gap:10px;}
    .ap-hero .pretitle .pill .d { width:6px; height:6px; border-radius:50%; background:var(--hot);}
    .ap-hero .pretitle .ref { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.3em; color:var(--muted); text-transform:uppercase;}

    .ap-hero h1 { font-family:${headline}; font-size: 168px; line-height: 1.08; letter-spacing:-0.025em; font-weight:400; margin: 88px 0 0; max-width: 1340px; position:relative; z-index:2;}
    .ap-hero h1 em { font-style:italic; color:var(--accent);}
    .ap-hero h1 .hot-em { font-style:italic; color:var(--hot);}

    .ap-hero .lede { display:grid; grid-template-columns: 1fr 1.1fr; gap:64px; padding: 96px 0 88px; border-bottom: 1px solid var(--grid); position:relative; z-index:2; align-items:stretch;}
    .ap-hero .lede .b { font-size: 22px; line-height: 1.4; max-width: 540px; color: var(--ink); padding-top: 18px; border-top: 1px solid var(--grid); display:flex; align-items:flex-end;}
    .ap-hero .lede .b strong { font-family:${headline}; font-style:italic; font-weight:400; color: var(--accent);}
    .ap-hero .lede .meta { display:grid; grid-template-columns: repeat(3,1fr); gap:32px; align-content:stretch;}
    .ap-hero .lede .meta > div { padding-top: 18px; border-top: 1px solid var(--grid); display:flex; flex-direction:column; justify-content:space-between;}
    .ap-hero .lede .meta .k { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color: var(--muted); display:block; margin-bottom:14px;}
    .ap-hero .lede .meta .v { font-family:${headline}; font-size: 96px; line-height:0.95; letter-spacing:-0.03em; font-variant-numeric: tabular-nums;}
    .ap-hero .lede .meta .v .u { font-family:"Inter Tight", sans-serif; font-size: 18px; color: var(--muted); margin-left:6px; letter-spacing:0; text-transform:none; font-weight:400;}

    /* hero spec card — ingredient-as-hero */
    .ap-hero .stage { padding: 88px 0 120px; display:grid; grid-template-columns: 1.4fr 1fr; gap:64px; position:relative; z-index:2;}
    .ap-hero .product-vis { background: var(--paper-2); border: 1px solid var(--grid); position:relative; aspect-ratio: 4/3; overflow:hidden;}
    .ap-hero .product-vis .crosshair { position:absolute; inset:0; pointer-events:none;}
    .ap-hero .product-vis .crosshair::before, .ap-hero .product-vis .crosshair::after { content:""; position:absolute; background: var(--grid);}
    .ap-hero .product-vis .crosshair::before { left:50%; top:0; bottom:0; width:1px;}
    .ap-hero .product-vis .crosshair::after { top:50%; left:0; right:0; height:1px;}
    .ap-hero .product-vis .label { position:absolute; font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color: var(--muted);}
    .ap-hero .product-vis .label.tl { top:18px; left:18px;}
    .ap-hero .product-vis .label.tr { top:18px; right:18px;}
    .ap-hero .product-vis .label.bl { bottom:18px; left:18px;}
    .ap-hero .product-vis .label.br { bottom:18px; right:18px;}

    .ap-hero .specs { display:flex; flex-direction:column; justify-content: space-between; padding: 8px 0;}
    .ap-hero .specs .ttl { font-family:${headline}; font-size: 56px; line-height:0.95; letter-spacing:-0.02em;}
    .ap-hero .specs .ttl em { font-style:italic; color:var(--accent);}
    .ap-hero .specs .desc { font-size: 15px; line-height:1.5; color: var(--muted); margin-top: 16px; max-width: 380px;}
    .ap-hero .specs .table { margin-top: 32px; border-top: 1px solid var(--grid);}
    .ap-hero .specs .row { display:grid; grid-template-columns: 90px 1fr 110px; padding: 14px 0; border-bottom: 1px solid var(--grid); font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; align-items:baseline;}
    .ap-hero .specs .row .k { color: var(--muted);}
    .ap-hero .specs .row .v { font-family:${headline}; font-size: 22px; line-height:1; letter-spacing:-0.01em; text-transform:none; text-align:right;}
    .ap-hero .specs .row.hot .v { color: var(--hot); font-style:italic;}
  `;
  return (
    <div className="ap" data-screen-label="Petra Lab-X · Apothecary Homepage">
      <style>{css}</style>

      {showTicker && (
        <div className="ap-ticker">
          <div className="ap-ticker-track">
            {[1,2].map(k => (
              <span key={k}>
                <span className="it"><span className="b">●</span> NOW SHIPPING <span className="v">FORMULATION INTAKE OPEN — Q3 SLOTS · 4 OF 7 REMAINING</span></span>
                <span className="it"><span className="b">/</span> SKIN <span className="v">·</span> HAIR <span className="v">·</span> BODY <span className="v">·</span> COSMETICS <span className="v">·</span> MEN'S <span className="v">·</span> PET</span>
                <span className="it"><span className="b">▲</span> R&amp;D THROUGHPUT <span className="v">+34% YoY · 1,124 ACTIVE FORMULAS</span></span>
                <span className="it"><span className="b">●</span> NEW <span className="v">CASE STUDY · MERIDIAN BOTANICALS — 0 TO 3,000 SKUs IN 11 WEEKS</span></span>
              </span>
            ))}
          </div>
        </div>
      )}

      <nav className="ap-nav">
        <div className="left">
          <div className="lockup">
            <img className="logo-img" src="assets/logo-horizontal-ink.png" alt="Petra Lab-X" />
          </div>
          <span className="est">EST. 1989 · TORONTO</span>
        </div>
        <div className="center">
          <a>Capabilities</a><a>Catalog</a><a>Facility</a><a>Process</a><a>Studies</a>
        </div>
        <div className="right">
          <span className="signal"><span className="pulse"></span>FLOOR · LIVE</span>
          <a className="portal" href="https://plxcustomer.io/login" target="_blank" rel="noopener">
            <span className="key"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2.5" y="5.5" width="7" height="5" rx="0.5"/><path d="M4 5.5V3.8a2 2 0 0 1 4 0V5.5"/></svg></span>
            Enter your workbench
            <span className="arrow"></span>
          </a>
          <span className="cta">Book intake call <span className="arr"></span></span>
        </div>
      </nav>

      {/* HERO */}
      <section className="ap-hero">
        {showCrosshairs && <div className="bg-grid"/>}
        <div className="pretitle">
          <div className="left">
            <span className="pill"><span className="d"></span>PERSONAL CARE · CONTRACT MANUFACTURING</span>
            {showFigCallouts && <span className="ref">REF · PLX-26-04 / HOMEPAGE / FIG. 01</span>}
          </div>
          <span className="ref">v.26.04 — 2026.05.03</span>
        </div>

        <h1>We accelerate the<br/>creation &amp; delivery of<br/><em>breakthrough</em> products,<br/><span className="hot-em">at scale.</span></h1>

        <div className="lede">
          <div className="b">
            Petra Lab-X is a frontier lab for <strong>personal &amp; pet care</strong>. We collaborate with the most ambitious brands on earth &mdash; surrounding their concepts with thirty-seven years of formulation, a 60,000 ft² production floor, and an in-house regulatory team that ships.
          </div>
          <div className="meta">
            <div><span className="k">Founded</span><span className="v">1989</span></div>
            <div><span className="k">Production</span><span className="v">60K<span className="u">ft²</span></span></div>
            <div><span className="k">Active formulas</span><span className="v">1,124</span></div>
          </div>
        </div>

        {/* HERO STAGE — featured ingredient + spec sheet */}
        <div className="stage">
          <div className="product-vis">
            {showCrosshairs && <div className="crosshair"/>}
            <span className="label tl">FIG. 02 · CROSS-SECTION</span>
            <span className="label tr">SCALE 1 : 1</span>
            <span className="label bl">PLX-N-014</span>
            <span className="label br">SAMPLE LOT 26-Q2-114</span>
            <IngredientCrossSection accent={accent} hot={hot} ink={ink}/>
          </div>
          <div className="specs">
            <div>
              <ApMono color="var(--muted)">/ Featured Ingredient · 014</ApMono>
              <div className="ttl" style={{marginTop:14}}>Niacinamide<br/><em>at 5%, micro-encapsulated.</em></div>
              <div className="desc">A barrier-supporting active our R&amp;D team has stabilised in 41 distinct base systems — from anhydrous balms to acid-tolerant tonics. One ingredient, one hundred routes to shelf.</div>
            </div>
            <div className="table">
              <div className="row"><span className="k">INCI</span><span></span><span className="v">Niacinamide</span></div>
              <div className="row"><span className="k">Conc. Range</span><span></span><span className="v">2 — 10%</span></div>
              <div className="row"><span className="k">pH Window</span><span></span><span className="v">5.0 — 7.0</span></div>
              <div className="row"><span className="k">Stability</span><span></span><span className="v">24 mo. ambient</span></div>
              <div className="row hot"><span className="k">Status</span><span></span><span className="v">Production-ready</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Ingredient cross-section diagram — A-direction technical diagram */
function IngredientCrossSection({accent, hot, ink}) {
  return (
    <svg viewBox="0 0 600 450" style={{width:'100%', height:'100%', display:'block'}}>
      {/* outer cell wall */}
      <circle cx="300" cy="225" r="170" fill="none" stroke={ink} strokeWidth="1" strokeDasharray="2 4" opacity="0.4"/>
      <circle cx="300" cy="225" r="150" fill="none" stroke={ink} strokeWidth="1.5"/>
      {/* inner core */}
      <circle cx="300" cy="225" r="96" fill="none" stroke={accent} strokeWidth="1"/>
      <circle cx="300" cy="225" r="56" fill={accent} opacity="0.85"/>
      <circle cx="300" cy="225" r="56" fill="none" stroke={ink} strokeWidth="1"/>
      {/* particles */}
      {Array.from({length:14}).map((_,i)=>{
        const ang = (i/14)*Math.PI*2;
        const r = 122;
        const x = 300 + Math.cos(ang)*r;
        const y = 225 + Math.sin(ang)*r;
        return <circle key={i} cx={x} cy={y} r={i%4===0?5:3} fill={i%4===0?hot:ink} opacity={i%4===0?1:0.55}/>;
      })}
      {/* callout lines */}
      <g fontFamily="JetBrains Mono" fontSize="9" letterSpacing="2" fill={ink}>
        <line x1="300" y1="225" x2="496" y2="120" stroke={ink} strokeWidth="0.7"/>
        <circle cx="300" cy="225" r="2" fill={ink}/>
        <text x="500" y="116">A · ACTIVE CORE</text>
        <text x="500" y="130" fill={accent}>5.0% NIACINAMIDE</text>

        <line x1="356" y1="225" x2="496" y2="225" stroke={ink} strokeWidth="0.7"/>
        <text x="500" y="222">B · LIPID SHELL</text>
        <text x="500" y="236" fill={accent}>SQUALANE / GMS</text>

        <line x1="450" y1="225" x2="496" y2="320" stroke={ink} strokeWidth="0.7"/>
        <text x="500" y="318">C · PHASE BOUNDARY</text>
        <text x="500" y="332" fill={accent}>pH 5.4 — 6.8</text>

        {/* left side dimension */}
        <line x1="120" y1="225" x2="148" y2="225" stroke={ink} strokeWidth="0.5"/>
        <line x1="148" y1="170" x2="148" y2="280" stroke={ink} strokeWidth="0.5"/>
        <text x="92" y="222">Ø 300nm</text>

        <text x="40" y="40" fill={hot}>● SAMPLE</text>
        <text x="40" y="54">PLX-N-014</text>
        <text x="40" y="430">PETRA LAB-X · R&amp;D</text>
      </g>
    </svg>
  );
}

/* ===========================================================
   FULL PAGE COMPOSITION
   =========================================================== */
function ApothecaryHomepageFull({tweaks}) {
  return (
    <div>
      <ApothecaryHomepage tweaks={tweaks}/>
      <div className="ap" style={{background:tweaks.paper, color:tweaks.ink}}>
        <style>{`
          .ap { --bg:${tweaks.paper}; --ink:${tweaks.ink}; --paper:${tweaks.paper}; --paper-2:#ebe5d5; --accent:${tweaks.accent}; --hot:${tweaks.hot}; --muted:#5a6b5e; --grid:rgba(12,26,20,0.14); --grid-soft:rgba(12,26,20,0.08); font-family:"Inter Tight", system-ui, sans-serif; }
        `}</style>
        <ApothecaryPeriodic tweaks={tweaks}/>
        <ApothecaryProcess tweaks={tweaks}/>
        <ApothecaryPhilosophy tweaks={tweaks}/>
        <ApothecaryPress tweaks={tweaks}/>
        <ApothecaryCTA tweaks={tweaks}/>
      </div>
    </div>
  );
}
window.ApothecaryHomepage = ApothecaryHomepage;
window.ApothecaryHomepageFull = ApothecaryHomepageFull;
window.useApothecaryTweaks = useApothecaryTweaks;
window.ApMono = ApMono;
window.ApDot = ApDot;
window.ApCorners = ApCorners;
window.ApPlaceholder = ApPlaceholder;
window.HEADLINE_FONTS = HEADLINE_FONTS;
