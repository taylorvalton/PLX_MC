// In-memory PR-body marker parsing. Raw bodies are never returned for
// persistence — only hashes and extracted marker values.

import { createHash } from "node:crypto";

import type { ParseRoutingMarkersResult, ParsedRoutingMarker } from "./types";

/** Soft cap to reject pathological PR bodies without throwing. */
export const MAX_ROUTING_BODY_BYTES = 256 * 1024;

const MARKER_LIKE_RE = /^\s*MC-(?:Task|Routing|Checkout)/i;
const TASK_LINE_RE = /^\s*MC-Task:\s*(TASK-\d+)\s*$/i;
const ROUTING_LINE_RE = /^\s*MC-Routing:\s*(rtx_[A-Za-z0-9]+)\s*$/i;
const CHECKOUT_LINE_RE = /^\s*MC-Checkout:\s*(dsp_[A-Za-z0-9]+)\s*$/i;

export function hashRoutingBody(body: string): string {
  return createHash("sha256").update(body, "utf8").digest("hex");
}

function hashBytes(value: Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

function rejected(
  bodyContentHash: string,
  rejection: "malformed" | "oversized"
): ParseRoutingMarkersResult {
  return {
    ok: false,
    markers: [],
    taskIds: [],
    routingSessionIds: [],
    checkoutIds: [],
    bodyContentHash,
    rejection,
  };
}

function markerForLine(line: string): ParsedRoutingMarker | null {
  const task = line.match(TASK_LINE_RE);
  if (task?.[1]) {
    return { kind: "task", value: task[1], authority: "task_declaration" };
  }
  const routing = line.match(ROUTING_LINE_RE);
  if (routing?.[1]) {
    return {
      kind: "routing",
      value: routing[1],
      authority: "routing_correlation",
    };
  }
  const checkout = line.match(CHECKOUT_LINE_RE);
  if (checkout?.[1]) {
    return {
      kind: "checkout",
      value: checkout[1],
      authority: "checkout_credential_reference",
    };
  }
  return null;
}

/**
 * Parse author-controlled and migration-era markers from a PR body.
 * Oversized input fails closed before line scanning and hashes only the first
 * MAX_ROUTING_BODY_BYTES UTF-8 bytes. Any explicit MC marker-like line must
 * match its complete token grammar; otherwise the whole parse fails closed
 * with no extracted markers.
 */
export function parseRoutingMarkers(body: string): ParseRoutingMarkersResult {
  const bodyBytes = Buffer.from(body, "utf8");
  const oversized = bodyBytes.byteLength > MAX_ROUTING_BODY_BYTES;
  const bodyContentHash = oversized
    ? hashBytes(bodyBytes.subarray(0, MAX_ROUTING_BODY_BYTES))
    : hashBytes(bodyBytes);

  if (oversized) {
    return rejected(bodyContentHash, "oversized");
  }

  const markers: ParsedRoutingMarker[] = [];
  const seen = new Set<string>();
  for (const line of body.split(/\r?\n/)) {
    if (!MARKER_LIKE_RE.test(line)) continue;
    const marker = markerForLine(line);
    if (!marker) return rejected(bodyContentHash, "malformed");
    const key = `${marker.kind}:${marker.value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    markers.push(marker);
  }

  return {
    ok: true,
    markers,
    taskIds: markers.filter((marker) => marker.kind === "task").map((marker) => marker.value),
    routingSessionIds: markers
      .filter((marker) => marker.kind === "routing")
      .map((marker) => marker.value),
    checkoutIds: markers
      .filter((marker) => marker.kind === "checkout")
      .map((marker) => marker.value),
    bodyContentHash,
  };
}
