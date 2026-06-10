import { describe, expect, it } from "vitest";

import { filterPaletteGroups, type PaletteGroup, type PaletteItem } from "@/components/mc/command-palette";
import { decideInviteOffer } from "@/components/mc/people-picker";

describe("filterPaletteGroups", () => {
  const groups: PaletteGroup<PaletteItem>[] = [
    {
      title: "Create",
      items: [
        { key: "new-task", icon: "+", label: "New task", hint: "create" },
        { key: "draft-prd", icon: "✎", label: "Draft PRD with Scribe", hint: "agent" },
      ],
    },
    {
      title: "Navigate",
      items: [{ key: "board", icon: "▦", label: "Go to Board", hint: "screen" }],
    },
  ];

  it("matches query substrings on label text", () => {
    const filtered = filterPaletteGroups(groups, "board");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Navigate");
    expect(filtered[0].items.map((item) => item.key)).toEqual(["board"]);
  });

  it("matches query substrings on hint text", () => {
    const filtered = filterPaletteGroups(groups, "agent");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Create");
    expect(filtered[0].items.map((item) => item.key)).toEqual(["draft-prd"]);
  });

  it("prunes empty groups", () => {
    const filtered = filterPaletteGroups(groups, "new task");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Create");
    expect(filtered[0].items.map((item) => item.key)).toEqual(["new-task"]);
  });
});

describe("decideInviteOffer", () => {
  it("offers invite for unknown valid Petra email", () => {
    const decision = decideInviteOffer("new.person@petralabx.com", false);
    expect(decision.showInvite).toBe(true);
    expect(decision.blockedExternalDomain).toBe(false);
  });

  it("does not offer invite for known Petra email", () => {
    const decision = decideInviteOffer("maya.aldosari@petralabx.com", true);
    expect(decision.showInvite).toBe(false);
    expect(decision.blockedExternalDomain).toBe(false);
  });

  it("blocks foreign domains", () => {
    const decision = decideInviteOffer("someone@gmail.com", false);
    expect(decision.showInvite).toBe(false);
    expect(decision.blockedExternalDomain).toBe(true);
  });
});
