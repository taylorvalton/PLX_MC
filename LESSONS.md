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

### 2026-06-10 (ET) — Reported files missing without fetching first

- **What happened:** The founding session reported `starter-kit/` absent and
  asked the operator how to obtain it; it had been pushed after the clone and
  a plain `git pull` delivered it.
- **Root cause:** Concluded repo state from the working tree without checking
  the remote first.
- **Rule going forward:** Before reporting anything missing from the repo, run
  `git fetch` and inspect `origin/*` branches; ask only after the remote is
  ruled out.

### 2026-06-10 (ET) — Box credentials live in AWS Secrets Manager, not local config

- **What happened:** A machine-wide hunt for Microsoft Graph credentials
  (CLIs, PS modules, credential manager, env vars) found nothing; the intended
  path was the "AWS Secrets Runtime" provisioning doc — load `prod/ec2-secrets`
  (us-east-1) into the session via `~/load-secrets.ps1`.
- **Root cause:** Provisioning convention was documented in SharePoint, not on
  the box.
- **Rule going forward:** On this project, secrets always come from AWS
  Secrets Manager `prod/ec2-secrets` through the loader; check there first.
  Codified in `TOOLS.md` (Secrets Source of Truth).

### 2026-06-10 (ET) — Windows default encoding corrupted generated surfaces

- **What happened:** The governance generator wrote surfaces with the locale
  encoding (cp1252) on Windows; UTF-8 readers (and Linux CI) would fail on the
  em-dashes.
- **Root cause:** `Path.read_text()`/`write_text()` without an explicit
  encoding.
- **Rule going forward:** All repo tooling I/O pins `encoding="utf-8"` (and
  `newline="\n"` on writes). Fixed in
  `scripts/generate-governance-surfaces.py`.
