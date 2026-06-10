/* Mobile (390px) mock of the Petra Lab-X Apothecary homepage. */

function ApothecaryMobile({tweaks}) {
  const {accent, hot, paper, ink, headlineFont, showTicker, showCrosshairs, showFigCallouts} = tweaks;
  const headline = HEADLINE_FONTS[headlineFont] || '"Instrument Serif", serif';
  const css = `
    .am { width: 390px; --bg:${paper}; --ink:${ink}; --paper:${paper}; --paper-2:#ebe5d5; --accent:${accent}; --hot:${hot}; --muted:#5a6b5e; --grid:rgba(12,26,20,0.14);
          background:var(--bg); color:var(--ink); font-family:"Inter Tight", system-ui, sans-serif; overflow:hidden;}
    .am .mono { font-family:"JetBrains Mono", monospace; letter-spacing:0.18em; text-transform:uppercase; font-size:10px;}
    .am em.acc { font-family:${headline}; font-style:italic; color:var(--accent); }
    .am em.hot { font-family:${headline}; font-style:italic; color:var(--hot); }

    /* TICKER */
    .am-tk { background:var(--ink); color:var(--paper); padding: 8px 0; overflow:hidden; white-space:nowrap;}
    .am-tk-track { display:inline-block; animation: amM 36s linear infinite;}
    @keyframes amM { from{transform:translateX(0);} to{transform:translateX(-50%);}}
    .am-tk .it { display:inline-flex; align-items:center; gap:10px; padding: 0 16px; font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.2em; text-transform:uppercase;}
    .am-tk .it .b { color:var(--hot);}
    .am-tk .it .v { opacity:.65;}

    /* NAV */
    .am-nav { padding: 14px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--grid);}
    .am-nav img { height:22px; display:block;}
    .am-nav .right { display:flex; align-items:center; gap:10px;}
    .am-nav .portal { display:flex; align-items:center; gap:6px; padding: 8px 12px; border:1px solid var(--grid); border-radius:999px; font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--ink); text-decoration:none;}
    .am-nav .portal svg { width:10px; height:10px; display:block; color:var(--muted);}
    .am-nav .menu { width: 36px; height: 36px; border-radius:50%; border:1px solid var(--ink); display:flex; align-items:center; justify-content:center; gap:3px; flex-direction:column;}
    .am-nav .menu span { width: 14px; height:1px; background:var(--ink);}

    /* HERO */
    .am-hero { padding: 28px 20px 32px; position:relative;}
    .am-hero .pretop { display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;}
    .am-hero .pill { padding:5px 10px; border:1px solid var(--ink); border-radius:999px; font-family:"JetBrains Mono",monospace; font-size:8px; letter-spacing:0.18em; text-transform:uppercase; display:inline-flex; align-items:center; gap:6px;}
    .am-hero .pill .d { width:5px; height:5px; border-radius:50%; background:var(--hot);}
    .am-hero .ref { font-family:"JetBrains Mono",monospace; font-size:8px; letter-spacing:0.22em; color:var(--muted); text-transform:uppercase;}
    .am-hero h1 { font-family:${headline}; font-size: 56px; line-height: 1.04; letter-spacing:-0.022em; font-weight:400; margin: 0;}
    .am-hero h1 em { font-style:italic; color:var(--accent);}
    .am-hero h1 .hot-em { font-style:italic; color:var(--hot);}
    .am-hero .lede { font-size: 15px; line-height: 1.45; margin: 24px 0 0; color: var(--ink);}
    .am-hero .lede strong { font-family:${headline}; font-style:italic; font-weight:400; color: var(--accent);}

    .am-hero .meta { display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--grid);}
    .am-hero .meta .k { font-family:"JetBrains Mono",monospace; font-size:8px; letter-spacing:0.2em; text-transform:uppercase; color: var(--muted); display:block; margin-bottom:8px;}
    .am-hero .meta .v { font-family:${headline}; font-size: 38px; line-height:0.95; letter-spacing:-0.025em;}
    .am-hero .meta .v .u { font-size: 11px; color: var(--muted); margin-left: 3px;}

    /* HERO STAGE */
    .am-stage { margin-top: 32px; padding: 16px; background: var(--paper-2); border:1px solid var(--grid); position:relative;}
    .am-stage .label { position:absolute; font-family:"JetBrains Mono",monospace; font-size:8px; letter-spacing:0.2em; text-transform:uppercase; color: var(--muted);}
    .am-stage .label.tl { top:10px; left:10px;}
    .am-stage .label.tr { top:10px; right:10px;}
    .am-stage .label.br { bottom:10px; right:10px;}
    .am-stage .vis { aspect-ratio: 1/1;}
    .am-stage .info { margin-top: 16px; padding-top: 16px; border-top:1px solid var(--grid);}
    .am-stage .ttl { font-family:${headline}; font-size: 28px; line-height:1.0; letter-spacing:-0.014em;}
    .am-stage .ttl em { font-style:italic; color: var(--accent);}
    .am-stage .row { display:flex; justify-content:space-between; padding: 8px 0; border-bottom: 1px solid var(--grid); font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.16em; text-transform:uppercase; align-items:baseline;}
    .am-stage .row .k { color: var(--muted);}
    .am-stage .row .v { font-family:${headline}; font-size: 14px; letter-spacing:-0.01em; text-transform:none;}
    .am-stage .row.hot .v { color: var(--hot); font-style:italic;}
    .am-stage .table { margin-top: 12px;}

    /* PERIODIC */
    .am-pd { padding: 64px 20px; border-top: 1px solid var(--grid);}
    .am-pd .pre { font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted);}
    .am-pd h2 { font-family:${headline}; font-size: 44px; line-height:1.0; letter-spacing:-0.02em; font-weight:400; margin:14px 0 24px; max-width: 320px;}
    .am-pd h2 em { font-style:italic; color:var(--accent);}
    .am-pd .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 0; border-top: 1px solid var(--ink); border-left: 1px solid var(--ink);}
    .am-pd .pcell { aspect-ratio: 1/1; border-right: 1px solid var(--ink); border-bottom: 1px solid var(--ink); padding: 10px 10px 10px; display:flex; flex-direction:column; justify-content:space-between; background:var(--paper);}
    .am-pd .pcell.feat { background:var(--accent); color:var(--paper); border-color:var(--accent);}
    .am-pd .pcell .n { font-family:"JetBrains Mono",monospace; font-size:8px; letter-spacing:0.16em; color: var(--muted);}
    .am-pd .pcell.feat .n { color: rgba(243,237,225,0.7);}
    .am-pd .pcell .sym { font-family:${headline}; font-size: 36px; line-height:1; letter-spacing:-0.03em; margin-top: -2px;}
    .am-pd .pcell .nm { font-size: 10px; line-height:1.15; font-weight:500;}
    .am-pd .pcell .lb { font-family:"JetBrains Mono",monospace; font-size:7px; letter-spacing:0.18em; text-transform:uppercase; color: var(--muted); margin-top:2px;}
    .am-pd .pcell.feat .lb { color: rgba(243,237,225,0.7);}

    /* PROCESS — vertical on mobile */
    .am-pr { background:var(--ink); color:var(--paper); padding: 64px 20px;}
    .am-pr .pre { font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color: rgba(243,237,225,0.55);}
    .am-pr h2 { font-family:${headline}; font-size: 48px; line-height:1.0; letter-spacing:-0.022em; font-weight:400; margin: 14px 0 28px;}
    .am-pr h2 em { font-style:italic; color:var(--accent);}
    .am-pr h2 .hot-em { font-style:italic; color:var(--hot);}
    .am-pr .blurb { font-size: 14px; line-height: 1.5; color: rgba(243,237,225,0.7); margin-bottom: 32px; max-width: 320px;}
    .am-pr .lane { position:relative;}
    .am-pr .lane::before { content:""; position:absolute; left: 6px; top: 14px; bottom: 14px; width:1px; background: rgba(243,237,225,0.18);}
    .am-pr .row { display:grid; grid-template-columns: 28px 1fr auto; gap: 14px; padding: 18px 0; border-bottom: 1px solid rgba(243,237,225,0.12); align-items:baseline; position:relative;}
    .am-pr .row .node { width:13px; height:13px; border-radius:50%; background:var(--paper); border:1px solid var(--paper); position:relative; z-index:2; align-self:center; transform: translateY(-4px);}
    .am-pr .row.active .node { background:var(--hot); border-color:var(--hot); box-shadow:0 0 0 4px rgba(168,58,38,0.18);}
    .am-pr .row.todo .node { background:transparent;}
    .am-pr .row .info .num { font-family:"JetBrains Mono",monospace; font-size:8px; letter-spacing:0.2em; color: rgba(243,237,225,0.55);}
    .am-pr .row .info .ttl { font-family:${headline}; font-size: 24px; line-height:1.0; letter-spacing:-0.012em; margin-top:4px;}
    .am-pr .row.active .info .ttl em { font-style:italic; color:var(--hot);}
    .am-pr .row .info .ds { font-size: 12px; line-height:1.4; color: rgba(243,237,225,0.65); margin-top: 4px; max-width: 220px;}
    .am-pr .row .wk { font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.2em; color: rgba(243,237,225,0.55);}

    /* PHILOSOPHY */
    .am-ph { padding: 64px 20px; border-top: 1px solid var(--grid);}
    .am-ph .pre { font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color: var(--muted);}
    .am-ph h2 { font-family:${headline}; font-size: 44px; line-height:1.0; letter-spacing:-0.02em; font-weight:400; margin: 14px 0 24px; max-width: 320px;}
    .am-ph h2 em { font-style:italic; color:var(--accent);}
    .am-ph .quote { font-family:${headline}; font-size: 28px; line-height:1.15; letter-spacing:-0.012em; margin: 24px 0 16px;}
    .am-ph .quote em { font-style:italic; color:var(--accent);}
    .am-ph .att { display:flex; align-items:center; gap:12px; padding-top: 16px; border-top: 1px solid var(--grid);}
    .am-ph .att .av { width: 40px; height: 40px; border-radius:50%; border:1px solid var(--grid); background: var(--paper-2); display:flex; align-items:center; justify-content:center; font-family:${headline}; font-size:18px;}
    .am-ph .att .nm { font-size: 13px; font-weight:500;}
    .am-ph .att .rl { font-family:"JetBrains Mono",monospace; font-size:8px; letter-spacing:0.2em; text-transform:uppercase; color: var(--muted); margin-top:2px;}

    .am-ph .pr { display:grid; grid-template-columns: 50px 1fr; gap: 12px; padding: 18px 0; border-bottom: 1px solid var(--grid); align-items:baseline;}
    .am-ph .pr:first-of-type { border-top: 1px solid var(--grid); margin-top: 28px;}
    .am-ph .pr .n { font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.2em; color:var(--hot);}
    .am-ph .pr .ttl { font-family:${headline}; font-size: 22px; line-height:1.0; letter-spacing:-0.012em;}
    .am-ph .pr .ttl em { font-style:italic; color:var(--accent);}
    .am-ph .pr .b { font-size: 12px; line-height:1.45; color: var(--muted); margin-top: 6px;}

    /* PRESS */
    .am-pa { padding: 64px 20px; background: var(--paper-2); border-top: 1px solid var(--grid);}
    .am-pa .pre { font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color: var(--muted);}
    .am-pa h2 { font-family:${headline}; font-size: 40px; line-height:1.0; letter-spacing:-0.02em; font-weight:400; margin: 14px 0 24px; max-width: 320px;}
    .am-pa h2 em { font-style:italic; color: var(--accent);}
    .am-pa .q { background:var(--paper); border:1px solid var(--grid); padding: 22px; margin-bottom: 12px;}
    .am-pa .q .pull { font-family:${headline}; font-size: 22px; line-height:1.2; letter-spacing:-0.01em;}
    .am-pa .q .pull em { font-style:italic; color: var(--accent);}
    .am-pa .q .src { display:flex; justify-content:space-between; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--grid); font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color: var(--muted); align-items:center;}
    .am-pa .q .src .pub { font-family:${headline}; font-style:italic; font-size: 16px; text-transform:none; color:var(--ink); letter-spacing:-0.01em;}
    .am-pa .strip { display:grid; grid-template-columns: repeat(2,1fr); gap: 0; margin-top: 20px; border-top:1px solid var(--grid); border-left:1px solid var(--grid);}
    .am-pa .strip .l { aspect-ratio: 2/1; border-right: 1px solid var(--grid); border-bottom: 1px solid var(--grid); display:flex; align-items:center; justify-content:center; background: var(--paper); font-family:${headline}; font-style:italic; font-size: 16px; color:var(--ink);}

    /* CTA */
    .am-cta { padding: 96px 20px; text-align:center; border-top: 1px solid var(--grid);}
    .am-cta .pre { font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color: var(--muted); display:inline-flex; align-items:center; gap:8px;}
    .am-cta .pre .d { width:5px; height:5px; border-radius:50%; background:var(--hot);}
    .am-cta h2 { font-family:${headline}; font-size: 64px; line-height: 0.96; letter-spacing:-0.025em; font-weight:400; margin: 16px 0 0;}
    .am-cta h2 em { font-style:italic; color:var(--accent);}
    .am-cta h2 .hot-em { font-style:italic; color:var(--hot);}
    .am-cta .btn { display:inline-flex; align-items:center; gap:10px; margin-top: 28px; background:var(--ink); color:var(--paper); padding: 16px 24px; border-radius:999px; font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase;}
    .am-cta .btn .arr { width:14px; height:14px; border-radius:50%; background:var(--hot); display:inline-flex; align-items:center; justify-content:center; font-size:9px;}
    .am-cta .meta { display:grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 320px; margin: 40px auto 0; padding-top: 22px; border-top: 1px solid var(--grid); text-align:left;}
    .am-cta .meta .k { font-family:"JetBrains Mono",monospace; font-size:8px; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted);}
    .am-cta .meta .v { font-family:${headline}; font-size: 18px; letter-spacing:-0.01em; margin-top: 4px;}

    /* FOOTER */
    .am-ft { padding: 48px 20px 24px; border-top: 1px solid var(--grid);}
    .am-ft img { height: 56px; display:block;}
    .am-ft p { font-size: 13px; line-height: 1.5; color: var(--muted); margin: 16px 0 28px; max-width: 280px;}
    .am-ft .col { padding: 14px 0; border-top: 1px solid var(--grid);}
    .am-ft .col h4 { font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted); margin: 0 0 8px;}
    .am-ft .col ul { list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap: 8px 16px; font-size: 13px;}
    .am-bl { padding: 18px 20px; border-top: 1px solid var(--grid); display:flex; flex-direction:column; gap: 6px; font-family:"JetBrains Mono",monospace; font-size: 8px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted); text-align:center;}
  `;
  return (
    <div className="am" data-screen-label="Mobile · Petra Lab-X Homepage">
      <style>{css}</style>

      {showTicker && (
        <div className="am-tk">
          <div className="am-tk-track">
            {[1,2].map(k => (
              <span key={k}>
                <span className="it"><span className="b">●</span>NOW SHIPPING<span className="v">Q3 INTAKE · 4 SLOTS</span></span>
                <span className="it"><span className="b">/</span>SKIN<span className="v">·</span>HAIR<span className="v">·</span>BODY<span className="v">·</span>PET</span>
                <span className="it"><span className="b">▲</span>+34% YoY · 1,124 ACTIVE FORMULAS</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <nav className="am-nav">
        <img src="assets/logo-horizontal-ink.png" alt="Petra Lab-X" />
        <div className="right">
          <a className="portal" href="https://plxcustomer.io/login" target="_blank" rel="noopener">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2.5" y="5.5" width="7" height="5" rx="0.5"/><path d="M4 5.5V3.8a2 2 0 0 1 4 0V5.5"/></svg>
            Workbench
          </a>
          <div className="menu"><span/><span/></div>
        </div>
      </nav>

      <section className="am-hero">
        <div className="pretop">
          <span className="pill"><span className="d"/>PERSONAL CARE · CDMO</span>
          {showFigCallouts && <span className="ref">REF · PLX‑26‑04</span>}
        </div>
        <h1>We accelerate the creation &amp; delivery of <em>breakthrough</em> products, <span className="hot-em">at scale.</span></h1>
        <p className="lede">Petra Lab-X is a frontier lab for <strong>personal &amp; pet care</strong> — surrounding ambitious brands with thirty-seven years of formulation, a 60,000 ft² floor, and a regulatory team that ships.</p>
        <div className="meta">
          <div><span className="k">Founded</span><span className="v">1989</span></div>
          <div><span className="k">Production</span><span className="v">60K<span className="u">ft²</span></span></div>
          <div><span className="k">Formulas</span><span className="v">1,124</span></div>
        </div>

        <div className="am-stage">
          <div className="vis" style={{position:'relative'}}>
            <span className="label tl">FIG. 02</span>
            <span className="label tr">1:1</span>
            <span className="label br">PLX-N-014</span>
            <IngredientCrossSection accent={accent} hot={hot} ink={ink}/>
          </div>
          <div className="info">
            <span className="mono" style={{color:'var(--muted)'}}>/ Featured · 014</span>
            <div className="ttl" style={{marginTop:8}}>Niacinamide<br/><em>at 5%, encapsulated.</em></div>
            <div className="table">
              <div className="row"><span className="k">INCI</span><span className="v">Niacinamide</span></div>
              <div className="row"><span className="k">Conc.</span><span className="v">2 — 10%</span></div>
              <div className="row"><span className="k">pH</span><span className="v">5.0 — 7.0</span></div>
              <div className="row hot"><span className="k">Status</span><span className="v">Production</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="am-pd">
        <span className="pre">/ 002 — Capabilities</span>
        <h2>An <em>elemental</em> catalog of chemistries.</h2>
        <div className="grid">
          {APOTHECARY_INGREDIENTS.slice(0,9).map(([n,sym,name,sub,role,cls],i)=>(
            <div className={`pcell ${i===0?'feat':''}`} key={n}>
              <span className="n">{n}</span>
              <div>
                <div className="sym">{sym}</div>
                <div className="nm">{name}</div>
                <div className="lb">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="am-pr">
        <span className="pre">/ 003 — Method</span>
        <h2>Concept to <em>shelf</em> in <span className="hot-em">fourteen weeks.</span></h2>
        <div className="blurb">One floor. One QMS. One chain of custody — sketch to dock-out.</div>
        <div className="lane">
          {[
            ["W 0",  "01", "Intake",     "Brief, brand and target market captured.",        "done"],
            ["W 2",  "02", "R&D Brief",  "Multiple chemistries in parallel.",                "done"],
            ["W 4",  "03", "Prototype",  "Small-batch sensory & stability rounds.",          "done"],
            ["W 6",  "04", "Stabilize",  "Accelerated & ambient. Claims drafted.",           "active"],
            ["W 9",  "05", "Pilot",      "On the kettle that runs production.",              "todo"],
            ["W 12", "06", "Produce",    "Full run. In-line QC.",                            "todo"],
            ["W 14", "07", "Ship",       "Retailer-ready pallets.",                          "todo"],
          ].map(([wk,n,t,d,state])=>(
            <div className={`row ${state}`} key={n}>
              <div className="node"/>
              <div className="info">
                <div className="num">PHASE / {n}</div>
                <div className="ttl">{state==='active' ? <em>{t}</em> : t}</div>
                <div className="ds">{d}</div>
              </div>
              <span className="wk">{wk}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="am-ph">
        <span className="pre">/ 004 — Philosophy</span>
        <h2>We act like a <em>frontier lab</em>.</h2>
        <p className="quote">"The next decade won't be won by media budgets. It'll be won by who can <em>iterate the fastest</em> with the most credible chemistry."</p>
        <div className="att">
          <div className="av">M</div>
          <div>
            <div className="nm">Maya Aldosari</div>
            <div className="rl">Chief Scientist</div>
          </div>
        </div>
        {[
          ["P/01", "Iterate <em>collaboratively</em>.", "Your team and ours at the same bench."],
          ["P/02", "Ship the <em>frontier</em>.", "Actives that work today, not the ones easier to scale yesterday."],
          ["P/03", "Single <em>chain of custody</em>.", "One building, one QMS, one accountable team."],
          ["P/04", "Speed is a <em>quality metric</em>.", "Time-to-shelf compounds."],
        ].map(([n,t,b])=>(
          <div className="pr" key={n}>
            <span className="n">{n}</span>
            <div>
              <div className="ttl" dangerouslySetInnerHTML={{__html:t}}/>
              <div className="b">{b}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="am-pa">
        <span className="pre">/ 005 — Press</span>
        <h2>What the <em>industry</em> says.</h2>
        {[
          ['"The Petra floor is where the next generation of <em>indie skincare</em> is being engineered."', "Allure", "FEB 26"],
          ['"They\'ve compressed eighteen months into <em>fourteen weeks</em>."', "Beauty Independent", "JAN 26"],
        ].map(([p,pub,d],i)=>(
          <div className="q" key={i}>
            <div className="pull" dangerouslySetInnerHTML={{__html:p}}/>
            <div className="src"><span>{d}</span><span className="pub">{pub}</span></div>
          </div>
        ))}
        <div className="strip">
          {["Allure","Vogue","WGSN","BoF"].map(p => <div className="l" key={p}>{p}</div>)}
        </div>
      </section>

      <section className="am-cta">
        <span className="pre"><span className="d"/>Q3 INTAKE OPEN · 4 SLOTS</span>
        <h2>Concept&nbsp;to&nbsp;shelf,<br/><em>at</em> <span className="hot-em">speed.</span></h2>
        <span className="btn">Book intake call <span className="arr">→</span></span>
        <div className="meta">
          <div><span className="k">Response</span><div className="v">&lt; 24 hr</div></div>
          <div><span className="k">First formula</span><div className="v">Week 2</div></div>
        </div>
      </section>

      <footer className="am-ft">
        <img src="assets/logo-stacked-ink.png" alt="Petra Lab-X" />
        <p>The frontier lab for the world's most ambitious personal &amp; pet care brands.</p>
        <div className="col"><h4>Capabilities</h4><ul><li>R&amp;D</li><li>Manufacturing</li><li>Filling</li><li>Fulfilment</li></ul></div>
        <div className="col"><h4>Catalog</h4><ul><li>Skin</li><li>Hair</li><li>Body</li><li>Pet</li><li>Cosmetics</li><li>Men's</li></ul></div>
        <div className="col"><h4>Company</h4><ul><li>About</li><li>Process</li><li>Studies</li><li>Press</li><li>Careers</li></ul></div>
        <div className="col"><h4>Connect</h4><ul><li>hello@petralabx.com</li><li>+1 416 000 0000</li><li>Toronto · Toledo · Miami · Rotterdam</li></ul></div>
      </footer>
      <div className="am-bl">
        <span>© 2026 Petra Lab-X · GMP · ISO 22716</span>
        <span>v.26.04 / build 1144</span>
      </div>
    </div>
  );
}
window.ApothecaryMobile = ApothecaryMobile;
