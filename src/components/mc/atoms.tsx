// Mission Control shared atoms. Presentational; consume the .mc skin classes
// from src/styles/mc-app.css. Ported from docs/product/prototype/mc-atoms.jsx.
import type { CSSProperties } from "react";

import { ACTORS, confidenceOf } from "@/lib/mc-data";
import type { Task } from "@/lib/mc-data";

type AvatarSize = "sm" | "lg" | "xl";

export function Avatar({
  id,
  size,
  lead,
  title,
}: {
  id: string;
  size?: AvatarSize;
  lead?: boolean;
  title?: string;
}) {
  const a = ACTORS[id];
  if (!a) return null;
  const cls = ["av", a.kind, size, lead ? "lead" : ""].filter(Boolean).join(" ");
  const hover =
    title ?? (a.kind === "agent" ? `${a.name} · ${a.model} agent` : a.name);
  return (
    <span className={cls} title={hover}>
      {a.init}
    </span>
  );
}

// Periodic-table-style PLX glyph (matches the .mc .pm skin and the prototype).
export function PMark({ acc, lg }: { acc?: boolean; lg?: boolean }) {
  const cls = ["pm", lg ? "lg" : "", acc ? "acc" : ""].filter(Boolean).join(" ");
  return (
    <span className={cls} aria-label="PLX">
      <span className="num">14</span>
      <span className="sym">Px</span>
    </span>
  );
}

// One quiet read: ready / building / gap / blocked, with an optional label.
export function Confidence({ task, showLabel = true }: { task: Task; showLabel?: boolean }) {
  const c = confidenceOf(task);
  const ringStyle = { "--pct": `${c.pct}%` } as CSSProperties;
  return (
    <span className={`conf ${c.state}`} title={`Confidence · ${c.label}`}>
      <span className="ring" style={ringStyle} />
      {showLabel && <span>{c.label}</span>}
    </span>
  );
}
