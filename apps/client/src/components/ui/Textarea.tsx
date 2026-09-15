"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

let counter = 0;
const nextId = () => `textarea-${++counter}`;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, containerClassName, label, helperText, error, id, rows = 4, ...props },
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
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full rounded-xl border bg-surface-container-lowest text-on-surface text-sm p-4 resize-none",
          "transition-all duration-200 ease-out-expo outline-none",
          "placeholder:text-on-surface-variant/60",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-outline-variant",
          className
        )}
        {...props}
      />
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
