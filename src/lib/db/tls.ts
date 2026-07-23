// DB TLS resolution (TASK-623) — certificate verification is ON by default.
// The AWS RDS global CA bundle is vendored at config/certs/ so verify-full
// works without a box-local bundle; overrides cover non-RDS hosts, and the
// explicit PLX_MC_DB_TLS_INSECURE=1 escape hatch restores the legacy
// no-verify behavior (loudly) for break-glass only.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface DbSslConfig {
  rejectUnauthorized: boolean;
  ca?: string;
}

export const RDS_CA_BUNDLE_PATH = join(
  process.cwd(),
  "config",
  "certs",
  "aws-rds-global-bundle.pem"
);

export function resolveDbSsl(
  env: Record<string, string | undefined> = process.env,
  readFile: (path: string) => string = (p) => readFileSync(p, "utf8")
): DbSslConfig {
  if ((env.PLX_MC_DB_TLS_INSECURE ?? "").trim() === "1") {
    console.warn(
      "[db] TLS certificate verification DISABLED (PLX_MC_DB_TLS_INSECURE=1) — break-glass only."
    );
    return { rejectUnauthorized: false };
  }
  const inlineCa = env.PLX_MC_DB_CA_CERT?.trim();
  if (inlineCa) {
    return { rejectUnauthorized: true, ca: inlineCa };
  }
  const caPath = env.PLX_MC_DB_CA_CERT_PATH?.trim() || RDS_CA_BUNDLE_PATH;
  try {
    return { rejectUnauthorized: true, ca: readFile(caPath) };
  } catch (err) {
    // Fail visible, not open: verification stays on against the system trust
    // store. RDS connections will fail loudly until a CA is provided.
    console.error(
      "[db] CA bundle unreadable at %s (%s) — verifying against system trust store.",
      caPath,
      err instanceof Error ? err.message : String(err)
    );
    return { rejectUnauthorized: true };
  }
}
