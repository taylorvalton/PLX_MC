// Entra OID propagation through JWT/session identity helpers.

import { describe, expect, it, vi } from "vitest";

import {
  extractEntraOid,
  permissionsEnforcementEnabled,
  toSessionIdentity,
} from "@/lib/auth/identity";

describe("extractEntraOid", () => {
  it("prefers the Entra oid claim over sub", () => {
    expect(
      extractEntraOid({
        oid: "11111111-2222-3333-4444-555555555555",
        sub: "should-not-win",
        email: "vince@petrasoap.com",
      })
    ).toBe("11111111-2222-3333-4444-555555555555");
  });

  it("returns null when oid is missing", () => {
    expect(extractEntraOid({ sub: "only-sub", email: "vince@petrasoap.com" })).toBeNull();
    expect(extractEntraOid(null)).toBeNull();
  });
});

describe("toSessionIdentity", () => {
  it("carries oid + email into the session user shape", () => {
    expect(
      toSessionIdentity({
        oid: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        email: "Vince@PetraSoap.com",
      })
    ).toEqual({
      oid: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      email: "vince@petrasoap.com",
    });
  });

  it("omits oid when absent so dormant mode stays usable", () => {
    expect(toSessionIdentity({ email: "vince@petrasoap.com" })).toEqual({
      oid: undefined,
      email: "vince@petrasoap.com",
    });
  });
});

describe("permissionsEnforcementEnabled", () => {
  it("defaults off so local dev/build need no DB identity hydration", () => {
    vi.stubEnv("PLX_MC_PERMISSIONS_ENFORCEMENT_ENABLED", "");
    expect(permissionsEnforcementEnabled()).toBe(false);
    vi.stubEnv("PLX_MC_PERMISSIONS_ENFORCEMENT_ENABLED", "0");
    expect(permissionsEnforcementEnabled()).toBe(false);
    vi.stubEnv("PLX_MC_PERMISSIONS_ENFORCEMENT_ENABLED", "1");
    expect(permissionsEnforcementEnabled()).toBe(true);
    vi.unstubAllEnvs();
  });
});
