"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  className?: string;
  showOnlineIndicator?: boolean;
  ringClassName?: string;
}

const sizeMap: Record<AvatarSize, { container: string; text: string; dim: number }> = {
  xs: { container: "w-6 h-6", text: "text-[10px]", dim: 24 },
  sm: { container: "w-8 h-8", text: "text-xs", dim: 32 },
  md: { container: "w-10 h-10", text: "text-sm", dim: 40 },
  lg: { container: "w-12 h-12", text: "text-base", dim: 48 },
  xl: { container: "w-16 h-16", text: "text-lg", dim: 64 },
  "2xl": { container: "w-24 h-24 md:w-32 md:h-32", text: "text-2xl md:text-3xl", dim: 128 },
};

function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "?";
}

export function Avatar({ src, name, size = "md", className, showOnlineIndicator = false, ringClassName }: AvatarProps) {
  const { container, text, dim } = sizeMap[size];
  const initials = getInitials(name);

  return (
    <div className={cn("relative inline-flex shrink-0", container, className)}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={dim}
          height={dim}
          className={cn("w-full h-full rounded-full object-cover", ringClassName)}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold",
            text,
            ringClassName
          )}
          aria-label={name}
        >
          {initials}
        </div>
      )}
      {showOnlineIndicator && (
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-surface-container-lowest"
          aria-label="Online"
        />
      )}
    </div>
  );
}

export function AvatarGroup({ children, max = 4 }: { children: React.ReactNode; max?: number }) {
  const arr = Array.isArray(children) ? children : [children];
  const visible = arr.slice(0, max);
  const extra = arr.length - visible.length;

  return (
    <div className="flex -space-x-2">
      {visible.map((child, i) => (
        <div key={i} className="ring-2 ring-surface-container-lowest rounded-full">
          {child}
        </div>
      ))}
      {extra > 0 && (
        <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold flex items-center justify-center ring-2 ring-surface-container-lowest">
          +{extra}
        </div>
      )}
    </div>
  );
}
