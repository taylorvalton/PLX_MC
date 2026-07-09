#!/usr/bin/env bash
# Provision a petralabx org ruleset that requires the compliance gate workflow
# from petralabx/PLX_MC@main (anti-tamper — PR-head workflow edits cannot skip the gate).
#
# Complements per-repo branch protection; does not replace it.
#
# Prerequisites:
#   - GitHub Team (or higher) on petralabx — org rulesets return 403 on Free.
#   - gh authenticated with org admin (GHUB_DGX_SPARK or equivalent).
#   - Hub repo petralabx/PLX_MC exists with .github/workflows/compliance-gate.yml on main.
#
# Usage:
#   unset GITHUB_TOKEN
#   ./scripts/provision-org-ruleset-required-workflows.sh
#   ./scripts/provision-org-ruleset-required-workflows.sh --dry-run
#   ./scripts/provision-org-ruleset-required-workflows.sh --name "PLX required compliance gate"

set -euo pipefail

ORG="petralabx"
HUB_REPO="petralabx/PLX_MC"
WORKFLOW_PATH=".github/workflows/compliance-gate.yml"
RULESET_NAME="PLX required compliance gate"
DRY_RUN=0
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --name) RULESET_NAME="$2"; shift 2 ;;
    --org) ORG="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,16p' "$0"
      exit 0
      ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

# Fail closed if the org cannot use rulesets (Free plan).
if ! gh api "orgs/${ORG}/rulesets" >/dev/null 2>&1; then
  echo "ERROR: cannot list org rulesets for ${ORG}." >&2
  echo "GitHub Team (or higher) is required. API response:" >&2
  gh api "orgs/${ORG}/rulesets" 2>&1 | head -8 >&2 || true
  exit 1
fi

mapfile -t TARGET_REPOS < <(
  python3 - <<PY
import json
from pathlib import Path
reg = json.loads(Path("${ROOT}/config/tracked-repos-registry.json").read_text())
for r in reg["repos"]:
    if r.get("status") == "active" and r["repo"].startswith("petralabx/"):
        print(r["repo"].split("/", 1)[1])
PY
)

if [[ ${#TARGET_REPOS[@]} -eq 0 ]]; then
  echo "ERROR: no active petralabx repos in tracked-repos-registry.json" >&2
  exit 1
fi

HUB_ID=$(gh api "repos/${HUB_REPO}" --jq .id)
includes_json=$(python3 -c "import json,sys; print(json.dumps(sys.argv[1:]))" "${TARGET_REPOS[@]}")

payload=$(
  HUB_ID="$HUB_ID" RULESET_NAME="$RULESET_NAME" WORKFLOW_PATH="$WORKFLOW_PATH" \
  INCLUDES="$includes_json" python3 - <<'PY'
import json, os
includes = json.loads(os.environ["INCLUDES"])
print(json.dumps({
  "name": os.environ["RULESET_NAME"],
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {"include": ["~DEFAULT_BRANCH"], "exclude": []},
    "repository_name": {"include": includes, "exclude": [], "protected": False},
  },
  "rules": [{
    "type": "workflows",
    "parameters": {
      "workflows": [{
        "path": os.environ["WORKFLOW_PATH"],
        "repository_id": int(os.environ["HUB_ID"]),
        "ref": "refs/heads/main",
      }]
    }
  }],
  "bypass_actors": [],
}))
PY
)

echo "Org: $ORG"
echo "Hub: $HUB_REPO (id=$HUB_ID)"
echo "Workflow: $WORKFLOW_PATH @ refs/heads/main"
echo "Repos: ${TARGET_REPOS[*]}"
echo "Ruleset: $RULESET_NAME"

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "[dry-run] would POST orgs/${ORG}/rulesets with:"
  echo "$payload" | python3 -m json.tool
  exit 0
fi

existing_id=$(gh api "orgs/${ORG}/rulesets" --jq ".[] | select(.name==\"${RULESET_NAME}\") | .id" | head -1 || true)
if [[ -n "${existing_id}" ]]; then
  echo "Updating ruleset id=$existing_id"
  echo "$payload" | gh api "orgs/${ORG}/rulesets/${existing_id}" -X PUT --input -
else
  echo "Creating ruleset"
  echo "$payload" | gh api "orgs/${ORG}/rulesets" -X POST --input -
fi
echo "OK: org ruleset provisioned"
