# Repo Hygiene Spec

## Purpose

Define the mandatory structure, naming, retention, and archival rules for this
repository so that all active work remains discoverable, canonical, and low-noise.

## Document Classes

Every file must belong to exactly one class:

| Class | Description | Allowed Locations |
|---|---|---|
| **Canonical** | Long-lived, authoritative docs that define behavior or policy | Repo root (small approved set), `docs/` |
| **Operational** | Active runbooks, PRDs, architecture docs, implementation notes | `docs/`, `docs/runbooks/`, `docs/architecture/` |
| **Evidence** | Generated or semi-generated outputs from QA, research, or incidents | `artifacts/<domain>/<yyyy-mm-dd>-<slug>/` |
| **Archived** | Inactive but retained documents or outputs | `archive/<yyyy-mm-dd>-<reason>/` |

Files that do not fit any class should not exist in the repo.

## Root Directory Policy

The approved root file list lives in `config/governance-contract.yaml`
(`repo_hygiene.approved_root_files`) and is enforced by
`scripts/check-repo-hygiene.py`.

Forbidden at root: one-off QA reports, escalation memos, completion summaries,
"final" reports, dated deliverables, generated screenshots, ad hoc verification
notes — and any file matching the forbidden patterns (`FINAL_*`, `QA_*`,
`*_SUMMARY.md`, `*_REPORT.md`, `*_ASSESSMENT.md`, `*_COMPLETION*.md`,
`*_CHECKLIST.md`, `*_SPECIFICATION.md`, date-stamped status docs).

## Artifact Placement Rules

All evidence lands in a **dated bundle folder**:

```
artifacts/<domain>/<yyyy-mm-dd>-<slug>/
```

Examples: `artifacts/qa/2026-06-10-release-health/`,
`artifacts/incidents/2026-06-10-ingest-outage/`.

Required files per bundle:

- `REPORT.md` or `VERDICT.md` — one executive readout
- `index.md` or `artifacts.json` — artifact inventory

All supporting material (screenshots, logs, JSON, raw markdown) lives inside
the same bundle folder. Prohibited: loose files directly under `artifacts/`,
multiple layered summaries for one effort, status-adjective filenames.

## Archive Rules

Archive when a document is superseded, historical only, or past its retention
window. Path format: `archive/<yyyy-mm-dd>-<reason>/`. Each archive bundle
must contain a `README.md` with: reason for archive, original active location,
restore policy, and actor who performed the archive.

## Naming Rules

- Canonical docs: stable descriptive names (`API_STANDARDS.md`, `USER_GUIDE.md`).
- Evidence bundles: `<yyyy-mm-dd>-<slug>` with lowercase kebab-case slugs.
- No status adjectives in filenames: `FINAL`, `COMPLETE`, `LATEST`, `NEW`, `FIXED`.
- No case-variant duplicates.

## Retention Policy

| Material | Retention | Action after expiry |
|---|---|---|
| Canonical docs | Indefinite | N/A |
| Active evidence bundles | 30 days default, 90 days if incident open | Move to `archive/` |
| Archived material | Indefinite (low-priority prune) | Delete when no longer traceable value |
| Generated runtime caches | Not tracked in git | Add to `.gitignore` |

## Canonical Source Policy

Every piece of documentation and configuration has exactly one canonical
location. Secondary copies are only permitted as **generated consumers** —
written by automation, never edited directly, never co-equal sources.

| Material | Canonical Location |
|---|---|
| Architecture and policy docs | `docs/` |
| Module contracts | `docs/modules/` |
| Runtime config | `config/` |
| Runbooks | `docs/runbooks/` |

## Module Documentation Policy

Every module must have a contract README at `docs/modules/<module>/README.md`
following the standard format: What, Why, How, Dependencies, Owner, Key Files.
A module without a contract README is a violation. A module whose code changed
significantly while its contract went untouched 60+ days is a major finding.

## Enforcement

| Gate | Command | Blocks? |
|---|---|---|
| Pre-commit / pre-push | `scripts/preflight.sh` (runs `check-repo-hygiene.py`) | Yes |
| CI | `.github/workflows/ci.yml` (same script) | Yes |

## Acceptance Criteria

The repo is compliant when:
- Root contains only approved files and directories
- Every report belongs to a dated bundle or canonical docs path
- No forbidden root file patterns exist
- No loose files exist under `artifacts/`
- Archives are dated and documented
- Every active module has a contract README in `docs/modules/`
