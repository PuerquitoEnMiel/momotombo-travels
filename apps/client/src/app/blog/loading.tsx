import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center gap-3 pt-24"
      role="status"
      aria-live="polite"
      aria-label="Cargando artículo"
    >
      <Spinner size="lg" />
    </div>
  );
}
