/* =========================================================================
   PORTAL · SIGN-OFF · SECTION COMPONENTS · part 3
   §5 Pilot 04 · §6 INCI · §7 Flags · §8 Pour
   ========================================================================= */

function SignoffPilot({ pilot }) {
  return (
    <div className="deed" style={{paddingTop:0}}>
      <section className="article">
        <div className="ahd">
          <div className="l">
            <span className="ix">v.</span>
            <h2>Pilot 04 — what came <em>off the kettle.</em></h2>
          </div>
          <div className="actions">
            <span className="skip">Mark not applicable</span>
            <button className="review-btn"><svg className="check" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7l3 3 5-6"/></svg>Reviewed</button>
          </div>
        </div>
        <p className="lede">Eighteen kilograms poured Monday morning. Eight panellists. <em>Glide markedly improved.</em></p>
        <div className="pilot">
          <div className="card">
            <h4>Run · facts</h4>
            <div className="facts">
              <div className="it"><span className="l">Run</span><span className="v">{pilot.id} · pilot</span></div>
              <div className="it"><span className="l">Poured</span><span className="v">{pilot.poured}</span></div>
              <div className="it"><span className="l">Kettle</span><span className="v">{pilot.kettle}</span></div>
              <div className="it"><span className="l">Operator</span><span className="v">{pilot.operator}</span></div>
              <div className="it"><span className="l">Deviation</span><span className="v">{pilot.deviation} · within window</span></div>
              <div className="it"><span className="l">Panel n</span><span className="v">{pilot.panelN} · in-house</span></div>
            </div>
          </div>
          <div className="card panel">
            <h4>Panel · notes (n={pilot.panelN})</h4>
            <ul>
              {pilot.panelNotes.map((n, i) => (
                <li key={i}><span className="q">&ldquo;</span><span>{n}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function SignoffInci({ inciLabel }) {
  return (
    <div className="deed" style={{paddingTop:0}}>
      <section className="article">
        <div className="ahd">
          <div className="l">
            <span className="ix">vi.</span>
            <h2>The label, <em>as it will read.</em></h2>
          </div>
          <div className="actions">
            <span className="skip">Open carton mock ↗</span>
            <button className="review-btn"><svg className="check" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7l3 3 5-6"/></svg>Reviewed</button>
          </div>
        </div>
        <p className="lede">Ordered by weight per EU/UK convention; ingredients below 1% in any order at the tail. <em>This is what the carton will say.</em></p>
        <div className="inci">
          <div className="l">INCI · ingredient declaration</div>
          <div className="body">{inciLabel}</div>
          <div className="meta">
            <span>Markets · <b>EU · UK · CA</b></span>
            <span>Allergens · <b>pending Givaudan</b></span>
            <span>Total · <b>13 listed</b></span>
            <span>Cert · <b>Vegan · cruelty-free</b></span>
          </div>
        </div>
      </section>
    </div>
  );
}

function SignoffFlags({ flags }) {
  return (
    <div className="deed" style={{paddingTop:0}}>
      <section className="article">
        <div className="ahd">
          <div className="l">
            <span className="ix">vii.</span>
            <h2>Flags, <em>open against this deed.</em></h2>
          </div>
          <div className="actions">
            <span className="skip">Flag log ↗</span>
          </div>
        </div>
        <p className="lede">One open. Signing v04 is permitted; the flag travels with the signed record and remains visible until cleared. <em>The choice is yours.</em></p>
        <div className="flags">
          {flags.map((f, i) => (
            <div key={i} className="flag">
              <div className="body">
                <span className="tag">amber · open · {f.since}</span>
                <h4>{f.title}</h4>
                <div className="b">{f.body}</div>
                <div className="meta">
                  <span>Severity · <b>{f.sev}</b></span>
                  <span>Source · <b>{f.ref}</b></span>
                </div>
              </div>
              <div className="acks">
                <label className="ack"><input type="checkbox" defaultChecked/> Acknowledged</label>
                <label className="ack" style={{color:'var(--p-muted)'}}><input type="checkbox"/> Block until cleared</label>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SignoffPour() {
  return (
    <div className="deed" style={{paddingTop:0}}>
      <section className="article">
        <div className="ahd">
          <div className="l">
            <span className="ix">viii.</span>
            <h2>Pour, <em>logged.</em></h2>
          </div>
          <div className="actions">
            <span className="skip">Mark not applicable</span>
            <button className="review-btn"><svg className="check" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7l3 3 5-6"/></svg>Reviewed</button>
          </div>
        </div>
        <p className="lede">A 36-second clip from Kettle 02 the morning of the pour. <em>Proof of life.</em></p>
        <div className="pour">
          <div className="placeholder-tag">Pilot pour · video placeholder · 36s</div>
          <div className="frame-num">04</div>
          <div className="label">
            <span><b>KETTLE 02</b></span>
            <span className="sep">·</span>
            <span>18 kg</span>
            <span className="sep">·</span>
            <span>J. Tessaro</span>
          </div>
          <div className="ts">2026.05.04 · 09:14:22 EST</div>
        </div>
      </section>
    </div>
  );
}

window.SignoffPilot = SignoffPilot;
window.SignoffInci = SignoffInci;
window.SignoffFlags = SignoffFlags;
window.SignoffPour = SignoffPour;
