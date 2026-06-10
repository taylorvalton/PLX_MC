/* ============================================================
 * Portal Navigation Map
 * One-page chart of how the portal screens connect.
 * Drawn entirely in CSS / mono type to match the deed colophon.
 * ============================================================ */

function PortalNavigationMap({ scheme = 'light' }) {
  const css = `
    .pnm { width:1440px; box-sizing:border-box; min-height:1500px; padding:64px 72px; background:var(--p-paper); color:var(--p-ink); font-family:var(--mazius), Georgia, serif; position:relative;}
    .pnm-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; padding-bottom:18px; border-bottom:1px solid var(--p-grid);}
    .pnm-header .l .kicker { font-family:var(--mono); font-size:10px; letter-spacing:0.24em; text-transform:uppercase; color:var(--p-muted); margin-bottom:14px;}
    .pnm-header .l h1 { font-family:var(--mazius); font-weight:400; font-size:48px; line-height:1.05; margin:0; letter-spacing:-0.01em;}
    .pnm-header .l h1 em { font-style:italic; color:var(--p-accent);}
    .pnm-header .l .sub { font-family:var(--mazius); font-style:italic; font-size:16px; color:var(--p-ink-2); margin-top:10px; max-width:560px; line-height:1.45;}
    .pnm-header .r { font-family:var(--mono); font-size:9.5px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted); text-align:right; line-height:1.7;}
    .pnm-header .r b { color:var(--p-ink); font-weight:500;}

    /* legend strip */
    .pnm-legend { display:flex; flex-wrap:wrap; gap:14px 32px; padding:18px 0 26px; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-ink-2); border-bottom:1px solid var(--p-grid); margin-bottom:48px;}
    .pnm-legend .lg { display:flex; align-items:center; gap:10px; white-space:nowrap;}
    .pnm-legend .swatch { width:24px; height:0; border-top:1.5px solid var(--p-ink); display:inline-block; flex:0 0 24px;}
    .pnm-legend .swatch.dashed { border-top:1.5px dashed var(--p-ink);}
    .pnm-legend .swatch.accent { border-top-color:var(--p-accent);}
    .pnm-legend .swatch.future { border-top:1.5px dotted var(--p-muted);}
    .pnm-legend .node-marker { width:9px; height:9px; border:1px solid var(--p-ink); display:inline-block; flex:0 0 9px;}
    .pnm-legend .node-marker.live { background:var(--p-ink);}
    .pnm-legend .node-marker.future { border-style:dashed; opacity:0.5;}

    /* the map proper */
    .pnm-map { position:relative; padding:32px 8px;}
    .pnm-row { display:grid; grid-template-columns:repeat(4, 1fr); gap:32px; position:relative;}
    .pnm-row.future { margin-top:88px;}

    .pnm-col-label { position:absolute; top:-44px; font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted);}

    /* node cards */
    .pnm-node { position:relative; border:1px solid var(--p-grid); background:var(--p-card); padding:20px 22px 18px; min-height:240px; display:flex; flex-direction:column;}
    .pnm-node.future { border-style:dashed; background:transparent; opacity:0.72;}
    .pnm-node.entry::before { content:""; position:absolute; left:-1px; top:-1px; bottom:-1px; width:3px; background:var(--p-accent);}
    .pnm-node.terminal::before { content:""; position:absolute; left:-1px; top:-1px; bottom:-1px; width:3px; background:var(--p-ink);}

    .pnm-node .step { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); margin-bottom:10px; display:flex; gap:10px; align-items:center;}
    .pnm-node .step .num { color:var(--p-ink);}
    .pnm-node .step .sep { color:var(--p-grid);}
    .pnm-node .step .pin { margin-left:auto; padding:2px 6px; border:1px solid var(--p-grid); font-size:8px; letter-spacing:0.16em;}
    .pnm-node .step .pin.live { background:var(--p-ink); color:var(--p-paper); border-color:var(--p-ink);}
    .pnm-node .step .pin.stub { color:var(--p-accent); border-color:var(--p-accent);}
    .pnm-node .step .pin.future { color:var(--p-muted); border-style:dashed;}
    .pnm-node h3 { font-family:var(--mazius); font-size:24px; line-height:1.15; margin:0 0 6px; font-weight:400; letter-spacing:-0.005em;}
    .pnm-node h3 em { font-style:italic; color:var(--p-accent);}
    .pnm-node .url { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.04em; margin-bottom:14px; word-break:break-all;}
    .pnm-node .blurb { font-family:var(--mazius); font-style:italic; font-size:13px; line-height:1.5; color:var(--p-ink-2); margin-bottom:14px;}
    .pnm-node .ref { margin-top:auto; padding-top:12px; border-top:1px dashed var(--p-grid); font-family:var(--mono); font-size:9px; letter-spacing:0.04em; color:var(--p-muted); display:flex; flex-direction:column; gap:4px;}
    .pnm-node .ref .ref-l { letter-spacing:0.16em; text-transform:uppercase;}
    .pnm-node .ref b { color:var(--p-ink); font-weight:500; word-break:break-all; line-height:1.4;}

    /* arrows */
    .pnm-arrows { position:absolute; inset:0; pointer-events:none; z-index:1;}
    .pnm-arrow-label { position:absolute; font-family:var(--mono); font-size:8.5px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-ink); background:var(--p-paper); padding:2px 6px; transform:translate(-50%,-50%); white-space:nowrap;}
    .pnm-arrow-label.accent { color:var(--p-accent); border:1px solid var(--p-accent);}
    .pnm-arrow-label.muted { color:var(--p-muted);}

    /* exit arrow + branches */
    .pnm-exits { margin-top:88px; padding-top:32px; border-top:1px solid var(--p-grid); position:relative;}
    .pnm-exits .header { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); margin-bottom:24px;}
    .pnm-exits-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:32px;}
    .pnm-exit { display:flex; flex-direction:column; gap:8px; padding:16px 18px; border:1px dashed var(--p-grid);}
    .pnm-exit .ax { font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-accent);}
    .pnm-exit h4 { font-family:var(--mazius); font-size:18px; line-height:1.2; margin:0; font-weight:400;}
    .pnm-exit h4 em { font-style:italic;}
    .pnm-exit .why { font-family:var(--mazius); font-style:italic; font-size:13px; line-height:1.45; color:var(--p-ink-2); margin:0;}
    .pnm-exit .meta { font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted); margin-top:auto; padding-top:8px; border-top:1px dashed var(--p-grid);}

    /* offstage panel — what feeds in / what receives */
    .pnm-offstage { display:grid; grid-template-columns:1fr 1fr; gap:48px; margin-top:64px; padding-top:28px; border-top:1px solid var(--p-grid);}
    .pnm-offstage h5 { font-family:var(--mono); font-size:9.5px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); margin:0 0 14px; font-weight:500;}
    .pnm-offstage ul { margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:8px; font-family:var(--mazius); font-size:13.5px; line-height:1.45; color:var(--p-ink-2);}
    .pnm-offstage ul li { padding-left:14px; position:relative;}
    .pnm-offstage ul li::before { content:"·"; position:absolute; left:0; top:-3px; font-size:18px; color:var(--p-muted);}
    .pnm-offstage ul li b { font-weight:400; color:var(--p-ink); font-style:italic;}
    .pnm-offstage ul li .tag { font-family:var(--mono); font-style:normal; font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted); margin-left:8px;}

    /* footer */
    .pnm-foot { margin-top:48px; padding-top:18px; border-top:1px solid var(--p-grid); font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--p-muted); display:flex; justify-content:space-between;}
  `;

  // SVG arrow overlay — positions are tuned to the 4-col grid + 32px gap.
  // Coordinates are within the .pnm-map box (approx 1296 wide).
  const arrows = (
    <svg className="pnm-arrows" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1296 460">
      <defs>
        <marker id="pnm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,1 L9,5 L0,9 Z" fill="var(--p-ink)" />
        </marker>
        <marker id="pnm-arr-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,1 L9,5 L0,9 Z" fill="var(--p-accent)" />
        </marker>
      </defs>
      {/* node 1 -> 2 */}
      <line x1="316" y1="100" x2="328" y2="100" stroke="var(--p-ink)" strokeWidth="1.5" markerEnd="url(#pnm-arr)" />
      {/* node 2 -> 3 */}
      <line x1="640" y1="100" x2="652" y2="100" stroke="var(--p-ink)" strokeWidth="1.5" markerEnd="url(#pnm-arr)" />
      {/* node 3 -> 4 (accent — the chasm we just designed) */}
      <line x1="964" y1="100" x2="976" y2="100" stroke="var(--p-accent)" strokeWidth="1.5" markerEnd="url(#pnm-arr-accent)" />
    </svg>
  );

  return (
    <div className={`pnm pf scheme-${scheme}`}>
      <PortalTokens scheme={scheme} />
      <style>{css}</style>

      <div className="pnm-header">
        <div className="l">
          <div className="kicker">Portal · Navigation Map · v1</div>
          <h1>How the screens <em>connect</em></h1>
          <div className="sub">A reviewer's map of the four-step path from "log in" to "v04 sealed". One row, four nodes. Stubs and future surfaces marked.</div>
        </div>
        <div className="r">
          ATLAS · NAV-MAP-001<br/>
          <b>04 Mar 2026</b> · 14:22 GMT<br/>
          Petra Lab-X · Client Portal
        </div>
      </div>

      <div className="pnm-legend">
        <div className="lg"><span className="node-marker live"/><span>Live screen</span></div>
        <div className="lg"><span className="node-marker"/><span>Designed, stub data</span></div>
        <div className="lg"><span className="node-marker future"/><span>Future surface</span></div>
        <div className="lg" style={{marginLeft:'auto'}}><span className="swatch"/><span>Primary path</span></div>
        <div className="lg"><span className="swatch accent"/><span>Sign-off transition</span></div>
        <div className="lg"><span className="swatch future"/><span>Branch / exit</span></div>
      </div>

      <div className="pnm-map">
        <div className="pnm-row">
          {arrows}

          {/* 1 — Login */}
          <div className="pnm-node entry">
            <div className="step">
              <span>01 · Entry</span>
              <span className="pin live">Live</span>
            </div>
            <h3>Lab-bench <em>login</em></h3>
            <div className="url">portal.petralabx.com /login</div>
            <div className="blurb">"Welcome back to the lab." Brand-as-instrument. Workspace switcher in chrome. Magic-link or SSO.</div>
            <div className="ref"><span className="ref-l">Variant · Lab-bench</span><b>portal-login.jsx</b></div>
          </div>

          {/* 2 — Workbench */}
          <div className="pnm-node">
            <div className="step">
              <span>02 · Home</span>
              <span className="pin live">Live</span>
            </div>
            <h3>Workbench<em>.</em></h3>
            <div className="url">/workbench</div>
            <div className="blurb">A list of the user's projects + their current phase. Floor strip across the top — live telemetry. "Sign v04" CTA on the active project.</div>
            <div className="ref"><span className="ref-l">Variant · D / single rail</span><b>portal-workbench-single-rail</b></div>
          </div>

          {/* 3 — Project detail */}
          <div className="pnm-node">
            <div className="step">
              <span>03 · Drill-in</span>
              <span className="pin live">Live</span>
            </div>
            <h3>Project <em>detail</em></h3>
            <div className="url">/projects/PLX-2614</div>
            <div className="blurb">Per-project view. Phase indicator, formula history, pilot pour status, open flags. The sign CTA appears when v04 is ready.</div>
            <div className="ref"><span className="ref-l">PLX-2614 · v04 ready</span><b>portal-project-detail</b></div>
          </div>

          {/* 4 — Sign-off */}
          <div className="pnm-node terminal">
            <div className="step">
              <span>04 · Commit</span>
              <span className="pin stub">Stub</span>
            </div>
            <h3>Sign-off <em>deed</em></h3>
            <div className="url">/projects/PLX-2614/sign/v04</div>
            <div className="blurb">Notarial dossier, DocuSign-embedded. Three legal modes. The artefact this project produces — formula, COA, artwork all sign through the same chassis.</div>
            <div className="ref"><span className="ref-l">3 modes · 2 paths · 2 schemes</span><b>portal-signoff</b></div>
          </div>
        </div>
      </div>

      {/* future row — what comes after */}
      <div className="pnm-exits">
        <div className="header">After v04 seals · branches we haven't drawn yet</div>
        <div className="pnm-exits-grid">
          <div className="pnm-exit">
            <span className="ax">Branch · A</span>
            <h4>Sealed <em>archive</em></h4>
            <p className="why">Read-only deed in the project's docs tab. Floor ledger receipt. Linked from the project header thereafter.</p>
            <div className="meta">Designed · Receipt artboards exist</div>
          </div>
          <div className="pnm-exit">
            <span className="ax">Branch · B</span>
            <h4>Pilot <em>release</em></h4>
            <p className="why">v04 cleared → COA issuance request → carton artwork sign-off (same chassis, different artefact). Loops back to step 04.</p>
            <div className="meta">Stubbed · 00b unified-flow</div>
          </div>
          <div className="pnm-exit">
            <span className="ax">Branch · C</span>
            <h4>Iteration <em>v05</em></h4>
            <p className="why">If a flag blocks: sign-off pauses, project reverts to "in iteration", workbench surfaces a new round-trip badge.</p>
            <div className="meta">Future · not yet drawn</div>
          </div>
        </div>
      </div>

      {/* offstage — what feeds in / what receives */}
      <div className="pnm-offstage">
        <div>
          <h5>↳ Feeds the deed</h5>
          <ul>
            <li><b>Brief</b> — locked at kickoff, restated in §1<span className="tag">human · 1×</span></li>
            <li><b>Pilot pour</b> — Floor 02 / Pour 04, recorded video<span className="tag">floor · live</span></li>
            <li><b>Lab specs</b> — pH, viscosity, accelerated stab<span className="tag">bench · live</span></li>
            <li><b>INCI</b> — auto-generated from formula tree<span className="tag">system</span></li>
            <li><b>Open flags</b> — anything raised in iteration<span className="tag">human · 0–N</span></li>
          </ul>
        </div>
        <div>
          <h5>↳ Receives from the deed</h5>
          <ul>
            <li><b>Floor ledger</b> — immutable receipt, hash + UTC<span className="tag">system</span></li>
            <li><b>Project header</b> — phase advances to "v04 sealed"<span className="tag">portal</span></li>
            <li><b>Workbench</b> — sign CTA disappears, "open deed" appears<span className="tag">portal</span></li>
            <li><b>COA / artwork chassis</b> — unlocked for next round<span className="tag">stub</span></li>
            <li><b>Email · DocuSign</b> — countersigned PDF to both reps<span className="tag">external</span></li>
          </ul>
        </div>
      </div>

      <div className="pnm-foot">
        <span>Petra Lab-X · client portal · navigation map</span>
        <span>4 nodes · 1 path · 3 branches · v1</span>
      </div>
    </div>
  );
}

window.PortalNavigationMap = PortalNavigationMap;
