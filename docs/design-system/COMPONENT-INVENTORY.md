# Component Inventory

> Audit of existing shadcn primitives in the portal vs. brand components needed to build the spec'd screens. Use this to plan the login-first rollout and later Phase 3 expansion in `MIGRATION-PLAN.md`.

As of 2026-05-06, the active pilot is `/login` using `PortalLogin_Instrument`. Do not build the full deed component set for login unless the selected production composition actually needs it.

Three columns of work:

1. **Inherit** — shadcn component used as-is; brand voice arrives via token remap.
2. **Extend** — shadcn component with an added `variant="brand"` (or similar) in its cva definition.
3. **Build** — net-new brand-only component, lives in `portal/src/components/brand/`.

---

## 1. Inherit (no code changes; tokens do the work)

These shadcn primitives appear in the spec'd screens and need **zero** code changes. They consume `--background`, `--card`, `--primary`, `--border`, etc., which the brand layer remaps.

| Primitive | Used in spec for | Notes |
|---|---|---|
| `Card`, `CardHeader`, `CardContent` | Workbench project rows, formula sections | Strip `shadow-sm`; the brand uses hairlines, not shadows. One-line override in the variant or a brand-card wrapper. |
| `Input`, `Textarea`, `Label` | Login, settings, any form | Inherit. Mono labels via wrapping `<Label className="p-meta">`. |
| `Form` (react-hook-form integration) | All forms | Inherit. |
| `Dialog`, `Sheet`, `Popover` | Confirmation modals on sign-off, mobile project drawer | Inherit. Background + border tokens cover it. |
| `DropdownMenu`, `Select`, `Command` | Filter dropdowns on workbench | Inherit. |
| `Table`, `TableHead`, `TableRow` | Formula table desktop | Inherit. Apply `font-mono` + `tabular-nums` on numeric cells. |
| `Tabs` | Project detail (formula / attachments / activity) | Inherit. May want `variant="underline"` if not present. |
| `Separator` | Anywhere | Inherit. Uses `--border` which now resolves to `--p-grid`. |
| `Avatar` | Author bylines on workbench | Inherit. |
| `Skeleton` | Loading states | Inherit. |
| `Sonner` (toast) | Sign success, error toasts | Inherit. |
| `Tooltip`, `HoverCard` | Inline definitions | Inherit. |
| `Progress` | Pilot pour percentage, COA upload | Inherit; restyle track via `--secondary`. |

---

## 2. Extend (add a brand variant in-place)

These shadcn primitives need a brand-flavored variant added to their cva definitions. Per shadcn convention, edit the file in `components/ui/` directly — that's the intended pattern, not a fork.

| Primitive | New variant(s) | Spec reference | Notes |
|---|---|---|---|
| `Button` | `brand`, `brand-ghost`, `brand-destructive` | All sign-off CTAs, login submit | `brand` and `brand-ghost` already exist. Add `brand-destructive` only when a real destructive action needs it. |
| `Badge` | `chassis`, `attest-ok`, `attest-warn`, `attest-info` | Status pills throughout, attestation chips | `chassis` already exists. Add attestation variants only with the sign-off/deed work. |
| `Alert` | `flag-amber`, `flag-info` | Open flags row | 2px left rule + hairline border + mono kicker. Drop the icon slot — flags use a tag instead. |
| `Card` | `folio` | Sign-off deed sections | Adds chassis ticks at the four corners; removes shadow; uses `--p-card` and `--p-grid` borders. May be cleaner as a brand-built `<ChassisFolio>` (see §3) if cva variants stack awkwardly. |

---

## 3. Build (net-new brand components)

These have no shadcn equivalent. They live in `portal/src/components/brand/` and are documented inline.

