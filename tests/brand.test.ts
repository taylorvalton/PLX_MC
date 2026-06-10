// Canary: the brand barrel and its primitives stay importable.
import { describe, expect, it } from "vitest";

import * as brand from "../src/components/brand";

describe("brand barrel", () => {
  it("exports the ADR-003 primitives", () => {
    for (const name of ["BrandBoundary", "Kicker", "MonoData", "PMark"]) {
      expect(brand, `missing export: ${name}`).toHaveProperty(name);
      expect(typeof brand[name as keyof typeof brand]).toBe("function");
    }
  });
});
