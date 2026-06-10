# REFERENCE — Design Spec Index

> Pointer-index of every HTML design artifact this handoff produced.
> Each entry: what the artifact covers, what's mock vs. real, where to look in the file.

The artifacts in this repo are the governed copy of the Claude Design exploration. They are **not** production source; they are visual specs. Production code reads them, lifts structure and intent, then rebuilds against the brand tokens in this folder.

The external OneDrive/Claude Design folder is provenance. If it changes, reconcile those changes into `docs/design-system/**` first; do not build production UI directly from the external bundle.

---

## How to read the artifacts

Each spec is a single self-contained HTML file with embedded React + Tailwind. To see one:

1. Open the file in the design exploration's preview pane.
2. Most have a Tweaks panel — toggle Legal Mode, Sign Method, etc. to see variants.
3. View source. The `<style>` block at top is the canonical CSS for that screen. The component logic is downstream.

When porting to the portal: **copy the structure and class names mentally, but always rebuild against `tokens.css` and shadcn primitives**. Never copy a CSS block verbatim — the artifacts use unscoped selectors and inline numerics that would pollute production.

---

## Active pilot

### `specs/portal/portal-login.jsx` — Customer Login Instrument

**Status:** Active pilot as of 2026-05-06.

**Selected direction:**
Use `PortalLogin_Instrument`, not the lab-bench variant. It pairs a left-side operational instrument panel with a right-side sign-in folio, which best matches the ForgeMaster mandate: trust, operational data, and audit posture without generic SaaS chrome.

**What's mock:**
- Google SSO and magic-link controls. Production currently supports credentials and Azure AD; do not ship unavailable auth methods.
- Any live telemetry, SOC 2, webhook, or Business Central sync claims unless backed by implemented systems.
- Static operational values and project/customer names.

**What to lift:**
- Split-screen composition with aggressive single-column mobile collapse.
- Mono metadata strips, chassis ticks, restrained rust accent, and quiet operational trust panel.
- Light and dark variants from the design canvas.
- Full state coverage: loading, invalid credentials, disabled account, account-created success (`registered=true`), reset success, successful submit, and forced password reset.

---

## The artifacts

### 1. `portal-system.jsx` — Portal System Canvas

**What it covers:**
The complete portal language in one canvas. Five artboards laid out side-by-side via `<DesignCanvas>`:
- **Login** — customer-entry direction, with `PortalLogin_Instrument` selected as the active production pilot.
- **Workbench** — projects list, banded chassis layout, status pills.
- **Project detail** — formula tab with stacked-card mobile variant + desktop table.
- **Sign-off summary** — preview tile that links into `portal-signoff.jsx`.
- **Periodic mark plate** — the `<PMark>` glyph in isolation.

**What's mock:**
- All project data (`PLX-2614`, `LIGHT 03 EAU DE COLOGNE`, `TARIQ DEL MAR`).
- BOM rows are illustrative — real rows come from `Formulation.bomLines`.
- Status counts (`12 ingredients · 4 phases`).

**What to lift:**
- Token values (now in `tokens.css`).
- Chassis-tick placement pattern (now codified as `<ChassisTicks>` per `COMPONENT-INVENTORY.md`).
- Mono-kicker pattern (`.p-kicker` utility).
- Banded sidebar pattern in workbench.

### 2. `portal-signoff.jsx` — Sign-off Deed Canvas

**What it covers:**
The deed-of-formulation flow in depth. Approximately 14 sections in a single long deed document, including: writ stamp + parties, recitals, formula table, attestation chips, packaging artwork frame, COA preview, pilot pour slate, open flags row, DocuSign-aware sign block, boilerplate, colophon. Plus a **post-signed receipt state** (separate artboard).

Mobile (390) and tablet (768) variants live in adjacent artboards.

**Tweaks exposed:**
- **Legal Mode** — Minimal · Standard · Regulated SKU. Toggles which boilerplate sections render.
- **Sign Method** — DocuSign embedded · typed-cert fallback. Switches the sign block frame.
- **State** — Pre-sign · Signed receipt.

**What's mock:**
- All deed copy is synthesized. Real boilerplate must come from PLX legal counsel, not from this artifact.
- The DocuSign frame chrome (toolbar dots, "SIGN HERE" tag) is a visual placeholder for the real DocuSign embedded iframe. Production wraps the real iframe in `<ChassisFolio>` but does not restyle iframe contents.
- Open flags list is hand-authored. Production queries the flags model (TBD — see `MIGRATION-PLAN.md` §4.4).
- Attestation values (`pH 5.4`, `viscosity 4200 cP`) are illustrative.

**What to lift:**
- The 14-section structure is the production information architecture for this screen. Match it.
- `<WritStamp>`, `<AttestationChip>`, `<OpenFlagRow>` patterns codified in `COMPONENT-INVENTORY.md`.
- Pilot Pour slate frame (the ratio'd film-slate placeholder).
- The DocuSign frame wrapper pattern.
- Mobile sign block — sticky bottom CTA, summary above.

### 3. Navigation map artboard

**What it covers:**
A schematic showing Workbench → Project → Sign-off → (post-sign next destination), with the open question on the post-sign step explicitly called out.

**What's mock:**
The post-sign next destination is **unresolved** in v0. The map shows two candidate flows: (a) return to Project Detail with a "signed" banner; (b) dedicated receipt screen with PDF download CTA. Pick one in Phase 4 of `MIGRATION-PLAN.md`.

**What to lift:**
The map itself is a planning artifact, not a production screen. Use it as a routing-decision guide when wiring the sign-off screen's redirect after success.

---

## Cross-system selector hygiene

The `portal-system.jsx` and `portal-signoff.jsx` files originally shared the document and contained a small number of un-namespaced selectors that would leak across artboards in production. Those were audited and namespaced under `.psd` (portal-signoff-deed) and `.pf` (portal frame) prefixes during the design phase. **When porting:** every selector becomes a Tailwind utility, a shadcn variant, or a class on a brand component — none of these CSS blocks survive into production. The audit is preserved here only as a reminder that ad-hoc selectors are how design systems decay.

---

## What's NOT specified anywhere

These exist in the product but were out of scope for v0 design:

- **Admin / operations routes** — keep current shadcn defaults until a v1 admin design pass.
- **Public homepage** — explicitly out of scope (different aesthetic, different surface).
- **Email templates** — not designed; existing transactional emails stay as-is.
- **PDF-rendered deed** — the post-signed PDF generation is a known stub (see `PROJECT-STATUS.md` in the portal repo). When that PDF gets a real layout, it should re-quote the deed screen at 8.5×11, but the visual spec for that doesn't exist yet.
- **Notifications / activity feed** — used in workbench mock as filler but not specified in detail.
- **Settings / account** — not designed.
