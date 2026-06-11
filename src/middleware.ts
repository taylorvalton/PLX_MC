// Staging access gate (SOUL non-negotiable: internal Petra staff only).
// HTTP Basic auth against an operator-held shared secret — the Vercel plan
// cannot SSO-protect custom production domains, and real M365 auth is a
// later increment. Active ONLY when PLX_MC_STAGING_PASSWORD is set (Vercel
// production env); local dev and tests run ungated.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const password = process.env.PLX_MC_STAGING_PASSWORD;
  if (!password) return NextResponse.next();

  const header = req.headers.get("authorization") ?? "";
  if (header === `Basic ${btoa(`plx:${password}`)}`) return NextResponse.next();

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="PLX Mission Control staging"' },
  });
}
