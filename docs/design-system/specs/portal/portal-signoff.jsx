/* =========================================================================
   PORTAL · SIGN-OFF · DEED FOR FORMULA v04 · PLX-2614
   =========================================================================
   The destination of the "Sign v04" button on the project detail page.

   Design decisions (locked with user):
   ─────────────────────────────────────────────────────────────────────────
   · Surface — full-page WITHIN the bench. Left rail stays; main column
     becomes the sign canvas. Preserves orientation; signing is not exile.
   · Tone   — NOTARIAL. This is a formal record. Customer must understand
     what they're signing. Document-as-deed, not modal-as-receipt.
   · Scope  — formula is the heart, but every artefact attached to v04
     travels with the deed: brief diff, formula table, spec snapshot,
     stability, pilot results, INCI label, allergen flags, pilot pour
     photo. Each section can be marked "not required for this deed" so
     customers with looser stability requirements aren't blocked.
   · Annotation — per-row + per-section comments. Two outcomes:
       (a) SIGN DEED          — comments attach to the signed record
       (b) REQUEST CHANGES    — comments become the change-list, routed
                                 back to the formulator, blocks sign
   · Sign method — three options on-canvas (typed name / type-to-confirm /
     drawn signature pad). User picks visually.
   · Multi-party — single signer; routing available ("Reassign to →" sends
     the deed to another workspace member).
   · Flag handling — soft. Unresolved flags surfaced loudly. Sign is the
     customer's prerogative.
   · After sign — receipt page with seal animation, what just unblocked,
     return-to-bench.
   · Phase coverage — unified flow. Content slot adapts: this file builds
     the formula version in detail; we'll show stub variants for ARTWORK
     and COA so the system reads.
   ─────────────────────────────────────────────────────────────────────────

   Component shape:
     <PortalSignoff scheme variant section state />
       variant: 'formula' | 'artwork' | 'coa'  (only formula is in detail)
       state:   'review' | 'sign' | 'sealed'   (sealed = after-sign receipt)
   ========================================================================= */

