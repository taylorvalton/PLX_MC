/* =========================================================================
   PORTAL · SIGN-OFF · SECTION COMPONENTS · part 2
   §2 Formula table · §3 Specs · §4 Stability
   ========================================================================= */

function SignoffFormula({ formula, renderDelta }) {
  return (
    <div className="deed" style={{paddingTop:0}}>
      <section className="article">
        <div className="ahd">
          <div className="l">
            <span className="ix">ii.</span>
            <h2>The formula, line <em>by line.</em></h2>
          </div>
          <div className="actions">
            <span className="skip">Filter · changed only</span>
            <button className="review-btn"><svg className="check" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7l3 3 5-6"/></svg>Reviewed</button>
          </div>
        </div>
        <p className="lede">Twelve ingredients across four phases. Three rows changed from v03; one is new; one carries an open supplier flag. <em>Comment on any line</em> &mdash; or sign in full at the foot of the deed.</p>

        <table className="ftable">
          <thead>
            <tr>
              <th style={{width:'30%'}}>Ingredient</th>
              <th className="r" style={{width:'70px'}}>w/w %</th>
              <th style={{width:'14%'}}>Function</th>
              <th style={{width:'18%'}}>Supplier</th>
              <th style={{width:'12%'}}>Δ v03 → v04</th>
              <th style={{width:'12%'}}>Per row</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let lastPhase = null;
              const rows = [];
              formula.forEach((row, i) => {
                if (row.phase !== lastPhase) {
                  rows.push(
                    <tr key={`p-${row.phase}`} className="phase-row">
                      <td colSpan="6"><b>Phase {row.phase}</b> · {row.phase==='A'?'water':row.phase==='B'?'thickener':row.phase==='C'?'actives':'preservatives + adjust'}</td>
                    </tr>
                  );
                  lastPhase = row.phase;
                }
                rows.push(
                  <tr key={i} className={row.hero ? 'hero' : ''}>
                    <td>
                      <div className="ing-name">{row.ing}</div>
                      <div className="ing-inci">INCI · {row.inci}</div>
                      {row.note && <div className="ing-note">{row.note}</div>}
                    </td>
                    <td className="pct">{row.pct}</td>
                    <td className="fn">{row.fn}</td>
                    <td className="sup">{row.supplier}</td>
                    <td className="delta-cell">{renderDelta(row)}</td>
                    <td>
                      <div className="row-actions">
                        {row.commentCount
                          ? <span className="cmt-chip has">
                              <svg className="ic" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 3h10v7H6l-3 3V3z"/></svg>
                              {row.commentCount}
                            </span>
                          : <span className="cmt-add">+ Comment</span>
                        }
                      </div>
                    </td>
                  </tr>
                );
              });
              return rows;
            })()}
          </tbody>
          <tfoot>
            <tr>
              <td>12 ingredients · 4 phases</td>
              <td className="r">100.00</td>
              <td colSpan="4" style={{textAlign:'right', color:'var(--p-muted)', fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.04em'}}><span style={{color:'var(--p-warn)'}}>2 ↑</span> · <span style={{color:'var(--p-info)'}}>1 ↓</span> · <span style={{color:'var(--p-accent)'}}>1 new</span> · <span style={{color:'var(--p-warn)'}}>1 supplier flag</span> · 8 unchanged</td>
            </tr>
          </tfoot>
        </table>
      </section>
    </div>
  );
}

function SignoffSpecs({ specs }) {
  return (
    <div className="deed" style={{paddingTop:0}}>
      <section className="article">
        <div className="ahd">
          <div className="l">
            <span className="ix">iii.</span>
            <h2>Spec snapshot, <em>at the bench.</em></h2>
          </div>
          <div className="actions">
            <span className="skip">Open full spec sheet ↗</span>
            <button className="review-btn"><svg className="check" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7l3 3 5-6"/></svg>Reviewed</button>
          </div>
        </div>
        <p className="lede">Five highlights, all in window. Fourteen further parameters &mdash; organoleptic, microbial, heavy metals, packaging compat &mdash; live in the full sheet.</p>
        <div className="specs">
          {specs.map((s,i) => (
            <div key={i} className="it">
              <div className="l">{s.l}</div>
              <div className="v">{s.v}<small>{s.sub}</small></div>
              <span className="pass"><span className="dot"/>{s.stat}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SignoffStability({ stability }) {
  return (
    <div className="deed" style={{paddingTop:0}}>
      <section className="article">
        <div className="ahd">
          <div className="l">
            <span className="ix">iv.</span>
            <h2>Stability — four weeks, <em>accelerated.</em></h2>
          </div>
          <div className="actions">
            <span className="skip">Mark not applicable</span>
            <button className="review-btn"><svg className="check" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7l3 3 5-6"/></svg>Reviewed</button>
          </div>
        </div>
        <p className="lede">Held at 40&deg;C; pH and viscosity sampled weekly. <em>No separation, no colour shift.</em> Long-term study is continuing in parallel and is not required for v04 sign.</p>
        <div className="stab">
          {stability.map((c,i) => (
            <div key={i} className={`col ${i === stability.length-1 ? 'now' : ''}`}>
              <div className="wk">{c.wk}</div>
              <div className="v"><span className="l">pH</span><span>{c.ph}</span></div>
              <div className="v"><span className="l">Visc.</span><span>{c.visc}</span></div>
              <div className="v"><span className="l">Sep.</span><span>{c.sep}</span></div>
              <div className="v"><span className="l">Col.</span><span>{c.col}</span></div>
              <div className="note">{c.note}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

window.SignoffFormula = SignoffFormula;
window.SignoffSpecs = SignoffSpecs;
window.SignoffStability = SignoffStability;
