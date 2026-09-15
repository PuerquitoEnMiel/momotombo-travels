"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    iconLeft?: ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: "py-8",
    md: "py-16",
    lg: "py-24",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center text-center px-6", sizeClasses[size], className)}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-on-surface-variant">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-2xl font-bold text-on-surface mb-2 text-balance">{title}</h3>
      {description && (
        <p className="text-on-surface-variant max-w-md mb-6 leading-relaxed text-pretty">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button onClick={action.onClick} iconLeft={action.iconLeft}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
