/* =========================================================================
   PORTAL LOGIN — DIRECTION A · "LAB BENCH" (warmer, editorial)
   =========================================================================
   Single-surface paper canvas. Marketing-site DNA loud: large Mazius
   wordmark, periodic-element brand mark, hairline grid background, mono
   kickers everywhere. The form sits on the page like a page in a journal
   — generous whitespace, calm hierarchy, accent only on the primary CTA.
   ========================================================================= */

function PortalLogin_LabBench({ scheme = 'light' }) {
  const tokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;
  return (
    <div className="pf" style={{...tokens, width:1440, height:900, position:'relative', overflow:'hidden', background:'var(--p-paper)'}}>
      <PortalStyles />

      {/* Hairline page grid */}
      <div style={{position:'absolute', inset:0, backgroundImage:`linear-gradient(to right, var(--p-grid-2) 1px, transparent 1px), linear-gradient(to bottom, var(--p-grid-2) 1px, transparent 1px)`, backgroundSize:'80px 80px', pointerEvents:'none'}}/>

      {/* Top frame */}
      <div style={{position:'absolute', top:0, left:0, right:0, padding:'24px 56px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--p-grid)', background:'var(--p-paper)'}}>
        <div style={{display:'flex', alignItems:'center', gap:18}}>
          <span className="serif" style={{fontSize:22, letterSpacing:'-0.02em'}}>Petra<em style={{color:'var(--p-accent)', fontStyle:'italic'}}>/x</em></span>
          <span style={{height:14, width:1, background:'var(--p-grid)'}}/>
          <span className="kicker">Client Portal · plxcustomer.io</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:24}}>
          <span className="kicker" style={{display:'inline-flex', alignItems:'center', gap:8}}><span className="pulse"/>FLOOR · LIVE · TORONTO</span>
          <a className="kicker" style={{color:'var(--p-ink-2)', textDecoration:'none', borderBottom:'1px solid var(--p-grid)', paddingBottom:2}}>← back to plx.io</a>
        </div>
      </div>

      {/* Bottom frame */}
      <div style={{position:'absolute', bottom:0, left:0, right:0, padding:'18px 56px', display:'flex', justifyContent:'space-between', borderTop:'1px solid var(--p-grid)', background:'var(--p-paper)'}}>
        <span className="meta">FIG. 01 · CLIENT PORTAL / SIGN-IN</span>
        <span className="meta">GMP ISO 22716 · MOCRA COMPLIANT · SOC 2</span>
        <span className="meta">v.26.05 · 2026.05.03</span>
      </div>

      {/* CONTENT — three-column lockup */}
      <div style={{position:'absolute', top:80, bottom:62, left:0, right:0, display:'grid', gridTemplateColumns:'1.1fr 1fr 1.1fr', alignItems:'stretch'}}>
        {/* LEFT — wordmark + brand essay */}
        <div style={{padding:'72px 56px 56px', display:'flex', flexDirection:'column', justifyContent:'space-between', borderRight:'1px solid var(--p-grid)'}}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:36}}>
              <span className="pmark" style={{borderColor:'var(--p-ink)'}}>
                <span className="num">14</span><span className="sym">Px</span>
              </span>
              <div className="meta">CLIENT<br/>WORKBENCH</div>
            </div>
            <h1 className="serif" style={{fontSize:88, lineHeight:0.93, letterSpacing:'-0.028em', margin:0}}>
              Welcome<br/>back to the<br/><em style={{color:'var(--p-accent)', fontStyle:'italic'}}>floor.</em>
            </h1>
            <p style={{fontSize:15, lineHeight:1.55, color:'var(--p-ink-2)', maxWidth:380, marginTop:36}}>
              Track active projects, sign documents, approve formulations, and message your formulators &mdash; one floor, one chain of custody, sketch to dock-out.
            </p>
          </div>

          {/* Quietly editorial detail */}
          <div style={{display:'flex', gap:32, paddingTop:24, borderTop:'1px solid var(--p-grid)'}}>
            <div>
              <div className="kicker">Active brands</div>
              <div className="serif" style={{fontSize:30, marginTop:4, letterSpacing:'-0.01em'}}>47</div>
            </div>
            <div>
              <div className="kicker">Projects in flight</div>
              <div className="serif" style={{fontSize:30, marginTop:4, letterSpacing:'-0.01em'}}>112</div>
            </div>
            <div>
              <div className="kicker">Avg. response</div>
              <div className="serif" style={{fontSize:30, marginTop:4, letterSpacing:'-0.01em'}}>&lt; 4<span className="mono" style={{fontSize:14, marginLeft:4, letterSpacing:0}}>hr</span></div>
            </div>
          </div>
        </div>

        {/* CENTER — form */}
        <div style={{padding:'72px 48px 56px', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', borderRight:'1px solid var(--p-grid)', background:'var(--p-paper)'}}>
          <span className="ticks"><span className="tl"/><span className="tr"/><span className="bl"/><span className="br"/></span>

          <div className="kicker" style={{marginBottom:14}}>/ 001 — Authenticate</div>
          <h2 className="serif" style={{fontSize:38, lineHeight:1, margin:'0 0 8px', letterSpacing:'-0.022em'}}>Sign in.</h2>
          <p style={{fontSize:13, color:'var(--p-muted)', margin:'0 0 32px'}}>Use your work email or Microsoft account.</p>

          {/* SSO primary */}
          <button className="btn btn-ghost" style={{height:48, justifyContent:'center', width:'100%', borderColor:'var(--p-ink)'}}>
            <span className="ms-logo"><i/><i/><i/><i/></span>
            Continue with Microsoft
          </button>

          <div className="divx" style={{margin:'24px 0'}}><span>or with email</span></div>

          {/* Form */}
          <form style={{display:'flex', flexDirection:'column', gap:20}} onSubmit={(e)=>e.preventDefault()}>
            <div className="field">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@brand.co" defaultValue="maya@aldosari.studio"/>
            </div>
            <div className="field">
              <label>Password <a href="#">Forgot?</a></label>
              <input className="input" type="password" defaultValue="••••••••••••"/>
            </div>
            <button className="btn btn-primary" style={{height:48, marginTop:8}}>
              Enter the lab <span style={{display:'inline-block', width:10, height:1, background:'currentColor', position:'relative'}}><span style={{position:'absolute', right:-1, top:-3, width:6, height:6, borderTop:'1px solid currentColor', borderRight:'1px solid currentColor', transform:'rotate(45deg)'}}/></span>
            </button>
          </form>

          <p style={{fontSize:12, color:'var(--p-muted)', textAlign:'center', marginTop:28}}>
            New brand? <a className="mono" style={{color:'var(--p-ink)', borderBottom:'1px solid var(--p-grid)', textDecoration:'none', textTransform:'uppercase', letterSpacing:'0.18em', fontSize:10, marginLeft:4}}>Request access →</a>
          </p>
        </div>

        {/* RIGHT — editorial sidebar: signed-document feed (proof of life) */}
        <div style={{padding:'72px 56px 56px', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
          <div>
            <div className="kicker" style={{marginBottom:18}}>/ Live · last 24 hr on the floor</div>
            {[
              ['T-00:14', 'Batch sealed', 'PLX-2614 · Niacinamide 5%', 'ok'],
              ['T-01:42', 'COA approved', 'AURA-019 · QC-LAB-3', 'ok'],
              ['T-02:08', 'Brief intake',  'WILDLEAF · sketch', 'info'],
              ['T-03:31', 'Tech transfer', 'NORDLY · vendor 12', 'warn'],
              ['T-05:55', 'Pilot poured',  'PLX-2531 · 18 kg', 'ok'],
              ['T-08:19', 'Batch sealed',  'PLX-2602 · Squalane', 'ok'],
            ].map(([t, ev, ref, kind], i) => (
              <div key={i} style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:16, alignItems:'baseline', padding:'12px 0', borderBottom:'1px solid var(--p-grid)'}}>
                <span className="mono data" style={{fontSize:11, color:'var(--p-muted)'}}>{t}</span>
                <div>
                  <div style={{fontSize:13, color:'var(--p-ink)'}}>{ev}</div>
                  <div className="mono" style={{fontSize:10, color:'var(--p-muted)', letterSpacing:'0.06em', marginTop:2}}>{ref}</div>
                </div>
                <span className={`pill ${kind}`}><span className="dot"/></span>
              </div>
            ))}
          </div>

          {/* Cross-section glyph (recalls marketing site without copying) */}
          <div style={{paddingTop:24, borderTop:'1px solid var(--p-grid)'}}>
            <div className="meta" style={{marginBottom:8}}>FACILITY · PETRA LAB-X · TORONTO</div>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="28" stroke="var(--p-ink)" strokeWidth="1"/>
                <circle cx="30" cy="30" r="18" stroke="var(--p-ink)" strokeWidth="1"/>
                <circle cx="30" cy="30" r="9" fill="var(--p-accent)"/>
                <line x1="2" y1="30" x2="58" y2="30" stroke="var(--p-grid)" strokeWidth="1"/>
                <line x1="30" y1="2" x2="30" y2="58" stroke="var(--p-grid)" strokeWidth="1"/>
              </svg>
              <div className="mono" style={{fontSize:10, lineHeight:1.6, color:'var(--p-muted)', letterSpacing:'0.06em'}}>
                LAT 43.6532° N<br/>LON 79.3832° W<br/>60,000 ft²
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PORTAL LOGIN — DIRECTION B · "INSTRUMENT" (more clinical)
   =========================================================================
   Split layout retained, but the LEFT panel becomes a live data instrument:
   real numbers ticking, batch grid, formula counts. RIGHT panel is denser,
   tabular, mono-led. Communicates: "you are entering the operating system,
   not a marketing brochure." Editorial DNA quieter — only the wordmark and
   the type carry it.
   ========================================================================= */

function PortalLogin_Instrument({ scheme = 'light' }) {
  const tokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;

  // Mock periodic-table grid for visual texture
  const elements = [
    ['01','H', 'ok'], ['','',''],['','',''],['','',''],['','',''],['','',''],['','',''],['08','O','ok'],
    ['','',''],['','',''],['11','Na','warn'],['12','Mg','ok'],['','',''],['','',''],['','',''],['','',''],
    ['','',''],['','',''],['','',''],['','',''],['','',''],['','',''],['','',''],['16','S','ok'],
  ];

  return (
    <div className="pf" style={{...tokens, width:1440, height:900, position:'relative', overflow:'hidden', background:'var(--p-paper)', display:'grid', gridTemplateColumns:'1.15fr 1fr'}}>
      <PortalStyles />

      {/* ===================== LEFT — INSTRUMENT PANEL ===================== */}
      <div style={{padding:'40px 48px', position:'relative', borderRight:'1px solid var(--p-grid)', background:'var(--p-paper-2)', overflow:'hidden'}}>
        {/* Top: brand + signal */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:18, borderBottom:'1px solid var(--p-grid)'}}>
          <div style={{display:'flex', alignItems:'center', gap:16}}>
            <img src="assets/logo-horizontal-ink.png" alt="PLX" style={{height:28, width:'auto', display:'block'}}/>
            <span style={{height:22, width:1, background:'var(--p-grid)'}}/>
            <div className="meta" style={{lineHeight:1.4}}>CLIENT WORKBENCH<br/>v26.05</div>
          </div>
          <div className="meta" style={{textAlign:'right'}}>
            <span style={{display:'inline-flex', alignItems:'center', gap:6}}><span className="pulse"/>FLOOR · LIVE</span><br/>
            T-04:21:13 · TOR
          </div>
        </div>

        {/* MID: live counters */}
        <div style={{marginTop:36}}>
          <div className="kicker" style={{marginBottom:18}}>/ Telemetry · last 24 hr</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, border:'1px solid var(--p-grid)'}}>
            {[
              ['Batches sealed', '14',  'ok',   '+2 vs avg'],
              ['Pilots poured',  '06',  'ok',   '12.4 kg total'],
              ['COAs approved',  '23',  'ok',   '0 deviation'],
              ['Briefs intake',  '02',  'info', '4 in queue'],
            ].map(([k,v,kind,sub], i) => (
              <div key={i} style={{padding:'22px 22px 20px', borderRight:i%2===0?'1px solid var(--p-grid)':0, borderBottom:i<2?'1px solid var(--p-grid)':0, background:'var(--p-paper)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <span className="kicker">{k}</span>
                  <span className={`pill ${kind}`} style={{height:16, padding:'0 6px', fontSize:8}}><span className="dot" style={{width:4,height:4}}/></span>
                </div>
                <div className="serif" style={{fontSize:46, lineHeight:1, margin:'8px 0 4px', letterSpacing:'-0.02em'}}>{v}</div>
                <div className="mono data" style={{fontSize:10, color:'var(--p-muted)', letterSpacing:'0.06em'}}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PERIODIC GRID (decorative, recalls marketing site) */}
        <div style={{marginTop:32}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14}}>
            <div className="kicker">/ Active formulations · sample</div>
            <div className="meta">REF · PLX-FRM-2026Q2</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(8, 1fr)', gap:0, border:'1px solid var(--p-grid)'}}>
            {elements.map(([n, s, kind], i) => (
              <div key={i} style={{aspectRatio:'1', borderRight:(i+1)%8!==0?'1px solid var(--p-grid)':0, borderBottom:i<16?'1px solid var(--p-grid)':0, padding:'6px 7px', background: s ? 'var(--p-paper)' : 'transparent', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative'}}>
                {s && (
                  <>
                    <span className="mono" style={{fontSize:8, color:'var(--p-muted)', letterSpacing:'0.06em'}}>{n}</span>
                    <span className="serif" style={{fontSize:18, lineHeight:0.9, letterSpacing:'-0.01em'}}>{s}</span>
                    {kind && <span style={{position:'absolute', top:6, right:6, width:5, height:5, borderRadius:'50%', background:`var(--p-${kind})`}}/>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM: timestamp footer */}
        <div style={{position:'absolute', bottom:24, left:48, right:48, display:'flex', justifyContent:'space-between'}}>
          <span className="meta">FIG. 01 · TELEMETRY / SIGN-IN</span>
          <span className="meta">GMP · ISO 22716 · MOCRA · SOC 2</span>
        </div>
      </div>

      {/* ===================== RIGHT — FORM PANEL ===================== */}
      <div style={{padding:'40px 56px', display:'flex', flexDirection:'column', position:'relative', background:'var(--p-paper)'}}>
        {/* nav row */}
        <div style={{display:'flex', justifyContent:'flex-end', gap:24}}>
          <a className="kicker" style={{color:'var(--p-ink-2)', textDecoration:'none'}}>← plx.io</a>
          <span className="meta">EN · 中文 · ES</span>
        </div>

        {/* form lockup centered vertically */}
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', maxWidth:440, width:'100%', margin:'0 auto'}}>
          <div className="kicker" style={{marginBottom:14}}>/ 001 — Authenticate · Step 01 / 02</div>
          <h2 className="serif" style={{fontSize:54, lineHeight:0.96, margin:'0 0 12px', letterSpacing:'-0.025em'}}>Enter your<br/><em style={{color:'var(--p-accent)', fontStyle:'italic'}}>workbench.</em></h2>
          <p style={{fontSize:14, color:'var(--p-ink-2)', margin:'0 0 36px', lineHeight:1.5}}>
            Your seat at the bench &mdash; review formulas, sign documents, message the lab. Continue with SSO or portal credentials.
          </p>

          {/* SSO row — both options shown */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24}}>
            <button className="btn btn-ghost" style={{height:48, justifyContent:'center'}}>
              <span className="ms-logo"><i/><i/><i/><i/></span>
              Microsoft
            </button>
            <button className="btn btn-ghost" style={{height:48, justifyContent:'center'}}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.561c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
              Google
            </button>
          </div>

          <div className="divx" style={{marginBottom:20}}><span>or with magic link</span></div>

          {/* Email-only magic-link primary, with fallback to password */}
          <form style={{display:'flex', flexDirection:'column', gap:14}} onSubmit={(e)=>e.preventDefault()}>
            <div className="field">
              <label>Email <span style={{color:'var(--p-muted)'}}>· also accepts SSO</span></label>
              <input className="input" type="email" placeholder="you@brand.co" defaultValue="maya@aldosari.studio"/>
            </div>
            <button className="btn btn-primary" style={{height:48}}>
              Send magic link
              <span style={{display:'inline-block', width:10, height:1, background:'currentColor', position:'relative', marginLeft:2}}><span style={{position:'absolute', right:-1, top:-3, width:6, height:6, borderTop:'1px solid currentColor', borderRight:'1px solid currentColor', transform:'rotate(45deg)'}}/></span>
            </button>

            {/* password fallback collapsed */}
            <div style={{marginTop:6, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <a className="mono" style={{fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--p-ink-2)', textDecoration:'none', borderBottom:'1px solid var(--p-grid)'}}>Use password instead</a>
              <span className="meta">2FA · TOTP · SMS</span>
            </div>
          </form>
        </div>

        {/* footer registration */}
        <div style={{paddingTop:18, borderTop:'1px solid var(--p-grid)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span style={{fontSize:12, color:'var(--p-muted)'}}>New brand to the Lab?</span>
          <a className="btn btn-ghost" style={{height:36, padding:'0 14px', fontSize:10}}>Request access →</a>
        </div>
      </div>
    </div>
  );
}

window.PortalLogin_LabBench = PortalLogin_LabBench;
window.PortalLogin_Instrument = PortalLogin_Instrument;
