// TASK-623 — DB TLS: certificate verification is on by default; the vendored
// RDS CA bundle backs verify; insecure mode is an explicit break-glass flag.

import { describe, expect, it } from "vitest";

import { resolveDbSsl, RDS_CA_BUNDLE_PATH } from "@/lib/db/tls";

describe("resolveDbSsl", () => {
  it("defaults to verification against the vendored RDS CA bundle", () => {
    const ssl = resolveDbSsl({});
    expect(ssl.rejectUnauthorized).toBe(true);
    expect(ssl.ca).toContain("BEGIN CERTIFICATE");
  });

  it("the vendored bundle exists in the repo", () => {
    const ssl = resolveDbSsl({}, (path) => {
      expect(path).toBe(RDS_CA_BUNDLE_PATH);
      return "BEGIN CERTIFICATE stub";
    });
    expect(ssl.ca).toBe("BEGIN CERTIFICATE stub");
  });

  it("an inline CA env overrides the bundle", () => {
    const ssl = resolveDbSsl({ PLX_MC_DB_CA_CERT: "inline-pem" });
    expect(ssl).toEqual({ rejectUnauthorized: true, ca: "inline-pem" });
  });

  it("a CA path env is honored", () => {
    const ssl = resolveDbSsl({ PLX_MC_DB_CA_CERT_PATH: "/etc/custom-ca.pem" }, (path) => {
      expect(path).toBe("/etc/custom-ca.pem");
      return "custom-pem";
    });
    expect(ssl).toEqual({ rejectUnauthorized: true, ca: "custom-pem" });
  });

  it("an unreadable CA keeps verification ON against system trust (fail visible, not open)", () => {
    const ssl = resolveDbSsl({ PLX_MC_DB_CA_CERT_PATH: "/missing.pem" }, () => {
      throw new Error("ENOENT");
    });
    expect(ssl).toEqual({ rejectUnauthorized: true });
  });

  it("insecure mode requires the explicit break-glass flag", () => {
    expect(resolveDbSsl({ PLX_MC_DB_TLS_INSECURE: "1" })).toEqual({
      rejectUnauthorized: false,
    });
    expect(resolveDbSsl({ PLX_MC_DB_TLS_INSECURE: "0" }).rejectUnauthorized).toBe(true);
  });
});
