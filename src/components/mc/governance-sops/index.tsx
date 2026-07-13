"use client";

// MC-SOP-Guide screen — a read-only governance-doctrine lens.
// Wired into the MC shell as Screen "governance-sops" (System of record group).
// Index ↔ detail; the repo markdown is the source, MC is the lens (no mutation).
// Deep link: `/?screen=governance-sops&sop=<slug>` opens the detail view.

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { SopDetailResult, SopSummaryRow } from "@/lib/governance-sops";

import type { ScreenProps } from "../route";
import { DetailView, IndexView } from "./views";

export function GovernanceSopsView({ route, nav }: ScreenProps) {
  const slug = route.sop?.trim() ?? "";
  const view = slug ? "detail" : "index";

  const [rows, setRows] = useState<SopSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [detail, setDetail] = useState<SopDetailResult | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<SopSummaryRow[]>("/governance-sops")
      .then((data) => {
        if (cancelled) return;
        setRows(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load detail when the `sop` query param is present (deep link + in-app select).
  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    // Defer setState so the effect does not synchronously cascade renders
    // (react-hooks/set-state-in-effect).
    const kick = window.setTimeout(() => {
      if (cancelled) return;
      setDetailLoading(true);
      setDetailError(null);
      setDetail(null);
      api<SopDetailResult>("/governance-sops/" + encodeURIComponent(slug))
        .then((data) => {
          if (cancelled) return;
          setDetail(data);
        })
        .catch((err: Error) => {
          if (cancelled) return;
          setDetailError(err.message);
        })
        .finally(() => {
          if (!cancelled) setDetailLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(kick);
    };
  }, [slug]);

  function handleSelect(row: SopSummaryRow) {
    nav("governance-sops", { sop: row.meta.slug });
  }

  function handleBack() {
    nav("governance-sops");
  }

  return (
    <div className="mc-main" data-testid="gs-screen">
      {view === "index" && (
        <>
          <div className="ph">
            <div>
              <span className="kk">System of record · doctrine</span>
              <h1>SOP guide</h1>
              <p className="sub">
                Operator-facing governance doctrine — compliance gates, PR discipline, audit
                mirrors, repo hygiene. Read-only; the repo markdown is the source of record.
              </p>
            </div>
            <div className="r r-gap-2">
              <span className="gs-pill doctrine">doctrine</span>
              <span className="gs-pill ro">READ-ONLY</span>
            </div>
          </div>

          {loading && (
            <div className="gs-loading" aria-label="Loading SOPs">
              Loading SOPs…
            </div>
          )}
          {error && (
            <div className="gs-err" role="alert">
              {error}
            </div>
          )}
          {!loading && !error && <IndexView rows={rows} onSelect={handleSelect} />}
        </>
      )}

      {view === "detail" && (
        <>
          {detailLoading && (
            <div className="gs-loading" aria-label="Loading SOP">
              Loading SOP…
            </div>
          )}
          {detailError && (
            <>
              <button type="button" className="gs-back" onClick={handleBack}>
                ← Back to index
              </button>
              <div className="gs-err" role="alert">
                {detailError}
              </div>
            </>
          )}
          {!detailLoading && detail && !detailError && (
            <DetailView result={detail} onBack={handleBack} />
          )}
        </>
      )}
    </div>
  );
}
