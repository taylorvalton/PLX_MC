/* =========================================================================
   PHASE INDICATOR — reusable component
   =========================================================================
   The Brief / Bench / Floor / Dock arc, extracted as a single component
   so every surface uses the same primitive. Two variants:

   <PhaseIndicator variant="bar" current="floor" />     — horizontal arc, full-width
   <PhaseIndicator variant="inline" current="floor" />  — compact dot row for cards

   Optional `dates` prop attaches a date under each phase (bar variant).
   ========================================================================= */

const PHASES = [
  { id:'brief', label:'Brief' },
  { id:'bench', label:'Bench' },
  { id:'floor', label:'Floor' },
  { id:'dock',  label:'Dock'  },
];

function PhaseIndicator({ variant='bar', current='bench', dates={}, className='' }) {
  const idx = PHASES.findIndex(p => p.id === current);

  if (variant === 'inline') {
    /* compact: 4 dots + thin connector, ~120px wide; for use inside dense rows */
    return (
      <span className={`pi-inline ${className}`}>
        <style>{`
          .pi-inline { display:inline-flex; align-items:center; gap:0; font-family:var(--mono);}
          .pi-inline .seg { display:flex; align-items:center; gap:6px;}
          .pi-inline .seg + .seg::before { content:""; display:inline-block; width:14px; height:1px; background:var(--p-grid); margin-right:6px;}
          .pi-inline .seg.done + .seg::before { background:var(--p-ink-2);}
          .pi-inline .seg.now  + .seg::before { background:var(--p-grid);}
          .pi-inline .dot { width:7px; height:7px; border-radius:50%; background:var(--p-grid); border:1px solid var(--p-grid);}
          .pi-inline .seg.done .dot { background:var(--p-ink); border-color:var(--p-ink);}
          .pi-inline .seg.now  .dot { background:var(--p-accent); border-color:var(--p-accent); box-shadow:0 0 0 3px color-mix(in oklab, var(--p-accent) 18%, transparent);}
          .pi-inline .lbl { font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted);}
          .pi-inline .seg.done .lbl { color:var(--p-ink-2);}
          .pi-inline .seg.now  .lbl { color:var(--p-accent); font-weight:600;}
        `}</style>
        {PHASES.map((p, i) => {
          const state = i < idx ? 'done' : i === idx ? 'now' : 'todo';
          return (
            <span key={p.id} className={`seg ${state}`}>
              <span className="dot"/>
              <span className="lbl">{p.label}</span>
            </span>
          );
        })}
      </span>
    );
  }

  /* bar: full-width arc with per-phase column, optional dates */
  return (
    <div className={`pi-bar ${className}`}>
      <style>{`
        .pi-bar { display:grid; grid-template-columns:repeat(4, 1fr); gap:0;}
        .pi-bar .ph { padding:14px 0 12px; border-top:3px solid var(--p-grid); font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--p-muted); position:relative;}
        .pi-bar .ph.done { border-top-color:var(--p-ink); color:var(--p-ink-2);}
        .pi-bar .ph.now  { border-top-color:var(--p-accent); color:var(--p-accent);}
        .pi-bar .ph.now::after { content:""; position:absolute; left:0; top:-6px; width:9px; height:9px; border-radius:50%; background:var(--p-accent); box-shadow:0 0 0 3px color-mix(in oklab, var(--p-accent) 22%, transparent);}
        .pi-bar .ph .when { font-family:var(--mono); font-size:9px; color:var(--p-muted); letter-spacing:0.08em; margin-top:4px; text-transform:none;}
      `}</style>
      {PHASES.map((p, i) => {
        const state = i < idx ? 'done' : i === idx ? 'now' : 'todo';
        return (
          <div key={p.id} className={`ph ${state}`}>
            {p.label}
            {dates[p.id] && <div className="when">{dates[p.id]}</div>}
          </div>
        );
      })}
    </div>
  );
}

window.PhaseIndicator = PhaseIndicator;
window.PHASES = PHASES;
