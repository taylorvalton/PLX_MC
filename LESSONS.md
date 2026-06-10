# LESSONS.md

<!-- The institutional memory file. Every correction, incident, or surprising
     failure becomes a dated entry here. Agents read this at session start and
     must not repeat documented mistakes. Recurring lessons get promoted into
     .cursor/rules/ so they are enforced, not just remembered. -->

## How to write an entry

- Date it (YYYY-MM-DD, with timezone if relevant).
- State what went wrong in one line.
- State the root cause in one line.
- State the rule going forward — actionable, checkable, present tense.
- If the lesson recurs 3+ times, promote it to a rule in `.cursor/rules/`
  and/or a gate in `scripts/preflight.sh`, then note the promotion here.

## Lessons

### 2026-06-10 — Example entry (replace with your first real lesson)

- **What happened:** A push went to CI without running tests locally and
  burned five round-trips on a lint failure.
- **Root cause:** No single local command mirrored CI.
- **Rule going forward:** `./scripts/preflight.sh --mode pre-push` before
  every push. Promoted to `.cursor/rules/local-ci-before-push.mdc`.
