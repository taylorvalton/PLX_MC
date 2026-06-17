// charts/bar.tsx — a generic native-SVG horizontal bar list (CategoryBar). ONE
// component, reused for bucket / assignee / priority (SPEC §3.B.4: "three of four
// bars are the same component with different data"). Each row is a focusable
// <button> (native semantics, keyboard-operable) wrapping a label, a native-SVG
// <rect> bar at value/max width, and a right-aligned mono count. The button
// carries the aria-label ("Filter to High priority — 4 tasks"); the SVG bar is
// presentational (aria-hidden) so a screen reader announces the row once, not
// twice. Tokens only — fills are the slice's --p-* colorVar; the track is
// --p-grid. The bar SVG is width="100%" so it reflows in the grid.

import type { CSSProperties } from "react";

import type { ChartSlice } from "@/lib/mc-data/insights";

import { GRID_COLOR_VAR } from "./chart-tokens";

export function CategoryBar({
  title,
  slices,
  onSlice,
}: {
  title: string;
  slices: ChartSlice[];
  onSlice?: (slice: ChartSlice) => void;
}) {
  const interactive = !!onSlice;
  const max = slices.reduce((m, s) => Math.max(m, s.value), 0);
  const summary = `${title}: ${
    slices.length ? slices.map((s) => `${s.value} ${s.label}`).join(", ") : "no data"
  }`;

  return (
    <div className="catbar" role="group" aria-label={summary}>
      <div className="catbar-title">{title}</div>
      {slices.length === 0 ? (
        // Empty list: a hairline placeholder, never a 0-width clickable
        // (SPEC §3.B.4).
        <div className="catbar-empty">
          <span className="rule" />
          <span className="cap">No data</span>
        </div>
      ) : (
        <ul className="catbar-rows">
          {slices.map((slice, i) => {
            // Width as a fraction of max; a zero-value row renders only the
            // track (its button is disabled — never a clickable 0-width bar).
            const frac = max > 0 ? slice.value / max : 0;
            const pct = Math.round(frac * 100);
            // Bucket/assignee bars share one hue and step opacity down the list
            // so they read as a single distribution, not N colors (SPEC §3.B.4).
            const opacity = 1 - Math.min(0.5, i * 0.08);
            const enabled = interactive && slice.value > 0;
            return (
              <li key={slice.key}>
                <button
                  type="button"
                  className="catrow"
                  disabled={!enabled}
                  aria-label={enabled ? `Filter to ${slice.label} — ${slice.value} tasks` : undefined}
                  title={`${slice.label}: ${slice.value}`}
                  onClick={enabled ? () => onSlice(slice) : undefined}
                >
                  <span className="nm">{slice.label}</span>
                  <span className="bar" aria-hidden="true">
                    <svg viewBox="0 0 100 16" width="100%" height="16" preserveAspectRatio="none">
                      <rect className="track" x="0" y="0" width="100" height="16" fill={GRID_COLOR_VAR} rx="2" />
                      {pct > 0 ? (
                        <rect
                          className="fill"
                          x="0"
                          y="0"
                          width={pct}
                          height="16"
                          fill={slice.colorVar}
                          fillOpacity={opacity}
                          rx="2"
                          style={{ "--bar-w": `${pct}` } as CSSProperties}
                        />
                      ) : null}
                    </svg>
                  </span>
                  <span className="ct">{slice.value}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
