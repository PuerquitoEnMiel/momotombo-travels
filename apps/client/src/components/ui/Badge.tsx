"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-container text-on-surface",
  primary: "bg-primary/10 text-primary border border-primary/20",
  secondary: "bg-secondary/10 text-secondary border border-secondary/20",
  success: "bg-success-container text-on-success-container border border-success/20",
  warning: "bg-warning-container text-on-warning-container border border-warning/20",
  danger: "bg-danger-container text-on-danger-container border border-danger/20",
  info: "bg-info-container text-on-info-container border border-info/20",
  outline: "bg-transparent border border-outline text-on-surface-variant",
};

export function Badge({ variant = "default", size = "sm", className, iconLeft, iconRight, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full whitespace-nowrap",
        size === "sm" ? "px-2.5 py-0.5 text-xs gap-1" : "px-3 py-1 text-sm gap-1.5",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </span>
  );
}
