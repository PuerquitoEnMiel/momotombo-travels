"use client";

import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function PageHeader({
  title,
  description,
  backHref,
  breadcrumbs,
  actions,
  eyebrow,
  align = "left",
  className,
}: PageHeaderProps) {
  const router = useRouter();
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <header className={cn("flex flex-col gap-4", alignClass, className)}>
      {breadcrumbs}
      {backHref && (
        <button
          type="button"
          onClick={() => (backHref === "-" ? router.back() : router.push(backHref))}
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors self-start"
        >
          <CaretLeft size={14} />
          Volver
        </button>
      )}
      <div className={cn("flex flex-col gap-2 w-full", align === "center" && "items-center")}>
        <div className={cn("flex flex-col md:flex-row md:items-end md:justify-between gap-4 w-full", align === "center" && "md:flex-col md:items-center")}>
          <div className="flex-1">
            {eyebrow && <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{eyebrow}</div>}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-on-surface text-balance">{title}</h1>
            {description && (
              <p className="text-on-surface-variant mt-2 max-w-2xl leading-relaxed text-pretty">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
