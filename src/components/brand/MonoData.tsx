import * as React from "react";

import { cn } from "@/lib/utils/utils";

export type MonoDataProps = React.HTMLAttributes<HTMLSpanElement>;

export function MonoData({ className, ...props }: MonoDataProps) {
  return <span className={cn("p-data", className)} {...props} />;
}
