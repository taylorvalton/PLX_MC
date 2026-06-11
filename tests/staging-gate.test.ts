// The staging gate's invariants: dormant without the secret, 401 without
// (or with wrong) credentials, pass-through with the right ones.

import { afterEach, describe, expect, it } from "vitest";
import { middleware } from "@/middleware";

const req = (auth?: string) =>
  new Request("http://test/", { headers: auth ? { authorization: auth } : {} }) as never;

afterEach(() => {
  delete process.env.PLX_MC_STAGING_PASSWORD;
});

describe("staging gate", () => {
  it("is dormant when PLX_MC_STAGING_PASSWORD is unset (local dev)", () => {
    const res = middleware(req());
    expect(res.status).toBe(200);
  });

  it("challenges requests without credentials", () => {
    process.env.PLX_MC_STAGING_PASSWORD = "s3cret";
    const res = middleware(req());
    expect(res.status).toBe(401);
    expect(res.headers.get("WWW-Authenticate")).toContain("Basic");
  });

  it("rejects wrong credentials and accepts the right ones", () => {
    process.env.PLX_MC_STAGING_PASSWORD = "s3cret";
    expect(middleware(req(`Basic ${btoa("plx:wrong")}`)).status).toBe(401);
    expect(middleware(req(`Basic ${btoa("plx:s3cret")}`)).status).toBe(200);
  });
});
