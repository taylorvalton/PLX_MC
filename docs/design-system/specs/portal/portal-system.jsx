/* =========================================================================
   PETRA LAB-X CLIENT PORTAL — DESIGN SYSTEM v1
   Two login directions + token sheet
   =========================================================================
   Tokens are CSS variables on a wrapper class so each artboard renders in
   isolation. The marketing-site DNA carries forward (paper/ink palette,
   Mazius display, JetBrains Mono kickers) but is shifted into a tighter
   functional register.
   ========================================================================= */

const PORTAL_TOKENS_LIGHT = {
  /* surface — off-white paper, cards stamped slightly darker (ink-on-paper logic). */
  '--p-paper':      '#F8F6F1',   /* off-white — page */
  '--p-paper-2':    '#F4F0E7',   /* sidebars / rails — whisper deeper */
  '--p-card':       '#F2EDE2',   /* cards — barely there; ink-on-paper, very subtle */
  '--p-ink':        '#1B1A17',   /* primary text */
  '--p-ink-2':      '#3A3833',   /* secondary text */
  '--p-muted':      '#8C857B',   /* tertiary / labels */
  '--p-grid':       'rgba(27,26,23,0.16)', /* hairlines — slightly stronger to compensate for low contrast cards */
  '--p-grid-2':     'rgba(27,26,23,0.08)', /* subtler hairlines */
  /* brand */
  '--p-accent':     '#B65A3E',   /* rust — primary action + active state */
  '--p-accent-soft':'#E9C7B7',   /* tint */
  /* status */
  '--p-ok':         '#5C7A55',   /* sage — approved / live */
  '--p-warn':       '#C99340',   /* amber — pending / in review */
  '--p-info':       '#5B7B91',   /* steel — informational */
  '--p-hot':        '#C84B2C',   /* tomato — destructive only */
};

const PORTAL_TOKENS_DARK = {
  '--p-paper':      '#1A1816',
  '--p-paper-2':    '#22201D',
  '--p-card':       '#272421',
  '--p-ink':        '#F1ECE0',
  '--p-ink-2':      '#C9C2B5',
  '--p-muted':      '#827B6F',
  '--p-grid':       'rgba(241,236,224,0.12)',
  '--p-grid-2':     'rgba(241,236,224,0.06)',
  '--p-accent':     '#D87253',
  '--p-accent-soft':'#5A3327',
  '--p-ok':         '#7A9E6F',
  '--p-warn':       '#D9A85C',
  '--p-info':       '#7A9DB3',
  '--p-hot':        '#E26648',
};

/* =========================================================================
   GLOBAL STYLES (shared across all portal artboards)
   ========================================================================= */
