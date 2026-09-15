import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <Spinner size="xl" />
      <p className="text-on-surface-variant animate-pulse text-sm">Cargando...</p>
    </div>
  );
}
