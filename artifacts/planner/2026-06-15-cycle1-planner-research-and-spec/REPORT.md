# Cycle 1 — Planner Research + Implementation Spec

Evidence bundle for the Cycle-1 effort to bring MS Planner features with
Linear-grade UX to PLX Mission Control's task/bucket surface.

## Contents
- RESEARCH.md — internal codebase map + MS Planner / Linear external research,
  with a gap matrix and the recommended module set.
- SPEC.md — adversarially hardened Cycle-1 implementation spec (mutation spine,
  per-field persistence tiers, modules A/B/C/D1, test plan, PR breakdown).

## Outcome
- Foundations already present (board/list/timeline, Postgres persistence,
  command palette, --p-* tokens); the real gaps are interaction depth.
- Chosen architecture: one generic patchTaskFields mutation spine; unified
  GroupBy; native HTML5 drag-and-drop; zero new runtime deps; no DB migration.
- PR plan: PR-0 mutation-spine + assignee-mirror honesty -> A group-by + filter
  bar -> B drag-to-mutate -> C inline editing -> D1 My Tasks.

Produced by the autonomous research -> architect -> harden workflow cycle.
