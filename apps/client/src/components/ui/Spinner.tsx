"use client";

import { SpinnerGap } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  return (
    <span role="status" aria-label={label || "Loading"} className={cn("inline-flex", className)}>
      <SpinnerGap size={sizeMap[size]} className="animate-spin" />
      <span className="sr-only">{label || "Loading"}</span>
    </span>
  );
}