| Component | Wraps / uses | Spec reference | Production notes |
|---|---|---|---|
| `<BrandBoundary>` | Layout `<div>` | Login/auth route boundaries | Consumed now. Applies `.brand-plx` for route-local token remap without global restyling. |
| `<AuthStatusBanner>` | Layout `<div>` | Login/register/reset/2FA states | Consumed now. `tone="danger"` renders `role="alert"`; non-danger tones render `role="status"`. |
| `<ChassisFolio>` | shadcn `<Card>` + corner ticks | Every major deed section | Props: `as`, `ticks: 'four-corners' \| 'top-only' \| 'none'`, `runningHead?: { left, right }`. Renders the folio borders + running head when provided. |
| `<ChassisTicks position>` | Decorative `<svg>` or pseudo-elements | Reused inside `<ChassisFolio>` and standalone on workbench banner | Pure CSS; no React state. |
| `<WritStamp>` | Layout primitive | Top of deed | Composes mono ID + serif title + mono meta in a 3-row stamp. |
| `<AttestationChip>` | Inline pill | Deed §formula attestations | Props: `glyph` (1–2 char), `label`, `value`, `tone: 'ok' \| 'warn' \| 'info'`. |
| `<OpenFlagRow>` | Hairline-divided row | Deed §7 | Props: `severity: 'amber' \| 'info'`, `tag`, `title`, `meta`, `ackedBy?`. |
| `<Kicker>` | Wrapper around `.p-kicker` text | Section headings throughout | Trivial; mostly exists so spec authors don't hand-roll `<span class="font-mono uppercase tracking-[0.22em] text-[9px]">` everywhere. |
| `<PMark>` | Periodic-table-style 2-line glyph | Login, workbench, marketing moments | Consumed now. Two text rows: top = number/code, bottom = 1–3 char abbreviation, in a square chassis frame. |
| `<RunningHead>` | Folio header strip | Deed top of page | Renders left + right mono strings with the chassis hairline below. Used inside `<ChassisFolio>` or page-level. |
| `<MonoData>` | Span | Numeric values in formula table | Applies `font-mono`, `tabular-nums`, optional `aria-label` for screen readers. |
| `<SignBlock>` | Composite | Bottom of deed | Two states: `embedded` (wraps DocuSign iframe in chassis), `typed-cert` (fallback typed-name + checkbox + sign CTA). |
| `<SlateFrame>` | Aspect-ratio'd container | Pilot pour placeholder, artwork placeholder | Used wherever an asset is pending — film-slate aesthetic with corner crosshair and mono caption row. |

---

## 4. Decisions deferred

Things flagged during the audit that need a call before Phase 3 ships:

- **Card shadow removal globally?** The brand layer uses hairlines; shadows feel wrong. Options: (a) remove shadow from base shadcn `<Card>`; (b) introduce `<Card variant="folio">` and leave default alone. **Recommendation: (b)** — keeps default shadcn behavior intact for any non-portal route still using it.
- **Tab styling.** Default shadcn tabs are pill-style. Brand prefers underline. Probably needs an `underline` variant on `<Tabs>`. Trivial.
- **Login states.** The spec is visually strong but mock-oriented. Production must add loading, invalid-credentials, disabled-account, registered-success, reset-success, success, forced-reset, light, dark, and mobile states before replacement.
- **Empty states.** Not specified in any spec. When a workbench has no projects, keep the empty state route-local under `components/projects/` unless another route consumes it.
- **Projects data hygiene.** `(portal)/projects` must read project references from Prisma `Project.projectNumber`. Do not extend the visual migration while the route still depends on `@/lib/fm-source`, `queryFM`, or `/api/fm/*`.
- **Nav primitive.** The portal currently has a hand-rolled top nav. Spec'd workbench shows a refined version. Either turn that into `<PortalNav>` in `components/brand/` or keep it route-local. **Recommendation: route-local** until reused; net-add to brand only when a second route needs it.
- **Loading states.** Spec doesn't show skeleton patterns. Use shadcn `<Skeleton>` with brand tokens; revisit if it looks wrong.

---

## 5. What we explicitly do NOT build

To keep the brand layer small and disciplined:

- **No brand-specific form fields.** Inputs, selects, checkboxes stay shadcn. Mono labels via wrapping, not via custom field components.
- **No brand-specific table.** AG-Grid handles heavy tables; shadcn `<Table>` handles light ones. Brand tokens cover both.
- **No brand-specific chart library wrapper.** When charts arrive, use Recharts or Tremor with brand tokens injected — don't wrap them as `<BrandChart>`.
- **No icon component.** The brand uses near-zero iconography. When an icon is genuinely needed, use Lucide (already in deps) at small size with `--p-muted` or `--p-ink` color. No icon-button primitive needed.
- **No animation primitives.** The brand is quiet; transitions are short and decisive (`--p-dur` = 180ms). Use `tw-animate-css` or route-local CSS for the rare entrance animation. No global `<FadeIn>` wrappers.

---

## 6. Total surface area

If the full brand component set lands as scoped:

- **0** shadcn primitives forked.
- **4** shadcn primitives extended with brand variants.
- **13** brand components net-new if the full set lands, including the login/auth consumed primitives.
- **~16** files added under `portal/src/components/brand/` (incl. barrel + README).

This is a deliberately small surface. The system's power comes from the **token layer**, not from a sprawling component library. If `components/brand/` grows past ~20 files, that's a smell — something is being built brand-specific that should be inheriting tokens instead. The login pilot should stay even smaller: prefer existing shadcn primitives plus route-local composition unless a primitive is clearly reusable.
