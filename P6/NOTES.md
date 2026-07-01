# P6 Notes

## Scope

Documentation and config deprecation for PLX Skills Directory Phase 4 P6 on branch
`proj/plx-skills-p4-p6-docs` (based on `proj/plx-skills-p4-p1-manifest` @ P5 publish).

## Changes

- `config/company-skills-allowlist.json` — deprecated redirect: empty `skills[]`,
  `redirectTo: config/skills-catalog.json`, deprecation note in `description`.
  Pointer fields (`sourceRepo`, pin, `packageId`) retained for legacy tooling.
- `config/skills-catalog.json` — unchanged canonical v3 pointer (already authoritative).
- Bootstrap scripts — verified default `ALLOWLIST` → `config/skills-catalog.json`
  (`scripts/bootstrap-company-skills.sh` lines 22–25; ps1 delegates to bash).
- Docs updated: `SKILLS-DIRECTORY-ARCHITECTURE.md` (Phase 4 shipped),
  `SKILLS-SOP.md` (§6 sync cadence, §8 MC/MCP submit primary, §12 roadmap),
  `docs/modules/skills-directory/README.md` (MCP, install, sync, submit, Postgres),
  `docs/COLLABORATOR-SOP.md` §9.3 (no longer “until UI ships”).
- Test: `skills-directory.test.ts` — allowlist case expects empty deprecated redirect.

## Verification

- `bash scripts/preflight.sh --mode pre-push` — **failed on Windows** with
  `set: pipefail: invalid option name` (CRLF / Git Bash line-ending issue on
  `scripts/preflight.sh`).
- Fallback (documented acceptance path):
  - `npm ci` (fresh worktree)
  - `npm test` — 686 passed
  - `npm run typecheck` — clean

## Notes

- No merge to main (per task).
- Forbidden path `src/lib/github-app/token.ts` not touched.
- Operator seed script `scripts/seed-plx-cursor-skills.py` still accepts
  `--allowlist` defaulting to legacy filename; use `--allowlist config/skills-catalog.json`
  or manifest package ids for new seeds.
