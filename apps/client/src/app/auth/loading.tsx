import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
      aria-label="Verificando sesión"
    >
      <Spinner size="lg" />
    </div>
  );
}
