// AWS adapter — daily unblended cost via Cost Explorer GetCostAndUsage.
// Credentials come from the shared secrets accessor: explicit env keys when
// present, otherwise the SDK's ambient chain (instance role) when the
// AWS_COST_EXPLORER_USE_AMBIENT opt-in is set. Recent days carry the API's
// Estimated flag — surfaced, never treated as closed books.

import { awsCostExplorerConfigured, awsCostExplorerCredentials } from "@/lib/secrets";

import type { AdapterObservation, AdapterPullResult, PeriodRange } from "../types";

import { degraded, type VendorAdapter } from "./contract";

const VENDOR_ID = "aws";

async function pull(range: PeriodRange): Promise<AdapterPullResult> {
  if (!awsCostExplorerConfigured()) {
    return degraded(
      VENDOR_ID,
      "key_missing",
      "AWS credentials are not configured (AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY or AWS_COST_EXPLORER_USE_AMBIENT=1)."
    );
  }

  try {
    // Dynamic import keeps the SDK out of every non-AWS request path.
    const { CostExplorerClient, GetCostAndUsageCommand } = await import(
      "@aws-sdk/client-cost-explorer"
    );
    const creds = awsCostExplorerCredentials();
    const client = new CostExplorerClient(
      creds
        ? {
            region: creds.region,
            credentials: {
              accessKeyId: creds.accessKeyId,
              secretAccessKey: creds.secretAccessKey,
              sessionToken: creds.sessionToken,
            },
          }
        : { region: process.env.AWS_REGION ?? "us-east-1" }
    );

    const observations: AdapterObservation[] = [];
    let nextToken: string | undefined;
    do {
      const resp = await client.send(
        new GetCostAndUsageCommand({
          TimePeriod: { Start: range.start, End: range.end },
          Granularity: "DAILY",
          Metrics: ["UnblendedCost"],
          NextPageToken: nextToken,
        })
      );
      for (const bucket of resp.ResultsByTime ?? []) {
        const amountStr = bucket.Total?.UnblendedCost?.Amount;
        if (!bucket.TimePeriod?.Start || !bucket.TimePeriod?.End || amountStr === undefined) {
          continue;
        }
        observations.push({
          periodStart: bucket.TimePeriod.Start,
          periodEnd: bucket.TimePeriod.End,
          amountCents: Math.round(Number(amountStr) * 100),
          estimated: bucket.Estimated ?? false,
        });
      }
      nextToken = resp.NextPageToken;
    } while (nextToken);

    return { ok: true, vendorId: VENDOR_ID, observations };
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    const message = err instanceof Error ? err.message : String(err);
    if (name === "AccessDeniedException" || name === "UnrecognizedClientException") {
      return degraded(VENDOR_ID, "unauthorized", `Cost Explorer rejected the credentials: ${message}`);
    }
    if (name === "TypeError" || /fetch|network|ENOTFOUND|ECONN/i.test(message)) {
      return degraded(VENDOR_ID, "network_error", `Cost Explorer unreachable: ${message}`);
    }
    return degraded(VENDOR_ID, "http_error", `Cost Explorer call failed: ${message}`);
  }
}

export const awsAdapter: VendorAdapter = {
  vendorId: VENDOR_ID,
  configured: awsCostExplorerConfigured,
  pull,
};
