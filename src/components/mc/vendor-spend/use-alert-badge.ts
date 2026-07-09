"use client";

// Sidebar badge source: how many vendors are at warn/critical/over budget
// (MTD). One fetch per shell mount; a fetch failure yields 0 — the sidebar
// never blocks on this, and the screen itself shows the loud error state.

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { VendorSpendIndex } from "@/lib/vendor-spend";

import { deriveAttention } from "./helpers";

export function useVendorAlertCount(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    api<VendorSpendIndex>("/vendor-spend?period=mtd")
      .then((index) => {
        if (!cancelled) setCount(deriveAttention(index).alerting);
      })
      .catch(() => {
        /* badge stays 0; the screen surfaces the error loudly */
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return count;
}
