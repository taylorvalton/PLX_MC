/* Homepage component, 3 directions controlled by props.
   Each artboard is 1440x... full scrollable. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentA": "#ff5a1f",
  "accentB": "#0a3a2a",
  "accentC": "#c8ff2e",
  "density": "comfortable"
}/*EDITMODE-END*/;

function useTweaksHomepage() {
  const [t, setT] = React.useState(TWEAK_DEFAULTS);
  const set = (k, v) => {
    const next = typeof k === 'object' ? {...t, ...k} : {...t, [k]: v};
    setT(next);
    try { window.parent.postMessage({type:'__edit_mode_set_keys', edits: typeof k==='object'?k:{[k]:v}}, '*'); } catch(e){}
  };
  return [t, set];
}

/* ------------- Shared bits ------------- */

function Mono({children, style}) {
  return <span style={{fontFamily:'"JetBrains Mono", monospace', letterSpacing:'0.18em', textTransform:'uppercase', fontSize:11, ...style}}>{children}</span>;
}

function Dot({color}) {
  return <span style={{display:'inline-block',width:8,height:8,background:color,marginRight:8,verticalAlign:'middle'}}></span>;
}

/* ===========================================================
   DIRECTION A — SPEC SHEET (industrial/engineered)
   =========================================================== */
