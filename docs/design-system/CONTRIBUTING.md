# Contributing to the MRP Portal

**Status:** Adopted · 2026-05-14
**Audience:** Engineers building or modifying MRP Suite screens.
**Pair with:** [`RESPONSIVE.md`](./RESPONSIVE.md), [`MRP-REFERENCE.md`](./MRP-REFERENCE.md), [`MRP-MIGRATION.md`](./MRP-MIGRATION.md).

This document defines **how to add or change MRP screens without breaking the responsive system**. If you can answer "yes" to every item in §8 before opening a PR, you've done it right.

---

## 1. Repository shape (today)

```
mrp/
├── chrome.jsx                ← Single source of truth for global chrome
├── styles.css                ← Shared chrome styles (rail, topbar, phase rail, etc.)
├── quote.css                 ← Quote module styles
├── quote-core.jsx, quote-pipeline.jsx, quote-workshop.jsx, quote-signature.jsx
├── stdcost.css               ← Standard Costs styles
├── stdcost-core.jsx, stdcost-tables.jsx, stdcost-drawer.jsx, stdcost-fp.jsx
├── intake.css, intake.jsx, intake-customer.jsx
├── prequote.css, prequote.jsx
├── formulation.jsx
├── assembly.jsx, assembly-dossier.jsx
└── dossier.jsx

MRP <Module>.html             ← One file per module. Loads CDN React + module .jsx
```

Each module HTML follows a fixed recipe — see §3.

---

## 2. The chrome contract

**Do not roll your own chrome.** Every MRP screen wears the same shell. There are two ways to mount it:

### React-mounted pages (preferred)
```jsx
import { MrpShell } from './chrome.jsx';

function MyPage() {
  return (
    <MrpShell active="quote" urgentCount={3}>
      {/* your screen here */}
    </MrpShell>
  );
}
```

`<MrpShell>` provides:
- `<GlobalSidebar>` (with responsive drawer behavior)
- `<Topbar>` (with hamburger at ≤ 1024 px)
- `<NotifDrawer>` (opens from topbar bell)

Props:
- `active` — sidebar key. See `MRP_ROUTES` in `chrome.jsx`. Adding a new module? Add a key there.
- `urgentCount` — number badge on the notif button. Optional.
- `workspace` — workspace switcher label. Default `"Aldosari Studio"`.
- `hideNotif` — hide the notif button + drawer entirely.

### Vanilla-HTML pages (legacy)
```html
<script type="text/babel" src="mrp/chrome.jsx"></script>
<script type="text/babel">
  installMrpChrome({ active: 'sample-pours', urgentCount: 3 });
</script>
```

`installMrpChrome()` restructures `<body>` into `[sidebar][.app(topbar + originalContent)]`. Call it **last**, after your content is in the DOM.

### What the chrome handles for you
- Sidebar slide-out at ≤ 1024 px (hamburger triggers `body.mrp-sb-open`).
- Backdrop tap-to-dismiss.
- Topbar hamburger button (auto-shown ≤ 1024 px).
- Search hide + workspace label collapse on tablet/phone.
- Notif drawer width clamp on phone.
- Escape-key close on notif drawer.

### What you must not do
- Add a `position: fixed` element with `z-index > 50` that would sit over the sidebar drawer (drawer is z=60, backdrop z=59).
- Add your own hamburger or sidebar toggle. Reuse the existing one.
- Set `overflow: hidden` on `<body>`. Drawers depend on the body remaining scrollable.

---

## 3. The module HTML recipe

Every MRP module HTML follows this skeleton:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>PLX MRP — <Module></title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="mrp/styles.css">
  <link rel="stylesheet" href="mrp/<module>.css">   <!-- module-specific -->

  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"
          integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L"
          crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"
          integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm"
          crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
          integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y"
          crossorigin="anonymous"></script>
</head>
<body>
<div id="root"></div>

