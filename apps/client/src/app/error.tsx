"use client";

import { useEffect } from "react";
import { Button, Container } from "@/components/ui";
import { WarningOctagon } from "@phosphor-icons/react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof console !== "undefined") {
      console.error("App error boundary caught:", error);
    }
  }, [error]);

  return (
    <Container size="md" className="py-24">
      <div className="text-center" role="alert">
        <div className="w-20 h-20 bg-danger-container text-danger rounded-full flex items-center justify-center mx-auto mb-6">
          <WarningOctagon size={40} weight="duotone" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-on-surface mb-3 text-balance">
          Algo salió mal
        </h1>
        <p className="text-on-surface-variant mb-8 max-w-md mx-auto text-pretty">
          Ocurrió un error inesperado. Nuestro equipo ha sido notificado. Por favor intenta nuevamente.
        </p>
        {error.digest && (
          <p className="text-xs text-on-surface-variant/60 mb-6 font-mono">
            ID del error: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="primary">
            Reintentar
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="outline">
            Ir al inicio
          </Button>
        </div>
      </div>
    </Container>
  );
}
