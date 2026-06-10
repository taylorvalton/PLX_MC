import * as React from "react";

import { cn } from "@/lib/utils/utils";

export type PMarkProps = React.HTMLAttributes<HTMLSpanElement> & {
  num: string;
  sym: string;
  label?: string;
  size?: "sm" | "md";
};

export function PMark({
  className,
  label,
  num,
  size = "md",
  sym,
  ...props
}: PMarkProps) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn(
        "inline-flex flex-col items-start border border-[var(--p-ink)] leading-none text-[var(--p-ink)]",
        size === "sm" ? "min-w-8 px-1.5 py-1" : "min-w-9 px-2 py-1.5",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "p-mono mb-1 text-[var(--p-muted)]",
          size === "sm" ? "text-[7px]" : "text-[8px]"
        )}
      >
        {num}
      </span>
      <span
        className={cn(
          "p-serif tracking-[-0.01em]",
          size === "sm" ? "text-sm" : "text-lg"
        )}
      >
        {sym}
      </span>
    </span>
  );
}
