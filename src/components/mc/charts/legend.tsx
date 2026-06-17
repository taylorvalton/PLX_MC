// charts/legend.tsx — the one shared StatusLegend (SPEC §3.B.1): a swatch
// (var(--p-*)) + label + count per status band, sitting beside the donut. When
// `onSlice` is supplied each row is a focusable <button> that drills the same
// click-to-filter path as the donut arc, so the legend is not just decoration —
// it is the keyboard-friendly twin of the arcs. Tokens only.

import type { ChartSlice } from "@/lib/mc-data/insights";

export function StatusLegend({
  slices,
  onSlice,
}: {
  slices: ChartSlice[];
  onSlice?: (slice: ChartSlice) => void;
}) {
  const interactive = !!onSlice;
  return (
    <ul className="clegend">
      {slices.map((slice) => {
        const enabled = interactive && slice.value > 0;
        return (
          <li key={slice.key}>
            <button
              type="button"
              className="row"
              disabled={!enabled}
              aria-label={enabled ? `Filter to ${slice.label} — ${slice.value} tasks` : undefined}
              onClick={enabled ? () => onSlice(slice) : undefined}
            >
              <span className="sw" style={{ background: slice.colorVar }} aria-hidden="true" />
              <span className="nm">{slice.label}</span>
              <span className="ct">{slice.value}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
