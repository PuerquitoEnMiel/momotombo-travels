"use client";

import Link from "next/link";
import { CaretRight, House } from "@phosphor-icons/react";
import { Fragment } from "react";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumbs({ items, showHome = true, className }: BreadcrumbsProps) {
  const allItems = showHome ? [{ label: "Inicio", href: "/" }, ...items] : items;

  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs text-on-surface-variant", className)}>
      <ol className="flex items-center flex-wrap gap-1.5">
        {allItems.map((item, idx) => {
          const isLast = idx === allItems.length - 1;
          return (
            <Fragment key={`${item.label}-${idx}`}>
              <li className="flex items-center gap-1.5">
                {idx === 0 && showHome ? <House size={12} weight="fill" /> : null}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={cn(isLast && "text-on-surface font-semibold")} aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="text-outline">
                  <CaretRight size={10} />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
