// Session / MCP actor derivation for routing + Task mutations.
// Never trust caller-supplied actor fields for authorization.

import { ApiError } from "@/lib/api/route";
import {
  auth,
  hydrateMcUserByOid,
  permissionActorFromMcUser,
  permissionsEnforcementEnabled,
} from "@/lib/auth";
import {
  authorize,
  type Capability,
  type PermissionActor,
  type PermissionContext,
  type PermissionResource,
} from "@/lib/permissions";
import type { McpIdentity } from "@/lib/mcp/auth";

export interface AuthorizedActor {
  actor: PermissionActor;
  /** Entra oid for humans; service principal id for services. */
  actorId: string;
  actorKind: "human" | "service";
  /** Display / audit label (email or service id) — never used as grant input. */
  auditLabel: string;
}

/** Session-authenticated human actor for Task / routing mutations. */
export async function requireSessionActor(
  capability: Capability,
  resource?: PermissionResource,
  context?: PermissionContext
): Promise<AuthorizedActor> {
  let session: { user?: { oid?: string | null; email?: string | null } } | null;
  try {
    session = (await auth()) as {
      user?: { oid?: string | null; email?: string | null };
    } | null;
  } catch {
    throw new ApiError(
      "forbidden",
      "Authenticated session with Entra oid required.",
      403
    );
  }
  const oid = session?.user?.oid?.trim();
  if (!oid) {
    throw new ApiError(
      "forbidden",
      "Authenticated session with Entra oid required.",
      403
    );
  }

  let actor: PermissionActor | null = null;
  if (permissionsEnforcementEnabled()) {
    const user = await hydrateMcUserByOid(oid);
    if (!user) {
      throw new ApiError("forbidden", "No MC identity for session oid.", 403);
    }
    actor = permissionActorFromMcUser(user);
  } else {
    actor = { kind: "human", id: oid, role: "admin", status: "active" };
  }

  const decision = authorize({ actor, capability, resource, context });
  if (!decision.allowed) {
    throw new ApiError(
      "forbidden",
      `${capability} denied (${decision.reasonCode}).`,
      403
    );
  }

  return {
    actor,
    actorId: oid,
    actorKind: "human",
    auditLabel: session?.user?.email?.trim().toLowerCase() || oid,
  };
}

/** Durable MCP service principal — operator email is audit context only. */
export function requireMcpActor(
  identity: McpIdentity,
  capability: Capability,
  resource?: PermissionResource,
  context?: PermissionContext
): AuthorizedActor {
  const decision = authorize({
    actor: identity.actor,
    capability,
    resource,
    context,
  });
  if (!decision.allowed) {
    throw new ApiError(
      "forbidden",
      `${capability} denied (${decision.reasonCode}).`,
      403
    );
  }
  return {
    actor: identity.actor,
    actorId: identity.actor.id,
    actorKind: "service",
    auditLabel: identity.operatorEmail,
  };
}

export function requireAuthorizedActor(
  authorized: AuthorizedActor,
  capability: Capability,
  resource?: PermissionResource,
  context?: PermissionContext
): void {
  const decision = authorize({
    actor: authorized.actor,
    capability,
    resource,
    context,
  });
  if (!decision.allowed) {
    throw new ApiError(
      "forbidden",
      `${capability} denied (${decision.reasonCode}).`,
      403
    );
  }
}
