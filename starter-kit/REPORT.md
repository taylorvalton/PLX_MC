# First-Class Repo Starter Kit

Distilled: Jun 10, 2026 (ET) · Source: agentic-swarm repo · Bundle: `artifacts/governance/2026-06-10-first-class-repo-starter-kit/`

## What this is

A portable extraction of the mechanisms that make the agentic-swarm repo
first-class, packaged so an agent can bootstrap a new repository with the same
quality bar from day one. The `seed/` folder contains copy-ready, genericized
files — every project-specific detail (VMC theme tokens, EC2 topology, trading
crons, SharePoint sync) has been stripped; every transferable mechanism has
been kept and wired to work together out of the box.

The seed was smoke-tested before delivery: the governance generator writes all
surfaces, the drift gate exits 1 when a surface is hand-edited, the hygiene
gate blocks forbidden files, and the preflight wrapper runs end-to-end clean.

> Retention note: this bundle lives under `artifacts/` and is subject to the
> 30-day retention policy. Copy `seed/` + this report into the new project
> promptly.

## How to use it

1. Copy `seed/` contents (including dotfiles: `.cursor/`, `.github/`,
   `.pre-commit-config.yaml`) into the new repo root, alongside this REPORT.
2. Give your agent the kickoff prompt below.
3. Review its first PR against the Bootstrap Order checklist.

### Kickoff prompt for the new-repo agent

```text
You are bootstrapping a new repository from a governance starter kit distilled
from a mature agentic monorepo. The kit is already copied into the repo root;
REPORT.md explains every mechanism. Do the following, in order:

1. Read REPORT.md fully, then SOUL.md, AGENTS.md, and docs/REPO_HYGIENE_SPEC.md.
2. Fill every <placeholder> in SOUL.md, AGENTS.md, and TOOLS.md for this
   project: <ONE-PARAGRAPH PROJECT DESCRIPTION HERE>.
3. Edit config/governance-contract.yaml: set a real owner; prune sections that
   do not apply (e.g. database if there is no DB, typescript if Python-only);
   adjust code_standards commands to this stack: <STACK HERE>.
4. Run `python scripts/generate-governance-surfaces.py` to regenerate all
   governance surfaces from the contract. Never hand-edit generated blocks.
5. Wire the stack into scripts/preflight.sh and .github/workflows/ci.yml
   (TODO markers show where). Add pyyaml, ruff, pytest, pre-commit to dev deps.
6. Install hooks: pre-commit install --hook-type pre-commit --hook-type pre-push.
7. Create a tests/test_canary.py that imports every source module.
8. Write the first module contract(s) under docs/modules/<module>/README.md
   using docs/modules/_template/README.md, and fill the index table in
   docs/modules/README.md and the ownership table in AGENTS.md.
9. Verify with evidence: ./scripts/preflight.sh --mode pre-push passes
   (show exit-0 output); deliberately create FINAL_X_SUMMARY.md at root and
   confirm the hygiene gate blocks it; hand-edit one generated governance
   block and confirm the drift gate blocks it; revert both.

Non-negotiables: every gate must actually run and fail when it should — show
exit-code evidence, never assert without proof. Follow the seven pillars in
.cursor/rules/governance.mdc for all work.
```

## The first-class mechanisms

### 1. Governance-as-code with generated surfaces and a drift gate

The single most valuable pattern in the parent repo. One YAML file —
`config/governance-contract.yaml` — is the only authoritative statement of
pillars, behavioral rules, hygiene policy, code standards, and safety rules.
A generator renders it into every surface agents actually read (`AGENTS.md`
and `CLAUDE.md` marker blocks, `.cursor/rules/governance.mdc`), and a CI gate
fails the build if any surface drifts from the contract. Rules can never
quietly fork across files: edit the contract, run the generator, done.

The seed merges the parent's generator and its separate alignment checker into
one script with a `--check` flag.

### 2. Doctrine pillars + a 12-point behavioral contract

Seven pillars (Mission First, Simplify Relentlessly, Reuse Before Create,
Truth Before Action, Evidence Over Assertion, Prune Ruthlessly, Ownership and
Precision) plus twelve concrete behavioral rules for agents. These transfer
verbatim — they are stack-agnostic and battle-tested. Pillar 7 is the quiet
star: every rule and config value must have an owner, rationale, and
enforcement path. It is why the parent repo's rules are scripts, not vibes.

### 3. One gate command, three enforcement surfaces

`scripts/preflight.sh --mode pre-commit|pre-push|ci` is the only definition of
"passing." Local git hooks run it, agents are instructed to run it, and CI
re-runs the exact same script. There is no separate "CI config" to drift from
local checks. The parent repo learned this from a documented incident (8+ CI
round-trips debugging what 2 minutes of local checks would have caught) and
now enforces it at hooks, agent rules, and CI policy simultaneously.

