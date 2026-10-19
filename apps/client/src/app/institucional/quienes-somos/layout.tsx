import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momotombo.travel";

export const metadata: Metadata = {
  title: "Quiénes Somos: Expertos en Viajes por Nicaragua",
  description:
    "Somos una agencia nicaragüense apasionada por crear viajes memorables: itinerarios personalizados, guías locales, reservas seguras y experiencias auténticas.",
  alternates: {
    canonical: `${SITE_URL}/institucional/quienes-somos`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Quiénes Somos: Expertos en Viajes por Nicaragua",
    description:
      "Somos una agencia nicaragüense apasionada por crear viajes memorables: itinerarios personalizados, guías locales, reservas seguras y experiencias auténticas.",
    url: `${SITE_URL}/institucional/quienes-somos`,
    type: "website",
  },
};

export default function QuienesSomosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
