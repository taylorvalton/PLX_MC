# P5 Notes

## Scope

Implemented PLX Skills Directory Phase 4 P5 publish flow on branch
`proj/plx-skills-p4-p5-publish`.

## Behavior

- Approval-time publish hook lives in `src/lib/skills-directory/publish.ts`.
- `PATCH /api/skills-directory/submissions/[id]` calls the hook when
  `status: "approved"`.
- GitHub writes are default-off unless
  `SKILLS_SUBMIT_GITHUB_WRITE_ENABLED=1` or `true`.
- When disabled, approval returns `publish.instructionsPath:
  "publish-instructions.md"` plus generated markdown instructions in
  `publish.content`.
- When enabled, the hook fetches submitted `SKILL.md` from `contentUrl`, creates
  `submit/<id>-<ts>` in `taylorvalton/plx-cursor-skills`, writes
  `skills/<id>/SKILL.md`, promotes/adds the manifest entry as `published`, and
  opens a PR.

## Verification

- Baseline after dependency bootstrap: `npm test -- skills-directory` passed
  with 17 tests.
- After P5 implementation: `npm test -- skills-directory` passed with 20 tests.

## Notes

- No files under `src/components/**` were edited.
- The write token is intentionally separate from the read-only GitHub App token;
  see `docs/modules/github-app/README.md` and
  `docs/runbooks/github-app-provisioning.md`.
