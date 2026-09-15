"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive" | "glass";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-container text-on-primary shadow-sm hover:shadow-md",
  secondary:
    "bg-secondary hover:bg-secondary/90 text-on-secondary shadow-sm hover:shadow-md",
  ghost:
    "bg-transparent hover:bg-surface-container text-on-surface",
  outline:
    "bg-transparent border-2 border-outline hover:border-primary hover:text-primary text-on-surface",
  destructive:
    "bg-danger hover:bg-danger/90 text-on-danger shadow-sm hover:shadow-md",
  glass:
    "bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  xl: "h-14 px-8 text-lg gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    iconLeft,
    iconRight,
    fullWidth = false,
    children,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tracking-wide uppercase",
        "transition-all duration-200 ease-out-expo outline-none",
        "active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
});
