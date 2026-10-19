"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { Toaster as SonnerComponent } from "sonner";

type SonnerProps = ComponentProps<typeof SonnerComponent>;

// Sonner is only needed when a toast fires — keep it out of the shared chunk.
const SonnerToaster = dynamic<SonnerProps>(
  () => import("sonner").then((m) => m.Toaster),
  { ssr: false }
);

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
