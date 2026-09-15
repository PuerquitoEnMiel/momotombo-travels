"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, Container } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const toast = useToast();

  useEffect(() => {
    toast.error("No pudimos completar la autenticación");
    console.error("Auth error:", error);
  }, [error, toast]);

  return (
    <Container size="sm" className="py-24">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold mb-4 text-on-surface">Error de autenticación</h1>
        <p className="text-on-surface-variant mb-8">
          No pudimos iniciar o completar el proceso de autenticación.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Reintentar</Button>
          <Link href="/auth/login">
            <Button variant="outline">Volver al inicio de sesión</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
