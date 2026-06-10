# HOMEPAGE-SCOPE — Public Marketing Site Decision

> Sibling memo to `REFERENCE.md` (Portal) and `MRP-REFERENCE.md` (MRP).
> Resolves the open question: does the public homepage fold into this
> handoff bundle, or stay on a separate track?

**Status:** Decided
**Date:** 2026-05-12
**Canonical artifact:** `Petra Lab-X Homepage v3.html`
**Related:** `decisions/ADR-001-brand-vocabulary.md`,
`decisions/ADR-002-surface-architecture.md`

---

## Question

The customer Portal and the MRP ops surface share a tightly-constrained
brand language: warm paper, ink near-black, forest accent, Mazius Display
for editorial moments, Inter + JetBrains Mono for working text.

The public homepage (`Petra Lab-X Homepage v3.html`, "apothecary"
direction) intentionally departs from this:
- **Type stack:** Instrument Serif + Fraunces + EB Garamond + Inter
  Tight + JetBrains Mono — none of these are the portal's Mazius.
- **Paper tone:** warmer (`#f0eee9` default), with four selectable
  swatches (warm cream / aged manila / soft bone / linen).
- **Accent palette:** six options (forest, rust, plum, indigo, tobacco,
  char) plus four "hot" accent options. The Portal commits to one forest.
- **Density:** generous, image-led, marketing-paced. The Portal and MRP
  are functional surfaces.

Should we fold this into the same handoff (one design system, marketing
as a "loud" variant), or treat it as a sibling track with its own
brand layer?

---

## Decision

**Sibling track.** The homepage stays separate from the Portal/MRP
handoff bundle. It will have its own production repo, its own brand
token file, and its own component library when the time comes.

`tokens.css` in this handoff does **not** apply to the marketing site.
The marketing site does **not** import `tokens.css`.

---

## Rationale

1. **Different jobs.** The Portal/MRP system is an *operational*
   design system: it codifies the working surface where a brand owner
   signs a deed, and where PLX staff move a project through its
   lifecycle. The homepage is a *marketing* design system: it sells
   trust before any of that work has begun. Conflating the two would
   either dilute the working surface (too many type families to support)
   or starve the marketing site (one accent color is wrong for editorial
   variety).

2. **Different update cadence.** Marketing sites iterate on campaign
   cycles — weeks. Working surfaces iterate on quarter cycles — months.
   Coupling them through a shared `tokens.css` would force the working
   surface to absorb every marketing experiment, or force marketing to
   wait on working-surface release windows.

3. **The shared element is the wordmark, not the system.** The brand
   marks (`Petra Lab-X Brand Marks.html`, `plx-brand-marks.jsx`) are
   the genuine shared spine. The wordmark, the periodic-mark glyph,
   the favicon set — those are brand-level. The skin around them
   diverges by surface.

4. **The homepage already commits to its own direction.** v3 imports
   four font families this handoff doesn't use, defines its own paper
   palette via Tweaks, and exposes accent options where forest is
   *one of six* — i.e. the portal's signature accent is a curated
   option in marketing's broader palette, not the only option.

5. **The ADR-002 architecture supports this cleanly.** Surfaces consume
   `tokens.css` if they want the working-surface brand. Marketing
   simply doesn't import it. No special-casing required.

---

## What the homepage shares with Portal/MRP

| Asset | How it's shared |
|---|---|
| Wordmark and lockup | Defined in `Petra Lab-X Brand Marks.html`. Both tracks use it. |
| Periodic-mark `<PMark>` glyph | Defined in `plx-brand-marks.jsx`. Both tracks use it. |
| Favicon set | `assets/favicon-*.png`. Both tracks reference it. |
| Email signature template | Omitted from the repo artifact because it contains personal contact information. Brand-level only. |
| The name "Petra Lab-X" and the descriptor "Frontier lab for breakthrough products at scale" | Brand-level copy. |

Everything else — fonts, paper tones, accent colors, components,
spacing scale — is independent.

---

## What the homepage does NOT share with Portal/MRP

| Element | Portal/MRP | Homepage |
|---|---|---|
| Body font | Inter (or Inter Tight) | Inter Tight |
| Display font | Mazius Display | Instrument Serif / Fraunces / EB Garamond |
| Paper tone | `#F8F6F1` (fixed) | `#f0eee9` default, 4 swatches |
| Accent color | `#244A39` forest (fixed) | 6 options × 4 hot variants |
| Density | Working — high info, tight | Editorial — generous, image-led |
| Components | shadcn + brand variants / `mrp/styles.css` | `apothecary-*.jsx` suite |
| Tokens file | `tokens.css` | None (or its own, when productionized) |
| Source of truth | This handoff | TBD when the marketing site enters production |

---

## Future state

When the marketing site is productionized (not yet — v3 is still in
design exploration), it will get its own bundle:

- `marketing-design-system/tokens.css` — its own brand layer.
- `marketing-design-system/REFERENCE.md` — index of its artifacts.
- `marketing-design-system/decisions/ADR-001-…` — its own ADR series.

This handoff bundle will not absorb that work. The two systems will
sit side-by-side in the design ecosystem, sharing only the brand
spine (wordmark, glyph, favicons, type system at the *family* level —
both are serif-led editorial systems, just with different specific
families).

If the marketing direction ever converges on Portal/MRP (e.g. PLX
decides the apothecary direction is wrong and the homepage should
adopt the working-surface voice), the merge is one ADR away: have
`marketing-design-system/tokens.css` `@import` the working-surface
tokens, and treat marketing as a third surface in ADR-002. Until that
decision is made explicitly, they stay separate.

---

## Action items

- ✅ Move superseded homepage versions (v1, v2) to `archive/`. (Done
  in the archive pass.)
- ✅ Confirm v3 as canonical. (Confirmed by user, 2026-05-12.)
- ⏳ Productionize v3: out of scope for this handoff. Open as a
  separate marketing-site engagement when ready.
- ⏳ Re-shoot the homepage's hero imagery: the current `apothecary-*.jsx`
  files use placeholders. Production needs real photography.
- ⏳ Lock the homepage's final font selection: v3 keeps Instrument
  Serif / Fraunces / EB Garamond as tweakable options. Marketing
  needs to commit to one before launch.
- ⏳ When the marketing site enters production, write its own
  `marketing-design-system/` bundle.
