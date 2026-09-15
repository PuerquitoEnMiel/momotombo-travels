"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={5000}
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-outline-variant/30 shadow-lg",
          title: "font-semibold",
          description: "text-sm text-on-surface-variant",
        },
      }}
    />
  );
}
