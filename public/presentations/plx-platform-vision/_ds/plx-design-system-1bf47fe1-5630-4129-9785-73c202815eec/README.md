# PLX Design System — Petra Lab-X

The shared visual system for **Petra Lab-X (PLX)** — a personal-care **contract manufacturer**. PLX develops and manufactures cosmetic and personal-care products (hand balms, creams, sticks, formulations) on behalf of brands, and runs an AI-enabled manufacturing-operations platform and **customer portal** (plx.io) where clients manage onboarding, product briefs, documents, approvals, and credit applications.

The aesthetic is **editorial, instrument-panel**: warm paper surfaces, near-black ink, **one** forest accent, near-sharp corners, and mono labels that read as instrumentation on a control chassis. No stock-photo clutter, no icon soup, no emoji, no gradients.

---

## Index — what's in this project

| Path | Purpose |
|---|---|
| `styles.css` | **Canonical entry.** Loads webfonts (CDN) + `@import`s the token layer. Drop this into any artifact. |
| `colors_and_type.css` | The token core. Brand tokens (`--p-*`), font stacks, type scale, spacing, radius, motion, light + dark schemes, and `.plx`-scoped semantic defaults + base components. |
| `components.html` | Original live component reference gallery (colors, type, buttons, pills, cards). |
| `assets/` | Logos (horizontal ink / cream, periodic-element mark), favicon. |
| `preview/` | Small HTML cards that populate the Design System tab. |
| `ui_kits/customer-portal/` | High-fidelity recreation of the PLX customer portal (dashboard, projects, documents, approvals) in the PLX brand. |
| `SKILL.md` | Agent Skill entry point for using this system in Claude Code. |

### Sources

This system was built from materials the user supplied:

- **Uploaded design seed:** `PLX Design System` (tokens, components gallery, logos) — treated as the canonical brand.
- **Product repo:** `github.com/taylorvalton/plx-customer-portal` — the live Next.js 16 / Tailwind v4 / shadcn-ui "PLX Manufacturing Suite" (plx.io). Used as the source of truth for the customer-portal information architecture, screens, and components. Explore it further to deepen any portal recreation.
- The `agentic-swarm` reference is a **git submodule** of the portal repo, not a standalone repo.

> **Design decision worth knowing:** the *deployed* portal currently ships default shadcn neutral grays plus a purple/red/blue floating-orb marketing homepage. The uploaded PLX Design System explicitly rejects gradients and neon. We treated the **editorial PLX system as canonical** and rebuilt the portal's real screens in it. If you instead need to match the live deployed look, pull styles directly from the repo's `globals.css`.

---

## The system at a glance

**Type — three stacks, three jobs**
- **Mazius Display** (serif) — heroes, titles, the pause-here moments. One *italic forest word* per headline is the signature move.
- **Inter** (sans) — body, labels, tables, nav.
- **JetBrains Mono** (mono) — kickers, IDs, data, chassis ticks. Uppercase, generous tracking; reads as a label on a panel.

**Color** — warm paper surfaces, three steps of warm near-black ink, translucent-ink hairlines (never solid grey), **one** rationed forest accent, and earth-toned status colors (sage / amber / steel / mineral) — never saturated alarm hues.

**Shape & rhythm** — radius nearly sharp (4px cards; buttons + pills have *no* radius); 4px spacing base with an intentional `14px` editorial break; motion short and decisive (no springs, no bounces).

---

## CONTENT FUNDAMENTALS

How PLX writes.

- **Voice:** plain, confident, operational. Reads like a competent manufacturing partner, not a marketer. "A *partner*, not a vendor."
- **Person:** addresses the customer as **you** ("View and manage your uploaded documents", "your product briefs and tech transfers"). PLX refers to itself as **PLX** or **we**.
- **Casing:** **Sentence case** for all UI strings, headings, buttons, and table headers ("Upload Document", "New Project", "Needs Action"). **UPPERCASE** is reserved for mono kicker/label/pill text where letter-spacing makes it read as instrumentation ("COSMETIC PRODUCT DEVELOPMENT", "ACTIVE", "IN REVIEW").
- **Tone:** precise and reassuring. Status language is matter-of-fact: "Pending", "In Review", "Approved", "Revision Needed". Attention prompts are direct but calm: "1 document needs your attention — please review feedback and re-upload if needed."
- **Headlines:** the signature editorial move — a serif line with exactly **one** italic forest accent word: "Hands tell our *stories*", "A *partner*, not a vendor", "Solid Hand Balm *Stick*". Never more than one accent word per headline.
- **Domain vocabulary:** product briefs, tech transfers, formulations, BOM, manufacturing orders, onboarding, approvals, credit application, FM codes / FM Ref, SharePoint docs, DocuSign. Personal-care product nouns: hand balm, hand cream, stick.
- **Numbers & data:** rendered in mono with tabular figures, often as terse instrument readouts ("95 · 92 · 97 · 93", FM reference codes).
- **Emoji:** **never.** Icons are line icons (Lucide), used sparingly and functionally — never decoratively.
- **Vibe:** an instrument panel for a lab/factory. Editorial restraint over SaaS friendliness. Every element earns its place.

---

## VISUAL FOUNDATIONS

