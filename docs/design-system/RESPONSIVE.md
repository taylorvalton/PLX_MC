# MRP Portal — Responsive UI/UX Governance

**Status:** Adopted
**Date:** 2026-05-14
**Scope:** All MRP Suite screens (internal) and the Customer Portal (external).
**Owner:** Design · Vince Alton

---

## 1. Breakpoints

Three tiers. **Mobile-up** authoring is preferred, but the current codebase is **desktop-first with overrides** — every responsive rule is in a `@media (max-width: …)` block. New work may adopt mobile-first; the breakpoint values do not change.

| Tier        | Range            | CSS query                  | Primary devices                |
|-------------|------------------|----------------------------|--------------------------------|
| **Desktop** | ≥ 1025 px        | (none — base styles)       | Laptops, monitors              |
| **Tablet**  | 641 – 1024 px    | `@media (max-width: 1024px)` | iPad portrait/landscape, small laptops |
| **Phone**   | ≤ 640 px         | `@media (max-width: 640px)` | Phones (any orientation)       |

**Do not introduce new breakpoints** without a written waiver. Width-based pivots between these three tiers should be solved with `flex-wrap`, `clamp()`, or `minmax()` instead.

**Touch targets:** ≥ 44 × 44 px on phone and tablet. Buttons, chips, and clickable rows must respect this.

---

## 2. Layout rules per tier

### Desktop (≥ 1025 px)
- Global sidebar visible (240 px fixed).
- Topbar shows: workspace switcher · centered search · notifications · avatar.
- Module grids use their authored column counts (e.g. Pipeline = 5 cols, KPI strip = 4 cols).
- Sticky elements (table headers, action bars) remain sticky.

### Tablet (641 – 1024 px)
- Sidebar **collapses to a slide-out drawer**. Hamburger button appears in the topbar `.l` slot.
- Topbar centered search **hides**. Workspace switcher remains.
- Notifications button collapses to icon-only (label hidden).
- Module grids collapse:
  - 4-col strips → 2 × 2
  - 5-col Pipeline kanban → 2 × N (vertical-scrolling columns)
  - Master/detail layouts (Workshop, Std Costs body) → stack vertically (index above doc)
  - 3-up component rows → 2-up
- Wide tables get horizontal scroll (the **table is the only horizontal-scroll surface allowed**; never the page).
- Drawers (Std Costs detail, Pipeline drawer) become full-overlay rather than splitting the canvas.
- Send-for-signature & similar modals: max-width clamps to viewport with 24 px gutter.

### Phone (≤ 640 px)
- Sidebar drawer width = `min(280px, 85vw)`.
- Topbar workspace switcher **hides** (only hamburger + notif icon + avatar remain).
- All multi-column module grids → **1 column**.
- Modals → **full-screen**, no rounded edges, top-anchored.
- Notifications drawer → 100 vw.
- Signature panel: signer rows reflow — signature block drops below the identity, no left rail.
- Margin sliders hide (numeric input remains). Same pattern: when a control is fiddly on touch, keep the value, drop the slider.
- Page horizontal padding: 12–14 px (down from 32 px desktop).

---

## 3. Navigation pattern

**Single source of truth: `mrp/chrome.jsx`** — `<GlobalSidebar>`, `<Topbar>`, `<NotifDrawer>`, `<MrpShell>`, `installMrpChrome()`. Do not re-implement chrome per screen.

### Sidebar drawer protocol (tablet & phone)
- Triggered by `.hamburger` button in `<Topbar>`. Adds `mrp-sb-open` class to `<body>` and `#root`.
- Drawer slides in with a 220 ms ease. Backdrop fades to `rgba(27,26,23,0.4)`.
- Tap backdrop **or** the `.gsb-close` button **or** any nav item to dismiss.
- Escape key dismisses (inherited from existing drawer pattern; verify on new drawers).
- Drawer is `position: fixed`, `z-index: 60`, with backdrop at `z-index: 59`.

### Topbar slot rules
- `.l` (left): workspace switcher and — at ≤ 1024 px — the hamburger before it.
- `.c` (center): search. Hidden ≤ 1024 px.
- `.r` (right): notif button + avatar.

### Inner page sidebars (the 200 px "workspace" sidebar on some modules)
At ≤ 1024 px, they convert from vertical column to a **horizontal scrolling tab strip** under the module header. Items use `border-bottom` for the active indicator instead of `border-left`.

---

## 4. Component-level rules

### Tables
- Headers: sticky at desktop, **non-sticky** at ≤ 1024 px (sticky headers + horizontal scroll fight each other).
- Wide tables: wrap in `.h-scroll-x` (utility class in `mrp/styles.css`) with `min-width: 680–780px` on the table itself.
- Don't let the **page** scroll horizontally. Only the table container.

### Cards / kanban columns
- Pipeline cards: never narrower than 240 px. 5 → 2 → 1 cols at the breakpoints.
- Cards never reflow internally — they keep their fixed inner layout; the grid changes.

### Modals
- Tablet: `width: calc(100vw - 24px)`, `max-height: 94vh`, top 3vh.
- Phone: full-screen — no transform offset, no rounded edges.
- Body scrolls internally; the page does not scroll behind.

### Forms
- Two-column `frow` (label · value) collapses to one column at tablet. Labels become headers.
- Inputs full-width below the label at all collapsed states.
- Range sliders + numeric input: at phone, **drop the slider**, keep the numeric value editable.

