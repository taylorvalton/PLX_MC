/* =========================================================================
   PORTAL · SIGN-OFF · SECTION COMPONENTS
   Each piece of the deed is a small, named React component so the article
   rhythm reads cleanly in the parent. The vocabulary repeats across them
   on purpose — every section opens with a roman numeral + Mazius header,
   then a short italic lede, then the artefact itself.
   ========================================================================= */

/* ------ LEFT RAIL ----------------------------------------------------- */
function SignoffLeftRail({ scheme, project, phaseColor }) {
  const projects = [
    { code:'PLX-2614', name:'Niacinamide 5% Serum', phase:'bench', current:true },
    { code:'PLX-2602', name:'Squalane Body Oil',     phase:'floor' },
    { code:'AURA-019', name:'Retinal Night Cream',   phase:'dock'  },
  ];
  return (
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
        <div className="item"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="3" width="10" height="8"/><line x1="2" y1="6" x2="12" y2="6"/></svg>Projects<span className="badge">3</span></div>
        <div className="item active"><svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 8l3 3 7-7"/></svg>Approvals<span className="badge">3</span></div>
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
  );
}

/* ------ HEADER · the writ -------------------------------------------- */
function SignoffHeader({ project, deed }) {
  return (
    <div className="deed">
      <span className="chassis-tick tl"/><span className="chassis-tick tr"/>
      <header className="writ">
        <div className="pmark3">
          <span className="num">{project.num}</span>
          <span className="sym">{project.sym}</span>
        </div>
        <div className="body">
          <div className="kicker">/ Deed of formula sign-off</div>
          <h1>Niacinamide 5% <em>Serum.</em></h1>
          <div className="sub">
            Iteration <b>v04</b> &mdash; for review &amp; sign by{' '}
            <b>{deed.consignee.split(' · ')[0]}</b> on behalf of{' '}
            <b>{project.brand}</b>.
          </div>
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
  );
}

/* ------ DOSSIER · the ledger ----------------------------------------- */
function SignoffDossier({ dossier }) {
  const reviewed = dossier.filter(d => d.state === 'reviewed').length;
  const total = dossier.length;
  return (
    <div className="deed" style={{paddingTop:0}}>
      <div className="dossier">
        <div className="head">
          <div className="l">
            <span style={{fontFamily:'var(--mazius)', fontStyle:'italic', fontSize:14, color:'var(--p-muted)'}}>contents.</span>
            <h2>The Dossier</h2>
          </div>
          <div className="small"><b>{reviewed}</b> of <b>{total}</b> reviewed · 1 pending · 1 flag · 0 not-applicable</div>
        </div>
        <ol>
          {dossier.map(d => (
            <li key={d.idx} className={d.heart ? 'heart' : ''}>
              <span className="ix">{d.idx}.</span>
              <span className="ref">{d.ref}</span>
              <span className="nm">{d.name}<small>{d.meta}</small></span>
              <span className={`stat ${d.state}`}>
                {d.state === 'reviewed' && '✓ Reviewed'}
                {d.state === 'pending'  && '○ Pending'}
                {d.state === 'flag'     && '! Flag'}
                {d.state === 'na'       && 'N/A'}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------ §1 · BRIEF DIFF ---------------------------------------------- */
function SignoffBriefDiff({ briefDiff }) {
  const Check = ({ kind }) => {
    if (kind === true) return (
      <svg className="check ok" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7.4l2.8 2.8L11.2 4.4"/>
      </svg>
    );
    if (kind === 'flag') return <span className="check flag-tag">amber</span>;
    return (
      <svg className="check fail" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3.4" y1="3.4" x2="10.6" y2="10.6"/>
        <line x1="10.6" y1="3.4" x2="3.4" y2="10.6"/>
      </svg>
    );
  };
  return (
    <div className="deed" style={{paddingTop:0}}>
      <section className="article">
        <div className="ahd">
          <div className="l">
            <span className="ix">i.</span>
            <h2>Brief, &amp; what it asked of <em>us.</em></h2>
          </div>
          <div className="actions">
            <span className="skip">Mark not applicable</span>
            <button className="review-btn"><svg className="check" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7l3 3 5-6"/></svg>Reviewed</button>
          </div>
        </div>
        <p className="lede">Four asks from the concept brief, four answers from the bench. Read across, row by row. <em>One amber.</em></p>

        <div className="brief-diff">
          <div className="row">
            <div className="cell head">The brief asked</div>
            <div className="cell head">v04 delivers</div>
          </div>
          {briefDiff.map((r, i) => (
            <div key={i} className="row">
              <div className="cell asked">
                <div className="ask-l">Ask · {String(i+1).padStart(2,'0')}</div>
                <div className="body">{r.asked}</div>
              </div>
              <div className="cell delivered">
                <div className="ask-l">Delivered</div>
                <div className="body">
                  <Check kind={r.ok}/>
                  <span>{r.delivered}</span>
                </div>
                {r.note && <div className="note">{r.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

window.SignoffLeftRail = SignoffLeftRail;
window.SignoffHeader = SignoffHeader;
window.SignoffDossier = SignoffDossier;
window.SignoffBriefDiff = SignoffBriefDiff;