<script type="text/babel" src="tweaks-panel.jsx"></script>
<script type="text/babel" src="mrp/chrome.jsx"></script>
<!-- module sources -->
<script type="text/babel" src="mrp/<module>-core.jsx"></script>
<script type="text/babel" src="mrp/<module>-<part>.jsx"></script>

<script type="text/babel">
  const { MrpShell, /* module exports */ } = window;
  function Page() {
    return (
      <MrpShell active="<key>">
        {/* … */}
      </MrpShell>
    );
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<Page/>);
</script>
</body>
</html>
```

**Pin versions and integrity hashes exactly as above.** Do not use `react@18` (unpinned) or omit the `integrity` attribute. Babel will load any other JSX next to it.

**Component sharing across `<script type="text/babel">` files:**
Each Babel script gets its own scope. To share components, the last line of every component file must do:
```js
Object.assign(window, { MyComponent, MyOtherThing });
```
Then in the consumer: `const { MyComponent } = window;`.

---

## 4. Adding a new module

1. **Pick a key** and add it to `MRP_ROUTES` in `mrp/chrome.jsx`:
   ```js
   const MRP_ROUTES = {
     // …
     'inventory': 'MRP Inventory.html',
   };
   ```
2. **Add it to a `MRP_NAV_GROUPS` group** (same file). Pick the correct group — Customers, Product Development, R&D, Parts, Procurement, Production, Inventories, Warehouse, or System.
3. **Create the HTML file** following the recipe in §3.
4. **Create a module CSS file** at `mrp/<module>.css`. Author desktop-first.
5. **Append the two responsive `@media` blocks** at the bottom of the CSS:
   ```css
   @media (max-width: 1024px) { /* tablet */ }
   @media (max-width: 640px)  { /* phone */ }
   ```
6. **Create module JSX files.** Split if any single file would exceed ~800 lines. Use `<module>-core.jsx` for data + types, `<module>-<view>.jsx` per major view.
7. **Verify the QA checklist in §8.**

---

## 5. CSS conventions

### Naming
- One namespace prefix per module: `q-` for Quote, `sc-` for Standard Costs, `fp-` for FP Anatomy, `pq-` for Pre-Quote, `sp-` for Sample Pour, etc.
- Never reuse another module's prefix.
- Component-level classes are short and structural (`.q-modhead`, `.q-body`, `.q-index`, not `.quote-module-header-container`).

### Tokens
- All colors, fonts, spacing reference variables from `mrp/styles.css` (`--p-ink`, `--p-accent`, `--mazius`, `--mono`, etc.).
- **No new hex codes.** If you need a new color, add a token in `mrp/styles.css` and reference it. Get sign-off in the PR description.
- Light/dark mode is automatic when you use tokens — never hard-code.

### Layout
- **Use CSS Grid with `gap` for any group of sibling tiles.** Not floats, not bare inline-block + margin. Reflowing across breakpoints is trivial with grid.
- **`min-width: 0` on grid children** so they can shrink. Without it, the smallest column dictates the row width and you get horizontal scroll.
- **Avoid fixed widths on content.** `max-width` is allowed for text columns and modals; nothing else.
- **`overflow: hidden` is a code smell.** It hides bugs. Use `overflow-x: auto` on a *specific* container (e.g. a wide table) and fix the underlying overflow.

### Responsive
- All responsive rules live in `@media` blocks **at the bottom of each module CSS file**, after the desktop rules. Two blocks per file: `1024px` and `640px`. No others without a waiver.
- **Use `flex-wrap` + `gap`** for groups that just need to wrap (chips, action buttons, KPI tiles). It's cheaper than a `@media` block.
- **Tables**: wrap in `overflow-x: auto`, set `min-width` on the `<table>`. Drop sticky `<thead>` at ≤ 1024 px (it fights horizontal scroll).
- **Modals on phone**: full-screen — `top: 0`, `left: 0`, `width: 100vw`, `min-height: 100vh`, no transform.

### Don't
- Don't add new breakpoints. Use `flex-wrap`, `clamp()`, `minmax()` for in-between widths.
- Don't write `!important` unless you're overriding an inline style from a `direct-edit` user. If you're considering it for normal CSS, your selector is wrong.
- Don't query specific device names (`iPad`, `iPhone`). Width-only.

---

## 6. JSX conventions

- **One default export per file.** Plus named exports for sub-components that need to be reachable.
- **Export to `window`** at the end of every component file (see §3). This is how cross-file JSX scope sharing works without ES modules.
- **No inline `style={…}` objects for layout.** Use CSS classes. Inline `style` is OK for:
  - Per-instance dynamic values (a bar width computed from data).
  - One-off positioning where a class would only be used once.
  - The Sample Pour / Dossier files are full of inline styles — that's tech debt to migrate, not a pattern to copy.
- **No `useEffect` for DOM measurement** unless absolutely necessary. Use CSS.
- **Hooks at the top of the component, return at the bottom.** No conditional hooks.

### Tweaks panels
If a screen exposes Tweaks, use `<TweaksPanel>` from `tweaks-panel.jsx`. Default values go in:
```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "viewMode": "pipeline",
  "dark": false
}/*EDITMODE-END*/;
```
The `EDITMODE-BEGIN`/`EDITMODE-END` markers must wrap valid JSON so the design tooling can rewrite them.

---

## 7. Performance budget

- **No bundler today** — every page loads React + Babel from CDN and transpiles JSX in the browser. That's fine for prototyping; **not** fine for production.
- **Migration target:** Vite + React + a real router. See `MRP-MIGRATION.md`.
- **Until then:** keep total JSX per page under ~150 KB uncompressed. Above that, Babel transpile becomes visibly slow on tablets.
- **Images:** PNG/JPG at 2x the displayed size; SVG for icons and brand marks. No image > 200 KB without a reason.

---

## 8. PR checklist

Before requesting review:

### Functionality
- [ ] No console errors at any tier (390 / 768 / 1440 px).
- [ ] All routes wire correctly via `MRP_ROUTES`.
- [ ] Tweaks panel (if present) survives reload.

### Responsive
- [ ] No horizontal scroll on `<body>` at any width 320–1920 px.
- [ ] Hamburger button appears at ≤ 1024 px and opens the sidebar.
- [ ] Sidebar dismisses on backdrop tap, close button, **and** any nav click.
- [ ] All multi-column module grids collapse correctly.
- [ ] Wide tables horizontally scroll inside their wrapper, not the page.
- [ ] All modals reach their content while the page is scrolled.
- [ ] Touch targets ≥ 44 × 44 px on phone.

### Accessibility
- [ ] Tab-key focus order matches visual order, every tier.
- [ ] All buttons have either visible text or `aria-label`.
- [ ] Form inputs have associated `<label>`s.
- [ ] Color is never the only signal (use text + dot + color together).

### Code
- [ ] CSS lives in the module's own file, not in the HTML.
- [ ] No new hex codes; tokens used throughout.
- [ ] No `!important` (or a comment explaining why).
- [ ] No new breakpoints.

---

## 9. Where to ask

- **Design questions** → Vince Alton.
- **Responsive system** → see [`RESPONSIVE.md`](./RESPONSIVE.md).
- **Token system** → see [`decisions/ADR-001-brand-vocabulary.md`](./decisions/ADR-001-brand-vocabulary.md).
- **Surface architecture (Portal vs MRP)** → see [`decisions/ADR-002-surface-architecture.md`](./decisions/ADR-002-surface-architecture.md).
- **Module-by-module reference** → [`MRP-REFERENCE.md`](./MRP-REFERENCE.md).
- **Migration to production** → [`MRP-MIGRATION.md`](./MRP-MIGRATION.md).

— end —
