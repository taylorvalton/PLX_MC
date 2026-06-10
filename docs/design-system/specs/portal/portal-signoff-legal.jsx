/* =========================================================================
   PORTAL · SIGN-OFF · LEGAL SCAFFOLDING
   Three pieces that travel with every deed once you're past prototype:
     1. SignoffLegalBanner   — boilerplate header strip (above the dossier)
     2. SignoffAttestation   — per-article line shown only in REGULATED mode
     3. SignoffColophon      — full footer with clauses (replaces the old
                                three-column "deed/counterparties/audit"
                                colophon when legalMode !== 'minimal')

   legalMode contract:
     'minimal'   → no banner, no per-article attestation, light colophon
     'standard'  → banner + light colophon with clauses (default for prod)
     'regulated' → banner with REGULATED chip + per-article attestation
                   + heavy colophon with full regulatory reps
   ========================================================================= */

function SignoffLegalBanner({ deed, project, legalMode }) {
  if (legalMode === 'minimal') return null;
  const isRegulated = legalMode === 'regulated';
  return (
    <div className="deed legal-banner-deed" style={{paddingTop:0}}>
      <div className={`legal-banner ${isRegulated ? 'regulated' : ''}`}>
        <div className="lb-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <div className="lb-body">
          <div className="lb-kicker">
            {isRegulated ? 'Regulated SKU · enhanced sign-off' : 'Boilerplate · governing terms apply'}
          </div>
          <p className="lb-text">
            By signing this deed you certify <b>§3 of the Petra Lab-X Formula Sign-Off Agreement</b>{' '}
            (liability · IP assignment · regulatory representations) and agree the artefacts attached
            to <b>{project.iteration}</b> form the binding reference of record.
            {isRegulated && (
              <>
                {' '}This SKU is classified <b>regulated</b>; per-article attestations apply and
                each <em>Reviewed</em> mark is recorded as an individual representation under{' '}
                <b>EU 1223/2009</b> &amp; <b>FDA 21 CFR 700</b>.
              </>
            )}
          </p>
        </div>
        <div className="lb-meta">
          <div><span>Agreement</span><b>v2.4 · 2025-11</b></div>
          <div><span>Forum</span><b>{deed.jurisdiction.split(' · ')[0]}</b></div>
          <div><span>Retention</span><b>7 years</b></div>
          {isRegulated && <div className="reg"><span>SKU class</span><b>Regulated · skin care</b></div>}
        </div>
        <button className="lb-open">
          Read full agreement <span className="ar">↗</span>
        </button>
      </div>
    </div>
  );
}

/* Inline attestation that sits under the "Reviewed" toolbar of each
   article in regulated mode. Tiny italic, single line. Visually quiet. */
function SignoffAttestation({ section, sectionRef, legalMode }) {
  if (legalMode !== 'regulated') return null;
  return (
    <div className="attestation">
      <span className="att-mark">¶</span>
      I attest <em>{section}</em> ({sectionRef}) conforms to spec <b>PLX-2614</b> and to applicable
      <b> EU 1223/2009</b> &amp; <b>FDA 21 CFR 700</b> requirements.
      <span className="att-meta">Recorded individually · audit ledger</span>
    </div>
  );
}

/* The new colophon. Replaces the simple three-column footer when
   legalMode !== 'minimal'. Keeps the original audit-trail card and
   adds clauses (governing law, IP, regulatory reps, retention).      */
