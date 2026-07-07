// Registry parser invariants + the committed registry file itself.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { parseVendorRegistry, parseVendorRegistryJson } from "@/lib/vendor-spend";

const VALID = {
  schema_version: "plx-vendor-costs-registry/v1",
  vendors: [
    {
      id: "aws",
      name: "Amazon Web Services",
      category: "cloud",
      adapter: "aws",
      billing: "usage",
    },
  ],
};

describe("parseVendorRegistry", () => {
  it("accepts a valid registry", () => {
    const result = parseVendorRegistry(VALID);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.registry.vendors[0].id).toBe("aws");
  });

  it("rejects a wrong schema_version", () => {
    const result = parseVendorRegistry({ ...VALID, schema_version: "v2" });
    expect(result.ok).toBe(false);
  });

  it("rejects an unknown adapter kind", () => {
    const result = parseVendorRegistry({
      ...VALID,
      vendors: [{ ...VALID.vendors[0], adapter: "stripe" }],
    });
    expect(result.ok).toBe(false);
  });

  it("rejects duplicate vendor ids", () => {
    const result = parseVendorRegistry({
      ...VALID,
      vendors: [VALID.vendors[0], VALID.vendors[0]],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("duplicate");
  });

  it("rejects unparseable JSON without throwing", () => {
    expect(parseVendorRegistryJson("{nope").ok).toBe(false);
  });
});

describe("committed registry (config/vendor-costs-registry.json)", () => {
  const raw = readFileSync(join(process.cwd(), "config/vendor-costs-registry.json"), "utf8");
  const parsed = parseVendorRegistryJson(raw);

  it("is valid", () => {
    expect(parsed.ok).toBe(true);
  });

  it("lists all ten v1 vendors", () => {
    if (!parsed.ok) throw new Error(parsed.error);
    const ids = parsed.registry.vendors.map((v) => v.id).sort();
    expect(ids).toEqual(
      [
        "adobe",
        "anthropic",
        "aws",
        "azure",
        "cursor",
        "docusign",
        "godaddy",
        "google",
        "resend",
        "vercel",
      ].sort()
    );
  });

  it("marks exactly aws, anthropic, cursor as automated", () => {
    if (!parsed.ok) throw new Error(parsed.error);
    const automated = parsed.registry.vendors
      .filter((v) => v.adapter !== "manual")
      .map((v) => v.id)
      .sort();
    expect(automated).toEqual(["anthropic", "aws", "cursor"]);
  });
});
