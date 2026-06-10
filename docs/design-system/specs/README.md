# Design Spec Mocks

> Read-only artifact archive. The HTML and JSX files here are **not production source**.
> They are visual specs produced in a Claude.ai design exploration project. Production
> code reads them, lifts structure and values, and rebuilds against `tokens.css` and
> shadcn primitives.

See the parent `REFERENCE.md` for the canonical artifact-by-artifact breakdown of
what's mock, what's real, and what to lift.

---

## Folder map

| Folder | Files | Status | Used for |
|---|---:|---|---|
| `portal/` | 21 | **Active** — these inform the portal rollout; `portal-login.jsx` is the current pilot | Portal spec mocks |
| `homepage/` | 10 | **Reference only** — public homepage scope is deferred (see `tasks/todo.md` §8) | Public marketing site mocks |
| `hyperframes-diagram-boot/` | 4 | Provenance | Standalone diagram-boot animation, included with the design handoff |
| `_handoff-context/` | 1 + 31 in `reference-images/` | Provenance | The Claude.ai meta-instructions and mood-board imagery used to produce the mocks |

---

## Active portal mocks → production screens

This is the mapping from spec artifact to the production screen it informs. When you
port a screen, open the matching mock first.

| Production screen | Primary spec mock | Supporting mocks |
|---|---|---|
| Login (`(auth)/login/page.tsx`) — active pilot | `portal/portal-login.jsx` (`PortalLogin_Instrument`) | `portal-system.jsx`, `ios-frame.jsx` |
| Customer workbench / projects list (`(portal)/projects/page.tsx`) | `portal/portal-workbench.jsx` | `portal-workbench-single-rail.jsx`, `portal-workbench-variants.jsx`, `portal-system.jsx` |
| Project detail (`(portal)/projects/[id]/page.tsx`) | `portal/portal-project-detail.jsx` | `portal-system.jsx`, `portal-phase-indicator.jsx` |
| Sign-off / deed flow (deferred — see `tasks/todo.md` §7) | `portal/portal-signoff.jsx` | `portal-signoff-legal.jsx`, `portal-signoff-responsive.jsx`, `portal-signoff-sections-{1,2,3}.jsx`, `portal-signoff-signblock.jsx`, `portal-signoff-stubs.jsx`, `portal-signoff-styles.jsx` |
| Navigation routing decisions | `portal/portal-navigation-map.jsx` | — |
| Mobile portal frame | `portal/ios-frame.jsx` | `portal-signoff-responsive.jsx` |

### Helper / non-screen artifacts

- `portal/design-canvas.jsx` + `.design-canvas.state.json` — the design exploration's canvas tool; not a portal screen.
- `portal/tweaks-panel.jsx` — the Legal Mode / Sign Method / State toggles used inside the spec mocks (e.g. for sign-off). Used to demonstrate state variants; not for production.

---

## How to view a mock

Each `.jsx` mock is a **single self-contained React component** with embedded Tailwind
classes. They are *not* importable into the portal — they're standalone visual specs.

The recommended way to view them is to open the file in the original Claude.ai design
exploration project. If that's not available, you can read the JSX directly to extract
structure and class names, then rebuild against the production token system.

**Do not** copy the JSX or `<style>` blocks verbatim into production. Per `REFERENCE.md`:

> the artifacts use unscoped selectors and inline numerics that would pollute production.

Always rebuild. Always use `tokens.css` + shadcn primitives + the brand components in
`portal/src/components/brand/` where they already exist. Do not copy mock-only auth
features into production login.

---

## Public homepage mocks (`homepage/`)

These are **staged as reference only**. The v0.1 design system docs explicitly continue
to scope the public marketing site OUT of v0.x:

> Not opinionated about the public marketing site. The homepage at `/` keeps its current
> purple/rose gradient aesthetic. The brand tokens activate only on routes opted in via
> `.brand-plx` / `data-brand="plx"` opt-in.
> — `docs/design-system/README.md`

If/when the public homepage is brought into scope, that decision will be tracked in
`tasks/todo.md` §8 and a separate migration plan will be authored. Until then, treat
these mocks as a future-state preview.

| File | What it is |
|---|---|
| `homepage.jsx` | Main homepage spec |
| `apothecary-homepage.jsx`, `apothecary-mobile.jsx`, `apothecary-sections.jsx`, `apothecary-sections-2.jsx` | Apothecary-styled homepage variant + sections |
| `hero-spec-sheet.html` | Standalone hero-section spec |
| `Petra Lab-X Homepage.html`, `Petra Lab-X Homepage v2.html`, `Petra Lab-X Homepage v3.html` | Three homepage iterations as pure HTML |
| `Petra Lab-X Portal System.html` | Portal-system overview, HTML form |

---

## Provenance (`_handoff-context/`)

| File | Purpose |
|---|---|
| `claude-design-hyperframes.md` | The 47 KB system prompt that Claude.ai uses when producing design artifacts via the HyperFrames workflow. Preserved here so future readers understand the context the JSX mocks were authored in. **Not a portal design spec.** |
| `reference-images/existing_portal-*.png` | Screenshots of the existing PLX portal taken during the design exploration to inform the brand layer. |
| `reference-images/pasted-*.png` | Mood-board imagery, paste-ins from the design exploration. |
| `reference-images/draw-*.png` | A hand-drawn sketch from the design process. |
| `reference-images/logo-*.png` | Earlier logo iterations, including the missing `logo-stacked-cream.png` that was promoted to `assets/logos/`. |
| `reference-images/logo_file-*.pdf` | Source PDF for the brand logos. |