function PortalStyles() {
  return (
    <style>{`
    @import url('https://api.fontshare.com/v2/css?f[]=mazius-display@400,401&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .pf { --mazius:"Mazius Display","Times New Roman",serif;
          --sans:"Inter",-apple-system,system-ui,sans-serif;
          --mono:"JetBrains Mono",ui-monospace,monospace;
          font-family:var(--sans); color:var(--p-ink); background:var(--p-paper);
          font-feature-settings:"ss01","ss02"; -webkit-font-smoothing:antialiased; }

    .pf .mono   { font-family:var(--mono); }
    .pf .serif  { font-family:var(--mazius); font-weight:400; }
    .pf .kicker { font-family:var(--mono); font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); }
    .pf .meta   { font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); line-height:1.6; }
    .pf .data   { font-family:var(--mono); font-variant-numeric:tabular-nums; }
    .pf hr.hair { border:0; border-top:1px solid var(--p-grid); margin:0; }

    /* primitive: hairline button */
    .pf .btn      { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:44px; padding:0 18px; border-radius:6px; font-family:var(--mono); font-size:11px; letter-spacing:0.16em; text-transform:uppercase; cursor:pointer; transition:all .15s ease; border:1px solid transparent; }
    .pf .btn-primary   { background:var(--p-ink); color:var(--p-paper); }
    .pf .btn-primary:hover { background:var(--p-accent); }
    .pf .btn-ghost     { background:transparent; color:var(--p-ink); border-color:var(--p-grid); }
    .pf .btn-ghost:hover { border-color:var(--p-ink); }

    /* primitive: input */
    .pf .field         { display:flex; flex-direction:column; gap:8px; }
    .pf .field > label { font-family:var(--mono); font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--p-muted); display:flex; justify-content:space-between; align-items:baseline;}
    .pf .field > label a { font-size:9px; color:var(--p-ink-2); text-decoration:none; border-bottom:1px solid var(--p-grid);}
    .pf .input         { height:48px; padding:0 16px; border:1px solid var(--p-grid); background:var(--p-card); color:var(--p-ink); font-family:var(--sans); font-size:14px; border-radius:4px; transition:border-color .15s; }
    .pf .input:focus   { outline:none; border-color:var(--p-ink); }
    .pf .input::placeholder { color:var(--p-muted); }

    /* divider with text */
    .pf .divx { display:flex; align-items:center; gap:14px; }
    .pf .divx::before,.pf .divx::after { content:""; flex:1; height:1px; background:var(--p-grid);}
    .pf .divx span { font-family:var(--mono); font-size:9px; letter-spacing:0.24em; text-transform:uppercase; color:var(--p-muted);}

    /* status pill */
    .pf .pill { display:inline-flex; align-items:center; gap:6px; height:22px; padding:0 10px; border-radius:999px; font-family:var(--mono); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; border:1px solid var(--p-grid); }
    .pf .pill .dot { width:6px; height:6px; border-radius:50%;}
    .pf .pill.ok   { color:var(--p-ok);   border-color:var(--p-ok);   } .pf .pill.ok .dot   { background:var(--p-ok);}
    .pf .pill.warn { color:var(--p-warn); border-color:var(--p-warn); } .pf .pill.warn .dot { background:var(--p-warn);}
    .pf .pill.info { color:var(--p-info); border-color:var(--p-info); } .pf .pill.info .dot { background:var(--p-info);}

    /* live pulse */
    @keyframes pfPulse { 0%{opacity:.4;} 50%{opacity:1;} 100%{opacity:.4;} }
    .pf .pulse { width:6px; height:6px; border-radius:50%; background:var(--p-ok); animation:pfPulse 1.6s infinite; }

    /* corner ticks (subtle industrial chrome) */
    .pf .ticks { position:absolute; inset:0; pointer-events:none;}
    .pf .ticks span { position:absolute; width:8px; height:8px; border:1px solid var(--p-grid);}
    .pf .ticks .tl { top:-1px; left:-1px; border-right:0; border-bottom:0;}
    .pf .ticks .tr { top:-1px; right:-1px; border-left:0; border-bottom:0;}
    .pf .ticks .bl { bottom:-1px; left:-1px; border-right:0; border-top:0;}
    .pf .ticks .br { bottom:-1px; right:-1px; border-left:0; border-top:0;}

    /* MS logo (consistent across both directions) */
    .ms-logo { display:inline-grid; grid-template-columns:1fr 1fr; gap:1px; width:14px; height:14px;}
    .ms-logo i:nth-child(1){background:#F25022;}
    .ms-logo i:nth-child(2){background:#7FBA00;}
    .ms-logo i:nth-child(3){background:#00A4EF;}
    .ms-logo i:nth-child(4){background:#FFB900;}

    /* periodic-glyph mark */
    .pf .pmark { display:inline-flex; flex-direction:column; align-items:flex-start; padding:6px 8px; border:1px solid var(--p-ink); line-height:1; min-width:36px;}
    .pf .pmark .num { font-family:var(--mono); font-size:8px; letter-spacing:0.1em; color:var(--p-muted); margin-bottom:3px;}
    .pf .pmark .sym { font-family:var(--mazius); font-size:18px; line-height:0.9;}
    `}</style>
  );
}

/* =========================================================================
   TOKENS — visual reference card
   ========================================================================= */