### 4. Repo hygiene as executable policy

Not a style guide — a linter. `docs/REPO_HYGIENE_SPEC.md` defines four
document classes (Canonical / Operational / Evidence / Archived), an approved
root-file list, forbidden filename patterns (`FINAL_*`, `*_SUMMARY.md`, ...),
dated evidence bundles (`artifacts/<domain>/<yyyy-mm-dd>-<slug>/` with a
required `REPORT.md` + `index.md`), archive discipline with mandatory
`README.md`, and retention windows. `scripts/check-repo-hygiene.py` enforces
all of it with exit codes. This single mechanism is what keeps a heavily
agent-trafficked repo from drowning in `FINAL_REPORT_v2_ACTUALLY_DONE.md`.

### 5. Root canon docs with strict separation of concerns

- `SOUL.md` — mission + non-negotiables, one page, rarely changes
- `AGENTS.md` — canonical architecture, module ownership, runtime policy
- `TOOLS.md` — tool access, scope, guardrails, secrets source of truth
- `LESSONS.md` — dated operational learnings
- `CLAUDE.md` (+ `CODEX.md`, `GROK.md`, ... as adopted) — thin per-runtime
  pointers that carry the generated governance block

Every agent runtime gets the same doctrine because the generator injects it
into each file's marker block. Adding a new agent runtime = add one thin file
and register it in the contract's `surfaces.marker_files`.

### 6. Module contracts with owners

Every module gets `docs/modules/<module>/README.md` with What / Why / How /
Dependencies / Owner / Criticality, indexed in `docs/modules/README.md` and
mirrored in the AGENTS.md ownership table. This is the backbone of Pillar 3
(Reuse Before Create): agents search module contracts before writing anything
new. The parent repo scales this to 37 modules with a generated manifest and
boundary-checking scripts — start with the template and index, add the
automation when module count grows past ~10.

### 7. The lessons loop

Corrections and incidents become dated `LESSONS.md` entries with a required
shape: what happened, root cause, rule going forward. Lessons that recur get
promoted into `.cursor/rules/` (enforced guidance) or `preflight.sh` (enforced
gates). The parent repo automates extraction and promotion with LLM pipelines;
the seed ships the manual loop, which is the part that matters. Rules in the
parent repo cite the incident that created them (`incident: 2026-04-08`) —
keep that habit; it makes rules credible and prunable.

### 8. Editor rules architecture

`.cursor/rules/*.mdc` files are small, single-concern, and split between
always-on behavioral rules (`surgical-changes`, `repo-hygiene`,
`local-ci-before-push`, generated `governance`) and glob-scoped contextual
rules (the parent scopes API standards to `app/api/**/route.ts`). The seed
ships the four universal ones. Write new rules the same way: one concern,
actionable language, enforcement path named.

### 9. Safety rails as named, checkable rules

The transferable subset is in the contract's `database`, `safety`, and
`external_integrations` sections: no destructive SQL outside migrations,
parameterized queries only, idempotent migration inserts, serialized migration
prefixes, secrets via one accessor from a secrets manager, and — notably — the
integration declaration checklist: every new external provider/tool declares
owner, scope, auth source, default-off state, kill switch, health check,
fallback, and audit boundary *before merge*.

### 10. Evidence over assertion as a working style

Generated outputs go in dated artifact bundles, completion claims require
exit-0 command output, and "never claim deployed/tested without evidence" is
codified in the pillars, the behavioral contract, and the testing rules
(every enforcement script must have a test verifying its exit-code behavior).
This bundle itself follows the convention.

## Target repo skeleton

```
new-repo/
├── README.md
├── SOUL.md                      # mission + non-negotiables
├── AGENTS.md                    # canonical architecture (governance block generated)
├── TOOLS.md                     # tool access + guardrails
├── LESSONS.md                   # dated operational learnings
├── CLAUDE.md                    # per-runtime context (governance block generated)
├── .pre-commit-config.yaml
├── .cursor/rules/
│   ├── governance.mdc           # GENERATED — never hand-edit
│   ├── surgical-changes.mdc
│   ├── repo-hygiene.mdc
│   └── local-ci-before-push.mdc
├── .github/workflows/ci.yml     # re-runs preflight.sh
├── config/
│   └── governance-contract.yaml # SINGLE SOURCE OF TRUTH
├── scripts/
│   ├── preflight.sh             # the one gate command
│   ├── generate-governance-surfaces.py
│   └── check-repo-hygiene.py
├── docs/
│   ├── REPO_HYGIENE_SPEC.md
│   ├── runbooks/
│   └── modules/
│       ├── README.md            # module index
│       └── _template/README.md  # contract template
├── artifacts/                   # dated evidence bundles only
├── archive/                     # dated, documented archives only
├── src/  tests/                 # per stack
└── tests/test_canary.py         # imports every module
```

## Bootstrap order

