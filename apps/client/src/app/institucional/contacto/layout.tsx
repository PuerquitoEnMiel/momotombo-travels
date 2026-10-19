import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto y Atención al Viajero",
  description:
    "Escríbenos para resolver tus dudas sobre tours, destinos, itinerarios y reservas en Nicaragua. El equipo de Momotombo Travels está listo para ayudarte.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
