# Module Contracts

<!-- The index of every module in the system. Each module has exactly one
     contract README defining What, Why, How, Dependencies, Owner. Agents
     consult this index before creating anything new (Pillar 3: Reuse
     Before Create). -->

Every module in the codebase has a contract README at
`docs/modules/<module>/README.md`. Use `_template/README.md` when creating one.

A new module without a contract README is a hygiene violation. When a module's
key files change, update its contract in the same PR.

## Module Index

| Module | Owner | Criticality | Contract |
|---|---|---|---|
| <module> | <owner> | Critical / High / Medium / Low | `docs/modules/<module>/README.md` |
