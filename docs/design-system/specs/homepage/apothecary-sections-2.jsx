/* Petra Lab-X — Apothecary Homepage Sections (philosophy / press / cta / footer) */

/* ===========================================================
   PHILOSOPHY — about / values
   =========================================================== */
function ApothecaryPhilosophy({tweaks}) {
  const {accent, hot, headlineFont} = tweaks;
  const headline = HEADLINE_FONTS[headlineFont];
  const css = `
    .ap-ph { padding: 144px 88px; border-bottom: 1px solid var(--grid); position:relative;}
    .ap-ph .head { display:grid; grid-template-columns: 320px 1fr; gap: 64px; margin-bottom: 80px;}
    .ap-ph .head h2 { font-family:${headline}; font-size: 96px; line-height: 0.94; letter-spacing:-0.024em; font-weight:400; margin: 0; max-width: 1000px;}
    .ap-ph .head h2 em { font-style:italic; color:var(--accent);}
    .ap-ph .grid { display:grid; grid-template-columns: 1.2fr 1fr; gap: 80px;}
    .ap-ph .left .quote { font-family:${headline}; font-size: 56px; line-height: 1.05; letter-spacing:-0.02em; max-width: 720px;}
    .ap-ph .left .quote em { font-style:italic; color:var(--accent);}
    .ap-ph .left .attrib { display:flex; align-items:center; gap:18px; margin-top: 48px; padding-top: 28px; border-top: 1px solid var(--grid); max-width: 480px;}
    .ap-ph .left .attrib .av { width:56px; height:56px; border-radius:50%; background: var(--paper-2); border: 1px solid var(--grid); display:flex; align-items:center; justify-content:center; font-family:${headline}; font-size:22px; color:var(--ink);}
    .ap-ph .left .attrib .who { font-family:"Inter Tight",sans-serif; font-size: 14px;}
    .ap-ph .left .attrib .who .nm { font-weight:500;}
    .ap-ph .left .attrib .who .rl { font-family:"JetBrains Mono",monospace; font-size: 10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted); margin-top:4px;}

    .ap-ph .right .principles { display:flex; flex-direction:column;}
    .ap-ph .right .pr { display:grid; grid-template-columns: 64px 1fr; gap: 24px; padding: 28px 0; border-bottom: 1px solid var(--grid); align-items:baseline;}
    .ap-ph .right .pr:first-child { border-top: 1px solid var(--grid);}
    .ap-ph .right .pr .num { font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:0.22em; color: var(--hot);}
    .ap-ph .right .pr .ttl { font-family:${headline}; font-size: 32px; line-height:1.0; letter-spacing:-0.015em;}
    .ap-ph .right .pr .ttl em { font-style:italic; color: var(--accent);}
    .ap-ph .right .pr .body { font-family:"Inter Tight",sans-serif; font-size: 14px; line-height: 1.5; color: var(--muted); margin-top: 8px;}
  `;
  const principles = [
    ["P / 01", "Iterate <em>collaboratively</em>.", "Your team and ours sit at the same bench. We don't do brief-and-pray; every formula gets prototyped, tasted, smelled and revised together."],
    ["P / 02", "Ship the <em>frontier</em>.", "We build with the actives, encapsulations and biomes that work today &mdash; not the ones easier to scale yesterday."],
    ["P / 03", "Single <em>chain of custody</em>.", "From R&amp;D bench to dock-out, your formula stays in one building, one QMS and one accountable team."],
    ["P / 04", "Speed is a <em>quality metric</em>.", "Time-to-shelf compounds: every week shaved off discovery is a week your brand is on shelf, learning from the market."],
  ];
  return (
    <section className="ap-ph">
      <style>{css}</style>
      <div className="head">
        <span className="mono" style={{color:'var(--muted)'}}>/ 004 — Philosophy</span>
        <h2>We act like a <em>frontier lab tech&nbsp;company</em> &mdash; because that's what consumer brands now require.</h2>
      </div>
      <div className="grid">
        <div className="left">
          <p className="quote">"The next decade of personal care won't be won by the brands with the biggest media budgets. It'll be won by the ones who can <em>iterate the fastest</em>, with the most credible chemistry behind them."</p>
          <div className="attrib">
            <div className="av">M</div>
            <div className="who">
              <div className="nm">Maya Aldosari</div>
              <div className="rl">Chief Scientist · Petra Lab-X</div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="principles">
            {principles.map(([n,t,b])=>(
              <div className="pr" key={n}>
                <span className="num">{n}</span>
                <div>
                  <div className="ttl" dangerouslySetInnerHTML={{__html:t}}/>
                  <div className="body" dangerouslySetInnerHTML={{__html:b}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================
   PRESS & ACCOLADES
   =========================================================== */
function ApothecaryPress({tweaks}) {
  const {accent, hot, headlineFont} = tweaks;
  const headline = HEADLINE_FONTS[headlineFont];
  const css = `
    .ap-pa { padding: 144px 88px; border-bottom: 1px solid var(--grid); background: var(--paper-2);}
    .ap-pa .head { display:flex; flex-direction:column; gap: 28px; margin-bottom: 56px;}
    .ap-pa .head .top-row { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom: 20px; border-bottom: 1px solid var(--grid);}
    .ap-pa .head h2 { font-family:${headline}; font-size: 132px; line-height:0.95; letter-spacing:-0.025em; font-weight:400; margin:0; max-width: 1500px;}
    .ap-pa .head h2 em { font-style:italic; color:var(--accent);}
    .ap-pa .head .meta { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--muted); text-align:right; line-height:1.6;}

    .ap-pa .quotes { display:grid; grid-template-columns: repeat(3,1fr); gap: 0; border-top: 1px solid var(--grid); border-left: 1px solid var(--grid);}
    .ap-pa .q { padding: 36px 32px; border-right: 1px solid var(--grid); border-bottom: 1px solid var(--grid); display:flex; flex-direction:column; justify-content:space-between; min-height: 320px; background: var(--paper);}
    .ap-pa .q .pull { font-family:${headline}; font-size: 28px; line-height: 1.18; letter-spacing:-0.012em; color:var(--ink);}
    .ap-pa .q .pull em { font-style:italic; color: var(--accent);}
    .ap-pa .q .src { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color: var(--muted); margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--grid); display:flex; justify-content:space-between; align-items:center;}
    .ap-pa .q .src .pub { font-family:${headline}; font-size: 22px; letter-spacing:-0.01em; text-transform:none; color: var(--ink); font-style:italic;}

    .ap-pa .strip { margin-top: 56px; display:grid; grid-template-columns: repeat(8, 1fr); border-top: 1px solid var(--grid); border-left: 1px solid var(--grid);}
    .ap-pa .strip .l { aspect-ratio: 2/1; border-right: 1px solid var(--grid); border-bottom: 1px solid var(--grid); display:flex; align-items:center; justify-content:center; font-family:${headline}; font-style:italic; font-size: 22px; color: var(--ink); letter-spacing:-0.01em; background: var(--paper);}

    .ap-pa .accolades { display:grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 56px; border-top: 1px solid var(--grid);}
    .ap-pa .ac { padding: 32px 32px 32px 0; border-right: 1px solid var(--grid); display:flex; flex-direction:column; gap: 8px;}
    .ap-pa .ac:last-child { border-right:none;}
    .ap-pa .ac .yr { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; color: var(--hot);}
    .ap-pa .ac .award { font-family:${headline}; font-size: 24px; line-height:1.1; letter-spacing:-0.012em;}
    .ap-pa .ac .org { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color: var(--muted);}
  `;
  return (
    <section className="ap-pa">
      <style>{css}</style>
      <div className="head">
        <div className="top-row">
          <span className="mono" style={{color:'var(--muted)'}}>/ 005 — Press &amp; Accolades</span>
          <div className="meta">2026 PRESS DOSSIER<br/>↓ DOWNLOAD PDF</div>
        </div>
        <h2>What the <em>industry</em> says about the floor in Toronto.</h2>
      </div>
      <div className="quotes">
        {[
          ['"The Petra floor is where the next generation of <em>indie skincare</em> is being quietly engineered."', "Allure", "FEB 2026"],
          ['"They\'ve compressed an industry timeline that used to take eighteen months into <em>fourteen weeks</em>."', "Beauty Independent", "JAN 2026"],
          ['"A contract manufacturer that <em>thinks like a tech company</em> &mdash; rare, refreshing, ruthless about throughput."', "WGSN", "DEC 2025"],
        ].map(([p,pub,d],i)=>(
          <div className="q" key={i}>
            <div className="pull" dangerouslySetInnerHTML={{__html:p}}/>
            <div className="src"><span>SOURCE</span><span className="pub">{pub}</span><span>{d}</span></div>
          </div>
        ))}
      </div>
      <div className="strip">
        {["Allure","Vogue","WGSN","BoF","Beauty Inc.","Glossy","Cosmetics Biz","Happi"].map(p => (
          <div className="l" key={p}>{p}</div>
        ))}
      </div>
      <div className="accolades">
        {[
          ["2026","CDMO of the Year (Finalist)", "Cosmetic Executive Women"],
          ["2025","Innovation in Encapsulation", "Society of Cosmetic Chemists"],
          ["2025","Best Sustainable Operations", "Beauty Independent Awards"],
          ["2024","Top 10 CDMO Worldwide", "Cosmetics Business"],
        ].map(([y,a,o])=>(
          <div className="ac" key={a}>
            <span className="yr">/ {y}</span>
            <div className="award">{a}</div>
            <span className="org">{o}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===========================================================
   CTA + FOOTER
   =========================================================== */
function ApothecaryCTA({tweaks}) {
  const {accent, hot, headlineFont, showCrosshairs} = tweaks;
  const headline = HEADLINE_FONTS[headlineFont];
  const css = `
    .ap-cta { padding: 200px 88px; text-align:center; border-bottom: 1px solid var(--grid); position:relative; overflow:hidden;}
    .ap-cta .grid-bg { position:absolute; inset:0; pointer-events:none; opacity: .35;
      background-image: linear-gradient(to right, var(--grid-soft) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-soft) 1px, transparent 1px);
      background-size: 96px 96px;}
    .ap-cta .pre { position:relative; z-index:2; display:inline-flex; align-items:center; gap:12px; font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.28em; color: var(--muted); text-transform: uppercase;}
    .ap-cta h2 { font-family:${headline}; font-size: 232px; line-height: 0.92; letter-spacing:-0.03em; font-weight:400; margin: 32px 0 0; max-width: 1500px; margin-left:auto; margin-right:auto; position:relative; z-index:2;}
    .ap-cta h2 em { font-style:italic; color: var(--accent);}
    .ap-cta h2 .hot-em { font-style:italic; color: var(--hot);}
    .ap-cta .actions { margin-top: 56px; display:inline-flex; gap: 12px; align-items:center; position:relative; z-index:2;}
    .ap-cta .btn-primary { background: var(--ink); color: var(--paper); padding: 22px 36px; border-radius: 999px; font-family:"JetBrains Mono",monospace; font-size: 12px; letter-spacing:0.28em; text-transform:uppercase; display:inline-flex; align-items:center; gap:14px;}
    .ap-cta .btn-primary .arr { width:18px; height:18px; border-radius:50%; background: var(--hot); display:inline-flex; align-items:center; justify-content:center; color: var(--paper); font-size: 10px;}
    .ap-cta .btn-secondary { padding: 22px 28px; font-family:"JetBrains Mono",monospace; font-size: 12px; letter-spacing:0.28em; text-transform:uppercase; color: var(--ink);}
    .ap-cta .btn-secondary u { text-decoration: none; border-bottom: 1px solid var(--ink); padding-bottom: 4px;}
    .ap-cta .meta-row { margin-top: 88px; display:grid; grid-template-columns: repeat(3,1fr); gap: 32px; max-width: 1100px; margin-left:auto; margin-right:auto; padding-top: 36px; border-top: 1px solid var(--grid); position:relative; z-index:2;}
    .ap-cta .meta-row .k { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; color: var(--muted);}
    .ap-cta .meta-row .v { font-family:${headline}; font-size: 28px; letter-spacing:-0.01em; margin-top: 8px;}

    /* footer */
    .ap-ft { padding: 88px 88px 32px; display:grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 48px; border-bottom: none;}
    .ap-ft .brand img { height: 84px; display: block;}
    .ap-ft .brand p { font-family:"Inter Tight",sans-serif; font-size:14px; line-height: 1.5; color: var(--muted); margin-top: 24px; max-width: 360px;}
    .ap-ft h4 { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color: var(--muted); margin: 0 0 18px;}
    .ap-ft ul { list-style:none; padding:0; margin:0; font-family:"Inter Tight",sans-serif; font-size: 14px;}
    .ap-ft li { padding: 6px 0;}
    .ap-baseline { padding: 22px 88px; border-top: 1px solid var(--grid); display:flex; justify-content:space-between; align-items:center; font-family:"JetBrains Mono",monospace; font-size: 10px; letter-spacing:0.22em; text-transform:uppercase; color: var(--muted);}
  `;
  return (<>
    <section className="ap-cta">
      <style>{css}</style>
      {showCrosshairs && <div className="grid-bg"/>}
      <span className="pre"><span style={{width:6,height:6,borderRadius:'50%',background:hot,display:'inline-block'}}></span>Q3 2026 INTAKE · 4 OF 7 SLOTS REMAINING</span>
      <h2>Concept&nbsp;to&nbsp;shelf,<br/><em>at</em> <span className="hot-em">speed.</span></h2>
      <div className="actions">
        <span className="btn-primary">Book an intake call <span className="arr">→</span></span>
        <span className="btn-secondary"><u>or download the method dossier (.pdf)</u></span>
      </div>
      <div className="meta-row">
        <div><span className="k">RESPONSE TIME</span><div className="v">&lt; 24 hours</div></div>
        <div><span className="k">FIRST FORMULATION</span><div className="v">Week two</div></div>
        <div><span className="k">RETAIL-READY</span><div className="v">Week fourteen</div></div>
      </div>
    </section>

    <footer className="ap-ft">
      <div className="brand">
        <img src="assets/logo-stacked-ink.png" alt="Petra Lab-X" />
        <p>The frontier lab for the world's most ambitious personal &amp; pet care brands. Concept to retail in fourteen weeks.</p>
      </div>
      <div><h4>Capabilities</h4><ul><li>R&amp;D</li><li>Manufacturing</li><li>Filling &amp; pack</li><li>Fulfilment</li><li>Regulatory</li></ul></div>
      <div><h4>Catalog</h4><ul><li>Skin · Hair · Body</li><li>Cosmetics</li><li>Men's</li><li>Pet care</li><li>Oral · Spa</li></ul></div>
      <div><h4>Company</h4><ul><li>About</li><li>Process</li><li>Studies</li><li>Press</li><li>Careers</li></ul></div>
      <div><h4>Connect</h4><ul><li>hello@petralabx.com</li><li>+1 416 000 0000</li><li>Toronto · Toledo · Miami · Rotterdam</li><li><span style={{borderBottom:`1px solid ${hot}`, paddingBottom:2}}>Book intake call →</span></li></ul></div>
    </footer>
    <div className="ap-baseline">
      <span>© 2026 Petra Lab-X · All rights reserved</span>
      <span>GMP · ISO 22716 · FDA registered</span>
      <span>v.26.04 / build 1144</span>
    </div>
  </>);
}

window.ApothecaryPhilosophy = ApothecaryPhilosophy;
window.ApothecaryPress = ApothecaryPress;
window.ApothecaryCTA = ApothecaryCTA;
