# Brand Assets

> Canonical source-of-truth for PLX brand assets. The running portal does **not** read
> from this folder directly — see "Production usage" below.

---

## Logo set (`logos/`)

Six PNGs covering three layouts × two color treatments.

| File | Layout | Color | Recommended usage |
|---|---|---|---|
| `logo-full-ink.png` | Full lock-up | Ink (`#1B1A17`) on transparent | Light backgrounds, primary brand surface |
| `logo-full-cream.png` | Full lock-up | Cream (`#F8F6F1`) on transparent | Dark backgrounds, photography overlays |
| `logo-horizontal-ink.png` | Horizontal | Ink on transparent | Headers, narrow horizontal real estate (light) |
| `logo-horizontal-cream.png` | Horizontal | Cream on transparent | Headers on dark / photography (dark) |
| `logo-stacked-ink.png` | Stacked | Ink on transparent | Square spaces, social avatars (light) |
| `logo-stacked-cream.png` | Stacked | Cream on transparent | Square spaces (dark) |

Source PDF lives at `../specs/_handoff-context/reference-images/logo_file-1777802508146.pdf`
if a vector source is needed for print or SVG conversion.

## v0.4 SharePoint Bundle Additions

The 2026-05-17 SharePoint `New PLX Portal Design/bundle` added runtime-ready
favicons and a standalone periodic mark. These are archived here as canonical
brand assets. Phase B promoted the runtime-safe subset into
`portal/public/brand`.

### Favicons (`favicons/`)

| File | Intended usage |
|---|---|
| `favicon-16.png` | Browser tab small raster fallback |
| `favicon-32.png` | Browser tab standard raster fallback |
| `favicon-64.png` | Higher-density browser/favicon fallback |
| `favicon-180.png` | Apple touch icon light/default |
| `favicon-512.png` | PWA/large icon light/default |
| `favicon-dark-180.png` | Dark-background touch icon candidate |
| `favicon-dark-512.png` | Dark-background PWA/large icon candidate |

### Marks (`marks/`)

| File | Intended usage |
|---|---|
| `mark-ink-128.png` | Periodic-mark glyph fallback for places that cannot render `<PMark>` |

---

## Font set (`fonts/mazius/`)

Mazius Display files for production typography. Runtime code only loads the
400 regular and 400 italic cuts; do not register bold or extra-italic cuts in
`portal/src/app/layout.tsx`.

| File | Weight | Style | Recommended usage |
|---|---:|---|---|
| `MaziusDisplay-Regular.woff2` | 400 | normal | Display headings, editorial titles |
| `MaziusDisplay-Italic.otf` | 400 | italic | One-word editorial accents only |
| `MaziusDisplay-Bold.woff2` | 700 | normal | Archived source cut; not loaded in production |
| `MaziusDisplay-Extraitalic.woff2` | 400 | italic | Archived source cut; not loaded in production |
| `MaziusDisplay-ExtraItalicBold.woff2` | 700 | italic | Archived source cut; not loaded in production |
| `LICENSE.txt` | -- | -- | SIL Open Font License 1.1 |

The running portal copies only the production cuts to `portal/public/fonts/mazius/`
and loads them with `next/font/local`.

---

## Production usage

The running Next.js portal cannot import directly from `docs/design-system/`. To use
these assets in production code:

1. Copy the required logos, favicons, or marks to `portal/public/brand/` or the app favicon paths
2. Reference them as static assets:
   ```tsx
   import Image from "next/image";
   <Image src="/brand/logo-full-ink.png" alt="Petra Lab X" width={240} height={56} />
   ```

Font assets are loaded from `portal/public/fonts/mazius/` in `portal/src/app/layout.tsx`.
The logo/favicon copy step is tracked in `tasks/todo.md`. These production copies
are intentionally separate from the canonical archive in this folder for two reasons:

- The canonical set may evolve (new sizes, vector replacements, dark variants) and
  shouldn't be coupled to the bundled-asset surface.
- `portal/public/` should only contain what the running app actually uses, not every
  logo variant in the brand kit.

When v1 lands a vendored vector logo (SVG), update this README to point to the SVG
location and deprecate the PNGs by use case rather than removing them.

### Current runtime subset

The following files are currently mirrored to `portal/public/brand/`:

- `logo-full-ink.png`
- `logo-full-cream.png`
- `logo-horizontal-ink.png`
- `logo-horizontal-cream.png`
- `logo-stacked-ink.png`
- `favicon-16.png`
- `favicon-32.png`
- `favicon-64.png`
- `favicon-180.png`
- `favicon-512.png`
- `mark-ink-128.png`

---

## Color reference

For convenience when picking a logo variant:

| Brand color | Hex | Usage |
|---|---|---|
| Paper (cream) | `#FBF9F5` | Page background; cream-logo backdrop |
| Ink | `#1B1A17` | Primary text; ink-logo backdrop |
| Forest accent | `#244A39` | Primary action/active state in v0.4 |

These are defined in `../tokens.css` as `--p-paper`, `--p-ink`, and `--p-accent`.
