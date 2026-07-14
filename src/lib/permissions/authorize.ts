// Deterministic deny-by-default authorization kernel.

import { capabilitiesForRole, capabilitiesForServicePrincipal } from "./grants";
import { evaluateContext } from "./predicates";
import {
  CAPABILITIES,
  POLICY_VERSION,
  type AuthorizeDecision,
  type AuthorizeInput,
  type Capability,
  type PermissionActor,
} from "./types";

const CAPABILITY_SET = new Set<string>(CAPABILITIES);

export function isCapability(value: string): value is Capability {
  return CAPABILITY_SET.has(value);
}

function isValidActor(actor: PermissionActor | null | undefined): actor is PermissionActor {
  if (!actor || typeof actor !== "object") return false;
  if (actor.kind !== "human" && actor.kind !== "service") return false;
  if (typeof actor.id !== "string" || actor.id.trim() === "") return false;
  if (actor.status !== "active" && actor.status !== "revoked") return false;
  if (actor.kind === "human") {
    return actor.role === "owner" || actor.role === "admin" || actor.role === "member";
  }
  return true;
}

function grantedCapabilities(actor: PermissionActor): ReadonlySet<Capability> {
  if (actor.kind === "human") {
    return new Set(capabilitiesForRole(actor.role));
  }
  return new Set(capabilitiesForServicePrincipal(actor.id));
}

function deny(reasonCode: AuthorizeDecision["reasonCode"]): AuthorizeDecision {
  return { allowed: false, reasonCode, policyVersion: POLICY_VERSION };
}

export function authorize(input: AuthorizeInput): AuthorizeDecision {
  const { actor, capability } = input;

  if (!isValidActor(actor)) {
    return deny("unknown_actor");
  }
  if (actor.status === "revoked") {
    return deny("actor_revoked");
  }
  if (!isCapability(capability)) {
    return deny("unknown_capability");
  }

  const grants = grantedCapabilities(actor);
  if (!grants.has(capability)) {
    return deny("capability_not_granted");
  }

  const contextDenial = evaluateContext(actor, input);
  if (contextDenial) {
    return deny(contextDenial);
  }

  return { allowed: true, reasonCode: "allowed", policyVersion: POLICY_VERSION };
}
