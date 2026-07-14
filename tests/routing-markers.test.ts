// Routing marker parser contracts — trust classification, malformed/oversized
// rejection, order-preserving dedupe. Never asserts persistence of raw bodies.

import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  MAX_ROUTING_BODY_BYTES,
  hashRoutingBody,
  parseRoutingMarkers,
} from "@/lib/routing/markers";

describe("hashRoutingBody", () => {
  it("returns a stable sha256 hex digest and never echoes the body", () => {
    const body = "MC-Task: TASK-1\nsecret payload";
    const digest = hashRoutingBody(body);
    expect(digest).toBe(createHash("sha256").update(body, "utf8").digest("hex"));
    expect(digest).not.toContain("secret");
    expect(digest).not.toContain("TASK-1");
  });
});

describe("parseRoutingMarkers — happy path", () => {
  it("parses MC-Task, MC-Routing, and migration-era MC-Checkout with correct authority", () => {
    const body = [
      "Summary",
      "MC-Task: TASK-297",
      "MC-Routing: rtx_abc123def456",
      "MC-Checkout: dsp_deadbeef01",
      "footer",
    ].join("\n");

    const result = parseRoutingMarkers(body);
    expect(result.ok).toBe(true);
    expect(result.rejection).toBeUndefined();
    expect(result.bodyContentHash).toBe(hashRoutingBody(body));
    expect(result.taskIds).toEqual(["TASK-297"]);
    expect(result.routingSessionIds).toEqual(["rtx_abc123def456"]);
    expect(result.checkoutIds).toEqual(["dsp_deadbeef01"]);

    expect(result.markers).toEqual([
      {
        kind: "task",
        value: "TASK-297",
        authority: "task_declaration",
      },
      {
        kind: "routing",
        value: "rtx_abc123def456",
        authority: "routing_correlation",
      },
      {
        kind: "checkout",
        value: "dsp_deadbeef01",
        authority: "checkout_credential_reference",
      },
    ]);
  });

  it("deduplicates order-preserving across repeated markers", () => {
    const body = [
      "MC-Checkout: dsp_aaa",
      "MC-Task: TASK-20",
      "MC-Routing: rtx_one",
      "MC-Task: TASK-10",
      "MC-Routing: rtx_two",
      "MC-Routing: rtx_one",
      "MC-Checkout: dsp_bbb",
      "MC-Checkout: dsp_aaa",
    ].join("\n");

    const result = parseRoutingMarkers(body);
    expect(result.ok).toBe(true);
    expect(result.taskIds).toEqual(["TASK-20", "TASK-10"]);
    expect(result.routingSessionIds).toEqual(["rtx_one", "rtx_two"]);
    expect(result.checkoutIds).toEqual(["dsp_aaa", "dsp_bbb"]);
    expect(result.markers.map((m) => m.value)).toEqual([
      "dsp_aaa",
      "TASK-20",
      "rtx_one",
      "TASK-10",
      "rtx_two",
      "dsp_bbb",
    ]);
  });

  it("classifies task/routing as declarations/correlation and checkout as credential reference without validating it", () => {
    // Malformed-looking checkout still parses as a credential *reference*;
    // the parser does not validate expiry, signature, or dispatch ledger.
    const body = "MC-Checkout: dsp_notValidatedByParser\nMC-Task: TASK-1\nMC-Routing: rtx_x";
    const result = parseRoutingMarkers(body);
    expect(result.ok).toBe(true);
    const checkout = result.markers.find((m) => m.kind === "checkout");
    expect(checkout?.authority).toBe("checkout_credential_reference");
    expect(result.markers.find((m) => m.kind === "task")?.authority).toBe("task_declaration");
    expect(result.markers.find((m) => m.kind === "routing")?.authority).toBe(
      "routing_correlation"
    );
  });
});

describe("parseRoutingMarkers — malformed / oversized", () => {
  it("rejects oversized bodies safely without throwing", () => {
    const oversized = "x".repeat(MAX_ROUTING_BODY_BYTES + 1);
    const result = parseRoutingMarkers(oversized);
    expect(result.ok).toBe(false);
    expect(result.rejection).toBe("oversized");
    expect(result.markers).toEqual([]);
    expect(result.taskIds).toEqual([]);
    expect(result.routingSessionIds).toEqual([]);
    expect(result.checkoutIds).toEqual([]);
    expect(result.bodyContentHash).toBe(
      createHash("sha256")
        .update("x".repeat(MAX_ROUTING_BODY_BYTES), "utf8")
        .digest("hex")
    );
  });

  it.each([
    "MC-Task: not-a-task",
    "MC-Task: TASK-",
    "MC-Task: TASK-12oops",
    "MC-Task: TASK-12!",
    "MC-Routing: rtx",
    "MC-Routing: rtx_",
    "MC-Routing: rtx_valid!",
    "MC-Routing: not_rtx_session",
    "MC-Checkout: checkout_without_prefix",
    "MC-Checkout: dsp_",
    "MC-Checkout: dsp_valid.",
    "MC-Task TASK-12",
  ])("fails closed for malformed explicit marker %s", (malformed) => {
    const result = parseRoutingMarkers(`MC-Task: TASK-9\n${malformed}`);
    expect(result.ok).toBe(false);
    expect(result.rejection).toBe("malformed");
    expect(result.taskIds).toEqual([]);
    expect(result.routingSessionIds).toEqual([]);
    expect(result.checkoutIds).toEqual([]);
    expect(result.markers).toEqual([]);
  });

  it("does not persist or return the raw PR body", () => {
    const secret = "TOP-SECRET-BODY-CONTENT";
    const body = `MC-Task: TASK-9\n${secret}`;
    const result = parseRoutingMarkers(body);
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain(secret);
    expect(result).not.toHaveProperty("body");
    expect(result).not.toHaveProperty("rawBody");
  });
});
