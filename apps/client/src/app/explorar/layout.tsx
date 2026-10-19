import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momotombo.travel";

export const metadata: Metadata = {
  title: "Explora Destinos Únicos y Rutas por Nicaragua",
  description:
    "Explora volcanes, playas del Pacífico, islas y ciudades coloniales de Nicaragua. Compara destinos, actividades y experiencias curadas por expertos locales.",
  alternates: {
    canonical: `${SITE_URL}/explorar`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Explora Destinos Únicos y Rutas por Nicaragua",
    description:
      "Explora volcanes, playas del Pacífico, islas y ciudades coloniales de Nicaragua. Compara destinos, actividades y experiencias curadas por expertos locales.",
    url: `${SITE_URL}/explorar`,
    type: "website",
  },
};

export default function ExplorarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
