"use client";

// AI Spend screen — company-wide vendor subscription and API cost observatory
// (sidebar: System of record → AI Spend). Overview table with period filter
// and budget alerts; per-vendor detail with budget editor, manual snapshot
// entry, and refresh audit. Automated pulls: AWS / Anthropic / Cursor; a
// vendor with a missing admin key shows as DEGRADED, never as $0 spend.

import { useCallback, useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { SpendPeriod, VendorSpendDetail, VendorSpendIndex } from "@/lib/vendor-spend";

import { deriveAttention, PERIOD_LABELS } from "./helpers";
import { DetailView, OverviewView } from "./views";

export function AiSpendView() {
  const [period, setPeriod] = useState<SpendPeriod>("mtd");
  const [index, setIndex] = useState<VendorSpendIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<VendorSpendDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [refreshNote, setRefreshNote] = useState<string | null>(null);

  // setState only ever runs inside promise continuations — never in the
  // synchronous body of an effect (react-hooks/set-state-in-effect).
  const loadIndex = useCallback(
    (p: SpendPeriod): Promise<void> =>
      api<VendorSpendIndex>(`/vendor-spend?period=${p}`)
        .then((data) => {
          setIndex(data);
          setError(null);
        })
        .catch((err: Error) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        }),
    []
  );

  const loadDetail = useCallback(
    (vendorId: string, p: SpendPeriod): Promise<void> =>
      api<VendorSpendDetail>(`/vendor-spend/${encodeURIComponent(vendorId)}?period=${p}`)
        .then((data) => {
          setDetail(data);
          setDetailError(null);
        })
        .catch((err: Error) => {
          setDetailError(err.message);
        })
        .finally(() => {
          setDetailLoading(false);
        }),
    []
  );

  // Initial fetch only — period/selection changes re-fetch from their event
  // handlers.
  useEffect(() => {
    void loadIndex("mtd");
  }, [loadIndex]);

  function handlePeriod(p: SpendPeriod) {
    setPeriod(p);
    setLoading(true);
    void loadIndex(p);
    if (selectedId) {
      setDetailLoading(true);
      void loadDetail(selectedId, p);
    }
  }

  function handleSelect(vendorId: string) {
    setSelectedId(vendorId);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    void loadDetail(vendorId, period);
  }

  // Re-fetch both surfaces after any mutation (budget, snapshot, refresh).
  const reload = useCallback(async () => {
    await loadIndex(period);
    if (selectedId) await loadDetail(selectedId, period);
  }, [loadIndex, loadDetail, period, selectedId]);

  async function handleRefresh() {
    setRefreshing(true);
    setRefreshNote(null);
    try {
      const result = await api<{ outcomes: { status: string }[] }>("/vendor-spend/refresh", {
        method: "POST",
        body: JSON.stringify({ period: "ytd" }),
      });
      const degraded = result.outcomes.filter((o) => o.status !== "ok").length;
      setRefreshNote(
        degraded === 0
          ? "Refresh complete — all automated vendors pulled."
          : `Refresh complete — ${degraded} adapter(s) degraded (see vendor rows).`
      );
      await reload();
    } catch (err) {
      setRefreshNote(`Refresh failed: ${(err as Error).message}`);
    } finally {
      setRefreshing(false);
    }
  }

  const attention = index ? deriveAttention(index) : null;

  return (
    <div className="mc-main" data-testid="ai-spend-screen">
      <div className="ph">
        <div>
          <span className="kk">System of record · {PERIOD_LABELS[period]}</span>
          <h1>
            AI <em>spend</em>
          </h1>
          <p className="sub">
            Company-wide subscription and API cost tracking for AI and platform vendors —
            budgets, proactive warnings, and honest adapter health across AWS, Anthropic,
            Cursor, and more.
          </p>
        </div>
        <div className="r r-gap-2">
          {attention && attention.alerting > 0 && (
            <span className="vs-pill hot">{attention.alerting} alerting</span>
          )}
          {attention && attention.degraded > 0 && (
            <span className="vs-pill warn">{attention.degraded} degraded</span>
          )}
          <button
            type="button"
            className="vs-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing…" : "↻ Refresh from APIs"}
          </button>
        </div>
      </div>

      {refreshNote && (
        <div className="vs-note" role="status">
          {refreshNote}
        </div>
      )}

      {loading && (
        <div className="vs-loading" aria-label="Loading vendor spend">
          Loading vendor spend…
        </div>
      )}
      {!loading && error && (
        <div className="vs-err" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && index && !selectedId && (
        <OverviewView
          index={index}
          period={period}
          onPeriod={handlePeriod}
          onSelect={handleSelect}
        />
      )}

      {selectedId && (
        <>
          {detailLoading && (
            <div className="vs-loading" aria-label="Loading vendor detail">
              Loading vendor detail…
            </div>
          )}
          {!detailLoading && detailError && (
            <div className="vs-err" role="alert">
              {detailError}
            </div>
          )}
          {!detailLoading && !detailError && detail && (
            <DetailView
              detail={detail}
              period={period}
              onBack={() => {
                setSelectedId(null);
                setDetail(null);
                setDetailError(null);
              }}
              onMutated={reload}
            />
          )}
        </>
      )}
    </div>
  );
}
