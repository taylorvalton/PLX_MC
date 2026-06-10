# TOOLS.md

<!-- Canonical reference for tool access, scope, and safety boundaries.
     If an agent can touch it, it is declared here — with its guardrails. -->

## Purpose

Canonical reference for tool access, scope, and safety boundaries.

## Runtime Tool Surface

<List the tools agents may use: file ops, web search, task APIs, integrations.
For each external integration, link to its declaration (owner, scope, auth
source, default state, kill switch, health check, fallback, audit boundary).>

## Access Control

<Auth model: which env flags gate which capabilities, what is enforced in
production, what is dev-only.>

## Secrets Source of Truth

<Where secrets live (secrets manager id), how they are loaded, and the one
shared accessor through which all code reads them. No hardcoded keys, no
scattered env lookups.>

## Tool Ownership

| Tool / Surface | Owner | Notes |
|---|---|---|
| <tool> | <owner> | <guardrails> |

## Guardrails

<Hard limits, e.g. "outbound email is drafts-only", "API binds to localhost",
"destructive operations require explicit operator approval".>