function PortalSignoff({
  scheme = 'light',
  variant = 'formula',
  state = 'review',
  signMethod = 'docusign',  // 'docusign' (embedded) | 'click' (click-to-agree)
  showAllMethods = true,    // legacy — kept for older artboards
  showFlags = true,
  legalMode = 'standard',   // 'minimal' | 'standard' | 'regulated'
  device = 'desktop',       // 'desktop' | 'tablet' | 'mobile'
  tokenOverrides = {},
}) {
  const baseTokens = scheme === 'dark' ? PORTAL_TOKENS_DARK : PORTAL_TOKENS_LIGHT;
  const tokens = { ...baseTokens, ...tokenOverrides };

  /* ─── PROJECT / DEED METADATA ──────────────────────────────────────── */
  const project = {
    code: 'PLX-2614',
    name: 'Niacinamide 5% Serum',
    sym: 'Ni', num: '14',
    brand: 'Aldosari Studio',
    formulator: 'Maya Akhtar',
    formulatorRole: 'Senior formulator',
    iteration: 'v04',
    targetDock: '2026.07.18',
  };

  const deed = {
    id: 'PLX-2614 / DEED-014 / FORMULA-v04',
    issued: '2026.05.04 · 14:12 EST',
    issuer: 'Maya Akhtar · for Petra Lab-X',
    consignee: 'Maya Aldosari · for Aldosari Studio',
    jurisdiction: 'Toronto, ON · Petra Lab-X Inc.',
    expires: '2026.05.11 (7 days)',
  };

  /* ─── DOSSIER · the ledger of attached artefacts ─────────────────── */
  /* `state` per row: 'reviewed' | 'pending' | 'na' | 'flag'
     `required`: whether the deed *requires* this artefact for sign.
     Stability is set required:false here — per user note, sometimes
     formulas sign before stability completes. */
  const dossier = [
    { idx:'I',   ref:'§1', name:'Brief — diff vs concept v2',  meta:'4 deltas',                state:'reviewed', required:true },
    { idx:'II',  ref:'§2', name:'Formula table · v04',         meta:'12 ingredients · 4 Δ',    state:'reviewed', required:true,  heart:true },
    { idx:'III', ref:'§3', name:'Spec snapshot',               meta:'5 highlights · all in window', state:'reviewed', required:true },
    { idx:'IV',  ref:'§4', name:'Stability — 4 wk accelerated',meta:'40°C · pass',              state:'reviewed', required:false },
    { idx:'V',   ref:'§5', name:'Pilot 04 — batch results',    meta:'18 kg · 0.1% deviation',   state:'reviewed', required:true },
    { idx:'VI',  ref:'§6', name:'INCI label preview',          meta:'EU/UK declaration',        state:'pending',  required:true },
    { idx:'VII', ref:'§7', name:'Allergen / regulatory flags', meta:'1 unresolved · Givaudan',  state:'flag',     required:true },
    { idx:'VIII',ref:'§8', name:'Pilot pour · visual',         meta:'Kettle 02 · 05.04',        state:'reviewed', required:false },
  ];

  /* ─── BRIEF DIFF · §1 ───────────────────────────────────────────── */
  const briefDiff = [
    { asked:'Niacinamide ≥ 5%, no flush',                    delivered:'5.00% niacinamide, panel reports no flush at 4 wk',                 ok:true },
    { asked:'Lightweight serum, glide on application',       delivered:'Pentylene Glycol +1.0% in v04 — panel reports markedly improved glide', ok:true },
    { asked:'Unfragranced or "cucumber-water" character',    delivered:'Fragrance LX-08 (cucumber-water · Givaudan) at 0.20%',               ok:'flag', note:'allergen disclosure pending' },
    { asked:'Glass dropper, amber, 30 mL',                   delivered:'Glass dropper · amber · 30 mL · supplier qualified',                 ok:true },
  ];

  /* ─── FORMULA · §2 — same source of truth as project detail ─────── */
  const formula = [
    { phase:'A', ing:'Aqua / Distilled water',                pct:'84.00',  fn:'Solvent',         supplier:'Internal',           inci:'Water',                                  delta:'−0.75',        deltaKind:'down' },
    { phase:'A', ing:'Niacinamide',                            pct:'5.00',   fn:'Active',          supplier:'Lonza · CH',         inci:'Niacinamide',                            delta:'—',            deltaKind:'same', hero:true },
    { phase:'A', ing:'Pentylene Glycol',                       pct:'4.00',   fn:'Humectant',       supplier:'Symrise · DE',       inci:'Pentylene Glycol',                       delta:'+1.00',        deltaKind:'up',   note:'v04 — increased for glide on application', commentCount:2 },
    { phase:'A', ing:'Glycerin · vegetable',                   pct:'3.50',   fn:'Humectant',       supplier:'Croda · UK',         inci:'Glycerin',                               delta:'—',            deltaKind:'same' },
    { phase:'A', ing:'Sodium Hyaluronate · LMW',               pct:'0.60',   fn:'Active',          supplier:'Bloomage · CN',      inci:'Sodium Hyaluronate',                     delta:'NEW',          deltaKind:'new',  note:'v04 — added for surface hydration', commentCount:1 },
    { phase:'B', ing:'Hydroxyethylcellulose',                  pct:'0.45',   fn:'Thickener',       supplier:'Ashland · US',       inci:'Hydroxyethylcellulose',                  delta:'+0.15',        deltaKind:'up',   note:'compensate for new HA lot viscosity' },
    { phase:'B', ing:'Tetrasodium EDTA',                       pct:'0.10',   fn:'Chelant',         supplier:'BASF · DE',          inci:'Tetrasodium EDTA',                       delta:'—',            deltaKind:'same' },
    { phase:'C', ing:'Panthenol',                              pct:'1.00',   fn:'Conditioner',     supplier:'DSM · NL',           inci:'Panthenol',                              delta:'—',            deltaKind:'same' },
    { phase:'C', ing:'Allantoin',                              pct:'0.20',   fn:'Soothing',        supplier:'Ashland · US',       inci:'Allantoin',                              delta:'—',            deltaKind:'same' },
    { phase:'D', ing:'Phenoxyethanol + Ethylhexylglycerin',    pct:'0.95',   fn:'Preservative',    supplier:'Schülke · DE',       inci:'Phenoxyethanol, Ethylhexylglycerin',     delta:'—',            deltaKind:'same' },
    { phase:'D', ing:'Citric Acid (pH adjust)',                pct:'q.s.',   fn:'pH',              supplier:'—',                  inci:'Citric Acid',                            delta:'—',            deltaKind:'same' },
    { phase:'D', ing:'Fragrance · cucumber-water · LX-08',     pct:'0.20',   fn:'Fragrance',       supplier:'Givaudan · CH',      inci:'Parfum',                                 delta:'NEW SUPPLIER', deltaKind:'flag', note:'awaiting allergen disclosure from Givaudan', commentCount:3 },
  ];

  /* ─── SPECS · §3 ────────────────────────────────────────────────── */
  const specs = [
    { l:'pH',           v:'5.62',  sub:'target 5.4–5.8',     stat:'In window' },
    { l:'Viscosity',    v:'4,200', sub:'cP @ 25°C',          stat:'Nominal'   },
    { l:'Density',      v:'1.018', sub:'g/mL',               stat:'Pass'      },
    { l:'Stability',    v:'4 wk',  sub:'40°C accelerated',   stat:'Pass'      },
    { l:'Microbial',    v:'<10',   sub:'CFU/g · TVC',        stat:'Pass'      },
  ];

  /* ─── STABILITY · §4 ────────────────────────────────────────────── */
  const stability = [
    { wk:'T-0',  ph:'5.61', visc:'4,180', sep:'—',     col:'—',     note:'baseline pour' },
    { wk:'1 wk', ph:'5.62', visc:'4,195', sep:'none',  col:'none',  note:'40°C · accelerated' },
    { wk:'2 wk', ph:'5.61', visc:'4,210', sep:'none',  col:'none',  note:'pass' },
    { wk:'3 wk', ph:'5.60', visc:'4,225', sep:'none',  col:'none',  note:'pass' },
    { wk:'4 wk', ph:'5.62', visc:'4,200', sep:'none',  col:'none',  note:'pass · sealed' },
  ];

  /* ─── PILOT 04 · §5 ─────────────────────────────────────────────── */
  const pilot = {
    id: 'P-04',
    poured: '2026.05.04 · 09:14 EST',
    kettle: 'Kettle 02 · 18 kg',
    operator: 'J. Tessaro',
    deviation: '0.1%',
    panelN: 8,
    panelNotes: [
      'Glide markedly improved vs v03 — cushion holds through application',
      'Slight tack at 30s, dries down clean by 2 min',
      'Fragrance reads as cucumber-water · clean · low intensity',
      'No flush, no sting reported (n=8)',
    ],
  };

  /* ─── INCI LABEL · §6 ───────────────────────────────────────────── */
  const inciLabel = 'Aqua, Niacinamide, Pentylene Glycol, Glycerin, Sodium Hyaluronate, Panthenol, Hydroxyethylcellulose, Phenoxyethanol, Tetrasodium EDTA, Allantoin, Ethylhexylglycerin, Citric Acid, Parfum.';

  /* ─── FLAGS · §7 ────────────────────────────────────────────────── */
  const flags = [
    {
      sev:'open',
      title:'Allergen disclosure pending — Fragrance LX-08',
      body:'Givaudan has not returned the IFRA allergen statement for LX-08. Required for EU/UK PIF. Maya has chased; ETA 7 days. Signing v04 is permitted but PIF cannot file until disclosure is received.',
      ref:'Supplier · Givaudan · CH',
      since:'4 days',
    },
  ];

  /* ─── ROUTING · workspace roster ────────────────────────────────── */
  const roster = [
    { name:'Maya Aldosari',    role:'Founder · admin',         current:true },
    { name:'Lina Aldosari',    role:'Co-founder · ops',        current:false },
    { name:'Tomás Reinhardt',  role:'Reg / quality consultant',current:false },
  ];

  const phaseColor = (p) => p==='bench' ? 'var(--p-info)' : p==='floor' ? 'var(--p-warn)' : p==='dock' ? 'var(--p-ok)' : 'var(--p-muted)';

  /* ─── delta render (matches project detail) ──────────────────────── */
  const renderDelta = (row) => {
    const k = row.deltaKind;
    if (k === 'up')   return <span className="d-up"><span className="arrow">↑</span>{row.delta}</span>;
    if (k === 'down') return <span className="d-down"><span className="arrow">↓</span>{row.delta}</span>;
    if (k === 'new')  return <span className="d-new">{row.delta}</span>;
    if (k === 'flag') return <span className="d-flag">{row.delta}</span>;
    return <span className="d-same">{row.delta}</span>;
  };

  return (
    <div className={`pf psd device-${device}`} style={{...tokens}} data-screen-label="Sign-off · PLX-2614 · Formula v04">
      <PortalStyles />
      <SignoffStyles />
      <SignoffResponsiveStyles />

      {/* ===== LEFT RAIL — same as project detail, kept for context ===== */}
      <SignoffLeftRail scheme={scheme} project={project} phaseColor={phaseColor} />

      {/* ===== MAIN — the deed ===== */}
      <main className="main">
        {/* breadcrumb · the path back is honoured here */}
        <div className="breadcrumbs">
          <a>Lab</a><span className="sep">/</span>
          <a>Workbench</a><span className="sep">/</span>
          <a>Projects</a><span className="sep">/</span>
          <a>{project.code}</a><span className="sep">/</span>
          <b>Sign-off · v04</b>
        </div>

        {state === 'sealed'
          ? <SignoffReceipt project={project} deed={deed} legalMode={legalMode} />
          : (
            <>
              <SignoffHeader project={project} deed={deed} />
              <SignoffLegalBanner deed={deed} project={project} legalMode={legalMode} />
              <SignoffDossier dossier={dossier} />
              <SignoffBriefDiff briefDiff={briefDiff} />
              {legalMode === 'regulated' && <SignoffAttestation section="The brief, restated as deltas" sectionRef="§1" legalMode={legalMode} />}
              <SignoffFormula formula={formula} renderDelta={renderDelta} />
              {legalMode === 'regulated' && <SignoffAttestation section="Formula table v04" sectionRef="§2" legalMode={legalMode} />}
              <SignoffSpecs specs={specs} />
              {legalMode === 'regulated' && <SignoffAttestation section="Spec snapshot" sectionRef="§3" legalMode={legalMode} />}
              <SignoffStability stability={stability} />
              {legalMode === 'regulated' && <SignoffAttestation section="Stability — 4 wk accelerated" sectionRef="§4" legalMode={legalMode} />}
              <SignoffPilot pilot={pilot} />
              {legalMode === 'regulated' && <SignoffAttestation section="Pilot 04 batch results" sectionRef="§5" legalMode={legalMode} />}
              <SignoffInci inciLabel={inciLabel} />
              {legalMode === 'regulated' && <SignoffAttestation section="INCI label preview" sectionRef="§6" legalMode={legalMode} />}
              {showFlags && <SignoffFlags flags={flags} />}
              {legalMode === 'regulated' && <SignoffAttestation section="Allergen / regulatory flags" sectionRef="§7" legalMode={legalMode} />}
              <SignoffPour />
              {legalMode === 'regulated' && <SignoffAttestation section="Pilot pour visual" sectionRef="§8" legalMode={legalMode} />}
              <SignoffSignBlock
                deed={deed}
                project={project}
                roster={roster}
                signMethod={signMethod}
                legalMode={legalMode}
              />
              <SignoffColophon deed={deed} project={project} legalMode={legalMode} />
            </>
          )
        }
      </main>
    </div>
  );
}

window.PortalSignoff = PortalSignoff;
