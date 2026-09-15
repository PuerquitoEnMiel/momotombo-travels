"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  responsive?: boolean;
  children?: ReactNode;
}

const colsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const gapMap = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4 md:gap-6",
  lg: "gap-6 md:gap-8",
  xl: "gap-8 md:gap-12",
};

export function Grid({ cols = 3, gap = "md", responsive = true, className, children, ...props }: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        responsive ? "grid-cols-1" : colsMap[cols],
        responsive && `sm:${colsMap[cols]}`,
        gapMap[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
