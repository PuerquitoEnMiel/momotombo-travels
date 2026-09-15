"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  badge?: ReactNode;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  brand?: ReactNode;
  sections: SidebarSection[];
  footer?: ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ brand, sections, footer, className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col bg-surface-container-lowest border-r border-outline-variant/30 h-full", className)}>
      {brand && <div className="p-6 border-b border-outline-variant/30">{brand}</div>}

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto" aria-label="Sidebar">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.title && (
              <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                {section.title}
              </h3>
            )}
            {section.items.map((item) => {
              const isActive = item.active ?? (item.href ? pathname === item.href : false);
              const className = cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out-expo active:scale-[0.97]",
                isActive
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              );

              const content = (
                <>
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && <span>{item.badge}</span>}
                </>
              );

              if (item.href) {
                return (
                  <Link key={item.id} href={item.href} id={item.id} className={className} onClick={onNavigate}>
                    {content}
                  </Link>
                );
              }

              return (
                <button key={item.id} id={item.id} type="button" className={className} onClick={() => { item.onClick?.(); onNavigate?.(); }}>
                  {content}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {footer && <div className="p-4 border-t border-outline-variant/30">{footer}</div>}
    </aside>
  );
}
