/* =========================================================================
 * Sign-off · Responsive Overrides
 * ─────────────────────────────────────────────────────────────────────────
 * Desktop chassis is 1440px with a 260px left rail and a 1100px deed folio.
 * For tablet (768) and mobile (390) we:
 *   – collapse the left rail (hide entirely on mobile, slim header on tablet)
 *   – shrink the .deed folio to fill width
 *   – fold every wide grid (specs/stab/dossier/methods) to single-column or 2-up
 *   – step type down a notch (titles, body) — mono labels stay readable
 *   – reduce vertical rhythm so 8 sections aren't 14 viewports tall
 *
 * Triggered by `device-tablet` / `device-mobile` class on the .psd root.
 * Desktop (default) is unaffected.
 * ========================================================================= */

function SignoffResponsiveStyles() {
  const css = `
    /* ────────────────── TABLET · 768 ────────────────── */
    .psd.device-tablet { width:768px; min-height:auto; grid-template-columns:1fr;}
    .psd.device-tablet .lrail { display:none;}

    /* a slim mobile-style header bar appears in place of the rail */
    .psd.device-tablet::before, .psd.device-mobile::before {
      content:""; display:block; height:52px; background:var(--p-paper-2); border-bottom:1px solid var(--p-grid);
      position:relative;
    }

    .psd.device-tablet .main { padding:20px 0 0;}
    .psd.device-tablet .breadcrumbs { margin:0 24px 14px; font-size:9px;}

    /* deed folio shrinks to fit */
    .psd.device-tablet .deed { width:auto; margin:0 24px; padding:32px 32px 40px;}

    /* writ — 3 cols → stack with stamp full-width below */
    .psd.device-tablet .writ { grid-template-columns:auto 1fr; gap:18px;}
    .psd.device-tablet .writ .stamp { grid-column:1 / -1; min-width:0;}
    .psd.device-tablet .writ h1, .psd.device-mobile .writ h1 { font-size:36px;}

    /* dossier — 2 cols → 1 */
    .psd.device-tablet .dossier ol { grid-template-columns:1fr;}

    /* brief diff — 2 cols stays (it's a "before / after" — keep it as comparison) */

    /* specs — 5 cols → 2 then wrap */
    .psd.device-tablet .specs { grid-template-columns:repeat(2, 1fr); border-bottom:none;}
    .psd.device-tablet .specs .it { border-bottom:1px solid var(--p-grid-2);}
    .psd.device-tablet .specs .it:nth-child(2n) { border-right:none;}

    /* stability — 5 cols → 2 */
    .psd.device-tablet .stab { grid-template-columns:repeat(2, 1fr); border-bottom:none;}
    .psd.device-tablet .stab .col { border-bottom:1px solid var(--p-grid-2);}
    .psd.device-tablet .stab .col:nth-child(2n) { border-right:none;}

    /* pilot — 2 cols → 1 */
    .psd.device-tablet .pilot { grid-template-columns:1fr;}

    /* flags — already a column-stack but acks were inline */
    .psd.device-tablet .flags > .flag { grid-template-columns:1fr;}
    .psd.device-tablet .flags > .flag .acks { align-items:flex-start; padding-left:18px;}

    /* methods (legacy 3-col) → 1 col */
    .psd.device-tablet .methods { grid-template-columns:1fr;}
    /* docusign 2-up methods → 1 col */
    .psd.device-tablet .ds-methods { grid-template-columns:1fr;}

    /* commit row — terms + button → stack */
    .psd.device-tablet .commit { grid-template-columns:1fr;}

    /* attestation chips — 4-up → 2-up */
    .psd.device-tablet .ds-att-summary .att-grid { grid-template-columns:repeat(2, 1fr);}

    /* legal banner — 4-col → stack */
    .psd.device-tablet .legal-banner { grid-template-columns:auto 1fr; row-gap:14px;}

    /* colophon clauses — 2-col → 1 */
    .psd.device-tablet .colophon-full .cf-clauses { grid-template-columns:1fr;}
    .psd.device-tablet .colophon-full .cf-clauses article { border-right:none;}
    .psd.device-tablet .colophon-full .cf-cp-row { grid-template-columns:1fr; gap:18px;}
    .psd.device-tablet .colophon-full .cf-foot { grid-template-columns:1fr; gap:24px;}

    /* legacy 3-col colophon → 1 */
    .psd.device-tablet .colophon { grid-template-columns:1fr; gap:32px;}

    /* receipt — ledger row label width tightens, unblocks 2-up→1 */
    .psd.device-tablet .receipt .ledger .row { grid-template-columns:120px 1fr; gap:16px;}
    .psd.device-tablet .receipt .unblocks .grid { grid-template-columns:1fr;}

    /* DocuSign frame placeholder — give signature line a bit more vertical air */
    .psd.device-tablet .ds-sig-tag { left:0;}


    /* ────────────────── MOBILE · 390 ────────────────── */
    .psd.device-mobile { width:390px; min-height:auto; grid-template-columns:1fr;}
    .psd.device-mobile .lrail { display:none;}

    .psd.device-mobile .main { padding:16px 0 0;}
    .psd.device-mobile .breadcrumbs { margin:0 16px 12px; font-size:8.5px; letter-spacing:0.12em;}
    .psd.device-mobile .breadcrumbs .sep { padding:0 6px;}

    /* deed folio shrinks heavily; trade chassis ticks for plain border */
    .psd.device-mobile .deed { width:auto; margin:0 12px; padding:22px 18px 28px;}
    .psd.device-mobile .deed .chassis-tick { display:none;}

    /* section blocks pad less */
    .psd.device-mobile .section { margin-top:36px;}
    .psd.device-mobile .section-head { margin-bottom:16px;}

    /* writ → fully stack */
    .psd.device-mobile .writ { grid-template-columns:1fr; gap:16px; padding-bottom:18px;}
    .psd.device-mobile .writ .pmark3 { width:48px; height:48px;}
    .psd.device-mobile .writ h1 { font-size:30px; line-height:1.1;}
    .psd.device-mobile .writ .stamp { min-width:0; padding:12px 14px;}
    .psd.device-mobile .writ .stamp .row { grid-template-columns:64px 1fr; gap:8px;}

    /* dossier — single col, tighten */
    .psd.device-mobile .dossier ol { grid-template-columns:1fr; column-gap:0;}
    .psd.device-mobile .dossier ol li { grid-template-columns:24px 32px 1fr; row-gap:4px;}
    .psd.device-mobile .dossier ol li .meta { grid-column:3; font-size:9px;}

    /* brief diff — stack the two columns */
    .psd.device-mobile .brief-diff { grid-template-columns:1fr;}

    /* specs / stability — 1 col */
    .psd.device-mobile .specs { grid-template-columns:1fr; border-bottom:none;}
    .psd.device-mobile .specs .it { border-right:none; border-bottom:1px solid var(--p-grid-2);}
    .psd.device-mobile .stab { grid-template-columns:1fr; border-bottom:none;}
    .psd.device-mobile .stab .col { border-right:none; border-bottom:1px solid var(--p-grid-2);}

    /* pilot, flags, methods — all single column */
    .psd.device-mobile .pilot { grid-template-columns:1fr;}
    .psd.device-mobile .flags > .flag { grid-template-columns:1fr;}
    .psd.device-mobile .flags > .flag .acks { align-items:flex-start; padding-left:18px; min-width:0;}
    .psd.device-mobile .methods { grid-template-columns:1fr;}
    .psd.device-mobile .ds-methods { grid-template-columns:1fr; gap:12px;}

    /* shrink the DocuSign frame body */
    .psd.device-mobile .ds-frame-body { padding:14px 16px 4px; min-height:140px;}
    .psd.device-mobile .ds-method { padding:18px 18px 16px;}

    /* commit — terms + button stack */
    .psd.device-mobile .commit { grid-template-columns:1fr; padding:18px 18px;}
    .psd.device-mobile .commit .terms { font-size:13px;}

    /* ─── formula table → stacked ingredient cards on mobile ─────────────
       The 6-col formula table doesn't fit at 390. Rather than horizontal
       scroll, reshape each row into a card: ingredient name + INCI on
       top, then label·value rows for %/function/supplier/Δ. */
    .psd.device-mobile .ftable,
    .psd.device-mobile .ftable thead,
    .psd.device-mobile .ftable tbody,
    .psd.device-mobile .ftable tfoot,
    .psd.device-mobile .ftable tr,
    .psd.device-mobile .ftable th,
    .psd.device-mobile .ftable td { display:block; width:auto;}
    .psd.device-mobile .ftable { border:1px solid var(--p-grid); padding:0;}
    .psd.device-mobile .ftable thead { display:none;}
    .psd.device-mobile .ftable tbody tr { padding:14px 14px 12px; border-bottom:1px solid var(--p-grid-2); display:flex; flex-direction:column; gap:10px;}
    .psd.device-mobile .ftable tbody tr:last-child { border-bottom:none;}
    .psd.device-mobile .ftable tbody tr.phase-row { padding:6px 14px; gap:0; background:var(--p-paper-2);}
    .psd.device-mobile .ftable tbody tr.phase-row td { padding:0; border:none; font-size:9px;}
    .psd.device-mobile .ftable tbody tr.hero { background:color-mix(in oklab, var(--p-accent) 6%, var(--p-paper));}
    .psd.device-mobile .ftable tbody tr.hero td { background:transparent;}
    .psd.device-mobile .ftable tbody td { padding:0; border:none;}
    .psd.device-mobile .ftable tbody td:first-child { padding-bottom:6px; border-bottom:1px dotted var(--p-grid);}

    /* relabel the 4 metadata cells via ::before — mono micro-tag style */
    .psd.device-mobile .ftable tbody td.pct,
    .psd.device-mobile .ftable tbody td.fn,
    .psd.device-mobile .ftable tbody td.sup,
    .psd.device-mobile .ftable tbody td.delta-cell { display:grid; grid-template-columns:80px 1fr; gap:10px; align-items:baseline; font-size:12px; text-align:left !important;}
    .psd.device-mobile .ftable tbody td.pct::before { content:"w/w %"; }
    .psd.device-mobile .ftable tbody td.fn::before  { content:"Function"; }
    .psd.device-mobile .ftable tbody td.sup::before { content:"Supplier"; }
    .psd.device-mobile .ftable tbody td.delta-cell::before { content:"Δ v03 → v04"; }
    .psd.device-mobile .ftable tbody td.pct::before,
    .psd.device-mobile .ftable tbody td.fn::before,
    .psd.device-mobile .ftable tbody td.sup::before,
    .psd.device-mobile .ftable tbody td.delta-cell::before {
      font-family:var(--mono); font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:var(--p-muted);
    }
    /* hide the row-actions cell (comment chips) on phone */
    .psd.device-mobile .ftable tbody td:last-child { display:none;}
    /* tfoot — totals as a stacked block */
    .psd.device-mobile .ftable tfoot tr { padding:14px; gap:6px; background:var(--p-paper-2); border-top:2px solid var(--p-ink);}
    .psd.device-mobile .ftable tfoot td { font-size:10px; padding:0; text-align:left !important;}

    /* attestation chips — stack to 1 col on phone */
    .psd.device-mobile .ds-att-summary .att-grid { grid-template-columns:1fr;}

    /* legal banner */
    .psd.device-mobile .legal-banner { grid-template-columns:auto 1fr; row-gap:10px;}
    .psd.device-mobile .legal-banner .lb-mark { width:24px; height:24px;}
    .psd.device-mobile .legal-banner .lb-l { font-size:8.5px;}

    /* sign block / preamble — smaller */
    .psd.device-mobile .signblock { margin-top:48px; padding-top:24px;}
    .psd.device-mobile .signblock .preamble { grid-template-columns:1fr; gap:8px; padding:16px 18px; margin-bottom:24px;}
    .psd.device-mobile .signblock .preamble h2 { font-size:24px; line-height:1.1;}
    .psd.device-mobile .signblock .preamble .ix { font-size:24px;}

    /* colophon */
    .psd.device-mobile .colophon-full .cf-clauses { grid-template-columns:1fr;}
    .psd.device-mobile .colophon-full .cf-clauses article { border-right:none; grid-template-columns:36px 1fr; gap:12px; padding:16px 18px;}
    .psd.device-mobile .colophon-full .cf-cp-row { grid-template-columns:1fr; gap:14px;}
    .psd.device-mobile .colophon-full .cf-foot { grid-template-columns:1fr; gap:18px;}
    .psd.device-mobile .colophon { grid-template-columns:1fr; gap:24px;}

    /* receipt */
    .psd.device-mobile .receipt .ledger .row { grid-template-columns:1fr; gap:4px; padding:12px 16px;}
    .psd.device-mobile .receipt .unblocks .grid { grid-template-columns:1fr;}

    /* universal: section padding tightens */
    .psd.device-mobile .section .section-head h2 { font-size:24px;}
    .psd.device-mobile .section .section-head .ref { font-size:9px;}

    /* form headers — sign-block H2 etc */
    .psd.device-mobile .ds-frame-chrome .ds-url { font-size:8.5px; padding:0 6px;}
  `;
  return <style dangerouslySetInnerHTML={{__html: css}}/>;
}

window.SignoffResponsiveStyles = SignoffResponsiveStyles;