function PortalTokens({ scheme = 'light' }) {
  const tokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;
  const swatch = (label, varName, role) => (
    <div key={varName} style={{display:'flex', alignItems:'center', gap:14, padding:'10px 0', borderBottom:'1px solid var(--p-grid)'}}>
      <div style={{width:36, height:36, background:`var(${varName})`, border:'1px solid var(--p-grid)', borderRadius:3}} />
      <div style={{flex:1}}>
        <div style={{fontSize:13, color:'var(--p-ink)'}}>{label}</div>
        <div className="mono" style={{fontSize:10, color:'var(--p-muted)', letterSpacing:'0.06em'}}>{varName}  ·  {tokens[varName]}</div>
      </div>
      {role && <span className="kicker">{role}</span>}
    </div>
  );

  return (
    <div className="pf" style={{...tokens, padding:'56px 64px', width:1200, minHeight:760, background:'var(--p-paper)'}}>
      <PortalStyles />
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingBottom:24, borderBottom:'1px solid var(--p-grid)', marginBottom:32}}>
        <div>
          <div className="kicker">/ Tokens · {scheme.toUpperCase()} mode</div>
          <h2 className="serif" style={{fontSize:42, lineHeight:1, margin:'10px 0 0', letterSpacing:'-0.02em'}}>The {scheme === 'dark' ? 'night' : 'day'} bench.</h2>
        </div>
        <div className="meta" style={{textAlign:'right'}}>PETRA LAB-X · PORTAL SYSTEM<br/>v1.0 · 2026.05</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:48}}>
        <div>
          <div className="kicker" style={{marginBottom:14}}>Surface</div>
          {swatch('Paper',     '--p-paper',   'page')}
          {swatch('Paper alt', '--p-paper-2', 'sidebar')}
          {swatch('Card',      '--p-card',    'cards')}
          {swatch('Ink',       '--p-ink',     'primary text')}
          {swatch('Ink alt',   '--p-ink-2',   'secondary')}
          {swatch('Muted',     '--p-muted',   'labels')}
          {swatch('Grid',      '--p-grid',    'hairline')}
        </div>
        <div>
          <div className="kicker" style={{marginBottom:14}}>Brand & Status</div>
          {swatch('Accent',    '--p-accent', 'action')}
          {swatch('Accent soft','--p-accent-soft','tint')}
          {swatch('OK',        '--p-ok',     'approved · live')}
          {swatch('Warn',      '--p-warn',   'pending · review')}
          {swatch('Info',      '--p-info',   'informational')}
          {swatch('Hot',       '--p-hot',    'destructive')}
        </div>
        <div>
          <div className="kicker" style={{marginBottom:14}}>Type system</div>
          <div style={{paddingBottom:14, borderBottom:'1px solid var(--p-grid)'}}>
            <div className="kicker">Display · Mazius</div>
            <div className="serif" style={{fontSize:54, lineHeight:1, margin:'4px 0 0', letterSpacing:'-0.025em'}}>Aa <em style={{color:'var(--p-accent)'}}>Aa</em></div>
          </div>
          <div style={{padding:'14px 0', borderBottom:'1px solid var(--p-grid)'}}>
            <div className="kicker">UI · Inter</div>
            <div style={{fontSize:24, marginTop:4}}>The quick brown fox</div>
            <div style={{fontSize:14, color:'var(--p-ink-2)'}}>The quick brown fox jumps over the lazy dog</div>
            <div style={{fontSize:11, color:'var(--p-muted)'}}>The quick brown fox jumps</div>
          </div>
          <div style={{padding:'14px 0'}}>
            <div className="kicker">Mono · JetBrains</div>
            <div className="mono" style={{fontSize:13, marginTop:4}}>PROJECT-2614 · 89.4%</div>
            <div className="mono" style={{fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--p-muted)'}}>STATUS · IN-REVIEW</div>
          </div>
        </div>
      </div>

      {/* Component primitives row */}
      <div style={{marginTop:48, paddingTop:32, borderTop:'1px solid var(--p-grid)'}}>
        <div className="kicker" style={{marginBottom:18}}>Primitives</div>
        <div style={{display:'flex', gap:14, flexWrap:'wrap', alignItems:'center'}}>
          <button className="btn btn-primary">Sign in</button>
          <button className="btn btn-ghost">Cancel</button>
          <span className="pill ok"><span className="dot"/>Approved</span>
          <span className="pill warn"><span className="dot"/>In Review</span>
          <span className="pill info"><span className="dot"/>Draft</span>
          <span style={{display:'inline-flex', alignItems:'center', gap:8, fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--p-muted)'}}><span className="pulse"/>Floor · Live</span>
          <span className="pmark"><span className="num">14</span><span className="sym">Ni</span></span>
        </div>
      </div>
    </div>
  );
}

window.PortalTokens = PortalTokens;
window.PortalStyles = PortalStyles;
window.PORTAL_TOKENS_LIGHT = PORTAL_TOKENS_LIGHT;
window.PORTAL_TOKENS_DARK = PORTAL_TOKENS_DARK;