**Colors.** Warm paper is first-class: `--p-paper #FBF9F5` (page + cards), `--p-paper-2 #F2EDE2` (recesses/hovers/bands), plus dense-ops surface steps `--p-rail #EEEBE3` and `--p-canvas #F5F3EC`. Text is three steps of warm near-black: `--p-ink #1B1A17`, `--p-ink-2 #3A3833`, `--p-muted #807A6F`. The accent is a single forest green `--p-accent #244A39` (`--p-accent-soft #BCCFBF` for washes) — rationed; if everything is forest, nothing is. Status is earth-toned, never neon: sage `--p-ok #5C7A55`, amber `--p-warn #C99340`, steel `--p-info #5B7B91`, mineral `--p-hot #52606E` (destructive **only**).

**Type.** Editorial scale: display 56px (scales to ~152 on marketing), h1 32 / h2 24 / h3 18, body 14, small 12, mono 11, tick 9. Serif headings use negative tracking (-0.02em) and tight leading; mono labels use generous positive tracking (0.18–0.22em) and are always uppercase. Body is Inter at 14/1.55 with `ss01`/`ss02` features on.

**Spacing.** 4px base with one intentional editorial break at **14px**: `4 · 8 · 14 · 22 · 32 · 48 · 72`. The 14 break gives layouts a slightly editorial, non-grid-locked rhythm.

**Backgrounds.** Flat warm paper. **No** gradients, **no** photographic hero clutter, **no** repeating decorative textures. Dense/ops screens sit on `--p-canvas` with cards on `--p-paper`. Imagery, when present, is sparse and warm-toned — never cool, never neon.

**Borders & hairlines.** Prefer **hairlines over fills and shadows.** Hairlines are translucent ink, never solid grey: `--p-grid rgba(27,26,23,0.16)` for cards/dividers, `--p-grid-2 rgba(27,26,23,0.08)` for row separators. Dividers under section kickers, table rules, KPI separators — all hairline.

**Corner radii.** Nearly sharp: cards `--p-radius 4px`, pills/tints `--p-radius-sm 3px`, quote tiles `--p-radius-lg 6px`. **Buttons and status pills have no radius — sharp rectangles.** We are not a squishy SaaS app.

**Shadows / elevation.** Essentially none. Cards are paper + a hairline border, **no drop shadow.** Elevation is communicated by border weight and surface step, not blur.

**Cards.** Paper surface, 1px hairline border, 4px radius, no shadow. They **wake on hover by darkening the border** (`--p-grid` → `--p-ink-2`), not by lifting or shadowing.

**Hover states.** Buttons: ink fill shifts to forest accent on hover. Ghost buttons: border darkens from hairline to ink. Cards: border darkens. Links: forest underline with 2px offset. No scale, no glow.

**Press states.** Short, decisive color change — no shrink/bounce springs.

**Motion.** `--p-ease cubic-bezier(0.2,0.8,0.2,1)`; durations `120ms` (hover/button), `180ms` (default), `320ms` (drawers/stage splits). Fades and short slides only. **No** springs, **no** bounces, **no** infinite decorative loops.

**Transparency & blur.** Used only for hairlines (translucent ink). No glassmorphism, no backdrop-blur panels in the canonical system.

**Layout rules.** Fixed 64px-tall headers and 256px (w-64) left sidebar in app surfaces; content on `--p-canvas`, cards on `--p-paper`. Mono "chassis" labels and kickers anchor sections like instrument labels.

---

## ICONOGRAPHY

- **Icon set:** **Lucide** (`lucide` line icons) — this is what the product uses throughout (`lucide-react`). 1.5–2px stroke, rounded line caps, no fill. Examples in use: `LayoutDashboard, FolderOpen, FileText, CheckSquare, CreditCard, ClipboardList, Bell, Settings, Shield, Factory, Upload, Clock, CheckCircle2, XCircle, RotateCcw, AlertCircle, FolderPlus, ArrowRight, Circle`.
- **How to use:** in HTML artifacts, link Lucide from CDN (`https://unpkg.com/lucide@latest`) and call `lucide.createIcons()`, or inline the specific SVG. Keep icons at 16px (`h-4 w-4`) in nav/rows, 20px (`h-5 w-5`) in stat cards, 1.5px stroke, colored with `currentColor` so they inherit ink/muted/accent.
- **Tint:** icons read in `--p-muted` by default, `--p-ink` when active, status color when paired with status (sage/amber/steel). Accent (forest) icons are rare and intentional.
- **Logo / brand mark:** the **periodic-element mark** (`assets/logo-mark.svg`) — a paper square with "14" top-left and an italic serif "Px" bottom-right, styled like an element tile (Petra Lab-X → "Px"). The **wordmark** (`assets/logo-horizontal-{ink,cream}.svg`) is "Petra Lab-X." in italic Mazius serif with the "-X" in accent. Use ink on paper, cream on dark.
- **Emoji:** **never used.** No unicode-glyph icons either. All iconography is Lucide SVG or the brand marks. Do not hand-draw or invent SVG icons — use Lucide.

---

## Rules of thumb

- One italic forest accent word per serif headline — no more.
- Accent is rationed. If everything is forest, nothing is.
- Status colors are earthy, never neon. `--p-hot` is for destructive **only**.
- Prefer hairlines over fills and shadows. Cards wake on hover by darkening the border.
- Mono labels always uppercase with tracking; never use mono for running body text.
- Sentence case for UI copy; UPPERCASE only for tracked mono labels.
- No emoji, no gradients, no glassmorphism, no decorative motion.

---

## Quick start

```html
<!-- styles.css loads fonts + tokens; scope content with .plx -->
<link href="styles.css" rel="stylesheet">
<body class="plx"> … </body>
```

Add `data-scheme="dark"` (or class `dark`) on any ancestor for the dark scheme.
