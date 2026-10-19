import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planificador de Viajes",
  description:
    "Diseña tu viaje ideal a Nicaragua: crea itinerarios personalizados con ayuda de inteligencia artificial y reserva actividades.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PlanificarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
