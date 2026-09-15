"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";

export default function AuthForgotPasswordError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const toast = useToast();

  useEffect(() => {
    toast.error("No pudimos procesar la solicitud de recuperación");
    console.error("Forgot password error:", error);
  }, [error, toast]);

  return (
    <div className="text-center py-12">
      <h1 className="font-serif text-3xl font-bold mb-4 text-on-surface">Error</h1>
      <p className="text-on-surface-variant mb-8">No pudimos procesar tu solicitud. Intenta de nuevo.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={reset} className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-semibold">
          Reintentar
        </button>
        <Link href="/auth/login" className="border border-outline-variant px-6 py-2.5 rounded-full font-semibold text-on-surface">
          Volver
        </Link>
      </div>
    </div>
  );
}
