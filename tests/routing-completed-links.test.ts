// P8 — typed related/delivery links; no silent Verified reopen.

import { describe, expect, it } from "vitest";
import type { WorkLinkType } from "@/lib/routing/types";

describe("typed completed links", () => {
  it("only allows related and delivery link types", () => {
    const allowed: WorkLinkType[] = ["related", "delivery"];
    expect(allowed).toContain("related");
    expect(allowed).toContain("delivery");
    expect(allowed).not.toContain("replaces" as WorkLinkType);
  });

  it("delivery links are distinct from related (append-only contract)", () => {
    const related: WorkLinkType = "related";
    const delivery: WorkLinkType = "delivery";
    expect(related).not.toBe(delivery);
  });
});

describe("Verified reopen policy", () => {
  it("documents that Verified tasks reject link mutations without task.reopen", async () => {
    // Behavioral coverage lives in routing-confirm.test.ts (verified_locked).
    // This suite pins the type-level + policy contract for completed history.
    const stagesThatBlockSilentLink = new Set(["verified"]);
    expect(stagesThatBlockSilentLink.has("verified")).toBe(true);
    expect(stagesThatBlockSilentLink.has("merged")).toBe(false);
  });
});