**Day 0 — identity and law.** Fill `SOUL.md` (mission, non-negotiables).
Customize the contract YAML, run the generator, commit. The repo now has a
constitution before it has code.

**Day 0 — gates.** Wire `preflight.sh` to the stack, install pre-commit hooks,
land `ci.yml`. Verify each gate fails when it should (drift, hygiene, lint)
before trusting it. A gate that has never failed is unproven.

**Week 1 — structure.** First module contracts as real modules appear; canary
test; `TOOLS.md` filled as the first integrations land (each with the
declaration checklist).

**Ongoing — the loop.** Every correction → `LESSONS.md` entry. Every recurring
lesson → rule or gate. Every report → dated artifact bundle. Every new agent
runtime → thin marker file registered in the contract.

**Graduation path (adopt as the repo grows, all proven in the parent repo):**
module manifest JSON + boundary/validation scripts (>~10 modules), change-impact
analysis mapping diffs to module blast radius, shim-expiry gates for
refactor compatibility wrappers, parity gates for any value duplicated across
languages, automated lessons extraction/promotion pipelines, nightly hygiene
audits with a scored health report, and an automated cleanup cron (dry-run by
default, `--apply` to mutate).

## Adaptation guide

| Situation | What to change |
|---|---|
| Python-only | Delete `typescript` from `code_standards`; remove Node blocks from `preflight.sh` and `ci.yml` |
| Node-only | Delete `python` from `code_standards`; keep pyyaml+python for the governance/hygiene scripts (or port them — they're ~150 lines each) |
| No database | Delete the `database` section from the contract; regenerate |
| More agent runtimes | Add `CODEX.md`/`GROK.md`/`GEMINI.md` clones of `CLAUDE.md`; register in `surfaces.marker_files`; regenerate |
| UI project | Recreate the parent's design-token pattern: tokens in one CSS file as the source of truth, a soft-gate script that flags hardcoded colors, light+dark QA rule |
| Monorepo | Keep one contract at root; point `code_standards` commands at each package |

## Deliberately left out (and why)

| Parent-repo asset | Why excluded | Reusable pattern it embodies |
|---|---|---|
| VMC theme tokens, UI playbook | Product-specific palette | Design tokens + soft gate (see Adaptation) |
| EC2/systemd deploy topology, deploy workflows | Infra-specific | Deploy rules as contract `deployment` section once infra exists |
| TRADINGBOX crons, trading medallion schemas | Domain-specific | Medallion tiering + append-only bronze, if you build data pipelines |
| SharePoint/M365 sync rules | Integration-specific | The external-integration declaration checklist (kept in seed) |
| Multi-runtime Hermes flags, COS routing | Architecture-specific | Feature-flag-per-capability with master kill switch |
| Auto-lessons LLM pipelines | Needs dispatch infra | Manual lessons loop (kept in seed) |
| 25+ specialized check scripts | Each guards a parent-repo invariant | Add a check script per *your* invariant as incidents teach you |

## Source map

| Seed file | Derived from (parent repo) |
|---|---|
| `seed/config/governance-contract.yaml` | `config/governance-contract.yaml` |
| `seed/scripts/generate-governance-surfaces.py` | `scripts/generate-governance-surfaces.py` + `scripts/check-governance-alignment.py` (merged as `--check`) |
| `seed/scripts/check-repo-hygiene.py` | `scripts/check-repo-hygiene.py` + bundle checks from `scripts/check-artifact-retention.py` |
| `seed/scripts/preflight.sh` | `scripts/wterm-preflight.sh` + `scripts/ci-local.sh` (merged) |
| `seed/.pre-commit-config.yaml` | `.pre-commit-config.yaml` |
| `seed/.github/workflows/ci.yml` | `.github/workflows/test.yml` |
| `seed/.cursor/rules/*.mdc` | `.cursor/rules/` (governance.mdc generated; others genericized) |
| `seed/SOUL.md`, `AGENTS.md`, `TOOLS.md`, `LESSONS.md`, `CLAUDE.md` | Root canon docs |
| `seed/docs/REPO_HYGIENE_SPEC.md` | `docs/REPO_HYGIENE_SPEC.md` |
| `seed/docs/modules/` | `docs/modules/` contract pattern |

## Verification evidence

Run in this bundle's `seed/` on 2026-06-10 (ET):

- `generate-governance-surfaces.py` → wrote `AGENTS.md`, `CLAUDE.md`,
  `.cursor/rules/governance.mdc`; `--check` then exited 0.
- Hand-mutated a pillar in `AGENTS.md` → `--check` exited 1 naming the drifted
  file; regenerating restored alignment.
- Created `FINAL_TEST_SUMMARY.md` at seed root → hygiene gate exited 1 with
  the violation named; clean tree exits 0.
- `preflight.sh --mode pre-commit` → ran policy gates, loudly skipped absent
  stacks, exited 0.
