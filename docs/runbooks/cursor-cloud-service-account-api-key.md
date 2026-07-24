# Cursor Cloud — Service Account API key (inline MCP launches)

**Owner:** Vince · **Status:** active · **Related:** TASK-682 / ds-gov-cloud-enforcement  
**Why:** Team HTTP MCP servers (`PLX-MC-Hub` / `PLX-MC-Portal`) are registered but
often **fail to attach** to Cloud Agent tool catalogs (Cursor platform bug). A
**service account API key** lets automation launch Cloud Agents with inline
`mcpServers[]`, bypassing the broken Team MCP attach path for verification and
governed runs.

## Create the key (human — dashboard only)

1. Open [Cursor Dashboard → Settings → API Keys → Service Accounts](https://cursor.com/dashboard/settings)
   (exact nav may say **Cloud Agents → API Keys → Service Accounts**).
2. Create a service account (e.g. name `plx-cloud-mcp`).
3. Generate an API key. Copy it once.
4. Store in AWS Secrets Manager `prod/ec2-secrets` as:
   - `CURSOR_CLOUD_SERVICE_API_KEY` (canonical)
   - optional alias `CURSOR_SERVICE_ACCOUNT_API_KEY`
5. Do **not** commit the key. This Cloud Agent role is **secrets-read only** and
   cannot `PutSecretValue` — an operator with write access must store it.

## Verify the key type

```bash
# Must NOT be the Team Admin spend key (crsr_… Admin). Service/user keys work with:
curl -sS -u "$CURSOR_CLOUD_SERVICE_API_KEY:" \
  https://api.cursor.com/v0/agents | head
```

If you see *“This is a team API key … only works with the Cursor Admin API”*,
you used the wrong key.

## Launch a Cloud Agent with inline PLX-MC MCP

```bash
export CURSOR_CLOUD_SERVICE_API_KEY=…   # from secrets
export PLX_MC_MCP_API_KEY=…             # from prod/ec2-secrets

curl -sS --request POST \
  --url https://api.cursor.com/v0/agents \
  -u "${CURSOR_CLOUD_SERVICE_API_KEY}:" \
  --header 'Content-Type: application/json' \
  --data @- <<EOF
{
  "prompt": {
    "text": "Call mc_self_check via PLX-MC-Hub. Report whether Hub/Portal MCP tools are in the catalog. Do not change code."
  },
  "source": {
    "repository": "https://github.com/petralabx/PLX_MC",
    "ref": "main"
  },
  "mcpServers": [
    {
      "name": "PLX-MC-Hub",
      "type": "http",
      "url": "https://mc.plxcustomer.io/api/cursor/mcp",
      "headers": {
        "x-api-key": "${PLX_MC_MCP_API_KEY}",
        "x-mc-operator-email": "cos@petrasoap.com",
        "x-mc-repo": "petralabx/PLX_MC",
        "x-mc-runtime": "cursor-cloud"
      }
    },
    {
      "name": "PLX-MC-Portal",
      "type": "http",
      "url": "https://mc.plxcustomer.io/api/cursor/mcp",
      "headers": {
        "x-api-key": "${PLX_MC_MCP_API_KEY}",
        "x-mc-operator-email": "cos@petrasoap.com",
        "x-mc-repo": "petralabx/plx-customer-portal",
        "x-mc-runtime": "cursor-cloud"
      }
    }
  ]
}
EOF
```

Adjust the request body fields to match the current
[Cloud Agents API](https://cursor.com/docs/cloud-agent/api/endpoints) schema if
field names differ (`repos` vs `source`, etc.).

## Interim path (no service account yet)

Hydrate `PLX_MC_MCP_API_KEY` from AWS and call REST:

- `GET /api/cursor/self-check`
- `POST /api/cursor/checkout`
- `POST /api/cursor/progress`
- `POST /api/cursor/complete`

See `docs/runbooks/cloud-agent-fleet-wiring.md` and
`docs/runbooks/plx-mc-mcp-team-registration.md`.

## Kill switch

Delete/rotate the service account key in the Cursor dashboard; remove the secret
from `prod/ec2-secrets`. Team MCP entries remain independently disableable.
