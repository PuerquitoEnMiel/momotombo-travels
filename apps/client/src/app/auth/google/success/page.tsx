"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/api";

/**
 * Landing page for the Google OAuth redirect.
 * The access token arrives in the URL fragment (never in the query string),
 * is stored immediately and the history entry is scrubbed.
 */
export default function GoogleSuccessPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    // Scrub the fragment from history regardless of the outcome
    window.history.replaceState(null, "", window.location.pathname);

    if (!accessToken) {
      setError(true);
      return;
    }

    setAuthToken(accessToken);
    router.replace("/perfil");
  }, [router]);

  if (error) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">No se pudo iniciar sesión</h1>
        <p className="text-neutral-500">
          El enlace de acceso con Google expiró o es inválido.
        </p>
        <a
          href="/auth/login"
          className="rounded-full bg-neutral-900 px-6 py-3 text-white"
        >
          Volver a iniciar sesión
        </a>
      </main>
    );
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <p className="text-neutral-500">Completando inicio de sesión...</p>
    </main>
  );
}
