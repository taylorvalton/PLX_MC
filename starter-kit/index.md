# Bundle Index — First-Class Repo Starter Kit

Created: 2026-06-10 (ET) · Owner: operator (Vince) · Domain: governance

| Artifact | Purpose |
|---|---|
| `REPORT.md` | Blueprint: mechanisms, skeleton, bootstrap order, kickoff prompt for the new-repo agent |
| `seed/config/governance-contract.yaml` | Single source of truth for all governance rules |
| `seed/scripts/generate-governance-surfaces.py` | Renders contract into AGENTS.md/CLAUDE.md blocks + governance.mdc; `--check` is the CI drift gate |
| `seed/scripts/check-repo-hygiene.py` | Enforces root policy, dated artifact bundles, archive metadata |
| `seed/scripts/preflight.sh` | The one gate command (pre-commit / pre-push / ci modes) |
| `seed/.pre-commit-config.yaml` | Local hook wiring for the preflight gate |
| `seed/.github/workflows/ci.yml` | CI re-runs the same preflight script |
| `seed/.cursor/rules/governance.mdc` | Generated governance rule (do not hand-edit) |
| `seed/.cursor/rules/surgical-changes.mdc` | Minimal-diff editing contract |
| `seed/.cursor/rules/repo-hygiene.mdc` | Edit-time hygiene enforcement |
| `seed/.cursor/rules/local-ci-before-push.mdc` | Local-CI-first discipline |
| `seed/SOUL.md` | Mission + non-negotiables template |
| `seed/AGENTS.md` | Canonical architecture template (carries generated block) |
| `seed/CLAUDE.md` | Per-runtime context template (carries generated block) |
| `seed/TOOLS.md` | Tool access + guardrails template |
| `seed/LESSONS.md` | Lessons loop template with entry format |
| `seed/docs/REPO_HYGIENE_SPEC.md` | Canonical hygiene policy |
| `seed/docs/modules/README.md` | Module contract index template |
| `seed/docs/modules/_template/README.md` | Module contract template |

Usage: copy `seed/` contents + `REPORT.md` into the new repository, then follow
the kickoff prompt in `REPORT.md`. Retention: 30 days (standard bundle policy).
