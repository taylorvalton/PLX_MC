/* =========================================================================
   PORTAL · SIGN-OFF · SIGN BLOCK + RECEIPT + (legacy) FOOTER
   The moment of value exchange + the after-sign deliverable.

   v2 — DocuSign-aware. Petra runs sign-off through DocuSign as the
   evidence layer. The portal owns the *ceremony* (review the deed,
   read the terms, click); DocuSign owns the *crypto* (envelope,
   audit certificate, identity).

   Two methods, not three:
     'docusign'  — embedded DocuSign signing modal (default, primary).
                   The deed PDF is rendered inside an iframe via the
                   DocuSign eSignature REST API. Returns envelope id +
                   completion certificate.
     'click'     — DocuSign Click ("typed name + agree"). Faster path
                   for internal sign-off; still emits a Certificate of
                   Completion as the legal artefact. Renders as a
                   secondary card.

   Drawn-pad and type-to-confirm are gone — DocuSign handles them
   downstream if a customer prefers, and they were dilution.
   ========================================================================= */

function SignoffSignBlock({ deed, project, roster, signMethod = 'docusign', legalMode = 'standard' }) {
  return (
    <div className="deed" style={{paddingTop:0}}>
      <section className="signblock">
        <div className="preamble">
          <span className="ix">ix.</span>
          <div>
            <h2>The act of <em>sign-off.</em></h2>
            <p>
              By affixing your name below, you accept formula <b>{project.iteration}</b> for{' '}
              <b>{project.code} · {project.name}</b> on behalf of <b>{project.brand}</b>.
              The Lab will release pilot pulls to your panel, queue tech transfer, and seal v04
              as the <b>reference of record</b> until v05 is drafted. <em>This act is reversible
              only by mutual revocation within seven days.</em>
            </p>
            <div className="ds-trust">
              <svg className="ds-mark" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="24" height="24" rx="3" fill="#FFCC22"/>
                <path d="M9 14l3.5 3.5L20 10" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Powered by <b>DocuSign eSignature</b> · ESIGN &amp; eIDAS compliant · audit certificate emitted on completion</span>
            </div>
          </div>
        </div>

        <div className="ds-methods">
          {/* PRIMARY — embedded DocuSign signing */}
          <div className={`ds-method primary ${signMethod === 'docusign' ? 'selected' : ''}`}>
            <div className="ds-row">
              <span className="ds-pick">{signMethod === 'docusign' ? '● Selected' : 'Default'}</span>
              <span className="ds-tag">A · embedded</span>
            </div>
            <h4>Sign with <em>DocuSign.</em></h4>
            <p className="ds-why">
              The DocuSign signing modal opens here, in the portal. Choose typed, drawn, or
              uploaded signature. Returns a <b>Certificate of Completion</b> with timestamp, IP,
              and signer identity. Best for external counterparties.
            </p>

            <div className="ds-frame">
              {/* Mock of the embedded DocuSign iframe */}
              <div className="ds-frame-chrome">
                <span className="dot"/><span className="dot"/><span className="dot"/>
                <span className="ds-url">app.docusign.com / signing / envelope · DEED-014</span>
                <span className="ds-secure">🔒 secure</span>
              </div>
              <div className="ds-frame-body">
                <div className="ds-doc">
                  <div className="ds-doc-line w70"/>
                  <div className="ds-doc-line w90"/>
                  <div className="ds-doc-line w50"/>
                  <div className="ds-doc-line w80"/>
                  <div className="ds-doc-line w65"/>
                  <div className="ds-sig-tag">
                    <span className="tag-arrow">▶</span>
                    <span className="tag-l">Sign here</span>
                  </div>
                  <div className="ds-sig-line">
                    <span className="ds-sig-mark">Maya Aldosari</span>
                  </div>
                  <div className="ds-sig-meta">
                    <span>Maya Aldosari</span>
                    <span>maya@aldosari.studio</span>
                    <span>2026.05.04 · 14:18 EST</span>
                  </div>
                </div>
              </div>
              <div className="ds-frame-foot">
                <button className="ds-btn-finish">Finish &amp; return to Petra</button>
                <button className="ds-btn-other">Other actions ▾</button>
              </div>
            </div>

            <div className="ds-bullets">
              <div><b>Envelope</b> drafted on <em>Sign &amp; seal deed</em></div>
              <div><b>Identity</b> via portal SSO; optional SMS step-up</div>
              <div><b>Certificate</b> emitted to both parties on completion</div>
            </div>
          </div>

          {/* SECONDARY — DocuSign Click (click-to-agree) */}
          <div className={`ds-method secondary ${signMethod === 'click' ? 'selected' : ''}`}>
            <div className="ds-row">
              <span className="ds-pick">{signMethod === 'click' ? '● Selected' : 'Choose'}</span>
              <span className="ds-tag">B · click-through</span>
            </div>
            <h4>Click to <em>agree.</em></h4>
            <p className="ds-why">
              Type your full legal name, check the agreement, and proceed. Faster path for{' '}
              <b>internal sign-off</b>. DocuSign Click emits a Certificate of Completion in the
              background as the audit artefact.
            </p>
            <div className="ds-click">
              <div className="ds-click-row">
                <div className="ds-click-l">Sign as</div>
                <input className="ds-click-in" defaultValue="Maya Aldosari"/>
              </div>
              <label className="ds-click-agree">
                <span className="cb">✓</span>
                I have read deed <b>{deed.id}</b> and agree to the terms.
              </label>
              <div className="ds-click-foot">
                <span>Click ↗ DocuSign envelope</span>
                <span>•</span>
                <span>cert sent to both parties</span>
              </div>
            </div>
            <div className="ds-bullets quiet">
              <div>For <b>workspace members</b> with portal SSO</div>
              <div>Same legal weight under <b>ESIGN</b> &amp; <b>eIDAS · simple</b></div>
            </div>
          </div>
        </div>

        {/* Per-article attestation summary — only in regulated mode */}
        {legalMode === 'regulated' && (
          <div className="ds-att-summary">
            <div className="att-l">/ Per-article attestations recorded</div>
            <div className="att-grid">
              {['§1 Brief diff','§2 Formula','§3 Spec','§4 Stability','§5 Pilot','§6 INCI','§7 Flags','§8 Pour'].map(a => (
                <span key={a} className="att-chip">
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7l3 3 5-6"/></svg>
                  {a}
                </span>
              ))}
            </div>
            <div className="att-meta">All attestations carry forward on sign and are reproduced verbatim on the certificate.</div>
          </div>
        )}

        <div className="commit">
          <div className="terms">
            I, <b>Maya Aldosari</b>, acting for <b>{project.brand}</b>, accept formula <b>{project.iteration}</b>{' '}
            and the artefacts attached to this deed. I have read each section listed in the dossier,
            or marked it not applicable. I understand the open flag against fragrance LX-08 and elect to proceed.
            {legalMode !== 'minimal' && (
              <>
                {' '}<b>The Petra Lab-X Formula Sign-Off Agreement v2.4</b> governs this transaction;
                §3 (regulatory reps) and §4 (liability) apply.
              </>
            )}
            <span className="small">Deed {deed.id} · forum {deed.jurisdiction} · expires {deed.expires}</span>
          </div>
          <div className="actions">
            <button className="primary">
              <svg className="seal" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5.5"/><path d="M4 7l2 2 4-4"/></svg>
              Sign &amp; seal deed
            </button>
            <button className="secondary">Request changes</button>
            <span className="reroute">
              Not the right signer? <b>Reassign &rarr; {roster[1].name.split(' ')[0]} {roster[1].name.split(' ')[1][0]}.</b>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Legacy three-up footer — kept exported for the minimal-mode callsite,
   but the regular path now goes through SignoffColophon (in
   portal-signoff-legal.jsx). Left in the bundle so old artboards
   don't break if they reach for it. */
function SignoffFooter({ deed }) {
  return (
    <div className="deed" style={{paddingTop:0, paddingBottom:0, borderBottom:'1px solid var(--p-grid)'}}>
      <footer className="colophon">
        <div>
          <h5>/ The deed</h5>
          <div className="body">
            All deeds are immutable on sign. A signed deed becomes a <b>v04 record</b> in this
            project's archive and a PDF copy is issued to <b>both parties</b>.
          </div>
        </div>
        <div>
          <h5>/ Counterparties</h5>
          <div className="body">
            Issuer · <b>Petra Lab-X Inc.</b><br/>
            Issuer rep · {deed.issuer}<br/>
            Consignee rep · {deed.consignee}
          </div>
        </div>
        <div>
          <h5>/ Audit trail</h5>
          <div className="body">
            Every sign event is logged to the immutable <b>floor ledger</b> at
            <b> {deed.id.toLowerCase()}/audit</b>.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------ RECEIPT (after-sign state) ----------------------------------- */
function SignoffReceipt({ project, deed, legalMode = 'standard' }) {
  const unblocks = [
    { ix:'i.',   nm:'Pilot pulls released to panel',           sub:'Two 30 mL pulls couriered to Toronto. ETA Thursday.' },
    { ix:'ii.',  nm:'Tech transfer queued · vendor 12',         sub:'Drops onto vendor 12\'s docket overnight.' },
    { ix:'iii.', nm:'v04 sealed as reference of record',        sub:'v05 may now be drafted by Maya A.' },
    { ix:'iv.',  nm:'Carton artwork unblocked',                 sub:'Concept sketches enter review against the sealed INCI.' },
  ];
  return (
    <div className="receipt">
      {/* Background seal · PLX house mark */}
      <svg className="seal-bg" viewBox="0 0 200 200">
        <defs>
          <path id="seal-curve-top" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0" fill="none"/>
          <path id="seal-curve-bot" d="M 100,100 m -64,0 a 64,64 0 1,0 128,0" fill="none"/>
        </defs>
        <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="1"/>
        <circle cx="100" cy="100" r="84" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        <circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        {/* Wordmark curving along the outer ring */}
        <text fontFamily="var(--mono)" fontSize="7" fill="currentColor" letterSpacing="6">
          <textPath href="#seal-curve-top" startOffset="50%" textAnchor="middle">PETRA · LAB-X · TORONTO · EST. 2024</textPath>
        </text>
        <text fontFamily="var(--mono)" fontSize="6" fill="currentColor" letterSpacing="4">
          <textPath href="#seal-curve-bot" startOffset="50%" textAnchor="middle">REFERENCE · OF · RECORD</textPath>
        </text>
        {/* PLX monogram */}
        <text x="100" y="112" textAnchor="middle" fontFamily="var(--mazius)" fontSize="48" fill="currentColor" fontStyle="italic" letterSpacing="-1">PLX</text>
        {/* Tick marks at cardinals */}
        <g stroke="currentColor" strokeWidth="0.8">
          <line x1="100" y1="6" x2="100" y2="14"/>
          <line x1="100" y1="186" x2="100" y2="194"/>
          <line x1="6" y1="100" x2="14" y2="100"/>
          <line x1="186" y1="100" x2="194" y2="100"/>
        </g>
      </svg>

      {/* The wax stamp */}
      <svg className="stamp-mark" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="64" fill="var(--p-accent)" opacity="0.94"/>
        <circle cx="70" cy="70" r="56" fill="none" stroke="var(--p-paper)" strokeWidth="0.6" opacity="0.6"/>
        <text x="70" y="56" textAnchor="middle" fontFamily="var(--mono)" fontSize="6" fill="var(--p-paper)" letterSpacing="2">PETRA · LAB-X</text>
        <text x="70" y="86" textAnchor="middle" fontFamily="var(--mazius)" fontStyle="italic" fontSize="36" fill="var(--p-paper)">v04</text>
        <text x="70" y="104" textAnchor="middle" fontFamily="var(--mono)" fontSize="5" fill="var(--p-paper)" letterSpacing="2">SEALED · 14:18 EST</text>
      </svg>

      <div className="head">
        <div className="kicker">/ Sealed · 14:18 EST · Toronto</div>
        <h1>v04 is the <em>reference of record.</em></h1>
        <div className="sub">
          Deed <b>{deed.id}</b> was signed by <b>Maya Aldosari</b> on behalf of{' '}
          <b>{project.brand}</b> via DocuSign envelope <b>e8f4a2c1</b>, and countersigned
          by the Lab. The Certificate of Completion has been dropped to your <b>Documents</b>
          shelf and emailed to both parties.
        </div>
      </div>

      <div className="ledger">
        <div className="row"><span className="l">Deed</span><span className="v"><b>{deed.id}</b></span></div>
        <div className="row"><span className="l">Signed by</span><span className="v">Maya Aldosari · for {project.brand}</span></div>
        <div className="row"><span className="l">Method</span><span className="v">DocuSign embedded · envelope e8f4a2c1 · IP 174.94.•••.•••</span></div>
        <div className="row"><span className="l">Sealed at</span><span className="v">2026.05.04 · 14:18:04 EST</span></div>
        <div className="row"><span className="l">Counter-seal</span><span className="v">Petra Lab-X Inc. · auto-sealed 14:18:09</span></div>
        <div className="row"><span className="l">DocuSign cert</span><span className="v">Certificate of Completion · sha256:9d4f…2c81</span></div>
        <div className="row"><span className="l">Audit hash</span><span className="v">floor ledger entry #28,114 · 7-yr retention</span></div>
        {legalMode === 'regulated' && (
          <div className="row"><span className="l">Attestations</span><span className="v">8 of 8 sections · individually recorded</span></div>
        )}
        <div className="row"><span className="l">Open flags</span><span className="v">1 · fragrance LX-08 · acknowledged, not blocking</span></div>
      </div>

      <div className="unblocks">
        <h3>What this just unblocked</h3>
        <div className="grid">
          {unblocks.map((u, i) => (
            <div key={i} className="item">
              <span className="ix">{u.ix}</span>
              <div className="nm">{u.nm}<small>{u.sub}</small></div>
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button className="primary">Return to the bench &rarr;</button>
        <button className="ghost">Download deed PDF</button>
        <button className="ghost">DocuSign certificate</button>
        <button className="ghost">View audit trail</button>
      </div>
    </div>
  );
}

window.SignoffSignBlock = SignoffSignBlock;
window.SignoffFooter = SignoffFooter;
window.SignoffReceipt = SignoffReceipt;
