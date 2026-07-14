// Shared fail-closed preconditions for routing mutations.

import { createHash } from "node:crypto";
import { ApiError } from "@/lib/api/route";
import { checkRoutingFreshness } from "@/lib/sync";
import * as syncRepo from "@/lib/sync/repo";
import type { AuthorizationTrust } from "../types";

export function routingConfirmEnabled(): boolean {
  return (process.env.PLX_MC_ROUTING_CONFIRM_ENABLED ?? "0").trim() === "1";
}

export function assertConfirmEnabled(): void {
  if (!routingConfirmEnabled()) {
    throw new ApiError(
      "routing_confirm_disabled",
      "Routing confirm/attach/create is disabled (PLX_MC_ROUTING_CONFIRM_ENABLED != 1).",
      503
    );
  }
}

/**
 * Fuzzy / none trust must never authorize mutation — even when a caller
 * stamps it onto an otherwise explicit confirm request.
 */
export function assertMutableTrust(
  authorizationTrust: AuthorizationTrust | undefined | null
): void {
  if (authorizationTrust === "fuzzy" || authorizationTrust === "none") {
    throw new ApiError(
      "fuzzy_cannot_mutate",
      "Fuzzy or empty authorizationTrust cannot invoke routing mutation.",
      403
    );
  }
}

export async function assertRoutingFreshness(): Promise<void> {
  const freshness = await checkRoutingFreshness();
  if (!freshness.ok) {
    throw new ApiError(
      "sync_stale",
      `Inbound sync is stale or incomplete: ${freshness.reasons.join("; ")}`,
      409
    );
  }
}

export async function assertNoOpenConflictsOrErrors(): Promise<void> {
  const [conflicts, errors] = await Promise.all([
    syncRepo.openConflicts(),
    syncRepo.openErrors(),
  ]);
  if (conflicts.length > 0) {
    throw new ApiError(
      "sync_conflict",
      `Unresolved sync conflicts block routing mutation (${conflicts.length} open).`,
      409
    );
  }
  if (errors.length > 0) {
    throw new ApiError(
      "sync_error",
      `Unresolved sync errors block routing mutation (${errors.length} open).`,
      409
    );
  }
}

export function creationIntentHash(input: {
  bucketId: string;
  title: string;
  repos: string[];
  accountableOwnerId: string;
  projectId?: string | null;
}): string {
  const payload = JSON.stringify({
    bucketId: input.bucketId,
    title: input.title.trim(),
    repos: [...input.repos].sort(),
    accountableOwnerId: input.accountableOwnerId,
    projectId: input.projectId ?? null,
  });
  return createHash("sha256").update(payload).digest("hex");
}

export function mintId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
