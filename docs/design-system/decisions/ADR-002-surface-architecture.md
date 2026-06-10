# ADR-002 — Surface Architecture: One Token Layer, Multiple Surfaces

**Status:** Accepted
**Date:** 2026-05-17
**Supersedes:** —
**Related:** ADR-001 (Brand Vocabulary), MIGRATION-PLAN.md, REFERENCE.md

---

## Context

After ADR-001 codified the brand token system for the customer-facing **Portal** (`portal-system.jsx`, `portal-signoff.jsx`), a second production surface has matured into design: the internal **MRP** suite (manufacturing resource planning — `MRP Workbench.html`, `MRP Pre-Quote.html`, `MRP Sample Pour.html`, `MRP Standard Costs.html`, `MRP Quote.html`, `MRP BOM Dossier.html`, `MRP Assembly Dossier.html`, `MRP Design Process Flow.html`, `MRP Product Development.html`).

The MRP surface ships its own stylesheet at `mrp/styles.css`. Its header declares it an *"internal instrument-panel skin layered on brand tokens."*

When we compare its `:root` block against `design-system-handoff/tokens.css`, the values are **byte-for-byte identical**:

| Token | Portal `tokens.css` | MRP `styles.css` | Match |
|---|---|---|---|
| `--p-paper` | `#F8F6F1` | `#F8F6F1` | ✅ |
| `--p-paper-2` | `#F4F0E7` | `#F4F0E7` | ✅ |
| `--p-card` | `#F2EDE2` | `#F2EDE2` | ✅ |
| `--p-ink` | `#1B1A17` | `#1B1A17` | ✅ |
| `--p-ink-2` | `#3A3833` | `#3A3833` | ✅ |
| `--p-muted` | `#807A6F` | `#807A6F` | ✅ |
| `--p-grid` | `rgba(27,26,23,0.16)` | `rgba(27,26,23,0.16)` | ✅ |
| `--p-accent` | `#244A39` | `#244A39` | ✅ |
| `--p-accent-soft` | `#BCCFBF` | `#BCCFBF` | ✅ |
| `--p-ok` / `--p-warn` / `--p-info` / `--p-hot` | identical | identical | ✅ |
| `.dark` variant | identical | identical | ✅ |

The third surface — the **public Homepage** (`Petra Lab-X Homepage v3.html`, apothecary direction) — is on a deliberately different aesthetic track (Instrument Serif + Fraunces + EB Garamond on warm-cream paper). Its scope is treated in a separate memo (`HOMEPAGE-SCOPE.md`).

This ADR exists because the apparent fork ("portal and MRP both define the same tokens twice") is a packaging accident, not a design decision, and we should resolve it before either surface ships to production.

---

## Decision drivers

