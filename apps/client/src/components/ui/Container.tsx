import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: boolean;
}

const sizeMap = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-none",
};

export function Container({ className, size = "lg", padding = true, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full", sizeMap[size], padding && "px-4 md:px-6", className)}
      {...props}
    />
  );
}
