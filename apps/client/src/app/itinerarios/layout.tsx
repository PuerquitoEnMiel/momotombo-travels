import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tus Itinerarios de Viaje",
  description:
    "Revisa, edita y comparte tus itinerarios de viaje por Nicaragua generados con Momotombo Travels.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ItinerariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