1. **Production engineers need a single source of truth.** If `--p-accent` changes, both surfaces must move together — they share a brand, and divergence is a regression.
2. **MRP is a sibling surface, not a child of Portal.** Treating MRP as a portal variant would tangle two unrelated information architectures.
3. **Surface-specific components (MRP's `.opstrip`, `.projcrumb`, `.phaserail`) belong with the surface that uses them.** They are not brand primitives; they're industrial-UI patterns the customer portal does not need.
4. **The `.dark` class is shared today.** Both files declare the same dark palette in the same way. Don't break that.
5. **Renaming `--p-*` to surface-prefixed tokens (`--mrp-*`, `--portal-*`) would multiply files and inhibit reuse** — both surfaces want the same paper, the same ink, the same forest accent. The shared prefix is the feature, not the bug.

---

## Considered options

### Option A — Two design systems, sibling skins (REJECTED)
Treat `mrp/styles.css` as a fully independent stylesheet with its own token block. Accept the duplication; sync values manually when they change.

- ✅ Zero refactor; ships today.
- ❌ Two sources of truth. Inevitable drift on the first `--p-accent` rebalance.
- ❌ Sets the precedent that every new surface forks the tokens. Doesn't scale.

### Option B — Rename MRP tokens to `--mrp-*` (REJECTED)
Treat the two surfaces as separate token namespaces, with no shared brand layer.

- ✅ Maximum isolation; surfaces can't accidentally affect each other.
- ❌ The values are identical *because they're the same brand*. Renaming hides that fact and makes the next designer wonder which surface to copy from.
- ❌ Tailwind `@theme inline` config has to mirror both namespaces — twice the config, twice the drift risk.

### Option C — One brand layer, surface-specific component sheets (RECOMMENDED)
Promote the design-system token file to the single brand-token source. In this repo, `docs/design-system/tokens.css` is canonical and `portal/src/styles/brand-tokens.css` is the runtime mirror. MRP's component CSS and React components (`.topbar`, `.opstrip`, `.projcrumb`, `.phaserail`, `.workspace`, `.modhead`, status pills, etc.) stay with the operations surface. Portal does the same: shadcn primitives + token remap + portal-specific component variants where needed.

- ✅ Single source of truth for color, type, spacing, motion.
- ✅ Surface-specific patterns live where they're used; the brand layer stays small and stable.
- ✅ A change to `--p-accent` propagates everywhere in one commit.
- ✅ Future surfaces (admin panels, marketing pages that want the editorial skin, internal tools) layer the same way — import `tokens.css`, add their own component sheet.
- ⚠️ Requires a small migration to update `mrp/styles.css` and any other surface stylesheets. Scope: one file, ~25 lines removed, one `@import` added.

---

## Decision

**Adopt Option C.** One brand-token layer (`docs/design-system/tokens.css` as the canonical spec and `portal/src/styles/brand-tokens.css` as the runtime mirror), multiple surface-specific component sheets that consume those tokens.

For this repository, Portal and MRP both live inside the same Next.js application under `portal/src/app/(portal)` and `portal/src/app/mrp`. The original handoff language assumed a separate MRP production codebase; the accepted repo interpretation is the same architecture adapted to route groups and component directories in this repo.

### Architecture diagram

```
                  ┌─────────────────────────────────────┐
                  │  docs/design-system/tokens.css      │
                  │  ─── brand source of truth ───      │
                  │  --p-paper, --p-ink, --p-accent…    │
                  │  .dark { …inverted palette }        │
                  └────────────────┬────────────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            │                      │                      │
            ▼                      ▼                      ▼
  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────┐
  │  Portal          │  │  MRP             │  │  Homepage          │
  │  (shadcn + brand │  │  (instrument-    │  │  (apothecary, see  │
  │   token remap)   │  │   panel skin)    │  │   HOMEPAGE-SCOPE)  │
  │                  │  │                  │  │                    │
  │  Components:     │  │  Components:     │  │  Components:       │
  │  shadcn variants │  │  .opstrip        │  │  apothecary-*.jsx  │
  │  ChassisFolio    │  │  .projcrumb      │  │  paper-tone variant│
  │  WritStamp       │  │  .phaserail      │  │  (different fonts) │
  │  AttestationChip │  │  .workspace      │  │                    │
  └──────────────────┘  └──────────────────┘  └────────────────────┘
```

### Naming convention going forward

- `--p-*` — **brand layer.** Defined exactly once in the canonical spec and mirrored once for runtime. Any surface may read them.
- No surface-prefixed tokens (no `--mrp-paper`, no `--portal-ink`). If a surface needs a value that differs from the brand, that is a signal to **revise the brand token**, not to fork.
- Surface stylesheets contain **classes**, not tokens. Class names should be obviously scoped to their surface (`.opstrip` for MRP ops, `.psd-` for portal sign-off deed, etc.).
- Status colors (`--p-ok`, `--p-warn`, `--p-info`, `--p-hot`) are brand-level. They map to the same semantics across surfaces: approved / pending / informational / destructive. Surfaces do not redefine them.

### What MRP keeps in its own sheet

The non-token CSS in `mrp/styles.css` is real, useful, and surface-specific. It stays:

- `.topbar`, `.opstrip` — internal-ops chrome (live KPIs, search shortcut).
- `.projcrumb`, `.projctx`, `.flagdrop` — multi-project navigation patterns that don't appear in the customer portal.
- `.phaserail`, `.tracks`, `.track .step` — 8-stop production pipeline visualization.
- `.workspace`, `.sidebar`, `.rightrail`, `.mainpane` — the three-column workbench shell.
- `.modhead`, `.viewlbl`, `.stage.split` — module-level layout patterns.
- `.btn` (MRP's flavor — heavier letter-spacing, mono caps), `.pill` (status pills with status-color border + dot).
- `.tweaks-toggle-fake` — design-time scaffold; remove when porting to production.

When the portal needs equivalent patterns (e.g. a status pill, a module head), it should not import them from `mrp/styles.css`. It should build them against shadcn + `tokens.css` so the customer-facing surface inherits shadcn's accessibility primitives.

---

## Migration

A sequenced migration. After this ADR is accepted:

1. **Keep `docs/design-system/tokens.css` canonical** and mirror runtime values into `portal/src/styles/brand-tokens.css`.
2. **Update MRP shell/components** under `portal/src/app/mrp/**` and `portal/src/components/mrp/**` to consume the same brand tokens instead of hardcoded teal/ramp colors.
3. **Bridge AG Grid and data-dense exceptions** through documented token adapters rather than redefining surface-specific palettes.
4. **Verify** by loading staging MRP and customer routes and confirming computed `--p-paper`, `--p-ink`, `--p-accent`, status colors, and font stacks resolve from the shared brand layer.
5. **Add an `@font-face` audit** while migrating fonts: portal expects Mazius Display and JetBrains Mono families, with Mazius fallback explicitly accepted until a licensed self-hosted file is available.

Scope: phase-gated under the design-system migration plan. Phase A is docs/assets only; token and route changes follow in separate AutoPilot phases. See `MRP-MIGRATION.md` for the MRP rollout sequence adapted to this repo.

---

## Consequences

**Positive:**
- A change to `--p-accent` (or any brand value) propagates to all surfaces in one commit.
- New surfaces have an obvious starting point: import `tokens.css`, write a component sheet.
- The "brand vs. surface" distinction is now explicit in the file layout, which lowers the onboarding cost for new engineers and designers.

**Negative / accepted tradeoffs:**
- Surfaces are now coupled through a shared file. A breaking change to `tokens.css` breaks every surface. This is the correct trade — design system tokens *should* be a coordinated change.
- The dark-mode palette is shared. If MRP ever wants a different dark variant (higher contrast for a control room, say), it cannot diverge by overriding `--p-paper` in `mrp/styles.css` without breaking the contract. The escape hatch is to introduce a new variant class (e.g. `.dark-control-room`) in `tokens.css` itself, not in the surface sheet.

**Open questions:**
- Should the brand layer expose a CSS-only "high-contrast" variant for accessibility? Not in v0; track as a follow-up.
- Marketing pages that intentionally break brand (the apothecary homepage with its different type stack) currently do not include `tokens.css` at all. That is fine — they live in a sibling track. See `HOMEPAGE-SCOPE.md`.
