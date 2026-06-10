import * as React from "react";

import { cn } from "@/lib/utils/utils";

export type BrandBoundaryProps = React.HTMLAttributes<HTMLDivElement>;

export function BrandBoundary({ className, ...props }: BrandBoundaryProps) {
  return <div className={cn("brand-plx", className)} {...props} />;
}
