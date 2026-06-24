---
name: project-orchestrator
description: Turn a project request into an approved spec in one session, then execute it end-to-end as dependency-ordered phases in isolated git worktrees with delegated agents. Use when the user wants a large, multi-file, or multi-step effort planned and built autonomously, says "spec and execute", "run this as a project", "plan and build this", or hands over a feature, migration, or refactor that spans phases. Selects the best available models per role at runtime.
---

# PLX Mission Control — project-orchestrator adapter

This repo carries PLX-specific orchestration scripts under `scripts/`. The full
skill contract (spec schema, phase DAG, model roles, hardener handoff) lives in
`agentic-swarm` at `.cursor/skills/project-orchestrator/SKILL.md`.

## PLX scripts (use these paths in this repo)

```bash
bash .cursor/skills/project-orchestrator/scripts/new-project.sh <slug>
bash .cursor/skills/project-orchestrator/scripts/spec-validate.sh SPEC.md
bash .cursor/skills/project-orchestrator/scripts/scope-check.sh "<owns>" "<forbidden>" <changed-files>
```

Run `./scripts/preflight.sh --mode pre-push` as the integration acceptance gate.
Hand off completed integration to `project-hardener` with evidence under
`.orchestrator/<slug>/`.
