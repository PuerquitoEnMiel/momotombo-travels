"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  containerClassName?: string;
}

let counter = 0;
const nextId = () => `input-${++counter}`;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, containerClassName, label, helperText, error, iconLeft, iconRight, id, ...props },
  ref
) {
  const inputId = id || nextId();
  const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-on-surface">
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full h-11 rounded-xl border bg-surface-container-lowest text-on-surface text-sm",
            "transition-all duration-200 ease-out-expo outline-none",
            "placeholder:text-on-surface-variant/60",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-outline-variant",
            iconLeft ? "pl-10" : "pl-4",
            iconRight ? "pr-10" : "pr-4",
            className
          )}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            {iconRight}
          </span>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-on-surface-variant">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
