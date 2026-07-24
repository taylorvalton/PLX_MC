import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * PLX status chip tones (PATTERN-REGISTRY §1, ADR-003/ADR-004).
 *
 * - Fills are 12% color-mix of the base status token; text uses the dedicated
 *   `--p-*-text` shades so every tone holds WCAG AA 4.5:1 on brand surfaces
 *   (CONTRAST-FINDINGS-2026-06-19 remediation pattern).
 * - `ink` is the solid-ink chip reserved for the top of the severity ramp
 *   (Critical/Blocker) — the only chip allowed a solid fill.
 * - `accent` is spent on exactly one lifecycle state: Ready-for-UAT /
 *   retest-queue (ADR-004). Do not use it for other chip meanings.
 */
export type BrandStatusTone =
  | "neutral"
  | "ok"
  | "warn"
  | "info"
  | "hot"
  | "accent"
  | "ink";

const TONE_CLASSES: Record<BrandStatusTone, string> = {
  // chassis base already renders the neutral chip (bg-secondary hairline).
  neutral: "",
  ok: "bg-[color-mix(in_srgb,var(--p-ok)_12%,transparent)] text-[var(--p-ok-text)] border-[var(--p-grid)]",
  warn: "bg-[color-mix(in_srgb,var(--p-warn)_12%,transparent)] text-[var(--p-warn-text)] border-[var(--p-grid)]",
  info: "bg-[color-mix(in_srgb,var(--p-info)_12%,transparent)] text-[var(--p-info-text)] border-[var(--p-grid)]",
  hot: "bg-[color-mix(in_srgb,var(--p-hot)_12%,transparent)] text-[var(--p-hot-text)] border-[var(--p-grid)]",
  accent:
    "bg-[color-mix(in_srgb,var(--p-accent)_12%,transparent)] text-[var(--p-accent)] border-[var(--p-grid)] dark:text-[var(--p-accent)]",
  ink: "bg-[var(--p-ink)] text-[var(--p-paper)] border-transparent",
};

export interface BrandStatusBadgeProps extends ComponentProps<"span"> {
  tone?: BrandStatusTone;
}

/**
 * Token-toned status chip on the shadcn `Badge variant="chassis"` base
 * (square 3px corners, 10px mono uppercase). Color is never the sole signal —
 * the chip always carries its label text.
 */
export function BrandStatusBadge({
  tone = "neutral",
  className,
  children,
  ...props
}: BrandStatusBadgeProps) {
  return (
    <Badge
      variant="chassis"
      data-tone={tone}
      className={cn(TONE_CLASSES[tone], className)}
      {...props}
    >
      {children}
    </Badge>
  );
}
