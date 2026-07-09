#!/usr/bin/env node
// Vendor-spend bootstrap — trigger a YTD API backfill for the automated
// vendors (AWS / Anthropic / Cursor) through the deployed app's refresh
// endpoint, so all adapter logic stays in the one domain module
// (src/lib/vendor-spend) instead of being re-implemented here.
//
// Env:  PLX_MC_BASE_URL   app origin (default http://localhost:3000)
//       PLX_MC_SEED_AUTH  optional "user:password" for the Basic-auth staging gate
// Usage: node scripts/seed-vendor-spend.mjs [--dry-run] [--period mtd|weekly|quarterly|ytd]
// Exit codes: 0 — refresh ran (degraded vendors reported, not fatal),
//             1 — endpoint unreachable or returned an error envelope.

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const periodIdx = args.indexOf("--period");
const period = periodIdx >= 0 ? args[periodIdx + 1] : "ytd";
const VALID_PERIODS = ["mtd", "weekly", "quarterly", "ytd"];

async function main() {
  if (!VALID_PERIODS.includes(period)) {
    console.error(`invalid --period "${period}" (expected ${VALID_PERIODS.join("|")})`);
    return 1;
  }

  const base = (process.env.PLX_MC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const url = `${base}/api/vendor-spend/refresh`;

  if (dryRun) {
    console.log(`dry-run: would POST ${url} with { period: "${period}" }`);
    console.log("dry-run: automated vendors are pulled via their adapters; vendors with");
    console.log("dry-run: missing admin keys are logged as degraded (visible, never fabricated).");
    return 0;
  }

  const headers = { "content-type": "application/json" };
  if (process.env.PLX_MC_SEED_AUTH) {
    headers.authorization = `Basic ${Buffer.from(process.env.PLX_MC_SEED_AUTH).toString("base64")}`;
  }

  let resp;
  try {
    resp = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ period }),
    });
  } catch (err) {
    console.error(`refresh endpoint unreachable (${url}): ${err.message}`);
    console.error("start the app (npm run dev) or set PLX_MC_BASE_URL.");
    return 1;
  }

  const body = await resp.json().catch(() => null);
  if (!resp.ok || !body?.data) {
    console.error(`refresh failed: HTTP ${resp.status} — ${JSON.stringify(body?.error ?? body)}`);
    return 1;
  }

  for (const outcome of body.data.outcomes ?? []) {
    const detail = outcome.message ? ` — ${outcome.message}` : ` — ${outcome.snapshotCount} snapshot(s)`;
    console.log(`${outcome.status.padEnd(8)} ${outcome.vendorId}${detail}`);
  }
  console.log("seed complete. Degraded vendors need their admin keys added to AWS Secrets Manager (prod/ec2-secrets).");
  return 0;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(`seed failed: ${err.message}`);
    process.exit(1);
  }
);
