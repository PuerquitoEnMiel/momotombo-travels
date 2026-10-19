import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momotombo.travel";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso y Reservas",
  description:
    "Consulta los términos y condiciones que rigen el uso de Momotombo Travels: reservas, pagos, cancelaciones, itinerarios y responsabilidades del viajero.",
  alternates: {
    canonical: `${SITE_URL}/terminos`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TerminosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