function HomepageSpecSheet({accent, density}) {
  const pad = density === 'compact' ? 64 : 96;
  const sectionPad = density === 'compact' ? 96 : 160;
  const css = `
    .sa { --bg:#0a0a0a; --ink:#f4f1ea; --paper:#ebe6dc; --accent:${accent}; --muted:#8a8275; --grid:rgba(244,241,234,0.08);
          background:var(--bg); color:var(--ink); font-family:"Space Grotesk", system-ui, sans-serif; }
    .sa .mono { font-family:"JetBrains Mono", monospace; letter-spacing:0.18em; text-transform:uppercase; font-size:11px; color:var(--muted);}
    .sa .nav { position:sticky; top:0; z-index:10; padding:24px ${pad}px; display:flex; justify-content:space-between; align-items:center;
               background: rgba(10,10,10,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--grid); }
    .sa .logo { font-weight:700; letter-spacing:-0.02em; font-size:20px; display:flex; align-items:center; gap:10px;}
    .sa .logo .x { color:var(--accent);}
    .sa .nav-links { display:flex; gap:40px; }
    .sa .nav-links a { color:var(--ink); text-decoration:none; font-size:13px; letter-spacing:0.06em;}
    .sa .cta-pill { border:1px solid var(--ink); padding:10px 20px; font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; display:inline-flex; align-items:center; gap:10px;}
    .sa .cta-pill .dot { width:8px; height:8px; background:var(--accent); border-radius:50%;}
    .sa .hero-frame { position:relative; height: 760px; border-bottom: 1px solid var(--grid); overflow:hidden; background:#000;}
    .sa .hero-frame iframe { width:100%; height:100%; border:0; display:block;}
    .sa .hero-marquee { border-top:1px solid var(--grid); border-bottom:1px solid var(--grid); padding:18px 0; overflow:hidden; white-space:nowrap;}
    .sa .marq-track { display:inline-block; animation: marq 40s linear infinite; }
    @keyframes marq { from { transform: translateX(0);} to { transform: translateX(-50%);}}
    .sa .marq-item { display:inline-flex; align-items:center; gap:14px; padding: 0 32px; font-family:"JetBrains Mono",monospace; font-size:13px; letter-spacing:0.2em; text-transform:uppercase; color: var(--ink);}
    .sa .marq-item .b { color:var(--accent); }

    .sa .section { padding: ${sectionPad}px ${pad}px; border-bottom: 1px solid var(--grid); position:relative;}
    .sa .sec-head { display:grid; grid-template-columns: 240px 1fr; gap:48px; margin-bottom: 56px;}
    .sa .sec-head .num { color: var(--accent); }
    .sa .sec-head h2 { font-size: 80px; line-height:0.95; letter-spacing:-0.03em; max-width: 900px; font-weight:700; margin:0;}

    /* stats */
    .sa .stats { display:grid; grid-template-columns: repeat(4, 1fr); border-top:1px solid var(--grid); }
    .sa .stat { padding: 48px 32px 56px 0; border-right: 1px solid var(--grid); position:relative;}
    .sa .stat:last-child { border-right:none; padding-right:0;}
    .sa .stat .v { font-size: 96px; font-weight:700; letter-spacing:-0.04em; line-height:1; font-variant-numeric: tabular-nums; }
    .sa .stat .v .unit { font-size: 32px; color: var(--muted); margin-left:6px; }
    .sa .stat .l { margin-top: 16px; max-width: 220px; color: var(--muted); font-size:14px; line-height:1.4;}
    .sa .stat .ln { position:absolute; top:0; left:0; right:32px; height:1px; background: var(--accent); transform-origin:left; transform: scaleX(0.0);}
    .sa .stat[data-prog="1"] .ln { transform: scaleX(0.32);}
    .sa .stat[data-prog="2"] .ln { transform: scaleX(0.78);}
    .sa .stat[data-prog="3"] .ln { transform: scaleX(0.55);}
    .sa .stat[data-prog="4"] .ln { transform: scaleX(0.92);}

    /* categories */
    .sa .cats { display:grid; grid-template-columns: repeat(3, 1fr); border-top:1px solid var(--grid); border-left:1px solid var(--grid);}
    .sa .cat { border-right:1px solid var(--grid); border-bottom:1px solid var(--grid); padding: 40px; min-height: 320px; display:flex; flex-direction:column; justify-content:space-between; position:relative; transition: background .3s;}
    .sa .cat:hover { background: var(--accent); color:#0a0a0a;}
    .sa .cat:hover .ctag { color:#0a0a0a;}
    .sa .cat .ctop { display:flex; justify-content:space-between; align-items:flex-start;}
    .sa .cat .num { color:var(--accent); }
    .sa .cat:hover .num { color:#0a0a0a;}
    .sa .cat .name { font-size: 56px; font-weight:500; letter-spacing:-0.02em; line-height:0.95;}
    .sa .cat .ctag { color: var(--muted); font-size: 12px; line-height:1.6; max-width: 280px;}
    .sa .cat .arrow { width:36px; height:36px; border:1px solid currentColor; border-radius:50%; display:flex; align-items:center; justify-content:center;}

    /* facility */
    .sa .fac { display:grid; grid-template-columns: 1.1fr 1fr; gap: 80px; align-items: stretch; }
    .sa .fac-vis { border:1px solid var(--grid); position:relative; aspect-ratio: 5/4; padding: 32px;}
    .sa .fac-vis svg { width:100%; height:100%; }
    .sa .fac-list { display:flex; flex-direction:column; justify-content:center; gap: 0;}
    .sa .fac-row { display:grid; grid-template-columns: 80px 1fr 200px; padding: 28px 0; border-bottom: 1px solid var(--grid); align-items:baseline; gap:24px;}
    .sa .fac-row:first-child { border-top:1px solid var(--grid);}
    .sa .fac-row .k { font-size: 13px; letter-spacing:0.2em; text-transform:uppercase; color:var(--accent); font-family:"JetBrains Mono",monospace;}
    .sa .fac-row .label { font-size: 28px; letter-spacing:-0.01em;}
    .sa .fac-row .val { font-size: 42px; font-weight:700; text-align:right; font-variant-numeric: tabular-nums; letter-spacing:-0.02em;}

    /* certs */
    .sa .certs { display:grid; grid-template-columns: repeat(6, 1fr); gap:0; border-top:1px solid var(--grid); border-left:1px solid var(--grid);}
    .sa .cert { aspect-ratio: 1/1; border-right:1px solid var(--grid); border-bottom:1px solid var(--grid); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:24px; text-align:center;}
    .sa .cert .badge { width:64px; height:64px; border:1px solid var(--ink); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.1em;}
    .sa .cert .txt { font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--muted); line-height:1.4;}

    /* retailers */
    .sa .retail { display:grid; grid-template-columns: repeat(8, 1fr); border-top:1px solid var(--grid);}
    .sa .ret { aspect-ratio:2/1; border-right:1px solid var(--grid); display:flex; align-items:center; justify-content:center; font-family:"PP Neue Montreal", "Space Grotesk", sans-serif; font-weight: 600; font-size:18px; letter-spacing:-0.01em; color: var(--ink); opacity:.8;}
    .sa .ret:last-child { border-right:none;}

    /* CTA section */
    .sa .cta-block { padding: 200px ${pad}px; text-align:center; border-bottom: 1px solid var(--grid);}
    .sa .cta-block h2 { font-size: 200px; line-height:.92; letter-spacing:-0.04em; font-weight:700; max-width: 1400px; margin: 0 auto;}
    .sa .cta-block h2 em { font-family:"Instrument Serif", serif; font-style:italic; color: var(--accent); font-weight:400;}
    .sa .cta-block .big-btn { display:inline-flex; align-items:center; gap:16px; margin-top: 64px; border:1px solid var(--ink); padding: 28px 56px; font-family:"JetBrains Mono",monospace; font-size: 14px; letter-spacing:0.3em; text-transform:uppercase; cursor:pointer;}
    .sa .cta-block .big-btn .dot { width:10px; height:10px; background:var(--accent); border-radius:50%;}

    .sa footer { padding: ${pad}px ${pad}px 56px; display:grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap:48px; border-bottom:none;}
    .sa footer h4 { font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); margin-bottom:16px;}
    .sa footer ul { list-style:none; padding:0;}
    .sa footer li { padding: 6px 0; font-size:14px;}
    .sa footer .ftr-logo { font-size:48px; font-weight:700; letter-spacing:-0.03em;}
    .sa footer .ftr-logo .x { color: var(--accent);}
    .sa .baseline { padding: 16px ${pad}px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--grid);}
  `;
  return (
    <div className="sa" data-screen-label="A · Spec Sheet">
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="logo">PETRA <span className="x">/X</span></div>
        <div className="nav-links">
          <a>Capabilities</a><a>Categories</a><a>Facility</a><a>Case Studies</a><a>Insights</a>
        </div>
        <div className="cta-pill"><span className="dot"></span>BOOK A CALL</div>
      </nav>

      {/* HERO ANIMATION */}
      <div className="hero-frame">
        <iframe src={`hero-spec-sheet.html#accent=${encodeURIComponent(accent)}`} />
      </div>

      {/* MARQUEE */}
      <div className="hero-marquee">
        <div className="marq-track">
          {[1,2].map(k=>(
            <span key={k}>
              <span className="marq-item"><span className="b">/</span> SKINCARE</span>
              <span className="marq-item"><span className="b">/</span> HAIRCARE</span>
              <span className="marq-item"><span className="b">/</span> BODY</span>
              <span className="marq-item"><span className="b">/</span> COSMETICS</span>
              <span className="marq-item"><span className="b">/</span> MEN'S GROOMING</span>
              <span className="marq-item"><span className="b">/</span> ORAL CARE</span>
              <span className="marq-item"><span className="b">/</span> PET CARE</span>
              <span className="marq-item"><span className="b">/</span> AT SCALE &amp; SPEED</span>
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="section">
        <div className="sec-head">
          <span className="mono"><span className="num">/ 001</span> &nbsp;BY THE NUMBERS</span>
          <h2>Three decades, four warehouses, ten thousand formulas under our belt.</h2>
        </div>
        <div className="stats">
          <div className="stat" data-prog="1"><span className="ln"></span>
            <div className="v">30<span className="unit">YR</span></div>
            <div className="l">Continuous formulation experience under one roof.</div>
          </div>
          <div className="stat" data-prog="2"><span className="ln"></span>
            <div className="v">60K<span className="unit">FT²</span></div>
            <div className="l">GMP-certified production floor with 12 kettles + 10 fill lines.</div>
          </div>
          <div className="stat" data-prog="3"><span className="ln"></span>
            <div className="v">1,000<span className="unit">+</span></div>
            <div className="l">Active formulas across skin, hair, body, oral, men's &amp; pet.</div>
          </div>
          <div className="stat" data-prog="4"><span className="ln"></span>
            <div className="v">04</div>
            <div className="l">Warehouses serving North America, EU and APAC retailers.</div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="sec-head">
          <span className="mono"><span className="num">/ 002</span> &nbsp;CATEGORIES</span>
          <h2>What we manufacture &mdash; from concept brief to retail-ready pallet.</h2>
        </div>
        <div className="cats">
          {[
            ["01","Skin Care","Serums · creams · masks · treatments. SLS-free, fragrance-free and clean-at-Sephora compliant."],
            ["02","Hair Care","Shampoo · conditioner · leave-in · color-safe · scalp serum. Sulfate-free chemistries our specialty."],
            ["03","Body Care","Wash · lotion · scrub · bar. Whipped, cold-process, foam, bar — every base we've built before."],
            ["04","Cosmetics","Niche & indie color, lip, brow, base. Niche batch sizes for emerging brands; volume runs for retail."],
            ["05","Men's Grooming","Beard · shave · skin · scalp. The category we've grown more than any other since 2020."],
            ["06","Pet Care","Shampoo · spritz · wipes · paw balm. Naturally pH-balanced, retailer-ready packaging formats."],
          ].map(([n,name,desc])=>(
            <div className="cat" key={n}>
              <div className="ctop">
                <span className="mono num">{n}</span>
                <span className="arrow">→</span>
              </div>
              <div className="name">{name}</div>
              <div className="ctag">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FACILITY */}
      <section className="section">
        <div className="sec-head">
          <span className="mono"><span className="num">/ 003</span> &nbsp;FACILITY</span>
          <h2>One floor. Twelve kettles. Ten lines. From R&amp;D to dock-out without leaving the building.</h2>
        </div>
        <div className="fac">
          <div className="fac-vis">
            <span className="mono" style={{position:'absolute',top:32,left:32}}>PLAN VIEW · 1:600</span>
            <span className="mono" style={{position:'absolute',top:32,right:32}}>NORTH ↑</span>
            <svg viewBox="0 0 600 480">
              {/* outline */}
              <rect x="40" y="40" width="520" height="400" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
              <rect x="50" y="50" width="500" height="380" fill="none" stroke="rgba(244,241,234,0.5)" strokeWidth="1"/>
              {/* zones */}
              <text x="60" y="80" fill="rgba(244,241,234,0.5)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">R&amp;D LAB · 4,200 ft²</text>
              <line x1="50" y1="90" x2="200" y2="90" stroke="rgba(244,241,234,0.2)"/>
              {/* kettles */}
              <g>
                {Array.from({length:12}).map((_,i)=>{
                  const x = 80 + i*38; const cy = 200;
                  const hot = i===6;
                  return <g key={i}>
                    <circle cx={x} cy={cy} r="14" fill="none" stroke={hot?accent:"#f4f1ea"} strokeWidth={hot?1.5:1}/>
                    <text x={x} y={cy+4} fontSize="8" fill="#f4f1ea" textAnchor="middle" fontFamily="JetBrains Mono">K{String(i+1).padStart(2,'0')}</text>
                  </g>;
                })}
              </g>
              <text x="60" y="180" fill="rgba(244,241,234,0.5)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">12 × KETTLE</text>
              {/* fill lines */}
              <g stroke="#f4f1ea" strokeWidth="0.7" fill="none">
                {[0,1,2,3,4,5,6,7,8,9].map(i=>(
                  <line key={i} x1="80" y1={260+i*16} x2="520" y2={260+i*16}/>
                ))}
              </g>
              <text x="60" y="248" fill="rgba(244,241,234,0.5)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">10 × FILL</text>
              {/* moving particle */}
              <circle cx="80" cy="324" r="3" fill={accent}>
                <animate attributeName="cx" values="80;520;80" dur="6s" repeatCount="indefinite"/>
              </circle>
              {/* cooling */}
              <line x1="80" y1="430" x2="520" y2="430" stroke={accent} strokeWidth="1"/>
              <text x="60" y="425" fill={accent} fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">COOLING</text>
            </svg>
          </div>
          <div className="fac-list">
            <div className="fac-row"><span className="k">A</span><span className="label">R&amp;D Lab</span><span className="val">4,200 ft²</span></div>
            <div className="fac-row"><span className="k">B</span><span className="label">Kettles</span><span className="val">12</span></div>
            <div className="fac-row"><span className="k">C</span><span className="label">Filling Lines</span><span className="val">10</span></div>
            <div className="fac-row"><span className="k">D</span><span className="label">Cooling Line</span><span className="val">1</span></div>
            <div className="fac-row"><span className="k">E</span><span className="label">Pick &amp; Pack</span><span className="val">14k ft²</span></div>
            <div className="fac-row"><span className="k">F</span><span className="label">Cold Storage</span><span className="val">2,400 ft²</span></div>
            <div className="fac-row"><span className="k">G</span><span className="label">Total Footprint</span><span className="val">60,000 ft²</span></div>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="section">
        <div className="sec-head">
          <span className="mono"><span className="num">/ 004</span> &nbsp;COMPLIANCE</span>
          <h2>Certifications &amp; retailer standards we formulate to.</h2>
        </div>
        <div className="certs">
          {[
            ["GMP","ISO 22716"],
            ["CLN","Clean at Sephora"],
            ["VEG","Certified Vegan"],
            ["CRF","Cruelty Free"],
            ["WFM","Whole Foods · Premium Body Care"],
            ["CRD","Credo Clean Standard"],
            ["EWG","EWG Verified"],
            ["FDA","FDA Registered"],
            ["FSC","FSC Packaging"],
            ["ECO","ECOCERT Compatible"],
            ["GLU","Gluten Free"],
            ["NUT","Nut Free"],
          ].map(([k,v])=>(
            <div className="cert" key={k}>
              <div className="badge">{k}</div>
              <div className="txt">{v}</div>
            </div>
          ))}
        </div>
        {/* retailers */}
        <div className="retail" style={{marginTop:96}}>
          {["SEPHORA","TARGET","WHOLE FOODS","ULTA","SHOPPERS","DETOX MARKET","CREDO","HOLT RENFREW"].map(r=>(
            <div className="ret" key={r}>{r}</div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-block">
        <span className="mono"><Dot color={accent}/>BRING YOURS TO LIFE</span>
        <h2 style={{marginTop:48}}>Concept to&nbsp;shelf,<br/><em>at speed.</em></h2>
        <div className="big-btn"><span className="dot"></span>BOOK A DISCOVERY CALL →</div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="ftr-logo">PETRA<span className="x">/X</span></div>
          <p style={{marginTop:24, color:'#8a8275', maxWidth:320, fontSize:14, lineHeight:1.5}}>Multi-national contract manufacturer of personal &amp; pet care for the world's best brands.</p>
        </div>
        <div><h4>Capabilities</h4><ul><li>R&amp;D</li><li>Manufacturing</li><li>Filling &amp; Pack</li><li>Fulfilment</li></ul></div>
        <div><h4>Categories</h4><ul><li>Skin</li><li>Hair</li><li>Body</li><li>Pet</li></ul></div>
        <div><h4>Company</h4><ul><li>About</li><li>Insights</li><li>Careers</li><li>Press</li></ul></div>
        <div><h4>Contact</h4><ul><li>hello@petralabx.com</li><li>+1 416 000 0000</li><li>Toronto · Toledo · Miami · Rotterdam</li></ul></div>
      </footer>
      <div className="baseline">
        <span className="mono">© 2026 PETRA LAB-X</span>
        <span className="mono">GMP · ISO 22716 · TORONTO HQ</span>
        <span className="mono">v.26.04</span>
      </div>
    </div>
  );
}

/* ===========================================================
   DIRECTION B — APOTHECARY LAB (clinical, ingredient-as-hero)
   =========================================================== */
function HomepageApothecary({accent, density}) {
  const pad = density === 'compact' ? 56 : 88;
  const sectionPad = density === 'compact' ? 96 : 144;
  const css = `
    .sb { --bg:#f4f0e6; --ink:#0c1a14; --paper:#ebe6d7; --accent:${accent}; --muted:#586b5c; --grid:rgba(12,26,20,0.12);
          background:var(--bg); color:var(--ink); font-family:"Instrument Serif", "Times New Roman", serif; }
    .sb .mono { font-family:"JetBrains Mono", monospace; letter-spacing:0.18em; text-transform:uppercase; font-size:11px; color:var(--muted);}
    .sb .sans { font-family:"Space Grotesk", system-ui, sans-serif;}
    .sb .nav { position:sticky; top:0; z-index:10; padding:24px ${pad}px; display:flex; justify-content:space-between; align-items:center;
               background: rgba(244,240,230,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--grid); }
    .sb .logo { font-family:"Instrument Serif",serif; font-size:32px; line-height:1; letter-spacing:-0.02em; }
    .sb .logo small { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.3em; vertical-align: middle; margin-left:10px; color: var(--muted);}
    .sb .nav-links { display:flex; gap:32px; font-family:"JetBrains Mono", monospace; font-size:11px; letter-spacing:0.2em; text-transform:uppercase;}
    .sb .nav-links a { color:var(--ink); text-decoration:none;}
    .sb .cta-pill { background: var(--ink); color: var(--bg); padding: 12px 22px; font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; border-radius: 999px;}

    /* HERO */
    .sb .hero { padding: 96px ${pad}px 0; position:relative;}
    .sb .hero .pretitle { display:flex; align-items:center; gap:20px;}
    .sb .hero h1 { font-family:"Instrument Serif", serif; font-size: 200px; line-height: 0.92; letter-spacing:-0.025em; font-weight: 400; margin: 32px 0 0; max-width: 1500px;}
    .sb .hero h1 em { font-style:italic; color: var(--accent);}
    .sb .hero .lede { display:grid; grid-template-columns: 1fr 1fr; gap:80px; padding: 48px 0 64px; border-bottom: 1px solid var(--grid);}
    .sb .hero .lede .b { font-family:"Space Grotesk",sans-serif; font-size: 22px; line-height: 1.45; max-width: 540px;}
    .sb .hero .lede .meta { display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; align-content:end;}
    .sb .hero .lede .meta .k { font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); display:block;}
    .sb .hero .lede .meta .v { font-family:"Instrument Serif",serif; font-size: 36px; line-height:1; margin-top:8px;}
    .sb .hero-frame { height: 640px; margin: 0 -${pad}px; border-top: 1px solid var(--grid); border-bottom: 1px solid var(--grid); background: #0a0a0a; overflow:hidden;}
    .sb .hero-frame iframe { width:100%; height:100%; border:0; display:block;}

    /* periodic table */
    .sb .periodic-section { padding: ${sectionPad}px ${pad}px; border-bottom: 1px solid var(--grid);}
    .sb .sec-head { display:grid; grid-template-columns: 320px 1fr; gap: 80px; margin-bottom: 64px;}
    .sb .sec-head .k { font-family:"JetBrains Mono", monospace; font-size:11px; letter-spacing: 0.2em; text-transform:uppercase; color:var(--muted);}
    .sb .sec-head h2 { font-family:"Instrument Serif", serif; font-size: 84px; line-height: 0.95; letter-spacing:-0.02em; font-weight:400; margin: 0; max-width: 920px;}
    .sb .sec-head h2 em { font-style:italic; color:var(--accent);}
    .sb .periodic { display:grid; grid-template-columns: repeat(6, 1fr); gap: 12px;}
    .sb .pcell { aspect-ratio: 1/1; border:1px solid var(--ink); padding: 18px; display:flex; flex-direction:column; justify-content:space-between; background: var(--paper); transition: all 0.2s;}
    .sb .pcell:hover { background: var(--ink); color: var(--bg);}
    .sb .pcell .top { display:flex; justify-content:space-between; align-items:baseline; font-family:"JetBrains Mono",monospace; font-size:11px;}
    .sb .pcell .symbol { font-family:"Instrument Serif",serif; font-size: 64px; line-height:1; letter-spacing:-0.03em; }
    .sb .pcell .label { font-family:"Space Grotesk",sans-serif; font-size: 13px; line-height:1.2;}
    .sb .pcell.acc { background: var(--accent); color: var(--bg);}
    .sb .pcell.acc:hover { background: var(--ink); color: var(--bg);}
    .sb .pcell.dim { background: transparent; opacity:.45;}

    /* facility data sheet */
    .sb .data-sheet { padding: ${sectionPad}px ${pad}px; background: var(--ink); color: var(--bg); border-bottom: 1px solid var(--grid);}
    .sb .data-sheet .sec-head h2 { color: var(--bg);}
    .sb .data-sheet .sec-head h2 em { color: var(--accent);}
    .sb .data-sheet .sec-head .k { color: rgba(244,240,230,0.6);}
    .sb .ds-rows { border-top: 1px solid rgba(244,240,230,0.18);}
    .sb .ds-row { display:grid; grid-template-columns: 100px 1fr 200px 320px; gap: 32px; padding: 32px 0; border-bottom: 1px solid rgba(244,240,230,0.12); align-items:baseline;}
    .sb .ds-row .id { font-family:"JetBrains Mono",monospace; color: var(--accent); font-size: 13px; letter-spacing:0.2em;}
    .sb .ds-row .name { font-family:"Instrument Serif",serif; font-size: 36px; line-height:1; letter-spacing:-0.01em;}
    .sb .ds-row .val { font-family:"Instrument Serif",serif; font-size: 56px; line-height:1; letter-spacing:-0.02em; font-variant-numeric:tabular-nums;}
    .sb .ds-row .desc { font-family:"Space Grotesk",sans-serif; font-size: 14px; line-height:1.5; color: rgba(244,240,230,0.6);}

    /* certifications */
    .sb .compliance { padding: ${sectionPad}px ${pad}px; border-bottom: 1px solid var(--grid);}
    .sb .seals { display:grid; grid-template-columns: repeat(4, 1fr); gap: 0; border-top:1px solid var(--grid); border-left: 1px solid var(--grid);}
    .sb .seal { aspect-ratio: 1/1; border-right: 1px solid var(--grid); border-bottom: 1px solid var(--grid); padding: 32px; display:flex; flex-direction:column; justify-content:space-between;}
    .sb .seal .stamp { width:88px; height:88px; border:1.5px solid var(--ink); border-radius:50%; display:flex; align-items:center; justify-content:center; position:relative;}
    .sb .seal .stamp .inner { width: 70px; height:70px; border:1px solid var(--ink); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:"Instrument Serif",serif; font-size: 22px; line-height:1; text-align:center;}
    .sb .seal .ttl { font-family:"Instrument Serif",serif; font-size: 28px; line-height:1; letter-spacing:-0.01em;}
    .sb .seal .sub { font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--muted); margin-top:6px;}
    .sb .retailers-row { margin-top: 96px; display:grid; grid-template-columns: repeat(8, 1fr); gap:0; border-top:1px solid var(--grid);}
    .sb .retailers-row .ret { aspect-ratio: 2/1; border-right:1px solid var(--grid); display:flex; align-items:center; justify-content:center; font-family:"Instrument Serif",serif; font-size:22px; letter-spacing:-0.01em;}
    .sb .retailers-row .ret:last-child { border-right:none;}

    /* CTA */
    .sb .cta-block { padding: 200px ${pad}px; text-align:center;}
    .sb .cta-block .pretag { display:inline-flex; align-items:center; gap:14px;}
    .sb .cta-block h2 { font-family:"Instrument Serif",serif; font-size: 220px; line-height: .92; letter-spacing:-0.03em; font-weight:400; margin:32px 0 0; max-width: 1500px; margin-left:auto; margin-right:auto;}
    .sb .cta-block h2 em { font-style:italic; color: var(--accent);}
    .sb .cta-block .button { display:inline-flex; align-items:center; gap:14px; margin-top: 56px; background: var(--ink); color: var(--bg); padding: 28px 48px; border-radius: 999px; font-family:"JetBrains Mono",monospace; font-size: 13px; letter-spacing:0.3em; text-transform:uppercase;}
    .sb .cta-block .button .arr { width:24px; height:24px; border-radius:50%; background: var(--accent); display:flex; align-items:center; justify-content:center; color: var(--ink);}

    .sb footer { padding: 80px ${pad}px 32px; border-top: 1px solid var(--grid); display:grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 48px;}
    .sb footer h4 { font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); margin-bottom:20px;}
    .sb footer ul { list-style:none; padding:0; font-family:"Space Grotesk",sans-serif; font-size:14px;}
    .sb footer li { padding: 6px 0;}
    .sb .foot-mark { font-family:"Instrument Serif",serif; font-size: 64px; letter-spacing:-0.03em; line-height:1;}
    .sb .baseline { padding: 24px ${pad}px; border-top: 1px solid var(--grid); display:flex; justify-content:space-between; font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted);}
  `;
  return (
    <div className="sb" data-screen-label="B · Apothecary Lab">
      <style>{css}</style>

      <nav className="nav">
        <div className="logo">Petra<em style={{fontStyle:'italic',color:accent}}>/x</em><small>EST. 1995</small></div>
        <div className="nav-links"><a>Capabilities</a><a>Catalog</a><a>Facility</a><a>Studies</a><a>Journal</a></div>
        <div className="cta-pill">Book a Call →</div>
      </nav>

      <section className="hero">
        <div className="pretitle">
          <span className="mono"><Dot color={accent}/>PERSONAL CARE · CONTRACT MANUFACTURING</span>
        </div>
        <h1>The lab where<br/>your <em>breakthrough</em><br/>becomes&nbsp;product.</h1>
        <div className="lede">
          <div className="b">Petra Lab-X is a multi-national contract manufacturer for the most ambitious skin, hair, body and pet care brands &mdash; surrounding your concept with thirty years of formulation, a 60,000 ft² floor, and an in-house regulatory team.</div>
          <div className="meta">
            <div><span className="k">Founded</span><span className="v">1995</span></div>
            <div><span className="k">Production</span><span className="v">60K ft²</span></div>
            <div><span className="k">Formulas</span><span className="v">1,000+</span></div>
          </div>
        </div>
        <div className="hero-frame">
          <iframe src={`hero-spec-sheet.html#accent=${encodeURIComponent(accent)}`} />
        </div>
      </section>

      {/* PERIODIC TABLE OF CATEGORIES */}
      <section className="periodic-section">
        <div className="sec-head">
          <span className="k">/ 002 — Capabilities</span>
          <h2>An <em>elemental</em> catalog of categories &amp; chemistries we know cold.</h2>
        </div>
        <div className="periodic">
          {[
            ["01","Sk","Skin Care","Serum · Cream · Mask",""],
            ["02","Hr","Hair Care","Shampoo · Conditioner",""],
            ["03","Bd","Body Care","Wash · Lotion · Bar","acc"],
            ["04","Cs","Cosmetics","Color · Lip · Brow",""],
            ["05","Mn","Men's","Beard · Shave · Skin",""],
            ["06","Pt","Pet Care","Shampoo · Spritz",""],
            ["07","Or","Oral Care","Paste · Rinse · Gum","dim"],
            ["08","Bb","Baby","Wash · Balm · Wipe","dim"],
            ["09","Sn","Sun","SPF · After-sun","dim"],
            ["10","Fr","Fragrance","Eau · Roll-on","dim"],
            ["11","Sp","Spa","Salt · Soak · Mist","dim"],
            ["12","Wp","Wipes","Cleansing · Cosmetic","dim"],
          ].map(([n,sym,name,sub,cls])=>(
            <div className={`pcell ${cls}`} key={n}>
              <div className="top"><span>{n}</span><span>—</span></div>
              <div>
                <div className="symbol">{sym}</div>
                <div className="label">{name}<br/><span className="mono" style={{fontSize:9,color:'inherit',opacity:.7}}>{sub}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FACILITY DATA SHEET */}
      <section className="data-sheet">
        <div className="sec-head">
          <span className="k">/ 003 — Facility Datasheet</span>
          <h2>Twelve kettles. Ten lines. <em>One floor.</em></h2>
        </div>
        <div className="ds-rows">
          {[
            ["A.01","R&D Laboratory","4,200 ft²","Bench formulation · stability oven · regulatory desk."],
            ["B.01","Process Kettles","12 units","2,500L max · steam &amp; jacket · vacuum capable."],
            ["C.01","Filling Lines","10 lines","Bottle · tube · jar · sachet · roll-on · pump."],
            ["C.02","Cooling Line","1","In-line cool tunnel for hot-pour bars and sticks."],
            ["D.01","Pick & Pack","14,000 ft²","Auto-cartoner · shrink · variety pack assembly."],
            ["E.01","Cold Storage","2,400 ft²","Volatile actives, probiotics, fragrance reserve."],
            ["F.01","Warehouses","04 global","Toronto · Toledo · Miami · Rotterdam."],
            ["G.01","Total Footprint","60,000 ft²","Single building, single QMS, single chain of custody."],
          ].map(([id,name,val,desc])=>(
            <div className="ds-row" key={id}>
              <span className="id">{id}</span>
              <span className="name">{name}</span>
              <span className="val">{val}</span>
              <span className="desc">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* COMPLIANCE / SEALS */}
      <section className="compliance">
        <div className="sec-head">
          <span className="k">/ 004 — Compliance &amp; Standards</span>
          <h2>Built to the <em>strictest</em> retailer standards in the category.</h2>
        </div>
        <div className="seals">
          {[
            ["GMP","ISO 22716","2007 Edition"],
            ["✦","Clean at Sephora","Standard 2024"],
            ["✿","Certified Vegan","No animal-derived ingredients"],
            ["⚘","Cruelty Free","Leaping Bunny program"],
            ["WF","Whole Foods Premium","Body Care eligible"],
            ["CR","Credo Clean","Standard met"],
            ["EW","EWG Verified","Eligible formulas"],
            ["FSC","FSC Packaging","Chain of custody"],
          ].map(([sym,ttl,sub])=>(
            <div className="seal" key={ttl}>
              <div className="stamp"><div className="inner">{sym}</div></div>
              <div>
                <div className="ttl">{ttl}</div>
                <div className="sub">{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="retailers-row">
          {["Sephora","Target","Whole Foods","Ulta","Shoppers","Detox Market","Credo","Holt Renfrew"].map(r=>(
            <div className="ret" key={r}>{r}</div>
          ))}
        </div>
      </section>

      <section className="cta-block">
        <span className="pretag mono"><Dot color={accent}/>BRING YOURS TO LIFE</span>
        <h2>Concept&nbsp;to&nbsp;shelf,<br/><em>at&nbsp;speed.</em></h2>
        <div className="button">BOOK A DISCOVERY CALL <span className="arr">→</span></div>
      </section>

      <footer>
        <div>
          <div className="foot-mark">Petra<em style={{fontStyle:'italic',color:accent}}>/x</em></div>
          <p style={{fontFamily:'"Space Grotesk",sans-serif',marginTop:24, color:'#586b5c', maxWidth:340, fontSize:14, lineHeight:1.5}}>The product accelerator for the world's most ambitious personal &amp; pet care brands.</p>
        </div>
        <div><h4>Capabilities</h4><ul><li>R&amp;D</li><li>Manufacturing</li><li>Filling</li><li>Fulfilment</li></ul></div>
        <div><h4>Categories</h4><ul><li>Skin</li><li>Hair</li><li>Body</li><li>Pet</li></ul></div>
        <div><h4>Company</h4><ul><li>About</li><li>Insights</li><li>Careers</li><li>Press</li></ul></div>
        <div><h4>Contact</h4><ul><li>hello@petralabx.com</li><li>+1 416 000 0000</li><li>4 cities · global</li></ul></div>
      </footer>
      <div className="baseline">
        <span>© 2026 PETRA LAB-X</span>
        <span>GMP · ISO 22716</span>
        <span>v.26.04</span>
      </div>
    </div>
  );
}

/* ===========================================================
   DIRECTION C — KINETIC (bold, saturated, motion-forward)
   =========================================================== */
function HomepageKinetic({accent, density}) {
  const pad = density === 'compact' ? 56 : 80;
  const sectionPad = density === 'compact' ? 88 : 144;
  const css = `
    .sc { --bg:#0d0d0e; --ink:#fafafa; --paper:#ebe6dc; --accent:${accent}; --muted:#7c7c7c; --grid:rgba(250,250,250,0.08);
          background:var(--bg); color:var(--ink); font-family:"PP Neue Montreal","Space Grotesk", system-ui, sans-serif;}
    .sc .mono { font-family:"JetBrains Mono", monospace; letter-spacing:0.18em; text-transform:uppercase; font-size:11px; color:var(--muted);}
    .sc .nav { position:sticky; top:0; z-index:10; padding: 20px ${pad}px; display:flex; justify-content:space-between; align-items:center;
               background: rgba(13,13,14,0.85); backdrop-filter: blur(12px);}
    .sc .logo { font-weight:800; letter-spacing:-0.04em; font-size:28px;}
    .sc .logo .x { color: var(--accent);}
    .sc .nav-links { display:flex; gap: 8px;}
    .sc .nav-links a { padding: 8px 14px; border-radius: 999px; font-size:13px; color:var(--ink); text-decoration:none;}
    .sc .nav-links a:hover { background: var(--accent); color: #0d0d0e;}
    .sc .cta-pill { background: var(--accent); color: #0d0d0e; padding: 14px 22px; font-weight: 600; border-radius: 999px; font-size: 13px; letter-spacing: 0.04em;}

    /* HERO */
    .sc .hero { padding: 56px ${pad}px 32px; position:relative;}
    .sc .hero h1 { font-size: 280px; line-height: 0.86; letter-spacing:-0.045em; font-weight: 800; margin: 0; text-transform: uppercase;}
    .sc .hero h1 .a { color: var(--accent); display: inline-block;}
    .sc .hero h1 .out { -webkit-text-stroke: 2px var(--ink); color: transparent; }
    .sc .hero .row { display:flex; justify-content:space-between; align-items:flex-end; margin-top: 32px; gap: 48px;}
    .sc .hero .row .lede { max-width: 540px; font-size: 22px; line-height: 1.4; color: rgba(250,250,250,0.85);}
    .sc .hero .row .meta { display:grid; grid-template-columns: repeat(3, auto); gap: 32px;}
    .sc .hero .row .meta .v { font-size: 56px; font-weight: 800; line-height:1; letter-spacing:-0.04em; font-variant-numeric: tabular-nums;}
    .sc .hero .row .meta .v .u { font-size:18px; color: var(--muted); margin-left:4px;}
    .sc .hero .row .meta .k { font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color: var(--muted); display:block; margin-top:8px;}
    .sc .hero-frame { margin: 32px -${pad}px 0; height: 600px; background:#000; overflow: hidden; position:relative;}
    .sc .hero-frame iframe { width:100%; height:100%; border:0; display:block;}
    .sc .hero-frame .corner-tag { position:absolute; top: 24px; left: 24px; font-family:"JetBrains Mono",monospace; font-size: 10px; letter-spacing:0.2em; text-transform:uppercase; color: var(--accent); z-index:2;}

    /* MARQUEE — kinetic */
    .sc .mq { padding: 32px 0; overflow:hidden; background: var(--accent); color:#0d0d0e; border-top: 8px solid var(--bg); border-bottom: 8px solid var(--bg);}
    .sc .mq-track { white-space: nowrap; display: inline-block; animation: marqC 28s linear infinite; font-size: 88px; font-weight: 800; letter-spacing:-0.03em; text-transform: uppercase;}
    @keyframes marqC { from { transform: translateX(0);} to { transform: translateX(-50%);}}
    .sc .mq-track .sep { display:inline-block; width: 56px; vertical-align: middle; }
    .sc .mq-track .sep::before { content: "✦"; font-size: 56px; }

    /* STATS — big kinetic */
    .sc .section { padding: ${sectionPad}px ${pad}px; }
    .sc .sec-tag { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .sc .sec-h { font-size: 120px; line-height: 0.92; letter-spacing:-0.04em; font-weight: 800; margin: 0 0 64px; max-width: 1300px; }
    .sc .sec-h em { font-family:"Instrument Serif",serif; font-style:italic; font-weight:400; color: var(--accent);}
    .sc .stats { display:grid; grid-template-columns: repeat(4, 1fr); gap:0;}
    .sc .stat { padding: 32px 24px 32px 0; border-right: 1px solid var(--grid); position:relative;}
    .sc .stat:last-child { border-right:none;}
    .sc .stat .v { font-size: 144px; line-height:0.9; font-weight:800; letter-spacing:-0.05em; font-variant-numeric: tabular-nums;}
    .sc .stat .v .u { font-size: 36px; color: var(--muted); margin-left: 4px;}
    .sc .stat .v.acc { color: var(--accent);}
    .sc .stat .l { font-size: 14px; color: var(--muted); margin-top: 16px; max-width: 240px; line-height:1.4;}

    /* CATEGORIES — overlapping cards, image placeholders */
    .sc .cats { display:grid; grid-template-columns: repeat(6, 1fr); gap: 0; }
    .sc .cat { aspect-ratio: 1/1.3; padding: 24px; display:flex; flex-direction:column; justify-content:space-between; position:relative; border: 1px solid var(--grid); transition: all .25s;}
    .sc .cat .num { font-family:"JetBrains Mono",monospace; font-size:11px; color: var(--muted); letter-spacing:0.2em;}
    .sc .cat .vis { flex:1; display:flex; align-items:center; justify-content:center; margin: 16px -8px;}
    .sc .cat .vis .blob { width: 80%; aspect-ratio:1/1; border-radius: 50%; background: linear-gradient(135deg, var(--accent), color-mix(in oklch, var(--accent) 40%, var(--bg))); filter: blur(2px); opacity:.85;}
    .sc .cat .name { font-size: 36px; font-weight: 700; letter-spacing:-0.02em; line-height: .95;}
    .sc .cat:hover { background: var(--accent); color:#0d0d0e;}
    .sc .cat:hover .num { color: #0d0d0e;}
    .sc .cat:hover .vis .blob { background: #0d0d0e; filter:none;}

    /* FACILITY — full-bleed numbers */
    .sc .fac-stage { background: var(--accent); color:#0d0d0e; padding: ${sectionPad}px ${pad}px; position:relative; overflow:hidden;}
    .sc .fac-stage h2 { font-size: 280px; line-height: 0.84; letter-spacing:-0.05em; font-weight:800; margin: 0; text-transform:uppercase;}
    .sc .fac-stage h2 em { font-family:"Instrument Serif",serif; font-style:italic; font-weight:400;}
    .sc .fac-stage .grid-spec { display:grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 64px; border-top: 2px solid #0d0d0e;}
    .sc .fac-stage .row-spec { padding: 32px 24px 32px 0; border-right: 1px solid rgba(13,13,14,0.2); display:flex; flex-direction:column; gap: 12px;}
    .sc .fac-stage .row-spec:last-child { border-right:none;}
    .sc .fac-stage .row-spec .k { font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.2em; text-transform:uppercase;}
    .sc .fac-stage .row-spec .v { font-size: 80px; font-weight:800; letter-spacing:-0.03em; line-height:1; font-variant-numeric: tabular-nums;}
    .sc .fac-stage .scroll-text { position:absolute; left:0; right:0; bottom: 24px; font-family:"JetBrains Mono",monospace; font-size: 11px; letter-spacing: 0.5em; opacity:.7; white-space:nowrap; text-transform: uppercase;}

    /* CERTS */
    .sc .compliance { padding: ${sectionPad}px ${pad}px; }
    .sc .seals { display:grid; grid-template-columns: repeat(6, 1fr); gap: 12px;}
    .sc .seal { aspect-ratio: 1/1; border: 1px solid var(--grid); display:flex; flex-direction:column; align-items:center; justify-content:center; gap: 12px; padding: 16px; transition:.2s; text-align:center;}
    .sc .seal:hover { background: var(--accent); color:#0d0d0e;}
    .sc .seal .b { width: 56px; height: 56px; border-radius: 50%; background: var(--ink); color: var(--bg); font-family:"JetBrains Mono",monospace; font-weight:600; font-size: 11px; letter-spacing:.1em; display:flex; align-items:center; justify-content:center; }
    .sc .seal:hover .b { background: #0d0d0e; color: var(--accent);}
    .sc .seal .t { font-size: 12px; line-height:1.3;}
    .sc .retailers { margin-top: 96px; display:grid; grid-template-columns: repeat(8, 1fr); border-top: 1px solid var(--grid);}
    .sc .retailers .ret { aspect-ratio: 2/1; border-right: 1px solid var(--grid); display:flex; align-items:center; justify-content:center; font-weight: 600; font-size: 18px; letter-spacing:-0.01em;}
    .sc .retailers .ret:last-child { border-right:none;}

    /* CTA */
    .sc .cta-block { padding: 200px ${pad}px; text-align:center; background: radial-gradient(ellipse at center, color-mix(in oklch, var(--accent) 25%, var(--bg)) 0%, var(--bg) 70%);}
    .sc .cta-block h2 { font-size: 240px; font-weight: 800; line-height: 0.88; letter-spacing:-0.05em; margin: 32px auto 0; max-width: 1500px; text-transform: uppercase;}
    .sc .cta-block h2 em { font-family:"Instrument Serif",serif; font-weight: 400; font-style:italic; color: var(--accent); text-transform: none;}
    .sc .cta-block .btn { display:inline-flex; align-items:center; gap: 14px; margin-top: 56px; background: var(--accent); color: #0d0d0e; font-weight:600; padding: 28px 48px; border-radius: 999px; font-size: 16px; letter-spacing: 0.04em;}

    .sc footer { padding: 80px ${pad}px 32px; border-top: 1px solid var(--grid); display:grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 48px;}
    .sc footer h4 { font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color: var(--muted); margin-bottom:16px;}
    .sc footer ul { list-style:none; padding:0; font-size: 14px;}
    .sc footer li { padding: 6px 0;}
    .sc footer .mark { font-size: 80px; font-weight:800; letter-spacing:-0.04em; line-height:1;}
    .sc footer .mark .x { color: var(--accent);}
    .sc .baseline { padding: 24px ${pad}px; border-top: 1px solid var(--grid); display:flex; justify-content:space-between; font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color: var(--muted);}
  `;
  return (
    <div className="sc" data-screen-label="C · Kinetic">
      <style>{css}</style>

      <nav className="nav">
        <div className="logo">PETRA<span className="x">/X</span></div>
        <div className="nav-links"><a>Capabilities</a><a>Categories</a><a>Facility</a><a>Studies</a><a>Insights</a></div>
        <div className="cta-pill">Book a Call →</div>
      </nav>

      <section className="hero">
        <h1>
          We build the<br/>
          <span className="a">products</span> the world<br/>
          actually <span className="out">wants.</span>
        </h1>
        <div className="row">
          <div className="lede">A multi-national contract manufacturer for skin, hair, body, men's and pet care. Concept-to-pallet, on one floor, in one chain of custody.</div>
          <div className="meta">
            <div><div className="v">30<span className="u">YR</span></div><span className="k">Heritage</span></div>
            <div><div className="v">60K<span className="u">FT²</span></div><span className="k">Production</span></div>
            <div><div className="v">1K+</div><span className="k">Formulas</span></div>
          </div>
        </div>
        <div className="hero-frame">
          <span className="corner-tag">// LIVE FROM THE FLOOR</span>
          <iframe src={`hero-spec-sheet.html#accent=${encodeURIComponent(accent)}`} />
        </div>
      </section>

      <div className="mq">
        <div className="mq-track">
          {[1,2].map(k=>(
            <span key={k}>
              SKIN <span className="sep"></span>
              HAIR <span className="sep"></span>
              BODY <span className="sep"></span>
              COSMETICS <span className="sep"></span>
              MEN'S <span className="sep"></span>
              ORAL <span className="sep"></span>
              PET <span className="sep"></span>
            </span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="sec-tag mono"><Dot color={accent}/>SCALE</div>
        <h2 className="sec-h">Three decades. Four warehouses. <em>Ten thousand</em> formulas behind us.</h2>
        <div className="stats">
          <div className="stat"><div className="v acc">30<span className="u">YR</span></div><div className="l">Of formulation, regulatory and supply experience.</div></div>
          <div className="stat"><div className="v">12</div><div className="l">Process kettles, in-line, GMP-certified.</div></div>
          <div className="stat"><div className="v">10</div><div className="l">Filling lines: bottle, tube, jar, sachet, roll-on, pump.</div></div>
          <div className="stat"><div className="v acc">04</div><div className="l">Warehouses serving NA, EU and APAC retailers.</div></div>
        </div>
      </section>

      <section className="section">
        <div className="sec-tag mono"><Dot color={accent}/>WHAT WE MAKE</div>
        <h2 className="sec-h">From <em>indie</em> launches to multi-national rollouts.</h2>
        <div className="cats">
          {[
            ["01","Skin"],["02","Hair"],["03","Body"],["04","Cosmetics"],["05","Men's"],["06","Pet"],
          ].map(([n,name])=>(
            <div className="cat" key={n}>
              <div className="num">/ {n}</div>
              <div className="vis"><div className="blob"></div></div>
              <div className="name">{name}<br/>Care</div>
            </div>
          ))}
        </div>
      </section>

      <section className="fac-stage">
        <div className="sec-tag mono" style={{color:'#0d0d0e'}}><Dot color="#0d0d0e"/>FACILITY</div>
        <h2>One floor.<br/><em>Twelve</em> kettles.<br/>Ten lines.</h2>
        <div className="grid-spec">
          <div className="row-spec"><span className="k">R&D Lab</span><span className="v">4.2K</span><span>Square feet of formulation bench.</span></div>
          <div className="row-spec"><span className="k">Kettles</span><span className="v">12</span><span>Up to 2,500L · jacket &amp; vacuum.</span></div>
          <div className="row-spec"><span className="k">Fill Lines</span><span className="v">10</span><span>Bottle · tube · jar · sachet · pump.</span></div>
          <div className="row-spec"><span className="k">Total</span><span className="v">60K</span><span>Square feet, single building.</span></div>
        </div>
        <div className="scroll-text">FROM CONCEPT — TO COUNTER — TO CONSUMER — FROM CONCEPT — TO COUNTER — TO CONSUMER — FROM CONCEPT — TO COUNTER — TO CONSUMER</div>
      </section>

      <section className="compliance">
        <div className="sec-tag mono"><Dot color={accent}/>COMPLIANCE</div>
        <h2 className="sec-h">Built to the <em>strictest</em> retailer standards.</h2>
        <div className="seals">
          {[
            ["GMP","ISO 22716"],
            ["CLN","Clean at Sephora"],
            ["VEG","Certified Vegan"],
            ["CRF","Cruelty Free"],
            ["WFM","Whole Foods"],
            ["CRD","Credo Clean"],
            ["EWG","EWG Verified"],
            ["FDA","FDA Reg."],
            ["FSC","FSC Pack"],
            ["ECO","ECOCERT"],
            ["GLU","Gluten Free"],
            ["NUT","Nut Free"],
          ].map(([k,t])=>(
            <div className="seal" key={k}><div className="b">{k}</div><div className="t">{t}</div></div>
          ))}
        </div>
        <div className="retailers">
          {["SEPHORA","TARGET","WHOLE FOODS","ULTA","SHOPPERS","DETOX MARKET","CREDO","HOLT RENFREW"].map(r=>(
            <div className="ret" key={r}>{r}</div>
          ))}
        </div>
      </section>

      <section className="cta-block">
        <span className="mono"><Dot color={accent}/>BRING YOURS TO LIFE</span>
        <h2>CONCEPT&nbsp;TO&nbsp;SHELF, <em>at speed.</em></h2>
        <div className="btn">BOOK A DISCOVERY CALL →</div>
      </section>

      <footer>
        <div>
          <div className="mark">PETRA<span className="x">/X</span></div>
          <p style={{marginTop:24, color:'#7c7c7c', maxWidth:340, fontSize:14, lineHeight:1.5}}>The product accelerator for personal &amp; pet care&apos;s most ambitious brands.</p>
        </div>
        <div><h4>Capabilities</h4><ul><li>R&amp;D</li><li>Manufacturing</li><li>Filling</li><li>Fulfilment</li></ul></div>
        <div><h4>Categories</h4><ul><li>Skin</li><li>Hair</li><li>Body</li><li>Pet</li></ul></div>
        <div><h4>Company</h4><ul><li>About</li><li>Insights</li><li>Careers</li><li>Press</li></ul></div>
        <div><h4>Contact</h4><ul><li>hello@petralabx.com</li><li>+1 416 000 0000</li><li>4 cities · global</li></ul></div>
      </footer>
      <div className="baseline">
        <span>© 2026 PETRA LAB-X</span>
        <span>GMP · ISO 22716</span>
        <span>v.26.04</span>
      </div>
    </div>
  );
}

window.HomepageSpecSheet = HomepageSpecSheet;
window.HomepageApothecary = HomepageApothecary;
window.HomepageKinetic = HomepageKinetic;
window.useTweaksHomepage = useTweaksHomepage;
window.TWEAK_DEFAULTS_HP = TWEAK_DEFAULTS;
