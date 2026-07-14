// MCP auth — shared API key authenticates a durable service principal;
// operator email is allowlisted audit context only (no human capability grant).

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.stubEnv("PLX_MC_MCP_ENABLED", "1");
vi.stubEnv("PLX_MC_MCP_API_KEY", "test-mcp-key");
vi.stubEnv("PLX_MC_ALLOWED_USERS", "vince@petrasoap.com");

import { ApiError } from "@/lib/api/route";
import { authorize } from "@/lib/permissions";
import {
  MCP_SERVICE_PRINCIPAL_ID,
  parseOperatorContext,
  verifyMcpRequest,
} from "@/lib/mcp/auth";

function req(headers: Record<string, string>): Request {
  return new Request("http://localhost/api/cursor/self-check", { headers });
}

describe("MCP service principal auth", () => {
  beforeEach(() => {
    vi.stubEnv("PLX_MC_MCP_ENABLED", "1");
    vi.stubEnv("PLX_MC_MCP_API_KEY", "test-mcp-key");
    vi.stubEnv("PLX_MC_ALLOWED_USERS", "vince@petrasoap.com");
  });

  it("resolves the durable MCP service principal from a valid API key", async () => {
    const identity = await verifyMcpRequest(
      req({
        "x-api-key": "test-mcp-key",
        "x-mc-operator-email": "vince@petrasoap.com",
        "x-mc-repo": "petralabx/PLX_MC",
        "x-mc-runtime": "cursor",
        "x-mc-worker-id": "w1",
      })
    );
    expect(identity.servicePrincipalId).toBe(MCP_SERVICE_PRINCIPAL_ID);
    expect(identity.actor.kind).toBe("service");
    expect(identity.actor.id).toBe(MCP_SERVICE_PRINCIPAL_ID);
    expect(identity.operatorEmail).toBe("vince@petrasoap.com");
  });

  it("keeps operator email as context only — does not grant human capabilities", async () => {
    const identity = await verifyMcpRequest(
      req({
        "x-api-key": "test-mcp-key",
        "x-mc-operator-email": "vince@petrasoap.com",
        "x-mc-repo": "petralabx/PLX_MC",
      })
    );
    // Owner email on the allowlist must not escalate the service actor.
    expect(authorize({ actor: identity.actor, capability: "permissions.manage" }).allowed).toBe(
      false
    );
    expect(authorize({ actor: identity.actor, capability: "repo.approve" }).allowed).toBe(false);
    expect(authorize({ actor: identity.actor, capability: "task.create" }).allowed).toBe(false);
    expect(authorize({ actor: identity.actor, capability: "routing.suggest" }).allowed).toBe(true);
  });

  it("still validates allowlisted operator context", () => {
    expect(() =>
      parseOperatorContext(
        req({
          "x-mc-operator-email": "outsider@example.com",
          "x-mc-repo": "petralabx/PLX_MC",
        })
      )
    ).toThrow(ApiError);
  });

  it("rejects invalid api keys before operator parsing grants anything", async () => {
    await expect(
      verifyMcpRequest(
        req({
          "x-api-key": "wrong",
          "x-mc-operator-email": "vince@petrasoap.com",
          "x-mc-repo": "petralabx/PLX_MC",
        })
      )
    ).rejects.toBeInstanceOf(ApiError);
  });
});