### Drawers
- Side drawers (Std Costs detail, Pipeline drawer, Notif drawer):
  - Desktop: split layout (page shrinks or content shares space).
  - Tablet: overlay with backdrop, **max-width 480–560 px**.
  - Phone: full-width overlay (`100 vw`).

### Phase rail (14-stop)
- Desktop: two horizontal tracks separated by a vertical divider.
- Tablet/phone: tracks stack vertically. Steps inside each track get a horizontal scroll container with `grid-auto-columns: minmax(80px, 1fr)`.

---

## 5. Typography & density

| Element              | Desktop | Tablet | Phone |
|----------------------|---------|--------|-------|
| Page H1 (`.q-modhead h1`, etc.) | 38 px   | 30 px  | 24 px |
| Section H2           | 26 px   | 22 px  | 20 px |
| Body                 | 12.5 – 13 px | 12.5 px | 12 px |
| KPI big numbers      | 24–28 px | 18–22 px | 16–18 px |
| Mono `kicker` / labels | 9–10 px | 9 px | 8.5 px |

- **Minimum readable size on phone: 12 px** for body, 8.5 px for kickers/meta.
- **Letter-spacing**: tighten kickers from `0.22em` → `0.16em` on phone to avoid over-spread on narrow lines.
- **Line-height**: 1.4–1.5 for body. Never tighter than 1.3 on phone.

---

## 6. Files that own responsive code

This is the audit list. Touch these files when changing the responsive layer:

```
mrp/
├── chrome.jsx           ← Sidebar drawer, hamburger, topbar slot rules
├── styles.css           ← Shared chrome: opstrip, projcrumb, projctx,
│                          phaserail, workspace inner-sidebar, modhead
├── quote.css            ← Quote module (Pipeline + Workshop)
├── stdcost.css          ← Standard Costs + FP Anatomy + Quote Builder
├── intake.css           ← Intake / Tech-Transfer
└── prequote.css         ← Pre-Quote / Go-No-Go

MRP Workbench.html       ← Inline: dashboard hero, awaiting-you rows, pin grid
MRP Sample Pour.html     ← Inline: rd-stepper, hero stats, decision footer,
                            modals, scenario picker
MRP BOM Dossier.html     ← Inline: dossier-id, dossier-toc + flatten inline grids
MRP Assembly Dossier.html ← Inline: same pattern, with ad-* sections
```

**Why inline?** Sample Pour, BOM and Assembly Dossier use a lot of inline `style` objects from JSX. Their responsive rules use attribute selectors (e.g. `[style*="repeat(6"]`) to override at narrow widths. Prefer migrating these to CSS classes when you next touch them.

---

## 7. Conventions for new screens

1. **Start with `<MrpShell>` or `installMrpChrome()`**. Do not roll your own chrome.
2. **Author the desktop layout first.** Then add two `@media` blocks at the bottom of your module's CSS file:
    ```css
    @media (max-width: 1024px) { /* tablet */ }
    @media (max-width: 640px)  { /* phone */ }
    ```
3. **Use CSS Grid with `gap`**, not floats or margins, for any group of sibling tiles. Collapsing columns then becomes one line.
4. **Never set fixed widths** on content containers. Use `min-width: 0` on grid children to let them shrink. Use `max-width` only on text columns (for readability) and on modals.
5. **No horizontal page scroll, ever.** Use `min-width` on tables inside an `overflow-x: auto` wrapper.
6. **Hide controls, not data.** If a row of action buttons doesn't fit, hide the secondary actions behind a `…` menu rather than truncating the data row.
7. **Test every screen at 390 / 768 / 1440 px** before merging. Chrome DevTools device toolbar is fine.

---

## 8. QA checklist (per PR)

Before merging any MRP screen change, verify:

- [ ] Loads cleanly at 390 px width (phone) — no horizontal scroll on `<body>`.
- [ ] Loads cleanly at 768 px width (tablet) — hamburger visible, sidebar drawer opens and closes.
- [ ] Loads cleanly at 1440 px width (desktop) — full chrome present, multi-column grids fill width.
- [ ] All interactive controls hit ≥ 44 × 44 px on touch widths.
- [ ] No element with `position: sticky` clips below the topbar.
- [ ] All modals reach their content while the page is scrolled.
- [ ] Tab-key focus order is the same on every viewport.
- [ ] No console errors.

---

## 9. Out of scope / future work

- **Print stylesheets** exist on Dossier pages only. We have not audited print at responsive widths — assume desktop-width for now.
- **Landscape phone (e.g. 740 × 360)** is treated as tablet by the breakpoints. If we get user complaints, add a `(max-width: 900px) and (max-height: 500px)` override on the global sidebar to make it auto-dismiss after a route change.
- **Container queries** (`@container`) would let cards and panels adapt without page-level breakpoints. Consider after Baseline support is universal.
- **Dark mode** has the same responsive rules; no separate tier-by-tier work needed.

---

## Related documents

- `decisions/ADR-001-brand-vocabulary.md` — brand token system
- `decisions/ADR-002-surface-architecture.md` — Portal vs MRP surface model
- `MRP-REFERENCE.md` — module-by-module reference
- `MRP-MIGRATION.md` — migration plan to production code

— end —
