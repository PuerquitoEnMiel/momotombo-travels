"use client";

import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export interface TagProps {
  children: React.ReactNode;
  onDismiss?: () => void;
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export function Tag({ children, onDismiss, variant = "default", className }: TagProps) {
  const variantClasses = {
    default: "bg-surface-container text-on-surface",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
        variantClasses[variant],
        className
      )}
    >
      {children}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="hover:opacity-70 transition-opacity"
          aria-label="Quitar"
        >
          <X size={12} weight="bold" />
        </button>
      )}
    </span>
  );
}
