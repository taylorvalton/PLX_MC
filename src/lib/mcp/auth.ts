// MCP cursor API authentication — shared API key authenticates a durable
// service principal. Operator email is allowlisted audit/context only and
// never grants human capabilities.

import { ApiError } from "@/lib/api/route";
import { isAllowedUser } from "@/lib/auth/gate";
import {
  MCP_SERVICE_PRINCIPAL_ID,
  type PermissionActor,
} from "@/lib/permissions";

export { MCP_SERVICE_PRINCIPAL_ID };

export interface McpOperatorContext {
  operatorEmail: string;
  runtime: string;
  workerId: string;
  repo: string;
}

export interface McpIdentity extends McpOperatorContext {
  /** Durable service principal authenticated by the shared MCP API key. */
  servicePrincipalId: typeof MCP_SERVICE_PRINCIPAL_ID;
  /** Authorization actor — always the service principal, never the operator. */
  actor: PermissionActor;
}

function readApiKey(req: Request): string {
  const fromHeader = req.headers.get("x-api-key")?.trim() ?? "";
  if (fromHeader) return fromHeader;
  const auth = req.headers.get("authorization") ?? "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return "";
}

export function expectedMcpApiKey(): string {
  return (process.env.PLX_MC_MCP_API_KEY ?? "").trim();
}

export function mcpEnabled(): boolean {
  return (process.env.PLX_MC_MCP_ENABLED ?? "0").trim() === "1";
}

/** @deprecated Prefer parseOperatorContext — kept for transitional imports. */
export function parseIdentity(req: Request): McpOperatorContext {
  return parseOperatorContext(req);
}

export function parseOperatorContext(req: Request): McpOperatorContext {
  const operatorEmail = (req.headers.get("x-mc-operator-email") ?? "").trim().toLowerCase();
  const runtime = (req.headers.get("x-mc-runtime") ?? "cursor").trim();
  const workerId = (req.headers.get("x-mc-worker-id") ?? "unknown-worker").trim();
  const repo = (req.headers.get("x-mc-repo") ?? "unknown").trim();
  if (!operatorEmail) {
    throw new ApiError("missing_operator", "X-MC-Operator-Email is required.", 401);
  }
  if (!isAllowedUser(operatorEmail)) {
    throw new ApiError("operator_not_allowed", `Operator ${operatorEmail} is not on the PLX MC allowlist.`, 403);
  }
  if (!repo || repo === "unknown") {
    throw new ApiError("missing_repo", "X-MC-Repo is required (e.g. petralabx/PLX_MC).", 400);
  }
  return { operatorEmail, runtime, workerId, repo };
}

/**
 * Resolve the fixed MCP service principal. Async so later phases can load
 * revocation status from durable records without changing the route wrapper.
 */
export async function resolveMcpServicePrincipal(): Promise<PermissionActor> {
  return {
    kind: "service",
    id: MCP_SERVICE_PRINCIPAL_ID,
    status: "active",
  };
}

export async function verifyMcpRequest(req: Request): Promise<McpIdentity> {
  if (!mcpEnabled()) {
    throw new ApiError("mcp_disabled", "PLX MC MCP is disabled (PLX_MC_MCP_ENABLED != 1).", 503);
  }
  const expected = expectedMcpApiKey();
  if (!expected) {
    throw new ApiError("mcp_key_not_configured", "PLX_MC_MCP_API_KEY is not configured on the server.", 503);
  }
  const provided = readApiKey(req);
  if (!provided || provided !== expected) {
    throw new ApiError("invalid_api_key", "Invalid or missing MCP API key.", 401);
  }
  const operator = parseOperatorContext(req);
  const actor = await resolveMcpServicePrincipal();
  return {
    ...operator,
    servicePrincipalId: MCP_SERVICE_PRINCIPAL_ID,
    actor,
  };
}