function SignoffColophon({ deed, project, legalMode }) {
  const isRegulated = legalMode === 'regulated';

  /* Minimal — same three-up as before. Kept here so caller doesn't
     need to branch in the parent. */
  if (legalMode === 'minimal') {
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
              Every view, comment, acknowledge, and sign event is logged to the
              immutable <b>floor ledger</b> at <b>{deed.id.toLowerCase()}/audit</b>.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="deed" style={{paddingTop:0, paddingBottom:0, borderBottom:'1px solid var(--p-grid)'}}>
      <footer className="colophon-full">
        <div className="cf-head">
          <div className="cf-kicker">/ Colophon</div>
          <h3>The fine print, <em>set in roman.</em></h3>
          <p className="cf-lede">
            What follows is the legal frame around this deed. You can read it here, or download
            the full <b>Petra Lab-X Formula Sign-Off Agreement v2.4</b> as PDF. By signing, you
            agree the clauses below govern this transaction.
          </p>
        </div>

        <div className="cf-clauses">
          <article>
            <div className="cf-num">§1</div>
            <div>
              <h6>Governing law &amp; forum</h6>
              <p>
                This deed is governed by the laws of <b>Ontario, Canada</b>; non-exclusive forum
                <b> Toronto, ON</b>. International consignees may invoke their local consumer-safety
                regulators in addition. Petra Lab-X waives no statutory rights of the consignee.
              </p>
            </div>
          </article>
          <article>
            <div className="cf-num">§2</div>
            <div>
              <h6>IP &amp; reference of record</h6>
              <p>
                The formula recorded in <b>§2 of the dossier</b> is assigned to <b>{project.brand}</b>
                upon sign and counter-sign. Petra Lab-X retains a non-exclusive licence to manufacture
                under direction. The <em>reference of record</em> is the artefact bundle hashed into
                this deed; later versions supersede only on a new deed.
              </p>
            </div>
          </article>
          <article>
            <div className="cf-num">§3</div>
            <div>
              <h6>Regulatory representations</h6>
              <p>
                Petra Lab-X represents the formula and its label conform to <b>EU 1223/2009</b>,
                <b> UK Cosmetic Products Regulation</b>, and <b>FDA 21 CFR 700</b> at the date of sign,
                save for any <em>open flag</em> recorded under §7 (which {project.brand} acknowledges
                and elects to proceed with at its discretion). The PIF/CPNP filing is the consignee's
                responsibility unless separately contracted.
                {isRegulated && (
                  <>
                    {' '}<b>This SKU is classified regulated;</b> per-article attestations under §1–§8 are
                    recorded as individual representations and survive sign for the retention period.
                  </>
                )}
              </p>
            </div>
          </article>
          <article>
            <div className="cf-num">§4</div>
            <div>
              <h6>Liability &amp; indemnity</h6>
              <p>
                Petra Lab-X's aggregate liability under this deed is capped at the <b>fees paid for
                project {project.code}</b>, save in cases of gross negligence or wilful misconduct.
                Each party indemnifies the other against third-party claims arising from material
                misrepresentation in their respective signed sections.
              </p>
            </div>
          </article>
          <article>
            <div className="cf-num">§5</div>
            <div>
              <h6>Retention &amp; revocation</h6>
              <p>
                The signed deed and all attached artefacts are retained on the immutable <b>floor
                ledger</b> for <b>seven years</b>. Mutual revocation is permitted within seven days
                of sign by counter-deed; thereafter the deed stands. The audit trail for this deed
                is queryable at <b>{deed.id.toLowerCase()}/audit</b>.
              </p>
            </div>
          </article>
          {isRegulated && (
            <article className="reg-art">
              <div className="cf-num">§6</div>
              <div>
                <h6>Per-article attestations · regulated SKU</h6>
                <p>
                  Each <em>Reviewed</em> mark in §1–§8 is recorded as an individual representation
                  by the signing party with timestamp, IP, and session, and is reproduced verbatim
                  on the signed PDF. Withdrawal of any single attestation withdraws the deed.
                </p>
              </div>
            </article>
          )}
        </div>

        <div className="cf-foot">
          <div className="cf-cp">
            <h6>Counterparties</h6>
            <div className="cf-cp-row">
              <div>
                <span>Issuer</span>
                <b>Petra Lab-X Inc.</b>
                <em>{deed.issuer}</em>
              </div>
              <div>
                <span>Consignee</span>
                <b>{deed.consignee.split(' for ')[1] || 'Aldosari Studio'}</b>
                <em>{deed.consignee}</em>
              </div>
            </div>
          </div>
          <div className="cf-down">
            <button className="cf-pdf">↓ Full Agreement v2.4 (PDF)</button>
            <small>Drop to your <b>Documents</b> shelf with the deed on sign.</small>
          </div>
        </div>
      </footer>
    </div>
  );
}

window.SignoffLegalBanner = SignoffLegalBanner;
window.SignoffAttestation = SignoffAttestation;
window.SignoffColophon = SignoffColophon;
