import * as React from "react";

import { cn } from "@/lib/utils/utils";

export type KickerProps = React.HTMLAttributes<HTMLSpanElement>;

export function Kicker({ className, ...props }: KickerProps) {
  return <span className={cn("p-kicker", className)} {...props} />;
}
