// Pure identity record builders + active/revoked predicates.
// DB hydration stays behind the enforcement flag (see auth/identity.ts).

import {
  MCP_SERVICE_PRINCIPAL_ID,
  type AccessRole,
  type ActorStatus,
  type GithubIdentityRecord,
  type McUserRecord,
  type ServicePrincipalRecord,
} from "./types";

let userSeq = 0;

export function buildMcUserRecord(input: {
  entraOid: string;
  email: string;
  accessRole: AccessRole;
  displayName?: string;
  status?: ActorStatus;
  id?: string;
}): McUserRecord {
  userSeq += 1;
  return {
    id: input.id ?? `usr_${userSeq}`,
    entraOid: input.entraOid,
    email: input.email.trim().toLowerCase(),
    displayName: input.displayName,
    accessRole: input.accessRole,
    status: input.status ?? "active",
  };
}

export function buildGithubIdentityRecord(input: {
  githubUserId: number;
  mcUserId: string;
  githubLogin: string;
  verifiedAt?: string;
  revokedAt?: string | null;
}): GithubIdentityRecord {
  return {
    githubUserId: input.githubUserId,
    mcUserId: input.mcUserId,
    githubLogin: input.githubLogin,
    verifiedAt: input.verifiedAt ?? new Date().toISOString(),
    revokedAt: input.revokedAt === undefined ? null : input.revokedAt,
  };
}

export function buildServicePrincipalRecord(input: {
  id: string;
  name: string;
  status?: ActorStatus;
}): ServicePrincipalRecord {
  return {
    id: input.id,
    name: input.name,
    status: input.status ?? "active",
  };
}

export function isMcUserActive(user: McUserRecord): boolean {
  return user.status === "active";
}

export function isGithubIdentityActive(link: GithubIdentityRecord): boolean {
  return link.revokedAt == null;
}

export function isServicePrincipalActive(sp: ServicePrincipalRecord): boolean {
  return sp.status === "active";
}

export { MCP_SERVICE_PRINCIPAL_ID };
