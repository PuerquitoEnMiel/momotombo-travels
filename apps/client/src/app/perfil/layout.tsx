import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tu Perfil de Viajero",
  description:
    "Gestiona tu perfil de viajero, preferencias, reservas, itinerarios y actividad de cuenta en Momotombo Travels.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
