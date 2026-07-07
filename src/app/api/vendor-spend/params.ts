// Shared query-param parsing for the vendor-spend routes (not a route file).

import { ApiError } from "@/lib/api/route";
import type { SpendPeriod } from "@/lib/vendor-spend";
import { SPEND_PERIODS } from "@/lib/vendor-spend";

export function parsePeriodParam(url: string): SpendPeriod {
  const raw = new URL(url).searchParams.get("period") ?? "mtd";
  if (!(SPEND_PERIODS as string[]).includes(raw)) {
    throw new ApiError("invalid_period", `period must be one of ${SPEND_PERIODS.join(", ")}.`);
  }
  return raw as SpendPeriod;
}
