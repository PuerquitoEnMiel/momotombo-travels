import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momotombo.travel";

export const metadata: Metadata = {
  title: "Política de Privacidad y Protección de Datos",
  description:
    "Conoce cómo Momotombo Travels recopila, protege y utiliza tus datos personales al planificar viajes, crear itinerarios y realizar reservas en Nicaragua.",
  alternates: {
    canonical: `${SITE_URL}/privacidad`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
