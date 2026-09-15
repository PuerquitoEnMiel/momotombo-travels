"use client";

import type { ReactNode } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export interface ErrorStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  icon,
  title = "Algo salió mal",
  description = "Intenta nuevamente en unos momentos.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-6", className)} role="alert">
      <div className="w-16 h-16 rounded-full bg-danger-container text-danger flex items-center justify-center mb-4">
        {icon ?? <WarningCircle size={32} weight="duotone" />}
      </div>
      <h3 className="font-serif text-2xl font-bold text-on-surface mb-2 text-balance">{title}</h3>
      <p className="text-on-surface-variant max-w-md mb-6 leading-relaxed text-pretty">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
