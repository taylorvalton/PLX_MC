/* =========================================================================
   PORTAL · SIGN-OFF · STUB VARIANTS for ARTWORK + COA
   These exist to prove the unified-flow thesis: same chassis, same dossier
   pattern, same sign block — only the central artefact swaps. Stubbed at
   reduced detail; we'd flesh out when those phase types become priority.
   ========================================================================= */

function PortalSignoffStubArtwork({ scheme = 'light' }) {
  const tokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;
  const phaseColor = (p) => p==='dock' ? 'var(--p-ok)' : p==='floor' ? 'var(--p-warn)' : 'var(--p-info)';
  const project = { code:'PLX-2614', name:'Niacinamide 5% Serum', sym:'Ni', num:'14', brand:'Aldosari Studio', iteration:'art-v02' };
  const deed = { id:'PLX-2614 / DEED-021 / ARTWORK-v02', issued:'2026.05.06 · 11:02 EST', issuer:'Studio · for Petra Lab-X', consignee:'Maya Aldosari · for Aldosari Studio', jurisdiction:'Toronto, ON', expires:'2026.05.13 (7 days)' };

  return (
    <div className="pf psd" style={{...tokens}} data-screen-label="Sign-off · Variant · Carton artwork">
      <PortalStyles /><SignoffStyles />
      <SignoffLeftRail scheme={scheme} project={project} phaseColor={phaseColor}/>
      <main className="main">
        <div className="breadcrumbs">
          <a>Lab</a><span className="sep">/</span>
          <a>Workbench</a><span className="sep">/</span>
          <a>Projects</a><span className="sep">/</span>
          <a>{project.code}</a><span className="sep">/</span>
          <b>Sign-off · carton artwork v02</b>
        </div>

        <div className="deed">
          <span className="chassis-tick tl"/><span className="chassis-tick tr"/>
          <header className="writ">
            <div className="pmark3"><span className="num">{project.num}</span><span className="sym">{project.sym}</span></div>
            <div className="body">
              <div className="kicker">/ Deed of artwork sign-off</div>
              <h1>Carton artwork — <em>v02.</em></h1>
              <div className="sub">Two SKUs &mdash; <b>30 mL serum</b> &amp; <b>outer carton</b>. Print-ready files attached. Same deed pattern; the central artefact is image, not table.</div>
            </div>
            <div className="stamp">
              <div className="row"><span className="l">Deed</span><span className="v"><b>{deed.id}</b></span></div>
              <div className="row"><span className="l">Issued</span><span className="v">{deed.issued}</span></div>
              <div className="row"><span className="l">By</span><span className="v">{deed.issuer}</span></div>
              <div className="row"><span className="l">To</span><span className="v">{deed.consignee}</span></div>
              <div className="row"><span className="l">Forum</span><span className="v">{deed.jurisdiction}</span></div>
              <div className="row"><span className="l">Expires</span><span className="v">{deed.expires}</span></div>
            </div>
          </header>
        </div>

        <div className="deed" style={{paddingTop:0}}>
          <section className="article">
            <div className="ahd">
              <div className="l">
                <span className="ix">ii.</span>
                <h2>The artwork, <em>laid out.</em></h2>
              </div>
              <div className="actions">
                <span className="skip">Open in inspector ↗</span>
                <button className="review-btn"><svg className="check" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7l3 3 5-6"/></svg>Reviewed</button>
              </div>
            </div>
            <p className="lede">The bottle and the carton, side by side. <em>Pinch to zoom.</em></p>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
              {['Bottle · 30 mL · amber', 'Outer carton · 30 mL'].map((label, i) => (
                <div key={i} style={{position:'relative', aspectRatio:'4/5', border:'1px solid var(--p-grid)', background:'var(--p-paper-2)', overflow:'hidden'}}>
                  <div style={{position:'absolute', inset:0, background:'repeating-linear-gradient(135deg, transparent 0 14px, color-mix(in oklab, var(--p-ink) 4%, transparent) 14px 15px)'}}/>
                  <div style={{position:'absolute', top:14, left:16, fontFamily:'var(--mono)', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--p-muted)', padding:'4px 8px', border:'1px solid var(--p-grid)', background:'var(--p-paper)'}}>Image placeholder · {label}</div>
                  <div style={{position:'absolute', bottom:14, left:16, fontFamily:'var(--mazius)', fontStyle:'italic', fontSize:18, color:'var(--p-ink)'}}>Niacinamide 5%</div>
                  <div style={{position:'absolute', bottom:14, right:16, fontFamily:'var(--mono)', fontSize:9, letterSpacing:'0.06em', color:'var(--p-muted)'}}>print-ready · 300 dpi · CMYK</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="deed" style={{paddingTop:0}}>
          <section className="signblock">
            <div className="preamble">
              <span className="ix">v.</span>
              <div>
                <h2>Sign-off, <em>same act.</em></h2>
                <p>The chassis &mdash; dossier, sections, sign block &mdash; is identical across formula, artwork, COA, and MSDS. Only the central artefact varies. The deed body, the legal preamble, and the seal are <em>one and the same.</em></p>
              </div>
            </div>
            <div className="commit">
              <div className="terms">I, <b>Maya Aldosari</b>, accept carton artwork <b>v02</b> as print-ready for SKU <b>{project.code}</b>. <span className="small">Same deed pattern · variants 'formula', 'artwork', 'coa', 'msds' · one component, four content slots</span></div>
              <div className="actions">
                <button className="primary"><svg className="seal" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5.5"/><path d="M4 7l2 2 4-4"/></svg>Sign &amp; seal deed</button>
                <button className="secondary">Request changes</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function PortalSignoffStubCOA({ scheme = 'light' }) {
  const tokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;
  const phaseColor = (p) => p==='dock' ? 'var(--p-ok)' : p==='floor' ? 'var(--p-warn)' : 'var(--p-info)';
  const project = { code:'PLX-2614', name:'Niacinamide 5% Serum', sym:'Ni', num:'14', brand:'Aldosari Studio', iteration:'COA-P04' };
  const deed = { id:'PLX-2614 / DEED-022 / COA-P04', issued:'2026.05.06 · 11:18 EST', issuer:'QA · for Petra Lab-X', consignee:'Maya Aldosari · for Aldosari Studio', jurisdiction:'Toronto, ON', expires:'2026.05.13 (7 days)' };
  const certRows = [
    ['pH', '5.62', '5.4–5.8', 'PASS'],
    ['Viscosity (cP, 25°C)', '4,200', '3,800–4,400', 'PASS'],
    ['Density (g/mL)', '1.018', '1.00–1.04', 'PASS'],
    ['Microbial · TVC', '<10', '<100 CFU/g', 'PASS'],
    ['Microbial · yeast/mould', '<10', '<10 CFU/g', 'PASS'],
    ['Heavy metals · Pb', '<0.5 ppm', '<10 ppm', 'PASS'],
    ['Heavy metals · As', '<0.1 ppm', '<3 ppm', 'PASS'],
    ['Niacinamide assay', '4.98%', '4.85–5.15%', 'PASS'],
  ];
  return (
    <div className="pf psd" style={{...tokens}} data-screen-label="Sign-off · Variant · COA">
      <PortalStyles /><SignoffStyles />
      <SignoffLeftRail scheme={scheme} project={project} phaseColor={phaseColor}/>
      <main className="main">
        <div className="breadcrumbs">
          <a>Lab</a><span className="sep">/</span>
          <a>Workbench</a><span className="sep">/</span>
          <a>Projects</a><span className="sep">/</span>
          <a>{project.code}</a><span className="sep">/</span>
          <b>Sign-off · COA · pilot 04</b>
        </div>

        <div className="deed">
          <span className="chassis-tick tl"/><span className="chassis-tick tr"/>
          <header className="writ">
            <div className="pmark3"><span className="num">{project.num}</span><span className="sym">{project.sym}</span></div>
            <div className="body">
              <div className="kicker">/ Deed of COA acceptance</div>
              <h1>Certificate of <em>analysis.</em></h1>
              <div className="sub">Pilot <b>P-04</b> · 18 kg · Kettle 02. Eight parameters. <b>All within window.</b> Doc-viewer slot — same chassis, the artefact is a certificate.</div>
            </div>
            <div className="stamp">
              <div className="row"><span className="l">Deed</span><span className="v"><b>{deed.id}</b></span></div>
              <div className="row"><span className="l">Issued</span><span className="v">{deed.issued}</span></div>
              <div className="row"><span className="l">By</span><span className="v">{deed.issuer}</span></div>
              <div className="row"><span className="l">To</span><span className="v">{deed.consignee}</span></div>
              <div className="row"><span className="l">Forum</span><span className="v">{deed.jurisdiction}</span></div>
              <div className="row"><span className="l">Expires</span><span className="v">{deed.expires}</span></div>
            </div>
          </header>
        </div>

        <div className="deed" style={{paddingTop:0}}>
          <section className="article">
            <div className="ahd">
              <div className="l">
                <span className="ix">ii.</span>
                <h2>The certificate, <em>parameter by parameter.</em></h2>
              </div>
              <div className="actions">
                <span className="skip">Open original PDF ↗</span>
                <button className="review-btn"><svg className="check" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7l3 3 5-6"/></svg>Reviewed</button>
              </div>
            </div>
            <p className="lede">Eight tested parameters; eight passes. <em>The lab's stamp is on the original PDF.</em></p>
            <table className="ftable">
              <thead><tr>
                <th style={{width:'40%'}}>Parameter</th>
                <th style={{width:'18%'}}>Result</th>
                <th style={{width:'24%'}}>Spec window</th>
                <th style={{width:'18%'}}>Pass / fail</th>
              </tr></thead>
              <tbody>
                {certRows.map((r,i) => (
                  <tr key={i}>
                    <td><div className="ing-name">{r[0]}</div></td>
                    <td className="pct">{r[1]}</td>
                    <td className="sup">{r[2]}</td>
                    <td><span className="d-same" style={{color:'var(--p-ok)', fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.18em'}}>✓ {r[3]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <div className="deed" style={{paddingTop:0}}>
          <section className="signblock">
            <div className="preamble">
              <span className="ix">iv.</span>
              <div>
                <h2>Accept the <em>certificate.</em></h2>
                <p>Acceptance permits the batch to be released. <em>Same deed body. Same seal.</em> The customer's signature countersigns the QA team's stamp.</p>
              </div>
            </div>
            <div className="commit">
              <div className="terms">I accept the COA for batch <b>P-04</b>. <span className="small">Same deed pattern · variants 'formula', 'artwork', 'coa', 'msds' · one component, four content slots</span></div>
              <div className="actions">
                <button className="primary"><svg className="seal" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5.5"/><path d="M4 7l2 2 4-4"/></svg>Accept COA</button>
                <button className="secondary">Reject &amp; comment</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

window.PortalSignoffStubArtwork = PortalSignoffStubArtwork;
window.PortalSignoffStubCOA = PortalSignoffStubCOA;
