import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: "default" | "muted" | "dark" | "brand";
  spacing?: "sm" | "md" | "lg";
  children?: ReactNode;
}

const backgroundClasses = {
  default: "bg-background",
  muted: "bg-surface-container-low",
  dark: "bg-volcano-black text-nica-white",
  brand: "bg-primary text-on-primary",
};

const spacingClasses = {
  sm: "py-12 md:py-16",
  md: "py-20 md:py-24",
  lg: "py-24 md:py-32",
};

export function Section({ className, background = "default", spacing = "md", children, ...props }: SectionProps) {
  return (
    <section className={cn(backgroundClasses[background], spacingClasses[spacing], className)} {...props}>
      {children}
    </section>
  );
}
