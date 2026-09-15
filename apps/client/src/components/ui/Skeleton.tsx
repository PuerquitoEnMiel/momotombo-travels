"use client";

import { cn } from "@/lib/cn";

export type SkeletonVariant = "text" | "circle" | "rect" | "card";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ variant = "rect", className, width, height, lines = 1 }: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-surface-container-high rounded-full animate-pulse"
            style={{ width: i === lines - 1 ? "70%" : "100%" }}
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    const size = width || height || 40;
    return (
      <div
        className={cn("rounded-full bg-surface-container-high animate-pulse shrink-0", className)}
        style={{ width: typeof size === "number" ? `${size}px` : size, height: typeof size === "number" ? `${size}px` : size }}
      />
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 space-y-4", className)}>
        <div className="h-40 bg-surface-container-high rounded-xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-surface-container-high rounded animate-pulse w-3/4" />
          <div className="h-3 bg-surface-container-high rounded animate-pulse w-full" />
          <div className="h-3 bg-surface-container-high rounded animate-pulse w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("rounded-lg bg-surface-container-high animate-pulse", className)}
      style={style}
    />
  );
}
