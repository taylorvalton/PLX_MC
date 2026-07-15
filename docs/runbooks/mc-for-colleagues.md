# Mission Control for colleagues

**Audience:** Petra humans getting productive on MC without agent babysitting  
**Owner:** Vince · **Effective:** 2026-07-15  
**Click path:** https://mc.plxcustomer.io/welcome

This is the canonical prose. Prefer the `/welcome` page for day-one setup.

---

## Three clicks

1. **Open Mission Control** — https://mc.plxcustomer.io (Entra sign-in).
2. **Connect Cursor** — register team HTTP MCP at [cursor.com/agents](https://cursor.com/agents):
   - URL: `https://mc.plxcustomer.io/api/cursor/mcp`
   - Headers: `x-api-key` (from team Cursor MCP / AWS Secrets Manager), `x-mc-operator-email` (your Petra email), `x-mc-repo` (e.g. `petralabx/PLX_MC`), `x-mc-runtime: cursor`
   - Details: [plx-mc-mcp-team-registration.md](./plx-mc-mcp-team-registration.md)
3. **Install company skills** — follow [SKILLS-SOP.md](../SKILLS-SOP.md) (`scripts/bootstrap-company-skills.*`). MCP ≠ skills.

Do **not** download env/secret zip files. Secrets stay in AWS / team Cursor MCP.

---

## When you open a PR

These repos emit a **suggestion** deep link in the Actions job summary (not a candidate dump in GitHub):

| Repo | Mode |
|------|------|
| `petralabx/PLX_MC` | suggestion |
| `petralabx/plx-customer-portal` | suggestion |
| `petralabx/for-and-against` | suggestion |
| `petralabx/skills` | suggestion |

Open the link → review the proposal in Mission Control Routing Inbox.

Still off (by design):

- Confirmation (no auto attach / task create from GitHub)
- Fuzzy auto-link

Agent PRs still need `MC-Checkout: dsp_…` and a human accountable owner. Humans can open PRs without a checkout; agents cannot.

---

## Kill switch

Set repository Actions variable `PLX_MC_ROUTING_METADATA_ENABLED=0` to skip the routing job. Compliance stays enforced. Remove the override (or set `1`) to restore org inheritance.

---

## Deeper reading

- Human SOP: [HUMAN-MC-SOP.md](../HUMAN-MC-SOP.md)
- Collaborator / PR discipline: [COLLABORATOR-SOP.md](../COLLABORATOR-SOP.md)
- Routing rollout: [mc-routing-rollout.md](./mc-routing-rollout.md)
